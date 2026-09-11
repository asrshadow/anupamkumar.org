# data/_templates/

Starting points for a new dataset, so that the required files do not have to be written
from memory each time.

## The rule for this folder

**Templates record conventions. They never prescribe contents.**

A template can show the shape of `dataset.json` and remind you which files are required.
It must never carry a list of columns that a new dataset is expected to have. There is no
global column vocabulary in this project and there never will be — each dataset declares
its own columns, in its own words, with its own units.

## What will live here

- `dataset.json` with the administrative fields filled in as blanks and commented
- A skeleton `SOURCES.md`
- A skeleton `CHANGELOG.md`
- A skeleton `README.md` following the seven-point structure used everywhere in this
  repository

These get written when the first real dataset is added, not before, so that they describe
something that actually worked rather than something imagined.

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

**Last updated:** 11 September 2026
