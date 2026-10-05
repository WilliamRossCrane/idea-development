"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import type { CardDefinition } from "@/services/cards/types";
import { useStore } from "@/features/store";
import {
  firstEmpty,
  itemAt,
  occupiedCount,
  pageOccupied,
  pageWindow,
  type CollectionItem,
  type Loc,
} from "@/features/binders/logic";
import { CardArt, GAME_LABEL } from "@/components/cards/CardArt";
import { Library } from "@/components/cards/Library";

type Sel =
  | { kind: "card"; card: CardDefinition }
  | { kind: "item"; id: string }
  | { kind: "slot"; loc: Loc };
const btn =
  "rounded-lg border border-line bg-panel px-3 py-1.5 text-sm disabled:opacity-40";

function Slot({
  loc,
  item,
  selected,
  onClick,
}: {
  loc: Loc;
  item?: CollectionItem;
  selected: boolean;
  onClick: () => void;
}) {
  const drop = useDroppable({
    id: `drop:${loc.page}:${loc.position}`,
    data: { loc },
  });
  const drag = useDraggable({
    id: `slot:${loc.page}:${loc.position}`,
    data: { type: "slot", loc, itemId: item?.id },
    disabled: !item,
  });
  const emptyKeys = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };
  return (
    <div
      ref={(n) => {
        drop.setNodeRef(n);
        drag.setNodeRef(n);
      }}
      {...drag.attributes}
      {...(item ? drag.listeners : { onKeyDown: emptyKeys })}
      aria-disabled={false}
      onClick={onClick}
      aria-label={
        item
          ? `${item.card.name}, slot ${loc.position + 1}. Space to pick up`
          : `Empty slot ${loc.position + 1}. Add card`
      }
      className={`relative aspect-[63/88] min-w-0 rounded-lg border ${item ? "touch-none cursor-grab border-line bg-white/60 p-0.5" : "flex items-center justify-center border-dashed border-line bg-black/[0.03] text-center text-xs text-mute hover:border-accent"}
        ${drop.isOver ? "bg-accent/10 ring-2 ring-accent/60" : ""} ${selected ? "ring-2 ring-accent" : ""} ${drag.isDragging ? "opacity-40" : ""}`}
    >
      {item ? (
        <CardArt card={item.card} />
      ) : (
        <span>
          +<br />
          Add card
        </span>
      )}
    </div>
  );
}
function PageBtn({
  i,
  current,
  onClick,
}: {
  i: number;
  current: boolean;
  onClick: () => void;
}) {
  const d = useDroppable({ id: `page:${i}`, data: { pageIndex: i } }); // dropping a card here sends it to that page's first empty slot
  return (
    <button
      ref={d.setNodeRef}
      onClick={onClick}
      aria-label={`Page ${i + 1}`}
      aria-current={current ? "page" : undefined}
      className={`h-8 min-w-8 rounded-lg border px-2 text-sm ${current ? "border-accent bg-panel font-medium" : "border-line"} ${d.isOver ? "ring-2 ring-accent" : ""}`}
    >
      {i + 1}
    </button>
  );
}
function RemoveZone() {
  const d = useDroppable({ id: "remove" });
  return (
    <div
      ref={d.setNodeRef}
      className={`mx-auto max-w-md rounded-xl border border-dashed p-3 text-center text-xs ${d.isOver ? "border-red-400 text-red-600" : "border-line text-mute"}`}
    >
      Drop here to take a card out of the binder (it stays in Unsorted)
    </div>
  );
}
function ItemTile({
  item,
  selected,
  onSelect,
}: {
  item: CollectionItem;
  selected: boolean;
  onSelect: () => void;
}) {
  const d = useDraggable({
    id: `item:${item.id}`,
    data: { type: "item", itemId: item.id },
  });
  return (
    <div
      ref={d.setNodeRef}
      {...d.attributes}
      {...d.listeners}
      onClick={onSelect}
      aria-label={`${item.card.name}, unsorted`}
      className={`touch-none cursor-grab rounded-lg p-0.5 ${selected ? "ring-2 ring-accent" : ""} ${d.isDragging ? "opacity-40" : ""}`}
    >
      <CardArt card={item.card} />
    </div>
  );
}

