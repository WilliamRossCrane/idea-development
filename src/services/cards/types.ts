export type CardGame = "pokemon" | "one-piece" | "sports";
export type PokemonLanguage = "en" | "ja" | "fr" | "de" | "es" | "it" | "pt" | "pt-br" | "ko" | "zh-tw" | "zh-cn" | "id" | "th" | "nl";

export const POKEMON_LANGUAGES: { code: PokemonLanguage; name: string }[] = [
  { code: "en", name: "English" }, { code: "ja", name: "Japanese" }, { code: "fr", name: "French" },
  { code: "de", name: "German" }, { code: "es", name: "Spanish" }, { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" }, { code: "pt-br", name: "Brazilian Portuguese" }, { code: "ko", name: "Korean" },
  { code: "zh-tw", name: "Chinese (Traditional)" }, { code: "zh-cn", name: "Chinese (Simplified)" },
  { code: "id", name: "Indonesian" }, { code: "th", name: "Thai" }, { code: "nl", name: "Dutch" },
];

/** Normalised card. The rest of the app only ever sees this, never a raw provider response. */
export interface CardDefinition {
  id: string;            // `${game}:${providerId}`, globally unique
  providerId: string;    // id inside the upstream provider
  game: CardGame;
  name: string;
  language?: string;
  setId?: string;
  setName?: string;
  cardNumber?: string;
  rarity?: string;
  imageUrl?: string;     // large
  thumbUrl?: string;     // small, used in grids
  printings?: string[];
  extra?: Record<string, string | number | undefined>; // game-specific: color, cardType, player, team, year…
}
export interface CardSet {
  id: string; name: string; game: CardGame; language?: string; cardCount?: number;
  officialCardCount?: number; totalCardCount?: number; logoUrl?: string;
}
export interface CardSearchQuery {
  q?: string; setId?: string; rarity?: string; page?: number; pageSize?: number;
  language?: string;
  filters?: Record<string, string>; // game-specific, e.g. { color: "Red", sport: "Football" }
}
export interface CardSearchResult {
  cards: CardDefinition[]; page: number; pageSize: number; hasMore: boolean;
  source: "api" | "mock"; // lets the UI label sample data honestly
}
export interface CardProvider {
  id: string; game: CardGame; isMock: boolean;
  searchCards(q: CardSearchQuery, signal?: AbortSignal): Promise<CardSearchResult>;
  getCard(providerId: string, signal?: AbortSignal, language?: string): Promise<CardDefinition | null>;
  getSets(language?: string, signal?: AbortSignal): Promise<CardSet[]>;
}
