// Pure binder/collection logic. No React, no storage. Everything returns new objects; unchanged input is returned as the same reference
// (the store relies on that to know what to persist).
import type { CardDefinition, CardGame } from "@/services/cards/types";

export type BinderGame = CardGame | "mixed";
export type ItemStatus = "Owned" | "Wishlist" | "For Trade" | "Sold";
export const POCKETS = 9; // 3x3. Other sizes (4, 12) only need a new `pockets` value plus a column count in the UI.

export interface BinderSlot {
  id: string;
  position: number;
  collectionItemId: string | null;
}
export interface BinderPage {
  id: string;
  slots: BinderSlot[];
} // page number = index + 1, so reordering never needs renumbering
export interface BinderAppearance {
  accent: string;
  coverImage?: string;
  backgroundImage?: string;
  backgroundOpacity?: number;
}
export interface Binder {
  id: string;
  name: string;
  game: BinderGame;
  pockets: number;
  pages: BinderPage[];
  appearance: BinderAppearance;
  createdAt: string;
  updatedAt: string;
}
/** One physical copy. Embeds the CardDefinition it was added from, so the collection works offline of any provider. */
export interface CollectionItem {
  id: string;
  card: CardDefinition;
  status: ItemStatus;
  condition?: string;
  notes?: string;
  printing?: string;
  customImageKey?: string;
  acquiredAt?: string;
  purchasePrice?: number;
}
export interface Store {
  version: 1;
  binders: Binder[];
  items: Record<string, CollectionItem>;
}
export interface Loc {
  page: number;
  position: number;
}

export const uid = (): string =>
  globalThis.crypto?.randomUUID?.() ??
  Math.random().toString(36).slice(2) + Date.now().toString(36);
const now = () => new Date().toISOString();

export function createPage(pockets = POCKETS): BinderPage {
  const id = uid();
  return {
    id,
    slots: Array.from({ length: pockets }, (_, position) => ({
      id: `${id}:${position}`,
      position,
      collectionItemId: null,
    })),
  };
}
export function createBinder(o: {
  name: string;
  game: BinderGame;
  pageCount: number;
  pockets?: number;
  accent?: string;
}): Binder {
  const pockets = o.pockets ?? POCKETS,
    t = now();
  return {
    id: uid(),
    name: o.name.trim() || "Untitled binder",
    game: o.game,
    pockets,
    pages: Array.from(
      { length: Math.max(1, Math.min(200, Math.floor(o.pageCount) || 1)) },
      () => createPage(pockets),
    ),
    appearance: { accent: o.accent ?? "#c2693f" },
    createdAt: t,
    updatedAt: t,
  };
}

const touch = (b: Binder, pages: BinderPage[]): Binder => ({
  ...b,
  pages,
  updatedAt: now(),
});
const inRange = (b: Binder, l: Loc) =>
  !!b.pages[l.page] && l.position >= 0 && l.position < b.pockets;
const setSlot = (
  pages: BinderPage[],
  l: Loc,
  id: string | null,
): BinderPage[] =>
  pages.map((p, i) =>
    i !== l.page
      ? p
      : {
          ...p,
          slots: p.slots.map((s) =>
            s.position === l.position ? { ...s, collectionItemId: id } : s,
          ),
        },
  );

export const itemAt = (b: Binder, l: Loc): string | null =>
  b.pages[l.page]?.slots[l.position]?.collectionItemId ?? null;
export function findItem(b: Binder, itemId: string): Loc | null {
  for (let page = 0; page < b.pages.length; page++) {
    const s = b.pages[page].slots.find((x) => x.collectionItemId === itemId);
    if (s) return { page, position: s.position };
  }
  return null;
}
export function firstEmpty(b: Binder, page?: number): Loc | null {
  for (
    let p = page ?? 0;
    p < (page === undefined ? b.pages.length : page + 1);
    p++
  ) {
    const s = b.pages[p]?.slots.find((x) => !x.collectionItemId);
    if (s) return { page: p, position: s.position };
  }
  return null;
}

/** Place an item. Covers all of: fill an empty slot, move, and swap. If the item already sits in this binder it leaves its old slot,
 *  and whatever was in the target takes that old slot (swap). A displaced item with nowhere to go simply becomes unsorted. */
