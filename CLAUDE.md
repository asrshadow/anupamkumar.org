# CLAUDE.md

Instructions for Claude when working in this repository.
Read this file completely before making any change.

**Last updated:** 12 September 2026 · **Blueprint version:** v1.3

---

## Contents

1. What this project is
2. About Anupam — read before writing any code
3. Rules that must never be broken
4. How to write code here
5. Repository structure
6. The data architecture
7. Naming conventions
8. Design system — colour, typography, shape
9. Accessibility
10. The tool contract
11. Content rules
12. Performance and responsive tiers
13. Automated workflows
14. Git, for someone who has done it once
15. How to work with Anupam
16. Current state
17. The three routines — publishing, adding a dataset, adding a tool

---

## 1. What this project is

A personal website for **Anupam Kumar** publishing writing, cleaned datasets and small
interactive tools in public finance, public policy, economics and geoeconomics. Its
purpose is to **simplify economic information for a general audience**.

| | |
|---|---|
| **Domain** | `anupamkumar.org` (canonical, permanent — never changes). Registrar: **Namecheap**, not Cloudflare. Email forwarding for `hello@anupamkumar.org` is Namecheap's. |
| **Repository** | `asrshadow/anupamkumar.org`, public. A custom domain serves a project repository at the domain root, so Astro needs no `base` setting. |
| **Host** | GitHub Pages (treated as disposable and replaceable) |
| **Framework** | Astro (static site generation) |
| **Newsletter** | Substack at `asranupam.substack.com` (distribution only, never an archive) |
| **Tool compute** | Runs entirely in the visitor's browser |
| **Content language** | English only, with URLs designed so a `/hi/` tree can be added later |
| **Budget** | Static hosting and free tiers only. No servers, no paid cloud services. |

### The first principle everything else follows from

**Separate what is permanent from what is disposable.**

- **Layer 0 — Identity (permanent):** the domain `anupamkumar.org`.
- **Layer 1 — Source of record (permanent):** this Git repository. Markdown, CSV and
  JSON. Every file readable in a text editor with no special software.
- **Layer 2 — Presentation (disposable):** the built HTML on GitHub Pages. Assume it
  will be thrown away and rebuilt elsewhere one day.

**The consequence, which governs every decision:** if the site must be wound up and
restarted years later, cloning this repository and running the build must be enough.
Nothing of value may live only on a platform. Never introduce a dependency that would
make that untrue.

---

## 2. About Anupam — read this before writing any code

### Subject expertise (high)

Public finance and public policy specialist, with working knowledge across all branches
of economics and of data science. Treat him as an expert on the **subject matter**. Do
not explain what a fiscal deficit, a devolution formula or a deflator is. Do not simplify
economic reasoning. Substantive disagreement on method or interpretation is welcome.

### Technical background (beginner — this is the important part)

| Skill | Level |
|---|---|
| Python | Beginner. Can read and follow code. Mostly Jupyter notebooks in VS Code. |
| R | Beginner. Can read and follow code. |
| HTML, CSS | Beginner. Can read and follow code. |
| JavaScript | **None.** Cannot read it. |
| Git, GitHub, GitHub Pages | Surface level. Followed a tutorial once. Does not remember how. |
| Command line / Git Bash | Used once. Not comfortable. |

**What this means for you, concretely:**

1. He can **read** Python, R, HTML and CSS but has not written much. Code in those
   languages should be simple enough to follow line by line.
2. He **cannot read JavaScript at all**. Every JavaScript file must be commented densely
   enough that the comments alone explain what the file does.
3. Never assume he knows a Git or terminal command. Write commands out in full, say what
   each one does before he runs it, and say what he should expect to see afterwards.
4. Never say "just run the build" or "simply configure X". Give the exact steps.
5. When something goes wrong, assume the cause is a missing step in your instructions,
   not a mistake on his part. Ask what he saw on screen rather than what he did wrong.

### What is installed on his machine

Verified on 11 September 2026:

| Tool | Version | Notes |
|---|---|---|
| Node.js | 24.13.0 | Installed and working. Astro needs it. |
| npm | 11.6.2 | |
| Git | 2.53.0 | Configured as `asrshadow` / `anupamskywalker@gmail.com` |
| GitHub CLI (`gh`) | 2.100.0 | Signed in as `asrshadow`. At `C:\Program Files\GitHub CLI\gh.exe` |
| Python | 3.11.5 | |
| R | installed | |
| VS Code | installed | Where the work happens |
| Google Chrome | installed | Used by the accessibility checks |

**`gh` is a separate program from Git Bash.** Git Bash is a terminal window; `gh` is a
program that runs inside one. It does everything on GitHub from the terminal — creating
repositories, watching builds, reading logs — so nothing needs the website.

Still check before assuming any *other* tool is present, and include the install step.

---

## 3. Rules that must never be broken

These protect the architecture. If a request would violate one, say so and propose an
alternative rather than quietly complying.

1. **No secrets in the repository. Ever.** No API keys, no tokens, no passwords, not even
   in a comment, not even temporarily, not even in a file that is gitignored. If a feature
   appears to need a key, the feature must be redesigned. Git remembers deleted files.

2. **No generative AI API calls at runtime.** Any language processing must run locally in
   the visitor's browser using an open model (Transformers.js) or a rule-based library.

3. **No React, Vue, Svelte or any component framework.** See §4.4.

4. **No backend, no database, no server.** The site is static files. If something seems to
   need a server, it almost certainly does not — say what the constraint is and propose a
   browser-side or build-time approach instead.

5. **The site never imports from a tool.** Tools may import from the site. Never the
   reverse. Deleting any tool folder must leave the site building successfully.

6. **`raw/` is immutable.** Source files are never edited, renamed or cleaned in place.

7. **Never commit restricted microdata.** See §6.9.

8. **Never break a published URL.** Retire pages with a redirect and a note; never delete.

9. **Never add a dependency without explaining what it does, why it is needed, and what
   removing it would cost.**

10. **Accessibility is not optional.** WCAG 2.2 Level AA is the minimum for everything
    shipped. See §9.

11. **Never invent a colour, font size or spacing value.** Everything comes from the
    tokens in §8. If a token is missing, propose adding one — do not hard-code.

12. **Never impose a column vocabulary on a dataset.** Each dataset describes its own
    columns when it is added. See §6.4.

---

## 4. How to write code here

### Universal rules — every language

- **Comment heavily.** Roughly a comment every two or three lines of real logic. Explain
  *why*, not just *what*. Assume the reader has forgotten everything after six months.
- **Write a `README.md` beside every script, tool and dataset.** No exceptions. See §4.5.
- **Prefer obvious code over clever code**, even when the clever version is shorter.
- **Use full, descriptive names.** `state_debt_to_gsdp`, not `sdg` or `df2`.
- **Say what a file does in its first three lines**, as a comment at the top.

### 4.1 Python and R style

- **Keep a statement on one line if it naturally fits on one line.** Do not split a short
  statement across several indented lines. Only wrap past about 100 characters, and then
  break at the clearest point.

  ```python
  # Good — one statement, one line, easy to read
  df = pd.read_csv("raw/expenditure-2024-25.csv")
  df = df[df["vintage"] == "RE"]

  # Avoid — needlessly broken across lines for something short
  df = (
      pd.read_csv("raw/expenditure-2024-25.csv")
        .query("vintage == 'RE'")
  )
  ```

- **Avoid long method chains.** Three short, separately named steps beat one chained
  expression, because each step can be printed and inspected.
- **Prefer plain `pandas` and base R** over less common libraries.
- **Print a short progress message at each major step** (`print("Loaded 4,182 rows")`).
- **Any cleaning script must be re-runnable from scratch** and produce identical output
  from the same `raw/` inputs.

### 4.2 JavaScript style

He cannot read JavaScript. Write it so the comments alone tell the whole story.

- **Plain, modern JavaScript only.** No TypeScript in tool code, no JSX.
- **Comment every block**, and name every function for exactly what it does.
- **No clever one-liners.** No dense `.map().filter().reduce()` chains. A plain `for` loop
  with a comment is better when it is clearer.
- **No abbreviations**: `stateName`, not `sn`.
- **Group code into clearly labelled sections:**

  ```javascript
  // ============================================================
  // STEP 3 — Redraw the chart whenever a filter changes
  // Runs every time the user picks a different state or year.
  // ============================================================
  ```

### 4.3 Allowed JavaScript libraries

The complete allowlist. Adding to it requires a conversation first.

| Library | Purpose | Why it is allowed |
|---|---|---|
| **Observable Plot** | Charts | A chart is about five readable lines. |
| **Arquero** | Table reshaping, joins, group-bys | ~100 KB. The default for most datasets on this site. |
| **DuckDB-WASM** | SQL over large CSV or Parquet in the browser | Several megabytes. Use **only** when a dataset is genuinely too large for Arquero. |
| **Sanscript / indic-transliteration** | Script conversion (Devanagari ↔ Latin) | Rule-based, ~30 KB, deterministic. |
| **Transformers.js** | Local NLP — translation, entity extraction, embeddings | The only way to do NLP with no API key. Load on explicit click only. |
| **Pagefind** | Static site search | Runs at build time. No service, no third-party script. |
| **SheetJS** | Generating .xlsx downloads | Only where an Excel copy is genuinely wanted. |

### 4.4 Why no React or Vue — keep this decision

Interactive dashboards do **not** need a component framework. React and Vue exist to
manage complex state across dozens of components in a large application. A dashboard with
a few filters and a few charts is a short, readable script.

A framework would add a build step, a large mental model, roughly 45 KB, and code Anupam
could never read or fix — in exchange for nothing this site needs. **If a future request
seems to require React, the tool is too complicated; simplify the tool instead.**

The standard pattern for every interactive tool:

