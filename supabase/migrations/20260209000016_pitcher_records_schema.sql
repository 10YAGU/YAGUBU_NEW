-- 투수 기록 (리그/시즌별)
create table if not exists public.pitcher_records (
  league_id text not null references public.leagues(id) on delete restrict,
  player_id text not null references public.players(id) on delete cascade,
  ip numeric(5,2) not null default 0,     -- 이닝 (예: 5.1 = 5와 1/3이닝)
  h integer not null default 0,              -- 피안타
  er integer not null default 0,            -- 자책점
  w integer not null default 0,             -- 승
  l integer not null default 0,             -- 패
  sv integer not null default 0,            -- 세이브
  updated_at timestamptz not null default now(),
  primary key (league_id, player_id)
);

create index if not exists pitcher_records_league_updated_idx on public.pitcher_records (league_id, updated_at desc);
