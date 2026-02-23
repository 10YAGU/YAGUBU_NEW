-- 경기별 투수 기록 (경기당 기록지)
create table if not exists public.game_pitching_lines (
  id text primary key,
  schedule_id text not null references public.schedules(id) on delete cascade,
  player_id text not null references public.players(id) on delete cascade,
  ip numeric(5,2) not null default 0,
  h integer not null default 0,
  er integer not null default 0,
  w integer not null default 0,
  l integer not null default 0,
  sv integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists game_pitching_lines_schedule_id_idx on public.game_pitching_lines (schedule_id);
create index if not exists game_pitching_lines_player_id_idx on public.game_pitching_lines (player_id);

comment on table public.game_pitching_lines is '경기별 투수 기록 (경기당 기록지)';
