# Checklist — adding a dataset

The order matters. Step 2 in particular is the one that is painful to do late.

---

## 1. Decide where it goes

Group by **jurisdiction**, never by topic. Whose data is it about?

`union` · `states` · `local` · `surveys` · `sectoral` · `international` · `derived`

If it does not obviously fit, it is almost always `derived/`. Each group has a README
saying what belongs there.

**Is this one dataset or two?** One dataset = one source release. Population from one
source and GDP from another are two datasets, even if they end up on the same chart.

Create the folder, named `lowercase-kebab-case` with **no year in the name**.

## 2. Download the raw files, and record them before doing anything else

- [ ] Save the source files, untouched, into `raw/`
- [ ] Write `SOURCES.md` **now**, with the exact download URL, the date, the publisher and
      the exact document or table name

Government and sector portal URLs rot constantly. Recording this after the cleaning is
finished means recording it from memory, and memory is where provenance goes to die.

**`raw/` is immutable from this moment.** Never edit, rename or clean a file in place.

## 3. Decide what shape this dataset actually is

Look at the data before deciding what to build. A tiny series that needed no cleaning is
complete with four files and no `build/` folder at all.

**Do not create empty folders or placeholder scripts to look consistent.**

## 4. Clean it, if it needs cleaning

- [ ] Scripts go in `build/`, numbered so the run order is visible from the filenames:
      `01_extract.py`, `02_clean.py`
- [ ] Output goes to `clean/`
- [ ] Every script re-runnable from scratch, producing identical output from the same
      `raw/` inputs
- [ ] Comment roughly every two or three lines, explaining why rather than what
- [ ] Print a short progress message at each major step

Watch for the four things that go wrong most often:

- [ ] **Vintages kept separate.** Budget Estimates, Revised Estimates and Actuals for one
      year are three facts, not one fact corrected twice
- [ ] **Nominal figures.** Never bake a deflator into published data
- [ ] **Years as rows, not as separate files**
- [ ] **Boundary changes handled explicitly**, never by quietly dropping rows

## 5. Write `dataset.json`

- [ ] Administrative fields: id, title, description, keywords, sources, licences,
      `updated`, `stale_after_months`
- [ ] **Every column in the file listed, each with a description stating its meaning and
      its unit.** A column whose unit a reader has to guess is the single most common way
      a public finance dataset gets misused

Use whatever column names the dataset genuinely needs. There is no global vocabulary here
and there never will be. The only conventions are `lowercase_snake_case` and carrying the
unit in the name or the description.

## 6. Write the documentation

- [ ] `README.md` — what this is, in plain English
- [ ] `CHANGELOG.md` — dated, including restatements made by the source, not only your own
      corrections
- [ ] `METHOD.md` — only if cleaning involved judgement calls worth defending
- [ ] `LINEAGE.md` — **required** for anything in `derived/`, naming every parent dataset,
      which columns were used, and what needs re-running if a parent is corrected

## 7. Prove it is reproducible

- [ ] Delete everything in `clean/`
- [ ] Run the build scripts from scratch, in order
- [ ] Confirm the output is identical

This is what makes the dataset citable. A cleaning process that cannot be re-run is an
assertion, not a method.

## 8. Check the size

- [ ] No file above roughly 50 MB. Git keeps every version forever, which is ruinous for
      large binaries. Large files go to object storage, with the URL in `dataset.json`
- [ ] **No survey microdata anywhere in the repository.** See `data/surveys/README.md`

## 9. Commit

```bash
git add .
git commit -m "data: add RBI state budgets, 1990-2025"
git push
```

---

**Last updated:** 11 September 2026
