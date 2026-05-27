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