```javascript
// 1. Load the data once when the tool becomes visible.
// 2. Read the current value of each filter control.
// 3. Keep only the rows those filters select.
// 4. Hand those rows to Observable Plot and put the chart on the page.
// 5. When any filter changes, repeat from step 2.
```

### 4.5 Required contents of every README.md

1. **What this does** — two or three plain sentences, no jargon.
2. **How to run it** — the exact command, and what he should expect to see.
3. **What it reads and what it writes** — file paths in and out.
4. **Dependencies** — what must be installed first.
5. **How to change the common things** — "to add a new year, edit the list on line 12".
6. **Known limitations** — what it does not handle.
7. **Last updated** — a date.

Assume the reader is Anupam in two years, having forgotten everything.

---

## 5. Repository structure

```
anupamkumar.org/
│
├── CLAUDE.md                   ← this file
├── README.md                   ← what the repo is, how to run it locally
├── LICENSE-content             ← CC BY 4.0 — the writing
├── LICENSE-data                ← CC BY 4.0 — the cleaned datasets
├── LICENSE-code                ← MIT — the tools and scripts
├── .gitignore
│
├── content/                    ← everything written. Markdown only.
│   ├── essays/                 ← long pieces, canonical on this site
│   ├── notes/                  ← short pieces, less formal
│   └── external/               ← auto-archived from Substack (never hand-edit)
│
├── data/                       ← see §6. The largest and longest-lived part.
│
├── src/
│   ├── assets/                 ← images the build optimises (see §7)
│   ├── tools/                  ← one folder per tool, fully self-contained
│   ├── components/             ← shared site pieces (Header, Footer, PageShell)
│   ├── layouts/                ← page shells
│   ├── lib/                    ← build-time readers: writing, datasets, tools
│   ├── pages/                  ← routes
│   └── styles/
│       ├── tokens.css          ← ALL colours, fonts, spacing, radii — defined once
│       └── base.css
│
├── scripts/                    ← repo-wide utilities
│   ├── archive-substack.mjs
│   └── check-dataset-freshness.mjs
│
├── docs/
│   ├── checklists/             ← the human routines in §13
│   └── how-to/                 ← the three routines in §17, for Anupam
│
├── public/
│   ├── CNAME                   ← contains exactly: anupamkumar.org
│   └── favicon.svg
│
└── .github/workflows/          ← see §13
```

### Reserved for later — do not use now, do not rule out

If Hindi content is added, it goes in `content/hi/` and URLs become `/hi/...`. English
stays at the root and **no existing URL changes**. Never introduce an `/en/` prefix —
that would break every published link the day Hindi is added.

---

## 6. The data architecture

Designed to hold **two hundred datasets in ten years**, starting from zero, without ever
needing reorganising — because reorganising breaks every published link and every tool
that references a dataset.

### 6.1 Two principles

**One — group by jurisdiction, never by topic.** Topic is metadata, not structure. A
dataset on fuel subsidies is simultaneously energy, fiscal policy, welfare and inflation.
Topics go in the dataset's own metadata as keywords, where one dataset can carry many and
where they can change without moving a file. Jurisdiction is stable and one-to-one.

**Two — the folder structure is fixed; everything inside a dataset is not.** The eight
top-level groups below never change. What a dataset contains — how many tables, what
columns, whether it needed cleaning at all — is decided **when that dataset is added**,
and described in its own metadata file. **Nothing in this document prescribes what columns
a dataset must have.** See §6.4.

### 6.2 Top-level layout

```
data/
│
├── _reference/          ← shared lookup tables. Grows only when needed. See §6.7.
├── _templates/          ← starting templates and conventions. See §6.8.
│
├── union/               ← Government of India
├── states/              ← state and UT governments
├── local/               ← urban local bodies, panchayats  (reserved, may stay empty)
├── surveys/             ← unit of observation is a household, person or firm
├── sectoral/            ← domain portals, any level of government
├── international/       ← multilateral and foreign publishers
└── derived/             ← anything we computed from the above. See §6.6.
```

Eight groups, fixed. **Do not add a ninth without a discussion.** If something does not
obviously fit, it is almost always `derived/`.

**The registry is not a file in this folder.** It is generated on every build from every
`dataset.json` and served at `https://anupamkumar.org/registry.json`. There is no list to
maintain and no generated file to keep in step.

Why it is not a committed file: a generated file in Git drifts out of step with its sources
the first time someone forgets to re-run the script that makes it. An endpoint is built from
the same reader the site itself uses, so there is one source of truth, and outside consumers
get a stable address rather than a raw GitHub link.

| Group | Belongs here when | Examples |
|---|---|---|
| `union/` | Published by the Union government about Union finances | Budget documents, CGA monthly accounts, CAG reports, Finance Commission reports |
| `states/` | About state or UT government finances | RBI *State Finances: A Study of Budgets*, individual state budgets, state GSDP |
| `local/` | About municipal or panchayat finances | ULB budget compilations, local body grants |
| `surveys/` | Unit of observation is a household, person or firm | PLFS, NSS rounds, NFHS, ASI, Census |
| `sectoral/` | A sector portal, any level of government | UPAg, CEA power data, health and education portals |
| `international/` | Published by a multilateral or foreign body | World Bank, IMF, OECD, UN, ADB, BIS |
| `derived/` | **We** computed it, or it combines more than one source | Indices, real-terms series, cross-source comparisons |

### 6.3 Datasets come in very different shapes — the structure must absorb all of them

This is the most important thing to understand before creating a dataset folder. **There is
no single template.** A dataset folder holds whatever that dataset actually needs, and
nothing more.

| Shape | Looks like | What it needs |
|---|---|---|
| **Tiny series** | Population by year, 10 rows. GDP by year, 10 rows. | One CSV. Often no build script at all — say so in the README. |
| **Medium table** | State-wise revenue receipts, a few thousand rows. | One CSV, usually one cleaning script. |
| **Large table** | Major and minor head expenditure for ten years, millions of rows. | Cleaning scripts, split output if useful, consider Parquet (§6.5) and object storage if above ~50 MB. |
| **Multi-table release** | One source publishing several related tables at once. | One folder, several CSVs, one metadata file listing them all. |
| **Download-only** | Cleaned and structured purely for people to take away. | CSV, plus an .xlsx copy if the audience expects one. No tool integration needed. |
| **Tool-feeding** | Sits behind a dashboard or interactive tool. | Whatever format that tool reads most easily. |
| **Reference lookup** | A mapping table other datasets join against. | Lives in `_reference/`, not a group folder. |

**Joining is not a requirement.** Most datasets on this site will never be joined to
anything. Some will be joined only inside one dashboard. A few will be joined often. Do
not design a dataset for a join that has not been asked for — that is how rigid schemas
get imposed on data that does not want them.

**The rule for deciding what is one dataset:** *one dataset = one source release.*

Anupam's own example: population for ten years from one source, and GDP for ten years from
another source, are **two datasets**, even though both are ten rows and both will end up on
the same chart. Keep them separate, because their provenance, licence, update cycle and
revision history are separate. If a GDP-per-capita series is then wanted as a published
dataset in its own right, that is a third dataset in `derived/`, whose `LINEAGE.md` names
both parents.

If the chart just needs them together and no new dataset is being published, **join them
at chart time** in the tool or the build script. Do not create a merged file simply to
make one chart easier.

### 6.4 The dataset metadata file — `dataset.json`

Every dataset folder has one. It follows the **Frictionless Data** conventions loosely
enough to stay useful, and it is written **when the dataset is added**, describing what
that dataset actually contains.

**There is no global column vocabulary. This document defines none, and never will.**
Each dataset declares its own columns, in its own words, with its own units.

#### Required — administrative only

These exist so the site can list, search, cite and age-check a dataset. They say nothing
about its contents.

```json
{
  "id": "union/budget-expenditure",
  "title": "Union Budget: ministry-wise expenditure",
  "description": "One paragraph a non-specialist can understand.",
  "keywords": ["public-finance", "union-budget", "expenditure"],
  "sources": [{
    "title": "Expenditure Profile, Statement 12",
    "publisher": "Ministry of Finance, Government of India",
    "url": "https://www.indiabudget.gov.in/doc/eb/stat12.pdf",
    "retrieved": "2026-07-02"
  }],
  "licenses": [{ "name": "GODL-India", "url": "https://data.gov.in/government-open-data-license-india" }],
  "updated": "2026-07-02",
  "stale_after_months": 14,
  "resources": [ /* see below */ ]
}
```

`retrieved` and `updated` stay in **ISO format (YYYY-MM-DD)** because software reads them.
This is separate from the filename convention in §7, which is for human eyes.

#### Optional, but useful once there are many datasets

`purpose` (`download` · `tool` · `dashboard` · `reference` · `archive`),
`temporal_coverage`, `geography`, `update_frequency`, `derived` (`true` for anything in
`derived/`), `size_note`.

#### `resources` — describe what is actually there

List each file. **Describe the columns this dataset genuinely has, using whatever names
and units it genuinely uses.** Nothing here is prescribed.

```json
"resources": [{
  "name": "expenditure",
  "path": "clean/expenditure.csv",
  "rows": 48210,
  "fields": [
    { "name": "...", "type": "...", "description": "What it means, and in what unit." }
  ]
}]
```

**The only hard requirement on `fields`:** every column present in the file appears here,
and every one has a `description` that states its **meaning and its unit**. A column whose
unit a reader has to guess is the single most common way a public finance dataset gets
misused.

If a dataset is a single tiny CSV with three self-explanatory columns, the `fields` block
is three short lines. That is complete. Do not pad it.

#### Style conventions for column names — conventions, not a vocabulary

These are about machine-readability, not meaning. They constrain the *shape* of a name,
never which names exist.

- `lowercase_snake_case`. No spaces, no capitals, no special characters — spaces and
  capitals break in both Python and R.
- **Carry the unit in the name** where a unit exists, or state it in the `description`.
  A column called `amount` with no unit anywhere is a future error.
