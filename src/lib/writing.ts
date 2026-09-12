// ============================================================
// SHARED HELPERS FOR THE WRITING
//
// Several pages need the same three things: the list of
// published pieces, that list sorted newest first, and the web
// address of a piece. Writing that out on each page would mean
// four copies that can quietly disagree with each other.
//
// So it lives here once, and every page calls it.
// ============================================================

import { getCollection, type CollectionEntry } from "astro:content";

// A piece of writing can come from any of the three collections.
export type WritingEntry =
  | CollectionEntry<"essays">
  | CollectionEntry<"notes">
  | CollectionEntry<"external">;

// One piece, with the few extra things a listing needs to show
// it: which collection it came from, and where it lives.
export interface Piece {
  entry: WritingEntry;
  kind: "essay" | "note" | "external";
  slug: string;
  url: string;
  title: string;
  description: string;
  date: Date;
  updated?: Date;
  tags: string[];
  /** True when this was first published on Substack, not here. */
  isExternal: boolean;
  /** The Substack address, for pieces that have one. */
  substackUrl: string;
}

// ============================================================
// STEP 1 — Where each kind of piece lives on the site
// ============================================================

export function urlFor(kind: Piece["kind"], slug: string): string {
  if (kind === "note") return `/notes/${slug}/`;
  // Essays and archived Substack pieces share /writing/, because
  // to a reader they are both just "things he has written", and a
  // piece that moves between the two should keep its address.
  return `/writing/${slug}/`;
}

// ============================================================
// STEP 2 — Turn a raw collection entry into a Piece
// ============================================================

function toPiece(entry: WritingEntry, kind: Piece["kind"]): Piece {
  return {
    entry,
    kind,
    slug: entry.id,
    url: urlFor(kind, entry.id),
    title: entry.data.title,
    description: entry.data.description,
    date: entry.data.date,
    updated: entry.data.updated,
    tags: entry.data.tags,
    isExternal: kind === "external",
    substackUrl: entry.data.substackUrl ?? "",
  };
}

// ============================================================
// STEP 3 — Hide drafts, and hide nothing else
//
// A piece marked draft: true never reaches the built site. This
// check happens in one place so it cannot be forgotten on a page.
// ============================================================

function isPublished(entry: WritingEntry): boolean {
  return entry.data.draft !== true;
}

// ============================================================
// STEP 4 — Newest first
//
// Sorted by the date field inside the file, NEVER by the
// filename. Filenames here are DD-MM-YYYY, which does not sort
// chronologically — 15-09-2026 would come before 16-08-2026.
// ============================================================

function newestFirst(a: Piece, b: Piece): number {
  return b.date.getTime() - a.date.getTime();
}

// ============================================================
// STEP 5 — The lists the pages actually ask for
// ============================================================

/** Long pieces written here. */
export async function getEssays(): Promise<Piece[]> {
  const entries = await getCollection("essays", isPublished);
  return entries.map((entry) => toPiece(entry, "essay")).sort(newestFirst);
}

/** Short pieces written here. */
export async function getNotes(): Promise<Piece[]> {
  const entries = await getCollection("notes", isPublished);
  return entries.map((entry) => toPiece(entry, "note")).sort(newestFirst);
}

/** Pieces archived from Substack. */
export async function getExternal(): Promise<Piece[]> {
  const entries = await getCollection("external", isPublished);
  return entries.map((entry) => toPiece(entry, "external")).sort(newestFirst);
}

/**
 * Everything, from all three collections, newest first.
 * This is what /writing/ and the RSS feed use.
 */
export async function getAllWriting(): Promise<Piece[]> {
  const essays = await getEssays();
  const notes = await getNotes();
  const external = await getExternal();
  return [...essays, ...notes, ...external].sort(newestFirst);
}

/**
 * Everything that appears at /writing/<slug>/ — essays plus
 * archived Substack pieces. Used to build those pages.
 */
export async function getWritingSection(): Promise<Piece[]> {
  const essays = await getEssays();
  const external = await getExternal();
  return [...essays, ...external].sort(newestFirst);
}

// ============================================================
// STEP 6 — Tags
// ============================================================

/**
 * Every tag used anywhere, with how many pieces carry it.
 * Sorted by count, then alphabetically, so the tag list has a
 * stable order rather than shuffling whenever something is added.
 */
