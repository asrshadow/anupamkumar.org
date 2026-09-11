# data/surveys/

Datasets whose **unit of observation is a household, a person or a firm**.

## What belongs here

- Periodic Labour Force Survey
- National Sample Survey rounds
- National Family Health Survey
- Annual Survey of Industries
- Census of India
- Economic Census
- Any other survey where a row is someone or something, rather than a government

## What does not

- Aggregates a government publishes about its own finances — those go in the group that
  matches the jurisdiction.
- Anything computed by combining surveys — `../derived/`.

---

## Microdata is the special case — read this before creating a folder

Unit-level survey files are large and usually carry redistribution restrictions.

**Never commit microdata to this repository. Not to `raw/`, not anywhere, not once.**

Git keeps every version of every file forever. A restricted file committed and then deleted
is still in the history, still public, and removing it properly means rewriting history.
`.gitignore` excludes the usual formats as a safety net, but the rule is not "gitignore
it" — the rule is that it never enters the folder.

### What a microdata dataset folder contains instead

```
surveys/plfs/
├── README.md                 what this is, and what the licence permits
├── dataset.json              describing the published aggregates only
├── OBTAINING-THE-DATA.md     the portal, the login, the exact file and year
├── build/                    scripts that expect the raw file at a local path
│                             OUTSIDE this repository
└── clean/                    publishable aggregates only
```

`OBTAINING-THE-DATA.md` has to be good enough that someone else can follow it and arrive at
the identical file. That document is what replaces shipping the data, and it is what makes
the work reproducible despite the restriction.

### Before publishing any aggregate

Check the source's terms, and **record the conclusion in the README** — not just that you
checked, but what the terms actually say. Suppression rules for small cell counts vary by
survey, and "it is only a total" is not a safe assumption.

**When unsure whether an aggregate may be published, ask before publishing.**

**Last updated:** 11 September 2026
