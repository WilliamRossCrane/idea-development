# PokéOS API Research

> **Version:** 0.2.0
> **Status:** Living Document
> **Last Updated:** 1 July 2026

---

# Purpose

This document records the external APIs, data sources and third-party services being considered for PokéOS.

Its purpose is to:

- Identify useful external data sources.
- Compare possible API providers.
- Record technical decisions.
- Track limitations and risks.
- Document caching requirements.
- Reduce future technical uncertainty.

This document should be updated whenever an API is researched, selected, replaced or removed.

---

# Integration Philosophy

PokéOS should not rely on external APIs for every user request.

External APIs should be treated as source data providers, while PokéOS should cache and manage important data locally where practical.

This approach improves:

- Performance
- Reliability
- User experience
- Rate-limit management
- Long-term maintainability

The core rule is:

> External APIs provide data. PokéOS owns the user experience.

---

# API Categories

PokéOS may require integrations across the following areas:

- Pokémon data
- Trading Card Game data
- Pokémon GO events
- Authentication
- News
- Images
- Notifications
- Analytics
- Monitoring
- Hosting
- Database infrastructure

---

# API Decision Status

| Status      | Meaning                                                |
| ----------- | ------------------------------------------------------ |
| Confirmed   | Selected for planned use.                              |
| Recommended | Strong candidate, but final implementation may change. |
| Research    | Needs more investigation before use.                   |
| Future      | Not required for MVP.                                  |
| Rejected    | Not suitable for the project.                          |

---

# Confirmed APIs

---

## PokéAPI

**Category:** Pokémon Data
**Status:** Confirmed
**Priority:** High
**MVP Required:** Yes
**Website:** https://pokeapi.co
**Documentation:** https://pokeapi.co/docs/v2
**GraphQL Documentation:** https://pokeapi.co/docs/graphql

## Purpose

PokéAPI will provide the main Pokémon reference data for PokéOS.

## Provides

- Pokémon names
- Pokédex numbers
- Types
- Abilities
- Moves
- Evolution chains
- Species data
- Forms
- Items
- Generations
- Regions
- Game data

## Important Notes

PokéAPI is a consumption-only API. This means the REST API only supports GET requests.

No authentication is required.

PokéAPI currently does not enforce strict REST rate limits, but it still asks developers to limit request frequency to help reduce hosting costs.

PokéAPI also provides a GraphQL endpoint, but it is beta, rate-limited and subject to future changes.

## Implementation Recommendation

Use the REST API for the MVP.

The REST API is mature, simple to use and suitable for the first version of PokéOS.

GraphQL can be researched later, but should not be required for the MVP.

## Advantages

- Free
- No authentication required
- Large community
- Well documented
- Mature REST API
- Suitable for fan projects and educational projects

## Risks

- Community-maintained
- Nested data may require multiple requests
- Directly requesting data on every page load could hurt performance
- GraphQL endpoint is beta
- Data should be cached locally where practical

## Caching Strategy

Pokémon reference data should be cached in the PokéOS database.

Recommended cached data:

- Pokémon
- Types
- Abilities
- Moves
- Evolutions
- Generations
- Regions
- Forms

## Recommendation

Use PokéAPI REST as the primary Pokémon reference data source for the MVP.

PokéOS should not request PokéAPI every time a user opens a Pokémon detail page. Frequently used data should be synced or cached locally.

---

## Pokémon TCG API

**Category:** Trading Card Game Data
**Status:** Confirmed
**Priority:** High
**MVP Required:** Yes
**Website:** https://pokemontcg.io
**Documentation:** https://docs.pokemontcg.io
**Rate Limits:** https://docs.pokemontcg.io/getting-started/rate-limits

## Purpose

Pokémon TCG API will provide card and set data for the TCG Vault and Collection Tracker.

## Provides

- Card data
- Set data
- Card images
- Rarity
- Artist
- Legalities
- Market-related data
- Set symbols
- Set logos

