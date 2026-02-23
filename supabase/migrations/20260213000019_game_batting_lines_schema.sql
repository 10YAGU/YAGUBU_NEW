-- 경기별 타격 기록 (경기당 기록지)
create table if not exists public.game_batting_lines (
  id text primary key,
  schedule_id text not null references public.schedules(id) on delete cascade,
  player_id text not null references public.players(id) on delete cascade,
  pa integer not null default 0,
  ab integer not null default 0,
  h integer not null default 0,
  rbi integer not null default 0,
  r integer not null default 0,
  bb integer not null default 0,
  so integer not null default 0,
  sb integer not null default 0,
  batting_order integer default null,
  created_at timestamptz not null default now()
);

create index if not exists game_batting_lines_schedule_id_idx on public.game_batting_lines (schedule_id);
create index if not exists game_batting_lines_player_id_idx on public.game_batting_lines (player_id);

comment on table public.game_batting_lines is '경기별 타격 기록 (경기당 기록지)';
