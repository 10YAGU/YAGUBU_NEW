-- RLS for community_post_likes
alter table public.community_post_likes enable row level security;

drop policy if exists community_post_likes_select on public.community_post_likes;
create policy community_post_likes_select on public.community_post_likes
for select to authenticated using (auth.uid() is not null);

drop policy if exists community_post_likes_insert_own on public.community_post_likes;
create policy community_post_likes_insert_own on public.community_post_likes
for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists community_post_likes_delete_own on public.community_post_likes;
create policy community_post_likes_delete_own on public.community_post_likes
for delete to authenticated using (auth.uid() = user_id);
