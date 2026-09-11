# data/_reference/

Lookup tables that **more than one dataset agrees on**.

## The rule for this folder

**Empty is the correct state right now.** Add a table here the first time a *second*
dataset needs the same lookup — never in advance.

A reference table built before anything needs it is a guess about a join that has not
happened yet, and guesses like that quietly become rigid schemas imposed on data that did
not want them.

## What ends up here eventually

- **An alias table** mapping every spelling a source has ever used to one canonical name.
  This is the one that saves the most time, by a wide margin.
- Canonical names and codes for states, districts and other administrative units
- Deflator series, once two datasets need to deflate against the same one
- Currency conversion series
- Fiscal year definitions, where sources differ

## The alias table, when the time comes

Sources spell the same state `Odisha`, `Orissa`, `ODISHA`, `Odisha *`. The same is true of
ministry names, scheme names and district names, only worse.

When two datasets first disagree:

1. Create the mapping here, with a column for the spelling as found and a column for the
   canonical name.
2. Point both cleaning scripts at it.
3. Add a row every time a new spelling turns up, rather than patching one script.

Keep the source's own spelling in the raw file and in a column of the clean file where it
is useful. The alias table adds a canonical name; it does not erase what the source said.

## Boundary changes are not an alias problem

Andhra Pradesh before and after 2014 is not a spelling variation — it is a different
territory. Never handle it in the alias table. Handle it explicitly in each dataset's
`METHOD.md`, and never by quietly dropping rows.

## Structure

A reference table is a dataset like any other and needs the same four files: `README.md`,
`dataset.json`, `SOURCES.md` and `CHANGELOG.md`. Its columns are defined when it is
created.

**Last updated:** 11 September 2026
