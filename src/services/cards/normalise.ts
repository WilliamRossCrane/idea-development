import type { CardDefinition, CardPriceQuote, CardSet } from "./types";

export class ProviderError extends Error {
  constructor(
    public code: "unavailable" | "malformed" | "not-found",
    message: string,
  ) {
    super(message);
  }
}
const bad = (what: string) =>
  new ProviderError("malformed", `Unexpected ${what} format`);

/**
 * TCGdex card list items ("CardBrief": id, localId, name, optional image) carry NO set name or rarity.
 * Those arrive only from the single-card endpoint, see normaliseTcgdexCard.
 * Image URLs have no extension: append `/{high|low}.{webp|png|jpg}` (documented at tcgdex.dev/assets).
 */
export function normaliseTcgdexBrief(
  raw: unknown,
  language = "en",
): CardDefinition {
  if (!raw || typeof raw !== "object") throw bad("card");
  const r = raw as Record<string, any>;
  if (typeof r.id !== "string" || typeof r.name !== "string") throw bad("card");
  const dash = r.id.lastIndexOf("-");
  return {
    id: language === "en" ? `pokemon:${r.id}` : `pokemon:${language}:${r.id}`,
    providerId: r.id,
    game: "pokemon",
    name: r.name,
    language,
    setId: dash > 0 ? r.id.slice(0, dash) : undefined,
    cardNumber: r.localId != null ? String(r.localId) : undefined,
    imageUrl: typeof r.image === "string" ? `${r.image}/high.webp` : undefined,
    thumbUrl: typeof r.image === "string" ? `${r.image}/low.webp` : undefined,
  };
}
export function normaliseTcgdexCard(
  raw: unknown,
  language = "en",
): CardDefinition {
  const base = normaliseTcgdexBrief(raw, language);
  const r = raw as Record<string, any>;
  return {
    ...base,
    setId: r.set?.id ?? base.setId,
    setName: r.set?.name,
    rarity: typeof r.rarity === "string" ? r.rarity : undefined,
    printings:
      r.variants && typeof r.variants === "object"
        ? Object.entries(r.variants)
            .filter(([, available]) => available === true)
            .map(([key]) => key)
        : undefined,
    extra: {
      category: r.category,
      illustrator: r.illustrator,
      hp: r.hp,
      types: Array.isArray(r.types) ? r.types.join(", ") : undefined,
    },
  };
}
export function normaliseTcgdexSet(raw: unknown, language = "en"): CardSet {
  const r = raw as Record<string, any>;
  if (!r || typeof r.id !== "string" || typeof r.name !== "string")
    throw bad("set");
  return {
    id: r.id,
    name: r.name,
    game: "pokemon",
    language,
    cardCount: r.cardCount?.total,
    totalCardCount: r.cardCount?.total,
    officialCardCount: r.cardCount?.official,
    logoUrl: typeof r.logo === "string" ? `${r.logo}.webp` : undefined,
  };
}

export function normaliseTcgdexPrices(raw: unknown): CardPriceQuote[] {
  if (!raw || typeof raw !== "object") return [];
  const prices = raw as Record<string, any>,
    quotes: CardPriceQuote[] = [];
  const cardmarket = prices.cardmarket;
  if (cardmarket && typeof cardmarket === "object") {
    for (const [key, printing] of [
      ["avg", "normal"],
      ["avg-holo", "holo"],
    ]) {
      const amount = cardmarket[key];
      if (typeof amount === "number" && Number.isFinite(amount) && amount > 0) {
        quotes.push({
          source: "Cardmarket",
          currency: cardmarket.unit ?? "EUR",
          printing,
          amount,
          lowPrice:
            typeof cardmarket[key === "avg" ? "low" : "low-holo"] === "number"
              ? cardmarket[key === "avg" ? "low" : "low-holo"]
              : undefined,
          updatedAt: cardmarket.updated,
        });
      }
    }
  }
  const tcgplayer = prices.tcgplayer;
  if (tcgplayer && typeof tcgplayer === "object") {
    for (const [key, value] of Object.entries(tcgplayer)) {
      if (
        !value ||
        typeof value !== "object" ||
        typeof (value as any).marketPrice !== "number"
      )
        continue;
      const quote = value as Record<string, any>;
      quotes.push({
        source: "TCGplayer",
        currency: tcgplayer.unit ?? "USD",
        printing: key === "reverse-holofoil" ? "reverse" : key,
        amount: quote.marketPrice,
        lowPrice:
          typeof quote.lowPrice === "number" ? quote.lowPrice : undefined,
        updatedAt: tcgplayer.updated,
      });
    }
  }
  return quotes;
}

