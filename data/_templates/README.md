# data/_templates/

Starting points for a new dataset, so that the required files do not have to be written
from memory each time.

## The rule for this folder

**Templates record conventions. They never prescribe contents.**

A template can show the shape of `dataset.json` and remind you which files are required.
It must never carry a list of columns that a new dataset is expected to have. There is no
global column vocabulary in this project and there never will be — each dataset declares
its own columns, in its own words, with its own units.

## What lives here

Written on 20 October 2026 from the first real dataset,
`international/nobelprize-economic-sciences`, which is also the best worked example to copy.

- `dataset.json`: the administrative fields, with each blank saying what goes in it. The site
  skips this folder, so the template never appears as a dataset.
- `SOURCES.md`: a skeleton.
- `CHANGELOG.md`: a skeleton.
- `README-template.md`: a skeleton following the seven-point structure used everywhere in this
  repository. Rename it `README.md` when you copy it.

## The four files every dataset needs

| File | Why |
|---|---|
| `README.md` | What this is, in plain English, for you in two years having forgotten everything |
| `dataset.json` | Machine-readable metadata: source, licence, vintage, and every column with its unit |
| `SOURCES.md` | Every raw file: where it came from, when, and the exact URL |
| `CHANGELOG.md` | Every change, dated, including restatements made by the source |

Two more only when they are genuinely needed:

| File | When |
|---|---|
| `METHOD.md` | Cleaning involved judgement calls worth defending. Always, for derived data. |
| `LINEAGE.md` | Derived data only. Names every parent dataset. |

## What not to copy

Do not copy an empty `build/` folder, a placeholder script, or a `METHOD.md` with nothing
in it. A tiny series that needed no cleaning is complete with four files, and pretending
otherwise teaches the next dataset to be more complicated than it needs to be.

**Last updated:** 20 October 2026
