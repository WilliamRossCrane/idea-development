// Real provider. API docs: https://tcgdex.dev/rest (free, public, no API key).
import {
  POKEMON_LANGUAGES,
  type CardProvider,
  type CardSearchQuery,
} from "../types";
import {
  ProviderError,
  normaliseTcgdexBrief,
  normaliseTcgdexCard,
  normaliseTcgdexSet,
} from "../normalise";

const languageOrEnglish = (language?: string) =>
  POKEMON_LANGUAGES.some((x) => x.code === language) ? language! : "en";

async function get(
  path: string,
  language: string,
  signal?: AbortSignal,
): Promise<unknown> {
  let res: Response;
  try {
    res = await fetch(`https://api.tcgdex.net/v2/${language}${path}`, {
      signal,
      next: { revalidate: 86400 },
    });
  } catch (e) {
    // card data is static: cache 24h
    if ((e as Error).name === "AbortError") throw e;
    throw new ProviderError("unavailable", "TCGdex unreachable");
  }
  if (res.status === 404) throw new ProviderError("not-found", "Not found");
  if (!res.ok)
    throw new ProviderError("unavailable", `TCGdex responded ${res.status}`);
  try {
    return await res.json();
  } catch {
    throw new ProviderError("malformed", "Invalid JSON");
  }
}

export const tcgdexProvider: CardProvider = {
  id: "tcgdex",
  game: "pokemon",
  isMock: false,

  async searchCards(q: CardSearchQuery, signal) {
    const language = languageOrEnglish(q.language);
    const page = q.page ?? 1,
      size = q.pageSize ?? 24;
    if (q.setId) {
      // the set endpoint returns its card list; the API has no documented nested set filter, so filter/paginate here
      const set = (await get(
        `/sets/${encodeURIComponent(q.setId)}`,
        language,
        signal,
      )) as any;
      if (!Array.isArray(set?.cards))
        throw new ProviderError("malformed", "Unexpected set format");
      const needle = (q.q ?? "").toLowerCase();
      const all = set.cards.filter(
        (c: any) =>
          typeof c?.name === "string" && c.name.toLowerCase().includes(needle),
      );
      return {
        cards: all
          .slice((page - 1) * size, page * size)
          .map((c: unknown) => normaliseTcgdexBrief(c, language)),
        page,
        pageSize: size,
        hasMore: all.length > page * size,
        source: "api" as const,
      };
    }
    // Filters use `field=value` (case-insensitive "contains") or `field=eq:value` (exact); pagination uses literal colons.
    const parts = [
      `pagination:page=${page}`,
      `pagination:itemsPerPage=${size}`,
    ];
    if (q.q) parts.push(`name=${encodeURIComponent(q.q)}`);
    if (q.rarity) parts.push(`rarity=eq:${encodeURIComponent(q.rarity)}`);
    const raw = await get(`/cards?${parts.join("&")}`, language, signal);
    if (!Array.isArray(raw))
      throw new ProviderError("malformed", "Unexpected card list format");
    // The API sends no totals, so "has more" means "we got a full page".
    return {
      cards: raw.map((c: unknown) => normaliseTcgdexBrief(c, language)),
      page,
      pageSize: size,
      hasMore: raw.length === size,
      source: "api" as const,
    };
  },

  async getCard(id, signal, requestedLanguage) {
    const language = languageOrEnglish(requestedLanguage);
    try {
      return normaliseTcgdexCard(
        await get(`/cards/${encodeURIComponent(id)}`, language, signal),
        language,
      );
    } catch (e) {
      if (e instanceof ProviderError && e.code === "not-found") return null;
      throw e;
    }
  },

  async getSets(requestedLanguage, signal) {
    const language = languageOrEnglish(requestedLanguage);
    const raw = await get("/sets", language, signal);
    if (!Array.isArray(raw))
      throw new ProviderError("malformed", "Unexpected set list format");
    return raw.map((set: unknown) => normaliseTcgdexSet(set, language));
  },
};
