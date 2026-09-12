// ============================================================
// THE DATASET REGISTRY, at /registry.json
//
// WHAT THIS IS
// A machine-readable list of every dataset on this site, so that
// somebody else's script can find them without scraping the pages.
//
// WHY IT IS AN ADDRESS AND NOT A FILE IN data/
// It used to be planned as a generated file committed to Git. A
// generated file drifts out of step with its sources the first
// time somebody forgets to re-run the script that makes it.
//
// Built here instead, it comes from exactly the same reader the
// rest of the site uses, so there is one source of truth and
// nothing to remember. Outside users also get a stable address
// rather than a link into a GitHub repository.
//
// This file produces JSON rather than a page, which is why it is
// named .json.ts rather than .astro.
// ============================================================

import type { APIRoute } from "astro";
import { getDatasets } from "../lib/datasets";

export const GET: APIRoute = () => {
  const datasets = getDatasets();

  const body = {
    // What this is, for whoever opens it without context.
    name: "anupamkumar.org dataset registry",
    description:
      "Every cleaned dataset published on anupamkumar.org, with its source, licence and vintage.",
    site: "https://anupamkumar.org",

    // When this copy was built. Not when the datasets changed —
    // each one carries its own "updated" date below.
    generated: new Date().toISOString(),

    count: datasets.length,

    datasets: datasets.map((dataset) => ({
      id: dataset.id,
      title: dataset.title,
      description: dataset.description,
      keywords: dataset.keywords,
      group: dataset.group,
      sources: dataset.sources,
      licenses: dataset.licenses,
      updated: dataset.updated,
      stale_after_months: dataset.stale_after_months,
      derived: dataset.derived ?? false,

      // The page a person should read before using the data.
      page: `https://anupamkumar.org/datasets/${dataset.id}/`,

      // The files themselves, as each dataset declares them.
      resources: dataset.resources.map((resource) => ({
        name: resource.name,
        path: resource.path,
        rows: resource.rows,
        fields: resource.fields,
      })),
    })),
  };

  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};
