# CardBinder: brief for coding agents (Codex etc.)

## What this is

A web app for digitally organising physical trading-card binders (9-pocket pages, 3x3). Games: One Piece, Pokémon, Topps/sports.
Core experience: find a card, drag it into the exact binder pocket, organise a real collection visually.
NOT a marketplace. Full requirements: `docs/SPEC.md`.

## Target stack

Next.js (App Router) + React + TypeScript + Tailwind + dnd-kit. Local persistence now (localStorage for metadata, IndexedDB for image blobs)
behind `src/repositories/binderRepository.ts` so Supabase can replace it later. Vercel-compatible. No auth, no backend DB in V1.
Design: Claude/Linear/Notion-like. Warm neutrals, subtle borders, rounded panels, no gaming UI. Original identity, don't copy Claude.

## Status (checked 2026-10-05)

The project is installed, linted, tested, built, and has been checked in a browser. Git was initialized locally; implementation is committed in small milestones.

| Area                                                              | State                                                                                                                                                                                                                                                                                                                                                                 |
| ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Build and tests                                                   | `npm run lint`, `npm test`, and `npm run build` pass. Browser checks covered binder create/search/drag/swap/page/reload persistence and Pokémon locale/set/printing/price flows.                                                                                                                                                                                      |
| `src/features/binders/logic.ts` (+ test)                          | Create binder, 9 slots/page, place/move/swap/remove, page management, duplicates, serialization; collection copies retain selected printing.                                                                                                                                                                                                                          |
| `src/repositories/binderRepository.ts` / `src/features/store.tsx` | LocalStorage metadata persistence behind `BinderRepository`; binder and collection persistence was browser-checked.                                                                                                                                                                                                                                                   |
| Library                                                           | Pokémon locale selector, provider set lists/checklist counts, owned-card progress, and physical-printing selection are implemented. Set progress counts distinct owned/for-trade cards, not wishlist/sold copies.                                                                                                                                                     |
| Pokémon provider                                                  | TCGdex locale catalogs and set counts are live and verified (including Japanese). English TCGplayer USD and Cardmarket EUR quotes are shown as dated AUD estimates; sampled Japanese cards had no price data.                                                                                                                                                         |
| One Piece provider                                                | BerryWallet adapter supports documented `en`/`jp` sets, set-scoped cards, images, and TCGplayer/Cardmarket quotes; uses `BERRYWALLET_API_KEY`. Japanese search is set-scoped because global search has no documented language parameter. No BerryWallet key is configured here, so Japanese requests report the key requirement. TCG API remains an English fallback. |
| Sports provider                                                   | PriceCharting adapter exists but is unverified. No configured key; Topps Soccer/UFC coverage, variants, images, and price fields are not confirmed.                                                                                                                                                                                                                   |
| `public/prototype.html`                                           | Older single-file vanilla prototype. Has features the React app lacks (see below). Reference only.                                                                                                                                                                                                                                                                    |

## Remaining catalog work

1. Configure `BERRYWALLET_API_KEY` locally and live-verify English/Japanese sets, card details, images, quote fields, pricing freshness, and quotas; confirm data/image terms before launch and never expose raw exports.
2. Confirm whether BerryWallet set totals/cards account for all parallel printings and promos in each Japanese checklist.
3. Verify licensed Topps Soccer and UFC catalog/pricing coverage and an Australian-market price feed. Keep foreign-currency conversions labeled as estimates.
4. Add provider fixtures and coverage reports for missing/duplicate cards, promos, variants, pagination, and price freshness before claiming set completeness.
5. Image uploads, binder customization, advanced sport filters, richer collection metadata, responsive polish, import/settings pages, screenshots, and deployment verification remain unbuilt.

## Rules

- Never expose API keys client-side. Providers run only in server code (`/api/cards`).
- UI talks to `CardDefinition` only, never raw provider objects. Add new providers behind `CardProvider`.
- Don't invent API endpoints; read docs. Don't scrape Topps.com or Bandai.
- Mock data must stay clearly separate and labelled; UI should show when results are sample data.
- Separate `CardDefinition` (catalogue) from `CollectionItem` (a physical copy, with optional condition/notes/custom image). Duplicates allowed.
- Drag-and-drop must have a keyboard / tap-to-place alternative.
- Don't create files just to have files.

## Suggested next steps (in order)

1. Add `BERRYWALLET_API_KEY` to `.env.local` locally and live-check Japanese/English set cards, image URLs, variants, pricing freshness, and quota behavior.
2. Confirm BerryWallet storage/image terms before launch; keep the key server-side and do not expose raw catalog exports.
3. Verify PriceCharting coverage for Topps Soccer/UFC and find an Australian-market quote source.
4. Add completeness reports and fixtures for promos, reprints, alternate art, variants, and missing price/image data before claiming set completeness.
5. Image uploads, binder customization, advanced sport filters, richer collection metadata, responsive polish, import/settings pages, screenshots, and deploy verification remain future work.
