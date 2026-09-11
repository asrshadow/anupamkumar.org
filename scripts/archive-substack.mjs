// ============================================================
// ARCHIVE SUBSTACK POSTS INTO THIS REPOSITORY
//
// WHAT THIS DOES
// Reads the public RSS feed of the Substack newsletter, converts
// each post to a Markdown file, and saves it in content/external/.
// The site then shows those posts alongside everything else, with
// a link back to the original.
//
// WHY IT EXISTS
// So that wherever the writing happens, it always ends up as a
// plain text file in this repository. Substack is a writing
// surface and a mailing list. It is never the archive. If it
// disappeared in 2031 the subscriber relationship would be lost —
// annoying — but not one word of the writing.
//
// WHY IT ONLY READS RSS
// Substack has no official publishing API. Every wrapper you will
// find is either reverse-engineered from their private endpoints
// or a paid relay, and both break without warning. This script
// depends on nothing but a public feed, and even that is optional:
// IF THE FEED CANNOT BE REACHED, THIS SCRIPT DOES NOTHING AND
// EXITS SUCCESSFULLY, so a Substack outage can never stop the site
// from building.
//
// HOW TO RUN IT
//   npm run archive-substack
// It prints what it found and what it wrote. Running it twice is
// safe: existing files are never touched.
//
// WHAT IT READS AND WRITES
//   Reads:  the RSS feed at the address below
//   Writes: content/external/DD-MM-YYYY-slug.md
// ============================================================