## Important Notes

The Pokémon TCG API can be used without an API key, but the limits are much lower.

Current documented limits:

- Without API key: 1,000 requests per day and 30 requests per minute.
- With API key: 20,000 requests per day by default.

## Implementation Recommendation

Use an API key from the beginning of development.

Even if development traffic is small, using an API key encourages better production habits and avoids unnecessary rate-limit issues.

## Advantages

- Strong Pokémon TCG card database
- Useful set data
- Useful card images
- Clear documentation
- Suitable for collection tracking features

## Risks

- Rate limits apply
- Market data may not always be complete
- Image usage should be reviewed before public launch
- Data should be cached locally to avoid excessive requests

## Caching Strategy

PokéOS should cache:

- TCG sets
- Card metadata
- Card numbers
- Rarity
- Artist information
- Image URLs
- Set symbols
- Set logos

Market-related data should be refreshed on a schedule rather than requested constantly.

## Recommendation

Use Pokémon TCG API as the primary TCG data source for the MVP.

User ownership data must always be stored inside PokéOS.

Example:

- Card data comes from Pokémon TCG API.
- User collection data belongs to PokéOS.

---

# APIs Under Evaluation

---

## TCGdex

**Category:** Trading Card Game Data
**Status:** Research
**Priority:** Medium
**MVP Required:** No
**Website:** https://tcgdex.dev
**REST Documentation:** https://tcgdex.dev/rest
**GraphQL Documentation:** https://tcgdex.dev/graphql
**TCG Pocket:** https://tcgdex.dev/tcg-pocket

## Purpose

TCGdex is an alternative or supplementary Pokémon TCG data source.

## Provides

- TCG card data
- Set data
- REST API
- GraphQL API
- Multi-language support
- Pokémon TCG Pocket data

## Potential Use Cases

TCGdex may be useful for:

- Multi-language support
- Pokémon TCG Pocket integration
- Alternative card metadata
- Future internationalisation
- Comparing data completeness against Pokémon TCG API

## Advantages

- REST support
- GraphQL support
- Multiple languages
- TCG Pocket support
- Developer-facing documentation

## Risks

- Needs comparison against Pokémon TCG API
- Data completeness should be tested
- Rate limits and long-term reliability need review before production use

## Recommendation

Do not use TCGdex in the MVP unless Pokémon TCG API is missing critical data.

Keep TCGdex as a strong research candidate for future releases, especially if PokéOS adds Pokémon TCG Pocket features.

---

# Authentication Providers

---

## Clerk

**Category:** Authentication
**Status:** Recommended
**Priority:** High
**MVP Required:** Yes
**Website:** https://clerk.com
**Next.js Documentation:** https://clerk.com/docs/nextjs/getting-started/quickstart

## Purpose

Clerk would manage authentication and user sessions.

## Provides

- Sign up
- Login
- Logout
- Session management
- Google login
- GitHub login
- User management
- Protected routes
- Prebuilt authentication components

## Advantages

- Strong Next.js support
- Fast to implement
- Reduces custom security work
- Good developer experience
- Suitable for MVP development

## Risks

- External vendor dependency
- Pricing should be reviewed before public release
- Migrating away later may require work

## Recommendation

Use Clerk for the MVP unless a simpler self-hosted authentication option is preferred before development begins.

---

## Auth.js

**Category:** Authentication
**Status:** Research
**Priority:** Medium
**MVP Required:** No
**Website:** https://authjs.dev

## Purpose

Auth.js is a potential alternative authentication solution.

## Advantages

- Open source
- Common in the Next.js ecosystem
- More control than hosted providers

## Risks

- More configuration required
- More responsibility for implementation details
- May slow down early development

## Recommendation

Consider Auth.js only if avoiding external authentication vendors becomes a priority.

---

## Supabase Auth

**Category:** Authentication
**Status:** Research
**Priority:** Medium
**MVP Required:** No
**Website:** https://supabase.com

