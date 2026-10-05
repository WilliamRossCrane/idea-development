import { afterEach, describe, expect, it, vi } from "vitest";
import { tcgdexProvider } from "./tcgdex";

afterEach(() => vi.unstubAllGlobals());

describe("TCGdex locale support", () => {
  it("searches and namespaces Japanese cards by language", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify([
          {
            id: "PMCG1-001",
            localId: "001",
            name: "フシギダネ",
            image: "https://assets.tcgdex.net/ja/base/PMCG1/001",
          },
        ]),
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    const result = await tcgdexProvider.searchCards({
      language: "ja",
      q: "フシギダネ",
    });

    expect(fetchMock.mock.calls[0][0]).toContain("/v2/ja/cards?");
    expect(result.cards[0]).toMatchObject({
      id: "pokemon:ja:PMCG1-001",
      name: "フシギダネ",
      language: "ja",
    });
  });

  it("loads localized sets with completion counts", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify([
          {
            id: "PMCG1",
            name: "拡張パック",
            cardCount: { official: 102, total: 102 },
          },
        ]),
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    const sets = await tcgdexProvider.getSets("ja");

    expect(fetchMock.mock.calls[0][0]).toContain("/v2/ja/sets");
    expect(sets[0]).toMatchObject({
      id: "PMCG1",
      language: "ja",
      officialCardCount: 102,
      totalCardCount: 102,
    });
  });

  it("returns card details separately from native-currency printing quotes", async () => {
    const fetchMock = vi.fn().mockImplementation(() =>
      Promise.resolve(
        new Response(
          JSON.stringify({
            id: "swsh3-136",
            name: "Furret",
            rarity: "Uncommon",
            set: { id: "swsh3", name: "Darkness Ablaze" },
            pricing: {
              tcgplayer: {
                unit: "USD",
                updated: "2026-10-04T10:00:00Z",
                normal: { marketPrice: 0.25 },
              },
            },
          }),
        ),
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    const details = await tcgdexProvider.getCard("swsh3-136", undefined, "en");

    expect(details?.card).toMatchObject({
      name: "Furret",
      setName: "Darkness Ablaze",
    });
    expect(details?.prices).toEqual([
      {
        source: "TCGplayer",
        currency: "USD",
        printing: "normal",
        amount: 0.25,
        lowPrice: undefined,
        updatedAt: "2026-10-04T10:00:00Z",
      },
    ]);
  });
});
