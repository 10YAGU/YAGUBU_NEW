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

