drop view if exists driver_stats;

create view driver_stats
with (security_invoker = true)
as
with current_year_races as (
    select
        r.id,
        r.date_start,
        r.date_end,
        r.is_cancelled
    from races r
    where date_part('year', r.date_start) = date_part('year', now())
),

completed_races as (
    select id, date_end
    from current_year_races
    where date_end < now()
      and coalesce(is_cancelled, false) = false
),

rating_stats as (
    select
        dr.driver_id,

        round(avg(dr.rating)::numeric, 1) as avg_rating_season,

        round(
            avg(dr.rating) filter (
                where dr.race_id in (
                    select id from completed_races
                    order by date_end desc
                    limit 5
                )
            )::numeric,
            1
        ) as avg_rating_last_5,

        round(
            avg(dr.rating) filter (
                where dr.race_id in (
                    select id from completed_races
                    order by date_end desc
                    limit 3
                )
            )::numeric,
            1
        ) as avg_rating_last_3,

        count(*) as total_ratings

    from driver_ratings dr
    join current_year_races r
        on r.id = dr.race_id

    group by dr.driver_id
),

best_rounds as (
    select distinct on (dr.driver_id)
        dr.driver_id,
        dr.race_id as best_round_race_id,
        round(avg(dr.rating)::numeric, 1) as avg_rating_best_round

    from driver_ratings dr
    join current_year_races r
        on r.id = dr.race_id

    group by dr.driver_id, dr.race_id

    order by
        dr.driver_id,
        avg(dr.rating) desc
),

comment_stats as (
    select
        dc.driver_id,

        count(*) as total_comments,

        count(*) filter (
            where dc.type = 'positive'
        ) as positive_comments,

        count(*) filter (
            where dc.type = 'negative'
        ) as negative_comments,

        count(*) filter (
            where dc.user_id = auth.uid()
        ) as my_comments

    from driver_comments dc
    group by dc.driver_id
)

select
    d.id as driver_id,

    rs.avg_rating_season,
    rs.avg_rating_last_5,
    rs.avg_rating_last_3,

    br.avg_rating_best_round,
    br.best_round_race_id,

    coalesce(rs.total_ratings, 0) as total_ratings,

    coalesce(cs.total_comments, 0) as total_comments,
    coalesce(cs.positive_comments, 0) as positive_comments,
    coalesce(cs.negative_comments, 0) as negative_comments,
    coalesce(cs.my_comments, 0) as my_comments

from drivers d

left join rating_stats rs
    on rs.driver_id = d.id

left join best_rounds br
    on br.driver_id = d.id

left join comment_stats cs
    on cs.driver_id = d.id

where d.year = date_part('year', now());