/* ---------- tcgapi.dev (One Piece) ----------
 * Documented card fields: id, name, number, rarity, image_url, set_name, product_type ("Cards" | "Sealed Products"),
 * custom_attributes (game-specific, keys NOT verified for One Piece, so passed through untouched).
 */
export function normaliseTcgapiCard(
  raw: unknown,
  game: "one-piece",
): CardDefinition {
  const r = raw as Record<string, any>;
  if (
    !r ||
    (typeof r.id !== "number" && typeof r.id !== "string") ||
    typeof r.name !== "string"
  )
    throw bad("card");
  const extra: Record<string, string | number | undefined> = {};
  if (r.custom_attributes && typeof r.custom_attributes === "object")
    for (const [k, v] of Object.entries(r.custom_attributes))
      if (typeof v === "string" || typeof v === "number") extra[k] = v;
  const img = typeof r.image_url === "string" ? r.image_url : undefined;
  return {
    id: `${game}:${r.id}`,
    providerId: String(r.id),
    game,
    name: r.name,
    setName: typeof r.set_name === "string" ? r.set_name : undefined,
    cardNumber: r.number != null ? String(r.number) : undefined,
    rarity: typeof r.rarity === "string" ? r.rarity : undefined,
    imageUrl: img,
    thumbUrl: img,
    extra,
  };
}

/* ---------- PriceCharting official API (sports cards) ----------
 * Documented fields: id, product-name, console-name. No images are provided by this API.
 * Name pattern "Player #12 [Variation]" and set strings like "Football Cards 2023 Topps Chrome" are ASSUMED from
 * how PriceCharting titles cards; brand/year/sport are parsed best-effort from those strings.
 */
const BRANDS = [
  "Topps",
  "Panini",
  "Upper Deck",
  "Donruss",
  "Bowman",
  "Fleer",
  "Score",
  "Leaf",
];
const SPORTS = ["Football", "Basketball", "Baseball", "Hockey", "Soccer"];
export function normalisePriceCharting(raw: unknown): CardDefinition {
  const r = raw as Record<string, any>;
  if (
    !r ||
    (typeof r.id !== "string" && typeof r.id !== "number") ||
    typeof r["product-name"] !== "string"
  )
    throw bad("card");
  const full: string = r["product-name"],
    set = typeof r["console-name"] === "string" ? r["console-name"] : undefined;
  const m = full.match(/^(.*?)\s*#\s*([\w-]+)/),
    hay = `${set ?? ""} ${full}`.toLowerCase();
  const year = hay.match(/\b(?:19|20)\d{2}\b/)?.[0];
  const brand = BRANDS.find((b) => hay.includes(b.toLowerCase())),
    sport = SPORTS.find((s) => hay.includes(s.toLowerCase()));
  return {
    id: `sports:${r.id}`,
    providerId: String(r.id),
    game: "sports",
    name: (m ? m[1] : full).replace(/\[.*?\]/g, "").trim(),
    setName: set,
    setId: set,
    cardNumber: m?.[2],
    extra: {
      sport,
      year: year ? Number(year) : undefined,
      brand,
      manufacturer: brand,
      variation: full.match(/\[(.+?)\]/)?.[1],
    },
  };
}
