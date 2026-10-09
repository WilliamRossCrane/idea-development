"use client";
import { useState } from "react";
import { useStore } from "@/features/store";
import { CardArt } from "@/components/cards/CardArt";
import type { ItemStatus } from "@/features/binders/logic";
import { PRINTING_LABELS } from "@/services/cards/types";

const TABS = ["All", "In binder", "Unsorted", "Wishlist", "For Trade"] as const;
const STATUS: ItemStatus[] = ["Owned", "Wishlist", "For Trade", "Sold"];
const CONDITIONS = [
  "",
  "Mint",
  "Near Mint",
  "Excellent",
  "Good",
  "Played",
  "Damaged",
  "Graded",
];

export default function Collection() {
  const { items, placed, ready, updateItem, removeItem, openCard } = useStore();
  const [tab, setTab] = useState<(typeof TABS)[number]>("All");
  const list = Object.values(items).filter(
    (i) =>
      tab === "All" ||
      (tab === "In binder"
        ? placed.has(i.id)
        : tab === "Unsorted"
          ? !placed.has(i.id)
          : i.status === tab),
  );
  const sel = "rounded border border-line bg-paper px-1 py-0.5 text-xs";
  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <h1 className="text-3xl font-semibold">My collection</h1>
      <div className="flex flex-wrap gap-2" role="tablist">
        {TABS.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`rounded-lg border px-3 py-1.5 text-sm ${tab === t ? "border-accent bg-panel" : "border-line text-mute"}`}
          >
            {t}
          </button>
        ))}
      </div>
      {!ready ? (
        <div className="h-24 animate-pulse rounded-2xl bg-line/60" />
      ) : list.length === 0 ? (
        <p className="text-mute">
          Nothing here yet. Add cards from the Library or from inside a binder.
        </p>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4">
          {list.map((i) => (
            <div key={i.id} className="space-y-1 text-xs">
              <button
                className="block w-full"
                onClick={() => openCard(i.card)}
                aria-label={`Details for ${i.card.name}`}
              >
                <CardArt card={i.card} />
              </button>
              <div className="truncate font-medium">{i.card.name}</div>
              {i.printing && (
                <div className="text-mute">
                  {PRINTING_LABELS[i.printing] ?? i.printing}
                </div>
              )}
              <div className="text-mute">
                {placed.has(i.id) ? "In a binder" : "Unsorted"}
              </div>
              <div className="flex flex-wrap gap-1">
                <select
                  aria-label="Status"
                  className={sel}
                  value={i.status}
                  onChange={(e) =>
                    updateItem(i.id, { status: e.target.value as ItemStatus })
                  }
                >
                  {STATUS.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
                <select
                  aria-label="Condition"
                  className={sel}
                  value={i.condition ?? ""}
                  onChange={(e) =>
                    updateItem(i.id, { condition: e.target.value || undefined })
                  }
                >
                  {CONDITIONS.map((c) => (
                    <option key={c} value={c}>
                      {c || "Condition"}
                    </option>
                  ))}
                </select>
              </div>
              <button
                className="text-mute underline"
                onClick={() =>
                  confirm("Remove this copy from your collection?") &&
                  removeItem(i.id)
                }
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
