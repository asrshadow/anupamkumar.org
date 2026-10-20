// ============================================================
// THE DOWNLOAD ADDRESS FOR EACH DATASET FILE
//
// WHAT THIS DOES
// Publishes every file a dataset lists in its dataset.json, beside
// that dataset's page:
//
//   /datasets/international/nobelprize-economic-sciences/laureates.csv
//
// HOW
// At build time, getStaticPaths below makes a list of every file
// of every dataset. For each one, GET reads the file from data/
// and writes it into the built site byte for byte. Nothing is
// converted or tidied on the way: the download IS the copy of
// record in clean/.
//
// There is no list of files to keep up to date. A file appears
// here because a dataset.json names it, and nowhere else.
// ============================================================

import fs from "node:fs";
import type { APIRoute, GetStaticPaths } from "astro";
import { getDatasets, downloadFileName, resourceFile } from "../../../../lib/datasets";

// What a browser should be told each kind of file is. A CSV said to
// be text/csv opens in a spreadsheet or downloads, rather than
// showing as a wall of text.
const CONTENT_TYPES: Record<string, string> = {
  ".csv": "text/csv; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".parquet": "application/octet-stream",
};

// ============================================================
// STEP 1 — Every file of every dataset becomes one address
// ============================================================

export const getStaticPaths: GetStaticPaths = () => {
  const paths = [];

  for (const dataset of getDatasets()) {
    for (const resource of dataset.resources) {
      // A resource kept outside Git (above ~50 MB, §6.10) has a web
      // address rather than a file here. It is linked, not copied.
      if (/^https?:/.test(resource.path)) continue;

      paths.push({
        params: {
          group: dataset.group,
          name: dataset.id.split("/")[1],
          file: downloadFileName(resource),
        },
        // Hand GET the file's place on disk, so it need not search.
        props: { filePath: resourceFile(dataset, resource) },
      });
    }
  }

  return paths;
};

// ============================================================
// STEP 2 — Send the file exactly as it is
// ============================================================

export const GET: APIRoute = ({ props }) => {
  const filePath = props.filePath as string;

  // A dataset.json naming a file that is not there is a broken
  // dataset. Stop the build and say which, rather than publish a
  // download link that leads nowhere.
  if (!fs.existsSync(filePath)) {
    throw new Error(
      `${filePath} is listed in a dataset.json but does not exist.\n` +
        `  Either add the file or remove it from that dataset's "resources".`,
    );
  }

  const extension = filePath.slice(filePath.lastIndexOf("."));
  const contentType = CONTENT_TYPES[extension] ?? "application/octet-stream";

  return new Response(fs.readFileSync(filePath), {
    headers: { "Content-Type": contentType },
  });
};
