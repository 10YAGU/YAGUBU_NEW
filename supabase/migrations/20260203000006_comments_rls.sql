-- 8) Community comments RLS
alter table public.community_comments enable row level security;

-- Read: authenticated
drop policy if exists community_comments_read_auth on public.community_comments;
create policy community_comments_read_auth on public.community_comments
for select to authenticated
using (auth.uid() is not null);

-- Insert: authenticated
drop policy if exists community_comments_insert_auth on public.community_comments;
create policy community_comments_insert_auth on public.community_comments
for insert to authenticated
with check (auth.uid() is not null);

-- Update: staff or author
drop policy if exists community_comments_update_staff_or_author on public.community_comments;
create policy community_comments_update_staff_or_author on public.community_comments
for update to authenticated
using (public.is_staff() or author_user_id = auth.uid())
with check (public.is_staff() or author_user_id = auth.uid());

-- Delete: staff or author
drop policy if exists community_comments_delete_staff_or_author on public.community_comments;
create policy community_comments_delete_staff_or_author on public.community_comments
for delete to authenticated
using (public.is_staff() or author_user_id = auth.uid());