export async function getAllTags(): Promise<{ tag: string; count: number }[]> {
  const all = await getAllWriting();
  const counts = new Map<string, number>();

  for (const piece of all) {
    for (const tag of piece.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  const list = Array.from(counts, ([tag, count]) => ({ tag, count }));
  list.sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
  return list;
}

/** Everything carrying one particular tag. */
export async function getPiecesByTag(tag: string): Promise<Piece[]> {
  const all = await getAllWriting();
  return all.filter((piece) => piece.tags.includes(tag));
}

/**
 * Other pieces that share at least one tag with this one.
 *
 * Ranked by how many tags they share, and by date where that ties,
 * so the most closely related piece comes first rather than merely
 * the most recent one.
 *
 * A PIECE WITH NO TAGS GETS AN EMPTY LIST, and the block that shows
 * this is then not drawn at all. There is deliberately no fallback
 * to "the most recent pieces": an unrelated list under a heading
 * that says "Related" is worse than no list, because it teaches a
 * reader that the heading cannot be trusted.
 */
export async function getRelated(piece: Piece, limit = 4): Promise<Piece[]> {
  if (piece.tags.length === 0) return [];

  const everything = await getAllWriting();

  const scored = [];

  for (const other of everything) {
    // Skip the piece itself.
    //
    // Compared by URL rather than by slug, because an essay and a
    // note could in principle be given the same slug, and their
    // URLs never collide. Comparing slugs would then hide an
    // unrelated piece from its own related list.
    if (other.url === piece.url) continue;

    // How many tags do the two have in common?
    let shared = 0;
    for (const tag of other.tags) {
      if (piece.tags.includes(tag)) shared = shared + 1;
    }

    if (shared === 0) continue;

    scored.push({ piece: other, shared });
  }

  // Most tags in common first. Where two pieces share the same
  // number, the newer one comes first.
  scored.sort((a, b) => {
    if (b.shared !== a.shared) return b.shared - a.shared;
    return b.piece.date.getTime() - a.piece.date.getTime();
  });

  return scored.slice(0, limit).map((entry) => entry.piece);
}

// ============================================================
// STEP 7 — Dates, written the way a person reads them
//
// "15 September 2026". Not 15/09/2026, which means something
// different in the United States, and not the ISO form, which is
// for software.
// ============================================================

// ============================================================
// STEP 8 — A longer summary, for the featured piece
//
// The "description" field in a piece's frontmatter is ONE
// SENTENCE. That is on purpose: it is also what search engines
// show, and they cut a description off at roughly 155 characters.
// Writing 40 words there would fix the home page and spoil the
// search result.
//
// So where a longer summary is wanted — currently only the
// featured piece at the top of the home page — it is taken from
// the opening of the piece instead. Nothing extra to write.
//
// This reads the raw Markdown, so it has to strip the Markdown
// out again. That is what most of the function below is doing.
// ============================================================

export function excerptOf(piece: Piece, wordLimit = 40): string {
  // The piece's own text, before Astro turns it into HTML.
  const raw = piece.entry.body ?? "";

  // Work paragraph by paragraph, and take the first one that is
  // actually prose. The opening of a piece is often an image, a
  // generated comment or a heading, none of which summarise it.
  const paragraphs = raw.split(/\n\s*\n/);

  for (const block of paragraphs) {
    const text = stripMarkdown(block);

    // Too short to be a real paragraph — a caption, a stray line.
    if (text.length < 60) continue;

    return trimToWords(text, wordLimit);
  }

  // Nothing usable. The caller falls back to the description.
  return "";
}

/** Take the Markdown marks off a block, leaving the words. */
function stripMarkdown(block: string): string {
  let text = block;

  // Generated files from Substack open with an HTML comment.
  text = text.replace(/<!--[\s\S]*?-->/g, "");

  // Images first, so that the "!" of an image is gone before links
  // are handled — otherwise an image becomes a stray "!" plus the
  // alt text, which reads as shouting.
  text = text.replace(/!\[[^\]]*\]\([^)]*\)/g, "");

  // A link keeps its words and loses its address.
  text = text.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1");

  // Any remaining HTML tags.
  text = text.replace(/<[^>]+>/g, "");

  // Emphasis, code marks, heading hashes, quote marks and list
  // bullets at the start of a line.
  text = text.replace(/[*_`]/g, "");
  text = text.replace(/^\s{0,3}#{1,6}\s+/gm, "");
  text = text.replace(/^\s{0,3}[>\-+*]\s+/gm, "");

  // Collapse every run of whitespace, including the line breaks
  // inside a paragraph, into single spaces.
  return text.replace(/\s+/g, " ").trim();
}

/**
 * Cut to roughly the word limit, then stop at the end of a
 * sentence if one is near, so the summary does not break off in
 * the middle of a clause.
 */
function trimToWords(text: string, wordLimit: number): string {
  const words = text.split(" ");

  // Already short enough to use whole.
  if (words.length <= wordLimit) return text;

  const cut = words.slice(0, wordLimit).join(" ");

  // Prefer ending on a full stop, if one falls in the last third.
  const lastStop = Math.max(
    cut.lastIndexOf(". "),
    cut.lastIndexOf("? "),
    cut.lastIndexOf("! "),
  );

  if (lastStop > cut.length * 0.6) return cut.slice(0, lastStop + 1);

  // Otherwise trail off, so it is visibly an extract.
  return cut.replace(/[,;:]$/, "") + "…";
}

// ============================================================
// STEP 9 — Writing a tag out for a reader
//
// Tags are stored lowercase with dashes, because that is what a
// web address needs: "public-finance", "brics". A reader should
// see "Public finance" and "BRICS".
//
// The acronym list is why this is a shared function rather than
// one line repeated on each page. Simply capitalising the first
// letter turns "brics" into "Brics" and "gst" into "Gst", which
// looks like a mistake on a public finance site — and it was one,
// on the first essay that used such a tag.
//
// ADD TO THIS LIST whenever a tag is an acronym. It is the whole
// point of the function.
// ============================================================

const ACRONYM_TAGS = new Set([
  "brics",
  "gst",
  "gdp",
  "gsdp",
  "rbi",
  "cag",
  "cga",
  "imf",
  "oecd",
  "un",
  "us",
  "frbm",
  "ndb",
  "plfs",
  "nss",
  "nfhs",
  "asi",
  "cea",
  "g20",
  "g7",
  "ai",
]);

export function displayTag(tag: string): string {
  // An acronym is shown in capitals, whole.
  if (ACRONYM_TAGS.has(tag)) return tag.toUpperCase();

  // Anything else: dashes become spaces, first letter capitalised.
  // Only the first word — "public finance", not "Public Finance",
  // because a tag is a subject and not a title.
  const spaced = tag.replace(/-/g, " ");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

/** The machine-readable form, for the datetime attribute. */
export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
