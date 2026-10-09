"use client";
import Link from "next/link";
import type { Binder } from "@/features/binders/logic";
import { occupiedCount } from "@/features/binders/logic";
import { GAME_LABEL } from "@/components/cards/CardArt";

export function BinderList({ binders }: { binders: Binder[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {binders.map(b => (
        <Link key={b.id} href={`/binders/${b.id}`} style={{ borderTopColor: b.appearance.accent }}
          className="rounded-2xl border border-line border-t-4 bg-panel p-5 hover:shadow-md">
          <div className="font-semibold">{b.name}</div>
          <div className="mt-1 text-sm text-mute">{GAME_LABEL[b.game]} · {b.pages.length} pages · {occupiedCount(b)}/{b.pages.length * b.pockets} slots</div>
        </Link>
      ))}
    </div>
  );
}
