-- 7) Community posts RLS
alter table public.community_posts enable row level security;

-- Read: authenticated
drop policy if exists community_read_auth on public.community_posts;
create policy community_read_auth on public.community_posts
for select to authenticated
using (auth.uid() is not null);

-- Insert: authenticated
drop policy if exists community_insert_auth on public.community_posts;
create policy community_insert_auth on public.community_posts
for insert to authenticated
with check (auth.uid() is not null);

-- Update: staff or author
drop policy if exists community_update_staff_or_author on public.community_posts;
create policy community_update_staff_or_author on public.community_posts
for update to authenticated
using (public.is_staff() or author_user_id = auth.uid())
with check (public.is_staff() or author_user_id = auth.uid());

-- Delete: staff or author
drop policy if exists community_delete_staff_or_author on public.community_posts;
create policy community_delete_staff_or_author on public.community_posts
for delete to authenticated
using (public.is_staff() or author_user_id = auth.uid());

