# PokéOS Database Design

> **Version:** 0.2.0  
> **Status:** Draft  
> **Last Updated:** 4 July 2026

---

# Purpose

This document defines the Phase 1 database design for PokéOS.

The goal is to keep the database simple, clear and realistic for the first version of the app.

PokéOS should start with the core data needed for:

- User profiles
- Settings
- Pokémon teams
- Pokémon reference data
- TCG card tracking
- Activity history

Future features should be added later only when the app needs them.

---

# Database Stack

| Area     | Tool             |
| -------- | ---------------- |
| Database | PostgreSQL       |
| ORM      | Prisma           |
| Hosting  | Neon or Supabase |

---

# Database Principles

## Keep Phase 1 Small

Only build tables required for the first usable version.

Avoid creating tables for future features before they are needed.

---

## User Data Belongs To The User

All personal data should connect back to a user account.

Examples:

- Profile
- Settings
- Teams
- Collection
- Activity

---

## Separate Reference Data From User Data

Reference data is shared information.

User data is personal information.

Example:

- `TcgCard` = card information
- `UserTcgCard` = whether a user owns that card

This keeps the database cleaner and avoids duplicated data.

---

## Cache External Data Carefully

Pokémon and TCG data will come from external APIs.

PokéOS may cache important reference data locally to improve speed and reduce API calls.

---

# Phase 1 Entity Map

```text
User
│
├── TrainerProfile
├── UserSettings
├── PokemonTeam
│   └── PokemonTeamMember
├── UserTcgCard
└── ActivityLog

Pokemon
└── PokemonEvolution

TcgSet
└── TcgCard
```

---

# Phase 1 Tables

---

## User

Represents a PokéOS account.

Authentication will be handled by Clerk, but PokéOS should still store local user data linked to the Clerk user ID.

### Fields

- `id`
- `clerkUserId`
- `email`
- `username`
- `createdAt`
- `updatedAt`

### Relationships

- One `TrainerProfile`
- One `UserSettings`
- Many `PokemonTeams`
- Many `UserTcgCards`
- Many `ActivityLogs`

---

## TrainerProfile

Stores the user's trainer profile.

### Fields

- `id`
- `userId`
- `trainerName`
- `avatarUrl`
- `favouritePokemonId`
- `favouriteRegion`
- `favouriteType`
- `trainerLevel`
- `xp`
- `createdAt`
- `updatedAt`

### Notes

`trainerLevel` and `xp` can start simple.

They do not need a full quest or achievement system in Phase 1.

---

## UserSettings

Stores user preferences.

### Fields

- `id`
- `userId`
- `theme`
- `dashboardLayout`
- `profileVisibility`
- `createdAt`
- `updatedAt`

### Example Values

Theme:

- `light`
- `dark`
- `system`

Profile visibility:

- `private`
- `public`

---

# Pokémon Data

---

## Pokemon

Stores cached Pokémon reference data.

### Fields

- `id`
- `externalId`
- `pokedexNumber`
- `name`
- `generation`
- `region`
- `primaryType`
- `secondaryType`
- `height`
- `weight`
- `baseHp`
- `baseAttack`
- `baseDefense`
- `baseSpecialAttack`
- `baseSpecialDefense`
- `baseSpeed`
- `imageUrl`
- `createdAt`
- `updatedAt`

### Notes

Data should come from PokéAPI.

Use `externalId` to store the API identifier from PokéAPI.

Keep stats as separate fields instead of one large `baseStats` field so they are easier to query and display.

---

## PokemonEvolution

Stores basic evolution relationships.

### Fields

- `id`
- `fromPokemonId`
- `toPokemonId`
- `method`
- `level`
- `item`
- `createdAt`
- `updatedAt`

### Notes

This table is useful for the Pokédex detail page.

Keep it simple for Phase 1.

---

# Team Builder

---

## PokemonTeam

Stores a saved team created by a user.

### Fields

- `id`
- `userId`
- `name`
- `description`
- `format`
- `isFavourite`
- `createdAt`
- `updatedAt`

### Example Formats

