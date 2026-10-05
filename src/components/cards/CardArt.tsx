"use client";
import { useState } from "react";
import type { CardDefinition } from "@/services/cards/types";

export const GAME_LABEL = { pokemon: "Pokémon", "one-piece": "One Piece", sports: "Topps / Sports", mixed: "Mixed" } as const;

/** Card artwork with a calm placeholder when there is no image or it fails to load. */
export function CardArt({ card, large = false, className = "" }: { card: CardDefinition; large?: boolean; className?: string }) {
  const src = large ? (card.imageUrl ?? card.thumbUrl) : (card.thumbUrl ?? card.imageUrl);
  const [failed, setFailed] = useState<string>();
  return (
    <div className={`aspect-[63/88] w-full overflow-hidden rounded-md bg-line/60 ${className}`}>
      {src && failed !== src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={`${card.name}${card.cardNumber ? ` ${card.cardNumber}` : ""}`} loading="lazy" draggable={false}
          onError={() => setFailed(src)} className="h-full w-full object-contain" />
      ) : (
        <div className="flex h-full flex-col justify-end bg-stone-300 p-2 text-xs text-stone-800">
          <b className="leading-tight">{card.name}</b><span className="opacity-70">{card.cardNumber}</span>
        </div>
      )}
    </div>
  );
}
