# CardBinder

Organise physical trading-card binders digitally. See `AGENTS.md` for current status and `docs/SPEC.md` for requirements.

## Run

```bash
npm install
npm run dev                  # http://localhost:3000 (old prototype at /prototype.html)
npm test                     # vitest
npm run lint                 # tsc --noEmit
npm run build
```

For live One Piece cards in English or Japanese, add `BERRYWALLET_API_KEY` to `.env.local`. BerryWallet's free tier is limited to 100 requests/hour and 1,000/day. Japanese card browsing is set-scoped. `ONE_PIECE_API_KEY` is retained as an English-only tcgapi.dev fallback. Without either key, One Piece and sports searches use clearly labelled sample data. Pokémon uses public TCGdex data without a key.

## Card providers

| Game           | Provider            | Coverage and requirements                                                                                                                                                                                                                                                                                                                                                           |
| -------------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pokémon        | TCGdex              | Public localized catalogs for English, Japanese, French, German, Spanish, Italian, Portuguese, Brazilian Portuguese, Korean, Chinese (Traditional/Simplified), Indonesian, Thai, and Dutch. Set lists and checklist counts are available. Cardmarket EUR and TCGplayer USD prices are shown as dated AUD estimates when present; Japanese quotes were not present in sampled cards. |
| One Piece      | BerryWallet         | English/Japanese sets and cards, per-printing TCGplayer USD and Cardmarket EUR quotes, images, and pagination. Requires `BERRYWALLET_API_KEY`; Japanese browse is set-scoped. Free tier: 100 requests/hour, 1,000/day.                                                                                                                                                              |
| One Piece      | tcgapi.dev fallback | Public English set metadata (127 sets verified); card search/set cards require `ONE_PIECE_API_KEY`.                                                                                                                                                                                                                                                                                 |
| Sports / Topps | PriceCharting       | Requires `SPORTS_CARD_API_KEY` (paid). Soccer/UFC product coverage, images, variants, and price fields have not been verified.                                                                                                                                                                                                                                                      |

Provider keys are server-only and must never use a `NEXT_PUBLIC_` prefix. This app has no marketplace features.

## Known limitations

BerryWallet is integrated but has not been live-tested with a key in this workspace. Topps Soccer/UFC coverage and an Australian-market price source are unverified. Foreign currency conversions are estimates, not Australian-market quotes. Check provider terms before launch; do not expose API keys, raw catalog exports, or a public provider proxy. See `AGENTS.md` for remaining work.

## Architecture

`src/features/binders/logic.ts` (pure logic) > `src/features/store.tsx` (React state) > `src/repositories/binderRepository.ts` (localStorage, swappable for Supabase).
Card data: UI > `/api/cards` > `getProvider(game)` > provider > normaliser > `CardDefinition`. Provider prices are returned separately from card identity.
