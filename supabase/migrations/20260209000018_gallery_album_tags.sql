-- 갤러리 앨범/태그 (경기·행사 단위)
alter table public.gallery_items
  add column if not exists event_date date,
  add column if not exists album_name text not null default '',
  add column if not exists tags text not null default '';

comment on column public.gallery_items.event_date is '경기/행사 날짜 (선택)';
comment on column public.gallery_items.album_name is '앨범명 (경기·행사 이름)';
comment on column public.gallery_items.tags is '태그 (쉼표 구분, 예: 시합,MT,연습)';

create index if not exists gallery_items_album_name_idx on public.gallery_items (album_name) where album_name <> '';
