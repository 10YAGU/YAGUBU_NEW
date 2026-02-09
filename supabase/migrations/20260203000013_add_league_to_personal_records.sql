-- 12) Add league_id to personal_records + composite primary key
alter table public.personal_records
  add column if not exists league_id text references public.leagues(id) on delete restrict;

-- default to 노노리그 for existing data
update public.personal_records set league_id = 'nono' where league_id is null;

alter table public.personal_records
  alter column league_id set not null;

-- change PK: player_id -> (league_id, player_id)
do $$
declare
  pk_name text;
begin
  select constraint_name into pk_name
  from information_schema.table_constraints
  where table_schema='public' and table_name='personal_records' and constraint_type='PRIMARY KEY'
  limit 1;
  if pk_name is not null then
    execute format('alter table public.personal_records drop constraint %I', pk_name);
  end if;
end$$;

alter table public.personal_records
  add primary key (league_id, player_id);

create index if not exists personal_records_league_updated_at_idx on public.personal_records (league_id, updated_at desc);