- Full words over abbreviations, unless the abbreviation is the source's own official term.
- **Use whatever the dataset actually needs.** If a source's own column names are already
  clear, keep them — matching the source makes checking against the original easier.

### 6.5 File formats

| Format | When |
|---|---|
| **CSV** | **Always.** Every published table has a CSV. This is the copy of record and the one humans and Excel open. UTF-8, comma-separated, one header row, no merged cells, no blank rows above the header. |
| **XLSX** | When the audience would expect Excel — several related tables in one workbook, or a table people will annotate. **A generated convenience copy, never the source of record.** Regenerate it from the CSV; never edit it by hand. |
| **Parquet** | **Not required. Skip it by default.** Add one only when a browser tool queries a dataset large enough that CSV loading is visibly slow — roughly above 5 MB. Most datasets on this site will never need it. |
| **JSON** | Only for metadata, or where a tool genuinely needs nested structure. Not a table format. |

**Do not create a Parquet file "in case it is useful later".** It is a second copy that can
silently drift out of step with the CSV. Add it when a tool needs it, in the same commit
as that tool.

### 6.6 Inside one dataset folder

The full shape, for a dataset that needs all of it:

```
union/budget-expenditure/
│
├── README.md              ← required, always. Plain English. See §4.5.
├── dataset.json           ← required, always. See §6.4.
├── SOURCES.md             ← required. Every raw file: where from, when, direct URL.
├── CHANGELOG.md           ← required. Every change, dated, plain English.
├── METHOD.md              ← when cleaning involved judgement calls worth defending.
│
├── raw/                   ← IMMUTABLE. Exactly as downloaded. Never edited.
│
├── build/                 ← OPTIONAL. Only if processing was needed.
│   ├── 01_extract.py      ← numbered so the run order is visible from the filenames
│   ├── 02_clean.py
│   └── README.md
│
└── clean/                 ← the published output
    └── expenditure.csv
```

**The minimum legitimate dataset** — a tiny series that needed no processing:

```
union/population-annual/
├── README.md        ← including: "no cleaning was needed; this is the source file
│                       with only the header row tidied"
├── dataset.json
├── SOURCES.md
├── CHANGELOG.md
├── raw/
│   └── source-as-downloaded.xlsx
└── clean/
    └── population.csv
```

That is complete. **Do not create empty `build/` folders, placeholder scripts or a METHOD
file with nothing in it.** Structure that exists only to look consistent is clutter, and
it teaches the next dataset to be more complicated than it needs to be.

**Years are rows, not folders** — except inside `raw/`, where folders may mirror the
source's own release cycle if that is how it publishes. A clean table covers every year it
has in one file. Never produce `expenditure_2024.csv`, `expenditure_2025.csv` as separate
published outputs.

### 6.7 Derived data — lineage is mandatory

Anything computed, or combining more than one source, goes in `derived/` and **must name
its parents**.

```
derived/gdp-per-capita/
├── README.md
├── dataset.json           ← "derived": true; sources list INTERNAL dataset ids
├── LINEAGE.md             ← required
├── METHOD.md              ← required
├── build/
└── clean/
```

`LINEAGE.md` states, in a table: every parent dataset id, which of its tables and columns
were used, the version or retrieval date of the parent used, and what needs re-running if
that parent is corrected.

**Why this matters more than it looks.** Without lineage, a correction upstream silently
invalidates every derived figure that used it and nobody finds out. With lineage, it is a
search. For a site whose credibility rests on provenance, this is the product.

**A derived figure must never be presented as a source figure.** The site labels anything
with `"derived": true` clearly.

### 6.8 `_reference/` — build it when you need it, not before

Lookup tables that more than one dataset agrees on. **Create it empty now with a README.
Add a table the first time a second dataset needs the same lookup — never in advance.**

The kinds of thing that end up here: canonical names and codes for administrative units,
an alias table mapping every spelling a source has ever used to a canonical one, deflator
series, currency conversion series, fiscal year definitions.

**The alias table is the one that saves the most time.** Sources spell the same state
`Odisha`, `Orissa`, `ODISHA`, `Odisha *`. Once two datasets have disagreed, create the
mapping, point both cleaning scripts at it, and add to it whenever a new spelling appears.

**Handle boundary changes explicitly**, never by quietly dropping rows. Andhra Pradesh
before and after 2014 is not the same territory. Record how each dataset handled it in
that dataset's `METHOD.md`.

Its columns are defined when it is created, like any other dataset.

### 6.9 Survey microdata — the special case

PLFS, NSS, NFHS and similar unit-level files are large and often carry redistribution
restrictions.

**Never commit microdata to this repository.** Not to `raw/`, not anywhere.

A microdata dataset folder contains a README, `dataset.json`, an
`OBTAINING-THE-DATA.md` naming the portal, the login, the exact file and year, build
scripts that expect the raw file at a local path **outside** the repo, and `clean/`
containing publishable aggregates only. `.gitignore` excludes the working directory.

Before publishing any aggregate from unit-level data, check the source's terms and record
the conclusion in the README. **When unsure whether an aggregate may be published, ask.**

### 6.10 Data discipline

1. **`raw/` is immutable.** If processing happened, `build/` must regenerate every clean
   table from `raw/` on demand. Reproducible cleaning is what makes a dataset citable.
2. **Never overwrite a vintage** where a source publishes several for the same period.
   How that is represented is the dataset's own decision, recorded in its `dataset.json`.
3. **Nominal figures by default.** Do not bake a real-terms conversion into a published
   dataset. Publish the deflator separately and let users pick a base year.
4. **`CHANGELOG.md` in every dataset folder**, dated, plain English. Include restatements
   by the source, not only your own corrections.
5. **Files above ~50 MB do not go in Git.** Git keeps every version forever — excellent
   for text, ruinous for large binaries. Large files go to object storage; the
   `dataset.json` points at the URL and stays in Git.
6. **The registry is generated, never hand-written.** `src/lib/datasets.ts` scans every
   `dataset.json` at build time and `src/pages/registry.json.ts` serves the result at
   `/registry.json`. There is no list to maintain and no file to keep in step.
7. **Every dataset page shows its `retrieved` date** and a visible staleness banner once
   `stale_after_months` has passed.

### 6.11 Starting from empty

Create all eight group folders now, each with a `README.md` saying what belongs there. An
empty labelled shelf is what stops the first few datasets being filed wrongly and setting
a bad precedent. Create `_reference/` and `_templates/` empty, with READMEs.

Then add datasets one at a time, each describing itself.

---

## 7. Naming conventions

### Dates in filenames — DD-MM-YYYY

Human-facing filenames use **DD-MM-YYYY**: `15-09-2026-gst-compensation-cliff.md`.

**Note the one consequence, so it is a known trade-off rather than a surprise:** files
named this way do not sort chronologically in a file listing — `15-09-2026` sorts before
`16-08-2026`. This does not affect the website, because the site orders essays by the
`date` field in the frontmatter, not by filename. It only affects the file list in VS Code.

**Dates inside files stay ISO (YYYY-MM-DD)** — frontmatter `date`, `dataset.json`
`retrieved` and `updated`, and anything else software reads. Changing those would break
Astro's date parsing and the Frictionless conventions.

### Folders and files

| Thing | Convention | Example |
|---|---|---|
| Folders | `lowercase-kebab-case` | `budget-expenditure` |
| Essays and notes | `DD-MM-YYYY-short-slug.md` | `15-09-2026-gst-compensation-cliff.md` |
| Dataset group folders | fixed, see §6.2 | `union`, `states`, `surveys` |
| Dataset folders | `publisher-or-subject-slug`, no years | `rbi-state-budgets`, `imf-weo` |
| Dataset id | `group/folder` | `union/budget-expenditure` |
| Clean data files | `lowercase_snake_case` | `expenditure_by_ministry.csv` |
| Build scripts | `NN_verb_noun.py` | `01_extract.py`, `02_clean.py` |
| Python and R scripts | `lowercase_snake_case` | `clean_state_budgets.R` |
| Astro components | `PascalCase.astro` | `ToolFrame.astro` |
| Astro endpoints | `lowercase-kebab-case.ts`, named for what they emit | `registry.json.ts` |
| JavaScript files | `lowercase-kebab-case.js` | `tool.js` |
| Images in `src/assets/` | `lowercase-kebab-case`, describing content | `profile-photo.webp` |
| CSS variables | `--lowercase-kebab-case` | `--colour-accent` |
| Images | `lowercase-kebab-case`, describing content | `devolution-shares-2021.svg` |

**Never** use spaces, capitals or special characters in anything that becomes a URL.

**Never** put a version marker in a filename — `final`, `v2`, `updated`, `new`. Git is the
version history.

### Git branches and commits

Branch names: `type/short-description`

```
essay/gst-compensation-cliff
data/rbi-state-budgets
tool/indic-script-converter
fix/mobile-table-overflow
```

Commit messages: `type: what changed`, plain English, present tense.

```
essay: add GST compensation cliff piece
data: add RBI state budgets, 1990-2025
fix: stop tables overflowing on narrow phones
```

If a commit message needs the word "and", it is probably two commits.

---

## 8. Design system — colour, typography, shape

### 8.1 The reasoning, briefly

Recorded so that future changes are arguments rather than preferences.

**On the accent colour.** The site's accent is a **deep pine green**, deliberately not
blue. Blue is the reflexive default for institutional and data sites, to the point where
it no longer signals anything — it is the visual equivalent of a stock photo.

Green is the better choice here on three grounds. It sits near the peak of human
photopic sensitivity, so it is comfortable to look at for long periods at moderate
saturation. There is some experimental support for green being easier on the eye during
extended screen reading — a 2025 study found light green backgrounds produced larger pupil
diameters and lower perceived difficulty than white during reading tasks, though the effect
was modest, clearest in the reader's first language, and the authors could not confirm the
mechanism. And it reads as considered and natural rather than corporate.

