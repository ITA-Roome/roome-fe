# React Project Template

## 📌 개요

이 레포는 **React + Vite + TypeScript + TailwindCSS** 기반의 초기 세팅 템플릿입니다.  
새 프로젝트 시작 시, 이 레포를 클론 받아 바로 개발을 시작할 수 있습니다.



## 🛠️ 사용 방법

### 1. 클론하기

```bash
git clone https://github.com/Seojegyeong/React.git MyNewProject
cd MyNewProject
```

### 2. 패키지 설치

```bash
yarn install
```

### 3. 실행

```bash
yarn dev
```



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

- **파일명 규칙**

  - `PascalCase`: 컴포넌트 (예: `LoginPage.tsx`)
  - `camelCase`: 변수, 함수
  - `SCREAMING_SNAKE_CASE`: 상수

- **Commit 규칙**

  - `feat:` 새로운 기능
  - `fix:` 버그 수정
  - `docs:` 문서 수정
  - `refactor:` 리팩토링
  - `chore:` 설정/빌드 관련

- **코드 스타일**
  - ESLint + Prettier 적용
