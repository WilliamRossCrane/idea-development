// Sports / Topps via the official PriceCharting API (paid API token). Docs: https://www.pricecharting.com/api-documentation
// Topps itself has no public card API and its site must not be scraped, so this is the legitimate route found.
// Verified from docs: GET /api/products?t=TOKEN&q=... -> { status, products: [{ id, "product-name", "console-name" }] }
//                     GET /api/product?t=TOKEN&id=...   -> single product. No images and no documented pagination.
// NOT verified: that sports cards are returned from this token/endpoint (a separate SportsCardsPro token may be needed).
import type { CardProvider } from "../types";
import { ProviderError, normalisePriceCharting } from "../normalise";

const BASE = "https://www.pricecharting.com/api";
async function get(path: string, signal?: AbortSignal): Promise<any> {
  const t = process.env.SPORTS_CARD_API_KEY;
  if (!t) throw new ProviderError("unavailable", "SPORTS_CARD_API_KEY not set");
  let res: Response;
  try { res = await fetch(`${BASE}${path}${path.includes("?") ? "&" : "?"}t=${encodeURIComponent(t)}`, { signal, next: { revalidate: 86400 } }); }
  catch (e) { if ((e as Error).name === "AbortError") throw e; throw new ProviderError("unavailable", "PriceCharting unreachable"); }
  if (!res.ok) throw new ProviderError("unavailable", `PriceCharting responded ${res.status}`);
  let json: any; try { json = await res.json(); } catch { throw new ProviderError("malformed", "Invalid JSON"); }
  if (json?.status !== "success") throw new ProviderError("unavailable", "PriceCharting returned an error status");
  return json;
}
export const priceChartingSports: CardProvider = {
  id: "pricecharting", game: "sports", isMock: false,
  async searchCards(q, signal) {
    const page = q.page ?? 1, size = q.pageSize ?? 24, f = q.filters ?? {};
    const term = [q.q, f.brand, f.year, f.sport].filter(Boolean).join(" "); // full-text covers set names, so filters narrow by keyword
    if (!term) return { cards: [], page, pageSize: size, hasMore: false, source: "api" };
    const json = await get(`/products?q=${encodeURIComponent(term)}`, signal);
    if (!Array.isArray(json.products)) throw new ProviderError("malformed", "Unexpected product list");
    const all = json.products.map(normalisePriceCharting); // no server pagination documented: page in memory
    return { cards: all.slice((page - 1) * size, page * size), page, pageSize: size, hasMore: all.length > page * size, source: "api" };
  },
  async getCard(id, signal) {
    try { return normalisePriceCharting(await get(`/product?id=${encodeURIComponent(id)}`, signal)); }
    catch (e) { if (e instanceof ProviderError && e.code === "not-found") return null; throw e; }
  },
  async getSets() { return []; },
};
