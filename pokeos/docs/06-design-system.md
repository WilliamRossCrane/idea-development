# PokéOS Design System

> **Version:** 0.2.0  
> **Status:** Draft  
> **Last Updated:** 1 July 2026

---

# Purpose

This document defines the visual identity and user interface standards for PokéOS.

The goal is to ensure every screen, component and interaction feels consistent regardless of which application the user is using.

The design system should evolve alongside the project while maintaining a unified experience.

---

# Design Philosophy

PokéOS should feel like a premium desktop and mobile operating system built specifically for Pokémon fans.

The experience should be:

- Clean
- Modern
- Friendly
- Fast
- Consistent
- Highly visual

The interface should feel approachable for casual users while remaining powerful enough for experienced collectors and competitive players.

---

# Design Inspiration

PokéOS draws inspiration from:

- Pokémon TCG Pocket
- Apple iOS
- macOS
- Notion

PokéOS should establish its own visual identity.

---

# Core Design Principles

## Simplicity

Every screen should focus on the user's primary task.

Avoid unnecessary clutter.

---

## Consistency

Buttons, cards, icons, colours and layouts should behave consistently throughout the platform.

---

## Information First

Important information should always be immediately visible.

Users should not need to search for essential information.

---

## Responsive

Every interface should work seamlessly across:

- Desktop
- Tablet
- Mobile

---

# Components

Components are reusable building blocks used throughout PokéOS.

The component library should be designed with a React/Next.js structure in mind. Each component should be reusable, easy to understand and consistent across desktop and mobile layouts.

Components should support:

- Reusability
- Accessibility
- Clear naming
- Responsive behaviour
- Loading states
- Empty states
- Error states
- Consistent spacing
- Consistent styling

---

## Component Library

The Phase 1 component library should focus only on components required for the MVP.

Phase 1 includes:

- Dashboard
- Pokédex
- Team Builder
- TCG Tracker / TCG Vault
- Profile
- Settings

Future components for Pokémon GO, community, market, quests and advanced features should not be prioritised until later phases.

---

## Core Layout Components

### AppShell

The main layout wrapper for the authenticated PokéOS application.

Used for:

- Sidebar layout
- Top navigation
- Main content area
- Responsive mobile layout

Expected areas:

- Sidebar
- Topbar
- Page content
- Mobile bottom navigation

---

### Sidebar

Desktop navigation component.

Should include:

- Logo
- Primary navigation links
- Active state
- User profile card
- Settings access

Phase 1 sidebar items:

- Dashboard
- Pokédex
- Team Builder
- TCG Tracker
- Profile
- Settings

---

### Topbar

Top navigation area for desktop layouts.

Should include:

- Search bar
- Notification icon
- User profile menu
- Optional keyboard shortcut indicator

---

### MobileHeader

Top header for mobile layouts.

Should include:

- Logo
- Notification icon
- Profile avatar or menu button

---

### BottomNavigation

Primary mobile navigation component.

Phase 1 mobile navigation items:

- Home
- Dex
- Teams
- TCG
- Profile

Settings should be accessible through Profile or a menu.

---

## Core UI Components

### Button

Used for primary user actions.

Types:

- Primary
- Secondary
- Tertiary
- Destructive
- Icon Button

States:

- Default
- Hover
- Active
- Focus
- Loading
- Disabled

Buttons should always use clear labels.

---

### Card

Cards are the primary content container.

Cards should contain:

- Clear heading
- Supporting content
- Optional actions
- Consistent spacing

Examples:

- Dashboard Widget
- Pokémon Card
- Collection Summary
- Team Snapshot
- Recent Activity
- TCG Set Preview

---

### Input

Used for user-entered data.

Examples:

- Search input
- Profile name input
- Team name input
- Filter fields

States:

- Default
- Focus
- Error
- Disabled

---

### SearchBar

Global search component.

Users should be able to quickly search:

- Pokémon
- Cards
- Teams
- Collections

For Phase 1, search should focus on:

- Pokédex search
- TCG card search
- Team search

---

### Badge

Used to show small pieces of status information.

Examples:

- Balanced
- New
- Complete
- Owned
- Favourite
- Draft

Badges should be short and easy to scan.

---

### ProgressBar

Used to show user progress.

Examples:

- XP progress
- Collection progress
- Set completion
- Team power

Progress bars should include a label or supporting text so the meaning is clear.

---

### Avatar

Used for trainer profile images.

Avatar should support:

- Default placeholder
- Uploaded image
- Selected trainer icon
- Online/active indicator where needed

---

### Icon

Icons should be used consistently across the platform.

Icons should be:

- Simple
- Rounded
- Consistent
- Recognisable

Avoid mixing multiple icon styles.

---

## Dashboard Components

### WelcomeCard

Large dashboard card used to greet the user.

Should include:

- User name
- Short welcome message
- Light visual background
- Optional featured character or companion-style image

---

### AppLauncher

Displays the main PokéOS tools.

Phase 1 launcher items:

- Pokédex
- Team Builder
- TCG Tracker
- Collection / TCG Vault

Optional:

- More features coming soon

The app launcher should not show future-phase tools during Phase 1.

---

### AppLauncherItem

Reusable item used inside the AppLauncher.

Should include:

