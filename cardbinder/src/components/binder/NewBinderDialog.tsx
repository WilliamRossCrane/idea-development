"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/features/store";
import type { BinderGame } from "@/features/binders/logic";
import { GAME_LABEL } from "@/components/cards/CardArt";

export function NewBinderDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const { createBinder } = useStore(), router = useRouter();
  const [name, setName] = useState(""), [game, setGame] = useState<BinderGame>("one-piece"), [pages, setPages] = useState("20"), [custom, setCustom] = useState("50");
  useEffect(() => { const d = ref.current; if (!d) return; if (open && !d.open) d.showModal(); if (!open && d.open) d.close(); }, [open]);
  const field = "w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm";
  return (
    <dialog ref={ref} onClose={onClose} className="m-auto w-full max-w-sm rounded-2xl border border-line bg-panel p-6 text-ink backdrop:bg-black/40">
      <form className="space-y-4" onSubmit={e => {
        e.preventDefault();
        const id = createBinder({ name, game, pageCount: Number(pages === "custom" ? custom : pages) });
        setName(""); onClose(); router.push(`/binders/${id}`);
      }}>
        <h2 className="text-xl font-semibold">New binder</h2>
        <label className="block text-sm">Name<input className={field} required autoFocus placeholder="One Piece Main Collection" value={name} onChange={e => setName(e.target.value)} /></label>
        <label className="block text-sm">Category
          <select className={field} value={game} onChange={e => setGame(e.target.value as BinderGame)}>
            {(Object.keys(GAME_LABEL) as BinderGame[]).map(g => <option key={g} value={g}>{GAME_LABEL[g]}</option>)}
          </select></label>
        <label className="block text-sm">Size<select className={field} disabled><option>9-pocket (3×3)</option></select></label>
        <label className="block text-sm">Pages
          <select className={field} value={pages} onChange={e => setPages(e.target.value)}>
            {["10", "20", "30", "40"].map(p => <option key={p}>{p}</option>)}<option value="custom">Custom</option>
          </select></label>
        {pages === "custom" && <input className={field} type="number" min={1} max={200} aria-label="Custom page count" value={custom} onChange={e => setCustom(e.target.value)} />}
        <div className="flex justify-end gap-2">
          <button type="button" className="rounded-lg border border-line px-3 py-2 text-sm" onClick={onClose}>Cancel</button>
          <button className="rounded-lg bg-accent px-3 py-2 text-sm text-white">Create</button>
        </div>
      </form>
    </dialog>
  );
}
