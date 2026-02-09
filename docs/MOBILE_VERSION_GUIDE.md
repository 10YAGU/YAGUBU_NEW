# YAGUBU 홈페이지 모바일 버전 가이드

홈페이지를 모바일에서도 잘 보이게 만드는 방법을 단계별로 정리했습니다.

---

## 1. 모바일 대응 방식 선택

| 방식 | 설명 | 장점 | 단점 |
|------|------|------|------|
| **반응형 웹(RWD)** | 하나의 HTML/CSS로 화면 크기에 따라 레이아웃만 바꿈 | 유지보수 쉬움, URL 하나 | CSS/레이아웃 작업 필요 |
| **별도 모바일 사이트** | m.도메인 등 별도 페이지 | 모바일 전용 디자인 가능 | 두 벌 관리 필요 |
| **PWA** | 반응형 + “앱처럼 설치” | 홈화면 추가, 오프라인 등 | 서비스 워커 등 설정 필요 |

**추천:** YAGUBU처럼 단일 페이지 앱은 **반응형 웹(RWD)**으로 모바일 대응하는 것이 가장 적합합니다.  
이미 `viewport` 메타와 일부 `@media`가 있으므로, 여기에 **모바일용 스타일을 추가**하는 방식으로 진행하면 됩니다.

---

## 2. 현재 상태 (YAGUBU 기준)

- ✅ `viewport` 설정됨 (`width=device-width, initial-scale=1.0`)
- ✅ 갤러리 그리드 등 일부 `@media (max-width: 1200px)`, `(900px)` 존재
- ⚠️ 네비게이션: 링크·버튼이 많아 좁은 화면에서 겹치거나 넘침
- ⚠️ 테이블(일정, 개인기록, 투수기록 등): 컬럼 수 많아 가로 스크롤 또는 가독성 이슈
- ⚠️ 카드/폼: 패딩·폰트가 데스크톱 기준이라 모바일에서 다소 큼

---

## 3. 반응형으로 “모바일 버전” 만드는 순서

### 3-1. 브레이크포인트 정하기

화면 너비에 따라 레이아웃을 나누는 기준입니다.

```css
/* 예시: style.css 맨 아래 또는 전용 섹션에 */
/* 모바일 우선: 기본을 작은 화면으로 두고, 넓은 화면에서만 추가 스타일 */

@media (max-width: 768px) {
  /* 태블릿/모바일 가로 */
}

@media (max-width: 480px) {
  /* 모바일 세로 (가장 좁음) */
}
```

- **768px 이하:** 모바일·태블릿 세로
- **480px 이하:** 작은 폰
- (이미 있는 **900px, 1200px**은 “작은 데스크톱 ~ 태블릿”으로 활용 가능)

---

### 3-2. 네비게이션(헤더) 모바일 대응

**문제:** 링크+테마 버튼+로그인 버튼이 한 줄에 다 있으면 320px 등에서 넘침.

**방법 1: 햄버거 메뉴 (추천)**

- 기본(모바일): 로고 + **햄버거 아이콘(≡)** 만 보이게
- 아이콘 클릭 시: **풀다운/풀스크린**으로 “팀 소개”, “기록 및 일정”, “커뮤니티”, “갤러리”, “로그인” 등 표시

**HTML 예시 (헤더 부분):**

```html
<nav class="navbar">
  <div class="nav-left">
    <div class="logo">YAGUBU</div>
    <button type="button" class="nav-toggle" id="navToggle" aria-label="메뉴">☰</button>
  </div>
  <div class="nav-center nav-menu" id="navMenu">
    <a href="#teamIntro" class="nav-link">팀 소개</a>
    <a href="#seasonSection" class="nav-link">기록 및 일정</a>
    <a href="#communitySection" class="nav-link">커뮤니티</a>
    <a href="#gallerySection" class="nav-link">갤러리</a>
  </div>
  <div class="nav-right">
    <!-- 테마, 로그인 등 -->
  </div>
</nav>
```

**CSS 예시:**

```css
/* 768px 이하: 햄버거만 보이고 메뉴는 접힘 */
@media (max-width: 768px) {
  .navbar {
    padding: 12px 16px;
    flex-wrap: wrap;
  }
  .nav-toggle {
    display: block;
    background: none;
    border: none;
    color: var(--accent);
    font-size: 24px;
    cursor: pointer;
    margin-left: 12px;
  }
  .nav-center.nav-menu {
    display: none;
    width: 100%;
    order: 3;
    flex-direction: column;
    gap: 0;
    padding-top: 12px;
    border-top: 1px solid var(--border-subtle);
  }
  .nav-center.nav-menu.is-open {
    display: flex;
  }
  .nav-center .nav-link {
    padding: 12px 0;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .logo { font-size: 24px; }
  .nav-right {
    margin-left: auto;
  }
}
@media (min-width: 769px) {
  .nav-toggle { display: none; }
}
```

**JS 예시 (script.js 또는 별도):**

```javascript
document.getElementById('navToggle')?.addEventListener('click', function() {
  document.getElementById('navMenu').classList.toggle('is-open');
});
```

이렇게 하면 “모바일 버전”처럼 **작은 화면에서는 햄버거 메뉴**, **큰 화면에서는 기존 가로 메뉴**가 됩니다.

---

### 3-3. 메인 컨텐츠 여백·폰트

모바일에서는 패딩을 줄이고, 본문 폰트는 너무 작지 않게 유지합니다.

