-- ============================================================
-- 투수기록 마이그레이션 (Supabase 대시보드 SQL Editor에서 실행)
-- 1번 블록 실행 후 2번 블록 실행하세요.
-- ============================================================

-- ----- 1) 스키마 -----
create table if not exists public.pitcher_records (
  league_id text not null references public.leagues(id) on delete restrict,
  player_id text not null references public.players(id) on delete cascade,
  ip numeric(5,2) not null default 0,
  h integer not null default 0,
  er integer not null default 0,
  w integer not null default 0,
  l integer not null default 0,
  sv integer not null default 0,
  updated_at timestamptz not null default now(),
  primary key (league_id, player_id)
);

create index if not exists pitcher_records_league_updated_idx on public.pitcher_records (league_id, updated_at desc);

-- ----- 2) RLS -----
alter table public.pitcher_records enable row level security;

drop policy if exists pitcher_read_auth on public.pitcher_records;
create policy pitcher_read_auth on public.pitcher_records
for select to authenticated
using (auth.uid() is not null);

drop policy if exists pitcher_write_staff on public.pitcher_records;
create policy pitcher_write_staff on public.pitcher_records
for all to authenticated
using (public.is_staff())
with check (public.is_staff());
