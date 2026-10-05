# CardBinder: brief for coding agents (Codex etc.)

## What this is
A web app for digitally organising physical trading-card binders (9-pocket pages, 3x3). Games: One Piece, Pokémon, Topps/sports.
Core experience: find a card, drag it into the exact binder pocket, organise a real collection visually.
NOT a marketplace. Full requirements: `docs/SPEC.md`.

## Target stack
Next.js (App Router) + React + TypeScript + Tailwind + dnd-kit. Local persistence now (localStorage for metadata, IndexedDB for image blobs)
behind `src/repositories/binderRepository.ts` so Supabase can replace it later. Vercel-compatible. No auth, no backend DB in V1.
Design: Claude/Linear/Notion-like. Warm neutrals, subtle borders, rounded panels, no gaming UI. Original identity, don't copy Claude.

## Status (honest)
Nothing in this repo has been `npm install`ed, built, linted or run in a browser. Written in an offline sandbox.
Only the pure logic was executed: `src/features/binders/logic.ts` + `logic.test.ts` passed 15/15 (compiled with tsc, run under a vitest shim).

| Area | State |
|---|---|
| `src/features/binders/logic.ts` (+ test) | DONE and run. Create binder, 9 slots/page, place/move/swap/remove (one `placeItem`), page add/delete-empty/duplicate-layout/reorder, compact navigator, duplicates, (de)serialisation. |
| `src/repositories/binderRepository.ts` | Written, type-checked only. `LocalBinderRepository` (localStorage), behind a `BinderRepository` interface for a future Supabase swap. |
| `src/features/store.tsx` | Written, NOT run. In-memory state + diff-based persistence through the repository. Hosts the card detail modal. |
| UI: dashboard, all-binders + create dialog, binder workspace (dnd-kit: library>slot, slot>slot swap, cross-page via page buttons, remove zone, drag overlay, tap-to-select-then-place, keyboard sensor), page navigator/jump, overview with page reorder buttons, library page, collection page (All / In binder / Unsorted / Wishlist / For Trade, status + condition), card modal, skeletons, friendly errors | Written, NOT run. Expect small compile/runtime fixes on first `npm run dev`. |
| Providers (`src/services/cards`) | TCGdex (Pokémon), tcgapi.dev (One Piece, needs `ONE_PIECE_API_KEY` + `ONE_PIECE_GAME`), PriceCharting (sports/Topps, paid `SPORTS_CARD_API_KEY`), labelled mocks as fallback. Written from docs, NEVER called live. Unverified: One Piece game slug / `rarity` param / `custom_attributes` keys; sports coverage and "Name #12 [Variant]" title format. |
| `public/prototype.html` | Older single-file vanilla prototype. Has features the React app lacks (see below). Reference only. |

## NOT built yet (do these next)
1. First run: `npm install`, `npm run lint`, `npm test`, `npm run build`, `npm run dev`; fix what breaks (pin dependency versions afterwards).
2. Image uploads: binder cover/background/page background (cover/fit/position/opacity), custom image per collection item. Prototype has a working IndexedDB + resize implementation to port into `src/services/images/`. `CollectionItem.customImageKey` and `Binder.appearance` already exist in the model.
3. Binder customisation UI (title edit, accent, presets Minimal/Dark/Cream/Black/Navy). Appearance accent is only set at creation (default).
4. Filters beyond game + client-side rarity (set, type, colour, sport, year, brand...). `CardSearchQuery.filters` and the providers already accept them; the library UI doesn't send them.
5. Collection item editing beyond status/condition (notes, graded details, acquired date, price, quantity).
6. Responsive polish: library as a drawer on tablet; test touch dragging (tiles use `touch-none`; tap-to-place is the fallback).
7. Import and Settings pages (sidebar shows them disabled), README screenshots, Vercel deploy check.
8. Verify real One Piece / sports providers with real keys; adjust normalisers and tests to the actual responses.

## Rules
- Never expose API keys client-side. Providers run only in server code (`/api/cards`).
- UI talks to `CardDefinition` only, never raw provider objects. Add new providers behind `CardProvider`.
- Don't invent API endpoints; read docs. Don't scrape Topps.com or Bandai.
- Mock data must stay clearly separate and labelled; UI should show when results are sample data.
- Separate `CardDefinition` (catalogue) from `CollectionItem` (a physical copy, with optional condition/notes/custom image). Duplicates allowed.
- Drag-and-drop must have a keyboard / tap-to-place alternative.
- Don't create files just to have files.

## Suggested next steps (in order)
1. Install, typecheck, run tests, hit `/api/cards?game=pokemon&q=pikachu` and fix any provider mismatch.
2. Pure binder logic (`src/features/binders/`): create binder, 9 slots/page, place/move/swap/remove, copies, serialisation, with vitest tests. Prototype's `place()` shows the intended semantics.
3. `binderRepository.ts` (localStorage) + image storage abstraction (IndexedDB, resize to ~900px).
4. UI: sidebar layout, dashboard, binder workspace with dnd-kit, library panel with debounced search + skeletons, collection/unsorted, card modal.
5. Verify real One Piece / sports providers with real keys; adjust normalisers + tests to actual responses.
6. README screenshots, Vercel deploy notes.