## Purpose

Supabase Auth could be considered if PokéOS also uses Supabase for database hosting.

## Advantages

- Integrated with Supabase
- Supports common authentication flows
- Good developer experience
- Can pair naturally with Supabase PostgreSQL

## Risks

- Less specialised than Clerk for auth-focused workflows
- Could tie database and authentication decisions together

## Recommendation

Consider Supabase Auth only if Supabase becomes the selected database platform.

---

# Pokémon GO Data

---

## Official Pokémon GO News

**Category:** Pokémon GO Events
**Status:** Research
**Priority:** Medium
**MVP Required:** No
**Website:** https://pokemongolive.com/news

## Purpose

Pokémon GO event information may be used to power a GO Hub inside PokéOS.

## Potential Data

- Community Days
- Raid Days
- GO Fest
- Spotlight Hours
- Seasonal events
- Battle updates
- Research events

## Current Situation

A reliable official public Pokémon GO API has not been identified.

The safest approach is to treat Pokémon GO data as curated content rather than a direct API integration.

## Possible Implementation Options

### Option 1: Manual Admin Input

PokéOS stores Pokémon GO events manually through an internal admin dashboard.

Advantages:

- Reliable
- Controlled
- No scraping risk
- Easy to correct errors

Disadvantages:

- Requires manual maintenance

---

### Option 2: Official News Monitoring

PokéOS links to official Pokémon GO news posts and manually extracts relevant event details.

Advantages:

- Based on official information
- Lower technical complexity
- Safer than relying on unofficial automation

Disadvantages:

- Still requires manual interpretation
- Not a clean API
- May not support structured event data

---

### Option 3: Community Data Source

PokéOS uses a trusted community-maintained data source.

Advantages:

- Faster event coverage
- Potentially structured data

Disadvantages:

- Reliability risk
- Licensing risk
- Maintenance risk
- Data could become unavailable

## Recommendation

Do not include automated Pokémon GO event tracking in the MVP.

For Version 2, start with manual event entries and official source links. Only automate later if a reliable and legally safe data source is found.

---

# News Sources

---

## Pokémon News

**Category:** News
**Status:** Research
**Priority:** Medium
**MVP Required:** No
**Official Website:** https://www.pokemon.com

## Purpose

The News Centre may display Pokémon-related updates across games, TCG, Pokémon GO and major announcements.

## Potential Sources

- Official Pokémon website
- Pokémon GO news
- Nintendo news
- Official YouTube announcements
- Curated manual posts

## Recommendation

For early versions, use curated news links rather than automated scraping.

This reduces legal and technical risk while still providing useful information.

---

# Images and Assets

---

## Image Strategy

**Category:** Images
**Status:** Research
**Priority:** High
**MVP Required:** Yes

## Purpose

PokéOS will require images for Pokémon, cards, avatars, icons and UI elements.

## Potential Image Sources

- PokéAPI sprite links
- Pokémon TCG API card images
- TCGdex card images
- User-uploaded avatars
- Custom original UI icons
- Original PokéOS design assets

## Legal Considerations

PokéOS should avoid presenting itself as an official Pokémon product.

The app should avoid:

- Official Pokémon logos
- Nintendo logos
- The Pokémon Company branding
- Copied UI from official apps
- Music or sound effects from official games
- Unauthorised commercial use of copyrighted assets

## Recommendation

Use a clear fan-project disclaimer.

Keep PokéOS branding original.

Use Pokémon data carefully and avoid making the design look like an official Nintendo or Pokémon product.

---

# Notifications

---

## Notification Services

**Category:** Notifications
**Status:** Future
**Priority:** Low
**MVP Required:** No

## Potential Providers

- Firebase Cloud Messaging
- OneSignal
- Resend
- Browser push notifications
- Email provider

## Potential Use Cases

- Event reminders
- Collection milestones
- Quest reminders
- Price alerts
- Account notifications

## Recommendation

Do not include push notifications in the MVP.

