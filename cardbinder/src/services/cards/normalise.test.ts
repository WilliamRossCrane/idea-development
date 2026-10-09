import { describe, it, expect } from "vitest";
import {
  normaliseTcgdexBrief,
  normaliseTcgdexCard,
  normaliseTcgdexPrices,
  normaliseTcgdexSet,
  ProviderError,
} from "./normalise";
import { mockOnePiece } from "./providers/mock";

// Shapes copied from tcgdex.dev/rest/cards and tcgdex.dev/reference/card
const brief = {
  id: "base4-1",
  localId: "1",
  name: "Alakazam",
  image: "https://assets.tcgdex.net/en/base/base4/1",
};
const full = {
  category: "Pokemon",
  id: "swsh3-136",
  illustrator: "tetsuya koizumi",
  image: "https://assets.tcgdex.net/en/swsh/swsh3/136",
  localId: "136",
  name: "Furret",
  rarity: "Uncommon",
  set: { id: "swsh3", name: "Darkness Ablaze" },
  hp: 110,
  types: ["Colorless"],
};

describe("TCGdex normalisation", () => {
  it("maps a card brief and builds image URLs", () => {
    const c = normaliseTcgdexBrief(brief);
    expect(c).toMatchObject({
      id: "pokemon:base4-1",
      setId: "base4",
      cardNumber: "1",
      game: "pokemon",
    });
    expect(c.thumbUrl).toBe(
      "https://assets.tcgdex.net/en/base/base4/1/low.webp",
    );
    expect(c.imageUrl).toBe(
      "https://assets.tcgdex.net/en/base/base4/1/high.webp",
    );
  });
  it("maps a full card with set and rarity", () => {
    expect(normaliseTcgdexCard(full)).toMatchObject({
      setName: "Darkness Ablaze",
      rarity: "Uncommon",
      extra: { hp: 110, types: "Colorless" },
    });
  });
  it("keeps Japanese printings distinct and preserves known variants", () => {
    const card = normaliseTcgdexCard(
      {
        ...full,
        id: "PMCG1-001",
        name: "フシギダネ",
        variants: { normal: true, reverse: false, holo: true },
      },
      "ja",
    );
    expect(card).toMatchObject({
      id: "pokemon:ja:PMCG1-001",
      providerId: "PMCG1-001",
      language: "ja",
      printings: ["normal", "holo"],
    });
  });
  it("normalizes official and total set checklist counts", () => {
    expect(
      normaliseTcgdexSet(
        {
          id: "PMCG1",
          name: "拡張パック",
          cardCount: { official: 102, total: 102 },
          logo: "https://assets.tcgdex.net/ja/base/PMCG1/logo",
        },
        "ja",
      ),
    ).toMatchObject({
      id: "PMCG1",
      language: "ja",
      cardCount: 102,
      officialCardCount: 102,
      totalCardCount: 102,
    });
  });
  it("keeps market source, currency, printing and update time on quotes", () => {
    expect(
      normaliseTcgdexPrices({
        cardmarket: {
          unit: "EUR",
          updated: "2026-10-04T10:00:00Z",
          avg: 0.08,
          low: 0.02,
          "avg-holo": 0.25,
          "low-holo": 0.04,
        },
        tcgplayer: {
          unit: "USD",
          updated: "2026-10-04T11:00:00Z",
          normal: { marketPrice: 0.25, lowPrice: 0.01 },
          "reverse-holofoil": { marketPrice: 0.44 },
        },
      }),
    ).toEqual([
      {
        source: "Cardmarket",
        currency: "EUR",
        printing: "normal",
        amount: 0.08,
        lowPrice: 0.02,
        updatedAt: "2026-10-04T10:00:00Z",
      },
      {
        source: "Cardmarket",
        currency: "EUR",
        printing: "holo",
        amount: 0.25,
        lowPrice: 0.04,
        updatedAt: "2026-10-04T10:00:00Z",
      },
      {
        source: "TCGplayer",
        currency: "USD",
        printing: "normal",
        amount: 0.25,
        lowPrice: 0.01,
        updatedAt: "2026-10-04T11:00:00Z",
      },
      {
        source: "TCGplayer",
        currency: "USD",
        printing: "reverse",
        amount: 0.44,
        lowPrice: undefined,
        updatedAt: "2026-10-04T11:00:00Z",
      },
    ]);
  });
  it("handles a missing image", () => {
    expect(
      normaliseTcgdexBrief({ id: "x-1", name: "N" }).imageUrl,
    ).toBeUndefined();
  });
  it("rejects malformed data", () => {
    expect(() => normaliseTcgdexBrief({ name: 3 })).toThrow(ProviderError);
    expect(() => normaliseTcgdexBrief(null)).toThrow(ProviderError);
  });
});
describe("mock provider", () => {
  it("is labelled mock and filters", async () => {
    const r = await mockOnePiece.searchCards({ q: "luffy" });
    expect(r.source).toBe("mock");
    expect(r.cards.map((c) => c.name)).toEqual(["Monkey D. Luffy"]);
    expect(
      (await mockOnePiece.searchCards({ filters: { color: "Red" } })).cards,
    ).toHaveLength(2);
  });
});

import { normaliseTcgapiCard, normalisePriceCharting } from "./normalise";
describe("tcgapi.dev normalisation", () => {
  // shape from tcgapi.dev/api/cards (sample is a Pokémon card; only the shape matters)
  it("maps documented fields", () => {
    const c = normaliseTcgapiCard(
      {
        id: 12345,
        name: "Charizard ex",
        number: "006",
        rarity: "Double Rare",
        image_url: "https://x/y.jpg",
        set_name: "Obsidian Flames",
        product_type: "Cards",
        custom_attributes: { hp: "330" },
      },
      "one-piece",
    );
    expect(c).toMatchObject({
      id: "one-piece:12345",
      cardNumber: "006",
      setName: "Obsidian Flames",
      imageUrl: "https://x/y.jpg",
      extra: { hp: "330" },
    });
  });
  it("rejects malformed", () =>
    expect(() => normaliseTcgapiCard({}, "one-piece")).toThrow(ProviderError));
});
describe("PriceCharting normalisation", () => {
  it("maps the documented shape", () => {
    expect(
      normalisePriceCharting({
        "console-name": "Playstation",
        id: "4801",
        "product-name": "Tactics Ogre",
      }),
    ).toMatchObject({
      id: "sports:4801",
      name: "Tactics Ogre",
      setName: "Playstation",
    });
  });
  it("parses brand/year/sport from an ASSUMED sports title format (synthetic example)", () => {
    expect(
      normalisePriceCharting({
        "console-name": "Football Cards 2023 Topps Chrome",
        id: "1",
        "product-name": "Sample Player #12 [Refractor]",
      }),
    ).toMatchObject({
      name: "Sample Player",
      cardNumber: "12",
      extra: {
        brand: "Topps",
        year: 2023,
        sport: "Football",
        variation: "Refractor",
      },
    });
  });
});
