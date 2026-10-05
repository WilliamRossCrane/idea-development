import { afterEach, describe, expect, it, vi } from "vitest";
import { berryWalletOnePiece } from "./berrywallet";
import { getProvider } from ".";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("BerryWallet One Piece provider", () => {
  it("keeps labelled sample data when neither One Piece key is configured", () => {
    vi.stubEnv("BERRYWALLET_API_KEY", "");
    vi.stubEnv("ONE_PIECE_API_KEY", "");
    expect(getProvider("one-piece").id).toBe("mock-one-piece");
  });

  it("is selected when the BerryWallet key is configured", () => {
    vi.stubEnv("BERRYWALLET_API_KEY", "test-key");
    expect(getProvider("one-piece").id).toBe("berrywallet");
  });

  it("loads Japanese sets using the API's jp language code and preserves group identity", async () => {
    vi.stubEnv("BERRYWALLET_API_KEY", "test-key");
    const fetchMock = vi.fn().mockImplementation(() =>
      Promise.resolve(
        new Response(
          JSON.stringify({
            success: true,
            data: [
              {
                name: "Romance Dawn",
                set_code: "OP01",
                group_id: "-8",
                language: "jp",
                release_date: "2022-12-02",
              },
            ],
            total: 1,
          }),
        ),
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    const sets = await berryWalletOnePiece.getSets("ja");

    expect(String(fetchMock.mock.calls[0][0])).toContain(
      "/op/sets?language=jp",
    );
    expect(fetchMock.mock.calls[0][1]?.headers).toMatchObject({
      "X-API-Key": "test-key",
    });
    expect(sets[0]).toMatchObject({
      id: "-8",
      name: "Romance Dawn",
      language: "ja",
      game: "one-piece",
    });
  });

  it("loads Japanese set cards, images and dual-market quotes without crossing languages", async () => {
    vi.stubEnv("BERRYWALLET_API_KEY", "test-key");
    const card = {
      id: "op_jp_001",
      card_number: "OP01-001",
      name: "ロロノア・ゾロ",
      sub_type_name: "Normal",
      rarity: "L",
      card_type: "Leader",
      ext_color: "Red",
      image_url: "https://cdn.example.test/OP01-001.jpg",
      tcgplayer: {
        prices: {
          market_price: 1.2,
          low_price: 0.8,
          updated_at: "2026-10-04T00:00:00Z",
        },
      },
      cardmarket: {
        prices: {
          avg: 1.1,
          low: 0.7,
          updated_at: "2026-10-04T00:00:00Z",
        },
      },
    };
    const setResponse = {
      success: true,
      set: {
        set_code: "OP01",
        group_id: "-8",
        name: "Romance Dawn",
        language: "jp",
      },
      total: 2,
      page: 1,
      limit: 24,
      data: [card],
    };
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify(setResponse)))
      .mockResolvedValueOnce(new Response(JSON.stringify(card)));
    vi.stubGlobal("fetch", fetchMock);

    const result = await berryWalletOnePiece.searchCards({
      language: "ja",
      setId: "-8",
      page: 1,
      pageSize: 24,
    });
    const details = await berryWalletOnePiece.getCard(
      "op_jp_001",
      undefined,
      "ja",
    );

    expect(String(fetchMock.mock.calls[0][0])).toContain(
      "/op/sets/-8?page=1&limit=24",
    );
    expect(result).toMatchObject({ total: 2, hasMore: false, source: "api" });
    expect(result.cards[0]).toMatchObject({
      id: "one-piece:berry:ja:op_jp_001",
      language: "ja",
      setId: "-8",
      printings: ["normal"],
      imageUrl: "https://cdn.example.test/OP01-001.jpg",
    });
    expect(details?.prices).toMatchObject([
      { source: "TCGplayer", currency: "USD", amount: 1.2, printing: "normal" },
      {
        source: "Cardmarket",
        currency: "EUR",
        amount: 1.1,
        printing: "normal",
      },
    ]);
  });

  it("requires a selected set for Japanese search rather than using an unfiltered global search", async () => {
    vi.stubEnv("BERRYWALLET_API_KEY", "test-key");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const result = await berryWalletOnePiece.searchCards({
      language: "ja",
      q: "ゾロ",
    });

    expect(result.cards).toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
