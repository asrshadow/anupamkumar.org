# Economics Nobel laureates, 1969–2026

## What this is

Every winner of the economics Nobel, formally the Sveriges Riksbank Prize in Economic Sciences in
Memory of Alfred Nobel. It runs from the first award in 1969 to the 2026 award: 58 prize years and
101 laureates. The data comes from the Nobel Prize Outreach's own public API and is close to a
straight copy of it.

It feeds the **Economics Nobel timeline** tool (`src/tools/nobel-economics-timeline/`), and it is
published on its own at `/datasets/international/nobelprize-economic-sciences/` so that anyone can
download and cite it without the tool.

## What is in it

| File | Rows | One row is |
|---|---|---|
| `clean/laureates.csv` | 101 | one laureate in one prize year: citation, share, affiliation, birth and death |
| `clean/prizes.csv` | 58 | one prize year: date announced, number of laureates, prize money in nominal SEK |

Every column is described, with its unit, in `dataset.json`. The judgement calls — birth country
"then" versus "now", partial dates, multiple affiliations, why the inflation-adjusted prize money
is left out — are in `METHOD.md`.

## How to run it

To rebuild `clean/` from `raw/`, run this from the top of the repository:

```bash
python data/international/nobelprize-economic-sciences/build/02_clean.py
```

You should see it end with `Done.` Full instructions, including how to download a fresh copy, are
in `build/README.md`.

## What it reads and what it writes

`build/02_clean.py` reads the two JSON files in `raw/` and writes the two CSVs in `clean/`.
`raw/` is never changed.

## Dependencies

Python 3. Nothing else.

## How to change the common things

**Adding next year's prize.** Do this each October, once the award is announced. The steps are
in `build/README.md`, under "After next October's award". The dataset goes stale 13 months after
`updated`, and the site shows a banner when it does, so a missed October will not go unnoticed.

## Known limitations

- **No photographs.** Laureate portraits on nobelprize.org are not covered by the CC0 licence.
- **No inflation-adjusted prize money**, because the source does not state the base year.
- **The refresh cannot be automated on GitHub.** The API blocks data centres.
- **The data is about the prize, not the work.** The citations are the Nobel committee's own
  words. The plain-English explainers in the timeline tool are the site's own writing and are
  deliberately not part of this dataset.

## Licence

CC0, per the Nobel Prize API's terms, which also ask that the data not be altered to mislead or
used to discredit anyone. See `SOURCES.md`.

**Last updated:** 20 October 2026