export default function BinderWorkspace() {
  const { id } = useParams<{ id: string }>();
  const s = useStore();
  const [pg, setPg] = useState(0),
    [overview, setOverview] = useState(false),
    [libOpen, setLibOpen] = useState(true);
  const [active, setActive] = useState<CardDefinition | null>(null),
    [sel, setSel] = useState<Sel | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor),
  );
  const binder = s.binders.find((b) => b.id === id);

  if (!s.ready)
    return (
      <div className="mx-auto h-64 max-w-3xl animate-pulse rounded-2xl bg-line/60" />
    );
  if (!binder)
    return (
      <div className="mx-auto max-w-md space-y-3 text-center">
        <h1 className="text-2xl font-semibold">Binder not found</h1>
        <p className="text-mute">It may have been deleted.</p>
        <Link href="/binders" className="underline">
          Back to binders
        </Link>
      </div>
    );

  const page = Math.min(pg, binder.pages.length - 1),
    n = binder.pages.length;
  const unsorted = Object.values(s.items).filter((i) => !s.placed.has(i.id));
  const cardOf = (d: any): CardDefinition | null =>
    d?.type === "card"
      ? d.card
      : d?.itemId
        ? (s.items[d.itemId]?.card ?? null)
        : null;

  const dragStart = (e: DragStartEvent) =>
    setActive(cardOf(e.active.data.current));
  const dragEnd = (e: DragEndEvent) => {
    setActive(null);
    const d = e.active.data.current as any,
      over = e.over;
    if (!over || !d) return;
    if (over.id === "remove") {
      if (d.type === "slot") s.clearSlot(binder.id, d.loc);
      return;
    }
    const od = over.data.current as any;
    const loc: Loc | null =
      od?.loc ??
      (od?.pageIndex !== undefined ? firstEmpty(binder, od.pageIndex) : null);
    if (!loc) return;
    if (d.type === "card")
      s.place(binder.id, loc, { kind: "card", card: d.card });
    else if (d.type === "item")
      s.place(binder.id, loc, { kind: "item", id: d.itemId });
    else if (d.type === "slot") s.moveSlot(binder.id, d.loc, loc);
  };
  // Tap/click alternative to dragging: pick something, then tap a slot.
  const clickSlot = (loc: Loc) => {
    if (sel) {
      if (sel.kind === "card")
        s.place(binder.id, loc, { kind: "card", card: sel.card });
      else if (sel.kind === "item")
        s.place(binder.id, loc, { kind: "item", id: sel.id });
      else s.moveSlot(binder.id, sel.loc, loc);
      setSel(null);
    } else if (itemAt(binder, loc)) setSel({ kind: "slot", loc });
    else {
      setLibOpen(true);
      setTimeout(() => searchRef.current?.focus(), 0);
    }
  };
  const selSlot = (l: Loc) =>
    sel?.kind === "slot" &&
    sel.loc.page === l.page &&
    sel.loc.position === l.position;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={dragStart}
      onDragEnd={dragEnd}
      onDragCancel={() => setActive(null)}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-6 lg:flex-row">
        <section className="min-w-0 flex-1 space-y-4">
          <header className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <Link href="/binders" className="text-sm text-mute underline">
                ← Binders
              </Link>
              <h1 className="text-3xl font-semibold">{binder.name}</h1>
              <p className="text-sm text-mute">
                {GAME_LABEL[binder.game]} · {occupiedCount(binder)}/
                {n * binder.pockets} slots filled
              </p>
            </div>
            <div className="flex gap-2">
              <button className={btn} onClick={() => setOverview((o) => !o)}>
                {overview ? "Page view" : "Overview"}
              </button>
              <button
                className={btn}
                onClick={() => setLibOpen((o) => !o)}
                aria-expanded={libOpen}
              >
                {libOpen ? "Hide library" : "Show library"}
              </button>
            </div>
          </header>

          {sel && (
            <p
              role="status"
              className="rounded-lg bg-accent/10 px-3 py-2 text-sm"
            >
              Now tap a slot to place it.{" "}
              <button className="ml-2 underline" onClick={() => setSel(null)}>
                Cancel
              </button>
            </p>
          )}

          {overview ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4">
              {binder.pages.map((p, i) => (
                <div
                  key={p.id}
                  className={`rounded-xl border bg-panel p-3 ${i === page ? "border-accent" : "border-line"}`}
                >
                  <button
                    className="block w-full text-left"
                    aria-label={`Open page ${i + 1}`}
                    onClick={() => {
                      setPg(i);
                      setOverview(false);
                    }}
                  >
                    <div className="mb-2 grid grid-cols-3 gap-1">
                      {p.slots.map((sl) => {
                        const it = sl.collectionItemId
                          ? s.items[sl.collectionItemId]
                          : null;
                        return (
                          <div
                            key={sl.id}
                            className="aspect-[63/88] overflow-hidden rounded-sm bg-line/50"
                          >
                            {it && <CardArt card={it.card} />}
                          </div>
                        );
                      })}
                    </div>
                    <span className="text-xs">
                      Page {i + 1} · {pageOccupied(binder, i)}/{binder.pockets}
                    </span>
                  </button>
                  <div className="mt-1 flex gap-1 text-xs">
                    <button
                      disabled={i === 0}
                      aria-label={`Move page ${i + 1} earlier`}
                      className="rounded border border-line px-2 disabled:opacity-30"
                      onClick={() => s.movePage(binder.id, i, i - 1)}
                    >
                      ←
                    </button>
                    <button
                      disabled={i === n - 1}
                      aria-label={`Move page ${i + 1} later`}
                      className="rounded border border-line px-2 disabled:opacity-30"
                      onClick={() => s.movePage(binder.id, i, i + 1)}
                    >
                      →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div
                className="mx-auto grid max-w-md grid-cols-3 gap-2.5 rounded-2xl border border-line bg-panel p-4"
                style={{ borderTop: `4px solid ${binder.appearance.accent}` }}
              >
                {binder.pages[page].slots.map((sl) => {
                  const loc = { page, position: sl.position },
                    it = sl.collectionItemId
                      ? s.items[sl.collectionItemId]
                      : undefined;
                  return (
                    <Slot
                      key={sl.id}
                      loc={loc}
                      item={it}
                      selected={selSlot(loc)}
                      onClick={() => clickSlot(loc)}
                    />
                  );
                })}
              </div>
              <RemoveZone />
              <nav
                aria-label="Pages"
                className="flex flex-wrap items-center justify-center gap-1.5"
              >
                <button
                  className={btn}
                  disabled={page === 0}
                  onClick={() => setPg(page - 1)}
                >
                  ← Previous
                </button>
                {pageWindow(n, page).map((w, k) =>
                  w === "…" ? (
                    <span key={`g${k}`} className="px-1 text-mute">
                      …
                    </span>
                  ) : (
                    <PageBtn
                      key={w}
                      i={w}
                      current={w === page}
                      onClick={() => setPg(w)}
                    />
                  ),
                )}
                <button
                  className={btn}
                  disabled={page === n - 1}
                  onClick={() => setPg(page + 1)}
                >
                  Next →
                </button>
              </nav>
              <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
                <button
                  className={btn}
                  onClick={() => {
                    s.addPage(binder.id);
                    setPg(n);
                  }}
                >
                  Add page
                </button>
                <button
                  className={btn}
                  onClick={() => {
                    s.duplicatePage(binder.id, page);
                    setPg(page + 1);
                  }}
                >
                  Duplicate layout
                </button>
                <button
                  className={btn}
                  disabled={n <= 1 || pageOccupied(binder, page) > 0}
                  onClick={() => {
                    s.deletePage(binder.id, page);
                    setPg(Math.max(0, page - 1));
                  }}
                >
                  Delete empty page
                </button>
                <label className="flex items-center gap-1">
                  Jump to
                  <input
                    type="number"
                    min={1}
                    max={n}
                    className="w-16 rounded-lg border border-line bg-panel px-2 py-1"
                    aria-label="Jump to page"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const v = Number((e.target as HTMLInputElement).value);
                        if (v >= 1 && v <= n) setPg(v - 1);
                      }
                    }}
                  />
                </label>
              </div>
            </>
          )}
        </section>

        {libOpen && (
          <aside
            className="w-full shrink-0 space-y-4 lg:w-80"
            aria-label="Card library"
          >
            <h2 className="font-semibold">Card library</h2>
            <Library
              draggable
              defaultGame={binder.game === "mixed" ? "pokemon" : binder.game}
              searchRef={searchRef}
              selectedId={sel?.kind === "card" ? sel.card.id : null}
              onSelect={(c) =>
                setSel((p) =>
                  p?.kind === "card" && p.card.id === c.id
                    ? null
                    : { kind: "card", card: c },
                )
              }
            />
            {unsorted.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">
                  Unsorted ({unsorted.length})
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {unsorted.map((i) => (
                    <ItemTile
                      key={i.id}
                      item={i}
                      selected={sel?.kind === "item" && sel.id === i.id}
                      onSelect={() =>
                        setSel((p) =>
                          p?.kind === "item" && p.id === i.id
                            ? null
                            : { kind: "item", id: i.id },
                        )
                      }
                    />
                  ))}
                </div>
              </div>
            )}
          </aside>
        )}
      </div>
      <DragOverlay>
        {active && (
          <div className="w-24 rotate-3 shadow-xl">
            <CardArt card={active} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
