-- ============================================
-- FitTrack - Supabase Schema
-- Run this in your Supabase SQL Editor
-- ============================================

-- User profiles
create table if not exists user_profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  display_name    text,
  weight_goal_kg  numeric(5,2),
  calorie_goal    int default 1800,
  water_goal_ml   int default 2000,
  step_goal       int default 10000,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- Workout plans
create table if not exists workout_plans (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  name        text not null,
  description text,
  is_active   boolean default false,
  created_at  timestamptz default now()
);

-- Plan days (Day A, B, C)
create table if not exists plan_days (
  id          uuid primary key default gen_random_uuid(),
  plan_id     uuid references workout_plans(id) on delete cascade not null,
  day_label   text not null,
  day_order   int not null
);

-- Exercises within a plan day
create table if not exists plan_exercises (
  id              uuid primary key default gen_random_uuid(),
  plan_day_id     uuid references plan_days(id) on delete cascade not null,
  exercise_name   text not null,
  sets_target     int not null,
  reps_target     text not null,
  rest_seconds    int default 90,
  notes           text,
  order_index     int not null
);

-- Workout sessions (logged)
create table if not exists workout_sessions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  plan_day_id uuid references plan_days(id),
  logged_at   date not null default current_date,
  started_at  timestamptz,
  ended_at    timestamptz,
  notes       text,
  created_at  timestamptz default now()
);

-- Sets logged within a session
create table if not exists workout_sets (
  id              uuid primary key default gen_random_uuid(),
  session_id      uuid references workout_sessions(id) on delete cascade not null,
  exercise_name   text not null,
  set_number      int not null,
  reps            int not null,
  weight_kg       numeric(5,2) not null default 0,
  created_at      timestamptz default now()
);

-- Meal entries
create table if not exists meal_entries (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  logged_at   date not null default current_date,
  meal_type   text not null,
  name        text not null,
  calories    int not null,
  protein_g   numeric(5,1),
  notes       text,
  created_at  timestamptz default now()
);

-- Water intake
create table if not exists water_entries (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  logged_at   date not null default current_date,
  amount_ml   int not null,
  logged_time timestamptz default now(),
  created_at  timestamptz default now()
);

-- Step entries
create table if not exists step_entries (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  logged_at   date not null default current_date,
  steps       int not null,
  created_at  timestamptz default now(),
  unique (user_id, logged_at)
);

-- Weight entries
create table if not exists weight_entries (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  logged_at   date not null default current_date,
  weight_kg   numeric(5,2) not null,
  note        text,
  created_at  timestamptz default now(),
  unique (user_id, logged_at)
);

-- ============================================
-- Row Level Security
-- ============================================

alter table user_profiles enable row level security;
alter table workout_plans enable row level security;
alter table plan_days enable row level security;
alter table plan_exercises enable row level security;
alter table workout_sessions enable row level security;
alter table workout_sets enable row level security;
alter table meal_entries enable row level security;
alter table water_entries enable row level security;
alter table step_entries enable row level security;
alter table weight_entries enable row level security;

-- user_profiles
create policy "Users manage own profile" on user_profiles using (id = auth.uid()) with check (id = auth.uid());

-- workout_plans
create policy "Users manage own plans" on workout_plans using (user_id = auth.uid()) with check (user_id = auth.uid());

-- plan_days
create policy "Users manage own plan days" on plan_days
  using (plan_id in (select id from workout_plans where user_id = auth.uid()));

-- plan_exercises
create policy "Users manage own exercises" on plan_exercises
  using (plan_day_id in (select pd.id from plan_days pd join workout_plans wp on pd.plan_id = wp.id where wp.user_id = auth.uid()));

-- workout_sessions
create policy "Users manage own sessions" on workout_sessions using (user_id = auth.uid()) with check (user_id = auth.uid());

-- workout_sets
create policy "Users manage own sets" on workout_sets
  using (session_id in (select id from workout_sessions where user_id = auth.uid()));

-- meal_entries
create policy "Users manage own meals" on meal_entries using (user_id = auth.uid()) with check (user_id = auth.uid());

-- water_entries
create policy "Users manage own water" on water_entries using (user_id = auth.uid()) with check (user_id = auth.uid());

-- step_entries
create policy "Users manage own steps" on step_entries using (user_id = auth.uid()) with check (user_id = auth.uid());

-- weight_entries
create policy "Users manage own weight" on weight_entries using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ============================================
-- Indexes
-- ============================================

create index if not exists idx_water_user_date on water_entries (user_id, logged_at desc);
create index if not exists idx_meals_user_date on meal_entries (user_id, logged_at desc);
create index if not exists idx_sessions_user_date on workout_sessions (user_id, logged_at desc);
create index if not exists idx_weight_user_date on weight_entries (user_id, logged_at desc);
create index if not exists idx_steps_user_date on step_entries (user_id, logged_at desc);
