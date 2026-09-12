# How to add a dataset

**No code, once the detail page exists.**

Today this still needs one build session: `/datasets/<id>/` and the endpoint that serves
each dataset's files have not been built yet. That is deliberate. A detail page designed
against zero real datasets would fit the first one badly and the second one worse, and it
would have set a precedent by then. It gets built alongside the first real dataset.

**After that session, this is folders and files and no code at all.**

The same text is §17.2 of `CLAUDE.md`. The fuller reasoning is in §6.

---

## 1. Decide where it goes

One of the eight fixed groups in `data/`, **by jurisdiction, never by topic**:

`union` · `states` · `local` · `surveys` · `sectoral` · `international` · `derived`

Topic goes in the dataset's own `keywords`, where one dataset can carry several and they
can change without moving a file. Jurisdiction is stable and one-to-one, which is why it
decides the folder.

Each group has a `README.md` saying exactly what belongs there. If something does not
obviously fit, it is almost always `derived/`.

**Is this one dataset or two?** One dataset = one source release. Population from one
source and GDP from another are two datasets, even if both are ten rows and both end up on
the same chart.

## 2. Make the folder

`data/<group>/<publisher-or-subject-slug>/`, in `lowercase-kebab-case`, **with no year in
the name**. Years are rows inside the file, so one folder covers every year the dataset has
and keeps covering them as it is updated.

## 3. Download the sources into `raw/` and write `SOURCES.md` — before anything else

Every file: where it came from, the direct address, and the date.

**Do this first, while the browser tab is still open.** Reconstructing a source URL three
months later is the single most reliably painful thing in this whole workflow, and
government portals reorganise constantly.

**`raw/` is immutable from this moment.** Never edit, rename or clean a file in place.

## 4. Decide what shape this dataset actually is

Look at the data before deciding what to build. Most datasets are a tiny series or a medium
table and need one CSV and nothing else.

**Do not build a `build/` folder, a `METHOD.md` or a script for a dataset that did not need
cleaning.** Structure that exists only to look consistent is clutter, and it teaches the
next dataset to be more complicated than it needs to be.

## 5. Put the clean CSV in `clean/`

UTF-8, one header row, nothing above it, no merged cells, no blank rows.

Column names in `lowercase_snake_case`, with the unit in the name or in its description.

Four things to watch, because they are where fiscal data goes wrong:

- **Keep vintages separate.** Budget Estimates, Revised Estimates and Actuals for the same
  year are three different facts, not one figure corrected twice.
- **Nominal figures.** Never bake a deflator into published data.
- **Years as rows**, not as separate files.
- **Boundary changes handled explicitly**, never by quietly dropping rows.

## 6. Write `dataset.json`

Copy the nearest example from `data/_templates/`. Fill in the administrative fields — `id`,
`title`, `description`, `keywords`, `sources`, `licenses`, `updated`, `stale_after_months`
— then describe every column the file actually has, in that dataset's own words, with its
unit.

**Nothing prescribes what the columns must be.** There is no global column vocabulary in
this project and there never will be.

**Every column in the file must appear here, and every one must state its unit.** A column
whose unit a reader has to guess is the single most common way a public finance dataset
gets misused.

## 7. Write `README.md` and `CHANGELOG.md`

Plain English. If nothing was cleaned, the README says so — *"no cleaning was needed; this
is the source file with only the header row tidied"* is a complete answer.

The changelog records restatements made by the source, not only your own corrections.

## 8. Push

```bash
git add .
git commit -m "data: add RBI state budgets, 1990-2025"
git push
```

The dataset appears at `/datasets/`, gets its own page, its download link and its entry in
`/registry.json` automatically. **There is no list to update anywhere.**

---

## What can go wrong, and what it looks like

| What happened | What you see |
|---|---|
| A typo in `dataset.json` | The build stops and names the file |
| A column listed in `dataset.json` is not in the CSV | The `validate-data.yml` check fails and says which column |
| A file over 50 MB | The same check fails and says which file |

All of these are meant to happen, and all of them say what to fix.

---

## Two things that are never allowed

- **Survey microdata anywhere in the repository.** Not in `raw/`, not once. Git keeps every
  version forever, so a restricted file committed and then deleted is still in the history
  and still public. See `data/surveys/README.md` for what to do instead.
- **Files above roughly 50 MB in Git.** They go to object storage, with the address in
  `dataset.json`.

---

**Last updated:** 12 September 2026
