// ============================================================
// READING A CSV FILE AT BUILD TIME
//
// WHAT THIS DOES
// Turns the text of a CSV file into a list of rows, where each row
// is a set of named values: { award_year: "1969", known_name: … }.
//
// WHEN IT RUNS
// Only during "npm run build". It is used by the dataset pages (to
// show the first few rows) and by tools that draw their pages from
// a published dataset. Nothing here reaches a reader's browser.
//
// WHY IT IS WRITTEN OUT HERE RATHER THAN TAKEN FROM A LIBRARY
// The CSVs on this site are the copy of record and follow one
// convention: UTF-8, comma-separated, one header row. Reading that
// convention takes about thirty lines, which is less to maintain
// than a dependency.
//
// THE ONE PART THAT IS NOT OBVIOUS: QUOTED VALUES
// A value containing a comma is wrapped in double quotes, so that
// the comma is not mistaken for the end of the value:
//
//     1974,"for … of economic, social and institutional phenomena"
//
// A double quote INSIDE such a value is written twice ("") to show
// it is part of the text. The loop below reads one character at a
// time and keeps track of whether it is inside quotes.
//
// EVERY VALUE COMES BACK AS TEXT. "1969" stays "1969". The page
// that uses a value decides whether it is a number, because only
// that page knows what the column means.
// ============================================================

import fs from "node:fs";

/** One row of a CSV, with each value under its column's name. */
export type CsvRow = Record<string, string>;

/** Splits the text of a CSV into rows of values, header row included. */
function splitIntoCells(text: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentValue = "";
  let insideQuotes = false;

  // Drop the invisible "byte order mark" Excel puts at the start of
  // some files, so the first column's name is not spoiled by it.
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);

  for (let position = 0; position < text.length; position++) {
    const character = text[position];

    if (insideQuotes) {
      if (character === '"' && text[position + 1] === '"') {
        // Two quotes in a row inside a quoted value: one real quote.
        currentValue += '"';
        position++;
      } else if (character === '"') {
        // A single quote ends the quoted value.
        insideQuotes = false;
      } else {
        // Anything else, commas and line breaks included, is text.
        currentValue += character;
      }
      continue;
    }

    if (character === '"') {
      insideQuotes = true;
    } else if (character === ",") {
      // End of a value.
      currentRow.push(currentValue);
      currentValue = "";
    } else if (character === "\n") {
      // End of a row.
      currentRow.push(currentValue);
      rows.push(currentRow);
      currentRow = [];
      currentValue = "";
    } else if (character !== "\r") {
      // "\r" is the extra line-ending character Windows adds; skip it.
      currentValue += character;
    }
  }

  // The last row, if the file does not end with a line break.
  if (currentValue !== "" || currentRow.length > 0) {
    currentRow.push(currentValue);
    rows.push(currentRow);
  }

  return rows;
}

/**
 * Reads a CSV file and returns its rows, each one keyed by the
 * names in the header row. Stops the build, naming the file, if a
 * row has a different number of values from the header — that
 * means the file is broken, and showing it half-read would be worse.
 */
export function readCsv(filePath: string): CsvRow[] {
  const text = fs.readFileSync(filePath, "utf8");
  const [header, ...dataRows] = splitIntoCells(text);

  const rows: CsvRow[] = [];

  for (const [index, cells] of dataRows.entries()) {
    if (cells.length !== header.length) {
      throw new Error(
        `${filePath}: row ${index + 2} has ${cells.length} values but the header has ${header.length}.\n` +
          `  This usually means a value containing a comma was not wrapped in quotes.`,
      );
    }

    // Pair each value with its column name.
    const row: CsvRow = {};
    for (let column = 0; column < header.length; column++) {
      row[header[column]] = cells[column];
    }
    rows.push(row);
  }

  return rows;
}
