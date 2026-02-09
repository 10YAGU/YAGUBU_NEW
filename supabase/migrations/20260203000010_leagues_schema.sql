-- 10) Leagues (리그)
create table if not exists public.leagues (
  id text primary key,
  name text not null,
  created_at timestamptz not null default now()
);

insert into public.leagues (id, name)
values
  ('nono', '노노리그'),
  ('dongguk', '동국대리그')
on conflict (id) do update set name = excluded.name;

