# content/external/

**Every file in this folder is generated. Do not edit any of them by hand.**

These are copies of pieces first published on
[asranupam.substack.com](https://asranupam.substack.com), pulled in automatically so that
the writing exists in this repository even if Substack does not exist in ten years.

## How they get here

`scripts/archive-substack.mjs` reads the Substack **public RSS feed**, converts each post
to Markdown and writes it here with `canonical: "substack"`. A GitHub Actions workflow runs
it once a day.

The script never overwrites a file that already exists, so a post is captured once and then
left alone.

## Why the archiver only reads the feed

Substack has **no official publishing API**. Every wrapper you will find is either
reverse-engineered from their private endpoints or a paid relay, and both break without
warning when Substack changes something.

So the design depends on nothing more than a public RSS feed, and even that is optional:
**if the feed cannot be reached, the script does nothing and the build still succeeds.**
If the archiver ever stopped working entirely, the fallback is copying a post into a file
by hand, and nothing would be lost.

The consequence worth stating plainly: *wherever you write, everything ends up as a
Markdown file in this repository.* Substack is a writing surface and a mailing list. It is
never the archive.

## Canonical URLs

Files here carry `canonical: "substack"`, so the site's copy points outward to Substack as
the original. That is the correct direction for something written there first, and it stops
search engines treating the two copies as competitors.

## If you want to edit one

Do not edit it here. Either fix it in Substack and delete the local file so the archiver
fetches it again, or — if it has grown into something you want to own properly — move the
file to `content/essays/`, change `canonical` to `"self"`, and set Substack's canonical
field to point at this site instead.

## Owning the list, not just the letters

Export the Substack subscriber CSV every quarter and keep it somewhere private. The list
is the asset. The platform holding it is not. This is part of the quarterly review in
[docs/checklists/quarterly-review.md](../../docs/checklists/quarterly-review.md).

**Last updated:** 11 September 2026
