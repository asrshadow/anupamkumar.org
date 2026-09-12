// ============================================================
// READING THE DATASETS
//
// WHAT THIS DOES
// Walks the data/ folder, finds every dataset.json, reads it, and
// hands the results to the pages that list datasets.
//
// WHEN IT RUNS
// Only during "npm run build", on your computer or on GitHub's.
// It uses Node's own file reading, which does not exist in a
// browser, so NOTHING HERE IS EVER SENT TO A READER. The pages it
// feeds are plain HTML by the time anyone sees them.
//
// WHAT IT DELIBERATELY DOES NOT DO
// It does not check what columns a dataset has, or what they are
// called, or what units they use. There is no global column
// vocabulary in this project and there never will be — every
// dataset describes itself. The only content rule enforced here is
// that a column which IS described must say what it means, because
// a column whose unit a reader has to guess is how a public
// finance dataset gets misused.
// ============================================================

import fs from "node:fs";
import path from "node:path";

// Where the datasets live, relative to the top of the repository.
const DATA_DIRECTORY = "data";

// Folders inside data/ that hold something other than a published
// dataset. _reference is lookup tables that other datasets join
// against; _templates is starting points for writing a new one.
const NOT_DATASETS = ["_reference", "_templates"];

// ============================================================
// The shape of what this returns
// ============================================================

export interface DatasetSource {
  title: string;
  publisher?: string;
  url?: string;
  retrieved?: string;
}

export interface DatasetField {
  name: string;
  type?: string;
  description: string;
}

export interface DatasetResource {
  name: string;
  path: string;
  rows?: number;
  fields?: DatasetField[];
}

export interface Dataset {
  /** "union/budget-expenditure" — the group folder plus the dataset folder. */
  id: string;
  title: string;
  description: string;
  keywords: string[];
  sources: DatasetSource[];
  licenses: { name: string; url?: string }[];
  /** ISO date, YYYY-MM-DD. */
  updated: string;
  /** How long before this dataset should be refreshed. */
  stale_after_months?: number;
  resources: DatasetResource[];

  /** True for anything computed here rather than published elsewhere. */
  derived?: boolean;

  // --- Worked out by this file, not written in dataset.json ---

  /** Which of the eight groups it sits in — "union", "states", and so on. */
  group: string;
  /** Where the folder is on disk, for anything that needs the files. */
  folder: string;
  /** True once stale_after_months has passed since "updated". */
  isStale: boolean;
  /** Total rows across every resource, where the resources say. */
  totalRows?: number;
}

// ============================================================
// STEP 1 — Find every dataset.json under data/
// ============================================================

function findDatasetFiles(directory: string): string[] {
  const found: string[] = [];

  // An empty or missing data/ folder is a perfectly normal state —
  // it is where this site starts. Return nothing rather than fail.
  if (!fs.existsSync(directory)) return found;

  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;

    // Skip the two folders that hold something other than datasets.
    if (NOT_DATASETS.includes(entry.name)) continue;

    const groupFolder = path.join(directory, entry.name);

    // Inside a group folder, each subfolder is one dataset.
    for (const child of fs.readdirSync(groupFolder, { withFileTypes: true })) {
      if (!child.isDirectory()) continue;

      const metadataFile = path.join(groupFolder, child.name, "dataset.json");
      if (fs.existsSync(metadataFile)) found.push(metadataFile);
    }
  }

  return found;
}

// ============================================================
// STEP 2 — Read one, and complain loudly if it is wrong
//
// A BROKEN dataset.json STOPS THE BUILD, ON PURPOSE.
//
// The alternative — skipping it quietly — means a dataset vanishes
// from the site because of a stray comma, and nobody notices for
// months. On a site whose whole claim is provenance, silently
// losing a dataset is the worst available outcome. A red cross
// that names the file is the best one.
// ============================================================

function readDataset(metadataFile: string): Dataset {
  const raw = fs.readFileSync(metadataFile, "utf8");

  let parsed: Record<string, unknown>;

  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(
      `${metadataFile} is not valid JSON, so the build stopped.\n` +
        `  What the reader said: ${reason}\n` +
        `  This is usually a missing comma, an extra comma before a closing\n` +
        `  bracket, or a quotation mark that was never closed.`,
    );
  }

  // The administrative fields. These exist so the site can list,
  // search, cite and age-check a dataset. They say nothing about
  // what is inside it.
  const required = [
    "id",
    "title",
    "description",
    "sources",
    "licenses",
    "updated",
  ];

  const missing = required.filter((key) => parsed[key] === undefined);

  if (missing.length > 0) {
    throw new Error(
      `${metadataFile} is missing: ${missing.join(", ")}.\n` +
        `  Every dataset needs these so the site can list it, cite it and\n` +
        `  tell when it has gone stale. See CLAUDE.md section 6.4.`,
    );
  }

  const resources = (parsed.resources ?? []) as DatasetResource[];

  // THE ONE CONTENT RULE. A column that is described must say what
  // it means and in what unit. Nothing here cares what the columns
  // are called or how many there are.
  for (const resource of resources) {
    for (const field of resource.fields ?? []) {
      if (!field.description) {
        throw new Error(
          `${metadataFile}: the column "${field.name}" has no description.\n` +
            `  Every column must state what it means and in what unit. A\n` +
            `  column whose unit a reader has to guess is the most common\n` +
            `  way a public finance dataset gets misused.`,
        );
      }
    }
  }

  // Work out where this sits from the path, rather than trusting
  // the id to match. If the two disagree, the folder is the truth,
  // because that is what the address is built from.
  const folder = path.dirname(metadataFile);
  const group = path.basename(path.dirname(folder));
  const name = path.basename(folder);

  // Add up rows where the resources say how many they have.
  let totalRows: number | undefined;
  for (const resource of resources) {
    if (typeof resource.rows === "number") {
      totalRows = (totalRows ?? 0) + resource.rows;
    }
  }

  return {
    ...(parsed as unknown as Dataset),
    id: `${group}/${name}`,
    group,
    folder,
    resources,
    keywords: (parsed.keywords ?? []) as string[],
    isStale: isStale(
      parsed.updated as string,
      parsed.stale_after_months as number | undefined,
    ),
    totalRows,
  };
}

// ============================================================
// STEP 3 — Has it gone stale?
//
// A dataset page has to show a visible warning once the source has
// probably published something newer. Each dataset says how long
// its own patience is, because an annual budget document and a
// monthly accounts release go stale at completely different rates.
// ============================================================

function isStale(updated: string, staleAfterMonths?: number): boolean {
  // No threshold given means the dataset is not age-checked.
  if (!staleAfterMonths) return false;

  const updatedOn = new Date(updated);
  if (Number.isNaN(updatedOn.getTime())) return false;

  const goesStaleOn = new Date(updatedOn);
  goesStaleOn.setMonth(goesStaleOn.getMonth() + staleAfterMonths);

  return new Date() > goesStaleOn;
}

// ============================================================
// STEP 4 — What the pages ask for
// ============================================================

/** Every published dataset, newest update first. */
export function getDatasets(): Dataset[] {
  const files = findDatasetFiles(DATA_DIRECTORY);
  const datasets = files.map(readDataset);

  datasets.sort((a, b) => b.updated.localeCompare(a.updated));

  return datasets;
}

/** One dataset by its id, or undefined. */
export function getDataset(id: string): Dataset | undefined {
  return getDatasets().find((dataset) => dataset.id === id);
}
