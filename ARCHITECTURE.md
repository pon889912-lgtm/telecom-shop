# 🏗️ 프로젝트 구조 및 기술 명세

## 📁 디렉토리 구조

```
telecom-shop/
├── app/                           # Next.js App Router
│   ├── globals.css               # Tailwind CSS 전역 스타일
│   ├── layout.tsx                # 루트 레이아웃 (메타데이터, HTML 구조)
│   ├── page.tsx                  # 메인 페이지 (Hero, Features, Popular Products)
│   └── products/
│       ├── page.tsx              # 상품 목록 (전체 상품 그리드)
│       └── [id]/
│           └── page.tsx          # 상품 상세 (서버 컴포넌트 - DB 조회)
│
├── components/                    # React 컴포넌트
│   └── ProductDetailClient.tsx   # 상품 상세 클라이언트 컴포넌트
│                                  # (통신사/요금제 선택, 가격 계산)
│
├── lib/                           # 라이브러리 설정
│   └── prisma.ts                 # Prisma 클라이언트 싱글톤
│
├── utils/                         # 유틸리티 함수
│   ├── calculator.ts             # ⭐ 핵심 가격 계산 로직
│   │   ├── calculateMonthlyInstallment()  # 월 할부금 계산
│   │   ├── calculatePublicSubsidy()       # 공시지원금 방식
│   │   ├── calculateOptionalDiscount()    # 선택약정 방식
│   │   ├── comparePaymentOptions()        # 두 방식 비교
│   │   └── formatCurrency()               # 금액 포맷팅
│   └── calculator.test.ts        # 계산 로직 테스트
│
├── prisma/                        # Prisma ORM
│   ├── schema.prisma             # 데이터베이스 스키마 정의
│   ├── seed.ts                   # 시드 데이터 (샘플 상품/요금제)
│   ├── dev.db                    # SQLite 데이터베이스 파일
│   └── migrations/               # 마이그레이션 히스토리
│       ├── 20260131031722_init/
│       │   └── migration.sql
│       └── migration_lock.toml
│
├── public/                        # 정적 파일
│   └── admin.html                # ⭐ 관리자 페이지 (Standalone HTML)
│
├── node_modules/                  # npm 패키지
├── .next/                         # Next.js 빌드 출력
│
├── package.json                   # 프로젝트 메타데이터 및 의존성
├── package-lock.json              # 정확한 버전 잠금
├── tsconfig.json                  # TypeScript 설정
├── tailwind.config.cjs            # Tailwind CSS 설정
├── postcss.config.cjs             # PostCSS 설정
├── next.config.js                 # Next.js 설정
├── .env                           # 환경 변수 (DATABASE_URL)
├── .env.example                   # 환경 변수 예시
├── .gitignore                     # Git 무시 파일
└── README.md                      # 프로젝트 문서
```

## 🗄️ 데이터베이스 스키마

### Manufacturer (제조사)
```prisma
model Manufacturer {
  id        String    @id @default(cuid())
  name      String    @unique  // "Samsung", "Apple"
  nameKo    String              // "삼성전자", "애플"
  products  Product[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}
```

### Carrier (통신사)
```prisma
model Carrier {
  id        String     @id @default(cuid())
  name      String     @unique  // "SKT", "KT", "LG U+"
  code      String     @unique  // "skt", "kt", "lgu"
  color     String                // 브랜드 컬러 (#ea002c)
  plans     Plan[]
  subsidies Subsidy[]
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
}
```

### Product (상품/기기)
```prisma
model Product {
  id              String        @id @default(cuid())
  name            String        // "갤럭시 S25 Ultra"
  model           String        // "SM-S938N"
  capacity        String        // "256GB"
  color           String        // "티타늄 그레이"
  retailPrice     Int           // 1350000 (출고가)
  imageUrl        String?
  thumbnailUrl    String?
  releaseDate     DateTime
  description     String?
  specs           String?       // JSON 문자열
  
  manufacturer    Manufacturer  @relation(...)
  manufacturerId  String
  
  subsidies       Subsidy[]
  orders          Order[]
  
  isActive        Boolean       @default(true)
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
}
```

