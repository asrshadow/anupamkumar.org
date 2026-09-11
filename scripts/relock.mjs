// ============================================================
// REBUILD package-lock.json FROM SCRATCH
//
// RUN THIS AFTER ADDING OR REMOVING ANY DEPENDENCY:
//     npm run relock
//
// ------------------------------------------------------------
// WHY THIS EXISTS — worth reading once, because the failure it
// prevents is confusing and looks like something else entirely.
//
// package-lock.json records the exact version of every package
// the site uses, so that a build on GitHub produces the same site
// as a build on this computer. GitHub installs with "npm ci",
// which refuses to run at all if that file does not match
// package.json exactly.
//
// The problem: a few packages ship different code for different
// operating systems. When "npm install" runs on Windows and
// UPDATES an existing lock file, it sometimes drops the entries
// that only Linux needs — because this computer does not need
// them. GitHub's build machines run Linux, so the build then
// fails with:
//
//     npm ci can only install packages when your package.json
//     and package-lock.json are in sync
//     Missing: @emnapi/runtime from lock file
//
// Nothing is actually wrong with the site. The lock file is
// simply incomplete.
//
// Writing the file from nothing, rather than updating it, records
// every platform. That is all this script does: delete the lock
// file and node_modules, then install again.
//
// It takes a minute or two, and it saves a confusing red cross on
// GitHub twenty minutes later.
// ============================================================

import { rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";

console.log("Rebuilding package-lock.json from scratch.");
console.log("This takes a minute or two.\n");

// ------------------------------------------------------------
// STEP 1 — Remove the lock file and the installed packages.
// ------------------------------------------------------------

for (const target of ["package-lock.json", "node_modules"]) {
  if (existsSync(target)) {
    console.log(`  removing ${target}`);
    await rm(target, { recursive: true, force: true });
  }
}

// ------------------------------------------------------------
// STEP 2 — Install everything again, which writes a complete
// lock file because there is nothing to update from.
//
// On Windows npm is a batch file called npm.cmd rather than a
// program called npm, so it has to be named exactly. Asking the
// system shell to sort it out instead would work, but it brings a
// warning about unescaped arguments and it is not needed here.
// ------------------------------------------------------------

console.log("  installing\n");

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

const result = spawnSync(npmCommand, ["install"], {
  stdio: "inherit",
});

if (result.status !== 0) {
  console.error("\nThe install failed. Nothing was locked.");
  process.exit(1);
}

// ------------------------------------------------------------
// STEP 3 — Say what to do next.
// ------------------------------------------------------------

console.log("\nDone. package-lock.json now covers every platform.");
console.log("Commit it along with the change to package.json:");
console.log('\n    git add package.json package-lock.json');
console.log('    git commit -m "chore: add <the package you added>"');
