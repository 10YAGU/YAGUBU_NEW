-- 상대팀 경기 기록 (선수명단에 없는 상대팀 선수 기록용)
-- player_id 없이 player_name(텍스트)로 저장

create table if not exists public.game_opponent_batting_lines (
  id text primary key,
  schedule_id text not null references public.schedules(id) on delete cascade,
  player_name text not null default '',
  pa integer not null default 0,
  ab integer not null default 0,
  h integer not null default 0,
  rbi integer not null default 0,
  r integer not null default 0,
  bb integer not null default 0,
  so integer not null default 0,
  sb integer not null default 0,
  batting_order integer default null,
  inning_1 text default '',
  inning_2 text default '',
  inning_3 text default '',
  inning_4 text default '',
  inning_5 text default '',
  inning_6 text default '',
  inning_7 text default '',
  inning_8 text default '',
  inning_9 text default '',
  season_avg numeric(5,3) default null,
  created_at timestamptz not null default now()
);

create index if not exists game_opponent_batting_schedule_id_idx on public.game_opponent_batting_lines (schedule_id);
comment on table public.game_opponent_batting_lines is '경기별 상대팀 타격 기록 (선수명 직접 입력)';

create table if not exists public.game_opponent_pitching_lines (
  id text primary key,
  schedule_id text not null references public.schedules(id) on delete cascade,
  player_name text not null default '',
  ip numeric(5,2) not null default 0,
  h integer not null default 0,
  er integer not null default 0,
  w integer not null default 0,
  l integer not null default 0,
  sv integer not null default 0,
  result text default '',
  bf integer not null default 0,
  ab integer not null default 0,
  hr integer not null default 0,
  sh integer not null default 0,
  sf integer not null default 0,
  bb integer not null default 0,
  hbp integer not null default 0,
  so integer not null default 0,
  wp integer not null default 0,
  balk integer not null default 0,
  r integer not null default 0,
  np integer not null default 0,
  season_era numeric(5,2) default null,
  created_at timestamptz not null default now()
);

create index if not exists game_opponent_pitching_schedule_id_idx on public.game_opponent_pitching_lines (schedule_id);
comment on table public.game_opponent_pitching_lines is '경기별 상대팀 투수 기록 (선수명 직접 입력)';

-- RLS
alter table public.game_opponent_batting_lines enable row level security;
alter table public.game_opponent_pitching_lines enable row level security;

drop policy if exists game_opponent_batting_read_auth on public.game_opponent_batting_lines;
create policy game_opponent_batting_read_auth on public.game_opponent_batting_lines
  for select to authenticated using (auth.uid() is not null);

drop policy if exists game_opponent_batting_write_staff on public.game_opponent_batting_lines;
create policy game_opponent_batting_write_staff on public.game_opponent_batting_lines
  for all to authenticated using (public.is_staff()) with check (public.is_staff());

drop policy if exists game_opponent_pitching_read_auth on public.game_opponent_pitching_lines;
create policy game_opponent_pitching_read_auth on public.game_opponent_pitching_lines
  for select to authenticated using (auth.uid() is not null);

drop policy if exists game_opponent_pitching_write_staff on public.game_opponent_pitching_lines;
create policy game_opponent_pitching_write_staff on public.game_opponent_pitching_lines
  for all to authenticated using (public.is_staff()) with check (public.is_staff());
