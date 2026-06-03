create or replace function update_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger driver_comments_updated_at
    before update on driver_comments
    for each row
    execute function update_updated_at();

create trigger profiles_updated_at
    before update on profiles
    for each row
    execute function update_updated_at();