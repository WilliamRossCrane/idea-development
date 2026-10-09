# PokéOS Repository Structure

> **Version:** 0.2.0  
> **Status:** Draft  
> **Last Updated:** 4 July 2026

---

# Purpose

This document defines the planned repository structure for PokéOS.

The goal is to keep the project simple, organised and easy to grow as development begins.

PokéOS should separate:

- Application code
- Documentation
- Design assets
- Public assets
- Database files
- Configuration files

---

# Current Structure

The project currently contains:

```text
POKEOS/
├── design/
├── docs/
└── README.md
```

---

# Recommended Structure

Once development begins, the repository should use this structure:

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
│
├── README.md
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
├── components.json
└── .env.example
```

---

# Folder Overview

## src/

The main application code lives inside `src/`.

This keeps the project root clean and makes it clear where the actual app code belongs.

---

## src/app/

The main Next.js App Router folder.

This contains:

- Pages
- Layouts
- Route groups
- API route handlers
- Loading states
- Error states

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

---

## src/components/

Reusable components used across the app.

Example:

```text
src/components/
├── ui/
├── layout/
└── shared/
```

### src/components/ui/

Basic reusable UI components.

Examples:

- Button
- Card
- Input
- Badge
- Dialog
- Tabs
- Progress

This is also where shadcn/ui components should live.

---

### src/components/layout/

Layout components.

Examples:

- App Shell
- Sidebar
- Topbar
- Mobile Navigation
- Page Container

---

### src/components/shared/

Shared app components.

Examples:

- Search Bar
- Avatar
- Empty State
- Loading State
- Error State

---

## src/features/

Feature-specific code.

Each major PokéOS feature should have its own folder.

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

Each feature folder can contain:

```text
components/
actions.ts
queries.ts
types.ts
utils.ts
```

Example:

```text
src/features/team-builder/
├── components/
├── actions.ts
├── queries.ts
├── types.ts
└── utils.ts
```

---

## src/lib/

Shared utilities and configuration.

Example:

```text
src/lib/
├── db.ts
├── auth.ts
├── utils.ts
├── validations.ts
└── constants.ts
```

Use this folder for code shared across the app.

---

## src/types/

Shared TypeScript types.

Examples:

```text
src/types/
├── pokemon.ts
├── tcg.ts
├── user.ts
└── common.ts
```

Only place types here if they are used across multiple features.

Feature-specific types should stay inside their feature folder.

---

## prisma/

Database schema and migrations.

Example:

```text
prisma/
├── schema.prisma
└── migrations/
```

---

## public/

Static assets served directly by the app.

Example:

```text
public/
├── icons/
├── images/
└── placeholders/
```

Use this for app assets, not planning mockups.

---

## design/

Visual design assets and mockups.

Example:

```text
design/
├── README.md
├── desktop/
│   ├── dashboard.png
│   ├── app-launcher.png
│   └── navigation.png
└── mobile/
    ├── dashboard.png
    ├── app-launcher.png
    └── navigation.png
```

This folder is for UI mockups, screenshots and visual references.

---

## docs/

Written project documentation.

Example:

```text
docs/
├── 01-vision.md
├── 02-prd.md
├── 03-features.md
├── 04-screen-map.md
├── 05-user-flows.md
├── 06-design-system.md
├── 07-architecture.md
├── 08-database.md
├── 09-api-research.md
├── 10-roadmap.md
├── 11-decisions.md
├── 12-tech-stack.md
└── 13-repo-structure.md
```

This folder should stay focused on written documentation.

---

# Phase 1 Structure

For the first development phase, start with:

```text
POKEOS/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── dashboard/
│   │   ├── pokedex/
│   │   ├── teams/
│   │   ├── tcg/
│   │   ├── profile/
│   │   └── settings/
│   │
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   └── shared/
│   │
│   ├── features/
│   │   ├── dashboard/
│   │   ├── pokedex/
│   │   ├── team-builder/
│   │   ├── tcg-vault/
│   │   ├── profile/
│   │   └── settings/
│   │
│   ├── lib/
│   └── types/
│
├── prisma/
├── public/
├── design/
├── docs/
└── README.md
```

---

# Naming Rules

Use lowercase folder names.

Use hyphens for multi-word folders.

Good:

```text
team-builder
tcg-vault
app-launcher
```

Avoid:

```text
TeamBuilder
tcgVault
team_builder
```

---

# File Naming Rules

Use clear, consistent file names.

Examples:

```text
team-card.tsx
collection-progress.tsx
app-sidebar.tsx
user-profile.tsx
```

Avoid vague names like:

```text
stuff.tsx
helper.ts
component.tsx
```

---

# Structure Principles

## Keep The Root Clean

The root folder should mainly contain project-level files.

Application code should live inside `src/`.

---

## Keep Features Separated

Each major feature should live in its own folder.

This makes the project easier to understand and maintain.

---

## Keep Shared Components Reusable

If a component is used in multiple places, place it in `src/components/`.

If it only belongs to one feature, keep it inside that feature folder.

---

## Keep Documentation Separate

Written documentation belongs in `docs/`.

Visual mockups belong in `design/`.

Application assets belong in `public/`.

---

## Keep Phase 1 Simple

Do not create folders for future features until they are needed.

Avoid adding folders for:

- Pokémon GO
- Community
- Marketplace
- Quests
- Achievements
- Mobile app

These can be added later.

---

# Future Structure

Later versions may add:

```text
tests/
scripts/
emails/
workers/
mobile/
```

These should only be added when the project actually needs them.
