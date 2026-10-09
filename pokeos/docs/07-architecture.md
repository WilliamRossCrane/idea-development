# PokéOS Architecture

> **Version:** 0.2.0  
> **Status:** Draft  
> **Last Updated:** 4 July 2026

---

# Purpose

This document defines the Phase 1 software architecture for PokéOS.

The goal is to keep the architecture simple, maintainable and realistic for the first version of the app.

PokéOS should be built as a full-stack web application that can grow over time without becoming overcomplicated too early.

---

# Architecture Goals

PokéOS should be:

- Simple to build
- Easy to maintain
- Modular
- Type-safe
- Fast
- Secure
- Mobile-friendly
- Easy to deploy

The first version should focus on building a strong foundation rather than supporting every future feature immediately.

---

# High-Level Architecture

```text
Users
  │
  ├── Desktop Web
  └── Mobile Web
          │
          ▼
Next.js Application
          │
          ├── App Router
          ├── Server Components
          ├── Client Components
          ├── Server Actions
          └── Route Handlers
          │
          ▼
Application Logic
          │
          ├── Authentication
          ├── Dashboard
          ├── Pokédex
          ├── Team Builder
          ├── TCG Tracker
          ├── Profile
          └── Settings
          │
          ▼
Data Layer
          │
          ├── PostgreSQL
          ├── Prisma
          ├── PokéAPI
          └── Pokémon TCG API
```

---

# Architecture Style

PokéOS will use a **modular monolith** architecture.

This means the app will be built as one main application, but the code will be organised into clear feature areas.

This is the best fit for Phase 1 because it is:

- Easier to build
- Easier to deploy
- Easier to debug
- Easier to manage as a solo developer
- Still scalable enough for future growth

PokéOS does not need microservices in Phase 1.

---

# Application Layers

## Presentation Layer

The presentation layer is everything the user sees and interacts with.

Includes:

- Pages
- Layouts
- Cards
- Buttons
- Navigation
- Forms
- Dashboard widgets
- Mobile views

Technology:

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Custom components

---

## Feature Layer

The feature layer contains the main PokéOS product areas.

Phase 1 features:

- Dashboard
- Pokédex
- Team Builder
- TCG Tracker / TCG Vault
- Profile
- Settings

Each feature should have its own folder inside `src/features/`.

Example:

```text
src/features/
├── dashboard/
├── pokedex/
├── team-builder/
├── tcg-vault/
├── profile/
└── settings/
```

Each feature can contain:

```text
components/
actions.ts
queries.ts
types.ts
utils.ts
```

---

## Application Logic Layer

The application logic layer handles the rules of the app.

Examples:

- Creating a team
- Updating a profile
- Adding a card to a collection
- Calculating collection progress
- Building a team snapshot
- Creating recent activity items

This logic should stay separate from UI components where possible.

---

## Data Layer

The data layer stores and retrieves app data.

Technology:

- PostgreSQL
- Prisma

The database will store:

- Users
- Trainer profiles
- User settings
- Teams
- Team members
- TCG collections
- Activity logs
- Cached Pokémon data
- Cached TCG data

Database design is documented in:

```text
docs/08-database.md
```

---

## External API Layer

PokéOS will use external APIs for reference data.

Phase 1 APIs:

- PokéAPI
- Pokémon TCG API

PokéAPI will provide:

- Pokémon names
- Types
- Stats
- Abilities
- Evolutions
- Sprites/images where appropriate

Pokémon TCG API will provide:

- Card data
- Set data
- Card images
- Rarity
- Artist
- Market-related data where available

API research is documented in:

```text
docs/09-api-research.md
```

---

# Phase 1 Modules

PokéOS Phase 1 should include only the core modules.

```text
PokéOS
│
├── Authentication
├── Dashboard
├── Pokédex
├── Team Builder
├── TCG Tracker
├── Profile
└── Settings
```

Future modules should not be added until needed.

Do not build Phase 1 architecture around:

- Pokémon GO
- Marketplace
- Community
- Quest system
- Achievements
- AI features
- Native mobile app

These can be added later.

---

# Recommended Folder Structure

PokéOS should use a `src/` based Next.js structure.

```text
POKEOS/
├── src/
│   ├── app/
│   ├── components/
│   ├── features/
│   ├── lib/
│   └── types/
│
├── prisma/
├── public/
├── design/
├── docs/
├── README.md
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
├── components.json
└── .env.example
```

---

# src/app/

The `src/app/` folder contains the Next.js App Router.

Example:

```text
src/app/
├── layout.tsx
├── page.tsx
├── dashboard/
├── pokedex/
├── teams/
├── tcg/
├── profile/
├── settings/
└── api/
```

Use this folder for:

- Routes
- Layouts
- Pages
- Loading states
- Error states
- API route handlers

---

# src/components/

