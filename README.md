# 📱 한국 통신사 이커머스 쇼핑몰

복잡한 한국 통신비 구조(공시지원금 vs 선택약정)를 투명하게 비교하고, 최적의 조건으로 스마트폰을 구매할 수 있는 전문 쇼핑몰 웹 애플리케이션입니다.

## ✨ 주요 기능

### 🎯 핵심 비즈니스 로직

1. **가격 비교 시스템**
   - **공시지원금 방식**: 출고가 - (공시지원금 + 추가지원금) = 할부원금
   - **선택약정 방식**: 기기값 그대로 할부, 월 요금 25% 할인
   - 2년 총 납부액을 자동으로 비교하여 더 저렴한 옵션 추천

2. **정확한 월 납부액 계산**
   - 연 5.9% 할부 이자 적용 (원리금 균등상환 방식)
   - 월 할부금 + 월 통신료 = 최종 월 납부액
   - 실제 청구 금액을 투명하게 표시

3. **추가 할인 시뮬레이터**
   - 제휴카드 할인 (5,000~15,000원/월)
   - 가족결합 할인 (인터넷+TV 결합 시 10,000~20,000원/월)
   - 실시간 금액 재계산

### 📱 사용자 페이지

- **메인 페이지**: 최신 기종 캐러셀, 인기 상품, 베스트 딜
- **상품 목록**: 전체 상품 그리드 뷰
- **상품 상세**: 통신사/요금제 선택, 가격 비교 계산기
- **주문 신청**: 고객 정보 입력, 본인인증 연동 (예정)

### 🔧 관리자 페이지

`/admin.html` 경로로 접근 가능한 관리자 페이지:

- **상품 관리**: 기기 등록/수정/삭제
- **공시지원금 관리**: 통신사별 지원금 업데이트
- **요금제 관리**: 요금제 등록/수정
- **주문 관리**: 주문 내역 조회 및 상태 관리

## 🛠️ 기술 스택

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom Components

### Backend
- **Runtime**: Node.js (Next.js API Routes)
- **ORM**: Prisma
- **Database**: SQLite (개발), PostgreSQL (프로덕션 권장)

### DevOps
- **Package Manager**: npm
- **Build Tool**: Next.js Turbopack
- **Version Control**: Git

## 📦 프로젝트 구조

```
telecom-shop/
├── app/                      # Next.js App Router 페이지
│   ├── page.tsx             # 메인 페이지
│   ├── layout.tsx           # 루트 레이아웃
│   ├── globals.css          # 전역 스타일
│   └── products/            # 상품 관련 페이지
│       ├── page.tsx         # 상품 목록
│       └── [id]/page.tsx    # 상품 상세
├── components/              # React 컴포넌트
│   └── ProductDetailClient.tsx
├── lib/                     # 라이브러리 설정
│   └── prisma.ts           # Prisma 클라이언트
├── utils/                   # 유틸리티 함수
│   ├── calculator.ts        # 가격 계산 로직 ⭐
│   └── calculator.test.ts   # 계산 로직 테스트
├── prisma/                  # 데이터베이스 스키마
│   ├── schema.prisma       # Prisma 스키마 정의
│   ├── seed.ts             # 시드 데이터
│   ├── dev.db              # SQLite 데이터베이스
│   └── migrations/         # 마이그레이션 파일
├── public/                  # 정적 파일
│   └── admin.html          # 관리자 페이지 ⭐
├── package.json
├── tsconfig.json
├── tailwind.config.cjs
└── next.config.js
```

## 🚀 시작하기

### 필수 요구사항

- Node.js 18.x 이상
- npm 또는 yarn

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env` 파일을 생성하세요:

```bash
# .env 파일 생성
cp .env.example .env
```

`.env` 파일 내용:
```env
DATABASE_URL="file:./dev.db"
```

### 3. 데이터베이스 설정

```bash
# Prisma 클라이언트 생성
npm run prisma:generate

# 마이그레이션 실행
npm run prisma:migrate

