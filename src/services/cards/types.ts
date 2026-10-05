export type CardGame = "pokemon" | "one-piece" | "sports";

/** Normalised card. The rest of the app only ever sees this, never a raw provider response. */
export interface CardDefinition {
  id: string;            // `${game}:${providerId}`, globally unique
  providerId: string;    // id inside the upstream provider
  game: CardGame;
  name: string;
  setId?: string;
  setName?: string;
  cardNumber?: string;
  rarity?: string;
  imageUrl?: string;     // large
  thumbUrl?: string;     // small, used in grids
  extra?: Record<string, string | number | undefined>; // game-specific: color, cardType, player, team, year…
}
export interface CardSet { id: string; name: string; game: CardGame; cardCount?: number; logoUrl?: string }
export interface CardSearchQuery {
  q?: string; setId?: string; rarity?: string; page?: number; pageSize?: number;
  filters?: Record<string, string>; // game-specific, e.g. { color: "Red", sport: "Football" }
}
export interface CardSearchResult {
  cards: CardDefinition[]; page: number; pageSize: number; hasMore: boolean;
  source: "api" | "mock"; // lets the UI label sample data honestly
}
export interface CardProvider {
  id: string; game: CardGame; isMock: boolean;
  searchCards(q: CardSearchQuery, signal?: AbortSignal): Promise<CardSearchResult>;
  getCard(providerId: string, signal?: AbortSignal): Promise<CardDefinition | null>;
  getSets(signal?: AbortSignal): Promise<CardSet[]>;
}