Start with in-app notifications only.

---

# Analytics

---

## Vercel Analytics

**Category:** Analytics
**Status:** Future
**Priority:** Low
**MVP Required:** No
**Website:** https://vercel.com/analytics

## Purpose

Track basic usage and performance.

## Potential Metrics

- Page views
- Core Web Vitals
- Popular modules
- Device usage
- Geographic usage

## Recommendation

Add analytics after the MVP is functional.

Do not prioritise analytics before core product value exists.

---

# Monitoring

---

## Sentry

**Category:** Monitoring
**Status:** Future
**Priority:** Medium
**MVP Required:** No
**Website:** https://sentry.io
**Next.js Documentation:** https://docs.sentry.io/platforms/javascript/guides/nextjs/

## Purpose

Track production errors and crashes.

## Potential Use Cases

- Frontend errors
- API errors
- Database issues
- User-impacting bugs
- Performance issues

## Recommendation

Add monitoring before public launch, but it is not required during early planning or prototype development.

---

# Hosting and Infrastructure

---

## Vercel

**Category:** Hosting
**Status:** Recommended
**Priority:** High
**MVP Required:** Yes
**Website:** https://vercel.com

## Purpose

Host the Next.js web application.

## Advantages

- Excellent Next.js support
- Simple deployment
- GitHub integration
- Preview deployments
- Strong developer experience
- Serverless functions
- Global delivery

## Recommendation

Use Vercel for the MVP.

---

## PostgreSQL Hosting

**Category:** Database Hosting
**Status:** Research
**Priority:** High
**MVP Required:** Yes

## Potential Providers

- Neon
- Supabase
- Railway
- Render

---

## Neon

**Category:** Database Hosting
**Status:** Recommended
**Priority:** High
**MVP Required:** Yes
**Website:** https://neon.com

## Purpose

Managed PostgreSQL hosting for PokéOS.

## Advantages

- Serverless PostgreSQL
- Good fit for modern web apps
- Branching support
- Works well with JavaScript and TypeScript tooling

## Risks

- External vendor dependency
- Pricing should be reviewed before public release

## Recommendation

Use a managed PostgreSQL provider for the MVP.

Neon is a strong first choice, but Supabase, Railway and Render should remain alternatives until implementation begins.

---

# Internal API Strategy

PokéOS will have its own internal API for user-owned data.

External APIs should not be called directly from every frontend component.

## Example Internal Endpoints

```text
GET    /api/dashboard
GET    /api/profile
PATCH  /api/profile

GET    /api/teams
POST   /api/teams
GET    /api/teams/:id
PATCH  /api/teams/:id
DELETE /api/teams/:id

GET    /api/collection
POST   /api/collection/cards
PATCH  /api/collection/cards/:id
DELETE /api/collection/cards/:id

GET    /api/pokemon/search
GET    /api/pokemon/:id

GET    /api/tcg/cards
GET    /api/tcg/sets
```

## API Design Principles

Internal APIs should:

- Validate user input.
- Protect private data.
- Return predictable responses.
- Handle errors clearly.
- Avoid exposing external API keys.
- Support future mobile app usage.

---

# Caching Strategy

Caching is a core requirement for PokéOS.

## Cache Long-Term

Data that rarely changes:

- Pokémon names
- Pokédex numbers
- Types
- Abilities
- Moves
- Evolutions
- Generations
- Regions
- TCG set names
- TCG card metadata

## Refresh Occasionally

Data that changes sometimes:

- TCG market prices
- News
- Pokémon GO event information

## Never Cache as Shared Public Data

User-owned private data:

- User profile
- Teams
- Collection ownership
- Wishlist
- Notes
- Settings

---

# Environment Variables

API keys and secrets must be stored in environment variables.

Examples:

```text
DATABASE_URL
CLERK_SECRET_KEY
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
POKEMON_TCG_API_KEY
```

Secrets must never be committed to GitHub.

---

