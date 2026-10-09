# Chef Quest — Prototype

A click-through prototype of Chef Quest, a meal-planning app that helps people
find allergy-safe recipes, plan meals around what's already in their kitchen,
and compare grocery prices. Built for a Year 9 business studies project.

## How to open it

No install or build step needed — it's plain HTML/CSS/JS.

1. Double-click `index.html` (or right-click → Open with → your browser).
2. That's it. Everything runs in the browser, no server required.

To edit it, open the folder in any code editor (VS Code, etc.) and edit
`styles.css` for design or `script.js` for behaviour — refresh the browser
tab to see changes.

## What's in this folder

| File         | What it does                                                                                                                           |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| `index.html` | Page structure — the sidebar, topbar, and all seven screens                                                                            |
| `styles.css` | All visual design — colours, fonts, spacing                                                                                            |
| `script.js`  | All interactivity — navigation, the recipe database, filters, price comparison, meal plan, profile                                     |
| `AGENTS.md`  | Notes for an AI coding assistant (like Codex or Claude Code) picking this project up — read this before making changes with an AI tool |

## Features in this prototype

- **Dashboard** — recent recipes, grocery deals
- **Saved Recipes** — a twenty-recipe catalogue with Breakfast, Lunch, Dinner, Snack, and Dessert categories; combined category/dietary filters; multi-field search; and persistent save/unsave controls
- **Cupboard Scanner** — clearly marked **"Coming soon"**. Real ingredient recognition from a photo needs a camera + an image-recognition API, which is out of scope for a static prototype. The screen still shows, step by step, what it _will_ do once that's built
- **Weekly Meal Plan** — 7 days with selected recipes, cooking times, dietary tags, Change meal, Remove, View recipe, searchable recipe picking, allergy-aware filtering, and a live weekly summary
- **Automatic Shopping List** — generated from the recipe IDs selected in the weekly plan; shared ingredients are aggregated, linked back to every meal, and split into Need to Buy and Already Have
- **Estimated demo cost** — each needed ingredient uses the cheapest existing demo price and can disclose alternative store prices. Ownership changes update the list and total immediately.
- **Recipe search** — searches names, descriptions, categories, dietary tags, and ingredient names, so queries such as `chicken` and `pasta` find useful matches beyond titles.
- **Personalised Dashboard** — shows planned meals, shopping count, estimated demo cost, saved recipes, tonight's or the next planned meal, a shopping snapshot, and three transparent rule-based suggestions.
- **Add to meal plan** — save a recipe or open its detail page, choose a weekday, and Chef Quest updates the existing weekly plan and shopping list.
- **Recipe Detail** — every recipe has real ingredients, method steps, dietary-swap tips, and a price comparison panel. Ticking "already have this" removes it from the total cost live
- **Profile** — edit your name and allergies; saving updates the filters on Saved Recipes and Meal Plan to match
- **Local persistence** — profile details, allergy choices, saved recipes, pantry checks, store selections, and meal-plan swaps survive refreshes through browser `localStorage`. Use **Reset demo** in the sidebar to restore the starting state.

## Honest limitations (worth saying in the pitch)

- **Pricing is realistic demo data, not live.** A real version would need a
  deal with Woolworths/Coles/IGA or a grocery price-comparison data provider,
  since none of them offer a public live pricing API.
- **The scanner is a preview, not real image recognition.** It's built and
  labelled as a roadmap feature — a real version needs a camera input and an
  image-recognition model (see `AGENTS.md` for options).
- **Persistence is local to one browser** — this demo uses `localStorage`, so state is not shared between devices, browsers, or users. A real product would still need accounts and a backend database.
- **There is no live supermarket integration** — all grocery prices are prototype values and actual store prices may vary.
- **Recommendations are not AI** — they are simple profile-safe, unsaved, and unplanned recipe suggestions.

These are good, honest talking points for a business pitch: they show you've
thought about what's realistic for a prototype versus a shipped product.
