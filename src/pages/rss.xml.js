// ============================================================
// THE RSS FEED, at /rss.xml
//
// An RSS feed lets someone follow this site in a reader without
// giving anyone an email address. It costs nothing to provide and
// it is the one way of following the writing that no company can
// switch off.
//
// This file produces XML rather than a page, which is why it is
// named .xml.js rather than .astro.
// ============================================================

import rss from "@astrojs/rss";
import { getAllWriting } from "../lib/writing";

export async function GET(context) {
  // Everything: essays, notes, and pieces archived from Substack,
  // already sorted newest first.
  const pieces = await getAllWriting();

  return rss({
    title: "Anupam Kumar",
    description:
      "Writing on public finance, public policy, economics and geoeconomics.",

    // Comes from the "site" setting in astro.config.mjs, so every
    // link in the feed is a full address.
    site: context.site,

    items: pieces.map((piece) => ({
      title: piece.title,
      description: piece.description,
      pubDate: piece.date,

      // Where this item lives. For a piece first published on
      // Substack, point at the original rather than at the archived
      // copy, so a reader arrives where the discussion is.
      link: piece.isExternal && piece.substackUrl ? piece.substackUrl : piece.url,

      categories: piece.tags,
    })),

    // Tells a reader the feed is in English.
    customData: "<language>en-gb</language>",

    // Adds a link from the feed back to a stylesheet, so that
    // opening /rss.xml in a browser shows something readable
    // instead of raw XML. Left out for now — a browser opening raw
    // XML is a minor problem and a stylesheet is another file to
    // maintain.
  });
}
