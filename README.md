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

For live One Piece card search, add `ONE_PIECE_API_KEY` to `.env.local`; the game slug defaults to `one-piece-card-game`. Without a key, One Piece and sports searches use clearly labelled sample data. Pokémon uses public TCGdex data without a key.

## Card providers

| Game           | Provider      | Coverage and requirements                                                                                                                                                                                                                                                                                                                                                           |
| -------------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pokémon        | TCGdex        | Public localized catalogs for English, Japanese, French, German, Spanish, Italian, Portuguese, Brazilian Portuguese, Korean, Chinese (Traditional/Simplified), Indonesian, Thai, and Dutch. Set lists and checklist counts are available. Cardmarket EUR and TCGplayer USD prices are shown as dated AUD estimates when present; Japanese quotes were not present in sampled cards. |
| One Piece      | tcgapi.dev    | Public English-named set metadata is browsable (127 sets verified). Card search/set cards require `ONE_PIECE_API_KEY`; the API slug defaults to `one-piece-card-game`. No Japanese One Piece catalog was verified. OPTCGAPI documents English OP-01 through OP-15 and starter decks only.                                                                                           |
| Sports / Topps | PriceCharting | Requires `SPORTS_CARD_API_KEY` (paid). Soccer/UFC product coverage, images, variants, and price fields have not been verified.                                                                                                                                                                                                                                                      |

Provider keys are server-only and must never use a `NEXT_PUBLIC_` prefix. This app has no marketplace features.

## Known limitations

Japanese One Piece still needs a verified, licensed catalog source. Topps Soccer/UFC coverage and an Australian-market price source are unverified. Foreign currency conversions are estimates, not Australian-market quotes. See `AGENTS.md` for implementation status and remaining work.

## Architecture

`src/features/binders/logic.ts` (pure logic) > `src/features/store.tsx` (React state) > `src/repositories/binderRepository.ts` (localStorage, swappable for Supabase).
Card data: UI > `/api/cards` > `getProvider(game)` > provider > normaliser > `CardDefinition`. Provider prices are returned separately from card identity.
