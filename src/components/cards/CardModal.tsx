"use client";
import { useEffect, useState } from "react";
import type { CardDefinition } from "@/services/cards/types";
import { useStore } from "@/features/store";
import { copiesOf } from "@/features/binders/logic";
import { CardArt, GAME_LABEL } from "./CardArt";

export function CardModal({ card, onClose }: { card: CardDefinition; onClose: () => void }) {
  const { binders, items, addCopy, addToBinder } = useStore();
  const [detail, setDetail] = useState(card);
  const [binderId, setBinderId] = useState(binders[0]?.id ?? "");
  const [msg, setMsg] = useState("");

  useEffect(() => { // list results from some providers lack set/rarity: fetch the full card
    if (card.setName) return;
    const ac = new AbortController();
    fetch(`/api/cards/${card.game}/${encodeURIComponent(card.providerId)}`, { signal: ac.signal })
      .then(r => (r.ok ? r.json() : null)).then(d => d && setDetail(d)).catch(() => {});
    return () => ac.abort();
  }, [card]);
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const owned = copiesOf(items, detail.id);
  const rows: [string, string | number | undefined][] = [["Game", GAME_LABEL[detail.game]], ["Set", detail.setName], ["Number", detail.cardNumber], ["Rarity", detail.rarity],
    ...Object.entries(detail.extra ?? {}).map(([k, v]): [string, string | number | undefined] => [k[0].toUpperCase() + k.slice(1), v])];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-labelledby="card-title" onClick={e => e.stopPropagation()}
        className="grid max-h-[90vh] w-full max-w-2xl gap-6 overflow-auto rounded-2xl border border-line bg-panel p-6 sm:grid-cols-[220px_1fr]">
        <CardArt card={detail} large />
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-2">
            <h2 id="card-title" className="text-2xl font-semibold">{detail.name}</h2>
            <button autoFocus onClick={onClose} aria-label="Close" className="rounded-lg border border-line px-2 py-1">✕</button>
          </div>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
            {rows.filter(([, v]) => v !== undefined && v !== "").map(([k, v]) => (<div key={k} className="contents"><dt className="text-mute">{k}</dt><dd>{v}</dd></div>))}
          </dl>
          {owned > 0 && <p className="text-sm text-mute">Owned ×{owned}</p>}
          <div className="space-y-2">
            <button className="rounded-lg border border-line px-3 py-2 text-sm" onClick={() => { addCopy(detail); setMsg(owned ? "Added another copy to your collection." : "Added to your collection (Unsorted)."); }}>
              {owned ? "Add another copy" : "Add to collection"}
            </button>
            {binders.length > 0 && (
              <div className="flex gap-2">
                <select aria-label="Binder" value={binderId} onChange={e => setBinderId(e.target.value)} className="min-w-0 flex-1 rounded-lg border border-line bg-paper px-2 py-2 text-sm">
                  {binders.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
                <button className="rounded-lg bg-accent px-3 py-2 text-sm text-white"
                  onClick={() => setMsg(addToBinder(detail, binderId) ? "Added to the binder." : "That binder is full. Added to Unsorted.")}>Add to binder</button>
              </div>
            )}
            {msg && <p role="status" className="text-sm text-mute">{msg}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
