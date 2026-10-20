# 01_download.py
# Downloads every economics prize and every economics laureate from the
# Nobel Prize API, and saves both responses into raw/ exactly as received.
#
# HOW TO RUN IT (from the top of the repository):
#     python data/international/nobelprize-economic-sciences/build/01_download.py
#
# IT NEVER OVERWRITES A FILE THAT IS ALREADY IN raw/.
# raw/ is immutable (CLAUDE.md §6.10). To take a newer copy after the next
# October award, change DOWNLOAD_LABEL below to that day's date, run this
# again, and record the new files in SOURCES.md and CHANGELOG.md.
#
# WHY THIS RUNS ON YOUR OWN MACHINE AND NOT ON GITHUB
# The API refuses requests from data centres (it answers 403), the same way
# Substack does. From a home connection it answers normally.
#
# Uses only Python's built-in modules, so nothing has to be installed.

import json
import urllib.request
from pathlib import Path

# The date the files are downloaded, written into their names so that a
# later download sits beside this one instead of replacing it.
DOWNLOAD_LABEL = "20-10-2026"

# "eco" is the API's own code for the economics prize.
# limit is set well above the real count, so everything arrives in one page.
# The meta.count field in each response is checked below to prove that.
PRIZES_URL = "https://api.nobelprize.org/2.1/nobelPrizes?nobelPrizeCategory=eco&limit=200"
LAUREATES_URL = "https://api.nobelprize.org/2.1/laureates?nobelPrizeCategory=eco&limit=500"

# raw/ sits next to this build/ folder.
RAW_FOLDER = Path(__file__).resolve().parent.parent / "raw"


def download(url, file_name):
    """Fetch one address and save the reply byte for byte, unless already saved."""
    target = RAW_FOLDER / file_name

    # Refuse to overwrite. An existing file is the record of what was used.
    if target.exists():
        print(f"Already downloaded, left untouched: {target.name}")
        return

    print(f"Downloading {url}")
    # The API refuses Python's default "Python-urllib" signature with a 403,
    # so the request says plainly who is asking and where to find them.
    headers = {"Accept": "application/json", "User-Agent": "anupamkumar.org dataset builder (https://anupamkumar.org)"}
    request = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(request, timeout=60) as response:
        body = response.read()

    # Check that one page held everything. If the API ever has more records
    # than the limit asked for, stop rather than save half the data.
    reply = json.loads(body)
    total = reply["meta"]["count"]
    received = len(reply.get("nobelPrizes", reply.get("laureates", [])))
    if received != total:
        raise SystemExit(f"Only {received} of {total} records arrived. Raise the limit in the URL and run again.")

    RAW_FOLDER.mkdir(exist_ok=True)
    target.write_bytes(body)
    print(f"Saved {received} records to raw/{target.name}")


download(PRIZES_URL, f"prizes-economic-sciences-{DOWNLOAD_LABEL}.json")
download(LAUREATES_URL, f"laureates-economic-sciences-{DOWNLOAD_LABEL}.json")
print("Done.")
