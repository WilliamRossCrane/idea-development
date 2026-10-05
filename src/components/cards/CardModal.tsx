"use client";
import { useEffect, useState } from "react";
import {
  POKEMON_LANGUAGES,
  PRINTING_LABELS,
  type CardDefinition,
  type CardDetailsResponse,
} from "@/services/cards/types";
import { useStore } from "@/features/store";
import { copiesOf } from "@/features/binders/logic";
import { CardArt, GAME_LABEL } from "./CardArt";

function formatCurrency(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

export function CardModal({
  card,
  onClose,
}: {
  card: CardDefinition;
  onClose: () => void;
}) {
  const { binders, items, addCopy, addToBinder } = useStore();
  const [detail, setDetail] = useState(card);
  const [printing, setPrinting] = useState(card.printings?.[0] ?? "");
  const [prices, setPrices] = useState<CardDetailsResponse["prices"]>([]);
  const [pricingStatus, setPricingStatus] = useState<
    "loading" | "ready" | "unavailable"
  >("loading");
  const [binderId, setBinderId] = useState(binders[0]?.id ?? "");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    // list results from some providers lack set/rarity: fetch the full card
    setDetail(card);
    setPrinting(card.printings?.[0] ?? "");
    setPrices([]);
    setPricingStatus("loading");
    const ac = new AbortController();
    const language = card.language ?? "en";
    fetch(
      `/api/cards/${card.game}/${encodeURIComponent(card.providerId)}?${new URLSearchParams({ language })}`,
      { signal: ac.signal },
    )
      .then(async (r) => {
        if (!r.ok) throw new Error("Price lookup unavailable");
        const d = (await r.json()) as CardDetailsResponse;
        setDetail(d.card);
        setPrices(d.prices ?? []);
        setPrinting(d.card.printings?.[0] ?? "");
        setPricingStatus("ready");
      })
      .catch((e) => {
        if (e.name !== "AbortError") setPricingStatus("unavailable");
      });
    return () => ac.abort();
  }, [card]);
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const owned = copiesOf(items, detail.id);
  const languageName =
    POKEMON_LANGUAGES.find((l) => l.code === detail.language)?.name ??
    detail.language;
  const rows: [string, string | number | undefined][] = [
    ["Game", GAME_LABEL[detail.game]],
    ["Language", languageName],
    ["Set", detail.setName],
    ["Number", detail.cardNumber],
    ["Rarity", detail.rarity],
    ...Object.entries(detail.extra ?? {}).map(
      ([k, v]): [string, string | number | undefined] => [
        k[0].toUpperCase() + k.slice(1),
        v,
      ],
    ),
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="card-title"
        onClick={(e) => e.stopPropagation()}
        className="grid max-h-[90vh] w-full max-w-2xl gap-6 overflow-auto rounded-2xl border border-line bg-panel p-6 sm:grid-cols-[220px_1fr]"
      >
        <CardArt card={detail} large />
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-2">
            <h2 id="card-title" className="text-2xl font-semibold">
              {detail.name}
            </h2>
            <button
              autoFocus
              onClick={onClose}
              aria-label="Close"
              className="rounded-lg border border-line px-2 py-1"
            >
              ✕
            </button>
          </div>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
            {rows
              .filter(([, v]) => v !== undefined && v !== "")
              .map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="text-mute">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
          </dl>
          {!!detail.printings?.length && (
            <label className="block text-sm">
              Printing
              <select
                aria-label="Printing"
                value={printing}
                onChange={(e) => setPrinting(e.target.value)}
                className="ml-2 rounded-lg border border-line bg-paper px-2 py-1.5"
              >
                {detail.printings.map((p) => (
                  <option key={p} value={p}>
                    {PRINTING_LABELS[p] ?? p}
                  </option>
                ))}
              </select>
            </label>
          )}
          {pricingStatus !== "loading" && (
            <section className="space-y-2" aria-label="Market estimates">
              <h3 className="text-sm font-semibold">Market estimates</h3>
              {pricingStatus === "unavailable" ? (
                <p className="text-xs text-mute">
                  Price data is unavailable from the configured provider.
                </p>
              ) : prices.length === 0 ? (
                <p className="text-xs text-mute">
                  No current market price is available for this card.
                </p>
              ) : (
                <div className="space-y-2">
                  {prices.map((quote) => (
                    <div
                      key={`${quote.source}:${quote.currency}:${quote.printing}`}
                      className="text-xs"
                    >
                      <div className="flex flex-wrap justify-between gap-2">
                        <span>
                          {PRINTING_LABELS[quote.printing] ?? quote.printing} ·{" "}
                          {quote.source}
                        </span>
                        <strong>
                          {quote.audEstimate !== undefined
                            ? `${formatCurrency(quote.audEstimate, "AUD")} estimate`
                            : formatCurrency(quote.amount, quote.currency)}
                        </strong>
                      </div>
                      <p className="text-mute">
                        {formatCurrency(quote.amount, quote.currency)} · Updated{" "}
                        {quote.updatedAt
                          ? new Date(quote.updatedAt).toLocaleDateString(
                              "en-AU",
                            )
                          : "date not supplied"}
                      </p>
                      {quote.currency !== "AUD" &&
                        quote.audEstimate !== undefined && (
                          <p className="text-mute">
                            Converted at 1 {quote.currency} ={" "}
                            {quote.exchangeRate?.toFixed(4)} AUD (rate date{" "}
                            {quote.exchangeRateDate}); not an Australian-market
                            quote.
                          </p>
                        )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
          {owned > 0 && <p className="text-sm text-mute">Owned ×{owned}</p>}
          <div className="space-y-2">
            <button
              className="rounded-lg border border-line px-3 py-2 text-sm"
              onClick={() => {
                addCopy(detail, printing || undefined);
                setMsg(
                  owned
                    ? "Added another copy to your collection."
                    : "Added to your collection (Unsorted).",
                );
              }}
            >
              {owned ? "Add another copy" : "Add to collection"}
            </button>
            {binders.length > 0 && (
              <div className="flex gap-2">
                <select
                  aria-label="Binder"
                  value={binderId}
                  onChange={(e) => setBinderId(e.target.value)}
                  className="min-w-0 flex-1 rounded-lg border border-line bg-paper px-2 py-2 text-sm"
                >
                  {binders.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
                <button
                  className="rounded-lg bg-accent px-3 py-2 text-sm text-white"
                  onClick={() =>
                    setMsg(
                      addToBinder(detail, binderId, printing || undefined)
                        ? "Added to the binder."
                        : "That binder is full. Added to Unsorted.",
                    )
                  }
                >
                  Add to binder
                </button>
              </div>
            )}
            {msg && (
              <p role="status" className="text-sm text-mute">
                {msg}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
