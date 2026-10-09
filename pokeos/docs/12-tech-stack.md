# PokéOS Tech Stack

> **Version:** 0.2.0  
> **Status:** Draft  
> **Last Updated:** 4 July 2026

---

# Purpose

This document defines the planned technology stack for PokéOS.

The goal is to keep the stack simple, modern and realistic for a large full-stack web app.

PokéOS should use tools that are:

- Popular in industry
- Easy to work with
- Well documented
- Type-safe
- Scalable enough for future features
- Not overcomplicated too early

---

# Stack Summary

| Area               | Tool                          |
| ------------------ | ----------------------------- |
| Framework          | Next.js                       |
| Language           | TypeScript                    |
| Styling            | Tailwind CSS                  |
| UI Components      | shadcn/ui + custom components |
| Authentication     | Clerk                         |
| Database           | PostgreSQL                    |
| ORM                | Prisma                        |
| Database Hosting   | Neon or Supabase              |
| Hosting            | Vercel                        |
| Forms              | React Hook Form               |
| Validation         | Zod                           |
| Package Manager    | pnpm                          |
| Version Control    | GitHub                        |
| Project Management | GitHub Projects               |

---

# Recommended Stack

## Next.js

Next.js will be the main framework for PokéOS.

It will handle:

- Routing
- Pages
- Layouts
- Server components
- Client components
- API route handlers
- Server actions
- Deployment through Vercel

Next.js is a strong choice because PokéOS needs both frontend and backend functionality in one project.

## TypeScript

TypeScript will be used across the whole codebase.

It helps keep data safer and clearer, especially for:

- User profiles
- Teams
- Cards
- Collections
- API responses
- Database models
- Component props

## Tailwind CSS

Tailwind CSS will be used for styling.

It is a good fit because PokéOS needs a clean, responsive and custom interface.

Tailwind is useful for:

- Layout
- Spacing
- Typography
- Responsive design
- Colour consistency
- Fast UI development

## shadcn/ui

PokéOS should use shadcn/ui as the starting point for UI components.

It provides clean, accessible components that can be customised to match the PokéOS design system.

Use shadcn/ui for:

- Buttons
- Inputs
- Cards
- Dialogs
- Dropdowns
- Tabs
- Forms
- Badges
- Sheets

PokéOS can then build custom components on top of these.

Examples:

- Dashboard cards
- App launcher cards
- Team slots
- Collection progress cards
- TCG set cards

## Clerk

Clerk will handle authentication.

It will provide:

- Sign up
- Login
- Logout
- Sessions
- Google login
- GitHub login
- Protected routes
- User management

Clerk is a good choice because it saves time and avoids building custom authentication from scratch.

## PostgreSQL

PostgreSQL will be the main database.

It will store:

- Users
- Trainer profiles
- Teams
- Team members
- TCG collections
- Saved cards
- Settings
- Activity logs
- Cached Pokémon data
- Cached TCG data

PostgreSQL is a good fit because PokéOS has lots of related data.

## Prisma

Prisma will be used to work with the database.

It provides:

- Type-safe database queries
- Schema management
- Migrations
- Clear database models
- Good TypeScript support

Prisma makes the database easier to manage while the project grows.

## Neon or Supabase

Use a managed PostgreSQL database.

Recommended options:

- Neon
- Supabase

Either is fine for this project.

Neon is a strong choice if the app is mainly using Prisma and Vercel.

Supabase is a strong choice if the project later wants more built-in backend features.

## Vercel

Vercel will host the web app.

It is the easiest hosting choice for a Next.js project.

It provides:

- Simple deployment
- GitHub integration
- Preview deployments
- Environment variables
- Strong Next.js support

## React Hook Form

React Hook Form will be used for important forms.

Examples:

- Profile setup
- Team creation
- Team editing
- Settings
- Collection updates

## Zod

Zod will be used for validation.

It should validate:

- Form data
- API inputs
- Environment variables
- Database-related inputs

Zod works well with TypeScript and helps prevent bad data from entering the app.

## pnpm

pnpm will be used as the package manager.

It is fast, reliable and common in modern JavaScript projects.

## GitHub

GitHub will be used for:

- Version control
- Issues
- Project board
- Pull requests
- Documentation
- Releases

---

# Tools To Add Later

These tools are useful, but they do not need to be added on day one.

## TanStack Query

Add when client-side data fetching becomes more complex.

Use it later for:

- Search results
- Cached API data
- Team updates
- Collection updates

Do not add it until the app actually needs it.

## Zustand

Add only if local UI state becomes messy.

Possible use cases:

- Sidebar state
- App launcher state
- Temporary team builder state
- Theme state

Do not use global state unless normal React state becomes annoying.

## Vitest

Add when business logic becomes important.

Good test targets:

- Type matchup logic
- Team analysis
- Collection progress calculations
- Validation schemas

## Playwright

Add before public release.

Use it to test full user flows:

- User can log in
- User can create a team
- User can search Pokémon
- User can add a card to collection
- User can update profile

## Sentry

Add when the app has real users or is close to public release.

Use it for:

- Error tracking
- API failures
- Production crashes

## Vercel Analytics

Add after the app is usable.

Use it to understand:

- Page views
- Device usage
- Performance
- Popular features

---

# External APIs

## PokéAPI

PokéAPI will be used for Pokémon reference data.

Used for:

- Pokémon search
- Pokémon details
- Types
- Abilities
- Moves
- Evolutions
- Forms

## Pokémon TCG API

Pokémon TCG API will be used for card and set data.

Used for:

- Card search
- Set search
- Card details
- Collection tracking
- Wishlist
- Set completion

---

# What Not To Add Yet

Avoid adding these too early:

- Redux
- Microservices
- Docker
- Kubernetes
- Custom authentication
- Complex CI/CD
- Native mobile app
- AI features
- Advanced analytics
- Paid subscriptions
- Marketplace tools

These may be useful later, but they are unnecessary for the first version.

---

# Initial Build Stack

Start with:

```text
Next.js
TypeScript
Tailwind CSS
shadcn/ui
Clerk
PostgreSQL
Prisma
Vercel
React Hook Form
Zod
pnpm
GitHub Projects
```
