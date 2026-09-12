# How to add a dashboard or tool

**This one needs code.** There is no way round it and it is worth being straight about it.

A dashboard is a program: it reads data, watches filters, and redraws a chart. Writing and
datasets are content and can be pure content. A tool cannot be.

**What is true, though, is that a tool here is small and self-contained**, and the
architecture means you are never editing the site to add one. A tool is a folder you drop
in or delete.

The same text is §17.3 of `CLAUDE.md`. The contract itself is §10.

---

## The order of work

### 1. The dataset comes first

Publish the data as a dataset — see [add-a-dataset.md](add-a-dataset.md) — before building
anything that reads it.

A tool whose data exists only inside it is not citable and not checkable, which defeats the
point of the site.

### 2. One folder

`src/tools/<tool-id>/`, holding everything the tool needs and nothing outside it.

### 3. `tool.config.js` describes it to the site

Id, title, summary, which datasets it uses, which engine, minimum viewport, status, and the
date it was updated.

The tools index, the tag pages and the sitemap are all generated from these files.
**There is no list to maintain anywhere.**

### 4. `tool.js` is the tool itself

It follows the same five steps every time:

1. Load the data once when the tool becomes visible.
2. Read the current value of each filter.
3. Keep only the rows those filters select.
4. Hand those rows to Observable Plot and put the chart on the page.
5. When any filter changes, go back to step 2.

**No React, no Vue.** A dashboard with a few filters and a few charts is a readable script.
A framework would add a build step, a large mental model and roughly 45 KB, in exchange for
nothing this site needs.

### 5. Only the approved libraries

Observable Plot for charts. Arquero for reshaping, joins and group-bys. DuckDB-WASM only
when a dataset is genuinely too big for Arquero — several megabytes is a real cost to a
reader on a phone. The full list is `CLAUDE.md` §4.3, and adding to it needs a conversation
first.

### 6. A `README.md` beside it

Written for you in two years, having forgotten everything. What it does, how to run it,
what it reads and writes, what must be installed, how to change the common things, what it
does not handle, and the date.

### 7. Before committing, delete the folder and build

```bash
npm run build
```

**It must still succeed.** That is the one-way import rule, and it is what keeps every tool
deletable. Then restore the folder.

Do this every time a tool is added, not once.

---

## What you can do yourself

Given Python at beginner level and no JavaScript:

- **Decide what the tool should show and which filters it needs.** This is the part that
  actually determines whether the tool is any good, and it is entirely yours.
- **Prepare the data** — clean it in Python, publish it as a dataset.
- **Read `tool.config.js`** and change the title, the summary or the status.
- **Read the comments in `tool.js`** and follow what it is doing.

## What needs Claude Code

Writing `tool.js`, and changing what the tool does.

**Ask for changes in terms of behaviour**, not code — *"add a filter for year"*, *"show
states as small multiples instead of one crowded chart"*. Expect the comments in the file
to explain the result back to you.

---

## Two rules worth keeping

**If a tool starts needing React, the tool is too complicated.** Simplify the tool.

**Retiring beats deleting.** Set `status: "retired"` and the page stays live with a banner
saying what replaced it, the data still downloadable, but it drops out of the index. Links
published in essays never break. That is the difference between a site that accumulates and
one that decays.

---

## Not built yet

`ToolFrame` — the shared wrapper that gives every tool its title, its provenance box, its
download link, its status badge, its small-screen card and its lazy loading — is specified
in `CLAUDE.md` §10 but has not been built.

It gets built alongside the **first real tool**, not before. A frame written against no tool
would be wrong about the thing that matters most, which is where the boundary between the
frame and the tool falls.

---

**Last updated:** 12 September 2026
