-- ============================================================
-- Brewmance Database Schema
-- ============================================================

-- Clean up partial state from any failed prior run
drop table if exists saves cascade;
drop table if exists logs_homebrew cascade;
drop table if exists logs_cafe cascade;
drop table if exists cafe_drinks cascade;
drop table if exists cafes cascade;
drop table if exists neighborhoods cascade;
drop table if exists flavor_tags cascade;
drop table if exists brewfiles cascade;
drop table if exists users cascade;
drop type if exists neighborhood_area;

-- ============================================================
-- ENUM: neighborhood areas
-- ============================================================
create type neighborhood_area as enum (
  'tiong_bahru',
  'tanjong_pagar_telok_ayer',
  'kampong_glam_bugis',
  'orchard_river_valley',
  'holland_village_dempsey',
  'joo_chiat_katong',
  'duxton',
  'robertson_quay',
  'one_north',
  'novena'
);

-- ============================================================
-- TABLE: users
-- ============================================================
create table users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  onboarding_completed boolean not null default false
);

alter table users enable row level security;

create policy "Users can read own profile"
  on users for select using (auth.uid() = id);

create policy "Users can insert own profile"
  on users for insert with check (auth.uid() = id);

create policy "Users can update own profile"
  on users for update using (auth.uid() = id);

-- ============================================================
-- TABLE: brewfiles
-- ============================================================
create table brewfiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  drink_type jsonb not null default '[]'::jsonb,
  roast_profile float not null default 0.5,
  flavor_palette jsonb not null default '[]'::jsonb,
  intensity float not null default 0.5,
  milk_extras jsonb not null default '[]'::jsonb,
  bean_origin jsonb not null default '[]'::jsonb,
  brew_method jsonb not null default '[]'::jsonb,
  cafe_vibe jsonb not null default '[]'::jsonb,
  ritual_pattern jsonb not null default '[]'::jsonb,
  adventurousness float not null default 0.5,
  total_logs integer not null default 0,
  last_updated timestamptz not null default now(),
  unique(user_id)
);

alter table brewfiles enable row level security;

create policy "Users can read own brewfile"
  on brewfiles for select using (auth.uid() = user_id);

create policy "Users can insert own brewfile"
  on brewfiles for insert with check (auth.uid() = user_id);

create policy "Users can update own brewfile"
  on brewfiles for update using (auth.uid() = user_id);

-- ============================================================
-- TABLE: neighborhoods (reference)
-- ============================================================
create table neighborhoods (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  display_name text not null,
  latitude float not null,
  longitude float not null,
  is_seed boolean not null default false
);

alter table neighborhoods enable row level security;

create policy "Neighborhoods are publicly readable"
  on neighborhoods for select using (true);

-- ============================================================
-- TABLE: cafes
-- ============================================================
create table cafes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  address text,
  neighborhood neighborhood_area,
  latitude float,
  longitude float,
  google_place_id text unique,
  google_rating float,
  photos jsonb not null default '[]'::jsonb,
  vibe_tags jsonb not null default '[]'::jsonb,
  drink_types jsonb not null default '[]'::jsonb,
  specialty_flags jsonb not null default '[]'::jsonb,
  hours jsonb,
  website text,
  instagram text,
  claimed boolean not null default false,
  claimed_by uuid references users(id) on delete set null,
  total_checkins integer not null default 0,
  avg_rating float not null default 0,
  created_at timestamptz not null default now()
);

alter table cafes enable row level security;

create policy "Cafes are publicly readable"
  on cafes for select using (true);

create policy "Cafe owners can update their claimed cafe"
  on cafes for update using (auth.uid() = claimed_by);

-- ============================================================
-- TABLE: cafe_drinks
-- ============================================================
create table cafe_drinks (
  id uuid primary key default gen_random_uuid(),
  cafe_id uuid not null references cafes(id) on delete cascade,
  name text not null,
  drink_type text,
  description text,
  price numeric(8,2),
  flavor_tags jsonb not null default '[]'::jsonb
);

alter table cafe_drinks enable row level security;

create policy "Cafe drinks are publicly readable"
  on cafe_drinks for select using (true);

-- ============================================================
-- TABLE: logs_cafe
-- ============================================================
create table logs_cafe (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  cafe_id uuid not null references cafes(id) on delete cascade,
  drink_id uuid references cafe_drinks(id) on delete set null,
  drink_name text,
  rating float not null check (rating >= 1 and rating <= 5),
  flavor_tags jsonb not null default '[]'::jsonb,
  notes text,
  photo_url text,
  is_quick_log boolean not null default false,
  created_at timestamptz not null default now()
);

alter table logs_cafe enable row level security;

create policy "Users can read own cafe logs"
  on logs_cafe for select using (auth.uid() = user_id);

create policy "Users can insert own cafe logs"
  on logs_cafe for insert with check (auth.uid() = user_id);

create policy "Users can update own cafe logs"
  on logs_cafe for update using (auth.uid() = user_id);

create policy "Users can delete own cafe logs"
  on logs_cafe for delete using (auth.uid() = user_id);

-- ============================================================
-- TABLE: logs_homebrew
-- ============================================================
create table logs_homebrew (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  bean_name text not null,
  bean_brand text,
  bean_origin text,
  brew_method text not null,
  rating float not null check (rating >= 1 and rating <= 5),
  flavor_tags jsonb not null default '[]'::jsonb,
  notes text,
  grind_size text,
  water_temp text,
  ratio text,
  photo_url text,
  created_at timestamptz not null default now()
);

alter table logs_homebrew enable row level security;

create policy "Users can read own homebrew logs"
  on logs_homebrew for select using (auth.uid() = user_id);

create policy "Users can insert own homebrew logs"
  on logs_homebrew for insert with check (auth.uid() = user_id);

create policy "Users can update own homebrew logs"
  on logs_homebrew for update using (auth.uid() = user_id);

create policy "Users can delete own homebrew logs"
  on logs_homebrew for delete using (auth.uid() = user_id);

-- ============================================================
-- TABLE: flavor_tags (reference)
-- ============================================================
create table flavor_tags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  category text not null,
  emoji text
);

alter table flavor_tags enable row level security;

create policy "Flavor tags are publicly readable"
  on flavor_tags for select using (true);

-- ============================================================
-- TABLE: saves (Want to Try bookmarks)
-- ============================================================
create table saves (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  cafe_id uuid not null references cafes(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, cafe_id)
);

alter table saves enable row level security;

create policy "Users can read own saves"
  on saves for select using (auth.uid() = user_id);

create policy "Users can insert own saves"
  on saves for insert with check (auth.uid() = user_id);

create policy "Users can delete own saves"
  on saves for delete using (auth.uid() = user_id);

-- ============================================================
-- INDEXES
-- ============================================================
create index idx_brewfiles_user_id on brewfiles(user_id);
create index idx_cafes_neighborhood on cafes(neighborhood);
create index idx_cafes_location on cafes(latitude, longitude);
create index idx_cafe_drinks_cafe_id on cafe_drinks(cafe_id);
create index idx_logs_cafe_user_id on logs_cafe(user_id);
create index idx_logs_cafe_cafe_id on logs_cafe(cafe_id);
create index idx_logs_cafe_created_at on logs_cafe(created_at desc);
create index idx_logs_homebrew_user_id on logs_homebrew(user_id);
create index idx_logs_homebrew_created_at on logs_homebrew(created_at desc);
create index idx_saves_user_id on saves(user_id);
create index idx_flavor_tags_category on flavor_tags(category);
