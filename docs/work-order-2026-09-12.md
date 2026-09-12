# Work order — navigation, two-column layout, About, Datasets and Tools

**For:** Claude Code, working in `asrshadow/anupamkumar.org` in VS Code
**Written:** 12 September 2026 · **Revision 2**
**Against:** CLAUDE.md v1.2, site as deployed on 11 September 2026

---

## For Anupam — how to start this in VS Code

1. Save this file into the repository as `docs/work-order-2026-09-12.md` and save
   `profile-photo.webp` somewhere you can find it.
2. Open the repository folder in VS Code and start Claude Code in it.
3. Give it this, and nothing more:

   > Read `CLAUDE.md`, then read `docs/work-order-2026-09-12.md` in full. Do step 1 only,
   > then stop and show me what changed.

4. After each step, read what it says it did, look at the site with `npm run dev`, and
   then say `do step 2` — and so on. **Do not ask for all eleven steps at once.** Eleven
   steps in one go produces one enormous change you cannot review and cannot unpick, and
   if step 4 is wrong you will not find out until step 9 looks strange.
5. Three steps will stop and ask you something: step 1 (the CLAUDE.md changes are yours
   to approve), step 4 (About in the navigation), and step 9 (your biography). Those are
   deliberate.

If something goes wrong, `git status` first, and read the output together with Claude Code
before running anything else.

---

## How to use this file

Read `CLAUDE.md` in full first. Then read this file in full before touching anything.

The work is in eleven steps. **Do them in order, one at a time, and stop at the end
of each one.** Every step ends somewhere safe: the site builds, and there is a commit
to go back to. Do not start step 5 because step 4 went well.

At the end of each step, run:

```bash
npm run build
```

and confirm it finishes with no errors before committing. If a step says to run
anything else as well, it says so.

Anupam cannot read JavaScript. Every `.js`, `.ts` and `.astro` frontmatter block you
write or change must be commented densely enough that the comments alone explain what
the file does. This is CLAUDE.md §4.2 and it is not negotiable.

---

## Part 0 — Decisions and conflicts, settled before you start

These were decided with Anupam on 12 September 2026. Some of them contradict CLAUDE.md
as it stands. **Step 1 changes CLAUDE.md to match.** Do not silently follow the old rule
or the new one without making that edit.

### 0.1 Conflicts with CLAUDE.md v1.2 — resolved in favour of the new design

| # | CLAUDE.md v1.2 says | What is now wanted | Resolution |
|---|---|---|---|
| 1 | §8.6: "Header and footer — full-bleed, hairline rules... Structural. Should recede." | Header and footer in a distinct colour | **Amend.** They keep the hairline and square corners and stay recessive, but sit on a band one luminance step away from the page. §8.3 rule 9 (no large areas of saturated colour) is untouched — the band is a near-neutral, not a hue. |
| 2 | §8.6: "Essay body — no containers at all. Just text on paper. Nothing should compete with reading." | A right-hand column beside an essay, carrying tags, related pieces and links | **Amend, narrowly.** The reading column itself still has no container. The sidebar sits outside it, is set in muted small sans, and disappears below the article under 64rem. The rule becomes: *nothing inside the reading column, and nothing beside it that competes with it.* |
| 3 | §5 / §6.2: `data/registry.json` is generated at build time by `scripts/build-data-registry.mjs` and committed | — | **Amend.** A generated file committed to Git drifts out of step with its sources the first time someone forgets to re-run the script. Replace it with an endpoint: `src/pages/registry.json.ts`, built from the same reader the site itself uses, served at `/registry.json`. One source of truth, nothing to remember, and outside consumers get a stable URL instead of a raw GitHub link. Delete the `build-data-registry.mjs` row from §13 and the `registry.json` line from §6.2. |
| 4 | Header comment in `Header.astro`: "Data and Tools are deliberately absent until they exist — a navigation item leading to an empty page is worse than none." | Datasets and Tools in the nav now | **Amend.** The rule was right about *dead* links. These will be real pages that say plainly that the first entries are being prepared and what they will contain. Change the rule to: *a navigation item may lead to a section with no entries yet, provided the page explains what is coming; it may never lead to a 404 or a blank page.* |

### 0.2 Decisions that are not conflicts

**"Most viewed" is not possible and should not be attempted.** Anupam asked whether the
home page could order pieces by most viewed rather than latest. It cannot, and the reason
is worth recording rather than rediscovering. A view count needs something that counts
views, which means either a server (forbidden by rule 4) or a third-party analytics script
(which would send every reader's visit to a company, and would make the claim on `/about/`
that nothing is tracked untrue). **Order by date. If Anupam raises it again, the honest
answer is that the only privacy-respecting route is a self-hosted counter, which needs a
server, which this site does not have.**

**About stays in the navigation.** Anupam listed the nav as Home, Writings and Notes,
Datasets, Tools, Search. Search moves into the header as a box, which frees a slot. About
is where the profile now lives and it is the first place a reader looks for who wrote
this, so it takes that slot. `Now` and `Contact` move to the footer. **Flag this to Anupam
in the pull request or commit message so he can veto it** — it is the one place this work
order goes beyond what he asked for.

**No comment system.** Anupam asked for "comment related external links" in the sidebar.
There is no comment system on this site and there should not be: every option is either a
server or a third-party script that tracks readers. The sidebar instead gets a **Respond**
block — a link to the piece's Substack post where comments already work, and the email
address. That is the honest version of the same thing.

**URLs that must not change.** Rule 8. `/writing/`, `/notes/`, `/about/`, `/now/`,
`/contact/`, `/search/`, `/tags/<tag>/`, every `/writing/<slug>/` and `/notes/<slug>/`.
"Writings and Notes" is a **label change only** — the combined listing stays at `/writing/`.
`/notes/` stays live as the notes-only view. Nothing gets redirected, nothing gets deleted.

### 0.3 Two things Anupam has to supply before some steps can finish

1. **`Profile_Photo.jpg`** — needed by step 9. Do not invent a placeholder image.
2. **At least one real piece of writing** — see step 11. The home page will feature the
   newest piece, and right now the newest piece is a placeholder.

---

## Step 1 — Amend CLAUDE.md

Do this first, so the rest of the work has a document to be correct against.

Update the header of the file: `**Last updated:** 12 September 2026 · **Blueprint version:** v1.3`.

### 1.1 §8.2 — add the chrome colour tokens