export function placeItem(b: Binder, to: Loc, itemId: string): Binder {
  if (!inRange(b, to)) return b;
  const displaced = itemAt(b, to);
  if (displaced === itemId) return b;
  const from = findItem(b, itemId);
  let pages = b.pages;
  if (from) pages = setSlot(pages, from, displaced);
  return touch(b, setSlot(pages, to, itemId));
}
export function moveSlot(b: Binder, from: Loc, to: Loc): Binder {
  const id = inRange(b, from) ? itemAt(b, from) : null;
  return id ? placeItem(b, to, id) : b;
}
export const clearSlot = (b: Binder, l: Loc): Binder =>
  inRange(b, l) && itemAt(b, l) ? touch(b, setSlot(b.pages, l, null)) : b;
export function removeItem(b: Binder, itemId: string): Binder {
  const l = findItem(b, itemId);
  return l ? touch(b, setSlot(b.pages, l, null)) : b;
}

export const addPage = (b: Binder): Binder =>
  touch(b, [...b.pages, createPage(b.pockets)]);
/** Only empty pages can be deleted, and a binder keeps at least one page. */
export function deletePage(b: Binder, i: number): Binder {
  if (
    b.pages.length <= 1 ||
    !b.pages[i] ||
    b.pages[i].slots.some((s) => s.collectionItemId)
  )
    return b;
  return touch(
    b,
    b.pages.filter((_, k) => k !== i),
  );
}
/** Duplicates the page *layout* (a new empty page of the same size). A physical card can't be in two places. */
export function duplicatePage(b: Binder, i: number): Binder {
  if (!b.pages[i]) return b;
  const pages = [...b.pages];
  pages.splice(i + 1, 0, createPage(b.pockets));
  return touch(b, pages);
}
export function movePage(b: Binder, from: number, to: number): Binder {
  if (from === to || !b.pages[from] || to < 0 || to >= b.pages.length) return b;
  const pages = [...b.pages];
  const [p] = pages.splice(from, 1);
  pages.splice(to, 0, p);
  return touch(b, pages);
}
export const occupiedCount = (b: Binder) =>
  b.pages.reduce(
    (n, p) => n + p.slots.filter((s) => s.collectionItemId).length,
    0,
  );
export const pageOccupied = (b: Binder, i: number) =>
  b.pages[i]?.slots.filter((s) => s.collectionItemId).length ?? 0;

/** Compact page navigator: first two, last two, and the current page with neighbours; gaps become "…". */
export function pageWindow(n: number, cur: number): (number | "…")[] {
  const keep = [
    ...new Set(
      [0, 1, cur - 1, cur, cur + 1, n - 2, n - 1].filter(
        (i) => i >= 0 && i < n,
      ),
    ),
  ].sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  keep.forEach((v, i) => {
    if (i && v - keep[i - 1] > 1) out.push("…");
    out.push(v);
  });
  return out;
}

// ---- collection ----
export const emptyStore = (): Store => ({ version: 1, binders: [], items: {} });
export const newItem = (
  card: CardDefinition,
  printing?: string,
): CollectionItem => ({ id: uid(), card, status: "Owned", printing });
export const copiesOf = (
  items: Record<string, CollectionItem>,
  cardId: string,
) => Object.values(items).filter((i) => i.card.id === cardId).length;
export function placedItemIds(binders: Binder[]): Set<string> {
  const s = new Set<string>();
  for (const b of binders)
    for (const p of b.pages)
      for (const sl of p.slots)
        if (sl.collectionItemId) s.add(sl.collectionItemId);
  return s;
}

// ---- serialisation ----
export const serialise = (s: Store): string => JSON.stringify(s);
/** null/empty means first run. Anything else that isn't a valid store throws, so callers can refuse to overwrite it. */
export function deserialise(raw: string | null): Store {
  if (!raw) return emptyStore();
  const d = JSON.parse(raw);
  if (
    d?.version !== 1 ||
    !Array.isArray(d.binders) ||
    !d.items ||
    typeof d.items !== "object"
  )
    throw new Error("Unrecognised store format");
  return d as Store;
}
