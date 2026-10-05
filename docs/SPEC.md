# CardBinder spec (condensed from the original brief)

**Product:** digitally organise physical card binders; not a marketplace. One Piece, Pokémon, Topps/sports. Flow: choose collection > open binder > search library > drag card into slot > rearrange > save.
**Stack:** Next.js App Router, React, TS, Tailwind, dnd-kit, local persistence behind a repository layer (Supabase later), Vercel-compatible. No auth/Supabase/marketplace/valuations/scanning in V1.
**Layout:** narrow left sidebar (Home, Binders, Library, My Collection, Import, Settings; "Local collection" badge), main workspace header (binder name, game, search, page controls, actions). Desktop first; tablet library as drawer; mobile single page + tap-select-place.
**Dashboard:** my/recent binders, total cards organised, occupied slots, quick create.
**Binders:** many; name, category (One Piece/Pokémon/Topps-Sports/Mixed), size 9-pocket (model must allow 4/12), pages 10/20/30/40/custom. Page add, delete empty, duplicate layout, jump, prev/next, compact navigator. Overview mode with page thumbnails (page reordering if easy).
**Binder page:** 3x3 sleeve-like slots showing card art; empty slot "+ Add card" opens library.
**Drag/drop (dnd-kit):** library > slot, slot > slot, swap, reorder, across pages, remove, drop on remove/unassigned area; floating preview; subtle drop-target highlight; keyboard alternative.
**Library panel + full Library page:** art, name, set, number, rarity; collapsible; debounced search (name, set, number, player, character, rarity); game filters that disappear when a provider lacks the field (Pokémon: set/name/rarity/type/number; One Piece: set/character/colour/rarity/card type/number; Sports: sport/year/brand/set/player/team/number/parallel); pagination or infinite load; lazy images; thumbnails; skeletons.
**Detail modal:** large image, name, game, set, number, rarity, player/character, variant; "Add to binder" with binder picker.
**Data model:** `CardDefinition` (catalogue) vs `CollectionItem` (physical copy: condition, notes, custom image, status Owned/Wishlist/For Trade/Sold, quantity, acquired date, price). Duplicates allowed ("Owned x3", "Add another copy"). Condition: Mint, Near Mint, Excellent, Good, Played, Damaged, Graded (PSA/BGS/CGC/Other + grade).
**Collection screen:** All / In Binder / Unsorted / Wishlist / For Trade. Unsorted cards draggable into slots.
**Images:** binder cover/background/page background upload (replace/remove; cover/fit/position/opacity); presets Minimal, Dark, Cream, Black, Navy; custom image per collection item (never overwrites catalogue). Resize in browser, IndexedDB for blobs, storage warning, storage abstraction for later Supabase Storage.
**Providers:** `CardProvider { searchCards, getCard, getSets }`; TCGdex for Pokémon; real One Piece and sports providers if accessible else labelled mocks; secrets server-side only (`ONE_PIECE_API_KEY`, `SPORTS_CARD_API_KEY`); Next.js caching; request cancellation.
**Errors:** API unavailable, no results, missing image, malformed response, upload failure, storage failure, binder not found: friendly messages, no stack traces.
**A11y:** semantic buttons, labels, keyboard nav, focus states, accessible modals, alt text.
**Tests:** binder creation, 9 slots/page, place/move/swap/remove, duplicates, serialisation, provider normalisation.
**Roadmap (do not build yet):** V2 Supabase auth/sync/storage; V3 photo card identification; V4 prices and portfolio value.
