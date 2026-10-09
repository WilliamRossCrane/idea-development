import type { CardGame, CardProvider } from "../types";
import { tcgdexProvider } from "./tcgdex";
import { berryWalletOnePiece } from "./berrywallet";
import { tcgapiOnePiece } from "./tcgapi";
import { priceChartingSports } from "./sports";
import { mockOnePiece, mockSports } from "./mock";

/** Real provider when its API key is present, otherwise labelled sample data (results carry source: "mock"). */
export function getProvider(game: CardGame): CardProvider {
  switch (game) {
    case "pokemon":
      return tcgdexProvider;
    case "one-piece":
      if (process.env.BERRYWALLET_API_KEY) return berryWalletOnePiece;
      return process.env.ONE_PIECE_API_KEY ? tcgapiOnePiece : mockOnePiece;
    case "sports":
      return process.env.SPORTS_CARD_API_KEY ? priceChartingSports : mockSports;
  }
}