`src/styles/tokens.css` defines colour tokens in **three** places: `:root`, the
`@media (prefers-color-scheme: dark)` block, and the `:root[data-theme="dark"]` block.
The last two must stay identical to each other or the explicit toggle stops matching the
device setting. Any token you add goes in all three.

Add to the Surfaces group in §8.2 of CLAUDE.md and to `tokens.css`:

```css
  /* --- Chrome — the header and footer band -------------------------------
     One luminance step away from the page, so the structure of the page is
     visible without a border doing all the work. Deliberately a near-neutral
     and not a hue: §8.3 rule 9 forbids large areas of saturated colour, and
     the header and footer are the largest continuous areas on the site.
     Separation from --colour-paper is 1.11:1 in light and 1.13:1 in dark —
     enough to read as a band, not enough to read as a stripe.            */
  --colour-chrome:      #ECECE5;  /* header and footer background */
  --colour-chrome-rule: #C9CAC2;  /* the hairline between chrome and page */
```

and in both dark blocks:

```css
    --colour-chrome:      #1E2227;
    --colour-chrome-rule: #3B424A;
```

**Contrast, measured, for the comments in `tokens.css`.** Every foreground the site puts
on this band passes. Record these numbers:

| Token on the chrome band | Light — on `#ECECE5` | Dark — on `#1E2227` | Needs |
|---|---|---|---|
| `--colour-ink` | 14.87:1 — AAA | 13.23:1 — AAA | 4.5:1 |
| `--colour-ink-muted` | 5.04:1 — AA | 6.05:1 — AA | 4.5:1 |
| `--colour-accent` | 6.27:1 — AA | 7.31:1 — AAA | 4.5:1 |
| `--colour-border-input` | 3.65:1 — passes | 3.24:1 — passes | 3:1 |

`--colour-border-input` matters here for the first time, because step 3 puts a search
field inside the header. It is the tightest of the four and it is what stops the band
being made any darker in light mode or any lighter in dark mode. **If anyone changes
`--colour-chrome` later, re-check that row.**

### 1.2 §8.2 — add the sidebar width token

CLAUDE.md rule 11 forbids inventing a width. `tokens.css` already has a widths group
(`--width-page`, `--width-gutter`). Add to it, and document it in §8.7:

```css
  --width-aside: 18rem;   /* the right-hand column, where a page has one */
```

### 1.3 §8.6 — rewrite two rows of the shape table

Replace the Header/footer row:

> | Header and footer | Full-bleed band in `--colour-chrome`, hairline rule in `--colour-chrome-rule`, no radius, no shadow | Structural. Separated from the page so its edges are legible, but a near-neutral so it still recedes. |

Replace the Essay body row:

> | Essay body | No containers at all inside the reading column. Just text on paper. | Nothing should compete with reading. A sidebar may sit **beside** the column — see §8.8 — but nothing may sit inside it. |

### 1.4 §8 — add a new §8.8, the page shell

Add this section after §8.7:

> ### 8.8 The page shell — one column or two
>
> Every page is either one column or two. A two-column page is a reading column plus a
> right-hand aside of `--width-aside`, and it collapses to one column below 64rem.
>
> **What the aside is for.** Navigation of the material on the page, and nothing else:
> tags, related pieces, links out, the state of a section. It never carries the argument.
> If something in the aside is worth reading properly, it belongs in the main column.
>
> **Rules.**
>
> 1. **The aside comes after the main column in the HTML.** A reader using a keyboard or
>    a screen reader meets the content first. Never reorder them with CSS to put the
>    aside first visually — the two orders would then disagree.
> 2. **The aside is set in `--font-sans` at `--size-sm` in `--colour-ink-muted`.** It is
>    supporting material and should look like it.
> 3. **Running text in the main column stays capped at `--measure`** whether or not there
>    is an aside. A wider column is not an invitation to longer lines.
> 4. **The aside may be sticky, but only when it is shorter than the viewport.** Use
>    `position: sticky` with `align-self: start`; never give it its own scrollbar.
> 5. **Below 64rem the aside moves below the main column**, in full width, with a rule
>    above it. It is never hidden — hiding it would hide the tags from every phone reader.
> 6. **No page has more than one aside**, and no aside has an aside.

### 1.5 §7 — add two naming rows

| Thing | Convention | Example |
|---|---|---|
| Images in `src/assets/` | `lowercase-kebab-case`, describing content | `profile-photo.jpg` |
| Astro endpoints | `lowercase-kebab-case.ts`, named for what they emit | `registry.json.ts` |

### 1.6 §5 — update the repository structure block

Add to the `src/` tree:

```
│   ├── lib/                    ← build-time readers: writing, datasets, tools
```

Add to the top level:

```
├── docs/
│   ├── checklists/             ← the human routines in §13
│   └── how-to/                 ← the three routines in §17, for Anupam
```

Remove `scripts/build-data-registry.mjs` from the `scripts/` tree — see §0.1 conflict 3.

### 1.7 §6.2 — remove `registry.json` from the data tree

Delete the `registry.json` line and its comment. Replace the note under the tree with:

> The registry is not a file in this folder. It is generated on every build from every
> `dataset.json` and served at `https://anupamkumar.org/registry.json`. There is no list
> to maintain and no generated file to keep in step.

### 1.8 §11 — add the navigation and section map

Add this to §11, because a reader of this file should not have to open `Header.astro`
to find out what the site's sections are:

> ### The sections, and what belongs in each
>
> | Nav label | URL | Holds |
> |---|---|---|
> | Home | `/` | The newest piece, then recent writing. Datasets, Tools and subjects in the aside. |
> | Writings and Notes | `/writing/` | Every piece — essays, notes and archived Substack posts — newest first. |
> | Datasets | `/datasets/` | One entry per published dataset. |
> | Tools | `/tools/` | One entry per tool. |
> | About | `/about/` | Who Anupam is, and what the site is for. |
> | — | `/notes/` | Notes only. Reachable from the Writings and Notes aside, not from the nav. |
> | — | `/now/`, `/contact/` | Footer only. |
> | — | `/search/` | The search box in the header submits here. Not a nav word. |
>
> **A nav item may lead to a section with no entries yet**, provided the page says plainly
> what is coming. It may never lead to a 404 or a page that is simply blank.
>
> **`/writing/` is the combined listing and `/notes/` is a filtered view of it.** They are
> one destination to a reader and two URLs on the server, because both were published and
> rule 8 says neither may break.

