# data/

Cleaned, documented datasets. This is the longest-lived part of the repository and the
thing that distinguishes this site from every other policy blog.

Anyone can post a CSV. What almost nobody does is answer the four questions a careful user
always has: **where exactly did this come from, what vintage is it, what are the units, and
what was changed?** A file that answers those is infrastructure. A file that does not is a
spreadsheet someone found on the internet.

This layout is designed to hold two hundred datasets in ten years without ever being
reorganised, because reorganising breaks every published link and every tool.

---

## Two principles

**One — group by jurisdiction, never by topic.** Topic is metadata, not structure. A
dataset on fuel subsidies is simultaneously energy, fiscal policy, welfare and inflation,
so filing it under a topic means choosing one of four arbitrarily. Topics go in the
dataset's own `keywords`, where one dataset can carry several and they can change without
moving a file. Jurisdiction is stable and one-to-one.

**Two — the folder structure is fixed; what is inside a dataset is not.** The groups below
never change. What a dataset contains — how many tables, which columns, whether it needed
cleaning at all — is decided when that dataset is added and described in its own
`dataset.json`. **Nothing anywhere in this project prescribes what columns a dataset must
have.**

---

## The groups

Eight, fixed. **Do not add a ninth without a discussion.** If something does not obviously
fit, it is almost always `derived/`.

| Folder | Belongs here when | Examples |
|---|---|---|
| `union/` | Published by the Union government about Union finances | Budget documents, CGA monthly accounts, CAG reports, Finance Commission reports |
| `states/` | About state or union territory finances | RBI *State Finances: A Study of Budgets*, individual state budgets, state GSDP |
| `local/` | About municipal or panchayat finances | Urban local body budget compilations, local body grants |
| `surveys/` | The unit of observation is a household, person or firm | PLFS, NSS rounds, NFHS, ASI, Census |
| `sectoral/` | A sector portal, at any level of government | UPAg, CEA power data, health and education portals |
| `international/` | Published by a multilateral or foreign body | World Bank, IMF, OECD, UN, ADB, BIS |
| `derived/` | **We** computed it, or it combines more than one source | Indices, real-terms series, cross-source comparisons |

Plus two that are not groups:

- `_reference/` — lookup tables that more than one dataset agrees on.
- `_templates/` — starting points and conventions for a new dataset.

`registry.json` is **generated at build time** by `scripts/build-data-registry.mjs`, which
scans every `dataset.json`. There is no list to maintain and it is never edited by hand.

---

## What counts as one dataset

**One dataset = one source release.**

Population for ten years from one source and GDP for ten years from another source are
**two datasets**, even though both are ten rows and both end up on the same chart. Their
provenance, licence, update cycle and revision history are separate, so they stay separate.

If a chart simply needs them together, **join them at chart time** in the tool or the build
script. Do not create a merged file just to make one chart easier.

If a combined series is worth publishing in its own right, that is a **third** dataset in
`derived/`, whose `LINEAGE.md` names both parents.

---

## Datasets come in very different shapes

There is no single template. A dataset folder holds whatever that dataset actually needs
and nothing more.

| Shape | Looks like | What it needs |
|---|---|---|
| Tiny series | Population by year, ten rows | One CSV. Often no build script at all — say so in the README. |
| Medium table | State-wise revenue receipts, a few thousand rows | One CSV, usually one cleaning script. |
| Large table | Major and minor head expenditure, millions of rows | Cleaning scripts, possibly Parquet, object storage if above ~50 MB. |
| Multi-table release | One source publishing several related tables | One folder, several CSVs, one `dataset.json` listing them all. |
| Download-only | Cleaned purely for people to take away | CSV, plus an `.xlsx` copy if the audience expects one. |
| Tool-feeding | Sits behind a dashboard | Whatever format that tool reads most easily. |
| Reference lookup | A mapping other datasets join against | Lives in `_reference/`. |

**Do not create empty `build/` folders, placeholder scripts, or a `METHOD.md` with nothing
in it.** Structure that exists only to look consistent is clutter, and it teaches the next
dataset to be more complicated than it needs to be.

---

## Inside one dataset folder

The full shape, for a dataset that needs all of it:

```
union/budget-expenditure/
├── README.md        required, always. Plain English.
├── dataset.json     required, always. Describes the columns it genuinely has.
├── SOURCES.md       required. Every raw file: where from, when, direct URL.
├── CHANGELOG.md     required. Every change, dated, plain English.
├── METHOD.md        only when cleaning involved judgement calls worth defending.
├── raw/             IMMUTABLE. Exactly as downloaded. Never edited.
├── build/           optional. Only if processing was needed.
└── clean/           the published output
```

Four files are always required: `README.md`, `dataset.json`, `SOURCES.md`, `CHANGELOG.md`.

---

## The discipline

1. **`raw/` is immutable.** Never edit, rename or clean a source file in place. If
   processing happened, `build/` must regenerate every clean table from `raw/` on demand.
   Reproducible cleaning is what makes a dataset citable.
2. **Never overwrite a vintage.** Budget Estimates, Revised Estimates and Actuals for the
   same year are three different facts, not corrections of one. This is the single most
   common error in Indian fiscal datasets.
3. **Nominal figures by default.** Never bake a real-terms conversion into published data.
   Publish the deflator separately and let users choose a base year.
4. **Every column's unit is stated**, in its name or its description. A column called
   `amount` with no unit anywhere is a future error.
5. **Years are rows, not folders**, except inside `raw/` where folders may mirror the
   source's own release cycle. Never publish `expenditure_2024.csv` and
   `expenditure_2025.csv` as separate outputs.
6. **Files above ~50 MB do not go in Git.** Git keeps every version forever, which is
   excellent for text and ruinous for large binaries. Large files go to object storage and
   the `dataset.json` points at the URL.
7. **Never commit survey microdata.** See `surveys/README.md`.

Adding a dataset has a checklist:
[docs/checklists/adding-a-dataset.md](../docs/checklists/adding-a-dataset.md).

**Last updated:** 11 September 2026
