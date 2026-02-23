-- 경기 투수 기록: 상세 스탯 컬럼 추가 (첨부 양식: 결과, 타자, 타수, 피홈런, 희타, 희비, 볼넷, 사구, 삼진, 폭투, 보크, 실점, 투구수)
alter table public.game_pitching_lines
  add column if not exists result text default '',
  add column if not exists bf integer not null default 0,
  add column if not exists ab integer not null default 0,
  add column if not exists hr integer not null default 0,
  add column if not exists sh integer not null default 0,
  add column if not exists sf integer not null default 0,
  add column if not exists bb integer not null default 0,
  add column if not exists hbp integer not null default 0,
  add column if not exists so integer not null default 0,
  add column if not exists wp integer not null default 0,
  add column if not exists balk integer not null default 0,
  add column if not exists r integer not null default 0,
  add column if not exists np integer not null default 0;

comment on column public.game_pitching_lines.result is '경기 결과 (승/패 등)';
comment on column public.game_pitching_lines.bf is '상대 타자 수';
comment on column public.game_pitching_lines.ab is '타수';
comment on column public.game_pitching_lines.hr is '피홈런';
comment on column public.game_pitching_lines.sh is '희생번트';
comment on column public.game_pitching_lines.sf is '희생플라이';
comment on column public.game_pitching_lines.bb is '볼넷';
comment on column public.game_pitching_lines.hbp is '사구';
comment on column public.game_pitching_lines.so is '삼진';
comment on column public.game_pitching_lines.wp is '폭투';
comment on column public.game_pitching_lines.balk is '보크';
comment on column public.game_pitching_lines.r is '실점';
comment on column public.game_pitching_lines.np is '투구수';

-- 시즌 방어율 표시용 (선택 입력)
alter table public.game_pitching_lines
  add column if not exists season_era numeric(5,2) default null;
