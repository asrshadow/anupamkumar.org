# 02_clean.py
# Turns the two raw API responses in raw/ into the two published tables in clean/:
#   clean/laureates.csv — one row for each laureate in each prize year
#   clean/prizes.csv    — one row for each prize year
#
# HOW TO RUN IT (from the top of the repository):
#     python data/international/nobelprize-economic-sciences/build/02_clean.py
#
# Re-running it from the same raw/ files always produces identical output.
# It only reads raw/ and never changes it. Uses only Python's built-in modules.

import csv
import json
from pathlib import Path

# ---------------------------------------------------------------------------
# Which raw files to read. When a newer download is added to raw/, point
# these two names at it and run the script again.
# ---------------------------------------------------------------------------
LAUREATES_FILE = "laureates-economic-sciences-20-10-2026.json"
PRIZES_FILE = "prizes-economic-sciences-20-10-2026.json"

DATASET_FOLDER = Path(__file__).resolve().parent.parent
RAW_FOLDER = DATASET_FOLDER / "raw"
CLEAN_FOLDER = DATASET_FOLDER / "clean"


def english(value):
    """The API gives most text in English, Swedish and Norwegian. Keep the English."""
    if value is None:
        return ""
    return value.get("en", "")


def nested(record, *keys):
    """Walk down a chain of keys, returning {} as soon as one is missing.
    Some laureates have no birthplace or no city recorded, and this stops
    those gaps from crashing the script. The gap becomes an empty cell."""
    for key in keys:
        record = record.get(key) or {}
    return record


def clean_date(date_text):
    """The source writes a date it only knows the year of as '1956-00-00'.
    That is not a real date, so it is published as an empty cell instead.
    The year is kept separately in birth_year, so nothing is lost."""
    if not date_text or "-00" in date_text:
        return ""
    return date_text


def facts_page(prize_entry):
    """The laureate's 'facts' page for this prize on nobelprize.org."""
    for link in prize_entry.get("links", []):
        if link["href"].endswith("/facts/"):
            return link["href"]
    return ""


# ---------------------------------------------------------------------------
# STEP 1 — Read the raw files
# ---------------------------------------------------------------------------
with open(RAW_FOLDER / LAUREATES_FILE, encoding="utf-8") as file:
    laureates = json.load(file)["laureates"]
with open(RAW_FOLDER / PRIZES_FILE, encoding="utf-8") as file:
    prizes = json.load(file)["nobelPrizes"]
print(f"Read {len(laureates)} laureates and {len(prizes)} prize years")

# ---------------------------------------------------------------------------
# STEP 2 — One row per laureate per prize
# A laureate who won twice would get two rows. No economics laureate has,
# but the shape allows for it rather than assuming it never happens.
# ---------------------------------------------------------------------------
laureate_rows = []

for person in laureates:
    birth = person.get("birth", {})
    birth_place = birth.get("place", {})

    for prize in person["nobelPrizes"]:
        # The API is already filtered to economics, but check anyway, so a
        # change in the API's filtering cannot slip another prize in.
        if english(prize["category"]) != "Economic Sciences":
            continue

        # Where they worked when awarded. A few list two or three places,
        # which are joined with "; " in the order the source gives them.
        affiliations = prize.get("affiliations", [])
        affiliation_names = "; ".join(english(place["name"]) for place in affiliations)
        affiliation_countries = "; ".join(english(place["country"]) for place in affiliations)

        laureate_rows.append({
            "award_year": int(prize["awardYear"]),
            "order_within_year": int(prize["sortOrder"]),
            "laureate_id": int(person["id"]),
            "known_name": english(person["knownName"]),
            "full_name": english(person["fullName"]),
            "gender": person.get("gender", ""),
            "birth_year": birth.get("year", ""),
            "birth_date": clean_date(birth.get("date")),
            "birth_city": english(nested(birth_place, "city")),
            "birth_country": english(nested(birth_place, "country")),
            "birth_country_now": english(nested(birth_place, "countryNow")),
            "death_date": clean_date(nested(person, "death").get("date")),
            "prize_share": prize["portion"],
            "motivation": english(prize["motivation"]),
            "affiliation_at_award": affiliation_names,
            "affiliation_country_at_award": affiliation_countries,
            "nobel_facts_url": facts_page(prize),
            "wikipedia_url": nested(person, "wikipedia").get("english", ""),
        })

# Order by year, then by the source's own order within the year.
laureate_rows.sort(key=lambda row: (row["award_year"], row["order_within_year"]))
print(f"Built {len(laureate_rows)} laureate rows")

# ---------------------------------------------------------------------------
# STEP 3 — One row per prize year
# prizeAmountAdjusted is deliberately NOT published: the source does not say
# which year's kronor it is expressed in, and a column whose unit a reader
# has to guess should not exist. See METHOD.md.
# ---------------------------------------------------------------------------
prize_rows = []

for prize in prizes:
    prize_rows.append({
        "award_year": int(prize["awardYear"]),
        "date_awarded": prize.get("dateAwarded", ""),
        "laureate_count": len(prize["laureates"]),
        "prize_amount_sek": prize.get("prizeAmount", ""),
    })

prize_rows.sort(key=lambda row: row["award_year"])
print(f"Built {len(prize_rows)} prize-year rows")

# ---------------------------------------------------------------------------
# STEP 4 — Check the two tables agree before writing anything
# ---------------------------------------------------------------------------
for prize_row in prize_rows:
    year = prize_row["award_year"]
    people_that_year = [row for row in laureate_rows if row["award_year"] == year]
    if len(people_that_year) != prize_row["laureate_count"]:
        raise SystemExit(f"{year}: prizes says {prize_row['laureate_count']} laureates, laureates has {len(people_that_year)}")
print("Checked: every prize year has the right number of laureates")

# ---------------------------------------------------------------------------
# STEP 5 — Write the CSVs
# UTF-8, one header row, "\n" line endings so the files are identical
# whichever computer runs this.
# ---------------------------------------------------------------------------
CLEAN_FOLDER.mkdir(exist_ok=True)


def write_csv(file_name, rows):
    with open(CLEAN_FOLDER / file_name, "w", encoding="utf-8", newline="") as file:
        writer = csv.DictWriter(file, fieldnames=list(rows[0].keys()), lineterminator="\n")
        writer.writeheader()
        writer.writerows(rows)
    print(f"Wrote clean/{file_name} ({len(rows)} rows)")


write_csv("laureates.csv", laureate_rows)
write_csv("prizes.csv", prize_rows)
print("Done.")
