// One Piece via tcgapi.dev (key required; free tier is 100 requests/day). Docs: https://tcgapi.dev/api
// Verified from docs: base https://api.tcgapi.dev/v1, header X-API-Key, GET /search?q=&game=, GET /cards/{id}, response { data: [...] }.
// NOT verified: the One Piece game slug (so it is configured via ONE_PIECE_GAME), the `rarity` filter name, set-browse paths.
import type { CardProvider } from "../types";
import { ProviderError, normaliseTcgapiCard, normaliseTcgapiSet } from "../normalise";

const BASE = "https://api.tcgapi.dev/v1";
const GAME = process.env.ONE_PIECE_GAME || "one-piece-card-game";

async function request(path: string, signal?: AbortSignal, headers?: HeadersInit): Promise<any> {
  let res: Response;
  try {
    res = await fetch(BASE + path, {
      headers,
      signal,
      next: { revalidate: 86400 },
    });
  } catch (e) {
    if ((e as Error).name === "AbortError") throw e;
    throw new ProviderError("unavailable", "tcgapi.dev unreachable");
  }
  if (res.status === 404) throw new ProviderError("not-found", "Not found");
  if (!res.ok)
    throw new ProviderError(
      "unavailable",
      `tcgapi.dev responded ${res.status}`,
    ); // 401 bad key, 429 rate limit
  try {
    return await res.json();
  } catch {
    throw new ProviderError("malformed", "Invalid JSON");
  }
}
async function get(path: string, signal?: AbortSignal): Promise<any> {
  const key = process.env.ONE_PIECE_API_KEY;
  if (!key) throw new ProviderError("unavailable", "ONE_PIECE_API_KEY not set");
  return request(path, signal, { "X-API-Key": key });
}
const getPublic = (path: string, signal?: AbortSignal) => request(path, signal);
const isCard = (c: any) =>
  c?.product_type === undefined || c.product_type === "Cards"; // skip sealed products

export const tcgapiOnePiece: CardProvider = {
  id: "tcgapi",
  game: "one-piece",
  isMock: false,
  async searchCards(q, signal) {
    const page = q.page ?? 1,
      size = q.pageSize ?? 24;
    if ((!q.q || q.q.length < 2) && !q.setId)
      return { cards: [], page, pageSize: size, hasMore: false, source: "api" };
    let raw: any;
    const browsingSet = Boolean(q.setId && (!q.q || q.q.length < 2));
    if (browsingSet && q.setId) {
      raw = await get(`/sets/${encodeURIComponent(q.setId)}/cards?per_page=${size}&page=${page}`, signal);
    } else {
      const p = [
        `q=${encodeURIComponent(q.q!)}`,
        `game=${encodeURIComponent(GAME)}`,
        `per_page=${size}`,
        `page=${page}`,
      ];
      if (q.setId) p.push(`set_id=${encodeURIComponent(q.setId)}`);
      if (q.rarity) p.push(`rarity=${encodeURIComponent(q.rarity)}`);
      raw = await get(`/search?${p.join("&")}`, signal);
    }
    if (!Array.isArray(raw?.data))
      throw new ProviderError("malformed", "Unexpected search format");
    const cards = raw.data
        .filter(isCard)
        .map((c: unknown) => normaliseTcgapiCard(c, "one-piece"))
        .filter((card: any) => !q.q || card.name.toLowerCase().includes(q.q.toLowerCase()))
        .map((card: any) => q.setId && !card.setId ? { ...card, setId: q.setId } : card);
    return {
      cards,
      page,
      pageSize: size,
      hasMore: Boolean(raw.meta?.has_more),
      source: "api",
    };
  },
  async getCard(id, signal) {
    try {
      const card = normaliseTcgapiCard(
        (await get(`/cards/${encodeURIComponent(id)}`, signal))?.data,
        "one-piece",
      );
      return { card, prices: [] };
    } catch (e) {
      if (e instanceof ProviderError && e.code === "not-found") return null;
      throw e;
    }
  },
  async getSets(_language, signal) {
    const sets = [];
    let page = 1, hasMore = true;
    while (hasMore && page <= 20) {
      const raw = await getPublic(`/games/${encodeURIComponent(GAME)}/sets?per_page=100&page=${page}`, signal);
      if (!Array.isArray(raw?.data)) throw new ProviderError("malformed", "Unexpected set list format");
      sets.push(...raw.data.map(normaliseTcgapiSet));
      hasMore = Boolean(raw.meta?.has_more);
      page += 1;
    }
    if (hasMore) throw new ProviderError("malformed", "One Piece set list exceeded the pagination limit");
    return sets;
  },
};
