import type {
  CardDetails,
  CardProvider,
  CardSearchQuery,
  CardSearchResult,
} from "../types";
import {
  normaliseBerryWalletCard,
  normaliseBerryWalletPrices,
  normaliseBerryWalletSet,
  ProviderError,
} from "../normalise";

const BASE = "https://api.pokewallet.io";
const languageCode = (language?: string) =>
  language === "ja" || language === "jp" ? "jp" : "en";
const languageName = (language?: string) =>
  languageCode(language) === "jp" ? "ja" : "en";
const rowsFrom = (response: any): any[] =>
  Array.isArray(response?.data)
    ? response.data
    : Array.isArray(response?.sets)
      ? response.sets
      : Array.isArray(response?.results)
        ? response.results
        : [];
const emptyResult = (page: number, pageSize: number): CardSearchResult => ({
  cards: [],
  page,
  pageSize,
  hasMore: false,
  total: 0,
  source: "api",
});

async function get(path: string, signal?: AbortSignal): Promise<any> {
  const key = process.env.BERRYWALLET_API_KEY;
  if (!key)
    throw new ProviderError("unavailable", "BERRYWALLET_API_KEY not set");
  let response: Response;
  try {
    response = await fetch(`${BASE}${path}`, {
      headers: { "X-API-Key": key },
      signal,
      next: { revalidate: 21600 },
    });
  } catch (error) {
    if ((error as Error).name === "AbortError") throw error;
    throw new ProviderError("unavailable", "BerryWallet API unreachable");
  }
  if (response.status === 404)
    throw new ProviderError("not-found", "Not found");
  if (!response.ok)
    throw new ProviderError(
      "unavailable",
      `BerryWallet API responded ${response.status}`,
    );
  let json: any;
  try {
    json = await response.json();
  } catch {
    throw new ProviderError("malformed", "Invalid BerryWallet JSON");
  }
  if (json?.success === false)
    throw new ProviderError(
      "unavailable",
      json?.message ?? "BerryWallet API request failed",
    );
  return json;
}

export const berryWalletOnePiece: CardProvider = {
  id: "berrywallet",
  game: "one-piece",
  isMock: false,

  async getSets(language, signal) {
    const code = languageCode(language);
    const response = await get(`/op/sets?language=${code}`, signal);
    return rowsFrom(response).map(normaliseBerryWalletSet);
  },

  async searchCards(query: CardSearchQuery, signal): Promise<CardSearchResult> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 24;
    const language = languageCode(query.language);
    let response: any;
    let cards: any[];
    let total: number | undefined;
    let set: any;

    if (query.setId) {
      response = await get(
        `/op/sets/${encodeURIComponent(query.setId)}?page=${page}&limit=${pageSize}`,
        signal,
      );
      cards = rowsFrom(response);
      set = response.set;
      total = typeof response.total === "number" ? response.total : undefined;
      const actualLanguage = languageCode(set?.language ?? language);
      if (actualLanguage !== language) return emptyResult(page, pageSize);
      if (query.q) {
        const needle = query.q.toLowerCase();
        cards = cards.filter((card) =>
          `${card.name ?? card.card_name ?? ""} ${card.card_number ?? ""}`
            .toLowerCase()
            .includes(needle),
        );
      }
    } else if (language === "jp") {
      return emptyResult(page, pageSize);
    } else if (query.q && query.q.length >= 2) {
      response = await get(
        `/op/search?q=${encodeURIComponent(query.q)}&page=${page}&limit=${pageSize}`,
        signal,
      );
      cards = rowsFrom(response);
      total = typeof response.total === "number" ? response.total : undefined;
    } else {
      return emptyResult(page, pageSize);
    }

    const normalised = cards
      .map((card) =>
        normaliseBerryWalletCard(card, {
          language: languageName(
            set?.language ?? card?.set?.language ?? language,
          ),
          setId:
            query.setId ??
            (set?.group_id != null ? String(set.group_id) : undefined),
          setName: set?.name,
        }),
      )
      .filter((card) => card.language === languageName(language));
    const hasMore =
      typeof total === "number"
        ? page * pageSize < total
        : cards.length === pageSize;
    return { cards: normalised, page, pageSize, hasMore, total, source: "api" };
  },

  async getCard(
    providerId: string,
    signal?: AbortSignal,
    language?: string,
  ): Promise<CardDetails | null> {
    try {
      const response = await get(
        `/op/cards/${encodeURIComponent(providerId)}`,
        signal,
      );
      const raw = response?.data ?? response;
      const card = normaliseBerryWalletCard(raw, {
        language: languageName(language),
      });
      return { card, prices: normaliseBerryWalletPrices(raw) };
    } catch (error) {
      if (error instanceof ProviderError && error.code === "not-found")
        return null;
      throw error;
    }
  },
};
