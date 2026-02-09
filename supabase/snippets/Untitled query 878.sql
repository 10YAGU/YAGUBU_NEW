-- 갤러리 앨범/태그 컬럼 추가 (Supabase SQL Editor에서 실행)
alter table public.gallery_items
  add column if not exists event_date date,
  add column if not exists album_name text not null default '',
  add column if not exists tags text not null default '';

create index if not exists gallery_items_album_name_idx on public.gallery_items (album_name) where album_name <> '';
