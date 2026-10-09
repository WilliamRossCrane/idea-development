# PokéOS Decision Log

> **Version:** 0.1.0
> **Status:** Living Document
> **Last Updated:** 1 July 2026

---

# Purpose

This document records important product, technical, design and architecture decisions made during the development of PokéOS.

The goal is to preserve the reasoning behind major choices so the project remains intentional and easy to understand over time.

This document should be updated whenever a significant decision is made.

---

# How To Use This Document

Each decision should include:

- Date
- Decision
- Reason
- Alternatives considered
- Impact
- Status

Statuses:

| Status   | Meaning                                         |
| -------- | ----------------------------------------------- |
| Proposed | Decision is being considered.                   |
| Accepted | Decision has been approved.                     |
| Replaced | Decision has been replaced by a newer decision. |
| Rejected | Decision was considered but not used.           |

---

# Decision Template

Use this template for future decisions:

```markdown
## ADR-000: Decision Title

**Date:** YYYY-MM-DD  
**Status:** Proposed / Accepted / Replaced / Rejected  
**Category:** Product / Technical / Design / Architecture / Legal

### Decision

Describe the decision clearly.

### Reason

Explain why this decision was made.

### Alternatives Considered

- Option 1
- Option 2
- Option 3

### Impact

Explain how this decision affects the project.

### Notes

Any extra context.
```

---

# ADR-001: Build PokéOS As A Web Application First

**Date:** 2026-07-01
**Status:** Accepted
**Category:** Product / Technical

## Decision

PokéOS will be built as a responsive web application before any native mobile application is created.

## Reason

A web application allows the project to launch faster, support desktop and mobile users, and avoid the added complexity of maintaining separate iOS and Android applications during the early stages.

This also keeps development focused on the core platform first.

## Alternatives Considered

- Native iOS app
- Native Android app
- React Native app from the beginning
- Desktop-only web app

## Impact

The first version of PokéOS will focus on:

- Desktop web
- Mobile web
- Responsive layouts
- Browser-based user experience

Native mobile development may be considered after the MVP is stable.

## Notes

Mobile support is still important, but it will be achieved through responsive web design first.

---

# ADR-002: Use An Operating-System-Style Interface

**Date:** 2026-07-01
**Status:** Accepted
**Category:** Product / Design

## Decision

PokéOS will use an operating-system-style interface where major features behave like applications inside a larger platform.

## Reason

The operating-system concept makes PokéOS feel different from a normal Pokémon website.

Instead of presenting features as disconnected pages, PokéOS will feel like a unified companion platform with apps such as:

- Pokédex
- Team Builder
- TCG Vault
- Pokémon GO Hub
- Quest Board
- Profile
- Settings

## Alternatives Considered

- Standard website layout
- Simple dashboard
- Blog-style navigation
- Single-purpose Pokédex app

## Impact

The interface should include:

- Dashboard
- App launcher
- Modular app sections
- Consistent navigation
- Connected user data

## Notes

The goal is not to build a real operating system. PokéOS is a large web application with an OS-inspired user experience.

---

# ADR-003: Use Original Branding And Fan-Project Positioning

**Date:** 2026-07-01
**Status:** Accepted
**Category:** Product / Legal / Design

## Decision

PokéOS will be positioned as an independent fan-made Pokémon companion platform and will avoid presenting itself as an official Nintendo, Game Freak or The Pokémon Company product.

## Reason

PokéOS is inspired by Pokémon and uses Pokémon-related data, but it should not imitate official branding too closely or create confusion about ownership or affiliation.

## Alternatives Considered

- Use official Pokémon logos
- Copy official Pokémon app styling
- Use Nintendo-style branding
- Build a generic monster-collecting platform instead

## Impact

PokéOS should:

- Include a clear fan-project disclaimer.
- Avoid official Pokémon logos.
- Avoid Nintendo branding.
- Avoid official game music or sound effects.
- Use original UI design.
- Avoid copying official app layouts exactly.

## Notes

PokéOS can still be clearly Pokémon-focused while maintaining its own identity.

---

# ADR-004: Use GitHub Projects For Project Management

**Date:** 2026-07-01
**Status:** Accepted
**Category:** Project Management

## Decision

PokéOS will use GitHub Projects to manage epics, tasks, features, bugs and roadmap progress.

## Reason

GitHub Projects keeps planning and development close to the codebase. This supports a more industry-standard workflow and makes the project easier to track over time.

## Alternatives Considered

- Trello
- Notion
- Jira
- Apple Notes
- No formal project management

## Impact

Project work will be organised using:

- GitHub Issues
- GitHub Projects
- Epics
- Sub-issues
- Labels
- Milestones
- Project views

## Notes

Planning documents will live in the repository under the `docs/` folder.

---

# ADR-005: Use Markdown Documentation Inside The Repository

**Date:** 2026-07-01
**Status:** Accepted
**Category:** Documentation

