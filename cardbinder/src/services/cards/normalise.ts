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

const berryLanguage = (language?: string) =>
  language === "jp" || language === "ja" ? "ja" : "en";

export function normaliseBerryWalletSet(raw: unknown): CardSet {
  const set = raw as Record<string, any>;
  const id = set?.group_id ?? set?.set_code;
  if (id == null || typeof set?.name !== "string") throw bad("BerryWallet set");
  const count = typeof set.card_count === "number" ? set.card_count : undefined;
  return {
    id: String(id),
    name: set.name,
    game: "one-piece",
    language: berryLanguage(set.language),
    cardCount: count,
    totalCardCount: count,
  };
}

export function normaliseBerryWalletCard(
  raw: unknown,
  options: { language?: string; setId?: string; setName?: string } = {},
): CardDefinition {
  const card = raw as Record<string, any>;
  const providerId = card?.id ?? card?.card_id;
  const name = card?.name ?? card?.card_name;
  if (providerId == null || typeof name !== "string")
    throw bad("BerryWallet card");
  const language = berryLanguage(
    card.set?.language ?? card.language ?? options.language,
  );
  const rawSetId =
    options.setId ??
    card.set?.group_id ??
    card.group_id ??
    card.set_id ??
    card.set_code;
  const image = typeof card.image_url === "string" ? card.image_url : undefined;
  const printing = card.variant ?? card.sub_type_name;
  const printings = Array.isArray(card.printings)
    ? card.printings.filter(
        (value: unknown): value is string => typeof value === "string",
      )
    : typeof printing === "string"
      ? [
          printing.toLowerCase() === "normal"
            ? "normal"
            : printing.toLowerCase(),
        ]
      : undefined;
  const extra: Record<string, string | number | undefined> = {};
  for (const [key, value] of Object.entries({
    color: card.ext_color ?? card.card_color,
    cardType: card.card_type,
    power: card.ext_power ?? card.card_power,
    life: card.ext_life ?? card.life,
    subtypes: card.ext_subtypes ?? card.sub_types,
    attribute: card.ext_attribute ?? card.attribute,
    description: card.ext_description ?? card.card_text,
  })) {
    if (typeof value === "string" || typeof value === "number")
      extra[key] = value;
  }
  return {
    id: `one-piece:berry:${language}:${providerId}`,
    providerId: String(providerId),
    game: "one-piece",
    name,
    language,
    setId: rawSetId == null ? undefined : String(rawSetId),
    setName: options.setName ?? card.set?.name ?? card.set_name,
    cardNumber: card.card_number ?? card.card_set_id,
    rarity: typeof card.rarity === "string" ? card.rarity : undefined,
    imageUrl: image,
    thumbUrl: image,
    printings,
    extra,
  };
}

export function normaliseBerryWalletPrices(raw: unknown): CardPriceQuote[] {
  if (!raw || typeof raw !== "object") return [];
  const card = raw as Record<string, any>,
    variant = card.variant ?? card.sub_type_name ?? "normal";
  const printing =
    String(variant).toLowerCase() === "normal"
      ? "normal"
      : String(variant).toLowerCase();
  const quotes: CardPriceQuote[] = [];
  const tcg = card.tcgplayer?.prices;
  if (typeof tcg?.market_price === "number" && tcg.market_price > 0) {
    quotes.push({
      source: "TCGplayer",
      currency: "USD",
      printing,
      amount: tcg.market_price,
      lowPrice: typeof tcg.low_price === "number" ? tcg.low_price : undefined,
      updatedAt: tcg.updated_at,
    });
  }
  const market = card.cardmarket?.prices;
  if (typeof market?.avg === "number" && market.avg > 0) {
    quotes.push({
      source: "Cardmarket",
      currency: "EUR",
      printing,
      amount: market.avg,
      lowPrice: typeof market.low === "number" ? market.low : undefined,
      updatedAt: market.updated_at,
    });
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
    language: typeof r.language === "string" ? r.language : undefined,
    setId: r.set_id != null ? String(r.set_id) : undefined,
    setName: typeof r.set_name === "string" ? r.set_name : undefined,
    cardNumber: r.number != null ? String(r.number) : undefined,
    rarity: typeof r.rarity === "string" ? r.rarity : undefined,
    imageUrl: img,
    thumbUrl: img,
    extra,
  };
}

export function normaliseTcgapiPrices(raw: unknown): CardPriceQuote[] {
  if (!raw || typeof raw !== "object") return [];
  const card = raw as Record<string, any>;
  const rows = Array.isArray(card.prices) ? card.prices : [card];
  return rows.flatMap((row: any) => {
    const amount =
      typeof row?.market_price === "number"
        ? row.market_price
        : row?.marketPrice;
    if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0)
      return [];
    const rawPrinting =
      typeof row.printing === "string" ? row.printing.toLowerCase() : "normal";
    const printing =
      (
        {
          normal: "normal",
          "reverse holofoil": "reverse",
          "reverse-holofoil": "reverse",
          holofoil: "holo",
        } as Record<string, string>
      )[rawPrinting] ?? rawPrinting;
    return [
      {
        source: "TCG API",
        currency: row.currency ?? card.currency ?? "USD",
        printing,
        amount,
        lowPrice:
          typeof row.low_price === "number"
            ? row.low_price
            : typeof row.lowPrice === "number"
              ? row.lowPrice
              : undefined,
        updatedAt:
          row.market_price_as_of ?? row.price_updated_at ?? row.updated_at,
      },
    ];
  });
}

export function normaliseTcgapiSet(raw: unknown): CardSet {
  const r = raw as Record<string, any>;
  if (
    !r ||
    (typeof r.id !== "string" && typeof r.id !== "number") ||
    typeof r.name !== "string"
  )
    throw bad("set");
  const count = typeof r.card_count === "number" ? r.card_count : undefined;
  return {
    id: String(r.id),
    name: r.name,
    game: "one-piece",
    cardCount: count,
    totalCardCount: count,
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
