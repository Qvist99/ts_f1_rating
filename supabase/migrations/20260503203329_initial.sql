CREATE table drivers (
    "id" uuid primary key default gen_random_uuid(),
    "first_name" text not null,
    "last_name" text not null,
    "team_name" text not null,
    "team_color" text not null,
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
    "date_start" timestamptz not null,
    "date_end" timestamptz not null,
    "is_cancelled" boolean not null default false,
    "race_name" text not null,
    "race_location" text not null,
    "race_official_name" text not null,
    "sessions" jsonb not null,
    "meeting_key" integer not null,
    "round" integer not null
);

create table driver_ratings (
    "id" uuid primary key default gen_random_uuid(),
    "driver_id" uuid not null references drivers(id) on delete cascade,
    "race_id" uuid not null references races(id) on delete cascade,
    "user_id" uuid not null default auth.uid() references auth.users(id) on delete cascade,
    "rating" integer not null,
    "meeting_key" integer not null
);

create table race_ratings (
    "id" uuid primary key default gen_random_uuid(),
    "race_id" uuid not null references races(id) on delete cascade,
    "user_id" uuid not null default auth.uid() references auth.users(id) on delete cascade,
    "rating" integer not null,
    "meeting_key" integer not null
);

create type comment_type as enum ('positive', 'negative');

create table driver_comments (
    "id" uuid primary key default gen_random_uuid(),
    "driver_id" uuid not null references drivers(id) on delete cascade,
    "user_id" uuid not null default auth.uid() references auth.users(id) on delete cascade,
    "type" comment_type not null,
    "text" text not null check (char_length(text) <= 110),
    "updated_at" timestamptz not null default now()
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
with check ((select auth.uid()) = user_id);

create policy "Users can update their own driver ratings"
on driver_ratings for update
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can delete their own driver ratings"
on driver_ratings for delete
to authenticated
using ((select auth.uid()) = user_id);


-- race_ratings: read all ratings if logged in, write only your own
create policy "Authenticated users can read race ratings"
on race_ratings for select
to authenticated
using (true);

create policy "Users can insert their own race ratings"
on race_ratings for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can update their own race ratings"
on race_ratings for update
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can delete their own race ratings"
on race_ratings for delete
to authenticated
using ((select auth.uid()) = user_id);


-- driver_comments: read all comments if logged in, write only your own
create policy "Authenticated users can read driver comments"
on driver_comments for select
to authenticated
using (true);

create policy "Users can insert their own driver comments"
on driver_comments for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can update their own driver comments"
on driver_comments for update
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can delete their own driver comments"
on driver_comments for delete
to authenticated
using ((select auth.uid()) = user_id);

alter table driver_ratings
    add constraint driver_ratings_unique
    unique (driver_id, race_id, user_id);


alter table race_ratings 
    add constraint race_ratings_unique
    unique (race_id, user_id);



CREATE OR REPLACE FUNCTION check_comment_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF (
    SELECT COUNT(*) FROM public.driver_comments
    WHERE driver_id = NEW.driver_id
      AND user_id = NEW.user_id
      AND type = NEW.type
  ) >= 3 THEN
    RAISE EXCEPTION 'Maximum of 3 % comments per driver per user', NEW.type;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
    set search_path = '';


CREATE TRIGGER enforce_comment_limit
BEFORE INSERT ON driver_comments
FOR EACH ROW EXECUTE FUNCTION check_comment_limit();



create or replace view driver_stats
with (security_invoker = true)
as
select
    dr.driver_id,

    -- Season average
    round(avg(dr.rating)::numeric, 1) as avg_rating_season,

    -- Last 5 races
    round(avg(dr.rating) filter (
        where dr.race_id in (
            select id from races where date_end < now() order by date_end desc limit 5
        )
    )::numeric, 1) as avg_rating_last_5,

    -- Last 3 races
    round(avg(dr.rating) filter (
        where dr.race_id in (
            select id from races where date_end < now() order by date_end desc limit 3
        )
    )::numeric, 1) as avg_rating_last_3,

    -- Best round average
    round((
        select avg(inner_dr.rating)
        from driver_ratings inner_dr
        where inner_dr.driver_id = dr.driver_id
        group by inner_dr.race_id
        order by avg(inner_dr.rating) desc
        limit 1
    )::numeric, 1) as avg_rating_best_round,

    -- Comment counts
    count(distinct dc.id) as total_comments,
    count(distinct dc.id) filter (where dc.type = 'positive') as positive_comments,
    count(distinct dc.id) filter (where dc.type = 'negative') as negative_comments,

    -- Current user's comment count (returns 0 if not authenticated)
    count(distinct dc.id) filter (where dc.user_id = auth.uid()) as my_comments

from driver_ratings dr
left join driver_comments dc on dc.driver_id = dr.driver_id
group by dr.driver_id;

-- Revoke from anon and authenticated, grant only to authenticated
revoke select on public.driver_stats from anon;
revoke select on public.driver_stats from authenticated;
grant select on public.driver_stats to authenticated;

