# anupamkumar.org

The source of record for **anupamkumar.org** — writing, cleaned datasets and small
interactive tools on public finance, public policy, economics and geoeconomics.

Its purpose is to make economic information usable by people who are not economists.

| | |
|---|---|
| **Live site** | <https://anupamkumar.org> |
| **Repository** | `asrshadow/anupamkumar.org` |
| **Framework** | [Astro](https://astro.build) — static site generation |
| **Host** | GitHub Pages, published by a GitHub Actions workflow on every push to `main` |
| **Newsletter** | [asranupam.substack.com](https://asranupam.substack.com) — distribution only |
| **Contact** | hello@anupamkumar.org |

Working instructions for AI assistants are in [CLAUDE.md](CLAUDE.md), which is the
authoritative description of how this project is built. This README is the short version
plus the two constraints that are easiest to break by accident.

---

## The first principle

**Separate what is permanent from what is disposable.**

- **Layer 0 — Identity (permanent).** The domain `anupamkumar.org`.
- **Layer 1 — Source of record (permanent).** This repository. Markdown, CSV and JSON,
  every file readable in a plain text editor with no special software.
- **Layer 2 — Presentation (disposable).** The built HTML on GitHub Pages. Assume it will
  be thrown away and rebuilt somewhere else one day.

**The consequence that governs every decision:** if this site has to be wound up and
restarted years later, cloning this repository and running the build must be enough.
Nothing of value may live only on somebody else's platform.

---

## Running it on your own machine

You need [Node.js](https://nodejs.org) (LTS version). Check it is there:

```bash
node --version
```

Then, from the folder containing this file:

```bash
npm install       # download the site's dependencies. Only needed the first time.
npm run dev       # start a local preview, then open the address it prints
npm run build     # produce the finished site in dist/
npm run preview   # serve what build produced, to check it before pushing
```

`npm run dev` reloads the page whenever a file is saved. Press `Ctrl+C` to stop it.

**Search only works after a build.** The search index is built by `npm run build`, not by
`npm run dev`, so to try search use `npm run build` and then `npm run preview`.

Two more commands, both of which need `npm run build` to have been run first:

```bash
npm run check-a11y         # check every page for accessibility problems
npm run archive-substack   # pull any new Substack posts into content/external/
```

`check-a11y` opens every page in a real browser and checks it in the light theme, in the
dark theme, and at phone width, failing if anything breaks. The same check runs
automatically on every push.

### After adding or removing any dependency

```bash
npm run relock
```

This rewrites `package-lock.json` from nothing, then tells you what to commit.

**Why it is needed.** A few packages ship different code for different operating systems.
When `npm install` updates an existing lock file on Windows, it can drop the entries that
only Linux needs. GitHub's build machines run Linux, so the next build fails with
`npm ci can only install packages when your package.json and package-lock.json are in
sync`. Nothing is wrong with the site; the lock file is just incomplete. Writing it from
scratch records every platform.

## Publishing

Pushing to `main` publishes the site. Nothing else is needed.

```bash
git status                              # what changed? Always safe to run
git add .                               # stage everything
git commit -m "essay: add the GST piece"
git push                                # this publishes
gh run watch                            # watch the build, without opening a browser
```

The Source Control panel in VS Code does the staging and committing with buttons, if that
is easier than typing the commands.

---

## The speed budget

Most readers arrive on a mid-range Android phone from a link in WhatsApp. These numbers
are checked whenever something is added. **Budgets that are not enforced are decoration.**

| Page type | JavaScript | Total transfer | Largest paint |
|---|---|---|---|
| Essay | < 15 KB | < 250 KB | < 1.5 s |
| Dataset page | < 40 KB | < 400 KB | < 2.0 s |
| Tool page, before interaction | < 60 KB | < 500 KB | < 2.5 s |
| Tool page, after the user opens the tool | no cap | no cap | on user action only |

The last row is the point of the whole design: **heavy things are allowed, but only after
someone has chosen them.** A reader who never opens a tool never downloads a byte of it.

---

## The one-way import rule

**A tool may import from the site. The site may never import from a tool.**

A tool is a folder you drop in or delete. The site finds tools by scanning `src/tools/`
for manifest files, so adding one is creating a folder and removing one is deleting it.
No file outside the folder is edited either way.

**How to test it:** delete any tool's folder, run `npm run build`, and confirm it still
succeeds. If the build breaks, the contract has already been violated and that is the bug
to fix — not the build.

Without this rule the tools and the site fuse together within a year and neither can move.

---

## Repository layout

```
content/     Everything written. Markdown only.
  essays/      long pieces, canonical on this site
  notes/       short pieces, less formal
  external/    auto-archived from Substack — never hand-edit these

data/        Cleaned datasets, grouped by who published them. See CLAUDE.md section 6.

src/
  tools/       one folder per tool, fully self-contained
  components/  shared site pieces
  layouts/     page shells
  pages/       routes
  styles/      tokens.css holds every colour, size and spacing value

scripts/     Repository-wide utilities
docs/        Checklists for the routines that are easy to forget
public/      Files copied to the site as-is, including CNAME
```

---

## Licences

Three, deliberately separated so that reusers know exactly what applies to what.

| File | Covers | Licence |
|---|---|---|
| `LICENSE-content` | The writing | CC BY 4.0 |
| `LICENSE-data` | The cleaned datasets | CC BY 4.0 |
| `LICENSE-code` | The site, tools and scripts | MIT |

Material republished from a government or multilateral publisher keeps that publisher's
own licence, recorded in each dataset's `dataset.json`.

---

## Two rules that are absolute

1. **No secrets in this repository. Ever.** Not in a comment, not temporarily, not in a
   file that is gitignored. Git keeps deleted files in its history forever. If a feature
   appears to need a key, the feature has to be redesigned.
2. **Never break a published URL.** Retire a page with a redirect and a note. Never delete
   one. Citations and bookmarks are the whole point of owning the domain.
