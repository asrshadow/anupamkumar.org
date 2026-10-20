# Sources

Every file in `raw/`, where it came from, and when.

| File in `raw/` | Direct address | Retrieved |
|---|---|---|
| `laureates-economic-sciences-20-10-2026.json` | <https://api.nobelprize.org/2.1/laureates?nobelPrizeCategory=eco&limit=500> | 20 October 2026 |
| `prizes-economic-sciences-20-10-2026.json` | <https://api.nobelprize.org/2.1/nobelPrizes?nobelPrizeCategory=eco&limit=200> | 20 October 2026 |

Both were downloaded by `build/01_download.py` and saved byte for byte as the API sent them.
The prizes file reports 58 prizes (1969–2026); the laureates file reports 101 laureates.
Each file carries the API's own `meta.count`, which the download script checked against the
number of records received.

## Publisher

**Nobel Prize Outreach AB**, Stockholm, which runs nobelprize.org and its public API on behalf
of the Nobel Foundation. API documentation: <https://www.nobelprize.org/about/developer-zone-2/>.

## Licence — read before reusing

Terms of use: <https://www.nobelprize.org/about/terms-of-use-for-api-nobelprize-org-and-data-nobelprize-org/>

Checked on 20 October 2026. The wording:

> The Services are free to use according to the Creative Commons Zero (CC0) license. In case of
> conflicting terms or other inconsistencies, these Terms shall prevail.

The same terms add conditions that apply to anything built on the data:

> Applications that use the Services should not deliberately alter or censor the data, or
> deliberately mislead the end users.
>
> Applications must not use the Services in order to discredit persons or be malicious or
> discriminatory in any way.

**Laureate photographs are not part of this.** Portraits on nobelprize.org are under separate
copyright, which is why nothing on this site shows them.

## A practical note on downloading

The API refuses requests from data centres and refuses Python's default identification, both
with "403 Forbidden". It answers normally from a home connection when the request names who is
asking, which `01_download.py` does. A refresh must therefore be run on your own computer, not
by a GitHub workflow.
