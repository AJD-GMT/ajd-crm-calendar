# AJD CRM Calendar

마케팅 캠페인 관리를 위한 캘린더 애플리케이션

## 기술 스택

### Frontend
- **Framework**: Next.js 15 (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **UI 컴포넌트**: Radix UI
- **캘린더**: Schedule-X
- **폼**: React Hook Form + Zod
- **상태관리**: TanStack Query

### Backend
- **BaaS**: Supabase
- **인증**: Supabase Auth
- **데이터베이스**: PostgreSQL (Supabase)

## 개발 환경 설정

### 1. 의존성 설치

```bash
pnpm install
```

### 2. 환경변수 설정

`.env.local` 파일을 생성하고 다음 변수를 설정하세요:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. 개발 서버 실행

```bash
pnpm dev
```

http://localhost:3000 에서 확인할 수 있습니다.

## 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── login/             # 로그인 페이지
│   └── api/               # API 라우트
│       └── campaigns/
├── features/              # 기능별 모듈
│   ├── auth/             # 인증
│   └── campaigns/        # 캠페인 관리
├── components/           # 공유 컴포넌트
│   ├── layout/          # 레이아웃 컴포넌트
│   ├── calendar/        # 캘린더 컴포넌트
│   ├── filters/         # 필터 컴포넌트
│   └── ui/              # 기본 UI 컴포넌트
├── lib/                 # 라이브러리/유틸
│   ├── supabase/       # Supabase 클라이언트
│   └── utils/          # 유틸 함수
├── constants/          # 상수 정의
├── providers/          # React Context Providers
└── types/              # TypeScript 타입 정의
```

## 사업부별 컬러

- 인터넷: `#3B82F6` (blue-500)
- 렌탈: `#10B981` (emerald-500)
- 모바일: `#8B5CF6` (violet-500)
- 이사: `#F59E0B` (amber-500)
- 상조: `#6B7280` (gray-500)
- 공통: `#EC4899` (pink-500)

## 스크립트

```bash
pnpm dev        # 개발 서버 실행
pnpm build      # 프로덕션 빌드
pnpm start      # 프로덕션 서버 실행
pnpm lint       # ESLint 실행
pnpm typecheck  # TypeScript 타입 체크
```

## 라이센스

Private
