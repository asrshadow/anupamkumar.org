// ============================================================
// WRAP EVERY TABLE IN A SCROLLABLE BOX
//
// WHAT THIS DOES
// After Markdown has been turned into HTML, this finds every
// <table> and puts a <div> around it. The div is what scrolls
// sideways when a table is too wide for the screen.
//
// WHY IT IS NOT DONE IN CSS INSTEAD
// The obvious shortcut is "table { display: block; overflow: auto }".
// It works visually and it is wrong. Changing a table's display
// removes the meaning of the table from screen readers in several
// browsers — rows and columns stop being rows and columns, and a
// blind reader loses the ability to navigate the figures at all.
//
// So the table stays a table, and a plain box around it does the
// scrolling. That box also gets:
//   - tabindex="0", so a keyboard user can scroll it. Without this
//     a scrollable region is reachable by mouse only.
//   - role="region" and a label, so a screen reader announces what
//     the reader has just moved into.
//
// This file runs at build time on the build machine. It never
// reaches a reader's browser.
// ============================================================

import { visit } from "unist-util-visit";

export function rehypeWrapTables() {
  return function transformer(tree) {
    // visit walks every element in the page. The third argument of
    // the callback is the parent, which is what has to be changed —
    // a node cannot wrap itself.
    visit(tree, "element", (node, index, parent) => {
      if (node.tagName !== "table") return;
      if (!parent || index === null || index === undefined) return;

      // Do not wrap a table that is already wrapped, which would
      // otherwise happen if this plugin ever ran twice.
      if (parent.type === "element" && parent.properties?.className?.includes?.("table-wrap")) {
        return;
      }

      const wrapper = {
        type: "element",
        tagName: "div",
        properties: {
          className: ["table-wrap"],

          // Lets a keyboard user scroll the box.
          tabindex: 0,

          // Announces the box as a named region worth entering.
          role: "region",
          "aria-label": "Table, scrollable",
        },
        children: [node],
      };

      // Put the wrapper where the table was, with the table inside.
      parent.children[index] = wrapper;

      // While we are here, mark the cells that hold figures.
      markNumericCells(node);
    });
  };
}

// ============================================================
// MARK THE CELLS THAT HOLD FIGURES
//
// WHAT THIS DOES
// Finds every table cell whose contents are a number, and adds the
// class "numeric" to it. base.css then sets those cells in the
// monospace face with tabular figures, right-aligned.
//
// WHY IT IS WORTH DOING
// In a fiscal table, digits that line up in a column are how a
// reader compares magnitudes at a glance — 27,88,872 against
// 30,87,000 is obvious when the digits align and genuinely hard
// when they do not. Markdown has no way to say "this column is
// numbers", so it is worked out from the contents instead.
//
// A HEADER IS MARKED ONLY IF ITS COLUMN IS.
// Right-aligning the word "Receipts" above a column of figures is
// correct; right-aligning "Ministry" above a column of names is
// not. So the body cells decide, and the header follows.
// ============================================================

/** Collect the plain text inside an element, ignoring any tags. */
function textOf(node) {
  if (node.type === "text") return node.value;
  if (!node.children) return "";
  return node.children.map(textOf).join("");
}

/**
 * Is this text a figure?
 *
 * Allows the things that appear beside numbers in Indian public
 * finance tables: lakh-crore grouping commas, decimals, a leading
 * minus or parenthesis for a negative, a rupee sign, a percentage,
 * and an em dash or hyphen standing in for "no data".
 *
 * Requires at least one digit, so a lone dash in a text column is
 * not mistaken for a figure.
 */
function looksNumeric(text) {
  const trimmed = text.trim();
  if (trimmed === "") return false;

  // A cell that is only a dash is a gap in a column of figures.
  // Treated as numeric so the gap lines up with the numbers.
  if (/^[-–—]$/.test(trimmed)) return true;

  if (!/\d/.test(trimmed)) return false;

  return /^[(₹$€£]?\s*[-–—+]?\s*[\d,.\s]+\s*[%)]?$/.test(trimmed);
}

function markNumericCells(table) {
  const rows = [];
  const headerCells = [];

  // Walk the table by hand rather than with visit(), because the
  // position of each cell within its row is what matters here.
  collectRows(table, rows, headerCells);

  if (rows.length === 0) return;

  // How many columns are there? The widest row decides.
  const columnCount = Math.max(...rows.map((row) => row.length));

  for (let column = 0; column < columnCount; column += 1) {
    const cellsInColumn = rows
      .map((row) => row[column])
      .filter((cell) => cell !== undefined);

    if (cellsInColumn.length === 0) continue;

    // Every cell in the column has to be a figure. One stray word —
    // a footnote marker, a "not available" — and the column is
    // treated as text, which is the safe direction to be wrong in.
    const allNumeric = cellsInColumn.every((cell) =>
      looksNumeric(textOf(cell)),
    );

    if (!allNumeric) continue;

    for (const cell of cellsInColumn) addNumericClass(cell);

    // The header above a column of figures is right-aligned to match.
    if (headerCells[column]) addNumericClass(headerCells[column]);
  }
}

function addNumericClass(cell) {
  cell.properties = cell.properties ?? {};
  const existing = cell.properties.className;

  if (Array.isArray(existing)) {
    if (!existing.includes("numeric")) existing.push("numeric");
  } else if (typeof existing === "string") {
    cell.properties.className = existing.split(/\s+/).concat("numeric");
  } else {
    cell.properties.className = ["numeric"];
  }
}

/** Gather the body rows and the header row of one table. */
function collectRows(node, rows, headerCells) {
  if (!node.children) return;

  for (const child of node.children) {
    if (child.type !== "element") continue;

    if (child.tagName === "tr") {
      const cells = child.children.filter(
        (c) => c.type === "element" && (c.tagName === "td" || c.tagName === "th"),
      );

      // A row made entirely of <th> is the header.
      const isHeaderRow =
        cells.length > 0 && cells.every((c) => c.tagName === "th");

      if (isHeaderRow && headerCells.length === 0) {
        headerCells.push(...cells);
      } else {
        rows.push(cells);
      }
      continue;
    }

    // thead, tbody, tfoot — keep going down.
    collectRows(child, rows, headerCells);
  }
}
