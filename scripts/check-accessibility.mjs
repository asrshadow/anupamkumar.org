// ============================================================
// CHECK EVERY PAGE FOR ACCESSIBILITY PROBLEMS
//
// WHAT THIS DOES
// Opens every page of the built site in a real browser and runs
// Axe, the standard accessibility testing engine, against it.
// Each page is checked THREE times:
//
//   1. In the light theme, at desktop width.
//   2. In the dark theme, at desktop width. Contrast failures are
//      easy to introduce in one theme and not the other, and a
//      check that only looks at one of them misses half of them.
//   3. At 360 pixels wide, which is a mid-range Android phone —
//      where most readers arrive from a link in WhatsApp.
//
// It also checks that no page scrolls sideways at phone width.
// That is not an Axe rule, but it is the failure that makes a
// page unusable on a phone, and it is the one this site's design
// works hardest to avoid.
//
// HOW TO RUN IT
//   npm run build          (the check needs the BUILT site)
//   npm run check-a11y
//
// It prints a line per page and exits with an error if anything
// failed, which is what makes the GitHub workflow go red.
//
// HONEST LIMITS, WHICH MATTER
// An automated check finds roughly a third of accessibility
// problems. It can see that an image has no alt text. It cannot
// see that the alt text says "bar chart" instead of what the
// chart shows. It can see a contrast failure. It cannot see that
// colour is the only thing telling two lines on a graph apart.
//
// So this catches careless mistakes and frees attention for the
// manual checks in CLAUDE.md section 9, which are the ones that
// actually decide whether the site is usable.
// ============================================================

import { readdir } from "node:fs/promises";
import path from "node:path";
import http from "node:http";
import fs from "node:fs";
import puppeteer from "puppeteer";
import { AxePuppeteer } from "@axe-core/puppeteer";

// ============================================================
// SETTINGS
// ============================================================

const BUILT_SITE = "dist";

// Port 0 means "any port that happens to be free". Naming a fixed
// port would make this fail whenever a preview server was already
// running, which is exactly when someone is most likely to run it.
const PORT = 0;

// The accessibility standards to test against. This is WCAG 2.0,
// 2.1 and 2.2, all at level AA, which CLAUDE.md sets as the floor.
const STANDARDS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

const PHONE_WIDTH = 360;
const DESKTOP_WIDTH = 1280;

// ============================================================
// STEP 1 — Serve the built site
//
// Axe needs real pages at real addresses, so a very small web
// server hands out the files in dist/. It only ever serves files
// from that folder and it stops when the check finishes.
// ============================================================

const CONTENT_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".xml": "application/xml; charset=utf-8",
  ".wasm": "application/wasm",
  ".pagefind": "application/octet-stream",
};

function startServer() {
  const root = path.resolve(BUILT_SITE);

  const server = http.createServer((request, response) => {
    // Strip the query string, then work out which file is wanted.
    const requested = decodeURIComponent(request.url.split("?")[0]);
    let filePath = path.join(root, requested);

    // An address ending in a slash means the index file inside it.
    if (requested.endsWith("/")) filePath = path.join(filePath, "index.html");

    // Refuse anything that tries to climb out of the folder.
    if (!filePath.startsWith(root)) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }

    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }

    const type = CONTENT_TYPES[path.extname(filePath)] ?? "application/octet-stream";
    response.writeHead(200, { "Content-Type": type });
    fs.createReadStream(filePath).pipe(response);
  });

  return new Promise((resolve) => {
    server.listen(PORT, () => {
      // Ask the server which port it actually got.
      server.chosenPort = server.address().port;
      resolve(server);
    });
  });
}

// ============================================================
// STEP 2 — Find every page the site built
//
// Read them off disk rather than keeping a list by hand. A page
// accidentally dropped from the build is then simply not tested,
// and a page added is tested without anyone remembering to add it.
// ============================================================

