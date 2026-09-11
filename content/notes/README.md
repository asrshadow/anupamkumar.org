# content/notes/

Short pieces with less ceremony. A reaction to a released figure, a clarification, a
pointer to something worth reading, a working thought.

The difference from `content/essays/` is one of weight, not of quality. A note is
something you would not want to have to structure with sections and citations, but which
is still worth keeping at a permanent address under your own name.

## Filename

`DD-MM-YYYY-short-slug.md`, exactly as for essays. A note publishes at
`/notes/<slug>/`.

## Frontmatter

The same shape as an essay, and usually shorter.

```yaml
---
title: "CGA monthly accounts, August 2026"
description: "One sentence."
date: 2026-09-15
tags: ["public-finance"]
draft: false
---
```

`canonical`, `substackUrl` and `datasets` work here too if a note needs them.

## When a note should have been an essay

If it grows past roughly a thousand words, acquires a table, or starts needing citations,
move the file to `content/essays/`. Do this **before** it is published for the first time.
Once the site has published a URL, moving the file breaks it, and the rule in the README
is that a published URL is never broken.

**Last updated:** 11 September 2026
