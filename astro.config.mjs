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

  integrations: [
    // Lets an essay be written in .mdx instead of .md when it needs
    // a chart or another component embedded in the prose. Plain .md
    // keeps working exactly as before.
    mdx(),

    // Writes /sitemap-index.xml at build time, listing every page so
    // search engines can find them all.
    sitemap(),
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
    processor: unified({
      shikiConfig: {
        // Colour scheme for code blocks. These two are chosen to
        // sit comfortably on the site's paper colours in each theme.
        themes: { light: "github-light", dark: "github-dark" },
        wrap: true,
      },

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