async function findPages(directory = BUILT_SITE, prefix = "") {
  const found = [];
  const entries = await readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    // Pagefind's own files are a search index, not pages.
    if (entry.name === "pagefind" || entry.name === "_astro") continue;

    const full = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      found.push(...(await findPages(full, `${prefix}/${entry.name}`)));
      continue;
    }

    if (entry.name === "index.html") {
      found.push(`${prefix}/`);
    } else if (entry.name.endsWith(".html")) {
      found.push(`${prefix}/${entry.name}`);
    }
  }

  return found;
}

// ============================================================
// STEP 3 — Check one page, in one theme, at one width
// ============================================================

async function checkPage(browser, url, { theme, width, label }) {
  const page = await browser.newPage();
  await page.setViewport({ width, height: 900 });

  // Set the theme before the page loads, the same way a returning
  // reader's browser would have it stored.
  await page.evaluateOnNewDocument((chosen) => {
    try {
      localStorage.setItem("theme", chosen);
    } catch (error) {
      // Storage is unavailable. The page falls back to the device
      // setting, which is fine — the check still runs.
    }
  }, theme);

  await page.goto(url, { waitUntil: "networkidle0" });

  const results = await new AxePuppeteer(page).withTags(STANDARDS).analyze();

  // Does the page scroll sideways? Not an Axe rule, but the thing
  // that most often makes a page unusable on a phone.
  const scrollsSideways = await page.evaluate(() => {
    const root = document.documentElement;
    return root.scrollWidth > root.clientWidth + 1;
  });

  await page.close();

  return { violations: results.violations, scrollsSideways, label };
}

// ============================================================
// STEP 4 — Run everything and report
// ============================================================

async function main() {
  if (!fs.existsSync(BUILT_SITE)) {
    console.error(`There is no ${BUILT_SITE}/ folder to check.`);
    console.error('Run "npm run build" first, then try again.');
    process.exit(1);
  }

  const server = await startServer();
  const port = server.chosenPort;
  const pages = (await findPages()).sort();

  console.log(`Checking ${pages.length} pages against WCAG 2.2 level AA.`);
  console.log("Each page is checked in light, in dark, and at phone width.\n");

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });

  const passes = [
    { theme: "light", width: DESKTOP_WIDTH, label: "light" },
    { theme: "dark", width: DESKTOP_WIDTH, label: "dark " },
    { theme: "light", width: PHONE_WIDTH, label: "phone" },
  ];

  let problems = 0;

  for (const pagePath of pages) {
    const url = `http://localhost:${port}${pagePath}`;

    for (const pass of passes) {
      const result = await checkPage(browser, url, pass);
      const failed = result.violations.length > 0 || result.scrollsSideways;

      if (!failed) {
        console.log(`  ok    [${result.label}] ${pagePath}`);
        continue;
      }

      problems += 1;
      console.log(`  FAIL  [${result.label}] ${pagePath}`);

      if (result.scrollsSideways) {
        console.log("          the page scrolls sideways");
      }

      for (const violation of result.violations) {
        console.log(`          ${violation.id} — ${violation.help}`);
        console.log(`          why it matters: ${violation.helpUrl}`);

        for (const node of violation.nodes.slice(0, 3)) {
          console.log(`            at: ${node.target.join(" ")}`);
        }
      }
    }
  }

  await browser.close();
  server.close();

  console.log("");

  if (problems === 0) {
    console.log("Passed. No automated accessibility problems found.");
    console.log("");
    console.log("Remember what this cannot see. Tab through a page with no");
    console.log("mouse, zoom to 200%, and read a chart's alt text aloud to");
    console.log("check it states the finding rather than the format.");
    process.exit(0);
  }

  console.log(`${problems} check(s) failed. Each one is listed above with a link`);
  console.log("explaining what the rule is for and how to fix it.");
  process.exit(1);
}

main().catch((error) => {
  console.error("The accessibility check could not run:");
  console.error(error);
  process.exit(1);
});