**Be honest about the strength of that evidence.** The colour-and-cognition literature is
weaker than popular writing suggests. What reliably reduces eye strain is not hue but
**luminance**: an off-white ground rather than pure white, sufficient but not excessive
text contrast, and no large areas of high-saturation colour. This palette does all three.
Green is chosen because it is comfortable, distinctive and low-risk — not because it has a
proven effect on reading time.

**Blue is still used for data.** The objection is to blue as the site's identity and in
banners, not to blue as a chart colour, where it remains one of the most
colour-vision-safe hues available. **The accent never appears inside a chart plot area,
and chart colours never appear in site chrome.** Those two palettes stay separate.

**Never use red/green for deficit and surplus.** It is the ledger convention and it is
invisible to roughly one man in twelve. The polarity pair here is **rust to blue** — the
most colour-vision-safe diverging pair there is, keeping warm for negative and cool for
positive.

**On typography.** The eye-tracking and comprehension literature comparing serif with
sans-serif on screen is largely null at modern resolutions — typeface family is not a
reliable driver of reading speed. So choose for **signal and function**. What does
measurably matter: x-height, type size, line length, line spacing, contrast.

The signal each family carries is conventional and real: serif body text reads as edited
and permanent; sans reads as current and functional; monospace reads as machine-produced
and exact. This site uses all three, each for the job its convention fits.

**On shape.** Rounded contours are consistently rated as safer and more approachable,
angular ones as more authoritative and stable. Rather than picking one mood, **shape here
encodes role**, so a reader learns the vocabulary without being taught it.

### 8.2 Colour tokens

All of these live in `src/styles/tokens.css`. **Nothing in the codebase may use a colour
that is not one of these.**

```css
/* ==========================================================================
   COLOUR TOKENS
   Light theme on :root. The dark theme redefines the SAME token names, so no
   component ever needs to know which theme is active.
   Every value below has been checked for WCAG contrast — see the comments.
   ========================================================================== */

:root {
  /* --- Surfaces --------------------------------------------------------
     Off-white, never pure white. This is the single biggest lever on eye
     comfort during long reading — bigger than any hue choice.             */
  --colour-paper:        #F7F7F4;  /* page background */
  --colour-surface:      #FFFFFF;  /* cards, tables, raised areas */
  --colour-surface-sunk: #F1F1ED;  /* code blocks, inset panels */

  /* --- Chrome — the header and footer band -------------------------------
     One luminance step away from the page, so the structure of the page is
     visible without a border doing all the work. Deliberately a near-neutral
     and not a hue: §8.3 rule 9 forbids large areas of saturated colour, and
     the header and footer are the largest continuous areas on the site.
     Separation from --colour-paper is 1.11:1 in light and 1.13:1 in dark —
     enough to read as a band, not enough to read as a stripe.            */
  --colour-chrome:      #ECECE5;  /* header and footer background */
  --colour-chrome-rule: #C9CAC2;  /* the hairline between chrome and page */

  /* --- Ink -------------------------------------------------------------- */
  --colour-ink:          #16191C;  /* body text.    16.4:1 on paper — AAA */
  --colour-ink-muted:    #5C6470;  /* captions.      5.6:1 on paper — AA  */

  /* --- Lines ------------------------------------------------------------ */
  --colour-rule:         #DCDDD7;  /* decorative dividers, table rules */
  --colour-border-input: #767B72;  /* control borders. 4.0:1 — passes the WCAG 2.2
                                      3:1 minimum for UI component boundaries. */

  /* --- Accent — deep pine green. The ONLY brand colour. ------------------
     Links, focus rings, banner rails, the current nav item. Nothing else.
     Never used inside a chart.                                            */
  --colour-accent:       #1D6049;  /* 6.9:1 on paper — comfortably AA */
  --colour-accent-soft:  #E8F0EA;  /* banner and callout backgrounds */

  /* --- Fiscal polarity --------------------------------------------------
     Rust to blue, NOT red to green. Warm = negative, cool = positive, and
     distinguishable with any common colour vision deficiency.             */
  --colour-deficit:      #9A4A16;  /* 5.8:1 on paper — AA */
  --colour-surplus:      #1A5F9E;  /* 6.2:1 on paper — AA */
  --colour-neutral-mid:  #E5E4DE;  /* midpoint of the diverging scale */

  /* --- Status (reserved — never reused as a chart series) ---------------- */
  --colour-good:         #1D6049;  /* same green as the accent — one idea, one colour */
  --colour-warning:      #8A6410;
  --colour-serious:      #9A4A16;
  --colour-critical:     #97263C;

  /* --- Chart series, in fixed order. NEVER cycle or generate a 7th. ------
     A separate palette from the site chrome above. Validated for lightness
     band, chroma floor, colour-vision separation, normal-vision separation
     and 3:1 contrast against the chart surface.                           */
  --chart-1: #1A6CA8;   /* blue   */
  --chart-2: #C1590A;   /* orange */
  --chart-3: #00876C;   /* green  */
  --chart-4: #B2649B;   /* mauve  */
  --chart-5: #4A93C9;   /* sky    */
  --chart-6: #AD7F14;   /* gold   */

  /* --- Chart furniture --------------------------------------------------- */
  --chart-grid:    #D5D6D0;   /* recessive by design — gridlines must not compete */
  --chart-axis:    #5C6470;
  --chart-surface: #FFFFFF;
}

/* ==========================================================================
   DARK THEME — selected steps, not an automatic inversion. Each validated
   separately against the dark surface.
   ========================================================================== */

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --colour-paper:        #14171A;
    --colour-surface:      #1B1F23;
    --colour-surface-sunk: #22272C;
    --colour-chrome:       #1E2227;
    --colour-chrome-rule:  #3B424A;
    --colour-ink:          #E9EAE6;   /* 14.9:1 — AAA */
    --colour-ink-muted:    #98A0AB;   /*  6.8:1 — AA  */
    --colour-rule:         #2F353B;
    --colour-border-input: #6B7178;   /*  3.7:1 — passes */
    --colour-accent:       #6FBF9A;   /*  8.2:1 — AAA */
    --colour-accent-soft:  #182620;
    --colour-deficit:      #E0925F;   /*  7.2:1 — AAA */
    --colour-surplus:      #7FB3E3;   /*  8.1:1 — AAA */
    --colour-neutral-mid:  #343A40;
    --colour-good:         #6FBF9A;
    --colour-warning:      #D0A43C;
    --colour-serious:      #E0925F;
    --colour-critical:     #E2687F;

    --chart-1: #2E86CE;
    --chart-2: #D6631C;
    --chart-3: #009C76;
    --chart-4: #BF50A1;
    --chart-5: #4A63D8;
    --chart-6: #B37100;

    --chart-grid:    #2F353B;
    --chart-axis:    #98A0AB;
    --chart-surface: #1B1F23;
  }
}

/* The explicit toggle must win in both directions — repeat the same block
   under :root[data-theme="dark"]. */
```

**`tokens.css` defines colours in three places** — `:root`, the
`@media (prefers-color-scheme: dark)` block, and the `:root[data-theme="dark"]` block. The
last two must stay identical to each other, or the explicit toggle stops matching the
device setting. **Any token added goes in all three.**

#### Contrast on the chrome band — measured, and the constraint it creates

Every foreground the site puts on the header and footer band passes.

| Token on the chrome band | Light — on `#ECECE5` | Dark — on `#1E2227` | Needs |
|---|---|---|---|
| `--colour-ink` | 14.87:1 — AAA | 13.23:1 — AAA | 4.5:1 |
| `--colour-ink-muted` | 5.04:1 — AA | 6.05:1 — AA | 4.5:1 |
| `--colour-accent` | 6.27:1 — AA | 7.31:1 — AAA | 4.5:1 |
| `--colour-border-input` | 3.65:1 — passes | 3.24:1 — passes | 3:1 |

`--colour-border-input` is on the band because the header carries a search field. It is the
tightest of the four, and it is what stops the band being made darker in light mode or
lighter in dark mode. **If `--colour-chrome` is ever changed, re-check that row first.**

#### Layout widths

These live in `tokens.css` alongside the colours.

```css
  --width-page:   1120px;  /* the widest the content area ever gets */
  --width-gutter: var(--space-5);  /* the side margin, never less than this */
  --width-aside:  18rem;   /* the right-hand column, where a page has one */
```

`--width-aside` is the only permitted width for a sidebar. See §8.8.

### 8.3 Colour rules

1. **One accent.** `--colour-accent` marks links, focus, banner rails and the current
   item. Nothing else.
2. **The accent never appears inside a chart, and chart colours never appear in site
   chrome.** Two separate palettes, kept separate.
3. **Colour is meaning, never decoration.** If a colour is not carrying information, it
   should be ink, muted ink, or a surface.
4. **Never colour alone.** Every chart with two or more series carries a legend, and four
   or fewer series are also labelled directly on the marks. Status colours always ship
   with an icon and a word.
5. **Chart series are assigned in fixed order and never cycled.** A seventh series folds
   into "Other", becomes small multiples, or the chart is split.
6. **Sequential scales are one hue, light to dark. Diverging scales are two hues with a
   neutral grey midpoint.** Never a rainbow. Never a hue at the midpoint.
7. **Colour follows the entity, not its rank.** Filtering to fewer states must not repaint
   the survivors.
8. **Text always wears an ink token, never a series colour.**
9. **No large areas of saturated colour.** Banners use `--colour-accent-soft` with a
   3px accent rail, never a fully saturated fill. This is the eye-comfort rule that
   actually matters.

### 8.4 Typography tokens

