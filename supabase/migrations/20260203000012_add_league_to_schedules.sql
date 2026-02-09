-- 11) Add league_id to schedules
alter table public.schedules
  add column if not exists league_id text references public.leagues(id) on delete restrict;

-- default to 노노리그 for existing data
update public.schedules set league_id = 'nono' where league_id is null;

alter table public.schedules
  alter column league_id set not null;

create index if not exists schedules_league_date_idx on public.schedules (league_id, game_date asc, game_time asc);

