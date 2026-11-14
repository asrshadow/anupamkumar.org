# content/external/

**Every `.md` file in this folder is generated. Do not edit any of them by hand.**

These are copies of pieces first published on
[asranupam.substack.com](https://asranupam.substack.com), pulled in so that the writing
exists in this repository even if Substack does not exist in ten years.

## How they get here

`scripts/archive-substack.mjs` reads the Substack **public RSS feed**, converts each post
to Markdown and writes it here with `canonical: "substack"`.

**This happens by itself once a day, from your own computer.** Windows Task Scheduler runs
`scripts/sync-substack.ps1`, which runs the archiver and then commits and pushes anything
that changed. A new post gets a new file here, and a post edited on Substack has its file
rewritten. The one-time setup is in [scripts/README.md](../../scripts/README.md).

To do the same thing by hand at any time:

```powershell
powershell -ExecutionPolicy Bypass -File scripts\sync-substack.ps1
```

There is also a workflow that tries this daily on GitHub. **It does not work**, and that is
expected: Substack refuses requests coming from a data centre, which is where GitHub's
build machines are, and answers with a 403 whatever headers are sent. The run still goes
green, because the script gives up quietly rather than failing. That is why the sync runs
on your computer instead.

## Why the archiver only reads the feed

Substack has **no official publishing API**. Every wrapper you will find is either
reverse-engineered from their private endpoints or a paid relay, and both break without
warning when Substack changes something.

So the design depends on nothing more than a public RSS feed, and even that is optional:
**if the feed cannot be reached, the script does nothing and the build still succeeds.**
That is not a theoretical safeguard — it is what happens on GitHub every day, and nothing
breaks.

The consequence worth stating plainly: *wherever you write, everything ends up as a
Markdown file in this repository.* Substack is a writing surface and a mailing list. It is
never the archive.

## Canonical URLs

Files here carry `canonical: "substack"`, so the site's copy points outward to Substack as
the original. That is the correct direction for something written there first, and it stops
search engines treating the two copies as competitors.

## The wrong Substack address

`anupamkumar.substack.com` exists and belongs to a **different Anupam Kumar**, a tech
policy researcher. The correct feed, set once at the top of the archiver, is
`https://asranupam.substack.com/feed`. Pointing it at the other one would publish somebody
else's writing under this site's name.

## If you want to edit one

Do not edit it here. The next sync would overwrite your change.

Either fix it in Substack and the next sync updates the file here, or, if it has grown into
something you want to own properly, move the file to
`content/essays/`, change `canonical` to `"self"`, and set the canonical field in Substack
to point at this site instead.

## Owning the list, not just the letters

Export the Substack subscriber list every quarter and keep it somewhere private, **not in
this public repository**. The list is the asset. The platform holding it is not. This is
part of the [quarterly review](../../docs/checklists/quarterly-review.md).

**Last updated:** 14 November 2026