```css
:root {
  /* Source Serif 4 — essay body and headings. Screen-optimised, generous
     x-height, open licence. Signals edited and permanent.                  */
  --font-serif: "Source Serif 4", Georgia, "Times New Roman", serif;

  /* Public Sans — navigation, UI, labels, tool interfaces. The typeface of
     the US Web Design System, drawn specifically for public information.    */
  --font-sans: "Public Sans", -apple-system, BlinkMacSystemFont, "Segoe UI",
               Roboto, Helvetica, Arial, sans-serif;

  /* IBM Plex Mono — figures, data tables, code, dataset ids. True tabular
     figures, so digits align in a column.                                   */
  --font-mono: "IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo,
               Consolas, monospace;

  /* Reserved for a future /hi/ tree. Do not load until Hindi content exists. */
  /* --font-serif-devanagari: "Noto Serif Devanagari", serif; */
  /* --font-sans-devanagari:  "Noto Sans Devanagari", sans-serif; */

  /* Type scale — fixed. Never use a size that is not on this scale. */
  --size-xs:   0.75rem;   /* 12px — table footnotes, source lines */
  --size-sm:   0.875rem;  /* 14px — captions, labels, UI */
  --size-base: 1rem;      /* 16px — minimum for any body text  */
  --size-md:   1.125rem;  /* 18px — essay body */
  --size-lg:   1.375rem;  /* 22px — standfirst, h3 */
  --size-xl:   1.75rem;   /* 28px — h2 */
  --size-2xl:  2.25rem;   /* 36px — h1 */
  --size-3xl:  3rem;      /* 48px — home page only */

  --leading-tight: 1.15;  /* headings */
  --leading-body:  1.65;  /* body text — generous, this is a reading site */
  --leading-ui:    1.4;   /* labels, buttons, table cells */

  --measure: 68ch;        /* maximum line length for running text */
}
```

### 8.5 Typography rules

- **Essay body is serif at `--size-md` with `--leading-body`, capped at `--measure`.**
  Roughly 65–75 characters per line. Longer lines measurably hurt reading.
- **Navigation, buttons, form labels and tool interfaces are sans.**
- **All figures in tables and charts are mono with `font-variant-numeric: tabular-nums`,**
  right-aligned. In fiscal tables this is not a nicety — it is how a reader compares
  magnitudes at a glance.
- **Never below `--size-base` for anything a reader must read.**
- **Headings never skip a level.** One `h1` per page.
- **Never centre a paragraph.**
- **`text-wrap: balance` on headings**, `text-wrap: pretty` on paragraphs.

### 8.6 Shape — the vocabulary

```css
:root {
  --radius-data:    2px;    /* DATA — tables, chart plot areas, dataset cards, figures.
                               Square edges say: this is a record, presented as found. */
  --radius-control: 6px;    /* INTERACTIVE — buttons, inputs, filters, tool panels.
                               Softened edges say: you can touch this. */
  --radius-pill:    999px;  /* LABEL — tags, status badges, vintage markers. */
  --radius-dot:     50%;    /* POINT — scatter marks, status dots, timeline nodes. */
}
```

| Section | Shape language | Why |
|---|---|---|
| Header and footer | Full-bleed band in `--colour-chrome`, hairline rule in `--colour-chrome-rule`, no radius, no shadow | Structural. Separated from the page so its edges are legible, but a near-neutral so it still recedes. |
| Essay body | No containers at all inside the reading column. Just text on paper. | Nothing should compete with reading. A sidebar may sit **beside** the column — see §8.8 — but nothing may sit inside it. |
| Pull quotes, callouts, banners | Left rail 3px in accent, square corners, `--colour-accent-soft` background | Emphasis without boxing, and without a saturated fill. |
| Data tables | `--radius-data`, hairline rules, no shadow | A table is a record, not a card. |
| Charts | `--radius-data` on the plot frame, 4px rounded data-ends on bars | Rounded ends read as finished marks; the frame stays square. |
| Dataset cards | `--radius-data`, 1px border, no shadow | These are records too. |
| Tool panels and filters | `--radius-control`, 1px border | Signals interactivity before anything is clicked. |
| Buttons and inputs | `--radius-control`, visible border | Must look pressable. |
| Tags, status badges | `--radius-pill` | Reads as metadata, never mistaken for data. |

**Shadows are almost never used.** One elevation level exists, for genuinely floating
things only — a dropdown, a tooltip, a mobile filter sheet.

### 8.7 Spacing

```css
:root {
  --space-1: 0.25rem;  --space-2: 0.5rem;   --space-3: 0.75rem;
  --space-4: 1rem;     --space-5: 1.5rem;   --space-6: 2rem;
  --space-7: 3rem;     --space-8: 4rem;     --space-9: 6rem;
}
```

Use `gap` on a flex or grid parent rather than margins on children.

### 8.8 The page shell — one column or two

Every page is either one column or two. A two-column page is a reading column plus a
right-hand aside of `--width-aside`, and it collapses to one column below 64rem.

**What the aside is for.** Navigation of the material on the page, and nothing else: tags,
related pieces, links out, the state of a section. It never carries the argument. If
something in the aside is worth reading properly, it belongs in the main column.

**Rules.**

1. **The aside comes after the main column in the HTML.** A reader using a keyboard or a
   screen reader meets the content first. Never reorder them with CSS to put the aside
   first visually — the two orders would then disagree.
2. **The aside is set in `--font-sans` at `--size-sm` in `--colour-ink-muted`.** It is
   supporting material and should look like it.
3. **Running text in the main column stays capped at `--measure`** whether or not there is
   an aside. A wider column is not an invitation to longer lines.
4. **The aside may be sticky, but only when it is shorter than the viewport.** Use
   `position: sticky` with `align-self: start`; never give it its own scrollbar.
5. **Below 64rem the aside moves below the main column**, in full width, with a rule above
   it. It is never hidden — hiding it would hide the tags from every phone reader.
6. **No page has more than one aside**, and no aside has an aside.

---

## 9. Accessibility — WCAG 2.2 Level AA, minimum

The site exists to make economic information usable by everyone. Accessibility is part of
that purpose, not a compliance exercise.

**Perceivable**

- Contrast: **4.5:1** for normal text, **3:1** for large text (18.66px bold or 24px+) and
  for meaningful graphics, icons and control borders. The tokens in §8.2 already satisfy
  this in both themes — using them correctly is most of the job.
- **Never use colour alone to carry meaning.** See §8.3.
- Every image has `alt`. Decorative images get `alt=""`. **A chart's alt text states the
  finding, not the format**: "Committed expenditure rose from 38% to 52% of revenue
  receipts between 2015 and 2025" — not "bar chart of expenditure".
- Every data table has real `<th>` headers with `scope`, and a `<caption>`.
- Text survives 200% zoom and 400% reflow with no horizontal scrolling or lost content.

**Operable**

- **Everything works with a keyboard alone.** Tab to reach, Enter or Space to activate,
  Escape to close. Test by unplugging the mouse.
- Focus is **visibly** indicated. Never `outline: none` without an equally clear
  replacement. WCAG 2.2 sets a minimum size and contrast for the indicator.
- Touch targets at least **24×24 CSS pixels**, and 44×44 where there is room.
- Nothing flashes more than three times per second.
- Honour `prefers-reduced-motion: reduce`.
- Skip-to-content link as the first focusable element on every page.

**Understandable**

- `<html lang="en">` on every page.
- Every form control has a visible, programmatically associated `<label>`.
- Errors say what is wrong **and how to fix it**: "Upload a .csv or .xlsx file — that file
  was a .pdf", not "Invalid file".
- Navigation stays in the same place and order on every page.
- **Define every piece of jargon on first use.** A WCAG AAA item, adopted here as a floor,
  because it is the entire point of the site.

**Robust**

- Semantic HTML: `<nav>`, `<main>`, `<article>`, `<button>`, `<table>`. A `<div>` with a
  click handler is not a button and is invisible to a screen reader.
- ARIA only where semantic HTML genuinely cannot express it. **Bad ARIA is worse than none.**
- Content that updates without a page reload announces itself with `aria-live="polite"`.

### Before shipping any page or tool

1. Tab through it with no mouse. Can you reach and operate everything, and always see
   where you are?
2. Check contrast in light **and** dark themes.
3. Zoom to 200%. Does anything break or disappear?
4. Open it at 360px wide. Does the page scroll sideways? It must not.
5. Read the chart's alt text aloud. Does it convey the finding?
6. Every chart with two or more series: is there a legend, and a table view?

### Writing is part of accessibility too

Short sentences. Expand an abbreviation on first use. Meaningful link text — "read the
Fifteenth Finance Commission report", never "click here".

---

## 10. The tool contract

A tool is **a folder you drop in or delete**. Nothing outside the folder is edited either way.

```javascript
// src/tools/state-fiscal-explorer/tool.config.js
// This file describes the tool to the rest of the site. The tools index page,
// tags and sitemap are all generated from these files, so there is no list
// anywhere that has to be kept up to date by hand.

export default {
  id: "state-fiscal-explorer",     // must match the folder name exactly
  title: "State Fiscal Explorer",
  summary: "Own-tax revenue, committed expenditure and debt across states, 1990-2025.",
  fields: ["public-finance", "federalism"],
  datasets: ["states/rbi-state-budgets"],  // dataset ids — draws the provenance box
  engine: "arquero",               // arquero | duckdb-wasm | none
  minViewport: "lg",               // below this width, ToolFrame shows the wider-screen card
  status: "stable",                // draft | beta | stable | retired
  updated: "2026-08-14",
};
```

**ToolFrame does the shared work once** — title and summary, the provenance box built from
`dataset.json`, the download link, the status badge, the small-screen card driven by
`minViewport`, an error boundary so a broken tool cannot take down the page, and lazy
loading.

**Lazy loading is not optional.** Use Astro's `client:visible` so a reader who never opens
a tool never downloads its code.

**Retiring a tool:** set `status: "retired"`. The page stays live with a banner explaining
what replaced it and the data still downloadable, but it drops out of the index.

**Testing the contract:** whenever a tool is added, delete its folder, run the build,
confirm it succeeds, then restore it.

---

## 11. Content rules

