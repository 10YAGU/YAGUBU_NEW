-- YAGUBU_NEW - Supabase Auth + RLS policies
-- Run after `supabase/schema.sql`.

-- 0) User profile table (maps auth user -> role / optional player_id)
create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default '4',        -- 9:관리자,1:감독,2:코치,3:총무,4:선수
  player_id text references public.players(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists user_profiles_role_idx on public.user_profiles (role);

-- Auto-create profile on sign-up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_profiles (id, role, created_at, updated_at)
  values (new.id, '4', now(), now())
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Helper: staff check
create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
set row_security = off
as $$
  select exists(
    select 1
    from public.user_profiles up
    where up.id = auth.uid()
      and up.role in ('1','2','3','9')
  );
$$;

-- 0.1) Legacy login helpers (name + phone last4 -> player)
-- Used to bridge old login UX into Supabase Auth.
create or replace function public.lookup_player_login(p_name text, p_last4 text)
returns table(player_id text, role text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_last4 text;
begin
  v_last4 := regexp_replace(coalesce(p_last4,''), '\D', '', 'g');
  if length(v_last4) <> 4 then
    return;
  end if;

  return query
  select p.id, p.role
  from public.players p
  where p.status = '활동'
    and p.name = coalesce(p_name,'')
    and right(regexp_replace(coalesce(p.contact,''), '\D', '', 'g'), 4) = v_last4
  limit 1;
end;
$$;

grant execute on function public.lookup_player_login(text, text) to anon, authenticated;

create or replace function public.link_my_profile(p_player_id text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid;
  v_role text;
begin
  v_uid := auth.uid();
  if v_uid is null then
    raise exception 'not authenticated';
  end if;

  select role into v_role
  from public.players
  where id = p_player_id
  limit 1;

  if v_role is null then
    raise exception 'player not found';
  end if;

  insert into public.user_profiles (id, role, player_id, created_at, updated_at)
  values (v_uid, v_role, p_player_id, now(), now())
  on conflict (id) do update
    set role = excluded.role,
        player_id = excluded.player_id,
        updated_at = now();

  return v_role;
end;
$$;

grant execute on function public.link_my_profile(text) to authenticated;

-- 1) Enable RLS on all tables
alter table public.leagues enable row level security;
alter table public.notices enable row level security;
alter table public.schedules enable row level security;
alter table public.media enable row level security;
alter table public.players enable row level security;
alter table public.personal_records enable row level security;
alter table public.team_content enable row level security;
alter table public.community_posts enable row level security;
alter table public.community_comments enable row level security;
alter table public.gallery_items enable row level security;
alter table public.user_profiles enable row level security;

-- 2) Policies: read for authenticated, write for staff
-- Leagues
drop policy if exists leagues_read_auth on public.leagues;
create policy leagues_read_auth on public.leagues
for select to authenticated
using (auth.uid() is not null);

drop policy if exists leagues_write_staff on public.leagues;
create policy leagues_write_staff on public.leagues
for all to authenticated
using (public.is_staff())
with check (public.is_staff());

-- Notices
drop policy if exists notices_read_auth on public.notices;
create policy notices_read_auth on public.notices
for select to authenticated
using (auth.uid() is not null);

drop policy if exists notices_write_staff on public.notices;
create policy notices_write_staff on public.notices
for all to authenticated
using (public.is_staff())
with check (public.is_staff());

-- Schedules
drop policy if exists schedules_read_auth on public.schedules;
create policy schedules_read_auth on public.schedules
for select to authenticated
using (auth.uid() is not null);

drop policy if exists schedules_write_staff on public.schedules;
create policy schedules_write_staff on public.schedules
for all to authenticated
using (public.is_staff())
with check (public.is_staff());

-- Media
drop policy if exists media_read_auth on public.media;
create policy media_read_auth on public.media
for select to authenticated
using (auth.uid() is not null);

drop policy if exists media_write_staff on public.media;
create policy media_write_staff on public.media
for all to authenticated
using (public.is_staff())
with check (public.is_staff());

