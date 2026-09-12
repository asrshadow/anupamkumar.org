// ============================================================
// READING THE TOOLS
//
// WHAT THIS DOES
// Finds every tool.config.js under src/tools/ and hands the list
// to the page that lists tools.
//
// WHY THIS DOES NOT BREAK THE ONE-WAY RULE
// The rule is that the site never imports from a tool. A tool may
// import from the site; never the reverse.
//
// This reads each tool's CONFIG FILE and nothing else. The config
// is a description of the tool — its title, which datasets it
// uses, whether it is still current — not the tool itself. No
// tool code is loaded, and none of it reaches a reader from here.
//
// The test that this still holds: delete src/tools/ entirely, run
// npm run build, and confirm it succeeds and the tools page shows
// its empty state. Do that every time a tool is added.
//
// WHY import.meta.glob RATHER THAN READING FILES
// The datasets reader uses Node's file reading because datasets
// are data sitting outside src/. These are JavaScript modules
// inside src/, so the build tool can find and load them directly,
// and it will notice when one changes.
// ============================================================

export interface Tool {
  /** Must match the folder name exactly. */
  id: string;
  title: string;
  summary: string;
  /** Subject areas, like ["public-finance", "federalism"]. */
  fields: string[];
  /** Dataset ids this tool reads, which draw its provenance box. */
  datasets: string[];
  /** Which engine it loads: "arquero", "duckdb-wasm" or "none". */
  engine: string;
  /** Below this width a wider-screen card is shown instead. */
  minViewport: string;
  status: "draft" | "beta" | "stable" | "retired";
  /** ISO date, YYYY-MM-DD. */
  updated: string;
}

// Find every tool's config. eager: true means "load them now",
// which is what lets this run at build time rather than in a
// reader's browser.
//
// When src/tools/ holds no tools — which is the state today — this
// is simply an empty object, and everything below handles that.
const configFiles = import.meta.glob<{ default: Tool }>(
  "../tools/*/tool.config.js",
  { eager: true },
);

// ============================================================
// STEP 1 — Turn the loaded modules into a plain list
// ============================================================

function readAll(): Tool[] {
  const tools: Tool[] = [];

  for (const [filePath, module] of Object.entries(configFiles)) {
    const config = module.default;

    if (!config) {
      throw new Error(
        `${filePath} has no default export, so the build stopped.\n` +
          `  A tool.config.js must end with "export default { ... }".`,
      );
    }

    // The id is what the tool's address is built from, so a
    // mismatch with the folder name would give the tool an address
    // that does not match where its files are.
    const folderName = filePath.split("/").slice(-2)[0];

    if (config.id !== folderName) {
      throw new Error(
        `${filePath} says its id is "${config.id}" but it lives in a folder\n` +
          `  called "${folderName}". These must match, because the folder\n` +
          `  name is what the tool's web address is built from.`,
      );
    }

    tools.push(config);
  }

  return tools;
}

// ============================================================
// STEP 2 — What the pages ask for
// ============================================================

/**
 * The tools worth showing, newest update first.
 *
 * RETIRED TOOLS ARE LEFT OUT OF THIS LIST but their pages stay
 * live, with a banner saying what replaced them and the data still
 * downloadable. Links published in essays never break. That is the
 * difference between a site that accumulates and one that decays.
 */
export function getTools(): Tool[] {
  const tools = readAll().filter((tool) => tool.status !== "retired");
  tools.sort((a, b) => b.updated.localeCompare(a.updated));
  return tools;
}

/** Every tool including retired ones, for building their pages. */
export function getAllTools(): Tool[] {
  const tools = readAll();
  tools.sort((a, b) => b.updated.localeCompare(a.updated));
  return tools;
}