# Rate Limiting Strategy

PokéOS should minimise unnecessary external API requests.

Strategies:

- Cache external data locally.
- Use scheduled sync jobs.
- Avoid repeated requests from the client.
- Use API keys where available.
- Gracefully handle rate-limit errors.
- Show fallback UI when third-party services fail.

---

# Error Handling Strategy

All API integrations should handle:

- Network failure
- Timeout
- Rate limits
- Missing data
- Invalid responses
- Provider downtime

Users should see clear, friendly messages instead of technical errors.

Example:

```text
We could not load card prices right now. Your collection is still saved.
```

---

# Integration Priority

## Version 1

Required:

- PokéAPI REST
- Pokémon TCG API
- Authentication provider
- Managed PostgreSQL provider

---

## Version 2

Recommended:

- Pokémon GO curated events
- News centre
- In-app notifications

---

## Version 3

Future:

- Market refresh jobs
- Error monitoring
- Analytics
- Push notifications

---

# API Decision Matrix

| Integration              | Purpose                    | Priority | MVP | Status      |
| ------------------------ | -------------------------- | -------- | --- | ----------- |
| PokéAPI REST             | Pokémon data               | High     | Yes | Confirmed   |
| PokéAPI GraphQL          | Pokémon data               | Low      | No  | Research    |
| Pokémon TCG API          | Card data                  | High     | Yes | Confirmed   |
| TCGdex                   | Alternative TCG data       | Medium   | No  | Research    |
| Clerk                    | Authentication             | High     | Yes | Recommended |
| Auth.js                  | Authentication alternative | Medium   | No  | Research    |
| Supabase Auth            | Authentication alternative | Medium   | No  | Research    |
| Official Pokémon GO News | GO events                  | Medium   | No  | Research    |
| News sources             | Pokémon updates            | Medium   | No  | Research    |
| Vercel Analytics         | Analytics                  | Low      | No  | Future      |
| Sentry                   | Error monitoring           | Medium   | No  | Future      |
| Neon PostgreSQL          | Database hosting           | High     | Yes | Recommended |

---

# Current MVP Recommendations

For the MVP, use:

- PokéAPI REST for Pokémon data.
- Pokémon TCG API for card and set data.
- Clerk for authentication.
- Managed PostgreSQL for storage.
- Local database caching for reference data.
- Manual or curated Pokémon GO event handling later.

Do not include automated Pokémon GO data, community features, AI recommendations, push notifications or advanced market tracking in the MVP.

---

# Source Links

These links should be reviewed again before implementation begins.

- PokéAPI: https://pokeapi.co/docs/v2
- PokéAPI GraphQL: https://pokeapi.co/docs/graphql
- Pokémon TCG API: https://docs.pokemontcg.io
- Pokémon TCG API Rate Limits: https://docs.pokemontcg.io/getting-started/rate-limits
- TCGdex: https://tcgdex.dev
- TCGdex REST: https://tcgdex.dev/rest
- TCGdex GraphQL: https://tcgdex.dev/graphql
- TCGdex TCG Pocket: https://tcgdex.dev/tcg-pocket
- Clerk Next.js: https://clerk.com/docs/nextjs/getting-started/quickstart
- Pokémon GO News: https://pokemongolive.com/news
- Official Pokémon Website: https://www.pokemon.com
- Vercel: https://vercel.com
- Neon: https://neon.com
- Sentry Next.js: https://docs.sentry.io/platforms/javascript/guides/nextjs/

---

# Review Checklist

Before integrating each service, confirm:

- Current documentation
- Usage limits
- Licensing
- Attribution requirements
- Pricing
- Data quality
- Long-term reliability
- Whether data can be cached
- Whether API keys are required
- Whether the integration is required for the MVP

---

# Notes

The purpose of API research is not just to find data.

It is to make sure PokéOS can grow without becoming fragile, slow or dependent on unreliable third-party services.

External APIs should enhance PokéOS, not control the entire product.
