# content/external/

**Every `.md` file in this folder is generated. Do not edit any of them by hand.**

These are copies of pieces first published on
[asranupam.substack.com](https://asranupam.substack.com), pulled in so that the writing
exists in this repository even if Substack does not exist in ten years.

## How they get here

`scripts/archive-substack.mjs` reads the Substack **public RSS feed**, converts each post
to Markdown and writes it here with `canonical: "substack"`.

**Run it on your own computer after publishing something on Substack:**

```bash
npm run archive-substack
```

Then commit what it wrote. The script never overwrites a file that already exists, so a
post is captured once and then left alone, and running it twice is safe.

There is also a workflow that tries this daily on GitHub. **It does not currently work**,
and that is expected: Substack refuses requests coming from a data centre, which is where
GitHub's build machines are, and answers with a 403 whatever headers are sent. The run
still goes green, because the script gives up quietly rather than failing. It is kept
because it costs nothing and will start working on its own if Substack ever relaxes.

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

Do not edit it here — the archiver would not notice, and the change would be lost if the
file were ever regenerated.

Either fix it in Substack and delete the local file so the archiver fetches it again, or,
if it has grown into something you want to own properly, move the file to
`content/essays/`, change `canonical` to `"self"`, and set the canonical field in Substack
to point at this site instead.

## Owning the list, not just the letters

Export the Substack subscriber list every quarter and keep it somewhere private, **not in
this public repository**. The list is the asset. The platform holding it is not. This is
part of the [quarterly review](../../docs/checklists/quarterly-review.md).

**Last updated:** 11 September 2026