import { writeFile, readdir, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

// ============================================================
// SETTINGS
// ============================================================

// The newsletter's public feed.
//
// WARNING, AND THIS MATTERS: anupamkumar.substack.com is a
// DIFFERENT PERSON — a tech policy researcher with a similar
// name. Pointing this at that address would publish somebody
// else's writing under this site's name. The correct address is
// the one below.
const FEED_URL = "https://asranupam.substack.com/feed";

// Where the archived copies are written.
const OUTPUT_DIRECTORY = "content/external";

// How long to wait for the feed before giving up, in milliseconds.
const TIMEOUT_MS = 20000;

// ============================================================
// STEP 1 — Small helpers for reading the feed
//
// RSS is XML. Rather than adding a dependency to parse it, these
// few functions pull out the handful of fields needed. A feed is
// a simple, stable shape, so this is enough.
// ============================================================

/**
 * Pull the contents of one XML tag out of a block of text.
 * Handles both plain text and the CDATA form Substack uses.
 */
function readTag(xml, tagName) {
  // Match <tag ...>anything</tag>, including across line breaks.
  const pattern = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)</${tagName}>`, "i");
  const found = xml.match(pattern);
  if (!found) return "";

  let value = found[1].trim();

  // Substack wraps most fields in <![CDATA[ ... ]]>, which is XML's
  // way of saying "treat everything inside as plain text".
  const cdata = value.match(/^<!\[CDATA\[([\s\S]*?)\]\]>$/);
  if (cdata) value = cdata[1];

  return value.trim();
}

/** Split the feed into its individual <item> blocks, one per post. */
function splitIntoItems(xml) {
  const items = xml.match(/<item[\s\S]*?<\/item>/gi);
  return items ?? [];
}

/**
 * Turn HTML escapes back into real characters.
 *
 * Feeds carry two kinds. Named ones like &amp; and &quot;, and
 * numbered ones like &#8217; for a curly apostrophe and &#8212;
 * for an em dash. Substack uses the numbered form heavily, so
 * leaving them out would litter every archived post with codes
 * like &#8212; in the middle of sentences.
 */
function unescapeHtml(text) {
  let result = text;

  // The named ones that actually appear in practice.
  const named = {
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&apos;": "'",
    "&nbsp;": " ",
    "&ndash;": "–",
    "&mdash;": "—",
    "&lsquo;": "‘",
    "&rsquo;": "’",
    "&ldquo;": "“",
    "&rdquo;": "”",
    "&hellip;": "…",
  };

  for (const [code, character] of Object.entries(named)) {
    result = result.split(code).join(character);
  }

  // Numbered ones, in decimal: &#8217;
  result = result.replace(/&#(\d+);/g, (whole, number) => {
    const code = Number(number);
    return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : whole;
  });

  // Numbered ones, in hexadecimal: &#x2019;
  result = result.replace(/&#x([0-9a-f]+);/gi, (whole, hex) => {
    const code = parseInt(hex, 16);
    return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : whole;
  });

  // &amp; is done LAST. Doing it first would turn "&amp;lt;" into
  // "&lt;" and then into "<", which is not what the feed said.
  result = result.split("&amp;").join("&");

  return result;
}

// ============================================================
// STEP 2 — Turn a post's HTML into Markdown
//
// This handles the tags Substack actually produces. It is
// deliberately simple rather than complete: anything it does not
// recognise has its tags stripped and its text kept, so no words
// are ever lost even when the formatting is.
// ============================================================

function htmlToMarkdown(html) {
  let text = html;

  // Remove things that carry no text at all.
  text = text.replace(/<script[\s\S]*?<\/script>/gi, "");
  text = text.replace(/<style[\s\S]*?<\/style>/gi, "");
  text = text.replace(/<!--[\s\S]*?-->/g, "");

  // Substack decorates each image with its own toolbar: buttons
  // holding inline SVG icons. None of it is content, and the shapes
  // inside those icons are tags like <line> and <path> that would
  // otherwise be mistaken for real markup further down.
  text = text.replace(/<svg[\s\S]*?<\/svg>/gi, "");
  text = text.replace(/<button[\s\S]*?<\/button>/gi, "");

  // NOTE ON EVERY PATTERN BELOW: each tag name is followed by \b,
  // which means "the tag name ends here". Without it, a pattern for
  // <li> also matches <line>, and a pattern for <b> also matches
  // <blockquote>. That is not hypothetical — it is the bug that put
  // a stray dash in the middle of the first archived post.

  // Headings. Substack rarely goes below level three.
  text = text.replace(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi, "\n\n# $1\n\n");
  text = text.replace(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi, "\n\n## $1\n\n");
  text = text.replace(/<h3\b[^>]*>([\s\S]*?)<\/h3>/gi, "\n\n### $1\n\n");
  text = text.replace(/<h4\b[^>]*>([\s\S]*?)<\/h4>/gi, "\n\n#### $1\n\n");

  // Emphasis. Done before links, so emphasis inside a link survives.
  text = text.replace(/<(strong|b)\b[^>]*>([\s\S]*?)<\/\1>/gi, "**$2**");
  text = text.replace(/<(em|i)\b[^>]*>([\s\S]*?)<\/\1>/gi, "*$2*");

  // IMAGES BEFORE LINKS, and this order matters.
  //
  // Substack wraps every image in a link to a larger copy, and puts
  // the caption in a list item beside it. Handling links first
  // turned that whole block into one broken link containing a stray
  // dash. Converting the image first means the anchor around it is
  // recognisable in the step after this one.
  text = text.replace(
    /<img\b[^>]*\salt=["']([^"']*)["'][^>]*\ssrc=["']([^"']*)["'][^>]*\/?>/gi,
    "![$1]($2)",
  );
  text = text.replace(/<img\b[^>]*\ssrc=["']([^"']*)["'][^>]*\/?>/gi, "![]($1)");

  // <source> offers the browser alternative sizes of the image just
  // converted. It duplicates what is already there, so it goes.
  text = text.replace(/<source\b[^>]*\/?>/gi, "");

  // Links, keeping both the words and the address.
  //
  // When a link contains nothing but an image, the link is dropped
  // and the image kept. Substack links every image to a full-size
  // copy of itself, which adds nothing for a reader and produces
  // unreadable Markdown.
  text = text.replace(
    /<a\b[^>]*\shref=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi,
    (whole, href, inner) => {
      // What is left once every image and every remaining tag is
      // taken out? If there are no actual words, this link wrapped
      // an image and nothing else.
      const withoutImages = inner.replace(/!\[[^\]]*\]\([^)]*\)/g, "");
      const withoutTags = withoutImages.replace(/<[^>]+>/g, "");
      const hasRealText = /[a-z0-9]/i.test(withoutTags);

      const images = inner.match(/!\[[^\]]*\]\([^)]*\)/g);

      if (images && !hasRealText) {
        return `\n\n${images.join("\n\n")}\n\n`;
      }

      return `[${inner}](${href})`;
    },
  );

  // Block quotes.
  text = text.replace(
    /<blockquote\b[^>]*>([\s\S]*?)<\/blockquote>/gi,
    "\n\n> $1\n\n",
  );

  // Lists. Both kinds become dashes: a numbered list read from a
  // feed rarely keeps its numbering meaningfully anyway. An item
  // with nothing in it is dropped rather than becoming a lone dash.
  text = text.replace(/<li\b[^>]*>([\s\S]*?)<\/li>/gi, (whole, inner) => {
    const content = inner.replace(/<[^>]+>/g, "").trim();
    return content.length > 0 ? `\n- ${inner}` : "";
  });
  text = text.replace(/<\/?(ul|ol)\b[^>]*>/gi, "\n\n");

  // Code.
  text = text.replace(/<pre\b[^>]*>([\s\S]*?)<\/pre>/gi, "\n\n```\n$1\n```\n\n");
  text = text.replace(/<code\b[^>]*>([\s\S]*?)<\/code>/gi, "`$1`");

  // Paragraphs, line breaks and horizontal rules.
  text = text.replace(/<\/p>/gi, "\n\n");
  text = text.replace(/<br\b[^>]*\/?>/gi, "\n");
  text = text.replace(/<hr\b[^>]*\/?>/gi, "\n\n---\n\n");

  // Anything left over: drop the tag, keep the words.
  text = text.replace(/<[^>]+>/g, "");

  text = unescapeHtml(text);

  // Tidy the spacing. Three or more blank lines become one blank
  // line, and trailing spaces at the end of a line are removed.
  text = text.replace(/[ \t]+$/gm, "");
  text = text.replace(/\n{3,}/g, "\n\n");

  return text.trim();
}

// ============================================================
// STEP 3 — Build the filename and the frontmatter
// ============================================================

/**
 * Turn a title into the slug part of a filename.
 * "The GST compensation cliff" becomes "the-gst-compensation-cliff".
 */
function slugify(title) {
  return title
    .toLowerCase()
    .normalize("NFKD") // separates accents from their letters
    .replace(/[̀-ͯ]/g, "") // removes the accents
    .replace(/[^a-z0-9]+/g, "-") // anything else becomes a dash
    .replace(/^-+|-+$/g, "") // no dash at either end
    .slice(0, 60) // keep filenames a sensible length
    .replace(/-+$/g, ""); // in case the cut left a trailing dash
}

/** The DD-MM-YYYY prefix used by every filename in this repository. */
function filenameDate(date) {
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();
  return `${day}-${month}-${year}`;
}

/** The ISO date that goes inside the file, because software reads it. */
function isoDate(date) {
  return date.toISOString().slice(0, 10);
}

/**
 * Escape a value so it is safe inside double quotes in YAML.
 * A stray quote mark in a title would otherwise break the build.
 */
function yamlQuote(value) {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

/**
 * Write a one-sentence description when the post has none of its
 * own, by taking the opening of the text and cutting it at a
 * sentence end rather than mid-word.
 */
function makeDescription(markdown, fallbackTitle) {
  const firstParagraph = markdown
    .split("\n\n")
    .map((block) => block.trim())
    .find((block) => {
      // Long enough to be a real sentence rather than a caption.
      if (block.length <= 60) return false;

      // Skip anything that is not running prose: headings, images,
      // links, list items and quotes all make poor descriptions.
      if (/^[#!\[\->|*]/.test(block)) return false;

      // Skip Substack's own subscribe prompt, which it inserts into
      // the middle of a post and which describes nothing.
      if (/Thanks for reading|Subscribe (now|for free)/i.test(block)) {
        return false;
      }

      return true;
    });

  if (!firstParagraph) return fallbackTitle;

  // Strip any Markdown marks so the description is plain text.
  const plain = firstParagraph
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[*_`>]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (plain.length <= 180) return plain;

  const cut = plain.slice(0, 180);
  const lastStop = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("? "));
  if (lastStop > 80) return cut.slice(0, lastStop + 1);

  return cut.slice(0, cut.lastIndexOf(" ")) + "…";
}

