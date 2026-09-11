# data/international/

Datasets published by a **multilateral or foreign body**.

## What belongs here

- World Bank: World Development Indicators, International Debt Statistics
- International Monetary Fund: World Economic Outlook, Government Finance Statistics,
  Article IV data
- OECD statistics
- United Nations agencies
- Asian Development Bank, Bank for International Settlements
- Another country's official statistics, where used for comparison

## What does not

- Indian data that happens to be **redistributed** by a multilateral body. Prefer the
  Indian source and file it by jurisdiction. Use the multilateral copy only when it is
  genuinely the better source — usually because it has harmonised across countries in a way
  the national source has not — and say so in the README.
- Cross-country comparisons you assembled — `../derived/`.

## Naming

Lead with the publisher, because that is what a reader checks first:
`worldbank-wdi`, `imf-weo`, `oecd-revenue-statistics`.

## Two warnings specific to this group

**Licences here are more restrictive and more varied than Indian government open data.**
The World Bank is mostly CC BY 4.0; the IMF is not uniformly open; the OECD has its own
terms. Check the licence for the specific product, not the organisation, and record it in
`dataset.json`. Do not assume a multilateral body means open data.

**Multilateral bodies revise history silently.** A World Economic Outlook vintage from
April is not the same file as October's, and figures for past years change between them.
Record the vintage, keep the downloaded copy in `raw/`, and never treat a re-download as
the same data.

**Last updated:** 11 September 2026
