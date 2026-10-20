# Economics Nobel timeline

## What this does

A timeline of every economics Nobel laureate since 1969, at `/tools/nobel-economics-timeline/`.
Readers can pull out to see all seven decades at once, or pull in to one decade year by year,
with each year's official citation and a plain-English explainer. Choosing any name slides in a
panel with that person's details: share of the prize, where they worked, when and where they
were born, their age when awarded, who they shared it with, and links to their Nobel Prize page
and Wikipedia.

The whole timeline is written into the page when the site is built, so it can be read in full
with JavaScript switched off. The script only adds the pulling in and out and the panel.

## How to run it

It runs as part of the site. To look at it while working:

```bash
npm run dev
```

Then open the address it prints, followed by `/tools/nobel-economics-timeline/`. Ctrl+C stops it.

## What it reads and what it writes

| Reads | What for |
|---|---|
| `data/international/nobelprize-economic-sciences/clean/laureates.csv` | Every name, citation, share, affiliation, birth and death |
| `data/international/nobelprize-economic-sciences/clean/prizes.csv` | The date of each award, to work out each laureate's age |
| `explainers.md`, in this folder | The plain-English explainer for each year |

It writes nothing. The tool's page is produced by the site's build.

## The files in this folder

| File | What it is | Can you edit it without code? |
|---|---|---|
| `explainers.md` | The 58 plain-English explainers | **Yes** — this is the file you will edit most |
| `tool.config.js` | Title, summary, status and dataset, as the rest of the site sees them | Yes — the text in quotes |
| `Tool.astro` | Builds the timeline's HTML from the data, plus its styles | No |
| `tool.js` | Pulling in and out, and the panel. About 4 KB once built | No — but its comments explain every step |
| `README.md` | This file | Yes |

## Dependencies

None beyond the site itself. No chart or data library is loaded, so `engine` is `"none"`. The
page sends about 33 KB of compressed HTML and 4 KB of script, well inside the tool-page budget in
CLAUDE.md §12.

## How to change the common things

**Correct or rewrite an explainer.** Open `explainers.md`, find the line `## 1994` (or whichever
year), and edit the text under it. Keep it plain text and use curly quotation marks. Save. That
is all.

**Add next year's prize.** First update the dataset (see its `build/README.md`). The new year
then appears on the timeline by itself. Add a `## 2027` section at the end of `explainers.md`.
Until you do, that year simply shows no explainer — nothing breaks.

**Change the title or summary.** Edit `title` or `summary` in `tool.config.js`.

**Mark it as finished.** Once the explainers have been reviewed, change `status: "beta"` to
`status: "stable"` in `tool.config.js`. The "beta" label disappears from the page.

## Known limitations

- **The explainers are the site's own words**, drafted on 20 October 2026 and awaiting review.
  The page labels them "written for this site", separately from the Nobel committee's citation.
  **2026 needs particular care:** that prize was announced after the drafting model's training
  data ends, so its explainer was written from general knowledge of Hall's and Woodford's work,
  not from the committee's announcement.
- **No photographs.** Laureate portraits on nobelprize.org are not covered by the data's CC0
  licence.
- **It is not a chart.** Nothing on it is plotted by quantity, so there is no chart palette and
  no legend. If a chart is ever added — laureates by country, say — it should come from the
  dataset and follow CLAUDE.md §8.3.

## Testing it after a change

1. `npm run build`, then `npm run check-a11y`. The second must end with "Passed".
2. Delete this folder (or move it out of the repository), run `npm run build`, and confirm it
   still succeeds and `/tools/` shows its empty state. Put the folder back. This is the one-way
   rule (CLAUDE.md rule 5).
3. In `npm run preview`, use only the keyboard:
   - pull out and pull in
   - open a name with Enter, move to a co-laureate, and close with Escape
   - confirm the focus ring returns to the name you started from

**Last updated:** 20 October 2026
