# PokéOS Authentication Flow

> **Version:** 0.1.0  
> **Status:** Draft  
> **Last Updated:** 4 July 2026

---

# Purpose

This document defines the authentication flow for PokéOS.

The goal is to clearly explain how users sign up, log in, access protected pages and connect their account to PokéOS user data.

Authentication should be simple, secure and easy to maintain.

---

# Authentication Provider

PokéOS will use Clerk for authentication.

Clerk will handle:

- Sign up
- Login
- Logout
- Sessions
- Google login
- GitHub login
- Protected routes
- User identity

PokéOS will not store user passwords directly.

---

# Authentication Goals

The authentication system should:

- Be easy for users to understand
- Protect private user data
- Keep unauthenticated users out of private pages
- Create a local PokéOS user record after sign up
- Keep user profile data separate from authentication data
- Support future account settings and profile features

---

# User Types

## Guest User

A guest user is not logged in.

Guest users can access:

- Landing page
- Login page
- Sign up page
- Public information pages

Guest users cannot access:

- Dashboard
- Profile
- Team Builder
- TCG Tracker
- Settings
- Saved user data

---

## Authenticated User

An authenticated user is logged in.

Authenticated users can access:

- Dashboard
- Pokédex
- Team Builder
- TCG Tracker
- Profile
- Settings
- Saved teams
- Saved collection data

---

# Main Authentication Flow

```text
User visits PokéOS
        │
        ▼
Landing Page
        │
        ├── Sign Up
        │       │
        │       ▼
        │   Clerk Sign Up
        │       │
        │       ▼
        │   Create PokéOS User Record
        │       │
        │       ▼
        │   Create Trainer Profile
        │       │
        │       ▼
        │   Dashboard
        │
        └── Login
                │
                ▼
            Clerk Login
                │
                ▼
            Dashboard
```

---

# Sign Up Flow

## Goal

Allow a new user to create a PokéOS account.

## Flow

```text
Landing Page
    ↓
Sign Up
    ↓
Clerk Sign Up Form
    ↓
Account Created
    ↓
Create Local User Record
    ↓
Create Default Trainer Profile
    ↓
Create Default User Settings
    ↓
Redirect to Dashboard
```

## Local Data Created

After a user signs up, PokéOS should create:

- User
- TrainerProfile
- UserSettings

---

# Login Flow

## Goal

Allow an existing user to access their account.

## Flow

```text
Landing Page
    ↓
Login
    ↓
Clerk Login Form
    ↓
Session Created
    ↓
Check Local User Record
    ↓
Redirect to Dashboard
```

## Notes

If the Clerk user exists but the local PokéOS user record does not exist, PokéOS should create it automatically.

This protects against account sync issues.

---

# Logout Flow

## Goal

Allow users to safely leave their account.

## Flow

```text
User Menu
    ↓
Logout
    ↓
Clerk Ends Session
    ↓
Redirect to Landing Page
```

---

# Protected Routes

The following routes should require authentication:

```text
/dashboard
/pokedex
/teams
/tcg
/profile
/settings
```

Unauthenticated users who try to access protected routes should be redirected to the login page.

---

# Public Routes

The following routes can be viewed without logging in:

```text
/
/login
/sign-up
/about
```

---

# Account Setup

After sign up, PokéOS should create a basic profile automatically.

Default profile values may include:

- Trainer name from username or email
- Default avatar
- Level 1
- 0 XP
- Default theme
- Private profile visibility

Users can update these later from the Profile or Settings pages.

---

# Database Connection

Clerk handles authentication.

PokéOS stores app-specific user data.

```text
Clerk User
    ↓
PokéOS User
    ↓
Trainer Profile
    ↓
Teams / Cards / Settings / Activity
```

---

# User Table Link

The local PokéOS `User` table should include:

- `id`
- `clerkUserId`
- `email`
- `username`
- `createdAt`
- `updatedAt`

The `clerkUserId` connects the Clerk account to the PokéOS database.

---

# Authenticated App Layout

Authenticated users should see the main PokéOS app shell.

The app shell includes:

- Sidebar navigation on desktop
- Bottom navigation on mobile
- Topbar
- Search
- Notification icon
- Profile menu

---

# Profile Menu

The profile menu should include:

- View Profile
- Settings
- Logout

Future options may include:

- Account security
- Connected accounts
- Privacy controls
- Billing, if ever needed

---

# Error States

Authentication should handle common errors clearly.

Examples:

- Invalid login
- Expired session
- Missing user record
- Network issue
- Failed account creation

Users should see simple messages, not technical errors.

Example:

```text
Something went wrong while signing you in. Please try again.
```

---

# Security Rules

PokéOS should follow these security rules:

- Never store passwords in the PokéOS database
- Keep database access server-side
- Protect private routes
- Validate user input
- Store secrets in environment variables
- Never commit API keys
- Use HTTPS in production
- Keep user data linked to the correct authenticated user

---

# Environment Variables

Expected authentication environment variables:

```text
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
```

These should be stored in `.env.local` during development and in Vercel environment variables for production.

---

# Phase 1 Authentication Scope

Phase 1 should include:

- Sign up
- Login
- Logout
- Protected routes
- Local user record creation
- Trainer profile creation
- User settings creation
- Redirects after login and logout

---

# Not Included Yet

The following features should not be built in the first authentication pass:

- Two-factor authentication
- Billing
- User roles
- Admin accounts
- Team accounts
- Public profile sharing
- Advanced privacy controls

These can be added later if required.

---

# Success Criteria

The authentication flow is complete when:

- A user can sign up
- A user can log in
- A user can log out
- Protected pages require authentication
- A local PokéOS user record is created
- A default trainer profile is created
- A default settings record is created
- The user is redirected to the dashboard after login
- The user is redirected away from private pages when logged out

---

# Notes

Authentication should stay simple in Phase 1.

Clerk should handle identity and sessions.

PokéOS should focus on storing and managing app-specific user data.