### 1.9 §12 — add the home and listing pages to the budget table

They now load a little more markup than an essay. Add a row:

| Page type | JavaScript | Total transfer | Largest paint |
|---|---|---|---|
| Home and section listings | < 15 KB | < 250 KB | < 1.5 s |

### 1.10 Add a new §17 — the three routines, and what they cost

Insert before the current §15, renumbering what follows. This is the section Anupam asked
for: what he has to do to publish a piece, add a dataset, or add a dashboard. Write it as
**Part 3 of this work order** has it, verbatim.

### 1.11 §16 — update the current state

Replace the Phase 1 block with the state after this work order lands. Move the two
remaining Phase 1 items forward unchanged; they are still the point.

**Commit:** `docs: update CLAUDE.md for two-column layout, new nav and section pages`

---

## Step 2 — The chrome colour

Now apply the tokens from 1.1 and 1.2 to `src/styles/tokens.css`, in all three blocks.

Then in `src/components/Header.astro` and `src/components/Footer.astro`, replace:

```css
    background: var(--colour-paper);
```

with `background: var(--colour-chrome);`, and the `border-bottom` / `border-top` colour
with `var(--colour-chrome-rule)`.

In `Footer.astro`, `.footer-bottom` has its own `border-top: 1px solid var(--colour-rule)`.
That one is **inside** the band and separates two parts of the footer, so it stays
`--colour-rule`. Do not change it.

**Check:** open the site in both themes. The band should be visible but unremarkable — if
it reads as a coloured header, it is too strong.

**Commit:** `style: give the header and footer their own background band`

---

## Step 3 — The page shell

Two new components. Neither has any JavaScript.

### 3.1 `src/components/PageShell.astro`

A wrapper that gives a page one column or two. It takes a default slot (the main column)
and a named slot `aside`. **When nothing is passed to `aside`, it must render a single
full-width column** — use `Astro.slots.has("aside")` to decide, so a one-column page does
not get an empty grid track.

The grid:

```css
  .shell {
    display: grid;
    gap: var(--space-7) var(--space-6);
    align-items: start;   /* so a sticky aside can stick */
  }

  /* Two columns only when there is room. 64rem is where an 18rem aside
     stops squeezing the reading column. */
  @media (min-width: 64rem) {
    .shell.has-aside {
      grid-template-columns: minmax(0, 1fr) var(--width-aside);
    }
  }
```

`minmax(0, 1fr)` rather than `1fr` on the main column is deliberate and worth a comment:
a plain `1fr` refuses to shrink below the width of its widest child, so one wide table
inside the column would push the whole page sideways. `minmax(0, 1fr)` lets the column
shrink and hands the overflow to the table's own `.table-wrap` scroller, which is what
CLAUDE.md §12 requires.

The aside:

```css
  .shell-aside {
    font-family: var(--font-sans);
    font-size: var(--size-sm);
    line-height: var(--leading-ui);
    color: var(--colour-ink-muted);
  }

  /* Below the breakpoint the aside sits under the content with a rule
     above it, so it reads as an appendix rather than as a stray column. */
  @media (max-width: 63.999rem) {
    .shell-aside {
      padding-top: var(--space-6);
      border-top: 1px solid var(--colour-rule);
    }
  }

  @media (min-width: 64rem) {
    .shell-aside {
      position: sticky;
      top: var(--space-6);
    }
  }
```

**Do not put a `max-height` or `overflow` on the aside.** A sticky element taller than the
viewport simply stops sticking, which is the correct behaviour. Giving it its own
scrollbar creates a second scrolling region that is awkward on a trackpad and easy to
lose with a keyboard.

The aside element itself must be `<aside aria-label="...">`, with the label passed in as a
prop, because a page may have more than one landmark and an unlabelled `<aside>` is
announced as just "complementary".

### 3.2 `src/components/SideBlock.astro`

One titled block in an aside: a small uppercase sans heading and a slot. This exists so
every sidebar block on the site is spaced and set identically instead of each page
inventing it. Props: `title` (string) and `headingLevel` (2 or 3, default 2) — an article
page's aside sits under the `<h1>` so its blocks are `<h2>`, and CLAUDE.md §8.5 says
headings never skip a level.

Reuse `.section-heading`'s look, which is already on the home page and duplicated in three
other files. **While you are here, move that rule into `base.css` as a shared class** and
delete the four copies. Four copies of the same rule is four places for it to drift.

**Commit:** `feat: add a page shell that can carry a right-hand column`

---

## Step 4 — The header: navigation and search

### 4.1 The navigation list

```js
// The navigation. Each item can list extra addresses it should light up
// for, so that /notes/ still marks "Writings and Notes" as the current
// section even though it is a different address.
const links = [
  { href: "/",          label: "Home" },
  { href: "/writing/",  label: "Writings and Notes", alsoMatches: ["/notes/", "/tags/"] },
  { href: "/datasets/", label: "Datasets" },
  { href: "/tools/",    label: "Tools" },
  { href: "/about/",    label: "About" },
];
```

### 4.2 Fix `isCurrent` — this is a real bug, not a tidy-up

The current function is:

```js
function isCurrent(href: string): boolean {
  return path === href || path.startsWith(href);
}
```

With `/` now in the list, `path.startsWith("/")` is true on **every page**, so Home would
be marked as the current section everywhere. Replace it with:

```js
// Home is special: it is current only on the home page itself, because
// every address on the site starts with "/". Every other section is
// current when the address is inside it.
function isCurrent(link) {
  if (link.href === "/") return path === "/";
  if (path === link.href || path.startsWith(link.href)) return true;
  return (link.alsoMatches ?? []).some((prefix) => path.startsWith(prefix));
}
```

### 4.3 The search box

A plain HTML form. No JavaScript at all on this side — a `GET` form navigates the browser
to `/search/?q=whatever` on its own, which means search from the header works with
JavaScript switched off as far as the search page itself.

```html
<form class="header-search" role="search" action="/search/" method="get">
  <label for="site-search" class="visually-hidden">Search this site</label>
  <input
    type="search"
    id="site-search"
    name="q"
    placeholder="Search…"
    autocomplete="off"
  />
  <button type="submit" class="header-search-button">
    <!-- magnifying glass svg, aria-hidden="true" -->
    <span class="visually-hidden">Search</span>
  </button>
</form>
```

Four things that are easy to get wrong here:

