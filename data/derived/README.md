# data/derived/

Anything **we computed**, or that combines more than one source.

If a figure was not published by somebody else in the form it appears here, it is derived
and it belongs in this folder.

## What belongs here

- A ratio or per-capita series built from two datasets
- A real-terms series produced by applying a deflator
- An index of any kind
- A cross-source or cross-country comparison assembled here
- A long series stitched together across a definitional break

## Lineage is mandatory

Every dataset here needs two extra files that dataset folders elsewhere do not:

```
derived/gdp-per-capita/
├── README.md
├── dataset.json       "derived": true, and sources list INTERNAL dataset ids
├── LINEAGE.md         REQUIRED
├── METHOD.md          REQUIRED
├── build/
└── clean/
```

`LINEAGE.md` states, in a table: every parent dataset id, which of its tables and columns
were used, the version or retrieval date of the parent that was used, and **what needs
re-running if that parent is corrected**.

`METHOD.md` states what was computed and why, including every judgement call — which
deflator, which base year, how a definitional break was bridged, what was excluded.

## Why this matters more than it looks

Without lineage, a correction upstream silently invalidates every derived figure that used
it and nobody ever finds out. With lineage, finding what to re-run is a search.

For a site whose credibility rests on provenance, this is not paperwork. It is the product.

## The labelling rule

**A derived figure must never be presented as a source figure.** Anything with
`"derived": true` is labelled as such wherever the site shows it. A reader must always be
able to tell the difference between a number a government published and a number we
calculated.

## Before creating a folder here

Ask whether the combined series needs to be **published** at all. If a chart simply needs
two datasets together, join them at chart time in the tool or the build script. A derived
dataset is for when the computed series is itself worth citing.

**Last updated:** 11 September 2026
