-- YAGUBU_NEW Supabase schema
-- Run this in Supabase SQL Editor.
-- Note: For quick sharing, you can leave RLS disabled (NOT secure).
-- If you later enable RLS, add policies appropriate to your auth model.

-- 0) Leagues (리그)
create table if not exists public.leagues (
  id text primary key,
  name text not null,
  created_at timestamptz not null default now()
);

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
  league_id text references public.leagues(id),
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
  league_id text not null references public.leagues(id) on delete restrict,
  player_id text not null references public.players(id) on delete cascade,
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

alter table public.personal_records
  add primary key (league_id, player_id);

create index if not exists personal_records_updated_at_idx on public.personal_records (updated_at desc);

-- 6) Team content (팀 소개: 스토리/가치/연혁)
create table if not exists public.team_content (
  content_key text primary key,                 -- story / values / history
  content_value text not null default '',
  updated_at timestamptz not null default now()
);

-- 7) Community posts (커뮤니티)
create table if not exists public.community_posts (
  id text primary key,
  write_date date not null,                     -- 작성일
  write_time time not null,                     -- 작성시간
  author_name text not null,                    -- 글쓴이(로그인 사용자)
  author_player_id text references public.players(id) on delete set null,
  author_user_id uuid references auth.users(id) on delete set null,
  title text not null,
  content text not null default '',
  created_at timestamptz not null default now()
);

alter table public.community_posts
  add constraint community_posts_content_1000b check (octet_length(content) <= 1000);

create index if not exists community_posts_write_date_idx on public.community_posts (write_date desc, write_time desc);
create index if not exists community_posts_created_at_idx on public.community_posts (created_at desc);

-- 8) Community comments (커뮤니티 댓글)
create table if not exists public.community_comments (
  id text primary key,
  post_id text not null references public.community_posts(id) on delete cascade,
  author_name text not null,
  author_player_id text references public.players(id) on delete set null,
  author_user_id uuid references auth.users(id) on delete set null,
  content text not null default '',
  created_at timestamptz not null default now()
);

alter table public.community_comments
  add constraint community_comments_content_1000b check (octet_length(content) <= 1000);

create index if not exists community_comments_post_id_idx on public.community_comments (post_id, created_at asc);

-- 9) Team activity gallery (팀활동 갤러리)
create table if not exists public.gallery_items (
  id text primary key,
  write_date date not null,
  write_time time not null,
  author_name text not null,
  author_player_id text references public.players(id) on delete set null,
  author_user_id uuid references auth.users(id) on delete set null,
  short_text text not null default '',
  content text not null default '',
  image_data text not null, -- data URL (base64) or URL
  created_at timestamptz not null default now()
);

alter table public.gallery_items
  add constraint gallery_short_text_len check (char_length(short_text) <= 30);

create index if not exists gallery_items_write_dt_idx on public.gallery_items (write_date desc, write_time desc);
create index if not exists gallery_items_created_at_idx on public.gallery_items (created_at desc);