- `casual`
- `competitive`
- `story`
- `custom`

---

## PokemonTeamMember

Stores each Pokémon inside a team.

### Fields

- `id`
- `teamId`
- `pokemonId`
- `nickname`
- `level`
- `ability`
- `nature`
- `heldItem`
- `teraType`
- `moveOne`
- `moveTwo`
- `moveThree`
- `moveFour`
- `position`
- `createdAt`
- `updatedAt`

### Notes

Each team should have a maximum of six members.

`position` controls the display order.

Moves can be stored as text in Phase 1 to keep the schema simple.

They can be normalised into a separate move table later if needed.

---

# TCG Collection

---

## TcgSet

Stores Pokémon TCG set information.

### Fields

- `id`
- `externalId`
- `code`
- `name`
- `series`
- `releaseDate`
- `totalCards`
- `logoUrl`
- `symbolUrl`
- `createdAt`
- `updatedAt`

### Notes

Data should come from Pokémon TCG API.

Use `externalId` to store the API set identifier.

---

## TcgCard

Stores Pokémon TCG card information.

### Fields

- `id`
- `externalId`
- `setId`
- `cardNumber`
- `name`
- `rarity`
- `artist`
- `imageSmallUrl`
- `imageLargeUrl`
- `marketPrice`
- `createdAt`
- `updatedAt`

### Notes

Data should come from Pokémon TCG API.

Market price can be nullable because not every card may have reliable price data.

---

## UserTcgCard

Represents a card owned or tracked by a user.

### Fields

- `id`
- `userId`
- `cardId`
- `quantity`
- `condition`
- `isFavourite`
- `isWishlist`
- `isForTrade`
- `purchasePrice`
- `notes`
- `createdAt`
- `updatedAt`

### Example Conditions

- `mint`
- `near_mint`
- `lightly_played`
- `moderately_played`
- `damaged`
- `unknown`

### Notes

This table stores user ownership.

The card details stay in `TcgCard`.

---

# Activity Log

---

## ActivityLog

Stores recent user activity for the dashboard.

### Fields

- `id`
- `userId`
- `activityType`
- `description`
- `metadata`
- `createdAt`

### Example Activity Types

- `team_created`
- `team_updated`
- `card_added`
- `card_removed`
- `profile_updated`
- `collection_updated`

### Notes

`metadata` can store optional JSON for extra details.

Example:

```json
{
  "teamId": "123",
  "teamName": "Kanto Classics"
}
```

---

# Phase 1 Relationships

```text
User
├── TrainerProfile
├── UserSettings
├── PokemonTeam
│   └── PokemonTeamMember
├── UserTcgCard
└── ActivityLog

Pokemon
├── PokemonTeamMember
└── PokemonEvolution

TcgSet
└── TcgCard
    └── UserTcgCard
```

---

# Future Tables

These are intentionally excluded from Phase 1.

Add them later when the related features are actually being built.

## Future Modules

- Living Dex
- Shiny Tracker
- Quest System
- Achievements
- Pokémon GO Events
- Notifications
- Friends
- Community
- Marketplace
- Trading

---

# Future Table Ideas

## LivingDexEntry

Tracks Pokémon owned by a user across games.

---

## ShinyHunt

Tracks shiny hunts and encounter counts.

---

## Quest

Stores daily or weekly quests.

---

## Achievement

Stores unlockable achievements.

---

## Notification

Stores in-app notifications.

---

## PokemonGoEvent

Stores Pokémon GO events.

---

# Recommended Phase 1 Prisma Models

Phase 1 should begin with these models only:

- `User`
- `TrainerProfile`
- `UserSettings`
- `Pokemon`
- `PokemonEvolution`
- `PokemonTeam`
- `PokemonTeamMember`
- `TcgSet`
- `TcgCard`
- `UserTcgCard`
- `ActivityLog`

This is enough to build the first usable version of PokéOS without over-engineering the database.

---

# Notes

This database design is intentionally simple.

The goal is not to design every future feature now.

The goal is to create a clean Phase 1 schema that supports the core app and can grow safely over time.
