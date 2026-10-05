# CardBinder
Organise physical trading-card binders digitally. See `AGENTS.md` for current status and `docs/SPEC.md` for requirements.

## Run
```bash
npm install
cp .env.example .env.local   # optional: leave blank to use sample data for One Piece / sports
npm run dev                  # http://localhost:3000 (old prototype at /prototype.html)
npm test                     # vitest: normalisers + mock provider
npm run lint                 # tsc --noEmit
npm run build
```
`package.json` uses `latest` for dependencies; pin versions after your first successful install.

## Card providers
| Game | Provider | Needs | Notes |
|---|---|---|---|
| Pokémon | TCGdex (`tcgdex.ts`) | nothing | List results carry no set name/rarity; fetch a single card for those. |
| One Piece | tcgapi.dev (`tcgapi.ts`) | `ONE_PIECE_API_KEY`, `ONE_PIECE_GAME` | Free key = 100 req/day. Falls back to labelled sample data without both vars. |
| Sports/Topps | PriceCharting API (`sports.ts`) | `SPORTS_CARD_API_KEY` (paid) | Topps has no public API. No card images from this API; users can upload their own. Falls back to sample data. |

All providers sit behind `CardProvider` (`src/services/cards/types.ts`) and are called only from `/api/cards`.

## Known limitations
The app has never been installed or run, and providers have never been called live. Image uploads, binder customisation UI and most filters aren't built. See AGENTS.md for the full status and next steps.

## Architecture
`src/features/binders/logic.ts` (pure logic) > `src/features/store.tsx` (React state) > `src/repositories/binderRepository.ts` (localStorage, swappable for Supabase).
Card data: UI > `/api/cards` > `getProvider(game)` > provider > normaliser > `CardDefinition`. Collection items embed their `CardDefinition`.
