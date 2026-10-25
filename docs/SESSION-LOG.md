# Session log

One entry per working session, **newest first**. Never edit an old entry — add a new one. The
current state of things is in [HANDOVER.md](HANDOVER.md). This file records how it got there,
so that a decision can be traced back to the day it was made and the reason it was made.

**What each entry records:** the date, what the session set out to do, what changed (with the
commits), the decisions made and why, the problems hit, and anything left unfinished.

**At the end of every session:** add an entry here, then rewrite `HANDOVER.md`.

---

## 25 October 2026 (third part) — placeholders, home page limits, sitemap

**Asked for:** delete the two placeholder pieces. Say whether new writing updates the home page
by itself, as datasets do. Plan how many of each kind of thing the home page shows. Make the
sitemap visible to crawlers. Reword the datasets introduction, and list datasets on the home
page with no description.

| Commit | What |
|---|---|
| `content: retire the two placeholder pieces with redirects` | The two files deleted. |
| `feat: point search engines at the sitemap` | `public/robots.txt`. |
| `feat: set how many of each thing the home page shows` | `HOME_..._COUNT` constants. The Datasets block now lists titles only. |
| `content: reword the datasets introduction` | "A curated collection of datasets from development economics, public policy and public finance." |
| `docs: record the home page rule and page retirement` | CLAUDE.md §11 and §16. |
| `content: redirect the retired placeholder addresses and tidy the sitemap` | `astro.config.mjs`: the redirects, and a sitemap filter. |

**Decisions, and why:**

- **Retired, not plainly deleted.** `/writing/hello/` now redirects to `/writing/`, and
  `/notes/what-notes-are-for/` to `/notes/` (rule 8). The redirect pages carry `noindex`.
- **The home page already updated itself** for writing, datasets and tools. CLAUDE.md just
  never said so. §11 now does, with a table of counts.
- **One stream for writing, with 6 pieces (1 featured and 5 listed).** Essays, notes and
  archived posts are not split, because a reader wants the newest thing. Two lists would
  push one below the first screen on a phone. Datasets show 5, tools 3 and subjects 8.
- **The sitemap already existed.** What was missing was `robots.txt` telling crawlers where it
  is. `/search/` is now left out of the sitemap, because that page asks not to be indexed.

**Problems hit:** the plan's commit step tried to `git add` files that an earlier step had
already deleted, so `astro.config.mjs` was left out of the commits. The push went out without
the redirects, and for about ten minutes the two old addresses returned 404. Opus committed the
file directly rather than re-planning, because a live link was broken. **Lesson for plans:
after `git rm`, the deletion is already staged, so do not name the deleted path in `git add`.
And an executor must stop at a failed command, not chain the next ones after it.**

**Checks run:** the build and the accessibility check passed, including the redirect pages.
Deploy and accessibility passed on GitHub. On the live site, `robots.txt` shows the Sitemap
line and the sitemap returns 200. Both old addresses forward. The sitemap lists no search or
retired page.

---

## 25 October 2026 — a note on Musgrave, and plan-then-execute

**Asked for:** a short note on public finance as Richard Musgrave defined it, with a proper
citation, a theoretical definition and an explanation for a teenager, published. And a rule in
CLAUDE.md: plan with Opus 5.5 at high effort or above, hand the plan to Sonnet 5.5 to carry
out, and come back to Opus when execution fails.

**What changed:**

| Commit | What |
|---|---|
| `note: add what public finance is, after Musgrave` | `content/notes/25-10-2026-public-finance-musgrave.md`, live at `/notes/public-finance-musgrave/`. The first real note. |
| `docs: plan with Opus, execute with Sonnet` | CLAUDE.md §15.1: two stages, what a plan must contain, and the fallback loop. |

**Decisions, and why:**

- **A note, not an essay.** It is under a thousand words, has no table, and needs one citation.
- **The citation is to the 1959 *Theory of Public Finance*, p. 3**, quoted for its opening
  definition only. The three branches (allocation, distribution, stabilisation) are
  paraphrased from its first chapter rather than quoted.
- **The teenager's section uses Indian examples**: GST on a bill, free textbooks, the free-grain
  scheme in 2020.
- **The fallback loop is capped.** If the same step fails twice after revision, Opus stops and
  asks Anupam. Without a cap, a broken step could loop forever.
- **This session followed the new rule.** Opus wrote the note and the plan. A Sonnet subagent
  ran the build, the accessibility check, the commits and the push.

**Checks run:** the build passed (25 pages). The accessibility check passed on all 25 pages.
The deploy succeeded, and the live note returned HTTP 200.

**Left unfinished:** Anupam should check the Musgrave quotation against a copy of the book.

### Later the same day — revising the note, and the writing framework

**Asked for:** the note's title changed to "What is Public Finance? - Simplified". The old
description replaced with a short biography of Musgrave, naming his seminal work and calling
him the father of modern public finance. The second heading changed to "Public Finance in
Daily Life", and its opening rewritten for readers from any background. Two GitHub
repositories applied to the note, and built into CLAUDE.md for all future writing, through a
framework file that can grow.

| Commit | What |
|---|---|
| `note: retitle the public finance note and add Musgrave's biography` | New title, description, a "Who was Richard Musgrave" section, the new heading and opening, and the whole note edited to remove AI writing patterns. The URL is unchanged. |
| `docs: add the writing framework` | `docs/writing-framework.md`: writing for the reader, AI writing patterns, search and discovery, accuracy and citation, a pre-publish checklist, and a sources table that grows. |
| `docs: apply the writing framework to all new writing` | CLAUDE.md §5, §11 and §15.1 now point at the framework. |

**Decisions, and why:**

- **Neither repository is used as software. Their rules are in the framework instead.**
  - **OpenSEO** needs a running server and a paid DataForSEO API key. That breaks rule 1, rule
    4 and the free-only budget. Its `deslop` and web-content skills (MIT) supplied the writing
    rules.
  - **Turnitout Humanizer** is a hosted service, or an API that needs a key, so a draft would
    leave the repository. It swaps synonyms automatically, which can change technical terms
    and quotations. Its purpose is to get past AI and plagiarism detectors, which is not this
    site's aim. Its AI-phrase, em-dash and zero-width-character rules were taken.
- **The URL stayed `/notes/public-finance-musgrave/`.** The address was already published
  (rule 8), and the title does not set it.
- **The biography went into the note, and the description now names Musgrave as the father of
  modern public finance.** A description has to stay one sentence, because listings and
  search results show it.
- **Bolded list openers and em dashes were removed from the note** under the framework's §3.
  Titles may still use a dash.

**Checks run:** no zero-width characters in the three files, and no em dashes in the note. The
build and the accessibility check both passed on 25 pages. Deploy and accessibility passed on
GitHub. The new section was confirmed on the live page.

**Left unfinished:** the biographical facts (1910–2007, Königstein, 1933, Harvard doctorate,
Federal Reserve Board, the five universities) were written from memory. They need checking,
along with the quotation.

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
