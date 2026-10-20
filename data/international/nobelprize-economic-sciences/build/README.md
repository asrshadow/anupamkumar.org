# build/ — how the clean tables are made

## What this does

Two Python scripts, run in number order. The first downloads the official data into `raw/`. The
second turns it into the two published CSVs in `clean/`.

## How to run it

Open a terminal in VS Code (Terminal → New Terminal). It opens at the top of the repository.

```bash
python data/international/nobelprize-economic-sciences/build/01_download.py
```

What you should see: two "Saved … records" lines, or two "Already downloaded, left untouched"
lines if the files are already there. Either is correct.

```bash
python data/international/nobelprize-economic-sciences/build/02_clean.py
```

What you should see: a few progress lines ending with `Wrote clean/laureates.csv (101 rows)`,
`Wrote clean/prizes.csv (58 rows)` and `Done.`

Running `02_clean.py` twice gives byte-identical files. That is what makes the dataset
reproducible.

## What it reads and what it writes

| Script | Reads | Writes |
|---|---|---|
| `01_download.py` | the Nobel Prize API, over the internet | `raw/*.json`, only if not already there |
| `02_clean.py` | `raw/laureates-…json`, `raw/prizes-…json` | `clean/laureates.csv`, `clean/prizes.csv` |

## Dependencies

Python 3 only. Both scripts use Python's built-in modules, so nothing needs installing.

## How to change the common things

**After next October's award:**

1. In `01_download.py`, change `DOWNLOAD_LABEL` (line 25) to that day's date in DD-MM-YYYY form.
2. Run `01_download.py`. The new files are saved beside the old ones, which stay untouched.
3. In `02_clean.py`, change `LAUREATES_FILE` and `PRIZES_FILE` (lines 20–21) to the new names.
4. Run `02_clean.py`.
5. Update `rows`, `retrieved` and `updated` in `../dataset.json`, the "1969–2026" in its title,
   the table in `../SOURCES.md`, and add an entry to `../CHANGELOG.md`.

## Known limitations

- The download only works from a home connection. The API blocks data centres, so a GitHub
  workflow cannot refresh it. See `../SOURCES.md`.
- The inflation-adjusted prize amount is deliberately not published. See `../METHOD.md` §5.

**Last updated:** 20 October 2026
