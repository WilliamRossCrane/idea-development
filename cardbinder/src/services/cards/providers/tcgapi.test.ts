import { afterEach, describe, expect, it, vi } from "vitest";
import { tcgapiOnePiece } from "./tcgapi";
import { getProvider } from ".";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("TCG API One Piece catalog", () => {
  it("uses the real provider when only the API key is configured", () => {
    vi.stubEnv("ONE_PIECE_API_KEY", "test-key");
    vi.stubEnv("ONE_PIECE_GAME", "");
    expect(getProvider("one-piece").id).toBe("tcgapi");
  });

  it("loads public paginated set metadata without an API key", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            data: [
              { id: 1100085, name: "The Dominance of God", card_count: 26 },
            ],
            meta: { has_more: true },
          }),
        ),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            data: [
              {
                id: 1100087,
                name: "One Piece Heroine's Edition",
                card_count: 51,
              },
            ],
            meta: { has_more: false },
          }),
        ),
      );
    vi.stubGlobal("fetch", fetchMock);

    const sets = await tcgapiOnePiece.getSets();

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(String(fetchMock.mock.calls[0][0])).toContain(
      "/games/one-piece-card-game/sets?per_page=100&page=1",
    );
    expect(String(fetchMock.mock.calls[1][0])).toContain("page=2");
    expect(fetchMock.mock.calls[0][1]?.headers).toBeUndefined();
    expect(sets).toMatchObject([
      {
        id: "1100085",
        name: "The Dominance of God",
        game: "one-piece",
        cardCount: 26,
      },
      {
        id: "1100087",
        name: "One Piece Heroine's Edition",
        game: "one-piece",
        cardCount: 51,
      },
    ]);
  });

  it("loads cards from a selected set using the server-side API key", async () => {
    vi.stubEnv("ONE_PIECE_API_KEY", "test-key");
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          data: [
            {
              id: 9123,
              name: "Monkey D. Luffy",
              number: "OP01-001",
              set_id: 1100085,
              set_name: "Romance Dawn",
              image_url: "https://example.test/luffy.jpg",
            },
          ],
          meta: { has_more: true },
        }),
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    const result = await tcgapiOnePiece.searchCards({
      setId: "1100085",
      page: 2,
      pageSize: 12,
    });

    expect(String(fetchMock.mock.calls[0][0])).toContain(
      "/sets/1100085/cards?per_page=12&page=2",
    );
    expect(fetchMock.mock.calls[0][1]?.headers).toMatchObject({
      "X-API-Key": "test-key",
    });
    expect(result).toMatchObject({ source: "api", page: 2, hasMore: true });
    expect(result.cards[0]).toMatchObject({
      id: "one-piece:9123",
      setId: "1100085",
      setName: "Romance Dawn",
    });
  });

  it("uses set pagination for a short query and retains the selected set id", async () => {
    vi.stubEnv("ONE_PIECE_API_KEY", "test-key");
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          data: [{ id: 9124, name: "Monkey D. Luffy", number: "OP01-001" }],
          meta: { has_more: false },
        }),
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    const result = await tcgapiOnePiece.searchCards({
      setId: "1100085",
      q: "L",
      pageSize: 12,
    });

    expect(String(fetchMock.mock.calls[0][0])).toContain(
      "/sets/1100085/cards?",
    );
    expect(result.cards[0]).toMatchObject({
      name: "Monkey D. Luffy",
      setId: "1100085",
    });
  });

  it("returns per-printing native prices in card details", async () => {
    vi.stubEnv("ONE_PIECE_API_KEY", "test-key");
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          data: {
            id: 9123,
            name: "Monkey D. Luffy",
            number: "OP01-001",
            set_id: 1100085,
            set_name: "Romance Dawn",
            prices: [
              {
                printing: "Normal",
                currency: "USD",
                market_price: 12.5,
                low_price: 11,
                market_price_as_of: "2026-10-01",
              },
            ],
          },
        }),
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    const details = await tcgapiOnePiece.getCard("9123");

    expect(details?.card).toMatchObject({
      name: "Monkey D. Luffy",
      setId: "1100085",
    });
    expect(details?.prices).toEqual([
      {
        source: "TCG API",
        currency: "USD",
        printing: "normal",
        amount: 12.5,
        lowPrice: 11,
        updatedAt: "2026-10-01",
      },
    ]);
  });
});
