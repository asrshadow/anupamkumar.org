# Checklist — publishing an essay

A one-person project forgets things. This is the routine written down so it does not have
to be remembered.

---

## 1. Write it

Create the file in `content/essays/` named `DD-MM-YYYY-short-slug.md`.

Fill in the frontmatter block at the top. `title`, `description`, `date` and `tags` are
required; the rest can wait. Keep `draft: true` while it is unfinished — a draft is not
published even if it is committed and pushed.

## 2. Check the figures

- [ ] Every number in the piece traces back to a dataset or a named source
- [ ] Every dataset named in the `datasets` frontmatter field is actually published and
      current
- [ ] Every vintage is labelled. A Revised Estimate described as an Actual is the error
      that costs the most credibility
- [ ] Units are stated wherever a figure appears
- [ ] Every abbreviation is expanded on first use

## 3. Read it on your own machine

```bash
npm run dev
```

Open the address it prints. Then:

- [ ] Read the whole piece at full width
- [ ] Narrow the browser window to about the width of a phone. Does the page scroll
      sideways? It must not. Tables scroll inside their own box; the page never does
- [ ] Switch to dark mode and read a few paragraphs. Anything hard to see?
- [ ] Click every link in the piece
- [ ] Press Tab repeatedly from the top. Can you reach every link, and always see where
      you are?

Press `Ctrl+C` in the terminal to stop the preview.

## 4. Set `draft: false`

The piece is not published until this is changed.

## 5. Commit and push

In the Source Control panel in VS Code: type a message, click the tick to commit, then
click Sync to push. Or in the terminal:

```bash
git status                                  # see what changed. Always safe to run
git add .                                   # stage everything that changed
git commit -m "essay: add GST compensation cliff piece"
git push                                    # this publishes the site
```

Commit messages are `type: what changed`, in plain English and present tense. If a message
needs the word "and", it is probably two commits.

## 6. Confirm it published

```bash
gh run watch
```

Wait for the green tick, then open the piece on the live site and read the first
paragraph. A build that succeeded is not the same as a page that looks right.

## 7. Cross-post to Substack

- [ ] Paste the rendered piece into a new Substack post
- [ ] **Set the canonical URL field in Substack to the address on your own site.** Without
      this, search engines treat the two copies as competitors and split the ranking
      between them
- [ ] Send

This step is two minutes of manual work and depends on no automation that can break.

---

**Last updated:** 11 September 2026
