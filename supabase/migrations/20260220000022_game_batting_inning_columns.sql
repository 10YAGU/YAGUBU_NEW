-- 경기 타격 기록: 이닝별 타석 기록 컬럼 추가 (1~9이닝 텍스트 저장)
alter table public.game_batting_lines
  add column if not exists inning_1 text default '',
  add column if not exists inning_2 text default '',
  add column if not exists inning_3 text default '',
  add column if not exists inning_4 text default '',
  add column if not exists inning_5 text default '',
  add column if not exists inning_6 text default '',
  add column if not exists inning_7 text default '',
  add column if not exists inning_8 text default '',
  add column if not exists inning_9 text default '';

comment on column public.game_batting_lines.inning_1 is '1회 타석 결과 (예: 삼진, 4구,도루)';
comment on column public.game_batting_lines.inning_9 is '9회 타석 결과';

-- 경기 타격: 타율(해당 경기), 시즌타율 표시용 (선택 입력)
alter table public.game_batting_lines
  add column if not exists season_avg numeric(5,3) default null;
