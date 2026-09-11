# content/essays/

Long pieces, **canonical on this site**. Anything with tables, charts, footnotes or
citations belongs here rather than in Substack, because this is the copy that has to
survive.

## Filename

`DD-MM-YYYY-short-slug.md`, for example `15-09-2026-gst-compensation-cliff.md`.

The date prefix is for your eyes in the file list. **The website strips it**, so that file
publishes at `/writing/gst-compensation-cliff/`. The date the site displays and sorts by
comes from the `date` field inside the file, never from the filename.

One known consequence, so it is not a surprise later: files named this way do not sort
chronologically in VS Code. `15-09-2026` sorts before `16-08-2026`. This affects only the
file list, never the site.

## Frontmatter

The block at the top of every essay, between the `---` lines.

```yaml
---
title: "The GST compensation cliff and what states do next"
description: "One sentence. Used in search results and link previews."
date: 2026-09-15                      # ISO format, because software reads this
updated: 2026-10-02                   # only if substantively revised. Delete if not.
tags: ["public-finance", "federalism", "gst"]
canonical: "self"                     # "self" or "substack"
substackUrl: ""                       # fill in after cross-posting
datasets: ["union/gst-collections"]   # draws a "data behind this piece" box
draft: false                          # true hides it from the built site
---
```

Only `title`, `description`, `date` and `tags` are required. The rest have sensible
defaults.

## Canonical URLs, and why they matter

If the same essay exists here and on Substack without one being declared canonical, search
engines treat them as two competing copies and split the ranking between them.

- **Written here first:** leave `canonical: "self"`. After pasting into Substack, set
  Substack's own canonical field to the essay's address on this site.
- **Written in Substack first:** that piece does not belong in this folder. The archiver
  puts it in `content/external/` automatically.

## Before publishing

The full routine is in [docs/checklists/publishing-an-essay.md](../../docs/checklists/publishing-an-essay.md).

**Last updated:** 11 September 2026
