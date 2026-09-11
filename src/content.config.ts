// ============================================================
// CONTENT COLLECTIONS
//
// This file tells Astro where the writing lives and what fields
// each piece is allowed to have.
//
// Why it is worth having: if an essay is missing a title, or has
// a date typed as "15-09-2026" instead of a real date, the build
// stops and says so by name. Without this file, the page would
// publish with a blank space where the title should be and
// nobody would notice for a month.
//
// There are three collections:
//   essays    long pieces, written here, canonical here
//   notes     short pieces, written here
//   external  pulled in from Substack automatically
// ============================================================

import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// ============================================================
// STEP 1 — Turn a filename into a web address
//
// Files are named DD-MM-YYYY-short-slug.md so that the date is
// visible in the file list. A web address must not carry that
// date, because it makes the link ugly and pins the piece to a
// day that might later be wrong.
//
// This function removes a leading date if there is one, so
//    15-09-2026-gst-compensation-cliff.md
// becomes
//    gst-compensation-cliff
// and the piece publishes at /writing/gst-compensation-cliff/.
//
// A file with no date prefix is left alone, so nothing breaks if
// one is named differently.
// ============================================================

function slugFromFilename(entryPath: string): string {
  // Take just the filename, dropping any folders and the .md ending.
  const fileName = entryPath.split("/").pop() ?? entryPath;
  const withoutExtension = fileName.replace(/\.(md|mdx)$/, "");

  // Remove exactly two digits, a dash, two digits, a dash, four
  // digits, and the dash after them — but only at the very start.
  return withoutExtension.replace(/^\d{2}-\d{2}-\d{4}-/, "");
}

// ============================================================
// STEP 2 — The fields a piece written on this site may have
//
// z.string() means "this must be text".
// .optional() means "this may be left out entirely".
// .default(x) means "if left out, treat it as x".
// ============================================================

const writingFields = z.object({
  // --- Required ---------------------------------------------
  title: z.string(),

  // Shown in search results and link previews. One sentence.
  description: z.string(),

  // ISO format, YYYY-MM-DD, because software reads it. This is
  // what the site sorts and displays by — never the filename.
  date: z.coerce.date(),

  // --- Optional ---------------------------------------------

  // Only when a piece has been substantively revised after
  // publishing. Leave it out otherwise.
  updated: z.coerce.date().optional(),

  // Subject tags. These generate the tag pages.
  tags: z.array(z.string()).default([]),

  // Which copy search engines should treat as the original.
  //   "self"     — this site. The normal case for essays.
  //   "substack" — Substack. Used by the external collection.
  canonical: z.enum(["self", "substack"]).default("self"),

  // Filled in after cross-posting, so the site can link to the
  // Substack version.
  substackUrl: z.string().url().or(z.literal("")).default(""),

  // Dataset ids, like "union/budget-expenditure". These draw the
  // "data behind this piece" box at the foot of the essay.
  datasets: z.array(z.string()).default([]),

  // true hides the piece from the built site entirely. Use it
  // while writing; set it to false to publish.
  draft: z.boolean().default(false),
});

// ============================================================
// STEP 3 — The three collections
// ============================================================

// Long pieces. Anything with tables, charts, footnotes or
// citations belongs here rather than in Substack.
const essays = defineCollection({
  loader: glob({
    // The "!" line excludes the folder's own README, which is
    // instructions for a human and not a piece of writing.
    pattern: ["**/*.{md,mdx}", "!**/README.md"],
    base: "./content/essays",
    generateId: ({ entry }) => slugFromFilename(entry),
  }),
  schema: writingFields,
});

// Short pieces, less formal. Same fields, lighter in practice.
const notes = defineCollection({
  loader: glob({
    pattern: ["**/*.{md,mdx}", "!**/README.md"],
    base: "./content/notes",
    generateId: ({ entry }) => slugFromFilename(entry),
  }),
  schema: writingFields,
});

// Pieces written in Substack and pulled in by the archiver.
// These files are GENERATED — never edit one by hand.
const external = defineCollection({
  loader: glob({
    pattern: ["**/*.{md,mdx}", "!**/README.md"],
    base: "./content/external",
    generateId: ({ entry }) => slugFromFilename(entry),
  }),
  schema: writingFields.extend({
    // For these, Substack is the original, so the default flips.
    canonical: z.literal("substack").default("substack"),

    // The address of the post on Substack. Required here, because
    // an archived copy with no link back to the original is worse
    // than useless.
    substackUrl: z.string().url(),
  }),
});

export const collections = { essays, notes, external };
