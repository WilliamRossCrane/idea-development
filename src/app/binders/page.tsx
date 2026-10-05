"use client";
import { useState } from "react";
import { useStore } from "@/features/store";
import { BinderList } from "@/components/binder/BinderList";
import { NewBinderDialog } from "@/components/binder/NewBinderDialog";

export default function AllBinders() {
  const { binders, deleteBinder } = useStore();
  const [open, setOpen] = useState(false);
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center justify-between"><h1 className="text-3xl font-semibold">All binders</h1>
        <button className="rounded-lg bg-accent px-4 py-2 text-sm text-white" onClick={() => setOpen(true)}>+ New binder</button></div>
      {binders.length ? <BinderList binders={binders} /> : <p className="text-mute">No binders yet.</p>}
      {binders.length > 0 && (
        <details className="text-sm text-mute"><summary className="cursor-pointer">Delete a binder</summary>
          <ul className="mt-2 space-y-1">{binders.map(b => (
            <li key={b.id}>{b.name}{" "}<button className="underline" onClick={() => confirm(`Delete "${b.name}"? Its cards stay in your collection as Unsorted.`) && deleteBinder(b.id)}>Delete</button></li>
          ))}</ul></details>
      )}
      <NewBinderDialog open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
