"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import {
  POKEMON_LANGUAGES,
  type CardDefinition,
  type CardGame,
  type CardSearchResult,
  type CardSet,
} from "@/services/cards/types";
import { useStore } from "@/features/store";
import { copiesOf } from "@/features/binders/logic";
import { CardArt, GAME_LABEL } from "./CardArt";

const FRIENDLY = "We couldn't load cards right now. Please try again.";
const GAMES: CardGame[] = ["pokemon", "one-piece", "sports"];

function useDebounced<T>(v: T, ms: number) {
  const [d, setD] = useState(v);
  useEffect(() => {
    const t = setTimeout(() => setD(v), ms);
    return () => clearTimeout(t);
  }, [v, ms]);
  return d;
}
async function fetchPage(
  game: CardGame,
  q: string,
  language: string,
  setId: string,
  page: number,
  signal: AbortSignal,
): Promise<CardSearchResult> {
  const r = await fetch(
    `/api/cards?${new URLSearchParams({ game, q, language, setId, page: String(page), pageSize: "24" })}`,
    { signal },
  );
  const j = await r.json().catch(() => null);
  if (!r.ok || !j) throw new Error(j?.error ?? FRIENDLY);
  return j;
}

function Tile({
  card,
  selected,
  onSelect,
  dragRef,
}: {
  card: CardDefinition;
  selected: boolean;
  onSelect: () => void;
  dragRef?: ReturnType<typeof useDraggable>;
}) {
  const { items, openCard } = useStore();
  const owned = copiesOf(items, card.id);
  return (
    <div className="space-y-1">
      <div
        ref={dragRef?.setNodeRef}
        {...dragRef?.attributes}
        {...dragRef?.listeners}
        onClick={onSelect}
        aria-label={`${card.name} ${card.cardNumber ?? ""}${dragRef ? ". Press space to pick up, or click to select" : ""}`}
        className={`touch-none rounded-lg p-0.5 ${dragRef ? "cursor-grab" : "cursor-pointer"} ${dragRef?.isDragging ? "opacity-40" : ""} ${selected ? "ring-2 ring-accent" : ""}`}
      >
        <CardArt card={card} />
      </div>
      <div className="px-0.5 text-xs leading-snug">
        <div className="truncate font-medium">{card.name}</div>
        <div className="truncate text-mute">
          {[card.setName, card.cardNumber, card.rarity]
            .filter(Boolean)
            .join(" · ")}
        </div>
        <div className="flex items-center justify-between text-mute">
          <span>{owned ? `Owned ×${owned}` : ""}</span>
          <button className="underline" onClick={() => openCard(card)}>
            Details
          </button>
        </div>
      </div>
    </div>
  );
}
function DraggableTile(p: {
  card: CardDefinition;
  selected: boolean;
  onSelect: () => void;
}) {
  const d = useDraggable({
    id: `lib:${p.card.id}`,
    data: { type: "card", card: p.card },
  });
  return <Tile {...p} dragRef={d} />;
}

