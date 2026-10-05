import { describe, it, expect } from "vitest";
import { createBinder, placeItem, moveSlot, clearSlot, removeItem, addPage, deletePage, duplicatePage, movePage, pageWindow,
  findItem, itemAt, occupiedCount, newItem, copiesOf, placedItemIds, serialise, deserialise, emptyStore, firstEmpty } from "./logic";
import type { CardDefinition } from "@/services/cards/types";

const card: CardDefinition = { id: "pokemon:base1-4", providerId: "base1-4", game: "pokemon", name: "Charizard" };
const mk = () => createBinder({ name: "Test", game: "pokemon", pageCount: 3 });
const L = (page: number, position: number) => ({ page, position });

describe("binder creation", () => {
  it("creates pages of nine slots", () => {
    const b = mk();
    expect(b.pages).toHaveLength(3);
    for (const p of b.pages) expect(p.slots).toHaveLength(9);
    expect(b.pages[0].slots.map(s => s.position)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    expect(occupiedCount(b)).toBe(0);
  });
  it("supports other pocket counts and clamps page count", () => {
    expect(createBinder({ name: "x", game: "mixed", pageCount: 2, pockets: 4 }).pages[0].slots).toHaveLength(4);
    expect(createBinder({ name: "x", game: "mixed", pageCount: 0 }).pages).toHaveLength(1);
    expect(createBinder({ name: "  ", game: "mixed", pageCount: 1 }).name).toBe("Untitled binder");
  });
});
describe("placing, moving, swapping, removing", () => {
  it("places a card", () => {
    const b = placeItem(mk(), L(0, 4), "a");
    expect(itemAt(b, L(0, 4))).toBe("a");
    expect(occupiedCount(b)).toBe(1);
  });
  it("moves a card within and across pages", () => {
    let b = placeItem(mk(), L(0, 0), "a");
    b = placeItem(b, L(0, 5), "a");
    expect(findItem(b, "a")).toEqual(L(0, 5));
    b = moveSlot(b, L(0, 5), L(2, 8));
    expect(findItem(b, "a")).toEqual(L(2, 8));
    expect(occupiedCount(b)).toBe(1);
  });
  it("swaps two occupied slots", () => {
    let b = placeItem(placeItem(mk(), L(0, 0), "a"), L(1, 1), "b");
    b = moveSlot(b, L(0, 0), L(1, 1));
    expect(itemAt(b, L(0, 0))).toBe("b");
    expect(itemAt(b, L(1, 1))).toBe("a");
  });
  it("dropping an unplaced item onto an occupied slot unassigns the old one", () => {
    const b = placeItem(placeItem(mk(), L(0, 0), "a"), L(0, 0), "c");
    expect(itemAt(b, L(0, 0))).toBe("c");
    expect(findItem(b, "a")).toBeNull();
  });
  it("removes via clearSlot and removeItem", () => {
    const b = placeItem(mk(), L(0, 0), "a");
    expect(occupiedCount(clearSlot(b, L(0, 0)))).toBe(0);
    expect(occupiedCount(removeItem(b, "a"))).toBe(0);
  });
  it("returns the same reference when nothing changes", () => {
    const b = placeItem(mk(), L(0, 0), "a");
    expect(placeItem(b, L(0, 0), "a")).toBe(b);
    expect(placeItem(b, L(9, 0), "a")).toBe(b);
    expect(clearSlot(b, L(0, 3))).toBe(b);
    expect(removeItem(b, "zzz")).toBe(b);
  });
  it("finds the first empty slot", () => {
    const b = placeItem(mk(), L(0, 0), "a");
    expect(firstEmpty(b)).toEqual(L(0, 1));
    expect(firstEmpty(b, 2)).toEqual(L(2, 0));
  });
});
describe("duplicate copies", () => {
  it("treats each copy as an independent item", () => {
    const one = newItem(card), two = newItem(card);
    const items = { [one.id]: one, [two.id]: two };
    expect(copiesOf(items, card.id)).toBe(2);
    const b = placeItem(placeItem(mk(), L(0, 0), one.id), L(0, 1), two.id);
    expect(placedItemIds([b]).size).toBe(2);
    expect(occupiedCount(b)).toBe(2);
  });
});
describe("page management", () => {
  it("adds, duplicates layout, reorders", () => {
    let b = addPage(mk());
    expect(b.pages).toHaveLength(4);
    b = duplicatePage(b, 0);
    expect(b.pages).toHaveLength(5);
    const first = b.pages[0].id;
    b = movePage(b, 0, 4);
    expect(b.pages[4].id).toBe(first);
  });
  it("only deletes empty pages and keeps at least one", () => {
    const b = placeItem(mk(), L(0, 0), "a");
    expect(deletePage(b, 0)).toBe(b);
    expect(deletePage(b, 1).pages).toHaveLength(2);
    const single = createBinder({ name: "x", game: "mixed", pageCount: 1 });
    expect(deletePage(single, 0)).toBe(single);
  });
  it("builds a compact navigator", () => {
    expect(pageWindow(20, 9)).toEqual([0, 1, "…", 8, 9, 10, "…", 18, 19]);
    expect(pageWindow(3, 0)).toEqual([0, 1, 2]);
  });
});
describe("persistence serialisation", () => {
  it("round-trips a store", () => {
    const it1 = newItem(card), b = placeItem(mk(), L(1, 2), it1.id);
    const s = { ...emptyStore(), binders: [b], items: { [it1.id]: it1 } };
    expect(deserialise(serialise(s))).toEqual(s);
  });
  it("treats null as first run and throws on corrupt data", () => {
    expect(deserialise(null)).toEqual(emptyStore());
    expect(() => deserialise("{not json")).toThrow();
    expect(() => deserialise('{"version":2}')).toThrow();
  });
});
