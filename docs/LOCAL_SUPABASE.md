# 로컬 Supabase 실행 방법

## 1. 사전 요구사항

- **Docker Desktop** 설치 및 실행 중이어야 합니다.  
  - [Docker 다운로드](https://www.docker.com/products/docker-desktop/)
- **Supabase CLI** 설치

### Supabase CLI 설치 (Windows)

**방법 A – npm**
```bash
npm install -g supabase
```

**방법 B – Scoop**
```bash
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

**방법 C – 공식 설치 스크립트**  
[Supabase CLI 문서](https://supabase.com/docs/guides/cli/getting-started) 참고.

---

## 2. 로컬 Supabase 실행

프로젝트 폴더에서 터미널을 연 뒤:

```bash
cd D:\workspace\YAGUBU_NEW
supabase start
```

처음 실행 시 Docker 이미지 다운로드로 1~2분 걸릴 수 있습니다.

정상 기동 후 터미널에 예시처럼 표시됩니다:

```
Started supabase local development setup.

         API URL: http://127.0.0.1:54321
     GraphQL URL: http://127.0.0.1:54321/graphql/v1
          DB URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres
      Studio URL: http://127.0.0.1:54323
    Inbucket URL: http://127.0.0.1:54324
      anon key: eyJhbGciOiJFUzI1NiIs...
service_role key: eyJhbGciOiJFUzI1NiIs...
```

---

## 3. 앱에서 로컬 Supabase 사용하기

`supabase-config.js`에서 **로컬 주소**를 쓰도록 바꿉니다.

- 아래 두 줄의 **주석을 해제**하고
- 클라우드용 두 줄은 **주석 처리**하세요.

```javascript
// 로컬 사용 시
window.SUPABASE_URL = "http://127.0.0.1:54321";
window.SUPABASE_ANON_KEY = "eyJhbGciOiJFUzI1NiIsImtpZCI6ImI4MTI2OWYxLTIxZDgtNGYyZS1iNzE5LWMyMjQwYTg0MGQ5MCIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjIwODUxMTg4MDd9.Bm1iCCdPu3RDfabPYX23DVITzcmmPSALwkXOmW3aLDQHS9XRvL_Y05BHi8IM67FY3ZR5mhMmYfmv0UNujKYB5Q";

// window.SUPABASE_URL = "https://yeyxdvubodrevzesiazk.supabase.co";
// window.SUPABASE_ANON_KEY = "sb_publishable_...";
```

로컬 anon key는 `supabase start` 출력에 나오는 **anon key**를 그대로 쓰면 됩니다 (위 값은 기본 데모 키 예시).

---

## 4. 마이그레이션 적용 (스키마 반영)

로컬 DB에 테이블/컬럼을 반영하려면:

```bash
cd D:\workspace\YAGUBU_NEW
supabase db reset
```

- `supabase/migrations/` 안의 SQL이 순서대로 실행됩니다.
- 기존 로컬 DB를 지우고 다시 만듭니다.

이미 DB는 있고 마이그레이션만 추가로 적용할 때:

```bash
supabase db push
```

(로컬에서는 보통 `supabase db reset`으로 한 번에 맞춥니다.)

---

## 5. 웹 앱 실행

- **반드시 웹 서버로 열어야 합니다.**  
  `file://`로 열면 `fetch`(CORS) 때문에 로그인/API가 실패합니다.

**간단한 방법 (Python 3 예시):**
```bash
cd D:\workspace\YAGUBU_NEW
python -m http.server 8080
```
브라우저에서 **http://localhost:8080** 으로 접속.

**VS Code 사용 시:**  
Live Server 등으로 `index.html`을 **http://localhost:포트** 로 열면 됩니다.

---

## 6. 로컬 대시보드 (Studio)

브라우저에서:

**http://127.0.0.1:54323**

- 테이블, SQL 편집, 로그 확인 등을 할 수 있습니다.
- 로그인 없이 로컬에서만 동작합니다.

### Studio(브라우저)가 안 열리거나 빈 화면일 때

1. **config.toml 확인**  
   `supabase/config.toml`의 `[studio]` 안에 다음이 있는지 확인하세요.  
   - `api_url = "http://127.0.0.1:54321"`  
   (포트 없이 `http://127.0.0.1`만 있으면 Studio가 API에 연결되지 않아 브라우저에서 동작하지 않습니다.)

2. **Supabase 재시작**  
   설정을 바꾼 뒤에는 반드시 다시 띄워야 합니다.  
   ```bash
   supabase stop
   supabase start
   ```  
   터미널에 `Studio URL: http://127.0.0.1:54323` 이 보이면 브라우저에서 해당 주소로 접속합니다.

3. **Docker 상태**  
   Docker Desktop이 켜져 있고, 컨테이너가 정상 실행 중인지 확인하세요.  
   `docker ps`로 `supabase_studio` 등이 보여야 합니다.

4. **방화벽/백신**  
   `127.0.0.1`, `54321`, `54323` 포트가 차단되지 않았는지 확인하세요.

5. **다른 브라우저·시크릿**  
   캐시 문제일 수 있으니 시크릿 창이나 다른 브라우저로  
   **http://127.0.0.1:54323** 을 열어봅니다.

6. **포트 충돌**  
   다른 프로그램이 54323을 쓰고 있으면 Studio가 실패할 수 있습니다.  
   `supabase start` 로그에 에러가 있는지 확인하고, 필요하면 `config.toml`의 `[studio]`에서 `port = 54323`을 다른 번호(예: 54333)로 바꾼 뒤 다시 `supabase start` 합니다.

---

## 7. 로컬 Supabase 중지

```bash
cd D:\workspace\YAGUBU_NEW
supabase stop
```

데이터까지 모두 지우고 다시 시작하려면:

```bash
supabase stop --no-backup
supabase start
supabase db reset
```

---

## 요약 체크리스트

| 단계 | 명령/작업 |
|------|------------|
| 1 | Docker Desktop 실행 |
| 2 | `supabase start` |
| 3 | `supabase-config.js`에서 로컬 URL/anon key 사용 |
| 4 | `supabase db reset` (또는 `db push`) |
| 5 | `http://localhost:포트` 로 사이트 접속 (file:// 사용 금지) |