### Plan (요금제)
```prisma
model Plan {
  id          String   @id @default(cuid())
  name        String   // "5G 프리미어 플러스"
  dataAmount  String   // "무제한"
  voiceAmount String   @default("무제한")
  smsAmount   String   @default("무제한")
  monthlyFee  Int      // 65000
  description String?
  features    String?  // JSON 문자열
  
  carrier     Carrier  @relation(...)
  carrierId   String
  
  orders      Order[]
  
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Subsidy (공시지원금)
```prisma
model Subsidy {
  id                String   @id @default(cuid())
  
  product           Product  @relation(...)
  productId         String
  
  carrier           Carrier  @relation(...)
  carrierId         String
  
  publicSubsidy     Int      // 400000 (공시지원금)
  additionalSubsidy Int      @default(0)  // 100000 (추가지원금)
  
  validFrom         DateTime // 2026-01-01
  validUntil        DateTime // 2026-03-31
  
  isActive          Boolean  @default(true)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  @@unique([productId, carrierId, validFrom])
}
```

### Order (주문)
```prisma
model Order {
  id                String   @id @default(cuid())
  orderNumber       String   @unique  // "ORD-20260131-0001"
  
  product           Product  @relation(...)
  productId         String
  
  plan              Plan     @relation(...)
  planId            String
  
  discountType      String   // "PUBLIC_SUBSIDY" | "OPTIONAL_DISCOUNT"
  installmentMonths Int      @default(24)
  
  cardDiscount      Int      @default(0)  // 10000
  familyDiscount    Int      @default(0)  // 10000
  
  installmentPrincipal Int   // 계산된 할부원금
  monthlyInstallment   Int   // 계산된 월 할부금
  monthlyPlanFee       Int   // 계산된 월 요금
  monthlyPayment       Int   // 계산된 월 납부액
  totalPayment         Int   // 계산된 총 납부액
  
  customerName      String
  customerPhone     String
  customerBirth     String
  customerEmail     String?
  
  shippingAddress   String?
  shippingZipCode   String?
  shippingMessage   String?
  
  status            String   @default("PENDING")
  
  termsAgreed       Boolean  @default(false)
  privacyAgreed     Boolean  @default(false)
  marketingAgreed   Boolean  @default(false)
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}
```

## 🔄 데이터 플로우

### 1. 상품 조회 플로우

```
사용자 → /products → Prisma → SQLite → Product + Manufacturer
                                       → Subsidy 정보 포함
                                       → 화면 렌더링
```

### 2. 가격 계산 플로우

```
사용자 입력 (통신사, 요금제, 추가할인)
    ↓
ProductDetailClient.tsx (클라이언트 컴포넌트)
    ↓
utils/calculator.ts
    ├─ calculatePublicSubsidy()      → 공시지원금 방식 계산
    ├─ calculateOptionalDiscount()   → 선택약정 방식 계산
    └─ comparePaymentOptions()       → 두 방식 비교
    ↓
결과 반환 (추천 방식, 절약액)
    ↓
UI 업데이트 (실시간)
```

### 3. 주문 플로우 (예정)

```
사용자 → 신청 버튼 클릭
    ↓
주문 페이지 이동
    ↓
고객 정보 입력 + 본인인증
    ↓
API 요청 → Prisma → Order 생성
    ↓