## Decision

PokéOS documentation will be stored as Markdown files inside the repository.

## Reason

Markdown documentation is simple, version-controlled and visible alongside the code. This makes the project easier to maintain and review.

## Alternatives Considered

- GitHub Wiki
- Notion
- Google Docs
- External documentation site

## Impact

The project will use a `docs/` folder containing:

- Vision
- PRD
- Features
- Screen Map
- User Flows
- Design System
- Architecture
- Database Design
- API Research
- Roadmap
- Decision Log

## Notes

This structure may evolve into subfolders later as the project grows.

---

# ADR-006: Use Next.js For The Web Application

**Date:** 2026-07-01
**Status:** Proposed
**Category:** Technical

## Decision

PokéOS will likely use Next.js as the main web application framework.

## Reason

Next.js provides a strong React-based full-stack framework with routing, server rendering, API routes, deployment support and a large ecosystem.

It is a good fit for a large dashboard-style web application.

## Alternatives Considered

- Astro
- Remix
- Vite + React
- Nuxt
- SvelteKit

## Impact

Using Next.js would support:

- App Router
- Server components
- API routes
- Strong Vercel deployment support
- Full-stack TypeScript development

## Notes

This decision should be confirmed during the technical setup phase.

---

# ADR-007: Use PostgreSQL As The Main Database

**Date:** 2026-07-01
**Status:** Proposed
**Category:** Technical / Database

## Decision

PokéOS will likely use PostgreSQL as the main database.

## Reason

PostgreSQL is reliable, widely used and suitable for structured relational data.

PokéOS will require clear relationships between:

- Users
- Profiles
- Teams
- Cards
- Collections
- Quests
- Achievements
- Activity logs

## Alternatives Considered

- MongoDB
- Firebase
- SQLite
- Supabase-only data layer

## Impact

Using PostgreSQL supports:

- Relational data modelling
- Strong querying
- Long-term scalability
- Prisma integration

## Notes

Neon, Supabase, Railway and Render are possible hosting providers.

---

# ADR-008: Use Prisma As The ORM

**Date:** 2026-07-01
**Status:** Proposed
**Category:** Technical / Database

## Decision

PokéOS will likely use Prisma to manage database schema and queries.

## Reason

Prisma works well with TypeScript and PostgreSQL. It provides type-safe queries, schema migrations and a clear developer experience.

## Alternatives Considered

- Drizzle
- Raw SQL
- TypeORM
- Supabase client only

## Impact

Using Prisma would provide:

- Schema management
- Type-safe database access
- Migration support
- Easier onboarding

## Notes

This should be confirmed during the technical setup phase.

---

# ADR-009: Use PokéAPI REST For Pokémon Reference Data

**Date:** 2026-07-01
**Status:** Accepted
**Category:** API / Data

## Decision

PokéOS will use PokéAPI REST as the primary Pokémon reference data source for the MVP.

## Reason

PokéAPI is mature, free, well documented and suitable for retrieving Pokémon information such as types, abilities, moves, evolutions and species data.

## Alternatives Considered

- PokéAPI GraphQL
- Manual Pokémon database
- Other community APIs

## Impact

Pokémon reference data will be pulled from PokéAPI and cached locally where practical.

## Notes

PokéOS should avoid making unnecessary live requests to PokéAPI on every page load.

---

# ADR-010: Use Pokémon TCG API For Card Data

**Date:** 2026-07-01
**Status:** Accepted
**Category:** API / Data

## Decision

PokéOS will use Pokémon TCG API as the primary source for Trading Card Game card and set data.

## Reason

Pokémon TCG API provides structured card and set data that supports the planned TCG Vault and Collection Tracker features.

## Alternatives Considered

- TCGdex
- Manual card database
- Scraping card websites

## Impact

PokéOS will use Pokémon TCG API for:

- Card information
- Set information
- Rarity
- Card images
- Market-related data where available

User ownership data will remain stored in the PokéOS database.

## Notes

An API key should be used from the beginning of development.

---

# ADR-011: Cache External Reference Data Locally

**Date:** 2026-07-01
**Status:** Accepted
**Category:** Architecture / Performance

## Decision

PokéOS will cache frequently used external reference data inside its own database where practical.

## Reason

Relying on live API calls for every user request would create performance, reliability and rate-limit issues.

## Alternatives Considered

- Call external APIs directly from every page
- Store all data manually
- Use only static JSON files

## Impact

PokéOS should cache:

- Pokémon data
- TCG card data
- TCG set data
- Type data
- Ability data
- Move data

User-specific data will be stored separately.

## Notes

Market prices and news may require scheduled refreshes rather than permanent caching.

---

# ADR-012: Keep Pokémon GO Data Out Of The MVP

**Date:** 2026-07-01
**Status:** Accepted
**Category:** Product / Scope

## Decision

