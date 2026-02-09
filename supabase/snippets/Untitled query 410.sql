insert into public.players (
  id, jersey_no, name, role, primary_pos, secondary_pos, status, contact, created_at
) values (
  'admin-player-001',       -- 원하는 고유 ID
  99,                       -- 등번호
  '관리자',                 -- 성명
  '9',                      -- 9=관리자
  '', '',                   -- 주/부포지션(선택)
  '활동',                   -- 활동/탈퇴
  '010-1234-9999',          -- 연락처(뒤4자리 로그인에 사용)
  now()
)
on conflict (id) do update
set jersey_no = excluded.jersey_no,
    name = excluded.name,
    role = excluded.role,
    primary_pos = excluded.primary_pos,
    secondary_pos = excluded.secondary_pos,
    status = excluded.status,
    contact = excluded.contact;
    