1. **The `<label>` is required and must be real**, not a `placeholder`. A placeholder
   disappears the moment someone types and is not announced reliably. CLAUDE.md §9,
   Understandable. Check whether `base.css` already has a `.visually-hidden` class — if
   not, add one, and use the clip-path form that keeps the text available to screen
   readers rather than `display: none`, which hides it from them too.
2. **The input border must be `--colour-border-input`** against `--colour-chrome`. That is
   the 3.65:1 / 3.24:1 row in the table in step 1.1 and it is the whole reason the band
   cannot be darker.
3. **The focus ring must be visible on the band**, not only on the page. Test it in both
   themes by tabbing to it.
4. **The input must be at least 24px tall**, and give it `min-width: 0` so it can shrink
   inside the flex header instead of forcing the header wider on a phone.

### 4.4 Layout of the header at each width

The header is already `display: flex; flex-wrap: wrap`. Add the search form between the
nav and the theme toggle. On a phone the order should be: wordmark on its own line, then
nav, then the search box full width on its own line, then the toggle. Get there by giving
`.header-search` `flex-basis: 100%` inside the existing `@media (max-width: 34rem)` block
rather than by adding a new breakpoint.

**Check at 360px and at 320px: the header must not scroll sideways.** This is the single
most likely thing in this work order to break that, because the search box is the first
fixed-ish-width thing the header has ever contained.

### 4.5 The search page reads the query

`src/pages/search.astro` needs to pick `?q=` out of the address and put it in Pagefind's
own input. Pagefind's component UI does not do this on its own.

This is the one piece of new JavaScript in this work order. Comment it to CLAUDE.md §4.2
standard — a reader who cannot read JavaScript should be able to follow it from the
comments alone. Structure it as:

```
// STEP 1 — Is there a search term in the address?
// STEP 2 — Find the box Pagefind drew, once it has drawn it.
// STEP 3 — Put the term in it and tell Pagefind the box changed.
```

Step 3 is the part that is not obvious: setting `input.value` in JavaScript does not make
anything happen, because nothing is listening for an assignment. Pagefind is listening for
the `input` event that a real person typing would cause, so the script has to raise that
event itself with `new Event("input", { bubbles: true })`.

Step 2 needs care because `<pagefind-input>` draws its own `<input>` asynchronously, after
its module has loaded. Poll for it with a short interval and **give up after about two
seconds** rather than looping forever. If it gives up, the reader still sees an empty
search box on the search page, which is a poor outcome but not a broken one — leave the
term visible in the address so they can see what they searched for.

Also: keep the existing `dev-note` behaviour, which hides the search area when Pagefind's
index is missing. Search still only works after `npm run build` — not under `npm run dev`.
Say so out loud when you hand this back, because it will look broken otherwise.

### 4.6 The footer picks up what the nav dropped

Add a block to `Footer.astro` — call it **This site** — with About, Now, Contact, and
Search. `Contact` and `Now` are otherwise unreachable after this change, and an
unreachable page is a broken page even though the URL still resolves.

**Check:** tab through the header with no mouse, in both themes, at full width and at
360px. Every link and the search field and the toggle must be reachable and visibly
focused.

**Commit:** `feat: rebuild the navigation and put search in the header`

---

## Step 5 — The home page

Remove the `.intro` section entirely — the three paragraphs about Anupam and the site go
to `/about/` in step 9. **Do not leave a shortened version behind.** The page now opens
with the newest thing written, which is the point of the change.

### 5.1 What replaces it

An `<h1>` is still required — one per page, and a page whose first heading is an article
title would make the article title the page title. Use the name plus one line of what the
site is, set small: this is an identity line, not a biography.

```
Anupam Kumar
Writing, data and tools on public finance, public policy, economics and geoeconomics.
```

Set the `<h1>` at `--size-xl`, not `--size-3xl`. The featured piece below it should be the
largest thing on the page.

### 5.2 Main column

- **Latest** — the newest piece from `getAllWriting()`, rendered by a new
  `src/components/FeaturedPiece.astro`: title at `--size-2xl`, the description as a
  standfirst at `--size-lg`, date, tags. It is a link, not a card — no border, no shadow,
  no background.
- **More recent** — pieces 2 to 5, using the existing `PieceCard`.
- **All writings and notes →** to `/writing/`.

If there is no writing at all, keep the existing empty state.

### 5.3 Aside

Four `SideBlock`s, in this order:

1. **Datasets** — two sentences on what they are, and a link to `/datasets/`. While the
   section is empty, the link text should say so: "Nothing published yet — what is coming".
2. **Tools** — the same shape, linking to `/tools/`.
3. **Browse by subject** — the top eight tags from `getAllTags()` with their counts, then
   a link to `/writing/` for the rest. Eight, not all of them: this list will be forty
   entries long in two years and a sidebar cannot hold forty.
4. **Elsewhere** — Substack, RSS, and the email address.

**Commit:** `feat: lead the home page with the newest piece`

---

## Step 6 — Writings and Notes

`src/pages/writing/index.astro`. The `<h1>` becomes **Writings and notes** (sentence case —
the nav label is title case because navigation labels are, the heading is not).

Move the `tag-nav` block out of the body and into the aside, and delete its now-unused
styles. The aside:

1. **Browse by subject** — every tag with its count. This page is where the full list
   belongs.
2. **In this section** — "All pieces" (`/writing/`), "Notes only" (`/notes/`). Mark which
   one the reader is on with `aria-current="page"`, not with colour alone.
3. **Elsewhere** — Substack, RSS.

`src/pages/notes/index.astro` gets the same shell and the same aside, with "Notes only"
marked as current, plus one line at the top of the main column saying this is a filtered
view and linking to the full list.

**Commit:** `feat: give the writing listing a right-hand column`

---

## Step 7 — Article pages

`src/layouts/PieceLayout.astro`. Wrap the existing `<article>` in `PageShell` and add the
aside. **Nothing inside the reading column changes** — the header, the standfirst, the
prose, the DataBox and the tag list in the footer all stay exactly as they are. The tags
appear in both places on purpose: at the foot for someone who has read to the end, in the
aside for someone deciding whether to.

The aside, all `SideBlock`s at `headingLevel={2}`:

1. **Tagged** — the piece's tags.
2. **Related** — up to four other pieces sharing at least one tag.
3. **Respond** — the Substack link if the piece has one, and `hello@anupamkumar.org`.
   Wording: something like "There are no comments here. Replies on Substack, or by email,
   both reach me." One sentence, no apology.
