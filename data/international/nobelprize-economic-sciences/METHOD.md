# Method — the judgement calls

The cleaning is close to a straight copy of the source. These are the places where a choice had
to be made, recorded so it can be argued with.

## 1. What the prize is called

The prize is the **Sveriges Riksbank Prize in Economic Sciences in Memory of Alfred Nobel**,
founded by Sweden's central bank in 1968 and first awarded in 1969. It is not one of the five
prizes named in Alfred Nobel's will, though the Nobel Foundation administers it under the same
rules. The dataset's title uses "economics Nobel" because that is what readers search for; the
description gives the full name.

## 2. Birth country — then and now

The source gives both the country as named at the time of birth and the present-day country.
Both are published, because each answers a different question. Five laureates differ:

| Laureate | Born in (at the time) | Born in (now) |
|---|---|---|
| Simon Kuznets | Russian Empire | Belarus |
| Leonid Kantorovich | Russian Empire | Russia |
| Sir Arthur Lewis | British West Indies | Saint Lucia |
| Reinhard Selten | Germany | Poland |
| Daniel Kahneman | British Mandate of Palestine | Israel |

**To count laureates by country, use `birth_country_now`**, otherwise the Russian Empire appears
as a country with laureates.

## 3. Dates the source only partly knows

Six living laureates have only a birth year in the source, written as `1956-00-00`. That is not a
valid date, so `birth_date` is left empty for them and the year is kept in `birth_year`.

## 4. More than one affiliation

Seven laureates list two or three institutions for the year they were awarded. They are joined
into one cell with `; ` in the source's order, rather than split into extra rows, which would
double-count laureates. Hayek (1974) and Myrdal (1974) list none, and their cells are empty.

## 5. Prize money — nominal only

`prize_amount_sek` is the nominal amount for that year, as the source gives it. The source also
publishes `prizeAmountAdjusted`, but does not state the base year, and for 2025 and 2026 the
adjusted figure equals the nominal one, so it cannot be a single fixed base. A column whose unit
has to be guessed is not published. This is consistent with CLAUDE.md §6.10: nominal by default.

## 6. Text

Only the English text is kept. The source also carries Swedish and Norwegian versions.
Citations (`motivation`) are copied word for word, including the source's British spellings.
