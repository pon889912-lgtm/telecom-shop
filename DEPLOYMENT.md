# 🚀 배포 가이드 (Deployment Guide)

이 문서는 통신사 쇼핑몰을 다양한 플랫폼에 배포하는 방법을 설명합니다.

## ⚠️ 중요: 환경 변수 설정

배포 전에 반드시 **환경 변수**를 설정해야 합니다!

### 필수 환경 변수

```bash
DATABASE_URL="your_database_url_here"
```

---

## 1️⃣ Vercel 배포 (추천)

### 장점
- Next.js 최적화
- 자동 HTTPS
- 무료 취미 플랜
- 쉬운 CI/CD

### 배포 단계

#### A. Vercel CLI 사용

```bash
# Vercel CLI 설치
npm i -g vercel

# 로그인
vercel login

# 배포
vercel --prod
```

#### B. Vercel 웹사이트 사용

1. https://vercel.com 접속
2. "Add New Project" 클릭
3. GitHub 저장소 연결: `pon889912-lgtm/telecom-shop`
4. **환경 변수 설정** (중요!)
   ```
   DATABASE_URL = your_database_connection_string
   ```
5. "Deploy" 클릭

### 데이터베이스 옵션

**Option 1: Vercel Postgres (권장)**
```bash
# Vercel 대시보드에서 Postgres 추가
# 자동으로 DATABASE_URL이 설정됩니다
```

**Option 2: Supabase**
1. https://supabase.com 회원가입
2. 새 프로젝트 생성
3. Database → Connection String 복사
4. Vercel 환경 변수에 추가:
   ```
   DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres"
   ```

**Option 3: Railway**
1. https://railway.app 회원가입
2. PostgreSQL 추가
3. Connection String 복사
4. Vercel 환경 변수에 추가

### 마이그레이션 실행

Vercel 배포 후 데이터베이스 초기화:

```bash
# 로컬에서 프로덕션 DB에 마이그레이션
DATABASE_URL="your_production_db_url" npx prisma migrate deploy

# 시드 데이터 추가
DATABASE_URL="your_production_db_url" npx tsx prisma/seed.ts
```

---

## 2️⃣ Netlify 배포

### 배포 단계

1. https://netlify.com 접속
2. "Add new site" → "Import an existing project"
3. GitHub 저장소 연결
4. Build settings:
   ```
   Build command: npm run build
   Publish directory: .next
   ```
5. **환경 변수 설정**:
   ```
   DATABASE_URL = your_database_url
   ```

---

## 3️⃣ Railway 배포

### 장점
- 데이터베이스 포함
- 간편한 배포
- 월 5달러 무료 크레딧

### 배포 단계

1. https://railway.app 접속
2. "New Project" → "Deploy from GitHub repo"
3. 저장소 선택: `telecom-shop`
4. PostgreSQL 서비스 추가:
   - "New" → "Database" → "PostgreSQL"
5. 환경 변수 자동 연결됨
6. 배포 완료!

---

## 4️⃣ 로컬 프로덕션 빌드 테스트

배포 전에 로컬에서 테스트:

```bash
# 1. 프로덕션 빌드
npm run build

# 2. 프로덕션 서버 실행
npm run start

# 3. 브라우저에서 확인
# http://localhost:3000
```

---

## 🗄️ 데이터베이스 마이그레이션

### SQLite → PostgreSQL 전환

프로덕션 환경에서는 PostgreSQL 사용 권장:

#### 1. Prisma 스키마 수정

`prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"  // sqlite → postgresql
  url      = env("DATABASE_URL")
}
```

#### 2. 마이그레이션 재생성

```bash
# 기존 마이그레이션 삭제
rm -rf prisma/migrations

# 새 마이그레이션 생성
npx prisma migrate dev --name init

# 프로덕션 적용
DATABASE_URL="your_prod_db" npx prisma migrate deploy
```

#### 3. 시드 데이터 추가

```bash
DATABASE_URL="your_prod_db" npx tsx prisma/seed.ts
```

---

## 🔐 환경 변수 보안

### ⚠️ 절대 커밋하지 말 것

```bash
.env           # ❌ Git에 커밋하면 안 됨
.env.local     # ❌ Git에 커밋하면 안 됨
.env.production # ❌ Git에 커밋하면 안 됨
```

### ✅ 안전한 관리 방법

1. **로컬 개발**: `.env` 파일 사용
2. **프로덕션**: 호스팅 플랫폼의 환경 변수 UI 사용
3. **팀 공유**: 안전한 비밀번호 관리 도구 사용 (1Password, LastPass 등)

---

## 📝 체크리스트

배포 전에 확인:

- [ ] 환경 변수 설정 완료
- [ ] 데이터베이스 연결 테스트
- [ ] 프로덕션 빌드 성공
- [ ] 마이그레이션 실행 완료
- [ ] 시드 데이터 추가 완료
- [ ] HTTPS 설정 (대부분 자동)
- [ ] 도메인 연결 (선택사항)

---

## 🐛 문제 해결

### 오류: "Environment variable not found: DATABASE_URL"

**원인**: 환경 변수가 설정되지 않음

**해결**:
```bash
# Vercel
vercel env add DATABASE_URL

# Netlify
# Site settings → Environment variables 추가

# Railway
# Variables 탭에서 추가
```

### 오류: "Prisma Client not found"

**원인**: Prisma 클라이언트가 생성되지 않음

**해결**:
```bash
# package.json에 추가
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

### 오류: "Cannot find module '@prisma/client'"

**원인**: 빌드 시 Prisma 생성 누락

**해결**:
```bash
npm run prisma:generate
npm run build
```

---

## 🎯 권장 배포 플랫폼

| 플랫폼 | 장점 | 단점 | 추천 |
|--------|------|------|------|
| **Vercel** | Next.js 최적화, 무료, 빠름 | DB 별도 필요 | ⭐⭐⭐⭐⭐ |
| **Railway** | DB 포함, 간편함 | 유료 ($5/월) | ⭐⭐⭐⭐ |
| **Netlify** | 무료, 안정적 | 설정 복잡 | ⭐⭐⭐ |
| **AWS** | 강력함, 확장성 | 복잡함, 비쌈 | ⭐⭐ |

---

## 🔗 추가 리소스

- [Vercel 배포 가이드](https://vercel.com/docs)
- [Prisma 배포 가이드](https://www.prisma.io/docs/guides/deployment)
- [Next.js 배포 가이드](https://nextjs.org/docs/deployment)
- [Supabase 문서](https://supabase.com/docs)

---

## 💡 팁

### 1. 무료 데이터베이스 옵션

- **Supabase**: 500MB 무료
- **Railway**: $5 크레딧/월
- **Neon**: 무료 PostgreSQL
- **PlanetScale**: 무료 MySQL (Prisma 지원)

### 2. 도메인 연결

Vercel/Netlify에서 커스텀 도메인 무료 연결 가능:
- example.com
- shop.example.com

### 3. 성능 최적화

- 이미지 최적화 (Next.js Image)
- CDN 활용 (자동)
- 데이터베이스 인덱스 추가

---

**배포 완료 후 이 README에 라이브 URL을 추가하세요!**

```markdown
## 🌐 라이브 데모
https://your-app.vercel.app
```
