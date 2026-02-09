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