-- Players
drop policy if exists players_read_auth on public.players;
create policy players_read_auth on public.players
for select to authenticated
using (auth.uid() is not null);

drop policy if exists players_write_staff on public.players;
create policy players_write_staff on public.players
for all to authenticated
using (public.is_staff())
with check (public.is_staff());

-- Personal records
drop policy if exists personal_read_auth on public.personal_records;
create policy personal_read_auth on public.personal_records
for select to authenticated
using (auth.uid() is not null);

drop policy if exists personal_write_staff on public.personal_records;
create policy personal_write_staff on public.personal_records
for all to authenticated
using (public.is_staff())
with check (public.is_staff());

-- Team content
drop policy if exists team_content_read_auth on public.team_content;
create policy team_content_read_auth on public.team_content
for select to authenticated
using (auth.uid() is not null);

drop policy if exists team_content_write_staff on public.team_content;
create policy team_content_write_staff on public.team_content
for all to authenticated
using (public.is_staff())
with check (public.is_staff());

-- User profiles
drop policy if exists profiles_read_self on public.user_profiles;
create policy profiles_read_self on public.user_profiles
for select to authenticated
using (id = auth.uid() or public.is_staff());

drop policy if exists profiles_write_staff on public.user_profiles;
create policy profiles_write_staff on public.user_profiles
for update to authenticated
using (public.is_staff())
with check (public.is_staff());

-- Community posts
drop policy if exists community_read_auth on public.community_posts;
create policy community_read_auth on public.community_posts
for select to authenticated
using (auth.uid() is not null);

drop policy if exists community_insert_auth on public.community_posts;
create policy community_insert_auth on public.community_posts
for insert to authenticated
with check (auth.uid() is not null);

drop policy if exists community_update_staff_or_author on public.community_posts;
create policy community_update_staff_or_author on public.community_posts
for update to authenticated
using (public.is_staff() or author_user_id = auth.uid())
with check (public.is_staff() or author_user_id = auth.uid());

drop policy if exists community_delete_staff_or_author on public.community_posts;
create policy community_delete_staff_or_author on public.community_posts
for delete to authenticated
using (public.is_staff() or author_user_id = auth.uid());

-- Community comments
drop policy if exists community_comments_read_auth on public.community_comments;
create policy community_comments_read_auth on public.community_comments
for select to authenticated
using (auth.uid() is not null);

drop policy if exists community_comments_insert_auth on public.community_comments;
create policy community_comments_insert_auth on public.community_comments
for insert to authenticated
with check (auth.uid() is not null);

drop policy if exists community_comments_update_staff_or_author on public.community_comments;
create policy community_comments_update_staff_or_author on public.community_comments
for update to authenticated
using (public.is_staff() or author_user_id = auth.uid())
with check (public.is_staff() or author_user_id = auth.uid());

drop policy if exists community_comments_delete_staff_or_author on public.community_comments;
create policy community_comments_delete_staff_or_author on public.community_comments
for delete to authenticated
using (public.is_staff() or author_user_id = auth.uid());

-- Gallery items
drop policy if exists gallery_read_auth on public.gallery_items;
create policy gallery_read_auth on public.gallery_items
for select to authenticated
using (auth.uid() is not null);

drop policy if exists gallery_insert_auth on public.gallery_items;
create policy gallery_insert_auth on public.gallery_items
for insert to authenticated
with check (auth.uid() is not null);

drop policy if exists gallery_update_staff_or_author on public.gallery_items;
create policy gallery_update_staff_or_author on public.gallery_items
for update to authenticated
using (public.is_staff() or author_user_id = auth.uid())
with check (public.is_staff() or author_user_id = auth.uid());

drop policy if exists gallery_delete_staff_or_author on public.gallery_items;
create policy gallery_delete_staff_or_author on public.gallery_items
for delete to authenticated
using (public.is_staff() or author_user_id = auth.uid());