// ============================================================
// STEP 4 — The main routine
// ============================================================

async function main() {
  console.log(`Reading the Substack feed at ${FEED_URL}`);

  // ---- Fetch the feed ----------------------------------------
  // Everything from here to the end of the try block is allowed to
  // fail without failing the build. That is the whole point: no
  // part of this site may depend on Substack being reachable.
  let feedText;

  try {
    const response = await fetch(FEED_URL, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { "User-Agent": "anupamkumar.org archiver" },
    });

    if (!response.ok) {
      console.log(`The feed answered with status ${response.status}. Nothing was written.`);
      console.log("This is not an error. The site will build normally.");
      return;
    }

    feedText = await response.text();
  } catch (error) {
    console.log(`Could not reach the feed: ${error.message}`);
    console.log("Nothing was written. This is not an error — the site will build normally.");
    return;
  }

  // ---- Split it into posts -----------------------------------
  const items = splitIntoItems(feedText);
  console.log(`Found ${items.length} posts in the feed`);

  if (items.length === 0) {
    console.log("Nothing to do.");
    return;
  }

  // ---- Make sure the output folder exists ---------------------
  if (!existsSync(OUTPUT_DIRECTORY)) {
    await mkdir(OUTPUT_DIRECTORY, { recursive: true });
  }

  // ---- Work out what has already been archived ----------------
  // A post is identified by the slug part of its filename, with the
  // date prefix removed. That way a post is never written twice
  // even if its publication date is reported differently.
  const existingFiles = await readdir(OUTPUT_DIRECTORY);
  const existingSlugs = new Set(
    existingFiles
      .filter((name) => name.endsWith(".md"))
      .map((name) => name.replace(/\.md$/, "").replace(/^\d{2}-\d{2}-\d{4}-/, "")),
  );

  let written = 0;
  let skipped = 0;

  // ---- Write each new post ------------------------------------
  for (const item of items) {
    const title = unescapeHtml(readTag(item, "title"));
    const link = readTag(item, "link");
    const pubDateText = readTag(item, "pubDate");

    if (!title || !link) {
      console.log("Skipping a post with no title or no link.");
      continue;
    }

    const slug = slugify(title);
    if (!slug) {
      console.log(`Skipping "${title}" — its title produced no usable filename.`);
      continue;
    }

    // NEVER overwrite. A file already here may have been corrected
    // or moved by hand, and this script must not undo that.
    if (existingSlugs.has(slug)) {
      skipped += 1;
      continue;
    }

    const publishedDate = pubDateText ? new Date(pubDateText) : new Date();
    if (Number.isNaN(publishedDate.getTime())) {
      console.log(`Skipping "${title}" — its date could not be read.`);
      continue;
    }

    // The full post body. Substack puts it in content:encoded, and
    // falls back to description for older or shorter posts.
    const bodyHtml =
      readTag(item, "content:encoded") || readTag(item, "description") || "";

    const markdown = htmlToMarkdown(bodyHtml);

    if (markdown.length < 20) {
      console.log(`Skipping "${title}" — the feed carried no usable text for it.`);
      continue;
    }

    const description = makeDescription(markdown, title);

    // The frontmatter block. canonical is "substack" because that
    // is where the post was actually published, and search engines
    // must treat this copy as the archive rather than a competitor.
    const frontmatter = [
      "---",
      `title: "${yamlQuote(title)}"`,
      `description: "${yamlQuote(description)}"`,
      `date: ${isoDate(publishedDate)}`,
      'canonical: "substack"',
      `substackUrl: "${link}"`,
      "tags: []",
      "draft: false",
      "---",
      "",
      "<!-- This file was written automatically from the Substack RSS feed.",
      "     Do not edit it by hand: the archiver would not notice, and the",
      "     change would be lost if the file were ever regenerated. To",
      "     correct something, fix it in Substack and delete this file. -->",
      "",
    ].join("\n");

    const fileName = `${filenameDate(publishedDate)}-${slug}.md`;
    const filePath = path.join(OUTPUT_DIRECTORY, fileName);

    await writeFile(filePath, frontmatter + markdown + "\n", "utf8");
    existingSlugs.add(slug);

    console.log(`  wrote ${fileName}`);
    written += 1;
  }

  // ---- Say what happened --------------------------------------
  console.log("");
  console.log(`Done. Wrote ${written} new post(s), left ${skipped} already-archived post(s) alone.`);
}

// Run it. A completely unexpected failure still must not fail the
// build, so this catches everything and exits successfully.
main().catch((error) => {
  console.log(`The archiver stopped unexpectedly: ${error.message}`);
  console.log("Nothing was written. The site will still build.");
});
