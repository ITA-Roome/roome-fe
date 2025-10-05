# Roome_FE

> **잇타(It's TIME) 8기 2팀 – Roome Frontend Repository**

---

## 📂 폴더 구조

```bash
src/
  api/          # axios instance, API 함수
  assets/       # 정적 리소스(svg, 이미지)
  components/   # 재사용 UI
    common/
    layout/
      Header.tsx
      Footer.tsx
  hooks/        # 범용 커스텀 훅
  layout/       # 레이아웃 컴포넌트
    Layout.tsx
  pages/        # 라우팅 엔트리
  routes/       # router 정의
    route.tsx
  types/        # 공용 타입 정의
  utils/        # 포맷터, 헬퍼
App.tsx
main.tsx
index.css
tailwind.config.js
tsconfig.json
```

## 🎯 개발 컨벤션

- **Commit 규칙**

  - `feat:` 새로운 기능
  - `fix:` 버그 수정
  - `docs:` 문서 수정
  - `refactor:` 리팩토링
  - `chore:` 설정/빌드 관련
