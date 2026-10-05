"use client";
// App state. Holds Store in memory, applies pure logic, and persists only what changed through the repository.
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { CardDefinition } from "@/services/cards/types";
import { LocalBinderRepository, type BinderRepository } from "@/repositories/binderRepository";
import { CardModal } from "@/components/cards/CardModal";
import * as L from "./binders/logic";
import type { Binder, BinderGame, CollectionItem, Loc, Store } from "./binders/logic";

export type Source = { kind: "item"; id: string } | { kind: "card"; card: CardDefinition };
interface Api {
  ready: boolean; binders: Binder[]; items: Record<string, CollectionItem>; placed: Set<string>;
  createBinder(o: { name: string; game: BinderGame; pageCount: number }): string;
  deleteBinder(id: string): void;
  addCopy(card: CardDefinition): string;
  addToBinder(card: CardDefinition, binderId: string): boolean; // false = binder full, item left in Unsorted
  updateItem(id: string, patch: Partial<CollectionItem>): void;
  removeItem(id: string): void;
  place(binderId: string, to: Loc, src: Source): void;
  moveSlot(binderId: string, from: Loc, to: Loc): void;
  clearSlot(binderId: string, at: Loc): void;
  addPage(binderId: string): void; deletePage(binderId: string, i: number): void;
  duplicatePage(binderId: string, i: number): void; movePage(binderId: string, from: number, to: number): void;
  openCard(card: CardDefinition | null): void;
}
const Ctx = createContext<Api | null>(null);
export const useStore = (): Api => { const c = useContext(Ctx); if (!c) throw new Error("StoreProvider missing"); return c; };

async function persist(repo: BinderRepository, prev: Store, next: Store) {
  const old = new Map(prev.binders.map(b => [b.id, b]));
  for (const b of next.binders) {
    const o = old.get(b.id);
    if (!o) await repo.createBinder(b); else if (o !== b) await repo.updateBinder(b);
    old.delete(b.id);
  }
  for (const id of old.keys()) await repo.deleteBinder(id);
  for (const [id, i] of Object.entries(next.items)) if (prev.items[id] !== i) await repo.saveItem(i);
  for (const id of Object.keys(prev.items)) if (!(id in next.items)) await repo.deleteItem(id);
}
const mapBinder = (s: Store, id: string, f: (b: Binder) => Binder): Store => ({ ...s, binders: s.binders.map(b => (b.id === id ? f(b) : b)) });
// An item lives in at most one slot across all binders: place it in the target, pull it out of every other binder.
const placeEverywhere = (s: Store, binderId: string, to: Loc, itemId: string): Store =>
  ({ ...s, binders: s.binders.map(b => (b.id === binderId ? L.placeItem(b, to, itemId) : L.removeItem(b, itemId))) });

export function StoreProvider({ children }: { children: ReactNode }) {
  const repo = useMemo<BinderRepository>(() => new LocalBinderRepository(), []);
  const ref = useRef<Store>(L.emptyStore());
  const [state, setState] = useState<Store>(ref.current);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<CardDefinition | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [binders, items] = await Promise.all([repo.getBinders(), repo.getItems()]);
        ref.current = { version: 1, binders, items: Object.fromEntries(items.map(i => [i.id, i])) };
        setState(ref.current);
      } catch (e) { setError((e as Error).message); }
      setReady(true);
    })();
  }, [repo]);

  const update = useCallback((fn: (s: Store) => Store) => {
    const prev = ref.current, next = fn(prev);
    if (next === prev) return;
    ref.current = next; setState(next);
    persist(repo, prev, next).catch(e => setError(e instanceof Error ? e.message : "Couldn't save your changes."));
  }, [repo]);

  const api = useMemo<Api>(() => ({
    ready, binders: state.binders, items: state.items, placed: L.placedItemIds(state.binders),
    createBinder(o) { const b = L.createBinder(o); update(s => ({ ...s, binders: [...s.binders, b] })); return b.id; },
    deleteBinder(id) { update(s => ({ ...s, binders: s.binders.filter(b => b.id !== id) })); },
    addCopy(card) { const it = L.newItem(card); update(s => ({ ...s, items: { ...s.items, [it.id]: it } })); return it.id; },
    addToBinder(card, binderId) {
      const it = L.newItem(card), b = ref.current.binders.find(x => x.id === binderId), at = b && L.firstEmpty(b);
      update(s => { const s2 = { ...s, items: { ...s.items, [it.id]: it } }; return at ? placeEverywhere(s2, binderId, at, it.id) : s2; });
      return !!at;
    },
    updateItem(id, patch) { update(s => (s.items[id] ? { ...s, items: { ...s.items, [id]: { ...s.items[id], ...patch } } } : s)); },
    removeItem(id) {
      update(s => { const { [id]: _g, ...items } = s.items; return { ...s, items, binders: s.binders.map(b => L.removeItem(b, id)) }; });
    },
    place(binderId, to, src) {
      if (src.kind === "item") return update(s => placeEverywhere(s, binderId, to, src.id));
      const it = L.newItem(src.card);
      update(s => placeEverywhere({ ...s, items: { ...s.items, [it.id]: it } }, binderId, to, it.id));
    },
    moveSlot(id, from, to) { update(s => mapBinder(s, id, b => L.moveSlot(b, from, to))); },
    clearSlot(id, at) { update(s => mapBinder(s, id, b => L.clearSlot(b, at))); },
    addPage(id) { update(s => mapBinder(s, id, L.addPage)); },
    deletePage(id, i) { update(s => mapBinder(s, id, b => L.deletePage(b, i))); },
    duplicatePage(id, i) { update(s => mapBinder(s, id, b => L.duplicatePage(b, i))); },
    movePage(id, a, z) { update(s => mapBinder(s, id, b => L.movePage(b, a, z))); },
    openCard: setModal,
  }), [state, ready, update]);

  return (
    <Ctx.Provider value={api}>
      {children}
      {modal && <CardModal card={modal} onClose={() => setModal(null)} />}
      {error && (
        <div role="alert" className="fixed bottom-4 right-4 max-w-sm rounded-xl border border-line bg-panel p-4 text-sm shadow-lg">
          {error} <button className="ml-2 underline" onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}
    </Ctx.Provider>
  );
}
