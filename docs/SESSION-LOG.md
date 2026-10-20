# Session log

One entry per working session, **newest first**. Never edit an old entry — add a new one. The
current state of things is in [HANDOVER.md](HANDOVER.md). This file records how it got there,
so that a decision can be traced back to the day it was made and the reason it was made.

**What each entry records:** the date, what the session set out to do, what changed (with the
commits), the decisions made and why, the problems hit, and anything left unfinished.

**At the end of every session:** add an entry here, then rewrite `HANDOVER.md`.

---

## 20 October 2026 — the first dataset and the first tool

**Asked for:** a dataset of every economics Nobel laureate, an interactive timeline where readers
click a laureate to learn about them and their work, and these two handover files.

**What was built:**

| Commit | What |
|---|---|
| `data: add the Nobel economics laureates dataset` | `data/international/nobelprize-economic-sciences/`. 101 laureates and 58 prize years, 1969–2026, from the Nobel Prize API. Two build scripts, documentation, and the first `data/_templates/` files. |
| `feat: add the dataset detail page and file downloads` | `/datasets/<group>/<name>/` and a download address for every file. `src/lib/csv.ts` (a build-time CSV reader). `registry.json` now gives download addresses. |
| `fix: stop adding up rows across a dataset's separate tables` | A dataset with several tables shows its number of files, not a meaningless row total. |
| `feat: add ToolFrame and the tool page route` | `src/components/ToolFrame.astro`, `src/pages/tools/[id].astro`, and a new token, `--width-panel`. |
| `tool: add the Nobel economics timeline` | `src/tools/nobel-economics-timeline/`. Pull out to see the decades, pull in to see each year, and a slide-out panel per laureate. Includes 58 plain-English explainers. |
| `docs: add the session log and handover summary` | This file and `HANDOVER.md`. The how-to docs and the tools README updated for what now exists. |
| `docs: point CLAUDE.md at the handover files` | CLAUDE.md §5, §8.2, §16 and §17.2 brought up to date. A separate commit so it can be undone on its own if not approved. |

**Decisions, and why:**

- **The dataset goes in `international/`.** Its publisher, Nobel Prize Outreach, is a foreign
  body (§6.2). The folder name leads with the publisher, as that group's README asks.
- **Two tables, not one:** `laureates.csv` and `prizes.csv`. Prize money belongs to a year, not
  to a person.
- **The inflation-adjusted prize money is left out.** The API does not say which year's kronor
  it is in, and for 2025 and 2026 it equals the nominal amount. A column whose unit has to be
  guessed is not published. See the dataset's `METHOD.md`.
- **Birth country is published both as it was then and as it is now.** Otherwise the Russian
  Empire counts as a country with laureates.
- **One explainer per prize year, not per person**, because a shared prize is usually for one
  body of work. Anupam chose this. The explainers live in the tool folder, not the dataset,
  because they are the site's own writing, not source data.
- **"Pull-in pull-out" was read as two things**, and Anupam confirmed both: zooming between
  decades and years, and a panel that slides in and out.
- **The tool loads no library** (`engine: "none"`). The build writes the whole timeline into
  the page as HTML, and `tool.js` (about 4 KB) adds the interaction. It works with JavaScript
  off and survives a script failure.
- **No laureate photographs.** They are not covered by the data's CC0 licence.
- **Download addresses are `/datasets/<group>/<name>/<file>.csv`.** These are now published
  links, so the pattern must never change (rule 8).

**Problems hit:**

- The Nobel Prize API refuses data centres, and refuses Python's default identification, both
  with a 403. It works from a home connection when the request names itself. A refresh
  therefore cannot run on GitHub, the same situation as Substack.
- The source writes a partly known date as `1956-00-00`. These are published as an empty
  `birth_date`, with the year kept in `birth_year`.
- In the first browser test, the panel could get stuck half-closed if the browser never
  reported the end of the closing animation. Fixed with a timer that closes it anyway.
- A one-off script for converting the explainers to curly quotes corrupted the file, because
  the shell ate the backslashes. Caught before committing, and the file was rewritten whole.
  **Lesson: write Python to a .py file rather than through a shell heredoc when it contains
  backslashes.**

**Checks run:**
- the build passes
- the accessibility check passes on all 22 pages, in light, dark and at phone width
- a browser test of the tool passes with the panel open, in both themes and at 360px; it
  covers keyboard use, Escape, focus return, the bottom sheet, and a full readable list with
  JavaScript off
- the tool-deletion test passes
- the downloads are byte-identical to `clean/`
- the cleaning script gives byte-identical output on a second run

**Left unfinished:** nothing is pushed. Anupam reviews the explainers first. See `HANDOVER.md`.

---

## 12 September 2026 — layout, sections and the first real essay

Worked through `docs/work-order-2026-09-12.md`, steps 1 to 11:
- CLAUDE.md moved to v1.3
- header and footer band; `PageShell` and two-column pages; new navigation with search in the
  header
- the home page leads with the newest piece; right-hand columns on the listing, essays and notes
- the Datasets and Tools sections, and `/registry.json`; the About page rewritten with a photo

The BRICS essay was published. Building it exposed a font-loading trap that cost about 100 KB a
page, recorded in CLAUDE.md §16. Afterwards, a piece's first image became its thumbnail on
listings.

## 11 September 2026 — Phase 0 and the site itself

- Domain, DNS, email forwarding and the repository set up.
- The Astro site built, with content collections, every page, RSS, sitemap, Pagefind search and
  dark mode.
- Deploy, accessibility, dead-link and Substack-archiver workflows added. The Substack archiver
  turned out not to work from GitHub (Substack answers 403 to data centres), and that was
  recorded as expected behaviour.