/** Search panel. `draggable` requires a surrounding DndContext (binder workspace); the Library page uses plain tiles. */
export function Library({
  defaultGame = "pokemon",
  draggable,
  selectedId,
  onSelect,
  wide,
  searchRef,
}: {
  defaultGame?: CardGame;
  draggable?: boolean;
  selectedId?: string | null;
  onSelect?: (c: CardDefinition) => void;
  wide?: boolean;
  searchRef?: React.RefObject<HTMLInputElement | null>;
}) {
  const [game, setGame] = useState<CardGame>(defaultGame);
  const [language, setLanguage] = useState("en"),
    [setId, setSetId] = useState("");
  const [sets, setSets] = useState<CardSet[]>([]),
    [setsLoading, setSetsLoading] = useState(false),
    [setsError, setSetsError] = useState<string | null>(null);
  const [input, setInput] = useState(""),
    q = useDebounced(input, 300);
  const [rarity, setRarity] = useState("");
  const [cards, setCards] = useState<CardDefinition[]>([]);
  const [page, setPage] = useState(1),
    [more, setMore] = useState(false),
    [source, setSource] = useState<string>();
  const [loading, setLoading] = useState(true),
    [error, setError] = useState<string | null>(null),
    [tick, setTick] = useState(0);
  const moreAbort = useRef<AbortController | null>(null);

  useEffect(() => {
    if (game !== "pokemon") {
      setSets([]);
      setSetsLoading(false);
      setSetsError(null);
      return;
    }
    const ac = new AbortController();
    setSetsLoading(true);
    setSetsError(null);
    fetch(`/api/cards/sets?${new URLSearchParams({ game, language })}`, {
      signal: ac.signal,
    })
      .then(async (r) => {
        const j = await r.json().catch(() => null);
        if (!r.ok || !Array.isArray(j?.sets))
          throw new Error(j?.error ?? FRIENDLY);
        setSets(j.sets);
      })
      .catch((e) => {
        if (e.name !== "AbortError") setSetsError(e.message || FRIENDLY);
      })
      .finally(() => {
        if (!ac.signal.aborted) setSetsLoading(false);
      });
    return () => ac.abort();
  }, [game, language, tick]);

  useEffect(() => {
    const ac = new AbortController();
    setLoading(true);
    setError(null);
    setCards([]);
    setRarity("");
    setPage(1);
    fetchPage(game, q, language, setId, 1, ac.signal)
      .then((r) => {
        setCards(r.cards);
        setMore(r.hasMore);
        setSource(r.source);
        setLoading(false);
      })
      .catch((e) => {
        if (e.name !== "AbortError") {
          setError(e.message || FRIENDLY);
          setLoading(false);
        }
      });
    return () => ac.abort();
  }, [game, language, setId, q, tick]);

  const loadMore = useCallback(() => {
    moreAbort.current?.abort();
    const ac = (moreAbort.current = new AbortController());
    fetchPage(game, q, language, setId, page + 1, ac.signal)
      .then((r) => {
        setCards((c) => [...c, ...r.cards]);
        setPage((p) => p + 1);
        setMore(r.hasMore);
      })
      .catch((e) => {
        if (e.name !== "AbortError") setError(e.message || FRIENDLY);
      });
  }, [game, language, setId, q, page]);

  const rarities = [
    ...new Set(cards.map((c) => c.rarity).filter(Boolean)),
  ] as string[]; // filter disappears when the provider gives no rarity
  const shown = rarity ? cards.filter((c) => c.rarity === rarity) : cards;
  const grid = wide
    ? "grid-cols-[repeat(auto-fill,minmax(140px,1fr))]"
    : "grid-cols-2";
  const Cell = draggable ? DraggableTile : Tile;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <select
          aria-label="Game"
          value={game}
          onChange={(e) => {
            setGame(e.target.value as CardGame);
            setLanguage("en");
            setSetId("");
          }}
          className="rounded-lg border border-line bg-panel px-2 py-2 text-sm"
        >
          {GAMES.map((g) => (
            <option key={g} value={g}>
              {GAME_LABEL[g]}
            </option>
          ))}
        </select>
        {game === "pokemon" && (
          <>
            <select
              aria-label="Language"
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                setSetId("");
              }}
              className="rounded-lg border border-line bg-panel px-2 py-2 text-sm"
            >
              {POKEMON_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.name}
                </option>
              ))}
            </select>
            <select
              aria-label="Card set"
              value={setId}
              disabled={setsLoading || !!setsError}
              onChange={(e) => setSetId(e.target.value)}
              className="max-w-56 rounded-lg border border-line bg-panel px-2 py-2 text-sm"
            >
              <option value="">
                {setsLoading ? "Loading sets…" : "All sets"}
              </option>
              {sets.map((s) => (
                <option key={`${s.language}:${s.id}`} value={s.id}>
                  {s.name} · {s.cardCount ?? "?"}
                </option>
              ))}
            </select>
          </>
        )}
        <input
          ref={searchRef}
          type="search"
          aria-label="Search cards"
          placeholder="Search name, set, number…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="min-w-0 flex-1 rounded-lg border border-line bg-panel px-3 py-2 text-sm"
        />
        {rarities.length > 1 && (
          <select
            aria-label="Rarity"
            value={rarity}
            onChange={(e) => setRarity(e.target.value)}
            className="rounded-lg border border-line bg-panel px-2 py-2 text-sm"
          >
            <option value="">Any rarity</option>
            {rarities.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        )}
      </div>
      {setsError && (
        <p role="status" className="text-xs text-mute">
          Set list unavailable. Card search is still available.
        </p>
      )}
      {setId && sets.find((s) => s.id === setId) && (
        <p className="text-xs text-mute">
          {sets.find((s) => s.id === setId)?.cardCount ?? 0} cards in checklist
          {sets.find((s) => s.id === setId)?.officialCardCount != null &&
            ` · ${sets.find((s) => s.id === setId)?.officialCardCount} official`}
        </p>
      )}
      {source === "mock" && (
        <p className="rounded-lg bg-line/50 px-3 py-2 text-xs text-mute">
          Sample data. No live provider is configured for this game.
        </p>
      )}
      {error && (
        <div
          role="alert"
          className="rounded-lg border border-line bg-panel p-3 text-sm"
        >
          {error}{" "}
          <button
            className="ml-2 underline"
            onClick={() => setTick((t) => t + 1)}
          >
            Retry
          </button>
        </div>
      )}
      <div className={`grid gap-3 ${grid}`}>
        {loading &&
          Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className="aspect-[63/88] animate-pulse rounded-md bg-line/60"
            />
          ))}
        {!loading &&
          shown.map((c) => (
            <Cell
              key={c.id}
              card={c}
              selected={selectedId === c.id}
              onSelect={() => onSelect?.(c)}
            />
          ))}
      </div>
      {!loading && !error && shown.length === 0 && (
        <p className="text-sm text-mute">
          {q || input
            ? "No cards match your search."
            : game === "one-piece" || game === "sports"
              ? "Search to browse cards."
              : "No cards to show."}
        </p>
      )}
      {more && !loading && (
        <button
          className="w-full rounded-lg border border-line py-2 text-sm"
          onClick={loadMore}
        >
          Load more
        </button>
      )}
    </div>
  );
}
