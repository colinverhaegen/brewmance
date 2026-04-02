# Brewmance — Product & Build Brief

> This is the single source of truth for building Brewmance. Claude Code should read this file before every build session.

---

## 1. What Is Brewmance?

Brewmance is a coffee discovery app — "Hinge meets Vivino meets Yelp, but for coffee."

The goal is for coffee lovers to have a place where they can discover and log what they actually like, find what to try next, and build their "Brewfile" — their personal coffee profile.

**One-liner:** "Fall in love with your next cup."

### Core Loop (Flywheel)

Discover → Log → Learn → Match → Repeat

Each loop deepens the Brewfile, improves recommendations, and creates more reasons to engage (visit cafes, try new drinks, order beans, share socially). The flywheel should trigger consumption, social interaction, and eventually commerce.

### What Brewmance Is NOT (Yet)

- Not a commerce platform (no ordering in MVP)
- Not a social network (no following/sharing in MVP)
- Not a cafe review site (ratings exist but it's about personal taste, not crowd scores)

---

## 2. Target Users

### Persona 1: The Cafe Explorer (Primary)
- Visits 3-5 cafes a week
- Loves the experience — atmosphere, latte art, discovering new spots
- Posts about cafes on social media
- May or may not know their taste technically, but has strong opinions
- Wants: discovery, logging visits, building their coffee identity

### Persona 2: The Curious Casual (Primary)
- Enjoys good coffee but hasn't mapped their own palate
- Knows they like "strong" or "smooth" but can't articulate beyond that
- Sees Brewmance as a fun way to explore and learn
- Wants: guided taste discovery, education through doing

### Persona 3: The Home Brewer (Secondary — lightweight in MVP)
- Makes coffee at home, experiments with beans and methods
- Wants to track what they brew and learn from it
- Lacks tools to log and discover beans
- MVP scope: can log home brews (beans, method, taste notes, rating)
- NOT in MVP: bean ordering, equipment recommendations

---

## 3. Market

### Launch Market: Singapore

**Seed Neighborhoods (by coffee density):**
1. Tiong Bahru — specialty coffee epicenter, walkable, high Instagram activity
2. Tanjong Pagar / Telok Ayer — massive CBD lunch crowd, high cafe density
3. Kampong Glam / Bugis — strong indie cafe scene, younger demographic
4. Orchard / River Valley — mix of premium and indie, high foot traffic
5. Holland Village / Dempsey — weekend crowd, brunch culture

**Target:** ~150-250 cafes seeded across these 5 areas.

**Expansion areas (later):** Joo Chiat, Katong, Duxton, Robertson Quay, One-North, Novena.

---

## 4. The Brewfile (10-Dimension Coffee Profile)

The Brewfile is the heart of the product. It's a user's "Coffee DNA" — built from onboarding quiz answers and refined with every log.

### Taste Dimensions (what you like)
1. **Drink Type** — espresso, flat white, pour over, cold brew, long black, latte, cappuccino, filter, etc.
2. **Roast Profile** — light ↔ medium ↔ dark (spectrum/slider)
3. **Flavor Palette** — chocolate, fruity, nutty, floral, spicy, earthy, citrus, caramel, berry, tropical, etc.
4. **Intensity** — mild ↔ strong (spectrum/slider)
5. **Milk & Extras** — black, oat milk, regular milk, almond, sweetened, flavored, etc.

### Source Dimensions (where it comes from)
6. **Bean Origin** — Ethiopian, Colombian, Indonesian, Guatemalan, Kenyan, Brazilian, Blend, etc.
7. **Brew Method** — espresso machine, pour over, AeroPress, French press, cold brew, moka pot, etc.

### Experience Dimensions (how you enjoy it)
8. **Cafe Vibe** — minimalist, cozy, work-friendly, social/buzzy, outdoor, aesthetic/Instagram, rustic, industrial, etc.
9. **Ritual Pattern** — morning routine, afternoon pick-me-up, weekend explorer, social occasion, post-meal
10. **Adventurousness** — creature of habit ↔ always trying something new (spectrum)

### How the Brewfile Works
- Seeded during onboarding (taste quiz)
- Passively refined with every cafe visit log and home brew log
- Over time, passive data overrides quiz answers
- Dimensions 1-7 drive **coffee matching**
- Dimensions 8-9 drive **cafe matching**
- Dimension 10 calibrates **how far recommendations push from comfort zone**

---

## 5. MVP Feature Set

### Onboarding
- Sign up / login (email + Google via Supabase Auth)
- Taste quiz (6-8 interactive questions that seed the initial Brewfile)

**Taste Quiz Design:**
1. How do you take your coffee? → seeds Milk & Extras, Drink Type
2. Pick your vibe (swipeable cafe photos) → seeds Cafe Vibe
3. Light or dark? (roast slider) → seeds Roast Profile
4. Flavor roulette (pick 3 flavor cards from a visual grid) → seeds Flavor Palette
5. How strong? (intensity slider) → seeds Intensity
6. Morning ritual or afternoon adventure? → seeds Ritual Pattern
7. Creature of habit or always exploring? → seeds Adventurousness
8. Pick a region (optional, can skip) → seeds Bean Origin

The quiz should feel fun, visual, and swipeable — not like a boring form. Think Hinge onboarding energy.

### Discovery
- Browse/swipe cafes and drinks near you (card-based, swipeable)
- Personalized recommendations based on Brewfile
- Filter by: neighborhood, vibe, drink type, distance
- Map view (Mapbox) showing cafes with pins
- "Want to try" bookmark/save functionality

### Logging
- **Log a cafe visit:**
  - Select cafe (search or "I'm here" location detect)
  - Select or add drink
  - Rate (1-5 scale)
  - Add flavor tags (tap to select from visual grid)
  - Optional: photo, text notes
  - Quick log (3 taps) vs. detailed log options
- **Log a home brew:**
  - Bean name / brand
  - Brew method (select from visual icons)
  - Taste notes and rating
  - Optional: grind size, water temp, ratio
- Log history / activity feed
- Brewfile auto-updates after each log

### Brewfile Screen
- Visual profile showing all 10 dimensions
- Radar chart or visual profile card
- Evolves visibly over time with more logs
- Shareable (generate image card for Instagram/stories)

### Cafe Profiles
- Cafe info: name, photos, hours, location, vibe tags
- Menu highlights and drink types
- Community ratings and total check-ins
- Map location
- "Want to try" save button

### Cafe Claim Page (Web — Minimal)
- Cafe owner enters details, verifies ownership (email verification)
- Edit profile: update photos, hours, menu highlights, description
- See basic stats: total check-ins, average rating

### NOT in MVP (Coming Soon)
- Bean ordering / commerce
- Social features (following, sharing, coffee meetups)
- Full cafe analytics dashboard
- Push notifications
- Voice logging

---

## 6. Brand & Design Direction

### Positioning
"Hinge meets Blue Bottle" — warm, romantic, classy, obsessed with helping you find your perfect cup.

### Color Palette
| Name | Hex | Usage |
|------|-----|-------|
| Espresso | #3B2314 | Primary dark, headers, strong text |
| Cream | #F5EDE3 | Primary background, cards |
| Blush | #D4918B | Primary accent, CTAs, highlights |
| Latte | #C8A882 | Secondary accent, warm highlights |
| Charcoal | #2C2C2C | Body text |
| Soft White | #FDFAF7 | Page backgrounds |
| Accent Rose | #B5656B | Hover states, secondary buttons |

### Typography
- **Headings:** Warm serif — Playfair Display (or similar: DM Serif Display, Lora)
- **Body:** Clean sans — DM Sans, Outfit, or similar (NOT Inter, Roboto, or Arial)
- **Accents/Labels:** Can use the sans in caps or small caps for tags, labels, navigation

### Tone of Voice
- Playful but not juvenile
- Knowledgeable but not pretentious
- Warm and inviting, like a great barista
- Uses coffee metaphors naturally
- Microcopy examples:
  - Onboarding: "Let's find your perfect cup"
  - Empty state: "Your Brewfile is a blank canvas — time to explore"
  - After logging: "Another cup in the books. Your taste is evolving."
  - Recommendation: "Based on your love for fruity Ethiopian pours, you might fall for this..."

### Design Principles
- Mobile-first always (max-width 430px, centered on desktop)
- Card-based UI (swipeable, stackable)
- Generous whitespace
- Soft shadows and rounded corners
- Photography-forward (cafe photos, drink photos, bean close-ups)
- Animations should feel smooth and organic (Framer Motion)
- The app should feel premium, not like a hackathon project
- Think: if a specialty coffee shop made an app, this is what it would look and feel like

### Anti-Patterns (Do NOT do these)
- No generic tech-startup aesthetics (no blue gradients, no corporate feel)
- No cluttered screens — every screen should have one clear purpose
- No skeleton loading that feels cheap — use elegant transitions
- No aggressive push for features — the app should feel inviting, not salesy
- No generic stock photos — use authentic coffee/cafe imagery

---

## 7. Tech Stack

| Layer | Tool |
|-------|------|
| Framework | Next.js 14 (App Router, TypeScript) |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui + custom components |
| Animations | Framer Motion |
| Maps | Mapbox GL JS |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (email + Google) |
| File Storage | Supabase Storage |
| Hosting | Vercel |
| Domain | brewmance.me |

### App Format
Mobile-first Progressive Web App (PWA). Works in browser, installable on phones. Native app conversion comes later.

### Database Schema (Key Tables)

**users**
- id (uuid, primary key, from Supabase Auth)
- email
- display_name
- avatar_url
- created_at
- onboarding_completed (boolean)

**brewfiles**
- id (uuid)
- user_id (foreign key → users)
- drink_type (jsonb — array of preferences with weights)
- roast_profile (float — 0 to 1 scale, light to dark)
- flavor_palette (jsonb — array of flavor tags with weights)
- intensity (float — 0 to 1 scale)
- milk_extras (jsonb — array of preferences)
- bean_origin (jsonb — array of origins with weights)
- brew_method (jsonb — array of methods with weights)
- cafe_vibe (jsonb — array of vibe tags with weights)
- ritual_pattern (jsonb — array of patterns with weights)
- adventurousness (float — 0 to 1 scale)
- total_logs (integer)
- last_updated (timestamp)

**cafes**
- id (uuid)
- name
- description
- address
- neighborhood (enum — the 5 seed areas + expansion)
- latitude, longitude
- google_place_id
- google_rating
- photos (jsonb — array of photo URLs)
- vibe_tags (jsonb — array of strings)
- drink_types (jsonb — array of drink categories served)
- specialty_flags (jsonb — pour over, single origin, latte art, etc.)
- hours (jsonb)
- website, instagram
- claimed (boolean)
- claimed_by (foreign key → users, nullable)
- total_checkins (integer)
- avg_rating (float)

**cafe_drinks**
- id (uuid)
- cafe_id (foreign key → cafes)
- name (e.g. "Flat White", "Ethiopian Pour Over")
- drink_type (e.g. "flat_white", "pour_over")
- description
- price (nullable)
- flavor_tags (jsonb)

**logs_cafe**
- id (uuid)
- user_id (foreign key → users)
- cafe_id (foreign key → cafes)
- drink_id (foreign key → cafe_drinks, nullable)
- drink_name (text — in case drink not in database)
- rating (float — 1 to 5)
- flavor_tags (jsonb — user-selected tags)
- notes (text, nullable)
- photo_url (text, nullable)
- is_quick_log (boolean)
- created_at (timestamp)

**logs_homebrew**
- id (uuid)
- user_id (foreign key → users)
- bean_name (text)
- bean_brand (text, nullable)
- bean_origin (text, nullable)
- brew_method (text)
- rating (float — 1 to 5)
- flavor_tags (jsonb)
- notes (text, nullable)
- grind_size (text, nullable)
- water_temp (text, nullable)
- ratio (text, nullable)
- photo_url (text, nullable)
- created_at (timestamp)

**flavor_tags** (reference table)
- id (uuid)
- name (e.g. "Chocolate", "Fruity", "Nutty")
- category (e.g. "sweet", "fruit", "earth", "floral")
- emoji (optional, for UI)

**neighborhoods** (reference table)
- id (uuid)
- name (e.g. "Tiong Bahru")
- display_name
- latitude, longitude (center point)
- is_seed (boolean — true for initial 5)

**saves** (Want to Try bookmarks)
- id (uuid)
- user_id (foreign key → users)
- cafe_id (foreign key → cafes)
- created_at (timestamp)

---

## 8. Build Phases

### Phase 1: Foundation + Auth + Onboarding Quiz + Brewfile (Days 1-3)
- Project setup, Supabase connection, deployment pipeline ✅ (Done)
- Splash screen ✅ (Done)
- Auth flow (sign up / login)
- Onboarding taste quiz (6-8 interactive screens)
- Brewfile data model and initial scoring
- Brewfile visualization screen
- Bottom tab navigation shell

### Phase 2: Cafe Data + Discovery (Days 4-6)
- Seed cafe data via Google Places API
- Manual enrichment (vibe tags, drink highlights)
- Cafe profile pages
- Discovery feed (swipeable cards)
- Filters and search
- Map view with Mapbox
- "Want to try" bookmarks

### Phase 3: Logging (Days 7-8)
- Cafe visit logging flow
- Home brew logging flow
- Log history / activity feed
- Brewfile auto-update on each log

### Phase 4: Recommendations + Social Proof (Days 9-10)
- "You might love" — Brewfile-matched cafes/drinks
- "New for you" — edge-of-profile recommendations
- "Popular nearby" — trending check-ins
- "X people with similar taste liked this"
- Shareable Brewfile card (image generation for social)

### Phase 5: Cafe Claim + Polish (Days 11-12)
- Cafe claim and edit flow (web)
- UI polish pass (animations, transitions, empty states, error states)
- PWA setup (install prompt, app icon, splash screen)
- Investor demo account with pre-seeded data

### Phase 6: Testing + Launch (Days 13-14)
- Beta testing with 10-15 real users
- Bug fixes
- Analytics setup
- Final deploy to production domain
- Landing page with app screenshots

---

## 9. Design & UX Guidelines for Every Screen

### Layout
- Max-width: 430px, centered (mobile-first, but works on desktop too)
- Bottom tab bar navigation: Discover | Log | Brewfile | Profile
- Safe area padding for mobile (top and bottom)
- Consistent spacing scale based on 4px/8px grid

### Cards
- Rounded corners (12-16px radius)
- Soft shadow (0 2px 8px rgba(0,0,0,0.08))
- Cream (#F5EDE3) or Soft White (#FDFAF7) background
- Full-bleed photos on discovery cards

### Buttons
- Primary: Blush (#D4918B) background, white text, rounded (24px radius)
- Secondary: Cream (#F5EDE3) background, Espresso text, rounded
- Ghost: transparent, Espresso text, subtle border
- All buttons should have hover/tap states with slight scale animation

### Inputs
- Clean, minimal
- Cream background with subtle border
- Espresso text
- Blush focus ring
- Labels above inputs, not inside (placeholder text only for hints)

### Navigation
- Bottom tab bar: 4 tabs with icons (lucide-react) and labels
- Active tab: Blush icon + label
- Inactive: Charcoal with lower opacity
- Smooth transition on tab switch

### Transitions
- Page transitions: subtle slide or fade (Framer Motion)
- Card swipes: spring physics (like Tinder/Hinge)
- List items: staggered fade-in on load
- Buttons: gentle scale on tap (0.97)

---

## 10. Long-Term Vision (NOT for MVP, but keep in mind)

- Bean ordering and home delivery (commerce layer)
- Social features: follow friends, share discoveries, coffee meetups
- "Coffee dating" — match with people who have similar taste profiles
- Full cafe partner dashboard with analytics
- Roaster profiles and partnerships
- Subscription model: "Brewmance Autopilot" — auto-delivered beans matched to your Brewfile
- Voice logging
- Expansion to KL, Bangkok, Tokyo, Melbourne
- Native iOS and Android apps

---

## 11. Quality Bar

This MVP needs to feel like a real product, not a prototype. Investors and users will judge within 10 seconds.

**The test:** If someone opened this on their phone, would they believe a funded startup built it?

- Every screen should have a clear purpose
- Every interaction should feel smooth
- Every piece of copy should feel intentional
- Empty states should be helpful, not broken
- Loading states should be elegant
- The Brewfile visualization should be the "wow" moment
- The swipe experience should feel as good as Hinge

---

*This document is the source of truth. When in doubt, refer here.*