### The sections, and what belongs in each

| Nav label | URL | Holds |
|---|---|---|
| Home | `/` | The newest piece, then recent writing. Datasets, Tools and subjects in the aside. |
| Writings and Notes | `/writing/` | Every piece — essays, notes and archived Substack posts — newest first. |
| Datasets | `/datasets/` | One entry per published dataset. |
| Tools | `/tools/` | One entry per tool. |
| About | `/about/` | Who Anupam is, and what the site is for. |
| — | `/notes/` | Notes only. Reachable from the Writings and Notes aside, not from the nav. |
| — | `/now/`, `/contact/` | Footer only. |
| — | `/search/` | The search box in the header submits here. Not a nav word. |

**A nav item may lead to a section with no entries yet**, provided the page says plainly
what is coming. It may never lead to a 404 or a page that is simply blank.

**`/writing/` is the combined listing and `/notes/` is a filtered view of it.** They are one
destination to a reader and two URLs on the server, because both were published and rule 8
says neither may break.

### Essay frontmatter

```yaml
---
title: "The GST compensation cliff and what states do next"
description: "One sentence. Used in search results and link previews."
date: 2026-09-15                 # ISO — software reads this
updated: 2026-10-02              # only if substantively revised
tags: ["public-finance", "federalism", "gst"]
canonical: "self"                # "self" | "substack"
substackUrl: ""                  # filled in after cross-posting
datasets: ["union/gst-collections"]   # renders a "data behind this piece" box
draft: false
---
```

### Canonical URLs

- **Written here first** (essays with tables, charts, citations): canonical is this site.
  Paste into Substack afterwards and set Substack's canonical field to the site URL.
- **Written in Substack first** (quick commentary): canonical is Substack. The archiver
  pulls it into `content/external/` and the site's copy points outward.

### Substack

**Substack has no official publishing API.** Every wrapper is reverse-engineered or a paid
relay, and both break without warning. Never make anything depend on one.
`scripts/archive-substack.mjs` reads the **public RSS feed** only, and must degrade
gracefully: if the feed is unreachable, the build still succeeds.

The feed is `https://asranupam.substack.com/feed`.

> **A trap worth knowing about.** `anupamkumar.substack.com` also exists and belongs to a
> **different Anupam Kumar**, a tech policy researcher writing on data, AI and
> sustainability. Pointing the archiver at that address would publish another person's
> writing under this site's name. The address is set once, as a named constant at the top
> of the archiver, with a warning comment beside it.

Files in `content/external/` are generated. Never hand-edit them.

---

## 12. Performance and responsive tiers

Most readers arrive on a mid-range Android phone from a link in WhatsApp.

| Page type | JavaScript | Total transfer | Largest paint |
|---|---|---|---|
| Essay | < 15 KB | < 250 KB | < 1.5 s |
| Home and section listings | < 15 KB | < 250 KB | < 1.5 s |
| Dataset page | < 40 KB | < 400 KB | < 2.0 s |
| Tool page, before interaction | < 60 KB | < 500 KB | < 2.5 s |
| Tool page, after the user opens the tool | no cap | no cap | on user action only |

The last row is the point of the whole design: **heavy things are allowed, but only after
someone has chosen them.**

- **Tier A — everything written.** Essays, dataset pages, search. Excellent on a phone, no
  compromises, no notices. This is most of the traffic.
- **Tier B — tools that adapt.** Filters collapse into a bottom sheet; a wide table becomes
  a stack of cards; a chart gets one clear default view instead of six toggles. **Aim here
  by default.**
- **Tier C — tools that genuinely cannot.** Set `minViewport: "lg"`. Write the notice as a
  handoff, never a refusal: say what the tool does, offer the dataset download, offer to
  send the link.

Tables and charts scroll inside their own container. **The page body never scrolls sideways.**

---

## 13. Automated workflows

### What a workflow is

A **workflow** is a file in `.github/workflows/` that tells GitHub: *when this happens, run
these steps.* GitHub runs them on its own computers, free for public repositories. Nothing
runs on Anupam's machine. He sees a green tick or a red cross next to his commit.

**Yes, this project needs them.** The first is not optional: without it there is no
published site. The rest replace checks a person would otherwise have to remember, which on
a one-person project means they would not get done.

| File | When it runs | What it does | Add in |
|---|---|---|---|
| `deploy.yml` | Every push to `main` | Builds the site and publishes it to GitHub Pages. **Essential — this is what makes the site exist.** | Done |
| `archive-substack.yml` | Daily, and on demand | Tries to fetch the Substack RSS feed. **Does not work — see below.** | Done |
| `check-links.yml` | Weekly | Finds dead links and reports them. **Government URLs rot constantly** — indiabudget.gov.in reorganises most years. Without this, a two-year-old essay quietly becomes uncitable. | Done |
| `accessibility-check.yml` | Every push and pull request | Runs `npm run check-a11y`: every page in light, in dark, and at 360px, failing on any violation or sideways scroll. Catches roughly a third of issues; the rest still need the manual list in §9. | Done |
| `validate-data.yml` | Any push touching `data/` | Checks every `dataset.json` parses, every column it declares exists in the CSV, no file exceeds 50 MB, and every dataset has a README, SOURCES and CHANGELOG. **Note it validates each dataset against its own declaration — not against a global schema.** | Phase 2 |
| `dataset-freshness.yml` | Monthly | Compares each dataset's `retrieved` date against its `stale_after_months` and opens one issue listing what needs refreshing. | Phase 2 |
| `lighthouse.yml` | Every pull request | Measures page weight and load time against §12. Performance budgets that are not enforced are decoration. | Phase 3 |

There is no workflow that builds the registry. It is an endpoint served at
`/registry.json`, generated on every build — see §6.2.

**The Substack archiver does not work from GitHub, and this is expected.** Substack refuses
requests coming from a data centre and answers 403 whatever headers are sent, tested on
11 September 2026. The script gives up quietly so the run still passes, because nothing on
this site may depend on Substack being reachable. **The reliable route is
`npm run archive-substack` on Anupam's own machine**, then committing what it wrote. The
workflow is kept only because it costs nothing and would start working on its own if
Substack relaxed. Do not replace it with a third-party relay or a reverse-engineered API.

**`check-links.yml` writes its report to the run summary**, and additionally tries to open
an issue. Repository Issues are currently switched off, so that step fails harmlessly and
the report is read from the run summary instead. To switch issues on: `gh repo edit
--enable-issues`.

### Rules for writing workflows here

- **Pin action versions** (`actions/checkout@v4`, not `@main`).
- **Comment every workflow file heavily**, with a plain-English sentence at the top saying
  when it runs and what it does. These are YAML, which Anupam has not seen before.
- **A workflow that commits to the repository must skip its own commits**, or it triggers
  itself in a loop.
- **Never put a secret in a workflow file.** Needing one is a signal that something is
  wrong with the design.
- **Any workflow that can fail the build must explain what to fix**, in plain English.

### Human workflows — routines worth writing down

In `docs/checklists/`, because a one-person project forgets things.

**Publishing an essay:** draft in `content/essays/` → check every figure against its source
dataset → confirm every dataset referenced is published and current → build locally and
read it at phone width → commit and push → confirm the green tick → paste into Substack and
set the canonical URL.

**Adding a dataset:** create the folder → download raw sources into `raw/` **and record
every URL and date in `SOURCES.md` before doing anything else** → decide what shape this
dataset actually is (§6.3) and build only what it needs → write `dataset.json` describing
the columns it genuinely has → write README and CHANGELOG → if there are build scripts, run
the full chain from scratch to prove it is reproducible → commit.

**Quarterly review:** export the Substack subscriber list → check the freshness issue and
refresh stale datasets → review tool usage and retire anything unused → confirm the domain
renewal date → verify a fresh clone still builds.

---

## 14. Git, for someone who has done it once

Assume nothing is remembered.

```bash
git status                             # what has changed? Always safe. Run it often.
git add .                              # stage everything that changed
git commit -m "essay: add GST piece"   # save a snapshot, with a message
git push                               # send it to GitHub — this publishes the site
git pull                               # get changes made elsewhere before starting work
```

### The project's own commands

```bash
npm run dev                # local preview while writing. Ctrl+C stops it.
npm run build              # build the site into dist/, and the search index
npm run preview            # serve what build produced — the only way to test search
npm run check-a11y         # accessibility check, needs a build first
npm run archive-substack   # pull new Substack posts into content/external/
npm run relock             # rebuild package-lock.json after adding a dependency
```

### GitHub, from the terminal

`gh` is installed and signed in as `asrshadow`. It replaces the website entirely.

```bash
gh run watch               # watch the current build finish
gh run list --limit 5      # recent builds and whether they passed
gh run view --log-failed   # why the last failure happened
gh workflow run deploy.yml # publish again without changing anything
```

### One trap that will otherwise waste an afternoon

**After adding or removing any npm package, run `npm run relock`.** Installing on Windows
drops the Linux-only entries from `package-lock.json`, and GitHub's Linux build machines
then refuse to install with `npm ci can only install packages when your package.json and
package-lock.json are in sync`. Nothing is wrong with the site; the lock file is just
incomplete. `npm run relock` writes it from scratch, which records every platform.

**When giving instructions:** write the command in full, say in one line what it does, and
say what he should expect to see afterwards. Never write `git commit -am "..."` or other
compressed forms.

**Never suggest** `git push --force`, `git reset --hard`, `git rebase`, or anything that
rewrites history, without explaining exactly what will be lost and confirming first.

**If something goes wrong,** stop, run `git status`, and read the output together — do not
try another command.

### `.gitignore` essentials

```
node_modules/
dist/
.astro/
.DS_Store
.env
.env.*
*.ipynb_checkpoints
__pycache__/
.Rhistory
.RData

# Microdata must never be committed — see §6.9
data/**/microdata/
*.dta
*.sav
```

---

