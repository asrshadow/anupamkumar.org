# Handover — read this first

**Rewritten at the end of every session.** It describes things as they stand now. How they got
here is in [SESSION-LOG.md](SESSION-LOG.md). The rules are in `CLAUDE.md`.

**Last rewritten:** 25 October 2026

**How sessions now work (CLAUDE.md §15.1):** Opus 5.5 at high effort or above plans. Sonnet 5.5
carries the plan out as a subagent. Failures go back to Opus. **All writing** is checked
against [writing-framework.md](writing-framework.md). Add new resources to its §7.

---

## Where things stand

| | State |
|---|---|
| **Writing** | Two real pieces: the BRICS essay (12 September 2026) and the Musgrave note (25 October 2026). There are also two placeholders. Phase 1 wants four real pieces. |
| **Datasets** | **One:** `international/nobelprize-economic-sciences`, 1969–2026. |
| **Tools** | **One:** `nobel-economics-timeline`, status `beta`. |
| **Dataset pages** | Built. `/datasets/<group>/<name>/`, plus a download for every file at `/datasets/<group>/<name>/<file>`. |
| **ToolFrame and tool pages** | Built. `src/components/ToolFrame.astro`, `src/pages/tools/[id].astro`. |
| **Published?** | **Yes**, on 20 October 2026. Deploy and accessibility check both passed on GitHub. |

## Waiting on Anupam

0. **Check the Musgrave note** (`content/notes/25-10-2026-public-finance-musgrave.md`). Both
   of these were written from memory:
   - the quotation, against *The Theory of Public Finance* (1959), p. 3
   - the biography: born 1910 in Königstein, moved to the US in 1933, Harvard doctorate, the
     Federal Reserve Board in the 1940s, Michigan, Johns Hopkins, Princeton, Harvard, then
     Santa Cruz, died 2007
   Also decide whether to keep the spaced hyphen in the title, "What is Public Finance? -
   Simplified", or change it to a colon.
1. **Review the 58 explainers** in `src/tools/nobel-economics-timeline/explainers.md`. They are
   the site's own words, shown under every prize year and in every laureate's panel.
   - **2026 (Hall and Woodford) needs the most care.** It was written without the committee's
     announcement, which came after the drafting model's training data ends.
   - Entries that make specific factual claims worth a second look:
     - 1996: Vickrey's death three days after the announcement
     - 1998: Sen as the first Indian-born economics laureate
     - 2007: Hurwicz as the oldest laureate
     - 2019: Duflo as the youngest laureate
     - 2023: Goldin as the first woman to win unshared
2. **Approve or reject the new token `--width-panel: 28rem`** in `src/styles/tokens.css`. It is
   the width of the tool's slide-out panel. Rule 11 says a new token is proposed, not just
   added. `--width-aside` (18rem) was too narrow to read an explainer in.
3. **Approve or reject the CLAUDE.md change** made in the last commit, `docs: point CLAUDE.md at the handover files`: a pointer at the top of
   §16 to this file, and §16 and §17.2 brought up to date. It is a single commit and can be
   undone on its own.
4. ~~Push.~~ Done on 20 October 2026, after Anupam checked the data. Items 1–3 can still be revised and pushed the same way.

## How to publish a change

Run these in the VS Code terminal, one at a time:

```bash
git status
```
Shows what has changed. It should say `Your branch is ahead of 'origin/main' by 7 commits` and
`nothing to commit, working tree clean`. If you have edited the explainers since, it lists
`explainers.md` as modified. In that case, run:

```bash
git add src/tools/nobel-economics-timeline/explainers.md
git commit -m "tool: revise the Nobel explainers after review"
```

Then:

```bash
git push
```
Sends the commits to GitHub, which publishes the site. Expect a few lines ending in `main -> main`.

```bash
gh run watch
```
Watches the build. A green tick means it is live, usually within two minutes. The new pages are:

- <https://anupamkumar.org/datasets/international/nobelprize-economic-sciences/>
- <https://anupamkumar.org/tools/nobel-economics-timeline/>

Once the explainers are reviewed, change `status: "beta"` to `status: "stable"` in
`src/tools/nobel-economics-timeline/tool.config.js`, and commit and push the same way.

## Things to know before the next session

- **The Nobel dataset is refreshed by hand each October.** The API blocks GitHub's machines. The
  steps are in the dataset's `build/README.md`. If it is not refreshed, the dataset page shows
  a staleness banner 13 months after `updated`.
- **Download addresses are now published links.** `/datasets/<group>/<name>/<file>.csv` must
  never change pattern.
- **Worked examples now exist.** Copy `data/international/nobelprize-economic-sciences/` for a
  dataset and `src/tools/nobel-economics-timeline/` for a tool. Blank dataset files are in
  `data/_templates/`.
- **The tool pattern worth keeping:** the build writes everything into the page as HTML, and the
  script only adds interaction. It is cheap, accessible and cannot lose content.
- **Writing Python through a shell heredoc corrupts backslashes.** Use a `.py` file.

## Suggested next steps, in order

1. Review the explainers, push, and look at both pages on a phone.
2. **Writing.** Phase 1 still wants two more real pieces. Both placeholders could now be
   retired, because a real note exists: `content/essays/11-09-2026-hello.md` and
   `content/notes/11-09-2026-what-notes-are-for.md`. Their URLs are published, so rule 8 asks
   for a redirect, not a plain deletion.
3. A first **Indian public finance** dataset — the Union budget or RBI state finances — which is
   what the Datasets page promises next. The detail page and downloads already exist, so this is
   now folders and files only (CLAUDE.md §17.2).
4. Later, perhaps: a "laureates by country" or "age at award" chart on the Nobel dataset page or
   in an essay, drawn from the published CSV.
