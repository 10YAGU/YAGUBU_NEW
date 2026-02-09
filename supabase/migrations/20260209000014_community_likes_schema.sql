-- Community post likes (좋아요)
alter table public.community_posts
  add column if not exists like_count integer not null default 0;

create table if not exists public.community_post_likes (
  post_id text not null references public.community_posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

create index if not exists community_post_likes_post_id_idx on public.community_post_likes (post_id);
create index if not exists community_post_likes_user_id_idx on public.community_post_likes (user_id);

-- Trigger: sync like_count on insert
create or replace function public.sync_community_like_count_insert()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update public.community_posts set like_count = like_count + 1 where id = new.post_id;
  return new;
end;
$$;
drop trigger if exists community_post_likes_after_insert on public.community_post_likes;
create trigger community_post_likes_after_insert
  after insert on public.community_post_likes
  for each row execute function public.sync_community_like_count_insert();

-- Trigger: sync like_count on delete
create or replace function public.sync_community_like_count_delete()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update public.community_posts set like_count = greatest(0, like_count - 1) where id = old.post_id;
  return old;
end;
$$;
drop trigger if exists community_post_likes_after_delete on public.community_post_likes;
create trigger community_post_likes_after_delete
  after delete on public.community_post_likes
  for each row execute function public.sync_community_like_count_delete();
