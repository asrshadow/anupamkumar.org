# data/union/

Datasets published by the **Union government about Union finances**.

## What belongs here

- Union Budget documents: Expenditure Profile, Expenditure Budget, Receipt Budget,
  Demands for Grants, the Budget at a Glance statements
- Controller General of Accounts monthly accounts
- Comptroller and Auditor General reports on Union finances
- Finance Commission reports and the devolution shares they recommend
- Union-level tax collection series from CBDT and CBIC
- Medium Term Fiscal Policy statements and FRBM documents

## What does not

- Anything about a state's own finances, even when the Union published it — that goes in
  `../states/`. The test is **whose finances the dataset is about**, not who typed it up.
- Household, person or firm level data — `../surveys/`.
- A sector portal run by a Union ministry — `../sectoral/`. A power generation series from
  the Central Electricity Authority is sectoral, not Union finance.
- Anything computed by combining sources — `../derived/`.

## Naming

Folders are `lowercase-kebab-case` and carry **no year**: `budget-expenditure`, not
`budget-expenditure-2026`. Years are rows inside the file, so one folder covers every year
the dataset has and keeps covering them as it is updated.

The dataset's id is the folder path: `union/budget-expenditure`.

## A warning specific to this group

Union Budget documents publish **Budget Estimates, Revised Estimates and Actuals** for
overlapping years. These are three different facts about the same period, not corrections
of one another. Keep all three, distinguished by a column, and never let a later vintage
overwrite an earlier one. Getting this right is a visible mark of competence and getting it
wrong quietly corrupts every comparison built on the data.

**Last updated:** 11 September 2026
