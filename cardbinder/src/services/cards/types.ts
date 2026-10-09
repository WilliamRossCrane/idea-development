export type CardGame = "pokemon" | "one-piece" | "sports";
export type OnePieceLanguage = "en" | "ja";
export const ONE_PIECE_LANGUAGES: { code: OnePieceLanguage; name: string }[] = [
  { code: "en", name: "English" },
  { code: "ja", name: "Japanese" },
];
export type PokemonLanguage =
  | "en"
  | "ja"
  | "fr"
  | "de"
  | "es"
  | "it"
  | "pt"
  | "pt-br"
  | "ko"
  | "zh-tw"
  | "zh-cn"
  | "id"
  | "th"
  | "nl";

export const POKEMON_LANGUAGES: { code: PokemonLanguage; name: string }[] = [
  { code: "en", name: "English" },
  { code: "ja", name: "Japanese" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "es", name: "Spanish" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "pt-br", name: "Brazilian Portuguese" },
  { code: "ko", name: "Korean" },
  { code: "zh-tw", name: "Chinese (Traditional)" },
  { code: "zh-cn", name: "Chinese (Simplified)" },
  { code: "id", name: "Indonesian" },
  { code: "th", name: "Thai" },
  { code: "nl", name: "Dutch" },
];

export const PRINTING_LABELS: Record<string, string> = {
  normal: "Normal",
  reverse: "Reverse holo",
  holo: "Holo",
  firstEdition: "1st edition",
  wPromo: "Promo",
};

/** Normalised card. The rest of the app only ever sees this, never a raw provider response. */
export interface CardDefinition {
  id: string; // `${game}:${providerId}`, globally unique
  providerId: string; // id inside the upstream provider
  game: CardGame;
  name: string;
  language?: string;
  setId?: string;
  setName?: string;
  cardNumber?: string;
  rarity?: string;
  imageUrl?: string; // large
  thumbUrl?: string; // small, used in grids
  printings?: string[];
  extra?: Record<string, string | number | undefined>; // game-specific: color, cardType, player, team, year…
}
export interface CardSet {
  id: string;
  name: string;
  game: CardGame;
  language?: string;
  cardCount?: number;
  officialCardCount?: number;
  totalCardCount?: number;
  logoUrl?: string;
}
export interface CardPriceQuote {
  source: string;
  currency: string;
  printing: string;
  amount: number;
  lowPrice?: number;
  updatedAt?: string;
}
export interface AudPriceQuote extends CardPriceQuote {
  audEstimate?: number;
  exchangeRate?: number;
  exchangeRateDate?: string;
}
export interface CardDetails {
  card: CardDefinition;
  prices: CardPriceQuote[];
}
export interface CardDetailsResponse {
  card: CardDefinition;
  prices: AudPriceQuote[];
}
export interface CardSearchQuery {
  q?: string;
  setId?: string;
  rarity?: string;
  page?: number;
  pageSize?: number;
  language?: string;
  filters?: Record<string, string>; // game-specific, e.g. { color: "Red", sport: "Football" }
}
export interface CardSearchResult {
  cards: CardDefinition[];
  page: number;
  pageSize: number;
  hasMore: boolean;
  total?: number;
  source: "api" | "mock"; // lets the UI label sample data honestly
}
export interface CardProvider {
  id: string;
  game: CardGame;
  isMock: boolean;
  searchCards(
    q: CardSearchQuery,
    signal?: AbortSignal,
  ): Promise<CardSearchResult>;
  getCard(
    providerId: string,
    signal?: AbortSignal,
    language?: string,
  ): Promise<CardDetails | null>;
  getSets(language?: string, signal?: AbortSignal): Promise<CardSet[]>;
}
