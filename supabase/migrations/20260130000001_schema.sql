-- YAGUBU_NEW Supabase schema
-- 1) Notices (최신 공지사항)
create table if not exists public.notices (
  id text primary key,
  title text not null,
  content text default '',
  notice_date date not null,
  created_at timestamptz not null default now()
);

create index if not exists notices_notice_date_idx on public.notices (notice_date desc);
create index if not exists notices_created_at_idx on public.notices (created_at desc);

-- 2) Schedules (경기 일정)
create table if not exists public.schedules (
  id text primary key,
  game_date date not null,
  game_time text not null,
  opponent text not null,
  location text not null,
  status text not null default '예정',          -- 예정/진행중/완료
  bat_order text not null default '선공',       -- 선공/후공
  result text default '',                       -- 승/패/무 (완료일 때 사용)
  our_score integer,
  opponent_score integer,
  created_at timestamptz not null default now()
);

create index if not exists schedules_game_date_idx on public.schedules (game_date desc);
create index if not exists schedules_created_at_idx on public.schedules (created_at desc);

-- 3) Media (최근 미디어)
create table if not exists public.media (
  id text primary key,
  media_type text not null,                     -- 동영상/사진/유튜브
  title text not null,
  url text not null,
  created_at timestamptz not null default now()
);

create index if not exists media_created_at_idx on public.media (created_at desc);

-- 4) Players (선수단)
create table if not exists public.players (
  id text primary key,
  jersey_no integer not null,
  name text not null,
  role text not null default '4',               -- 9:관리자,1:감독,2:코치,3:총무,4:선수
  primary_pos text default '',
  secondary_pos text default '',
  status text not null default '활동',          -- 활동/탈퇴
  contact text default '',
  created_at timestamptz not null default now()
);

create index if not exists players_jersey_no_idx on public.players (jersey_no asc);
create index if not exists players_status_idx on public.players (status);

-- 5) Personal records (개인기록) - 1 record per player
create table if not exists public.personal_records (
  player_id text primary key references public.players(id) on delete cascade,
  pa integer not null default 0,
  ab integer not null default 0,
  h integer not null default 0,
  rbi integer not null default 0,
  r integer not null default 0,
  bb integer not null default 0,
  so integer not null default 0,
  sb integer not null default 0,
  avg numeric(6,3) not null default 0.000,
  updated_at timestamptz not null default now()
);

create index if not exists personal_records_updated_at_idx on public.personal_records (updated_at desc);

-- 6) Team content (팀 소개: 스토리/가치/연혁)
create table if not exists public.team_content (
  content_key text primary key,                 -- story / values / history
  content_value text not null default '',
  updated_at timestamptz not null default now()
);

