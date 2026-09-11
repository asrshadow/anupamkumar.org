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
    });
  };
}
