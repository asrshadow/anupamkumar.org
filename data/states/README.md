# data/states/

Datasets about **state and union territory government finances**.

## What belongs here

- RBI, *State Finances: A Study of Budgets* — the annual compilation
- Individual state budget documents and finance accounts
- State GSDP series, including the state-wise estimates MoSPI publishes
- State own-tax and own-non-tax revenue series
- State debt, guarantees and off-budget borrowing
- State-wise shares of central transfers, as received

## What does not

- The Finance Commission's **recommended** devolution formula — that is a Union document
  about how the Union will transfer money, so it goes in `../union/`. What each state
  actually **received** belongs here.
- Municipal and panchayat finances — `../local/`.
- Anything computed across states that is not in a single source — `../derived/`.

## Naming

Folders are named for the **publisher or subject**, never the year:
`rbi-state-budgets`, `state-gsdp`, `state-own-tax-revenue`.

One folder usually covers all states. Do not create a folder per state unless a source
genuinely publishes them as separate, unrelated releases.

## Two warnings specific to this group

**State names are spelled inconsistently by every source.** `Odisha`, `Orissa`, `ODISHA`,
`Odisha *` with a footnote marker. The moment a second dataset disagrees with a first,
create an alias table in `../_reference/` and point both cleaning scripts at it. Do not
build that table in advance.

**Boundary changes must be handled explicitly, never by quietly dropping rows.** Andhra
Pradesh before and after the 2014 bifurcation is not the same territory, and neither is
Jammu and Kashmir before and after 2019. Record how each dataset handled it in that
dataset's `METHOD.md`, so a reader can see the decision rather than guess at it.

**Last updated:** 11 September 2026
