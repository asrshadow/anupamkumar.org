// src/tools/nobel-economics-timeline/tool.config.js
// This file describes the tool to the rest of the site. The tools index page
// and the tool's own page at /tools/nobel-economics-timeline/ are built from
// it, so there is no list anywhere that has to be kept up to date by hand.

export default {
  id: "nobel-economics-timeline", // must match the folder name exactly
  title: "Economics Nobel timeline",
  summary:
    "Every economics Nobel laureate since 1969, on a timeline you can pull out to see the decades or pull in to see each year. Choose a name to read who they are and what the prize was for.",
  fields: ["economics", "history-of-economic-thought"],
  datasets: ["international/nobelprize-economic-sciences"], // draws the provenance box
  engine: "none", // no data library: the page is built with everything already in it
  minViewport: "sm", // works on a phone — Tier B (CLAUDE.md §12)
  status: "beta", // change to "stable" once the explainers have been reviewed
  updated: "2026-10-20",
};
