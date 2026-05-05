CREATE table drivers (
    "id" uuid primary key default gen_random_uuid(),
    "first_name" text not null,
    "last_name" text not null,
    "team_name" text not null,
    "acronym" text not null,
    "driver_number" integer not null,
    "headshot_url" text not null,
    "is_retired" boolean not null default false
);

create table races (
    "id" uuid primary key default gen_random_uuid(),
    "circuit_name" text not null,
    "circuit_image_url" text not null,
    "country_flag_url" text not null,
    "country_name" text not null,
    "date_start" text not null,
    "is_cancelled" boolean not null default false,
    "race_name" text not null,
    "race_location" text not null,
    "race_official_name" text not null,
    "sessions" jsonb not null,
    "meeting_key" integer not null
);

create table driver_ratings (
    "id" uuid primary key default gen_random_uuid(),
    "driver_id" uuid not null references drivers(id) on delete cascade,
    "race_id" uuid not null references races(id) on delete cascade,
    "user_id" uuid not null references auth.users(id) on delete cascade,
    "rating" integer not null
);

create table race_ratings (
    "id" uuid primary key default gen_random_uuid(),
    "race_id" uuid not null references races(id) on delete cascade,
    "user_id" uuid not null references auth.users(id) on delete cascade,
    "rating" integer not null
);

create table driver_comments (
    "id" uuid primary key default gen_random_uuid(),
    "driver_id" uuid not null references drivers(id) on delete cascade,
    "user_id" uuid not null references auth.users(id) on delete cascade,
    "positive_comment" jsonb not null,
    "negative_comment" jsonb not null
);

-- RLS
alter table drivers enable row level security;
alter table races enable row level security;
alter table driver_ratings enable row level security;
alter table race_ratings enable row level security;
alter table driver_comments enable row level security;

-- drivers: any logged in user can read, no one can write via client
create policy "Authenticated users can read drivers"
on drivers for select
to authenticated
using (true);

-- races: any logged in user can read, no one can write via client
create policy "Authenticated users can read races"
on races for select
to authenticated
using (true);

-- driver_ratings: read all ratings if logged in, write only your own
create policy "Authenticated users can read driver ratings"
on driver_ratings for select
to authenticated
using (true);

create policy "Users can insert their own driver ratings"
on driver_ratings for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update their own driver ratings"
on driver_ratings for update
to authenticated
using (auth.uid() = user_id);

create policy "Users can delete their own driver ratings"
on driver_ratings for delete
to authenticated
using (auth.uid() = user_id);

-- race_ratings: read all ratings if logged in, write only your own
create policy "Authenticated users can read race ratings"
on race_ratings for select
to authenticated
using (true);

create policy "Users can insert their own race ratings"
on race_ratings for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update their own race ratings"
on race_ratings for update
to authenticated
using (auth.uid() = user_id);

create policy "Users can delete their own race ratings"
on race_ratings for delete
to authenticated
using (auth.uid() = user_id);

-- driver_comments: read all comments if logged in, write only your own
create policy "Authenticated users can read driver comments"
on driver_comments for select
to authenticated
using (true);

create policy "Users can insert their own driver comments"
on driver_comments for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update their own driver comments"
on driver_comments for update
to authenticated
using (auth.uid() = user_id);

create policy "Users can delete their own driver comments"
on driver_comments for delete
to authenticated
using (auth.uid() = user_id);
