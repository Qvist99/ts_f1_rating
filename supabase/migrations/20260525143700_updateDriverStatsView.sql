drop view if exists driver_stats;

create view driver_stats
with (security_invoker = true)
as
select
    d.id as driver_id,

    -- Season average (current year only)
    round(avg(dr.rating)::numeric, 1) as avg_rating_season,

    -- Last 5 non-cancelled races (current year only)
    round(
        avg(dr.rating) filter (
            where dr.race_id in (
                select r.id
                from races r
                where r.date_end < now()
                  and coalesce(r.is_cancelled, false) = false
                  and date_part('year', r.date_start) = date_part('year', now())
                order by r.date_end desc
                limit 5
            )
        )::numeric,
        1
    ) as avg_rating_last_5,

    -- Last 3 non-cancelled races (current year only)
    round(
        avg(dr.rating) filter (
            where dr.race_id in (
                select r.id
                from races r
                where r.date_end < now()
                  and coalesce(r.is_cancelled, false) = false
                  and date_part('year', r.date_start) = date_part('year', now())
                order by r.date_end desc
                limit 3
            )
        )::numeric,
        1
    ) as avg_rating_last_3,

    -- Best round average (current year only)
    round((
        select avg(inner_dr.rating)
        from driver_ratings inner_dr
        join races r on r.id = inner_dr.race_id
        where inner_dr.driver_id = d.id
          and date_part('year', r.date_start) = date_part('year', now())
        group by inner_dr.race_id
        order by avg(inner_dr.rating) desc
        limit 1
    )::numeric, 1) as avg_rating_best_round,

    -- Race ID of the best round
    (
        select inner_dr.race_id
        from driver_ratings inner_dr
        join races r on r.id = inner_dr.race_id
        where inner_dr.driver_id = d.id
          and date_part('year', r.date_start) = date_part('year', now())
        group by inner_dr.race_id
        order by avg(inner_dr.rating) desc
        limit 1
    ) as best_round_race_id,

    -- Rating count
    count(dr.rating) as total_ratings,

    -- Comment counts
    count(distinct dc.id) as total_comments,

    count(distinct dc.id) filter (
        where dc.type = 'positive'
    ) as positive_comments,

    count(distinct dc.id) filter (
        where dc.type = 'negative'
    ) as negative_comments,

    -- Current user's comment count
    count(distinct dc.id) filter (
        where dc.user_id = auth.uid()
    ) as my_comments

from drivers d
left join driver_ratings dr
    on dr.driver_id = d.id
    and exists (
        select 1 from races r
        where r.id = dr.race_id
          and date_part('year', r.date_start) = date_part('year', now())
    )
left join driver_comments dc
    on dc.driver_id = d.id
where d.year = date_part('year', now())

group by d.id;