주문 완료 페이지
```

## 🎨 스타일링 시스템

### Tailwind CSS 커스텀 컬러

```javascript
// tailwind.config.cjs
colors: {
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    // ... (생략)
    600: '#0284c7',  // 메인 브랜드 컬러
    // ... (생략)
  },
  skt: '#ea002c',    // SKT 레드
  kt: '#e30613',     // KT 레드
  lgu: '#c4166d',    // LG U+ 마젠타
}
```

### 반응형 브레이크포인트

- `sm`: 640px (모바일)
- `md`: 768px (태블릿)
- `lg`: 1024px (데스크톱)
- `xl`: 1280px (대형 데스크톱)

## 📦 주요 의존성

### 프로덕션 의존성

```json
{
  "next": "^15.1.6",              // React 프레임워크
  "react": "^19.0.0",             // UI 라이브러리
  "react-dom": "^19.0.0",
  "@prisma/client": "^6.2.0",     // ORM 클라이언트
  "zustand": "^5.0.2",            // 상태 관리 (경량)
  "zod": "^3.24.1",               // 스키마 검증
  "react-hook-form": "^7.54.2",   // 폼 관리
  "@hookform/resolvers": "^3.9.1",
  "clsx": "^2.1.1",               // 클래스명 유틸
  "tailwind-merge": "^2.6.0"      // Tailwind 병합
}
```

### 개발 의존성

```json
{
  "@types/node": "^22.10.2",
  "@types/react": "^19.0.6",
  "@types/react-dom": "^19.0.2",
  "typescript": "^5.7.2",
  "tailwindcss": "^3.4.17",
  "postcss": "^8.4.49",
  "autoprefixer": "^10.4.20",
  "eslint": "^9.17.0",
  "eslint-config-next": "^15.1.6",
  "prisma": "^6.2.0"              // ORM CLI
}
```

## 🚀 NPM Scripts

```json
{
  "dev": "next dev",                    // 개발 서버 (localhost:3000)
  "build": "next build",                // 프로덕션 빌드
  "start": "next start",                // 프로덕션 서버
  "lint": "next lint",                  // ESLint 검사
  "prisma:generate": "prisma generate", // Prisma 클라이언트 생성
  "prisma:migrate": "prisma migrate dev", // 마이그레이션
  "prisma:studio": "prisma studio"      // Prisma Studio (DB GUI)
}
```

## 🔐 환경 변수

```bash
# .env
DATABASE_URL="file:./dev.db"  # SQLite (개발)
# DATABASE_URL="postgresql://..." # PostgreSQL (프로덕션)

# 추후 추가 예정:
# NICE_API_KEY="..."           # 본인인증 API
# PG_API_KEY="..."             # 결제 API
# NEXT_PUBLIC_API_URL="..."    # API 엔드포인트
```

## 📊 성능 지표

### Lighthouse 점수 목표

- **Performance**: 90+
- **Accessibility**: 100
- **Best Practices**: 100
- **SEO**: 100

### 번들 사이즈

- **First Load JS**: ~106 kB (메인 페이지)
- **Dynamic Page**: ~109 kB (상품 상세)

## 🧪 테스트 전략

### 단위 테스트
- `utils/calculator.test.ts`: 계산 로직 검증

### 향후 추가 예정
- E2E 테스트 (Playwright)
- 컴포넌트 테스트 (React Testing Library)
- API 테스트 (Jest)

## 🔧 개발 가이드

### 코드 스타일
- **TypeScript Strict Mode** 활성화
- **ESLint** + **Prettier** 사용
- **Conventional Commits** 권장

### Git 브랜치 전략
- `master`: 메인 브랜치
- `develop`: 개발 브랜치
- `feature/*`: 기능 개발
- `hotfix/*`: 긴급 수정

### 커밋 메시지 컨벤션
```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅
refactor: 리팩토링
test: 테스트 추가
chore: 빌드/설정 변경
```

## 📈 확장 계획

### Phase 1 (완료)
- ✅ 기본 UI/UX 구현
- ✅ 가격 계산 로직
- ✅ 상품/요금제 관리

### Phase 2 (계획)
- [ ] 본인인증 연동
- [ ] 결제 시스템
- [ ] 주문 프로세스

### Phase 3 (계획)
- [ ] 고객 리뷰
- [ ] 실시간 재고
- [ ] 알림 시스템

## 🌐 배포 아키텍처

### 권장 구성
```
[사용자]
    ↓
[Vercel CDN] → Next.js App
    ↓
[Supabase/Railway] → PostgreSQL
```

### 대체 구성
```
[사용자]
    ↓
[Nginx] → [PM2] → Next.js App
    ↓
[PostgreSQL/MySQL]
```

---

**📝 업데이트 날짜**: 2026-01-31  
**🔖 버전**: 1.0.0  
**👨‍💻 작성자**: AI Code Assistant
