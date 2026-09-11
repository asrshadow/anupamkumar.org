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

// ============================================================
// STEP 7 — Dates, written the way a person reads them
//
// "15 September 2026". Not 15/09/2026, which means something
// different in the United States, and not the ISO form, which is
// for software.
// ============================================================

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