```css
@media (max-width: 768px) {
  .main-content {
    padding: 100px 16px 24px;  /* 상단은 네비 높이만큼 */
  }
  .card {
    padding: 16px;
  }
  .card-header h3 {
    font-size: 1.1rem;
  }
}
```

---

### 3-4. 카드/그리드 레이아웃

- **상단 3개 카드(최신 공지, 다음 경기, 최근 미디어):** 데스크톱은 3열, 모바일은 1열로.

```css
@media (max-width: 768px) {
  .top-cards {
    grid-template-columns: 1fr;
  }
}
```

- **하단 2열(시즌 기록 + 시즌 전적):** 모바일에서 1열로.

```css
@media (max-width: 768px) {
  .bottom-cards {
    grid-template-columns: 1fr;
  }
}
```

---

### 3-5. 테이블(일정, 개인기록, 투수기록 등)

컬럼이 많으면 가로 스크롤이 나거나 글자가 찌그러집니다.

**방법 A: 가로 스크롤 허용 (가장 간단)**

```css
@media (max-width: 768px) {
  .schedule-table,
  .personal-table {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  .schedule-table table,
  .personal-table table {
    min-width: 600px;  /* 테이블 최소 너비 보장 */
  }
}
```

**방법 B: 카드 형태로 전환 (모바일만)**

- 테이블 대신 “한 행 = 카드 한 장”으로 바꾸려면, **JS로 화면 너비에 따라 렌더링을 다르게** 하거나,  
- CSS만으로는 **같은 테이블**을 `display: block` 등으로 바꾸기 어렵기 때문에,  
  “768px 이하일 때만” 리스트/카드용 HTML을 만들어 두고 JS에서 `window.innerWidth`로 분기하는 방식이 필요합니다.

우선은 **방법 A(가로 스크롤)** 로 두고, 나중에 “모바일 전용 카드 UI”를 원하면 그때 JS/마크업을 추가하는 것을 추천합니다.

---

### 3-6. 폼·모달

- 모달은 이미 `max-width` 등으로 작은 화면에서 잘리지 않게 되어 있는 경우가 많습니다.  
  **모바일에서 전체 화면**처럼 쓰려면:

```css
@media (max-width: 768px) {
  .modal-content {
    width: 100%;
    max-height: 100vh;
    overflow-y: auto;
    margin: 0;
    border-radius: 0;
  }
}
```

- input/select/버튼은 **최소 터치 영역 44px** 정도가 좋습니다.

```css
@media (max-width: 768px) {
  .btn,
  input,
  select,
  .nav-link {
    min-height: 44px;
    padding: 10px 14px;
  }
}
```

---

### 3-7. 갤러리

이미 `@media`로 그리드 열 수가 줄어들어 있으므로, 모바일에서만 더 줄이면 됩니다.

```css
@media (max-width: 480px) {
  .gallery-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
}
```

---

### 3-8. 터치 친화

- 클릭 영역이 너무 작으면 손가락으로 누르기 어렵습니다.  
  버튼·링크는 **최소 44×44px** 권장.
- `:hover`만 있으면 터치 기기에서는 피드백이 없을 수 있으므로,  
  가능하면 `:active` 또는 `:focus` 스타일도 두면 좋습니다.

```css
.btn:active {
  transform: scale(0.98);
}
```

---

## 4. 작업 순서 요약 (실제로 할 때)

1. **브레이크포인트**  
   `768px`, `480px` 두 개를 기준으로 두고, `style.css` 하단에 `@media (max-width: 768px)` 블록을 만든다.
2. **헤더**  
   햄버거 버튼 + `.nav-menu` 표시/숨김 (HTML/CSS/JS 위 예시 참고).
3. **메인·카드**  
   `.main-content` 패딩, `.top-cards` / `.bottom-cards` 1열로 전환.
4. **테이블**  
   `.schedule-table` 등에 `overflow-x: auto` + `min-width` 적용.
5. **모달·폼**  
   작은 화면에서 모달 전체 화면, 버튼/input 최소 높이 44px.
6. **갤러리**  
   필요 시 480px 이하에서 2열로 조정.
7. **실기기 테스트**  
   Chrome DevTools → 디바이스 툴바로 375px, 320px 등에서 한 번씩 확인.

---

## 5. PWA까지 하고 싶을 때 (선택)

“모바일 앱처럼 홈 화면에 추가”까지 하려면:

1. **manifest.json**  
   - `name`, `short_name`, `start_url`, `display: standalone` 등 설정.
2. **서비스 워커**  
   - 캐시로 오프라인/빠른 로딩 (선택).
3. **HTML**  
   - `<link rel="manifest" href="manifest.json">`  
   - 아이콘 `link` 태그 추가.

이미 반응형으로 “모바일 버전”처럼 보이게 만든 뒤, PWA는 그다음 단계로 두면 됩니다.

---

## 6. 정리

- **모바일 버전** = 같은 URL에서 **화면 크기에 따라 레이아웃·여백·메뉴만 바꾸는 반응형**으로 구현하는 것이 가장 현실적입니다.
- YAGUBU는 **viewport + 모바일용 @media 추가 + (선택) 햄버거 메뉴**만 해도 큰 차이가 납니다.
- 테이블은 우선 **가로 스크롤**로 처리하고, 나중에 카드형 UI가 필요하면 JS/마크업을 추가하는 방식이 좋습니다.

원하시면 `style.css`에 들어갈 **768px / 480px용 @media 블록**을 YAGUBU 구조에 맞춰 구체적으로 적어 드리겠습니다.
