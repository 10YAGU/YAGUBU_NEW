-- 9) Gallery RLS
alter table public.gallery_items enable row level security;

-- Read: authenticated
drop policy if exists gallery_read_auth on public.gallery_items;
create policy gallery_read_auth on public.gallery_items
for select to authenticated
using (auth.uid() is not null);

-- Insert: authenticated (등록은 누구나)
drop policy if exists gallery_insert_auth on public.gallery_items;
create policy gallery_insert_auth on public.gallery_items
for insert to authenticated
with check (auth.uid() is not null);

-- Update: staff or author
drop policy if exists gallery_update_staff_or_author on public.gallery_items;
create policy gallery_update_staff_or_author on public.gallery_items
for update to authenticated
using (public.is_staff() or author_user_id = auth.uid())
with check (public.is_staff() or author_user_id = auth.uid());

-- Delete: staff or author
drop policy if exists gallery_delete_staff_or_author on public.gallery_items;
create policy gallery_delete_staff_or_author on public.gallery_items
for delete to authenticated
using (public.is_staff() or author_user_id = auth.uid());

