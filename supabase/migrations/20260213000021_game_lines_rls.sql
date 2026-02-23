-- RLS for game_batting_lines, game_pitching_lines (경기당 기록지)
alter table public.game_batting_lines enable row level security;
alter table public.game_pitching_lines enable row level security;

-- 읽기: 로그인 사용자
drop policy if exists game_batting_read_auth on public.game_batting_lines;
create policy game_batting_read_auth on public.game_batting_lines
  for select to authenticated using (auth.uid() is not null);

drop policy if exists game_pitching_read_auth on public.game_pitching_lines;
create policy game_pitching_read_auth on public.game_pitching_lines
  for select to authenticated using (auth.uid() is not null);

-- 쓰기: 스텝만
drop policy if exists game_batting_write_staff on public.game_batting_lines;
create policy game_batting_write_staff on public.game_batting_lines
  for all to authenticated using (public.is_staff()) with check (public.is_staff());

drop policy if exists game_pitching_write_staff on public.game_pitching_lines;
create policy game_pitching_write_staff on public.game_pitching_lines
  for all to authenticated using (public.is_staff()) with check (public.is_staff());
