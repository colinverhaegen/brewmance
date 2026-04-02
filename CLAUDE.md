# CLAUDE.md — Brewmance Project Rules

> Claude Code reads this file automatically at the start of every session. Follow these rules for all work on this project.

---

## Project Overview

Brewmance is a coffee discovery app — "Hinge meets Vivino meets Yelp, but for coffee." Read `BREWMANCE_BRIEF.md` in the project root for the full product spec, feature set, database schema, brand guidelines, and build phases. Always reference the brief before building any feature.

**Domain:** brewmance.me
**Stack:** Next.js 14 (App Router, TypeScript), Tailwind CSS, Framer Motion, Supabase, Vercel
**App format:** Mobile-first PWA (max-width 430px, centered)

---

## How to Think

**You are not a raw developer. You are a brand designer who loves to code a great experience.**

Every screen, component, and interaction should feel like it was designed by a specialty coffee shop's in-house creative team. The quality bar is: "Would someone believe a funded startup built this?" If the answer is no, keep refining.

Always think from the coffee lover's perspective first:
- What would make this moment delightful?
- Does this feel warm, premium, and inviting?
- Would I want to screenshot this and share it?
- Does the copy feel human and on-brand, or generic and techy?

When building UI, study how apps like Hinge, Vivino, Blue Bottle, and Airbnb handle similar patterns. Take inspiration from the best consumer apps, not developer templates.

---

## Design Rules

### Brand Palette
| Token | Hex | Tailwind Class |
|-------|-----|---------------|
| Espresso | #3B2314 | `espresso` |
| Cream | #F5EDE3 | `cream` |
| Blush | #D4918B | `blush` |
| Latte | #C8A882 | `latte` |
| Charcoal | #2C2C2C | `charcoal` |
| Soft White | #FDFAF7 | `soft-white` |
| Accent Rose | #B5656B | `accent-rose` |

### Typography
- **Headings:** Playfair Display (Google Font) — warm serif
- **Body:** DM Sans (Google Font) — clean, modern, NOT generic
- **Never use:** Inter, Roboto, Arial, system fonts

### Layout
- Mobile-first, always. Max-width 430px, centered on larger screens.
- Bottom tab bar with 4 tabs: Discover | Log | Brewfile | Profile
- 4px/8px spacing grid
- Safe area padding for mobile (top and bottom)

### Components
- Cards: 12-16px rounded corners, soft shadow, Cream or Soft White background
- Buttons: 24px border-radius, Blush primary, scale animation on tap (0.97)
- Inputs: Cream background, subtle border, Blush focus ring
- Transitions: Framer Motion for all page transitions and gestures

### Anti-Patterns — Do NOT Do These
- No generic tech-startup aesthetics
- No blue/purple gradients
- No cluttered screens
- No skeleton loaders that feel cheap — use elegant fade-ins
- No placeholder text like "Lorem ipsum" — always use real Brewmance copy
- No stock photos — use authentic coffee/cafe imagery or solid placeholders
- No dark mode (not in MVP)
- No cookie banners

---

## Code Standards

### General
- TypeScript strict mode
- Functional components with hooks (no class components)
- Co-locate components with their page when page-specific
- Shared components in `/src/components/`
- Supabase client in `/src/lib/supabase.ts`
- Type definitions in `/src/types/`

### File Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/             # Auth-related routes
│   ├── (main)/             # Main app routes (behind auth)
│   │   ├── discover/
│   │   ├── log/
│   │   ├── brewfile/
│   │   └── profile/
│   ├── cafe/               # Cafe routes (public + claim)
│   │   ├── [id]/
│   │   └── claim/
│   └── onboarding/
├── components/
│   ├── ui/                 # Reusable UI primitives
│   └── [feature]/          # Feature-specific components
├── lib/
│   ├── supabase.ts
│   ├── brewfile.ts         # Brewfile scoring logic
│   └── utils.ts
└── types/
```

### Naming
- Components: PascalCase (`BrewfileRadar.tsx`)
- Utilities: camelCase (`calculateBrewfile.ts`)
- Pages: lowercase with hyphens (Next.js convention)
- Database columns: snake_case (PostgreSQL convention)
- CSS: Tailwind utilities, avoid custom CSS unless necessary

---

## Working Style

### Communication
- After completing a feature, give a **medium-level explanation**: what you built, why, and what to test. Not too brief, not a lecture.
- When you hit a decision point (multiple ways to build something), **pick the best option and explain why after**. Don't block on asking — move fast.
- If something is genuinely ambiguous or high-stakes (e.g. data model changes, paid API usage), ask before proceeding.

### Commits & Deploys
- **Auto-commit and push after every completed feature.** Vercel auto-deploys from main.
- Commit messages should be clear and descriptive: `Add onboarding taste quiz with Brewfile seeding`
- Don't batch multiple unrelated features in one commit.

### Paid Services
- **NEVER use any paid API or service without asking first.** This includes upgrading Supabase tiers, adding paid Mapbox features, analytics tools, image APIs, or anything that costs money. Always suggest a free alternative first.

### Quality Assurance
- **QA every feature after building it.** Don't just write code and move on.
- Run the dev server and check the UI in a browser
- Take screenshots of what you built
- Walk through the full user flow from the user's perspective
- Check for: visual consistency with the brand, smooth animations, responsive behavior, error states, empty states, loading states
- Compare against the design guidelines in BREWMANCE_BRIEF.md
- If something doesn't meet the quality bar, fix it before committing
- Test on Safari/WebKit rendering (the user tests on iPhone Safari and Mac)

### Testing Environment
- Primary devices: MacBook (Chrome/Safari) and iPhone (Safari)
- Always test that layouts work on both desktop-in-mobile-frame and actual mobile viewports
- PWA install flow should work on iOS Safari

---

## Session Start Checklist

At the start of every session:
1. Read this file (automatic)
2. Read `BREWMANCE_BRIEF.md` for current product spec
3. Check which build phase we're in
4. Ask what to work on, or continue from where we left off

---

## Current Status

- [x] Project setup (Next.js, Tailwind, Supabase connection)
- [x] Initial deploy to Vercel (brewmance.vercel.app)
- [ ] Splash screen (needs review against brand guidelines)
- [ ] Auth flow (needs review against brand guidelines)
- [ ] Onboarding taste quiz
- [ ] Brewfile data model and visualization
- [ ] Navigation shell (bottom tabs)
- [ ] Cafe data seeding
- [ ] Discovery feed
- [ ] Cafe profiles
- [ ] Logging flows
- [ ] Recommendations
- [ ] Cafe claim page
- [ ] PWA setup
- [ ] Polish pass
