-- Drop existing read policies
drop policy "Authenticated users can read drivers" on drivers;
drop policy "Authenticated users can read races" on races;
drop policy "Authenticated users can read driver ratings" on driver_ratings;
drop policy "Authenticated users can read race ratings" on race_ratings;
drop policy "Authenticated users can read driver comments" on driver_comments;
drop policy "Authenticated users can read race_drivers" on race_drivers;
drop policy "Authenticated users can read driver_standings" on driver_standings;
drop policy "Authenticated users can read constructor_standings" on constructor_standings;

-- Recreate as public read
create policy "Anyone can read drivers"
on drivers for select
to anon, authenticated
using (true);

create policy "Anyone can read races"
on races for select
to anon, authenticated
using (true);

create policy "Anyone can read driver ratings"
on driver_ratings for select
to anon, authenticated
using (true);

create policy "Anyone can read race ratings"
on race_ratings for select
to anon, authenticated
using (true);

create policy "Anyone can read driver comments"
on driver_comments for select
to anon, authenticated
using (true);

create policy "Anyone can read race_drivers"
on race_drivers for select
to anon, authenticated
using (true);

create policy "Anyone can read driver_standings"
on driver_standings for select
to anon, authenticated
using (true);

create policy "Anyone can read constructor_standings"
on constructor_standings for select
to anon, authenticated
using (true);


GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

create table profiles (
    "id" uuid primary key references auth.users(id) on delete cascade,
    "display_name" text,
    "email" text,
    "updated_at" timestamptz default now(),
    "deletion_requested_at" timestamptz default null
);

alter table profiles enable row level security;

create policy "Users can view their own profile"
    on public.profiles for select
    using ((select auth.uid()) = id);

create policy "Users can update their own profile"
    on public.profiles for update
    using ((select auth.uid()) = id)
    with check ((select auth.uid()) = id);


-- Auto-create a profile row when a user signs up

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
    insert into public.profiles (id, email, display_name)
    values (new.id, new.email, new.raw_user_meta_data->>'full_name');
    return new;
end;
$$;

-- trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

revoke execute on function public.handle_new_user() from anon;
revoke execute on function public.handle_new_user() from authenticated;
revoke execute on function public.handle_new_user() from public;

-- Backfill profiles for existing users (if any)
insert into public.profiles (id, email, display_name)
select
    id,
    email,
    raw_user_meta_data->>'full_name'
from auth.users
on conflict (id) do nothing;