# 시드 데이터 추가
npx tsx prisma/seed.ts
```

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

### 4. 관리자 페이지 접근

브라우저에서 [http://localhost:3000/admin.html](http://localhost:3000/admin.html) 접속

## 🚀 배포 (Deployment)

프로덕션 환경에 배포하는 방법은 **[DEPLOYMENT.md](./DEPLOYMENT.md)** 문서를 참고하세요.

### 빠른 배포 (Vercel 권장)

1. Vercel 계정 생성: https://vercel.com
2. GitHub 저장소 연결
3. 환경 변수 설정: `DATABASE_URL`
4. 배포 클릭!

자세한 내용은 [배포 가이드](./DEPLOYMENT.md)를 확인하세요.

## 📊 데이터베이스 스키마

### 주요 테이블

- **Manufacturer**: 제조사 (삼성, 애플 등)
- **Carrier**: 통신사 (SKT, KT, LG U+)
- **Product**: 상품 (기기 정보)
- **Plan**: 요금제 (데이터, 월정액)
- **Subsidy**: 공시지원금 (통신사별, 기간별)
- **Order**: 주문 (고객 정보, 선택 옵션)

### ERD 구조

```
Manufacturer 1:N Product
Carrier 1:N Plan
Carrier 1:N Subsidy
Product 1:N Subsidy
Product 1:N Order
Plan 1:N Order
```

## 💡 핵심 계산 로직

### 공시지원금 방식

```typescript
할부원금 = 출고가 - 공시지원금 - 추가지원금
월 할부금 = 원리금_균등상환(할부원금, 5.9%, 24개월)
월 납부액 = 월 할부금 + 월 통신료 - 추가할인
총 납부액 = 월 납부액 × 24개월
```

### 선택약정 방식

```typescript
할부원금 = 출고가 (할인 없음)
월 할부금 = 원리금_균등상환(할부원금, 5.9%, 24개월)
할인된_월_통신료 = 월 통신료 × 0.75 (25% 할인)
월 납부액 = 월 할부금 + 할인된_월_통신료 - 추가할인
총 납부액 = 월 납부액 × 24개월
```

### 원리금 균등상환 공식

```typescript
월 할부금 = P × r × (1+r)^n / ((1+r)^n - 1)
// P: 할부원금, r: 월 이자율, n: 개월 수
```

## 🧪 테스트

계산 로직 테스트 실행:

```bash
npx tsx utils/calculator.test.ts
```

**테스트 결과 예시:**
```
📱 테스트 상품: 갤럭시 S25 Ultra
출고가: 1,350,000원
공시지원금: 400,000원
추가지원금: 100,000원
월 요금제: 65,000원

--- 공시지원금 방식 ---
💰 월 납부액: 82,634원
📊 2년 총액: 1,983,216원

--- 선택약정 방식 ---
💰 월 납부액: 88,522원
📊 2년 총액: 2,124,528원

✅ 추천 방식: 공시지원금
💵 절약액: 141,312원
```

## 📝 환경 변수

`.env` 파일 생성:

```env
# SQLite (개발용)
DATABASE_URL="file:./dev.db"

# PostgreSQL (프로덕션 권장)
# DATABASE_URL="postgresql://user:password@localhost:5432/telecom_shop"
```

## 🔧 빌드 및 배포

### 프로덕션 빌드

```bash
npm run build
```

### 프로덕션 서버 실행

```bash
npm run start
```

### 권장 배포 플랫폼

- **Vercel**: Next.js 최적화 (권장)
- **Railway**: 데이터베이스 포함 배포
- **AWS**: EC2 + RDS
- **Heroku**: 간편한 배포

## 🎨 UI/UX 특징

### 신뢰성 강조
- 깔끔하고 전문적인 디자인
- 모든 계산 과정을 투명하게 공개
- 툴팁으로 상세 공식 제공

### 직관적인 인터페이스
- 색상으로 시각적 구분
- 실시간 가격 재계산
- 비교 카드로 선택 용이

### 통신사 브랜드 컬러
- SKT: #ea002c (레드)
- KT: #e30613 (레드)
- LG U+: #c4166d (마젠타)

## 📱 샘플 데이터

시드 데이터에 포함된 상품:

1. **갤럭시 S25 Ultra 256GB** - 1,350,000원
2. **갤럭시 S25 Ultra 512GB** - 1,550,000원
3. **아이폰 17 Pro 256GB** - 1,550,000원
4. **아이폰 17 128GB** - 1,250,000원

각 상품은 SKT, KT, LG U+ 3개 통신사의 공시지원금 데이터를 포함합니다.

## 🚧 향후 개발 계획

- [ ] 본인인증 연동 (NICE 평가정보 API)
- [ ] 결제 시스템 연동 (PG사 API)
- [ ] 실시간 재고 관리
- [ ] 배송 추적 시스템
- [ ] 고객 리뷰 및 평점
- [ ] 이메일/SMS 알림
- [ ] 관리자 대시보드 차트
- [ ] 상품 비교 기능 (최대 3개)
- [ ] 위시리스트 / 장바구니
- [ ] 소셜 로그인 (카카오, 네이버)

## 📄 라이선스

이 프로젝트는 개인 학습 및 포트폴리오 목적으로 제작되었습니다.

## 👨‍💻 개발자

한국 통신 시장에 특화된 이커머스 전문가 AI 🤖

---

**⚠️ 주의사항**

- 실제 공시지원금은 통신사 정책에 따라 수시로 변경될 수 있습니다
- 할부 이자율은 카드사 및 신용도에 따라 다를 수 있습니다
- 본 프로젝트는 데모 목적이며, 실제 거래 시스템이 아닙니다

**📞 문의**

기술 문의 또는 개선 제안은 이슈를 등록해주세요.
