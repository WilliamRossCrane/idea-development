// SAMPLE DATA ONLY. Not from any real API. Every result is tagged source: "mock".
import type { CardDefinition, CardGame, CardProvider } from "../types";

type Row = [id: string, name: string, set: string, num: string, rarity: string, extra: Record<string, string | number>];
const ONE_PIECE: Row[] = [
  ["op-luffy", "Monkey D. Luffy", "Sample Set A", "SA-001", "Leader", { color: "Red", cardType: "Leader" }],
  ["op-zoro", "Roronoa Zoro", "Sample Set A", "SA-025", "Rare", { color: "Green", cardType: "Character" }],
  ["op-nami", "Nami", "Sample Set A", "SA-016", "Rare", { color: "Blue", cardType: "Character" }],
  ["op-sanji", "Sanji", "Sample Set A", "SA-013", "Uncommon", { color: "Black", cardType: "Character" }],
  ["op-shanks", "Shanks", "Sample Set B", "SB-119", "Secret Rare", { color: "Red", cardType: "Character" }],
];
const SPORTS: Row[] = [
  ["sp-1", "Sample Striker", "Sample Football 2024", "#12", "Base", { sport: "Football", year: 2024, brand: "Sample Brand", team: "Sample FC", player: "Sample Striker" }],
  ["sp-2", "Sample Keeper", "Sample Football 2024", "#47", "Parallel /99", { sport: "Football", year: 2024, brand: "Sample Brand", team: "Sample United", player: "Sample Keeper" }],
  ["sp-3", "Sample Guard", "Sample Basketball 2023", "#7", "Rookie", { sport: "Basketball", year: 2023, brand: "Sample Brand", team: "Sample Hawks", player: "Sample Guard" }],
  ["sp-4", "Sample Pitcher", "Sample Baseball 2022", "#101", "Base", { sport: "Baseball", year: 2022, brand: "Sample Brand", team: "Sample Sox", player: "Sample Pitcher" }],
];
const toCard = (game: CardGame) => ([id, name, setName, cardNumber, rarity, extra]: Row): CardDefinition =>
  ({ id: `${game}:${id}`, providerId: id, game, name, setName, setId: setName, cardNumber, rarity, extra });

export function createMockProvider(game: CardGame, rows: Row[]): CardProvider {
  const cards = rows.map(toCard(game));
  return {
    id: `mock-${game}`, game, isMock: true,
    async searchCards(q) {
      const page = q.page ?? 1, size = q.pageSize ?? 24, needle = (q.q ?? "").toLowerCase();
      const hit = cards.filter(c =>
        (!needle || [c.name, c.setName, c.cardNumber, c.rarity, ...Object.values(c.extra ?? {})].join(" ").toLowerCase().includes(needle)) &&
        (!q.rarity || c.rarity === q.rarity) && (!q.setId || c.setId === q.setId) &&
        Object.entries(q.filters ?? {}).every(([k, v]) => String(c.extra?.[k]) === v));
      return { cards: hit.slice((page - 1) * size, page * size), page, pageSize: size, hasMore: hit.length > page * size, source: "mock" };
    },
    async getCard(id) { return cards.find(c => c.providerId === id) ?? null; },
    async getSets() { return [...new Set(cards.map(c => c.setName!))].map(n => ({ id: n, name: n, game })); },
  };
}
export const mockOnePiece = createMockProvider("one-piece", ONE_PIECE);
export const mockSports = createMockProvider("sports", SPORTS);
