// One Piece via tcgapi.dev (key required; free tier is 100 requests/day). Docs: https://tcgapi.dev/api
// Verified from docs: base https://api.tcgapi.dev/v1, header X-API-Key, GET /search?q=&game=, GET /cards/{id}, response { data: [...] }.
// NOT verified: the One Piece game slug (so it is configured via ONE_PIECE_GAME), the `rarity` filter name, set-browse paths.
import type { CardProvider } from "../types";
import { ProviderError, normaliseTcgapiCard } from "../normalise";

const BASE = "https://api.tcgapi.dev/v1";
async function get(path: string, signal?: AbortSignal): Promise<any> {
  const key = process.env.ONE_PIECE_API_KEY;
  if (!key) throw new ProviderError("unavailable", "ONE_PIECE_API_KEY not set");
  let res: Response;
  try { res = await fetch(BASE + path, { headers: { "X-API-Key": key }, signal, next: { revalidate: 86400 } }); }
  catch (e) { if ((e as Error).name === "AbortError") throw e; throw new ProviderError("unavailable", "tcgapi.dev unreachable"); }
  if (res.status === 404) throw new ProviderError("not-found", "Not found");
  if (!res.ok) throw new ProviderError("unavailable", `tcgapi.dev responded ${res.status}`); // 401 bad key, 429 rate limit
  try { return await res.json(); } catch { throw new ProviderError("malformed", "Invalid JSON"); }
}
const isCard = (c: any) => c?.product_type === undefined || c.product_type === "Cards"; // skip sealed products

export const tcgapiOnePiece: CardProvider = {
  id: "tcgapi", game: "one-piece", isMock: false,
  async searchCards(q, signal) {
    const page = q.page ?? 1, size = q.pageSize ?? 24;
    // TODO: browse without a query (needs the sets/cards endpoints; confirm paths in the docs first).
    if (!q.q) return { cards: [], page, pageSize: size, hasMore: false, source: "api" };
    const p = [`q=${encodeURIComponent(q.q)}`, `game=${encodeURIComponent(process.env.ONE_PIECE_GAME ?? "")}`, `per_page=${size}`, `page=${page}`];
    if (q.rarity) p.push(`rarity=${encodeURIComponent(q.rarity)}`);
    const raw = await get(`/search?${p.join("&")}`, signal);
    if (!Array.isArray(raw?.data)) throw new ProviderError("malformed", "Unexpected search format");
    return { cards: raw.data.filter(isCard).map((c: unknown) => normaliseTcgapiCard(c, "one-piece")),
      page, pageSize: size, hasMore: Boolean(raw.meta?.has_more), source: "api" };
  },
  async getCard(id, signal) {
    try { return normaliseTcgapiCard((await get(`/cards/${encodeURIComponent(id)}`, signal))?.data, "one-piece"); }
    catch (e) { if (e instanceof ProviderError && e.code === "not-found") return null; throw e; }
  },
  async getSets() { return []; }, // TODO once the sets endpoint is confirmed
};
