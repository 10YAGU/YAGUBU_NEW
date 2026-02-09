-- 9) Team activity gallery (팀활동 갤러리)
create table if not exists public.gallery_items (
  id text primary key,
  write_date date not null,
  write_time time not null,
  author_name text not null,
  author_player_id text references public.players(id) on delete set null,
  author_user_id uuid references auth.users(id) on delete set null,
  short_text text not null default '',
  content text not null default '',
  image_data text not null, -- data URL (base64) or URL
  created_at timestamptz not null default now()
);

alter table public.gallery_items
  add constraint gallery_short_text_len check (char_length(short_text) <= 30);

create index if not exists gallery_items_write_dt_idx on public.gallery_items (write_date desc, write_time desc);
create index if not exists gallery_items_created_at_idx on public.gallery_items (created_at desc);

