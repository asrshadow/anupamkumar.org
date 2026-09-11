# src/tools/

One folder per interactive tool, each fully self-contained.

**There are no tools yet.** The first two are planned for months six to nine, after the
writing and the data layer exist. Building tools before there is anything to write about is
the most reliable way for a project like this to die as a portfolio of unfinished
experiments.

---

## The contract

**A tool may import from the site. The site may never import from a tool.**

The site discovers tools by scanning this directory for `tool.config.js` files. Adding a
tool is creating a folder. Removing one is deleting it. **No file outside the folder is
edited either way.**

### Why this rule is written down rather than remembered

The failure mode is predictable. The third tool needs "just one small change" to the
navigation, then to the layout, then to a shared utility. Within a year the tools and the
site are welded together and neither can move.

### How to test it

Delete a tool's folder, run `npm run build`, and confirm it still succeeds. Then restore
the folder. If the build breaks, the contract is already violated and that is the bug to
fix.

Do this **every time a tool is added**, not once.

---

## The manifest

Every tool folder contains `tool.config.js`, which describes the tool to the rest of the
site. The tools index page, the tag pages and the sitemap are all generated from these
files, so there is no list anywhere that has to be kept up to date by hand.

```javascript
// src/tools/state-fiscal-explorer/tool.config.js

export default {
  id: "state-fiscal-explorer",     // must match the folder name exactly
  title: "State Fiscal Explorer",
  summary: "Own-tax revenue, committed expenditure and debt across states, 1990-2025.",
  fields: ["public-finance", "federalism"],
  datasets: ["states/rbi-state-budgets"],  // dataset ids — draws the provenance box
  engine: "arquero",               // arquero | duckdb-wasm | none
  minViewport: "lg",               // below this width, a wider-screen card is shown
  status: "stable",                // draft | beta | stable | retired
  updated: "2026-08-14",
};
```

---

## ToolFrame does the shared work once

Every tool renders inside one shared wrapper, which handles what would otherwise be
reimplemented badly in each tool: the title and summary, the provenance box built from the
dataset's `dataset.json`, the download link for the underlying data, the status badge, the
small-screen card driven by `minViewport`, an error boundary so a broken tool cannot take
down the page, and lazy loading.

**ToolFrame will be built together with the first tool**, not before. A frame designed
without a real tool to hold is guesswork.

---

## Lazy loading is not optional

DuckDB-WASM is several megabytes. Loaded on a shared layout it would slow every essay on
the site. Behind Astro's `client:visible` directive, a reader who never opens a tool never
downloads a byte of it.

This is what the last row of the speed budget in the main README is protecting: heavy
things are allowed, but only after someone has chosen them.

---

## Screen tiers

| Tier | What | How |
|---|---|---|
| B | Tools that adapt to a phone | **Aim here by default.** Filters collapse into a bottom sheet, a wide table becomes a stack of cards, a chart gets one clear default view instead of six toggles. A tool that works on a phone gets shared, and being shared is how anyone finds the site. |
| C | Tools that genuinely cannot | Multi-panel dashboards, side-by-side grids. Set `minViewport: "lg"`. |

**Write the small-screen notice as a handoff, never a refusal.** "Use a laptop for better
functionality" tells a reader they were wrong to come. Instead: *"State Fiscal Explorer
compares eight indicators across 28 states side by side, which needs a wider screen.
Download the underlying data (2.1 MB CSV), or send yourself the link."* Same constraint,
and the visit still produced something.

---

## Retiring a tool

Set `status: "retired"`. The page stays live with a banner explaining what replaced it and
the data still downloadable, but it drops out of the index.

**Links published in essays never break.** That is the difference between a site that
accumulates and one that decays.

---

## Every tool folder needs a README

Following the structure used everywhere here: what it does, how to run it, what it reads
and writes, dependencies, how to change the common things, known limitations, last updated.

**Last updated:** 11 September 2026
