# Writing framework

The rules every essay, note, explainer and page summary on this site is written and checked
against. **CLAUDE.md points here**, so Claude applies this file to all new writing without
having to re-read the outside sources it was drawn from.

**This file is meant to grow.** When a new resource is worth learning from, add a row to the
table in §7, then add its rules to the section they belong in, marked with the source's
number. Never paste a whole outside document in. Take the rules that fit this site, and say
in §7 what was left out and why.

**Last updated:** 25 October 2026

---

## 1. How to use this file

- **Writing a piece:** draft it, then go through §2 to §5 in order, then the checklist in §6.
- **Editing Anupam's own writing:** keep his voice, his examples and his argument. Apply §3
  only to clear tells, and §5 in full. Never rewrite a piece into a different voice.
- **The rules in CLAUDE.md come first.** §9 (accessibility) and §11 (content rules) win over
  anything here.

## 2. Write for the reader [S1]

Every piece is for a specific reader. For this site that is usually a general reader, with
no background in economics, who arrived from a link on a phone.

- Say near the top what the reader will get from the piece, in their terms.
- Organise around what the reader needs to understand, not around the order of the sources.
- Carry one real example through the piece, with real numbers where there are any.
- Use numbered lists for steps in order and bullet points for things to check. Use
  paragraphs for argument.
- Answer plainly. "No" and "nobody knows" are complete answers.
- Cut hedges that protect the writer rather than inform the reader, and asides that
  interrupt.
- Define every technical term the first time it appears. This is also CLAUDE.md §9.

## 3. Remove AI writing patterns [S1, S2]

Fix each pattern by stating the underlying claim plainly, not by swapping in a new
flourish.

**Cut or rewrite:**

- **Filler:** throat-clearing ("Here's the thing"), emphasis crutches ("Let that sink in"),
  meta-commentary ("In this section we will explore"), "It is worth noting", and business
  jargon ("navigate the landscape", "leverage").
- **Staged contrasts** such as "Not X. Y." or "It's not X, it's Y." State Y.
- **Manufactured rhythm:** dramatic fragments, rhetorical questions answered at once ("The
  result? Devastating."), three-part lists that exist only for cadence, and paragraphs that
  end on a one-line restatement of themselves.
- **AI vocabulary:** "delve", "tapestry", "pivotal role", "quietly", "serves as",
  "highlighting its importance", "in today's world", invented labels for concepts, and
  inflated stakes.
- **Vagueness:** sentences that name nothing ("the reasons are structural"), "experts argue"
  with no expert named, and "every", "always" or "never" used loosely.
- **False agency**, where a thing does a person's verb ("the data tells a story"). Name who
  did it.
- **Signposting:** announcing what is coming, then summarising what was said. "In
  conclusion." "Despite these challenges."
- **Formatting tells:** em dashes in running prose, unicode arrows, and lists where every
  item opens with a bolded keyword.

**Keep:** names, numbers and examples; "you" for the reader where the piece talks to them;
varied sentence length; short plain sentences that carry information.

**One house exception to the em-dash rule:** a title may use a dash between a subject and
its framing, as the BRICS essay does. The rule is about running prose.

**Technical clean-up [S2]:** before committing, make sure the file contains no zero-width
characters (U+200B, U+200C, U+200D, U+2060). They come in through copy and paste, are
invisible, and break search and copying.

## 4. Search and discovery

Most readers arrive from a link someone shared or from a search. These rules make a piece
easy to find and easy to judge in a search result. They are general good practice for a
static site, not outside data. The site has no SEO tool and needs none (see §7, S1).

- **Title:** says what the piece is about in plain words a reader would search for. Aim for
  under about 60 characters so it is not cut short in search results.
- **Description** (the frontmatter field): one sentence, about 120 to 160 characters, that
  makes sense on its own. It is shown in search results, link previews and the site's
  listings.
- **One `h1`** (the title, added by the site), then `##` headings that never skip a level
  (CLAUDE.md §8.5). Headings should say what the section contains.
- **The filename slug** becomes the web address. Make it short and descriptive, and never
  change it after publishing (CLAUDE.md rule 8).
- **Link to related pieces and datasets on this site** where they genuinely help, with link
  text that means something on its own (CLAUDE.md §9).
- **Alt text states the finding** (CLAUDE.md §9).
- **Write for people first.** Do not repeat a search phrase to rank for it. A piece that
  answers its reader's question fully is what ranks.

## 5. Accuracy and citation [S1]

- **Do not make things up.** Quotations, figures, dates and biographical facts must be
  real. Framing, figures of speech and opinions are the author's call.
- **Cite a book as:** Author, *Title: Subtitle* (Place: Publisher, Year), p. N.
- **Cite a document or web page** with a link whose text names it: "the Fifteenth Finance
  Commission report", never a bare address.
- **Anything quoted from memory is flagged** in `docs/HANDOVER.md` for Anupam to check
  against the source before it is relied on.
- **Never add a reference that has not been checked to exist.** A citation generator that
  makes up plausible references is worse than no citation.

## 6. Before publishing — the checklist

- [ ] The reader and what they get are clear from the first paragraph (§2).
- [ ] Every technical term is defined on first use (§2).
- [ ] No pattern from §3 is left: read the piece once looking only for them.
- [ ] No em dashes in running prose; no zero-width characters (§3).
- [ ] Title under about 60 characters; description one sentence of about 120–160 (§4).
- [ ] Headings in order, none skipped (§4).
- [ ] Every quotation and figure checked, or flagged in the handover (§5).
- [ ] Every citation in the house format (§5).
- [ ] The publishing routine in CLAUDE.md §17.1 followed.

## 7. Sources this file draws on

Add a row for each new resource. Say what was taken and what was left out, so nobody has to
re-read the source to find out.

| # | Resource | Taken | Left out, and why |
|---|---|---|---|
| S1 | [OpenSEO](https://github.com/every-app/open-seo) (MIT), read 25 October 2026. Its agent skills `openseo-review-web-content` and `deslop`; `deslop` is itself adapted from [stephenturner/skill-deslop](https://github.com/stephenturner/skill-deslop) (MIT). | §2 (writing for the reader), §3 (AI writing patterns), §5 (do not make things up). | **The SEO software itself.** It needs a running server and a paid DataForSEO account with an API key. That breaks CLAUDE.md rule 1 (no secrets), rule 4 (no server) and the free-only budget. Its audit method assumes paid ranking data, so §4 uses general practice instead. |
| S2 | [Turnitout Humanizer](https://github.com/AhmadHassan-BTed/Turnitout-Humanizer), read 25 October 2026. | §3: the AI-phrase and em-dash rules (which overlap with S1), removing zero-width characters, and leaving citations and quotations untouched when editing. | **The tool itself.** It works through a hosted web app, or an API that needs a key from its developer, so a draft would leave the repository for a third party (rule 1, and §1's principle that nothing depends on a platform). Its method swaps in synonyms and reshapes clauses automatically, which can change the meaning of a technical term or a quotation. Its stated purpose is to get past AI and plagiarism detectors. This site's aim is clear, accurate writing, not getting past a checker. |