## 15. How to work with Anupam

**Do:**

- Explain the reasoning behind a technical recommendation in terms of consequences he can
  evaluate — cost, maintenance burden, what breaks later — rather than technical merit.
- Say plainly when a request would create a problem later, and propose the alternative.
- Give complete files rather than fragments when he will be copying something in.
- Work in small, complete steps that each end somewhere safe.
- Treat him as a full expert on public finance, policy and economics.

**Do not:**

- Use a technical term without defining it the first time.
- Say a step is "simple", "easy" or "just" anything.
- Assume a tool, package or setting is installed. Check, or include the install step.
- Add a dependency, framework or service without asking.
- Invent a colour, size or spacing value instead of using a token.
- Impose a column structure on a dataset that has not been looked at yet.
- Build more folder structure than a dataset actually needs.
- Leave generated code uncommented, or a script without a README.

### Definition of done

- [ ] Code commented densely enough to follow without knowing the language.
- [ ] A `README.md` exists and is current.
- [ ] The site builds with no errors.
- [ ] Every colour, size and spacing value comes from a token in §8.
- [ ] Keyboard operable; contrast passes in both themes.
- [ ] Does not scroll sideways at 360px wide.
- [ ] Within the performance budget in §12.
- [ ] If a tool: deleting its folder still leaves the site building.
- [ ] If a dataset: `dataset.json`, `SOURCES.md`, `CHANGELOG.md` and `README.md` present,
      every column described with its unit, and no structure created that it did not need.
- [ ] If derived data: `LINEAGE.md` and `METHOD.md` present.
- [ ] Commit message says what changed, in plain English.

---

## 16. Current state

**Phase 1 — the writing site.** Phase 0 is complete.

### Phase 0 — the permanent layer (done, 11 September 2026)

- [x] `anupamkumar.org` registered at Namecheap, locked, auto-renew on
- [x] DNS pointed at GitHub Pages: four A records, four AAAA records, `www` CNAME
- [x] `hello@anupamkumar.org` forwarding set up through Namecheap
- [x] Node.js confirmed installed; GitHub CLI installed and signed in
- [x] Repository `asrshadow/anupamkumar.org` created, public, issues and wiki off
- [x] Folder skeleton, three licence files, `.gitignore` and `.gitattributes`
- [x] All eight `data/` group folders plus `_reference/` and `_templates/`, each with a
      README saying what belongs there
- [x] `src/styles/tokens.css` written from §8
- [x] `deploy.yml` publishing on every push

### Phase 1 — writing only, no tools (mostly done)

- [x] Astro with content collections for essays, notes and archived Substack posts
- [x] Home, writing, notes, about, contact, now, search, tag and 404 pages
- [x] RSS feed, sitemap, Pagefind search, dark mode with no flash on load
- [x] Substack RSS archiver and its daily workflow
- [x] Accessibility check and dead-link check workflows
- [ ] **Four real pieces published. One so far.** This is the remaining item and it is the
      point of the phase. A site with four good essays and no tools is a real site; a site
      with three tools and no writing is a portfolio of unfinished experiments.
      - [x] *BRICS — an economic multilateral association of emerging market economies*,
            12 September 2026
- [ ] Delete the two placeholder pieces once there is enough real writing:
      `content/essays/11-09-2026-hello.md` and
      `content/notes/11-09-2026-what-notes-are-for.md`.
      **The essay placeholder can go now** — the BRICS piece is newer, so the home page
      would still lead with real writing. **The note placeholder cannot yet**: it is the
      only note, and deleting it leaves `/notes/` empty.

### Layout and sections — the 12 September 2026 work order

Steps 1 to 10 done and published on 12 September 2026.

- [x] 1 — CLAUDE.md amended to v1.3 for the new layout, navigation and sections
- [x] 2 — the header and footer colour band
- [x] 3 — `PageShell` and `SideBlock`, the two-column page
- [x] 4 — new navigation, search box in the header, `/search/` reads `?q=`
- [x] 5 — the home page leads with the newest piece
- [x] 6 — Writings and Notes gets a right-hand column
- [x] 7 — essays and notes get a right-hand column, and a related-pieces list
- [x] 8 — the Datasets and Tools sections, and `/registry.json`
- [x] 9 — About, rewritten with a profile and photo
- [x] 10 — full check, then publish
- [x] 11 — a real piece published. Three more wanted; see the Phase 1 item above.

**Added after the work order**, on the same day: a piece's first image is used
automatically as its thumbnail on the home page and every listing, and listing entries
carry the same forty-word summary the featured piece uses. See §17.1.

### Picking this up again

**Adding a post needs no code and no session with Claude.** Write the file, set
`draft: false`, push. The routine is §17.1, and the same thing in plainer words is
[docs/how-to/publish-a-piece-of-writing.md](docs/how-to/publish-a-piece-of-writing.md).
The first image in the piece becomes its thumbnail on its own.

**What is worth a session**, in the order it is worth doing:

1. **The first real dataset.** Needs the detail page at `/datasets/<id>/` and the endpoint
   that serves each dataset's files. The reader and `/registry.json` are already built and
   tested, so this is smaller than it was.
2. **The first tool**, with `ToolFrame` built alongside it.
3. A chart in a piece, if one is wanted before either of the above. §17.1 settles how
   charts are exported and why they are treated as printed plates in both themes.

**Deliberately not built yet**, and both for the same reason — a page designed against zero
examples fits the first real example badly and sets a precedent by then:

- `/datasets/<id>/` and the endpoint that serves each dataset's files. Build alongside the
  **first real dataset**. `src/lib/datasets.ts` and `/registry.json` already exist and are
  tested, so that session is the detail page and the download endpoint only.
- `ToolFrame`, specified in §10. Build alongside the **first real tool**.

### Verified on 12 September 2026, on the published site

- Zero accessibility violations across all 16 pages, each checked in the light theme, the
  dark theme and at 360px, against WCAG 2.0, 2.1 and 2.2 at level AA
- No sideways scrolling at 320px, 360px, 640px (which is 200% zoom) or 1280px, in both
  themes, on every page
- Every control reachable by keyboard in document order, with a visible focus ring
- Search from the header works from any page, and the search page explains itself with
  JavaScript switched off
- Zero dead internal links across the whole built site
- Deleting `src/tools/` still builds and `/tools/` still shows its empty state, so the
  one-way import rule holds before the first tool exists

### Page weight, measured on the built site

An essay page ships **no JavaScript at all** beyond two small inline scripts. Weight is
almost entirely fonts, and a photograph where a piece has one.

Measured cold, one page per fresh browser, so nothing is hidden by a warm cache.

| Page | Total | Images | Budget |
|---|---|---|---|
| Essay with a photograph | 223 KB | 69 KB | < 250 KB |
| Essay without one | 187 KB | — | < 250 KB |
| Home, with a featured image and thumbnails | 200 KB | 28 KB | < 250 KB |
| Writings and Notes, with thumbnails | 158 KB | 7 KB | < 250 KB |

The rest is almost entirely fonts. **Measure cold.** A second page in the same browser
reuses the fonts and reports a figure a first-time reader will never see.

> **A font trap that cost 100 KB a page, recorded so it is not repeated.** Importing
> `@fontsource/<family>/latin-400.css` alongside `latin-ext-400.css` looks leaner than the
> plain `400.css` and is the opposite. **The per-subset files carry no `unicode-range`**,
> so they are two identical `@font-face` declarations for one family, style and weight, and
> the browser cannot choose between them by which characters a page uses. It fetches both.
> That put 16 font files and 245 KB on a page with no accented characters at all.
>
> The plain `400.css` declares every subset *with* its range, so only the needed subsets
> download: six to eight files instead of sixteen. The stylesheet is about 12 KB larger and
> that is a good trade.
>
> **Measure the fonts a page actually downloads before believing any change here is an
> improvement.** This was estimated rather than measured for a day, and the estimate was
> wrong by more than 100 KB.

**A photograph in a piece** is resized to about 1280px before being committed, which covers
a high-density screen at the 612px reading column. Astro converts it to WebP at build time.

**Resist building a tool until the writing exists.** Phase 2 is the data layer, Phase 3
the first two tools. The full roadmap is in the architecture blueprint.

---

## 17. The three routines

What Anupam has to do, from now on, for each of the three things he will do repeatedly.
The same text is in `docs/how-to/` as three separate files.

### 17.1 Publishing a piece of writing — no code, ever

This already needs no code and will not start needing any.

1. **Make a file** in `content/essays/` for a long piece, or `content/notes/` for a short
   one. Name it `DD-MM-YYYY-short-slug.md` — the date is for the file list; it does not
   appear in the web address.

2. **Put the frontmatter at the top**, between two `---` lines:

   ```yaml
   ---
   title: "The GST compensation cliff and what states do next"
   description: "One sentence. This is what shows in search results and in the listing."
   date: 2026-09-15
   tags: ["public-finance", "federalism", "gst"]
   draft: true
   ---
   ```

   `date` is ISO — `YYYY-MM-DD` — because software reads it. The filename is DD-MM-YYYY
   because a person reads it. They are different formats on purpose and both are correct.

3. **Write the piece in Markdown below it.** `##` for a heading, `*word*` for italics,
   `[text](address)` for a link, a blank line between paragraphs.

4. **Look at it:** `npm run dev`, then open the address it prints. `draft: true` hides it
   from the built site, so leave it there while writing.

5. **When it is ready:** change `draft: true` to `draft: false`, check every figure against
   its source, and read it once at phone width.

6. **Publish:**

   ```bash
   git add .
   git commit -m "essay: add the GST compensation cliff piece"
   git push
   ```

   Then `gh run watch`. A green tick means it is live, usually within two minutes.

