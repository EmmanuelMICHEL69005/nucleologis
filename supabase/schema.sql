-- NucléoLogis — Supabase SQL Schema
-- Run this in the Supabase SQL Editor (https://app.supabase.com → SQL Editor)

-- Enable pgcrypto for uuid generation
create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────
-- TYPES
-- ─────────────────────────────────────────────
create type user_role as enum ('travailleur', 'proprietaire', 'admin');
create type type_logement as enum ('studio', 'appartement', 'maison', 'chambre');
create type statut_reservation as enum ('en_attente', 'acceptee', 'refusee', 'annulee', 'terminee');

-- ─────────────────────────────────────────────
-- PROFILES (extends auth.users)
-- ─────────────────────────────────────────────
create table profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  email         text not null,
  full_name     text not null,
  role          user_role not null default 'travailleur',
  avatar_url    text,
  company       text,           -- entreprise prestataire (ex: ORANO, ENGIE)
  phone         text,
  verified      boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'travailleur')::user_role
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on profiles
  for each row execute procedure update_updated_at();

-- ─────────────────────────────────────────────
-- LISTINGS
-- ─────────────────────────────────────────────
create table listings (
  id                 uuid primary key default gen_random_uuid(),
  owner_id           uuid not null references profiles(id) on delete cascade,
  site               text not null,         -- 'tricastin', 'cruas', etc.
  site_name          text not null,
  type               type_logement not null,
  title              text not null,
  description        text not null default '',
  address            text not null,
  city               text not null,
  zip                text not null,
  distance_km        numeric(5,1) not null,
  surface_m2         int not null,
  bedrooms           int not null default 0,
  bathrooms          int not null default 1,
  price_week         int not null,          -- €/semaine
  price_month        int not null,          -- €/mois
  amenities          text[] not null default '{}',
  photos             text[] not null default '{}',
  available          boolean not null default true,
  available_from     date,
  min_duration_weeks int not null default 1,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create trigger listings_updated_at
  before update on listings
  for each row execute procedure update_updated_at();

-- ─────────────────────────────────────────────
-- RESERVATIONS
-- ─────────────────────────────────────────────
create table reservations (
  id                    uuid primary key default gen_random_uuid(),
  listing_id            uuid not null references listings(id) on delete restrict,
  tenant_id             uuid not null references profiles(id) on delete restrict,
  date_start            date not null,
  date_end              date not null,
  price_total           int not null,       -- total brut (€)
  statut                statut_reservation not null default 'en_attente',
  stripe_payment_intent text,
  message_initial       text,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  constraint date_order check (date_end > date_start)
);

create trigger reservations_updated_at
  before update on reservations
  for each row execute procedure update_updated_at();

-- ─────────────────────────────────────────────
-- MESSAGES
-- ─────────────────────────────────────────────
create table messages (
  id             uuid primary key default gen_random_uuid(),
  reservation_id uuid not null references reservations(id) on delete cascade,
  sender_id      uuid not null references profiles(id) on delete cascade,
  content        text not null,
  created_at     timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- REVIEWS
-- ─────────────────────────────────────────────
create table reviews (
  id             uuid primary key default gen_random_uuid(),
  listing_id     uuid not null references listings(id) on delete cascade,
  author_id      uuid not null references profiles(id) on delete cascade,
  reservation_id uuid not null references reservations(id) on delete cascade,
  rating         int not null check (rating between 1 and 5),
  comment        text not null default '',
  created_at     timestamptz not null default now(),
  unique (reservation_id)  -- one review per stay
);

-- ─────────────────────────────────────────────
-- VIEWS — avg rating per listing
-- ─────────────────────────────────────────────
create view listing_ratings as
  select
    listing_id,
    round(avg(rating)::numeric, 1) as avg_rating,
    count(*) as review_count
  from reviews
  group by listing_id;

-- ─────────────────────────────────────────────
-- INDEXES
-- ─────────────────────────────────────────────
create index listings_site_idx       on listings(site);
create index listings_type_idx       on listings(type);
create index listings_available_idx  on listings(available);
create index listings_owner_idx      on listings(owner_id);
create index reservations_tenant_idx on reservations(tenant_id);
create index reservations_listing_idx on reservations(listing_id);
create index messages_reservation_idx on messages(reservation_id);

-- ─────────────────────────────────────────────
-- ROW LEVEL SECURITY (RLS)
-- ─────────────────────────────────────────────
alter table profiles     enable row level security;
alter table listings     enable row level security;
alter table reservations enable row level security;
alter table messages     enable row level security;
alter table reviews      enable row level security;

-- PROFILES
create policy "profiles: public read"
  on profiles for select using (true);

create policy "profiles: own update"
  on profiles for update using (auth.uid() = id);

-- LISTINGS
create policy "listings: public read"
  on listings for select using (true);

create policy "listings: owner insert"
  on listings for insert
  with check (auth.uid() = owner_id);

create policy "listings: owner update"
  on listings for update
  using (auth.uid() = owner_id);

create policy "listings: owner delete"
  on listings for delete
  using (auth.uid() = owner_id);

-- RESERVATIONS
create policy "reservations: tenant or owner read"
  on reservations for select
  using (
    auth.uid() = tenant_id
    or exists (select 1 from listings l where l.id = listing_id and l.owner_id = auth.uid())
  );

create policy "reservations: tenant insert"
  on reservations for insert
  with check (auth.uid() = tenant_id);

create policy "reservations: owner update statut"
  on reservations for update
  using (
    exists (select 1 from listings l where l.id = listing_id and l.owner_id = auth.uid())
    or auth.uid() = tenant_id
  );

-- MESSAGES
create policy "messages: participants read"
  on messages for select
  using (
    auth.uid() = sender_id
    or exists (
      select 1 from reservations r
      join listings l on l.id = r.listing_id
      where r.id = reservation_id
        and (r.tenant_id = auth.uid() or l.owner_id = auth.uid())
    )
  );

create policy "messages: participant insert"
  on messages for insert
  with check (
    auth.uid() = sender_id
    and exists (
      select 1 from reservations r
      join listings l on l.id = r.listing_id
      where r.id = reservation_id
        and (r.tenant_id = auth.uid() or l.owner_id = auth.uid())
    )
  );

-- REVIEWS
create policy "reviews: public read"
  on reviews for select using (true);

create policy "reviews: author insert"
  on reviews for insert
  with check (
    auth.uid() = author_id
    and exists (
      select 1 from reservations r
      where r.id = reservation_id
        and r.tenant_id = auth.uid()
        and r.statut = 'terminee'
    )
  );

-- ─────────────────────────────────────────────
-- STORAGE BUCKET (photos)
-- ─────────────────────────────────────────────
-- Run this separately in Supabase dashboard > Storage > New bucket
-- or via the API. Name: "listing-photos", public: true

-- Storage RLS (if managing via SQL):
-- insert into storage.buckets (id, name, public) values ('listing-photos', 'listing-photos', true);

-- ─────────────────────────────────────────────
-- SEED DATA (optional, for dev)
-- ─────────────────────────────────────────────
-- Uncomment to insert sample data after creating your first user via Supabase Auth.
-- Replace 'YOUR_USER_UUID' with the actual UUID from auth.users.

/*
insert into listings (owner_id, site, site_name, type, title, description, address, city, zip,
  distance_km, surface_m2, bedrooms, bathrooms, price_week, price_month, amenities, photos)
values
  ('YOUR_USER_UUID', 'tricastin', 'Tricastin', 'appartement',
   'Appartement T2 meublé — 2 km du Tricastin',
   'Appartement T2 entièrement meublé à 2 km de la centrale du Tricastin.',
   '12 rue des Lavandes', 'Pierrelatte', '26700',
   2.1, 48, 1, 1, 280, 650,
   ARRAY['wifi', 'parking', 'washing', 'kitchen', 'tv', 'ac'],
   ARRAY['https://images.unsplash.com/photo-1600762849691-4b51bc94009c?auto=format&fit=crop&w=800&q=80']
  );
*/
