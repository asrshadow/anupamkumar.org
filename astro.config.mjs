// ============================================================
// ASTRO CONFIGURATION
// This file tells Astro how to build the site. It runs on your
// computer and on GitHub's build machine — never in a reader's
// browser — so nothing here affects page weight.
// ============================================================

import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import { unified } from "@astrojs/markdown-remark";
import { rehypeWrapTables } from "./scripts/rehype-wrap-tables.mjs";

export default defineConfig({
  // ----------------------------------------------------------
  // The site's permanent address.
  // Astro uses this to build absolute links in the RSS feed, the
  // sitemap and the social-preview tags. Getting it wrong makes
  // those links point nowhere, so it is set once and left alone.
  // ----------------------------------------------------------
  site: "https://anupamkumar.org",

  // No "base" setting is needed. A custom domain serves this
  // repository at the root of anupamkumar.org, not in a subfolder.

  // ----------------------------------------------------------
  // Every page address ends with a slash, like /writing/gst/ —
  // and Astro redirects the version without one. Picking one form
  // and sticking to it stops the same page existing at two
  // addresses, which splits search rankings.
  // ----------------------------------------------------------
  trailingSlash: "always",

  // ----------------------------------------------------------
  // Retired pages. A published address is never allowed to break
  // (CLAUDE.md rule 8), so when a page is deleted its old address
  // is listed here and sends the reader somewhere sensible.
  // Astro writes a tiny page at the old address that forwards the
  // browser and tells search engines not to index it.
  //
  // Add a line here every time a published page is removed.
  // ----------------------------------------------------------
  redirects: {
    // Placeholder essay from before there was any real writing.
    // Retired 25 October 2026.
    "/writing/hello/": "/writing/",
    // Placeholder note from before there was a real note.
    // Retired 25 October 2026.
    "/notes/what-notes-are-for/": "/notes/",
  },

  integrations: [
    // Lets an essay be written in .mdx instead of .md when it needs
    // a chart or another component embedded in the prose. Plain .md
    // keeps working exactly as before.
    mdx(),

    // Writes /sitemap-index.xml at build time, listing every page so
    // search engines can find them all. Readers never see it; the
    // address is given to search engines in public/robots.txt.
    //
    // Two kinds of page are left out on purpose:
    // - /search/, which asks search engines not to index it (a page
    //   of search results is not a page worth finding by search);
    // - the retired addresses in "redirects" above, which only
    //   forward to another page.
    sitemap({
      filter: (page) => {
        const path = new URL(page).pathname;
        if (path === "/search/") return false;
        if (path === "/writing/hello/") return false;
        if (path === "/notes/what-notes-are-for/") return false;
        return true;
      },
    }),
  ],

  // ----------------------------------------------------------
  // Turn Markdown into HTML.
  //
  // Astro 7 ships a faster Markdown processor by default, but that
  // one does not accept plugins. This site needs exactly one
  // plugin — the table wrapper, which is an accessibility
  // requirement rather than a nicety — so it uses the unified
  // processor instead. The cost is build time on GitHub's machine.
  // Nothing about the pages a reader downloads changes.
  // ----------------------------------------------------------
  markdown: {
    // Colour scheme for code blocks.
    //
    // TWO themes, not one. Astro's default is github-dark for both
    // light and dark pages, which puts a dark code block in the
    // middle of a light essay and fails the contrast check. Naming
    // a light and a dark theme makes the block follow the page.
    //
    // The HIGH-CONTRAST variants are deliberate: the ordinary
    // github themes set comments in a grey that measures under the
    // 4.5 to 1 WCAG AA minimum against these backgrounds. Comments
    // are the part of a code sample that explains it, so they are
    // the last thing that should be hard to read.
    shikiConfig: {
      themes: {
        light: "github-light-high-contrast",
        dark: "github-dark-high-contrast",
      },
      // Long lines wrap instead of forcing a sideways scroll.
      wrap: true,
    },

    processor: unified({
      // Typographic quotes, proper dashes and ellipses.
      smartypants: true,

      // Runs after Markdown becomes HTML. Puts a scrollable box
      // around every table so a wide fiscal table never drags the
      // whole page sideways on a phone — without altering the
      // table itself, which would break it for screen readers.
      rehypePlugins: [rehypeWrapTables],
    }),
  },

  build: {
    // Build each page as its-own-folder/index.html, which is what
    // the trailing-slash setting above expects.
    format: "directory",
  },

  // ----------------------------------------------------------
  // Astro normally prefixes built files with a hash of their
  // contents. Leave that alone — it is what lets browsers cache
  // aggressively without ever serving a stale file.
  // ----------------------------------------------------------
});