The `src/components/` folder contains reusable components.

Example:

```text
src/components/
├── ui/
├── layout/
└── shared/
```

## src/components/ui/

Basic reusable UI components.

Examples:

- Button
- Card
- Input
- Badge
- Dialog
- Tabs
- Progress

This is where shadcn/ui components should live.

---

## src/components/layout/

Layout components.

Examples:

- App Shell
- Sidebar
- Topbar
- Mobile Navigation
- Page Container

---

## src/components/shared/

Shared application components.

Examples:

- Search Bar
- Avatar
- Loading State
- Empty State
- Error State

---

# src/features/

The `src/features/` folder contains feature-specific code.

Example:

```text
src/features/
├── dashboard/
├── pokedex/
├── team-builder/
├── tcg-vault/
├── profile/
└── settings/
```

Feature-specific components should stay inside their feature folder unless they are reused across the app.

---

# src/lib/

The `src/lib/` folder contains shared utilities and configuration.

Example:

```text
src/lib/
├── db.ts
├── auth.ts
├── utils.ts
├── validations.ts
└── constants.ts
```

Use this folder for shared code that does not belong to one specific feature.

---

# Authentication

Authentication will be handled by Clerk.

Authentication should support:

- Sign up
- Login
- Logout
- Sessions
- Google login
- GitHub login
- Protected routes

PokéOS should store local user data in the database using the Clerk user ID.

Passwords should never be stored directly in the PokéOS database.

---

# Database

PokéOS will use PostgreSQL with Prisma.

Phase 1 database models:

- User
- TrainerProfile
- UserSettings
- Pokemon
- PokemonEvolution
- PokemonTeam
- PokemonTeamMember
- TcgSet
- TcgCard
- UserTcgCard
- ActivityLog

The database should stay simple during Phase 1.

Future tables should only be added when the feature is ready to build.

---

# API Strategy

PokéOS will use:

- Server Actions for simple mutations
- Route Handlers for API-style endpoints
- External APIs for Pokémon and TCG reference data

## Internal Data

Internal data includes:

- User profiles
- Teams
- Collections
- Settings
- Activity logs

This data belongs to PokéOS and should be stored in PostgreSQL.

## External Data

External data includes:

- Pokémon reference data
- TCG card data
- TCG set data

This data should be fetched from external APIs and cached locally where useful.

---

# State Management

Phase 1 should keep state management simple.

Start with:

- React state
- Server Components
- Server Actions
- URL search params where useful

Do not add global state libraries unless needed.

## Add Later If Needed

TanStack Query may be added later for complex client-side server state.

Zustand may be added later for complex UI state.

Do not add them on day one unless there is a clear reason.

---

# File Storage

Phase 1 should avoid complex file storage.

For now:

- Use external image URLs from APIs where appropriate.
- Use `public/` for local placeholder images and icons.
- Avoid user uploads until they are required.

Future options:

- Vercel Blob
- UploadThing
- Supabase Storage

---

# Security

Security principles:

- Use Clerk for authentication.
- Protect private routes.
- Validate all form inputs.
- Store secrets in environment variables.
- Never commit API keys.
- Use server-side code for sensitive operations.
- Keep database access on the server.
- Use HTTPS in production.

---

# Performance

PokéOS should prioritise:

- Fast page loads
- Clean layouts
- Optimised images
- Cached external data
- Minimal unnecessary client-side JavaScript
- Efficient database queries

Do not over-optimise too early.

Build cleanly first, then improve performance where needed.

---

# Testing Strategy

Testing should be added gradually.

## Early Phase 1

Manual testing is acceptable while building the first screens.

## Later Phase 1

Add unit tests for important logic.

Examples:

- Collection progress calculation
- Team validation
- Type coverage logic
- Form validation schemas

Recommended tool:

- Vitest

## Before Public Release

Add end-to-end tests for important user flows.

Examples:

- User can log in
- User can create a team
- User can add a card to collection
- User can update profile

Recommended tool:

- Playwright

---

# Deployment

## Development

Run locally during development.

## Production

Deploy to Vercel.

## Database

Use a managed PostgreSQL provider such as:

- Neon
- Supabase

## Version Control

Use GitHub.

## CI/CD

Use Vercel’s GitHub integration first.

GitHub Actions can be added later if needed.

---

# Architecture Principles

PokéOS should follow these principles:

- Keep the app simple first.
- Build as a modular monolith.
- Keep features separated.
- Keep shared components reusable.
- Keep database access on the server.
- Validate data before saving it.
- Avoid adding tools before they are needed.
- Keep documentation updated as decisions change.

---

# Future Architecture

Future versions may add:

- Pokémon GO Hub
- Quest system
- Achievements
- Notifications
- Community features
- Marketplace
- Mobile app
- Background jobs
- Analytics
- Error monitoring

These should be added only after the core platform is stable.
