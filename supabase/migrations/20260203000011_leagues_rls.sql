-- 10) Leagues RLS
alter table public.leagues enable row level security;

-- Read: authenticated
drop policy if exists leagues_read_auth on public.leagues;
create policy leagues_read_auth on public.leagues
for select to authenticated
using (auth.uid() is not null);

-- Write: staff only
drop policy if exists leagues_write_staff on public.leagues;
create policy leagues_write_staff on public.leagues
for all to authenticated
using (public.is_staff())
with check (public.is_staff());

