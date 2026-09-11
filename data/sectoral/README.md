# data/sectoral/

Datasets from a **sector portal or sectoral regulator**, at any level of government.

This is the group for data organised around a sector rather than around a government's
accounts. The publisher may well be a Union ministry; what puts a dataset here is that the
subject is the sector, not the finances of the body publishing it.

## What belongs here

- Agriculture: UPAg, crop production and price series
- Power: Central Electricity Authority generation and capacity data
- Health and education portals: HMIS, UDISE
- Transport, telecom and banking regulator statistics
- Environment and emissions inventories

## What does not

- A ministry's **budget allocation** — that is Union finance, `../union/`. The Ministry of
  Power's spending goes in `union/`; the Central Electricity Authority's generation series
  goes here.
- Household or firm level records — `../surveys/`.
- Anything computed across sources — `../derived/`.

## Naming

Include the publisher where it disambiguates: `cea-power-generation`, `upag-crop-prices`.
Sector portals change names and owners more often than finance ministries do, so naming for
the publisher makes a later rename traceable.

## A warning specific to this group

**Sector portal URLs rot faster than anything else in this repository.** Portals are
redesigned, moved between ministries and silently repopulated. Record the exact download
URL and date in `SOURCES.md` **before** doing anything else with a file, and keep the
original in `raw/` — for many of these, your copy will eventually be the only one.

**Last updated:** 11 September 2026
