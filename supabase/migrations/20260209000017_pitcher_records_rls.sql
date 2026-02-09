-- RLS for pitcher_records (투수 기록)
alter table public.pitcher_records enable row level security;

drop policy if exists pitcher_read_auth on public.pitcher_records;
create policy pitcher_read_auth on public.pitcher_records
for select to authenticated
using (auth.uid() is not null);

drop policy if exists pitcher_write_staff on public.pitcher_records;
create policy pitcher_write_staff on public.pitcher_records
for all to authenticated
using (public.is_staff())
with check (public.is_staff());
