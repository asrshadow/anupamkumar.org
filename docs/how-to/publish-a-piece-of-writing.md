# How to publish a piece of writing

**No code, ever.** This routine needs none today and will not start needing any.

The same text is §17.1 of `CLAUDE.md`. It is here as well because this is the one you will
reach for most often.

---

## 1. Make a file

In `content/essays/` for a long piece, or `content/notes/` for a short one.

Name it `DD-MM-YYYY-short-slug.md`, for example `15-09-2026-gst-compensation-cliff.md`.
The date is for the file list. **It does not appear in the web address** — that piece
publishes at `/writing/gst-compensation-cliff/`.

## 2. Put the frontmatter at the top

Between two `---` lines, before anything else in the file:

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
because a person reads it. **They are different formats on purpose and both are correct.**

## 3. Write the piece in Markdown below it

`##` for a heading, `*word*` for italics, `**word**` for bold, `[text](address)` for a
link, and a blank line between paragraphs.

## 4. Look at it

```bash
npm run dev
```

Open the address it prints. The page reloads whenever you save. `Ctrl+C` stops it.

`draft: true` hides the piece from the built site, so leave it there while you are still
writing.

## 5. When it is ready

- Change `draft: true` to `draft: false`.
- Check every figure against its source.
- Read it once at phone width — narrow the browser window until it is about as wide as a
  phone.

## 6. Publish

```bash
git add .
git commit -m "essay: add the GST compensation cliff piece"
git push
```

Then:

```bash
gh run watch
```

A green tick means it is live, usually within two minutes.

## 7. Only if it is also going to Substack

Paste it there afterwards and **set Substack's canonical URL field to the address on this
site**, so the two copies do not compete with each other in search results. Then put the
Substack address in the piece's `substackUrl` field here and push again.

**If it is not going to Substack — which is the normal case — there is nothing to do.**
Leave `substackUrl` out entirely. `canonical` already defaults to `"self"`, which tells
search engines this site is the original. A piece published only here is the default shape
of a piece, not a special case, and nothing on the page will mention Substack.

---

## The only fields worth remembering

`title`, `description`, `date`, `tags`, `draft`. Everything else has a sensible default.
The full list is in `CLAUDE.md` §11.

**If you get a field wrong, the build stops and names the file.** That is deliberate — it
is the content schema doing its job. A red cross is not a disaster. Read what it says.

---

## Images and charts

**They live in a folder beside the piece, named after the piece.**

```
content/essays/
├── 15-09-2026-gst-compensation-cliff.md
└── 15-09-2026-gst-compensation-cliff/
    ├── committed-expenditure-share.svg
    └── collections-by-state.png
```

Reference them with a relative path, starting `./`:

```markdown
![Committed expenditure rose from 38% to 52% of revenue receipts between 2015 and 2025.](./15-09-2026-gst-compensation-cliff/committed-expenditure-share.svg)
```

Astro runs the file through its optimiser, shrinks it, converts a PNG to WebP
automatically, and writes the width and height into the page so nothing jumps about as it
loads. **This costs nothing to maintain and needs no code.**

An image dropped into `public/` and linked as `/something.png` skips all of that and ships
at full size. Do not do it.

**Resize a photograph to about 1280 pixels wide before you commit it.** That is enough for
a high-density screen at the width the text column actually is. Anything bigger sits in the
repository forever for no visible gain — the build makes every smaller copy it needs from
that one file.

### The first image becomes the thumbnail

**You do not have to do anything for this.** The first image in a piece is used
automatically as its thumbnail: large at the top of the home page when the piece is the
newest one, and small beside the title in every listing.

**If you want a different thumbnail, put a different image first.** That is the whole
control, and it is deliberate — a frontmatter field naming the thumbnail is a field that
gets forgotten, and then half the listing has pictures and half does not for no reason a
reader can see.

The picture is cropped to fit a fixed shape so that a column of entries lines up neatly
down the page. A tall portrait will therefore show its middle. If that matters for a
particular image, put a wider one first.

**A piece with no image just has no thumbnail** and takes the full width. Nothing is drawn
in its place.

**A piece archived from Substack gets no thumbnail**, because its pictures are stored on
Substack rather than here, and the site does not draw on their servers to look right.

### The alt text states the finding, not the format

This is the rule most often got wrong, and it matters more than it looks.

> ✅ `Committed expenditure rose from 38% to 52% of revenue receipts between 2015 and 2025.`
>
> ❌ `Bar chart of expenditure`

The second tells a reader who cannot see the chart nothing they did not already know from
the sentence above it.

### Exporting charts

- **SVG where you can.** It stays sharp at any zoom, is usually smaller than a PNG of the
  same chart, and its text is real text. Use PNG only for something genuinely photographic.
- **Use the `--chart-*` colours** from `CLAUDE.md` §8.2, in that fixed order. Never the
  accent green — the chart palette and the site palette are kept apart on purpose.
- **Export on a white background** and treat the figure as a printed plate: a light
  rectangle, the same in both themes. A chart from matplotlib or ggplot carries its own
  background, and a white-backed chart on the dark theme would otherwise be a bright panel
  in the middle of a dark page. This is what most data publications do and it needs no
  machinery.
- **Two or more series need a legend**, and four or fewer also need labels directly on the
  marks.

### Links

Plain Markdown: `[the Fifteenth Finance Commission report](https://…)`.

Link text has to mean something on its own — never "click here", never a bare address. A
screen reader user often navigates by jumping from link to link and hears only the link
text.

---

**Last updated:** 12 September 2026