- Icon
- App name
- Short description
- Active/hover state

---

### TeamSnapshot

Shows a quick summary of the user's current team.

Should include:

- Six team slots
- Team status
- Team power
- Link to manage team

---

### CollectionProgress

Shows card collection progress.

Should include:

- Set name
- Cards owned
- Total cards
- Percentage complete
- Progress bar
- Link to view collection

---

### RecentActivity

Shows recent user actions.

Examples:

- Added card to collection
- Built a new team
- Updated profile
- Completed Pokédex entry

Each activity item should include:

- Icon
- Description
- Timestamp

---

### LatestTCGSet

Shows the latest or featured TCG set.

Should include:

- Set image or original card-style artwork
- Set name
- Release date
- Total cards
- Secret rares
- Link to view set

---

## Pokédex Components

### PokemonSearch

Search and filter component for the Pokédex.

Should support:

- Name search
- Type filter
- Generation filter

---

### PokemonCard

Small preview card for a Pokémon.

Should include:

- Image
- Name
- Number
- Type badges

---

### PokemonDetailPanel

Detailed Pokémon information view.

Should include:

- Stats
- Type
- Abilities
- Evolution information
- Moves summary
- Add to team action

---

## Team Builder Components

### TeamCard

Preview card for a saved team.

Should include:

- Team name
- Team Pokémon preview
- Team status
- Last updated date

---

### TeamSlot

Represents one Pokémon slot in a team.

Should support:

- Empty state
- Filled state
- Remove action
- Edit action

---

### TeamAnalysisPanel

Shows basic team analysis.

Phase 1 analysis should include:

- Type coverage
- Weakness summary
- Team balance status

Keep Phase 1 analysis simple.

---

## TCG Tracker / Vault Components

### CardSearch

Search component for TCG cards.

Should support:

- Card name
- Set
- Rarity

---

### TCGCardPreview

Small card preview component.

Should include:

- Card image
- Name
- Set
- Rarity
- Owned status

---

### CollectionSummary

Shows overall collection progress.

Should include:

- Cards owned
- Total cards
- Sets tracked
- Completion percentage

---

### SetProgressCard

Shows progress for a specific TCG set.

Should include:

- Set name
- Cards owned
- Total cards
- Progress bar
- View set action

---

## Profile Components

### TrainerProfileCard

Shows user profile information.

Should include:

- Avatar
- Trainer name
- Level
- XP progress
- Favourite Pokémon
- Favourite region

---

### ProfileStatCard

Small stat card used on the profile page.

Examples:

- Teams created
- Cards collected
- Favourite Pokémon
- Sets completed

---

## Settings Components

### SettingsSection

Groups related settings together.

Examples:

- Account
- Appearance
- Notifications
- Privacy

---

### ToggleSetting

Used for simple on/off settings.

Examples:

- Dark mode
- Email notifications
- Profile visibility

---

# Navigation

Desktop:

- Left Sidebar

Mobile:

- Bottom Navigation

Navigation should always display:

- Icon
- Label
- Active state

Navigation should be predictable and consistent across the application.

---

# Search

Search should be globally available throughout PokéOS.

Users should be able to quickly search:

- Pokémon
- Cards
- Teams
- Collections

---

# Icons

Icons should be:

- Simple
- Rounded
- Consistent
- Recognisable

Avoid mixing multiple icon styles.

Icons should support the same visual style across:

- Sidebar
- App launcher
- Bottom navigation
- Cards
- Empty states

---

# Colour Philosophy

Colours should communicate meaning rather than decoration.

Examples:

## Success

- Completed
- Owned
- Active

## Warning

- Expiring
- Missing
- Attention Required

## Danger

- Delete
- Remove
- Critical Error

## Information

- Tips
- News
- Updates

---

# Typography

## Headings

Large, bold and easy to scan.

## Body

Highly readable.

Avoid decorative fonts.

---

# Spacing

Use consistent spacing throughout the application.

## Small

- 8px

## Medium

- 16px

## Large

- 24px

## Extra Large

- 32px

---

# Corner Radius

Rounded corners should be used consistently.

## Cards

- Medium Radius

## Buttons

- Medium Radius

## Inputs

- Medium Radius

---

# Shadows

Use soft shadows to separate content without becoming distracting.

Avoid heavy drop shadows.

---

# Animations

Animations should be:

- Fast
- Smooth
- Purposeful

Examples:

- Hover effects
- Card expansion
- Page transitions
- Loading indicators

Avoid excessive animations.

---

# Accessibility

The design system should support:

- Keyboard navigation
- Screen readers
- Colour contrast
- Responsive text sizing
- Clear focus states

---

# Phase 1 Component Priority

The first components to design and build should be:

1. AppShell
2. Sidebar
3. Topbar
4. MobileHeader
5. BottomNavigation
6. Button
7. Card
8. SearchBar
9. AppLauncher
10. AppLauncherItem
11. WelcomeCard
12. TeamSnapshot
13. CollectionProgress
14. RecentActivity
15. LatestTCGSet
16. TrainerProfileCard
17. SettingsSection

These components are enough to support the Phase 1 dashboard and core navigation.

---

# Design Rule

Every new screen, component and interaction should follow this principle:

> **If it doesn't improve clarity, consistency or usability, it shouldn't be added.**
