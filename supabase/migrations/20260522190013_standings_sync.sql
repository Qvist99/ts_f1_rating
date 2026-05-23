create table driver_standings(
    "id" uuid primary key default gen_random_uuid(),
    "year" integer not null unique,
    "standings" jsonb not null,
    "updated_at" timestamptz not null default now()
);

create table constructor_standings(
    "id" uuid primary key default gen_random_uuid(),
    "year" integer not null unique,
    "standings" jsonb not null,
    "updated_at" timestamptz not null default now()
);



-- Enable RLS
ALTER TABLE driver_standings ENABLE ROW LEVEL SECURITY;
ALTER TABLE constructor_standings ENABLE ROW LEVEL SECURITY;

-- Authenticated read only
CREATE POLICY "Authenticated users can read driver_standings"
ON driver_standings FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can read constructor_standings"
ON constructor_standings FOR SELECT
TO authenticated
USING (true);


-- Revoke GraphQL access for all tables since we use REST only
REVOKE SELECT ON ALL TABLES IN SCHEMA public FROM anon;




