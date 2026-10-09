"use client";
import { useState } from "react";
import { useStore } from "@/features/store";
import { occupiedCount } from "@/features/binders/logic";
import { BinderList } from "@/components/binder/BinderList";
import { NewBinderDialog } from "@/components/binder/NewBinderDialog";

export default function Dashboard() {
  const { binders, items, ready } = useStore();
  const [open, setOpen] = useState(false);
  const recent = [...binders].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 6);
  const stats: [string, number][] = [["Cards in collection", Object.keys(items).length], ["Occupied slots", binders.reduce((n, b) => n + occupiedCount(b), 0)], ["Binders", binders.length]];
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="flex items-end justify-between gap-4">
        <div><h1 className="text-3xl font-semibold">Your binders</h1><p className="text-mute">Organise your physical collection visually.</p></div>
        <button className="rounded-lg bg-accent px-4 py-2 text-sm text-white" onClick={() => setOpen(true)}>+ New binder</button>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {stats.map(([l, v]) => <div key={l} className="rounded-2xl border border-line bg-panel p-4"><div className="text-2xl font-semibold">{v}</div><div className="text-sm text-mute">{l}</div></div>)}
      </div>
      {!ready ? <div className="h-24 animate-pulse rounded-2xl bg-line/60" /> : recent.length ? (
        <section><h2 className="mb-3 font-semibold">Recently edited</h2><BinderList binders={recent} /></section>
      ) : <p className="rounded-2xl border border-dashed border-line p-8 text-center text-mute">No binders yet. Create your first one to get started.</p>}
      <NewBinderDialog open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
