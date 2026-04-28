-- Users / Profiles
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  email text,
  subscription_status text default 'inactive', -- active | inactive | cancelled | lapsed
  subscription_plan text, -- monthly | yearly
  subscription_renewal_date timestamp,
  stripe_customer_id text,
  stripe_subscription_id text,
  selected_charity_id uuid,
  charity_contribution_percent integer default 10,
  is_admin boolean default false,
  created_at timestamp default now()
);

-- Golf Scores (max 5 per user, rolling)
create table golf_scores (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade,
  score integer check (score >= 1 and score <= 45), -- Stableford format
  played_date date not null,
  created_at timestamp default now(),
  unique(user_id, played_date) -- no duplicate dates
);

-- Charities
create table charities (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  image_url text,
  is_featured boolean default false,
  website_url text,
  event_name text,
  event_date date,
  created_at timestamp default now()
);

-- Monthly Draws
create table draws (
  id uuid default gen_random_uuid() primary key,
  draw_month text not null, -- e.g. "2026-04"
  draw_numbers integer[] not null, -- 5 winning numbers
  draw_type text default 'random', -- random | algorithmic
  status text default 'draft', -- draft | simulated | published
  total_prize_pool numeric,
  jackpot_pool numeric,
  four_match_pool numeric,
  three_match_pool numeric,
  jackpot_rolled_over boolean default false,
  rolled_over_amount numeric default 0,
  created_at timestamp default now(),
  published_at timestamp
);

-- Draw Entries (user's 5 scores act as their 5 numbers)
create table draw_entries (
  id uuid default gen_random_uuid() primary key,
  draw_id uuid references draws(id),
  user_id uuid references profiles(id),
  entry_numbers integer[] not null, -- snapshot of user's 5 scores at time of draw
  match_count integer default 0, -- 3, 4, or 5
  is_winner boolean default false,
  prize_amount numeric,
  payment_status text default 'pending', -- pending | paid
  proof_url text,
  verified_at timestamp,
  created_at timestamp default now()
);

-- Charity Contributions (calculated monthly)
create table charity_contributions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id),
  charity_id uuid references charities(id),
  amount numeric not null,
  contribution_date date,
  created_at timestamp default now()
);

-- RLS Policies
alter table profiles enable row level security;
alter table golf_scores enable row level security;
alter table draw_entries enable row level security;
alter table charity_contributions enable row level security;

-- Users can only read/write their own data
create policy "users_own_profile" on profiles for all using (auth.uid() = id);
create policy "users_own_scores" on golf_scores for all using (auth.uid() = user_id);
create policy "users_own_entries" on draw_entries for select using (auth.uid() = user_id);
create policy "charities_public_read" on charities for select using (true);
create policy "draws_public_published_read" on draws for select using (status = 'published' or auth.uid() in (select id from profiles where is_admin = true));

-- Seed data
INSERT INTO charities (name, description, image_url, is_featured, website_url, event_name, event_date) VALUES
('Golf for Good', 'Using golf to raise funds for childrens hospitals across the UK.', 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=400', true, 'https://example.com', 'Annual Golf Day 2026', '2026-09-15'),
('Green Fairways Foundation', 'Environmental charity planting trees at decommissioned golf courses.', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400', false, 'https://example.com', 'Fundraising Drive', '2026-07-20'),
('Eagles for Education', 'Scholarship fund supporting young athletes from underprivileged backgrounds.', 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400', false, 'https://example.com', NULL, NULL),
('Birdie Care', 'Mental health charity for retired professional athletes.', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400', false, 'https://example.com', 'Golf Marathon', '2026-08-10'),
('The Par Project', 'Bringing golf programmes to schools in deprived areas.', 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400', false, 'https://example.com', NULL, NULL);