Automated Pokémon GO event tracking will not be included in the MVP.

## Reason

There does not appear to be a reliable official public Pokémon GO API suitable for automated event tracking.

Including this too early would increase project complexity and maintenance burden.

## Alternatives Considered

- Add Pokémon GO automation in V1
- Use unofficial community APIs
- Scrape event websites
- Manually add events later

## Impact

Pokémon GO Hub will be planned for a later phase.

When added, it may begin with manually curated events and official source links.

## Notes

This helps keep the MVP focused and achievable.

---

# ADR-013: Prioritise MVP Before Advanced Features

**Date:** 2026-07-01
**Status:** Accepted
**Category:** Product / Scope

## Decision

PokéOS will prioritise the MVP before adding advanced features such as community, AI, marketplace, mobile apps, push notifications and advanced market tracking.

## Reason

PokéOS has a large possible feature set. Without strict scope control, the project could become too large to complete.

## Alternatives Considered

- Build every major feature from the beginning
- Start with community features
- Start with mobile app first
- Start with marketplace features

## Impact

The MVP will focus on:

- Authentication
- Dashboard
- Trainer Profile
- Pokédex
- Team Builder
- TCG Collection Tracker

## Notes

Future features should be documented but not built until the foundation is stable.

---

# ADR-014: Use A Modular Monolith Architecture Initially

**Date:** 2026-07-01
**Status:** Accepted
**Category:** Architecture

## Decision

PokéOS will begin as a modular monolith rather than a microservices application.

## Reason

A modular monolith is simpler to build, deploy and maintain while still allowing the codebase to be organised by feature.

Microservices would add unnecessary complexity at this stage.

## Alternatives Considered

- Microservices
- Separate frontend and backend repositories
- Serverless-only architecture
- Monorepo with multiple apps from day one

## Impact

The application will be organised into modules such as:

- Dashboard
- Pokédex
- Team Builder
- TCG Vault
- Profile
- Settings

These modules will live inside one main application.

## Notes

The architecture can evolve later if the project grows significantly.

---

# ADR-015: Use Responsive Web Design Before Native Mobile

**Date:** 2026-07-01
**Status:** Accepted
**Category:** Product / Design / Technical

## Decision

PokéOS will support mobile through responsive web design before building a native mobile app.

## Reason

Responsive web design allows mobile users to access PokéOS without requiring a separate mobile codebase.

This keeps the MVP more achievable.

## Alternatives Considered

- Native iOS app first
- Native Android app first
- React Native from the beginning
- Desktop only

## Impact

All major screens should be designed for:

- Desktop
- Tablet
- Mobile

## Notes

A React Native or Expo app may be considered after the web MVP is complete.

---

# ADR-016: Use GitHub Issues For All Work

**Date:** 2026-07-01
**Status:** Accepted
**Category:** Project Management

## Decision

All meaningful work on PokéOS should be tracked through GitHub Issues.

## Reason

This creates a clear link between planning, implementation and project progress.

## Alternatives Considered

- Work directly from memory
- Use only commit messages
- Use notes outside GitHub

## Impact

Each major task should have:

- A GitHub Issue
- A status
- A label
- A linked epic where appropriate

## Notes

This will help keep the project organised as it becomes larger.

---

# Current Accepted Decisions Summary

| ADR     | Decision                                          | Status   |
| ------- | ------------------------------------------------- | -------- |
| ADR-001 | Build web app first                               | Accepted |
| ADR-002 | Use OS-style interface                            | Accepted |
| ADR-003 | Use original branding and fan-project positioning | Accepted |
| ADR-004 | Use GitHub Projects                               | Accepted |
| ADR-005 | Store docs in Markdown                            | Accepted |
| ADR-009 | Use PokéAPI REST                                  | Accepted |
| ADR-010 | Use Pokémon TCG API                               | Accepted |
| ADR-011 | Cache external data locally                       | Accepted |
| ADR-012 | Keep Pokémon GO out of MVP                        | Accepted |
| ADR-013 | Prioritise MVP                                    | Accepted |
| ADR-014 | Use modular monolith initially                    | Accepted |
| ADR-015 | Use responsive web before native mobile           | Accepted |
| ADR-016 | Use GitHub Issues for all work                    | Accepted |

---

# Open Decisions

These decisions still need to be confirmed:

| Decision                      | Current Status    |
| ----------------------------- | ----------------- |
| Final frontend framework      | Proposed: Next.js |
| Final database provider       | Research          |
| Final authentication provider | Proposed: Clerk   |
| Final ORM                     | Proposed: Prisma  |
| Final UI component strategy   | Research          |
| Final testing framework       | Research          |
| Final deployment setup        | Research          |

---

# Notes

This document should remain short, practical and honest.

A decision log is not about pretending every choice was perfect.

It exists so future contributors, employers and future versions of the project can understand why important choices were made at the time.