4. **Data behind this piece** — only when `data.datasets` is non-empty: a short list of
   links to each dataset page. The full `DataBox` stays in the article footer; this is a
   jump link, not a second copy.

### 7.1 The `related` helper

Add to `src/lib/writing.ts`, following the existing STEP-numbered comment style:

```ts
/**
 * Other pieces that share at least one tag with this one.
 * Ranked by how many tags they share, and by date where that ties,
 * so the most closely related piece comes first rather than merely
 * the most recent one.
 */
export async function getRelated(piece: Piece, limit = 4): Promise<Piece[]>
```

Exclude the piece itself by comparing `url`, not `slug` — an essay and a note could in
principle share a slug, and the URLs never collide.

A piece with no tags gets no related list, and the block is then not rendered at all.
Do not fall back to "most recent pieces" — an unrelated list under a heading that says
"Related" is worse than no list.

**Commit:** `feat: add a right-hand column to essays and notes`

---

## Step 8 — Datasets and Tools

Read CLAUDE.md §6 before this step, particularly §6.3 and §6.4. **This step builds the
machinery and the index pages. It does not build the per-dataset page** — see Part 2 below
for why.

### 8.1 `src/lib/datasets.ts`

A build-time reader. It runs in Node during `npm run build` and ships nothing to the
browser. Use `node:fs` and `node:path` — walk `data/`, find every `dataset.json`, parse it,
and return them sorted by `updated`, newest first.

Requirements:

- **Skip `_reference/` and `_templates/`.** Those hold lookup tables and starting
  templates, not published datasets.
- **A malformed `dataset.json` must fail the build, naming the file.** A dataset that
  silently disappears from the index because of a stray comma is exactly the failure this
  site cannot afford. Catch the parse error and re-throw it with the path in the message.
- **Compute `isStale`** from `updated` plus `stale_after_months`, against the build date.
  §6.10 item 7 requires a visible staleness banner and the index should carry the same
  signal.
- **Do not validate the shape beyond the administrative fields in §6.4.** §6.4 says there
  is no global column vocabulary and never will be. Check that `id`, `title`,
  `description`, `sources`, `licenses` and `updated` exist. Check nothing about `fields`
  beyond every entry having a `description`.

### 8.2 `src/pages/registry.json.ts`

A static endpoint emitting everything `datasets.ts` found, as JSON, at `/registry.json`.
Three or four lines of real code. This replaces the generated `data/registry.json` —
see §0.1 conflict 3.

### 8.3 `src/pages/datasets/index.astro`

`PageShell`, two columns.

Main column, when there are datasets: one entry each — title, description, the publisher,
the retrieved date, the row count, and a stale marker where `isStale`. Square corners
(`--radius-data`), 1px border, no shadow: §8.6 says a dataset is a record, not a card.

Main column, when there are none — and this is the state it will ship in:

> The first datasets are being prepared.
>
> Each one will carry the source it came from with a direct link, the date it was
> retrieved, every column described with its unit, and a script that rebuilds it from the
> original files. The original downloads are kept untouched alongside the cleaned version,
> so anyone can check the cleaning rather than take it on trust.
>
> Union budget expenditure and the RBI's state budget study are first in the queue.

Write it as prose in an accent-rail callout, matching `.external-notice`. **Do not draw
empty skeleton cards.** Adjust the last line if Anupam names different datasets.