7. **If it is also going to Substack:** paste it there afterwards and set Substack's
   canonical URL field to the address on this site, so the two copies do not compete in
   search results. Then put the Substack address in the piece's `substackUrl` field here
   and push again.

   **If it is not going to Substack — which is the normal case — there is nothing to do.**
   Leave `substackUrl` out entirely. `canonical` already defaults to `"self"`, which tells
   search engines this site is the original. A piece published only here is the default
   shape of a piece, not a special case, and nothing on the page will mention Substack.

**The only fields worth remembering** are `title`, `description`, `date`, `tags` and
`draft`. Everything else has a sensible default. The full list is in §11.

**If you get a field wrong, the build stops and names the file.** That is the content
schema in `src/content.config.ts` doing its job. A red cross is not a disaster; read what
it says.

#### Images, charts and links inside a piece

**Links** are plain Markdown: `[the Fifteenth Finance Commission report](https://…)`.
§9 asks for link text that means something on its own — never "click here", never a bare
URL, because a screen reader user often navigates by jumping between links and hears only
the link text.

**Images and charts live in a folder beside the piece, named after the piece.**

```
content/essays/
├── 15-09-2026-gst-compensation-cliff.md
└── 15-09-2026-gst-compensation-cliff/
    ├── committed-expenditure-share.svg
    └── collections-by-state.png
```

Reference them with a relative path:

```markdown
![Committed expenditure rose from 38% to 52% of revenue receipts between 2015 and 2025.](./15-09-2026-gst-compensation-cliff/committed-expenditure-share.svg)
```

Astro sees the relative path, runs the file through the same optimiser the profile photo
uses, and writes the width and height into the page. **An image referenced this way costs
nothing to maintain and needs no code.** An image dropped in `public/` and linked as
`/something.png` skips all of that and ships at full size — do not do it.

**This was tested on 12 September 2026 and works**, despite the content collections having
their `base` outside `src/`. A PNG referenced this way was converted to WebP automatically,
both files were emitted with a content hash, and both `<img>` tags carried a `width` and a
`height` — which is what stops the page jumping about as it loads. Nothing had to be
configured.

#### The first image becomes the piece's thumbnail

**Nothing has to be written in the frontmatter for this.** The first image in a piece is
used automatically as its thumbnail on the home page and on every listing, beside the title
and the summary. Put a different image first and the thumbnail changes with it.

| Where | Size | Shape |
|---|---|---|
| Featured piece, top of the home page | 640px wide | 21:9, a wide shallow crop so the title still fits on the first screen |
| A listing entry, wide screen | 120px wide, beside the text | 4:3 |
| A listing entry, phone | full width, above the text | 16:9 |

The picture is cropped to fill those shapes, so a row of entries lines up down the page
whatever shape each source image happens to be.

**A piece with no image simply has no thumbnail**, and its entry spans the full width. No
placeholder is drawn. An empty grey box promises a picture that does not exist, and this
site does not draw skeletons for things that are not there.

**An archived Substack piece gets no thumbnail either**, because its images live on
Substack's own servers. Drawing the site's appearance from there would put it back in the
hands of a company the architecture is designed not to depend on. If that becomes worth
changing, the fix is for `scripts/archive-substack.mjs` to download the images into the
repository, not for the pages to link out to them.

**The thumbnail carries `alt=""`, deliberately.** It is decorative in a listing: the title
sits beside it and says where the link goes, so describing the picture again would make a
screen reader read the same entry twice. The real alt text stays on the image inside the
piece, where it does the work. This is the one place on the site where an empty `alt` is
correct.

**Resize a photograph to about 1280px before committing it.** That covers a high-density
screen at the 612px reading column. Anything larger sits in Git history forever for no
visible gain. The build makes every smaller copy it needs from that one file.

**The alt text states the finding, not the format.** This is §9 and it is the rule most
often got wrong. "Committed expenditure rose from 38% to 52% of revenue receipts between
2015 and 2025" is alt text. "Bar chart of expenditure" is not — it tells a reader who
cannot see the chart nothing they did not already know from the sentence above it.

**Charts: export from Python or R as SVG where you can.** An SVG stays sharp at any zoom,
is usually smaller than a PNG of the same chart, and its text is real text. Use PNG only
for something genuinely photographic. Use the `--chart-*` colours from §8.2 in the same
fixed order, never the accent green: §8.3 rule 2 keeps the chart palette and the site
palette apart.

**One thing about charts and the dark theme, decided now so it does not get decided
accidentally.** A chart exported from matplotlib or ggplot carries its own background. On
the dark theme a white-backed chart becomes a bright panel in the middle of a dark page.
The rule for now: **export charts on `--chart-surface` white, and treat the figure as a
printed plate** — a light rectangle with `--radius-data`, the same in both themes. It is
honest, it is what most data publications do, and it needs no machinery.

The better answer, when there are enough charts to justify it, is to export each chart
twice and swap them with `prefers-color-scheme` in a small `<Figure>` component. That is
worth building at roughly the fifth chart, not the first.

**A chart with two or more series needs a legend, and four or fewer also need labels
directly on the marks** — §8.3 rule 4. If the chart is interactive rather than a picture,
it is not a chart in an essay any more; it is a tool, and §17.3 applies.

### 17.2 Adding a dataset — no code, once the detail page exists

Today this needs one build session: `/datasets/<id>/` and the download endpoint do not
exist yet, and are deliberately being built alongside the first real dataset rather than
against none. **After that session, it is folders and files and no code at all.**

1. **Decide where it goes.** §6.2: one of the eight fixed groups, by *jurisdiction*, never
   by topic. Topic goes in `keywords`, where one dataset can carry several and they can
   change without moving a file.

2. **Make the folder**, `data/<group>/<publisher-or-subject-slug>/`, no year in the name.

3. **Download the source files into `raw/` and write `SOURCES.md` before doing anything
   else.** Every file: where it came from, the direct URL, and the date. Do this first,
   while the browser tab is still open — reconstructing a URL three months later is the
   single most reliably painful thing in this whole workflow, and government portals
   reorganise constantly.

4. **Decide what shape this dataset actually is** — §6.3. Most are a tiny series or a
   medium table and need one CSV and nothing else. **Do not build a `build/` folder, a
   `METHOD.md` or a script for a dataset that did not need cleaning.** Structure that
   exists to look consistent teaches the next dataset to be more complicated than it is.

5. **Put the clean CSV in `clean/`.** UTF-8, one header row, nothing above it, no merged
   cells, no blank rows. Column names in `lowercase_snake_case` with the unit in the name
   or in its description.

6. **Write `dataset.json`.** Copy the nearest example from `data/_templates/`. Fill in the
   administrative fields — id, title, description, keywords, sources, licenses, updated,
   stale_after_months — and then describe every column the file actually has, in that
   dataset's own words, with its unit. Nothing prescribes what the columns must be.

   **Every column in the file must appear here, and every one must state its unit.** A
   column whose unit a reader has to guess is how a public finance dataset gets misused.

7. **Write `README.md` and `CHANGELOG.md`.** Plain English. If nothing was cleaned, the
   README says so: "no cleaning was needed; this is the source file with only the header
   row tidied" is a complete answer.

8. **Push.** The dataset appears at `/datasets/` and gets its own page, its download link
   and its entry in `/registry.json` automatically. **There is no list to update anywhere.**

**What can go wrong, and what it looks like:** if `dataset.json` has a typo the build stops
and names the file. If a column listed in `dataset.json` is not in the CSV, the
`validate-data.yml` workflow fails and says which column. Both are meant to happen and both
say what to fix.

### 17.3 Adding a dashboard or tool — this one needs code

There is no way round this and it is worth being straight about it. A dashboard is a
program: it reads data, watches filters, and redraws a chart. Writing and datasets are
content and can be pure content. A tool cannot be.

**What is true, though, is that a tool here is small and self-contained**, and the site's
architecture means you are never editing the site to add one.

1. **The dataset comes first.** Publish the data as a dataset by §17.2 before building
   anything that reads it. A tool with data that exists only inside it is not citable and
   not checkable.

2. **One folder, `src/tools/<tool-id>/`**, holding everything the tool needs. §10.

3. **`tool.config.js`** describes it to the rest of the site — id, title, summary, which
   datasets it uses, which engine, minimum viewport, status, updated. The tools index, the
   tags and the sitemap are all generated from these files. **There is no list to maintain.**

4. **`tool.js`** is the tool itself, following the five-step pattern in §4.4: load the data
   once, read the filters, keep the rows those filters select, hand them to Observable
   Plot, repeat when a filter changes. No React, no Vue. §4.4 explains why, and the short
   version is that a dashboard with a few filters and a few charts is a readable script,
   and a framework would add a build step and 45 KB in exchange for nothing.

5. **Only the libraries in §4.3.** Observable Plot for charts, Arquero for reshaping.
   DuckDB-WASM only when a dataset is genuinely too big for Arquero — several megabytes is
   a real cost to a reader on a phone.

6. **`README.md`** beside it, per §4.5, written for Anupam in two years having forgotten
   everything.

7. **Before committing, delete the folder and run `npm run build`.** It must still succeed.
   That is the one-way import rule (rule 5) and it is what keeps any tool deletable.

**What Anupam can realistically do himself**, given Python at beginner level and no
JavaScript:

- Decide what the tool should show and which filters it needs. This is the part that
  actually determines whether the tool is any good, and it is entirely his.
- Prepare the data — clean it in Python, publish it as a dataset.
- Read `tool.config.js` and change the title, summary or status.
- Read the comments in `tool.js` and follow what it is doing.

**What needs Claude Code:** writing `tool.js`, and changing what the tool does. Ask for
changes in terms of behaviour — "add a filter for year", "show states as small multiples
instead of one crowded chart" — rather than in terms of code. Expect the comments to
explain the result back.

**A rule worth keeping:** if a tool starts needing React, the tool is too complicated.
Simplify the tool. §4.4.

---

*When this file and a request conflict, raise the conflict rather than silently choosing
one. This file can be changed — but deliberately, and by discussing it first.*
