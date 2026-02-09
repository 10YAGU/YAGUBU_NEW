## Supabase 설정 (YAGUBU_NEW)

### 1) Supabase 프로젝트 생성
- Supabase에서 새 프로젝트를 만든 뒤, SQL Editor에서 `supabase/schema.sql`을 실행합니다.
- 다음으로 SQL Editor에서 `supabase/rls.sql`을 실행하면 **Auth + RLS(권한)** 가 적용됩니다.

### 2) 키 준비
- Project Settings → API 에서 아래 값을 확인합니다.
  - **Project URL**
  - **anon public key**

### 3) 소스에 키 입력
- `script.js`의 `SUPABASE_URL`, `SUPABASE_ANON_KEY`에 값을 넣으면 Supabase를 사용합니다.
- 값이 비어있으면 기존처럼 `localStorage` 모드로 동작합니다(공유 불가).

### 4) 기존(localStorage) 데이터 이관
- 앱에서 `window.yagubuMigrateLocalToSupabase()`를 실행하면 현재 브라우저에 저장된 데이터를 Supabase로 업로드합니다.
  - 업로드 후 새로고침하면 Supabase 데이터가 표시됩니다.

### 5) 운영 권한(감독/코치/총무/관리자만 쓰기)
- `supabase/rls.sql`은 모든 테이블을 **authenticated 읽기**, **staff만 등록/수정/삭제**로 제한합니다.
- staff 판정은 `public.user_profiles.role` 값이 `1/2/3/9`인지로 결정됩니다.
- Supabase Dashboard → Authentication에서 사용자를 만든 뒤, SQL Editor에서 role을 부여하세요:

```sql
update public.user_profiles
set role = '9'
where id = '<auth.users uuid>';
```

> 보안 주의: RLS가 켜진 상태에서도 anon key는 “인증 전”에는 읽기/쓰기 모두 제한됩니다.
> 실제 운영에서는 반드시 이 방식(Supabase Auth + RLS)을 권장합니다.

### 6) 기존 로그인(성명 + 뒤4자리) 간편 로그인(자동 Auth 계정 매칭/생성)
- `supabase/rls.sql`에 아래 RPC가 포함되어 있습니다.
  - `lookup_player_login(name, last4)` : 선수단에서 매칭
  - `link_my_profile(player_id)` : 로그인 후 user_profiles에 role/player_id 연결
- 앱에서는 Supabase 모드에서 **이메일/비번을 입력하지 않고** 성명+뒤4자리만 입력하면:
  - 매칭된 선수 정보를 기반으로 내부 이메일을 만들고(예: `player_<playerId>@yagubu.local`)
  - 없으면 자동 회원가입(signUp), 있으면 로그인(signIn) 후
  - `user_profiles`를 자동 연결해 권한(role)을 반영합니다.

> Supabase Auth 설정에서 “Email confirmations”가 켜져 있으면 signUp 후 즉시 로그인이 안 될 수 있습니다.
> 운영 편의를 위해 Email confirmations를 끄거나, 관리자 계정으로 미리 유저를 만들어두는 방식을 권장합니다.

