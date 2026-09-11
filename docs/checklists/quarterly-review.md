# Checklist — quarterly review

Four times a year, about half an hour. These are the things that decay silently, where
nobody tells you they have gone wrong.

---

## The domain — the only thing that cannot be replaced

- [ ] Confirm the renewal date at Namecheap is still years away
- [ ] Confirm auto-renew is on
- [ ] Confirm the card on file has not expired
- [ ] Confirm the registrar lock and WHOIS privacy are still on

**A lapsed renewal on a dead card is the single most common way a personal site dies.**
Everything else in this list is recoverable. This one is not. Every citation, backlink and
bookmark pointing at the work stops working, and somebody else can buy the name.

## The subscriber list

- [ ] Export the Substack subscriber list as a CSV
- [ ] Store it somewhere private — **not in this public repository**

The list is the asset. The platform holding it is not. If Substack disappeared, the
relationship with those readers survives only if this file exists somewhere.

## Datasets

- [ ] Read the freshness issue the monthly workflow opened
- [ ] Refresh anything past its `stale_after_months`, or extend the threshold deliberately
      if the source genuinely publishes less often than was assumed
- [ ] Check whether any source has **restated** figures already published here. A silent
      upstream restatement is the failure this review exists to catch
- [ ] For anything in `derived/`, check whether a parent dataset changed. `LINEAGE.md`
      turns this from guesswork into a search

## Links

- [ ] Read the issue the weekly link checker opened, and fix what it found

Government URLs rot constantly and indiabudget.gov.in reorganises most years. Without this,
a two-year-old essay quietly becomes uncitable.

## Tools

- [ ] Is anything unused? Set `status: "retired"` rather than deleting it. The page stays
      live, the data stays downloadable, published links keep working, and it drops out of
      the index
- [ ] Delete one tool folder, run `npm run build`, confirm it still succeeds, then restore
      it. This is the one-way import rule tested rather than assumed

## The three escalation triggers

The design assumes files are enough. Check whether any of the three things that would
change that has happened.

- [ ] **Size** — is the repository approaching 1 GB, or any single file 100 MB? The answer
      is object storage, not a database
- [ ] **Writes** — is there now a reason to accept something *from* visitors? This is the
      only trigger that genuinely needs a database, because static files cannot accept
      writes
- [ ] **Query scale** — does a tool need to scan tens of gigabytes? Unlikely. Indian public
      finance data is smaller than people assume

None of these is "the site got bigger".

## The build still works from nothing

- [ ] Clone the repository into a fresh folder somewhere else
- [ ] Run `npm install` and then `npm run build`
- [ ] Confirm it succeeds

This is the whole architecture tested in one command. If a fresh clone builds, the site can
be restarted years from now on whatever the best static host then is.

---

**Last updated:** 11 September 2026