Aside: **What makes a dataset here** (four short lines — source, vintage, units, what was
changed, per `/about/`), and **Reuse** (CC BY 4.0, and the note that official figures keep
their publisher's licence).

### 8.4 `src/lib/tools.ts` and `src/pages/tools/index.astro`

The same shape. `tools.ts` reads every `src/tools/*/tool.config.js` and returns the ones
whose `status` is not `"retired"`. `import.meta.glob` with `eager: true` is the right
mechanism here, since these are JavaScript modules inside `src/` rather than data files.

The tools index empty state:

> The first tools are being prepared.
>
> Everything will compute in your browser. If you open a state finance spreadsheet in a
> tool here, that file never leaves your laptop, because there is no server for it to go
> to. For anyone in government, a think tank or a newsroom handling figures that are not
> yet public, that is not a technical detail.

Aside: **How these work** (browser-side, nothing uploaded, the data behind each one is
downloadable) and **Datasets** linking across.

### 8.5 The one-way import rule still holds

CLAUDE.md rule 5: the site never imports from a tool. `src/lib/tools.ts` reading
`tool.config.js` files is a **discovery** step, not an import of tool code — it reads the
config module and nothing else. Test it the way §10 says: delete `src/tools/`, run
`npm run build`, confirm it still succeeds and `/tools/` shows the empty state, then
restore it. **Do this before committing.**

**Commit:** `feat: add the datasets and tools sections`

---

## Step 9 — About

### 9.1 The photo

**The file is supplied, already processed.** `profile-photo.webp`, 900 × 1267, 146 KB.
The studio backdrop has been removed, and the semi-transparent edge pixels around the hair
have been colour-corrected so they carry no light fringe — without that correction the
portrait has a visible white halo on a dark page. **Do not re-cut it, do not substitute a
placeholder, and do not convert it back to JPEG** — JPEG cannot hold transparency, so that
would silently flatten the background back onto it.

Put it in `src/assets/profile-photo.webp`, **not** `public/`. The difference matters: a
file in `public/` is served exactly as it is, whereas a file in `src/assets/` goes through
Astro's `<Image>`, which resizes it, re-encodes it for each screen density, and writes the
`width` and `height` into the markup so the page does not jump as it loads.

Check the installed Astro version's `astro:assets` documentation rather than assuming the
API — this repository is on Astro 7.

- `alt="Anupam Kumar"`. Not "profile photo", not `alt=""` — it is a portrait of the
  subject of the page.
- Display width around 12rem, so it is one column of a two-column block on a wide screen
  and sits above the text on a phone.
- **Put it on a panel of `--colour-surface-sunk` with `--radius-data` and `--space-4` of
  padding.** This is not decoration. The background is transparent and the suit is black,
  so on the dark theme the silhouette would dissolve into the page. The sunk surface is
  one step lighter than the page in dark and one step darker in light, which gives the
  outline something to sit against in both. Checked at 900px and at display size.
- `loading="eager"` — it is at the top of the page, so lazy-loading it only delays it.

`profile-photo.png` is also supplied: the same image, lossless, 857 KB. It is the master to
re-edit from if the crop or the panel colour ever needs changing. **Do not commit it** —
the WebP is the working file and both in Git would be two copies that can drift.

### 9.2 The text

Replace the whole page. The bio goes first, the existing material about the site follows
it, lightly edited. This is Anupam's own text, rewritten into the site's voice — first
person throughout, which is what `/about/` already used and what the old home page used.

**Show him this before committing.** It is his biography and the wording is his call.

```markdown
# About

## Anupam Kumar

I am a Program Associate on the Strategic Public Finance team at the
[Centre for Effective Governance of Indian States](https://cegis.org) (CEGIS), where I
work with state governments on how public money is raised, allocated and spent. Before
joining CEGIS full time I interned with Absolute Reports, CHRIST Consulting and CEGIS
itself — research, project management and a stretch in the education sector, which is
where a good deal of what I write here comes from.

I hold an MSc in Economics and Analytics from CHRIST (Deemed to be University),
Pune–Lavasa, and an MBA from Quantic School of Business and Technology, Washington, D.C.,
which I attended on a full scholarship. My first degree is a BCom Honours from CHRIST
(Deemed to be University), Bangalore, where I held consecutive scholarships for
leadership.

What holds my attention is the point where data-driven methods meet the social sector —
not the technology for its own sake, but the narrower question of whether better
measurement changes what a government actually does. Away from work I read, write, and
am always glad of a good argument about any of the above.

I am on [LinkedIn](https://www.linkedin.com/in/anupamkumar-connect/), and you can write
to me at hello@anupamkumar.org.
```

Then the existing sections, unchanged except as noted: **What this site is for**, **On the
data**, **On the tools**, **On how this site is built**, **Reuse and citation**, **Getting
in touch**.

Two edits to the existing text:

- The old page opened with "I work on public finance and public policy, and I write about
  economics and geoeconomics more broadly." Delete that paragraph — the new bio says it
  better and saying it twice is worse than saying it once.
- **Getting in touch** now repeats the email address that the bio just gave. Cut it down
  to the sentence that earns its place: that corrections are welcome and are a
  contribution rather than a complaint.

Three things from Anupam's draft were deliberately left out, and he should be told so he
can put them back if he disagrees:

- **"Recognized for my academic achievements and leadership qualities, I strive to build a
  personal brand in economic, financial, and management consulting."** This is a CV
  objective. On a site whose stated purpose is to make economic information usable by other
  people, a paragraph about building a personal brand undercuts the rest of the page.
- **"Committed to continuous learning and professional development and look forward to
  connecting with like-minded professionals."** Every LinkedIn profile says this, which is
  why it carries no information.
- **The poster presentation certificate and the national-level assessment recognition.**
  These are real but they are undergraduate-level credentials sitting next to two
  postgraduate degrees, where they read as padding rather than as achievement. They belong
  on a CV, and a CV is worth adding to this site as its own page if he wants one.

The page keeps `data-pagefind-body`.

### 9.3 The page gets an aside too

1. **Elsewhere** — LinkedIn, Substack, email, GitHub.
2. **This site** — one line each on Writings and Notes, Datasets, Tools, with links.

**Check:** the photo at 360px must not overflow, and the page must not scroll sideways.

**Commit:** `content: rewrite the about page with a profile and photo`

---

## Step 10 — Full check, then publish

```bash
npm run build      # must finish with no errors, and build the search index
npm run preview    # the only way to test search on this computer
npm run check-a11y # every page, both themes, 360px wide
```

Then, by hand, on the preview server — the automated check catches roughly a third of
what matters and CLAUDE.md §9 lists the rest:

1. **Tab through every new page with no mouse.** Header search, nav, theme toggle, every
   link in every aside. You must always be able to see where you are.
2. **Both themes, every page.** The chrome band, the search field border, the aside text.
3. **360px and 320px wide.** No sideways scrolling anywhere. The header is the risk.
4. **200% zoom.** The two-column pages should have collapsed to one long before this.
5. **Search.** Type in the header box on three different pages, press Enter, confirm the
   term arrives on `/search/` and results appear. Then switch JavaScript off and confirm
   the search page still explains itself rather than showing a dead box.
6. **The one-way import test.** Delete `src/tools/`, `npm run build`, confirm success,
   restore.

Then:

```bash
git status
git push
gh run watch
```

`gh run watch` follows the build on GitHub until it finishes. A green tick means the site
is live. If it goes red, `gh run view --log-failed` says why.

---

## Step 11 — What must happen next, and is not in this work order

**Publish at least one real piece.** The home page now leads with the newest thing written.
The newest thing written is currently `content/essays/11-09-2026-hello.md`, a placeholder
that says the site works. That was fine when it sat below a biography. As the first and
largest thing on the page it is not.

The two placeholders are `content/essays/11-09-2026-hello.md` and
`content/notes/11-09-2026-what-notes-are-for.md`. CLAUDE.md §16 says to delete them once
real writing exists. **Do not delete them before then** — the home page would then feature
a Substack piece from March 2026, and `/notes/` would be empty.

This is the same item that has been the remaining Phase 1 task since the site went up, and
this work order has not moved it. It is still the point of the phase.

---

# Part 2 — What is deliberately not being built yet

## The per-dataset page, and dataset downloads

Step 8 builds the reader, the index and the empty state. It does **not** build
`/datasets/<id>/` or the download endpoint that serves each dataset's CSV.

The reason is not effort. It is that a dataset page has to display the columns table, the
provenance box, the vintage handling and the licence for a dataset that actually exists,
and §6.3 is emphatic that datasets on this site will come in very different shapes. A
detail page designed against zero examples will fit the first real dataset badly and the
second one worse, and it will have set a precedent by then.

**Build it in one session alongside the first real dataset.** That session needs to cover:

- `src/pages/datasets/[...id].astro` — the detail page.
- A static endpoint serving each dataset's `clean/` files at `/data/<id>/<file>`. Files
  under `data/` are not in `public/`, so they are not served by default; this is the step
  that makes the download link on the page work, and it is the one piece of real plumbing.
- The staleness banner, from the `isStale` flag `datasets.ts` already computes.
- A citation block — how to cite the dataset, with the retrieved date.

**After that session, adding a dataset needs no code at all.** Part 3 below describes what
it looks like from then on.

## Tool pages and `ToolFrame`

Same argument, same answer. CLAUDE.md §10 specifies `ToolFrame` in detail — the provenance
box, the status badge, the `minViewport` card, the error boundary, `client:visible` lazy
loading. Build it alongside the first real tool, not before. A `ToolFrame` written against
no tool will be wrong about the thing that matters most, which is where the boundary
between the frame and the tool falls.

---

# Part 3 — The three routines

**This is the text to insert into CLAUDE.md as §17, and to write into
`docs/how-to/` as three files.** It answers what Anupam has to do, from now on, for each
of the three things he will do repeatedly.

---

## 17. The three routines

### 17.1 Publishing a piece of writing — no code, ever

This already needs no code and will not start needing any.

1. **Make a file** in `content/essays/` for a long piece, or `content/notes/` for a short
   one. Name it `DD-MM-YYYY-short-slug.md` — the date is for the file list; it does not
   appear in the web address.

2. **Put the frontmatter at the top**, between two `---` lines:

   ```yaml
   ---
   title: "The GST compensation cliff and what states do next"
   description: "One sentence. This is what shows in search results and in the listing."
   date: 2026-09-15
   tags: ["public-finance", "federalism", "gst"]
   draft: true
   ---
   ```

   `date` is ISO — `YYYY-MM-DD` — because software reads it. The filename is DD-MM-YYYY
   because a person reads it. They are different formats on purpose and both are correct.

3. **Write the piece in Markdown below it.** `##` for a heading, `*word*` for italics,
   `[text](address)` for a link, a blank line between paragraphs.

4. **Look at it:** `npm run dev`, then open the address it prints. `draft: true` hides it
   from the built site, so leave it there while writing.

5. **When it is ready:** change `draft: true` to `draft: false`, check every figure against
   its source, and read it once at phone width.

6. **Publish:**

   ```bash
   git add .
   git commit -m "essay: add the GST compensation cliff piece"
   git push
   ```

   Then `gh run watch`. A green tick means it is live, usually within two minutes.

7. **If it is also going to Substack:** paste it there afterwards and set Substack's
   canonical URL field to the address on this site, so the two copies do not compete in
   search results. Then put the Substack address in the piece's `substackUrl` field here
   and push again.

   **If it is not going to Substack — which is the normal case — there is nothing to do.**
   Leave `substackUrl` out entirely. `canonical` already defaults to `"self"`, which tells
   search engines this site is the original. A piece published only here is the default
   shape of a piece, not a special case, and nothing on the page will mention Substack.

**The only fields worth remembering** are `title`, `description`, `date`, `tags` and
`draft`. Everything else has a sensible default. The full list is in §11.

**If you get a field wrong, the build stops and names the file.** That is the content
schema in `src/content.config.ts` doing its job. A red cross is not a disaster; read what
it says.

#### Images, charts and links inside a piece

**Links** are plain Markdown: `[the Fifteenth Finance Commission report](https://…)`.
§9 asks for link text that means something on its own — never "click here", never a bare
URL, because a screen reader user often navigates by jumping between links and hears only
the link text.

**Images and charts live in a folder beside the piece, named after the piece.**

```
content/essays/
├── 15-09-2026-gst-compensation-cliff.md
└── 15-09-2026-gst-compensation-cliff/
    ├── committed-expenditure-share.svg
    └── collections-by-state.png
```

Reference them with a relative path:

```markdown
![Committed expenditure rose from 38% to 52% of revenue receipts between 2015 and 2025.](./15-09-2026-gst-compensation-cliff/committed-expenditure-share.svg)
```

Astro sees the relative path, runs the file through the same optimiser the profile photo
uses, and writes the width and height into the page. **An image referenced this way costs
nothing to maintain and needs no code.** An image dropped in `public/` and linked as
`/something.png` skips all of that and ships at full size — do not do it.

> **Verify this once before writing it into CLAUDE.md.** Relative images in Markdown are
> resolved by Astro's `glob()` loader, and this repository's collections have their `base`
> set to `./content/...`, which is outside `src/`. That combination works in current Astro
> but is worth proving rather than assuming. **Test it as part of step 1:** put a throwaway
> SVG in a folder beside `content/essays/11-09-2026-hello.md`, reference it, run
> `npm run build`, and confirm the built page points at a hashed, optimised file rather
> than the original name. Delete the test afterwards. If it does not work, say so and stop
> — the fallback is a `src/assets/essays/<slug>/` folder referenced through MDX, which is
> a worse routine for Anupam and should not be adopted without telling him why.

**The alt text states the finding, not the format.** This is §9 and it is the rule most
often got wrong. "Committed expenditure rose from 38% to 52% of revenue receipts between
2015 and 2025" is alt text. "Bar chart of expenditure" is not — it tells a reader who
cannot see the chart nothing they did not already know from the sentence above it.

**Charts: export from Python or R as SVG where you can.** An SVG stays sharp at any zoom,
is usually smaller than a PNG of the same chart, and its text is real text. Use PNG only
for something genuinely photographic. Use the `--chart-*` colours from §8.2 in the same
fixed order, never the accent green: §8.3 rule 2 keeps the chart palette and the site
palette apart.

**One thing about charts and the dark theme, decided now so it does not get decided
accidentally.** A chart exported from matplotlib or ggplot carries its own background. On
the dark theme a white-backed chart becomes a bright panel in the middle of a dark page.
The rule for now: **export charts on `--chart-surface` white, and treat the figure as a
printed plate** — a light rectangle with `--radius-data`, the same in both themes. It is
honest, it is what most data publications do, and it needs no machinery.

The better answer, when there are enough charts to justify it, is to export each chart
twice and swap them with `prefers-color-scheme` in a small `<Figure>` component. That is
worth building at roughly the fifth chart, not the first. **Do not build it as part of
this work order.**

**A chart with two or more series needs a legend, and four or fewer also need labels
directly on the marks** — §8.3 rule 4. If the chart is interactive rather than a picture,
it is not a chart in an essay any more; it is a tool, and §17.3 applies.

### 17.2 Adding a dataset — no code, once the detail page exists

Today this needs one build session (Part 2 above). **After that session, it is folders and
files and no code at all.**

1. **Decide where it goes.** §6.2: one of the eight fixed groups, by *jurisdiction*, never
   by topic. Topic goes in `keywords`, where one dataset can carry several and they can
   change without moving a file.

2. **Make the folder**, `data/<group>/<publisher-or-subject-slug>/`, no year in the name.

3. **Download the source files into `raw/` and write `SOURCES.md` before doing anything
   else.** Every file: where it came from, the direct URL, and the date. Do this first,
   while the browser tab is still open — reconstructing a URL three months later is the
   single most reliably painful thing in this whole workflow, and government portals
   reorganise constantly.

4. **Decide what shape this dataset actually is** — §6.3. Most are a tiny series or a
   medium table and need one CSV and nothing else. **Do not build a `build/` folder, a
   `METHOD.md` or a script for a dataset that did not need cleaning.** Structure that
   exists to look consistent teaches the next dataset to be more complicated than it is.

5. **Put the clean CSV in `clean/`.** UTF-8, one header row, nothing above it, no merged
   cells, no blank rows. Column names in `lowercase_snake_case` with the unit in the name
   or in its description.

6. **Write `dataset.json`.** Copy the nearest example from `data/_templates/`. Fill in the
   administrative fields — id, title, description, keywords, sources, licenses, updated,
   stale_after_months — and then describe every column the file actually has, in that
   dataset's own words, with its unit. Nothing prescribes what the columns must be.

   **Every column in the file must appear here, and every one must state its unit.** A
   column whose unit a reader has to guess is how a public finance dataset gets misused.

7. **Write `README.md` and `CHANGELOG.md`.** Plain English. If nothing was cleaned, the
   README says so: "no cleaning was needed; this is the source file with only the header
   row tidied" is a complete answer.

8. **Push.** The dataset appears at `/datasets/` and gets its own page, its download link
   and its entry in `/registry.json` automatically. **There is no list to update anywhere.**

**What can go wrong, and what it looks like:** if `dataset.json` has a typo the build stops
and names the file. If a column listed in `dataset.json` is not in the CSV, the
`validate-data.yml` workflow fails and says which column. Both are meant to happen and both
say what to fix.

### 17.3 Adding a dashboard or tool — this one needs code

There is no way round this and it is worth being straight about it. A dashboard is a
program: it reads data, watches filters, and redraws a chart. Writing and datasets are
content and can be pure content. A tool cannot be.

**What is true, though, is that a tool here is small and self-contained**, and the site's
architecture means you are never editing the site to add one.

1. **The dataset comes first.** Publish the data as a dataset by §17.2 before building
   anything that reads it. A tool with data that exists only inside it is not citable and
   not checkable.

2. **One folder, `src/tools/<tool-id>/`**, holding everything the tool needs. §10.

3. **`tool.config.js`** describes it to the rest of the site — id, title, summary, which
   datasets it uses, which engine, minimum viewport, status, updated. The tools index, the
   tags and the sitemap are all generated from these files. **There is no list to maintain.**

4. **`tool.js`** is the tool itself, following the five-step pattern in §4.4: load the data
   once, read the filters, keep the rows those filters select, hand them to Observable
   Plot, repeat when a filter changes. No React, no Vue. §4.4 explains why, and the short
   version is that a dashboard with a few filters and a few charts is a readable script,
   and a framework would add a build step and 45 KB in exchange for nothing.

5. **Only the libraries in §4.3.** Observable Plot for charts, Arquero for reshaping.
   DuckDB-WASM only when a dataset is genuinely too big for Arquero — several megabytes is
   a real cost to a reader on a phone.

6. **`README.md`** beside it, per §4.5, written for Anupam in two years having forgotten
   everything.

7. **Before committing, delete the folder and run `npm run build`.** It must still succeed.
   That is the one-way import rule (rule 5) and it is what keeps any tool deletable.

**What Anupam can realistically do himself**, given Python at beginner level and no
JavaScript:

- Decide what the tool should show and which filters it needs. This is the part that
  actually determines whether the tool is any good, and it is entirely his.
- Prepare the data — clean it in Python, publish it as a dataset.
- Read `tool.config.js` and change the title, summary or status.
- Read the comments in `tool.js` and follow what it is doing.

**What needs Claude Code:** writing `tool.js`, and changing what the tool does. Ask for
changes in terms of behaviour — "add a filter for year", "show states as small multiples
instead of one crowded chart" — rather than in terms of code. Expect the comments to
explain the result back.

**A rule worth keeping:** if a tool starts needing React, the tool is too complicated.
Simplify the tool. §4.4.

---

# Appendix — files this work order touches

| File | Step | What happens |
|---|---|---|
| `CLAUDE.md` | 1 | Amended — §5, §6.2, §7, §8.2, §8.6, new §8.8, §11, §12, new §17, §16 |
| `src/styles/tokens.css` | 2, 3 | Chrome colours in three blocks; `--width-aside` |
| `src/styles/base.css` | 3, 4 | Shared `.section-heading`; `.visually-hidden` if absent |
| `src/components/Header.astro` | 2, 4 | Band colour, new nav, `isCurrent` fix, search form |
| `src/components/Footer.astro` | 2, 4 | Band colour, "This site" block |
| `src/components/PageShell.astro` | 3 | New |
| `src/components/SideBlock.astro` | 3 | New |
| `src/components/FeaturedPiece.astro` | 5 | New |
| `src/pages/index.astro` | 5 | Rewritten |
| `src/pages/writing/index.astro` | 6 | Shell and aside; tag nav moves |
| `src/pages/notes/index.astro` | 6 | Shell and aside |
| `src/layouts/PieceLayout.astro` | 7 | Shell and aside |
| `src/lib/writing.ts` | 7 | `getRelated` |
| `src/lib/datasets.ts` | 8 | New |
| `src/lib/tools.ts` | 8 | New |
| `src/pages/registry.json.ts` | 8 | New |
| `src/pages/datasets/index.astro` | 8 | New |
| `src/pages/tools/index.astro` | 8 | New |
| `src/pages/about.astro` | 9 | Rewritten |
| `src/assets/profile-photo.webp` | 9 | New — supplied, already processed |
| `content/essays/<slug>/` | 1 | Convention only — images beside a piece; test in step 1 |
| `src/pages/search.astro` | 4 | Reads `?q=` |
| `docs/how-to/*.md` | 1 | New — three files from Part 3 |

**Not touched:** `astro.config.mjs`, `src/content.config.ts`, every file in `content/`,
every workflow in `.github/workflows/`, `package.json`. **If a step seems to need a change
to any of those, stop and say so** — it means something in this work order is wrong.
