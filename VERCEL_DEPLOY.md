# ⚠️ Vercel 배포 필수 가이드

## 🚨 중요: SQLite는 Vercel에서 작동하지 않습니다!

Vercel은 서버리스 환경이므로 SQLite 파일 시스템을 지원하지 않습니다.
**반드시 PostgreSQL을 사용해야 합니다.**

---

## 🚀 Vercel 배포 완전 가이드 (5단계)

### ✅ Step 1: PostgreSQL 데이터베이스 준비

다음 중 **하나를 선택**하세요:

#### Option A: Vercel Postgres (권장 - 가장 쉬움) 💚

1. Vercel 프로젝트 페이지
2. **Storage** 탭
3. **Create Database** → **Postgres**
4. 데이터베이스 이름: `telecom-shop-db`
5. Create 클릭
6. ✅ `DATABASE_URL` 자동으로 추가됨!

#### Option B: Supabase (무료 500MB) 💙

1. https://supabase.com 가입
2. New Project 생성
3. Settings → Database → Connection string (URI) 복사
4. 형식: `postgresql://postgres:[PASSWORD]@[HOST]:6543/postgres`

#### Option C: Neon (무료) 💜

1. https://neon.tech 가입
2. Create project
3. Connection string 복사
4. 형식: `postgresql://[USER]:[PASSWORD]@[HOST]/[DB]`

---

### ✅ Step 2: Prisma 스키마를 PostgreSQL로 전환

```bash
cd /home/user/webapp/telecom-shop

# PostgreSQL 스키마로 교체
cp prisma/schema.postgresql.prisma prisma/schema.prisma

# 확인
cat prisma/schema.prisma | grep provider
# 출력: provider = "postgresql"
```

---

### ✅ Step 3: Vercel 환경 변수 설정

#### 웹 UI 사용:
1. Vercel → 프로젝트 → **Settings**
2. **Environment Variables**
3. 추가:
   ```
   Name: DATABASE_URL
   Value: [Step 1에서 복사한 PostgreSQL URL]
   Environments: Production, Preview, Development (모두 체크)
   ```
4. **Save**

#### CLI 사용:
```bash
vercel env add DATABASE_URL production
# URL 입력
vercel env add DATABASE_URL preview
# URL 입력
```

---

### ✅ Step 4: 프로덕션 데이터베이스 초기화

```bash
# 프로덕션 DATABASE_URL로 마이그레이션
DATABASE_URL="postgresql://your_prod_url_here" npx prisma migrate deploy

# 시드 데이터 추가
DATABASE_URL="postgresql://your_prod_url_here" npx tsx prisma/seed.ts
```

**Vercel Postgres 사용 시:**
```bash
# Vercel 환경 변수 다운로드
vercel env pull .env.production

# .env.production에서 자동으로 읽어서 마이그레이션
source .env.production
npx prisma migrate deploy
npx tsx prisma/seed.ts
```

---

### ✅ Step 5: GitHub에 푸시 및 자동 배포

```bash
# PostgreSQL 스키마 커밋
git add prisma/schema.prisma
git commit -m "feat: PostgreSQL로 데이터베이스 전환 (Vercel 배포용)"
git push origin main
```

Vercel이 자동으로 재배포합니다! (2-3분 소요)

---

## 🎯 빠른 배포 (한 번에 실행)

```bash
cd /home/user/webapp/telecom-shop

# 1. PostgreSQL 스키마로 전환
cp prisma/schema.postgresql.prisma prisma/schema.prisma

# 2. 커밋 및 푸시
git add prisma/schema.prisma
git commit -m "feat: PostgreSQL로 전환"
git push origin main

# 3. Vercel 환경 변수 설정 (웹 UI에서)
# DATABASE_URL = your_postgres_url

# 4. 프로덕션 DB 초기화
DATABASE_URL="your_postgres_url" npx prisma migrate deploy
DATABASE_URL="your_postgres_url" npx tsx prisma/seed.ts

# 5. 완료! Vercel이 자동 배포
```

---

## ✅ 배포 완료 확인

1. Vercel 대시보드 → **Deployments** 탭
2. 최신 배포 상태 확인 (초록색 ✓)
3. **Visit** 버튼 클릭
4. 메인 페이지 접속 테스트
5. `/products` 페이지 확인
6. `/admin.html` 관리자 페이지 확인

---

## 🐛 문제 해결

### 오류: "Environment variable not found: DATABASE_URL"
- Vercel Settings → Environment Variables 재확인
- Production, Preview, Development 모두 체크되어 있는지 확인
- 재배포: Deployments → Redeploy

### 오류: "P1001: Can't reach database server"
- DATABASE_URL이 정확한지 확인
- 비밀번호에 특수문자가 있다면 URL 인코딩 필요
- 데이터베이스 서버가 실행 중인지 확인

### 오류: "Migration not found"
- `npx prisma migrate deploy` 먼저 실행
- 프로덕션 DATABASE_URL 사용하는지 확인

---

## 📋 체크리스트

배포 전에 확인:

- [ ] PostgreSQL 데이터베이스 생성 완료
- [ ] DATABASE_URL 환경 변수 설정 완료
- [ ] Prisma 스키마가 `postgresql`로 설정됨
- [ ] `npx prisma migrate deploy` 실행 완료
- [ ] 시드 데이터 추가 완료
- [ ] GitHub에 푸시 완료
- [ ] Vercel 자동 배포 확인

---

## 🔗 도움말 링크

- [Vercel Postgres 문서](https://vercel.com/docs/storage/vercel-postgres)
- [Supabase 문서](https://supabase.com/docs)
- [Neon 문서](https://neon.tech/docs)
- [Prisma 배포 가이드](https://www.prisma.io/docs/guides/deployment)

---

**이 가이드를 따라하면 100% 성공합니다!** 🎉

문제가 있다면 구체적인 오류 메시지를 알려주세요!
