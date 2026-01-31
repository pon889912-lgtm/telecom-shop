#!/bin/bash
# 프로덕션 배포를 위한 Prisma 스키마 전환 스크립트

echo "🔄 Prisma 스키마를 PostgreSQL로 전환 중..."

# PostgreSQL용 스키마로 변경
sed -i 's/provider = "sqlite"/provider = "postgresql"/' prisma/schema.prisma

echo "✅ PostgreSQL로 전환 완료!"
echo ""
echo "📝 다음 단계:"
echo "1. git add prisma/schema.prisma"
echo "2. git commit -m 'feat: PostgreSQL로 데이터베이스 전환'"
echo "3. git push origin main"
echo "4. Vercel에서 환경 변수 DATABASE_URL 설정"
echo "5. 로컬에서: DATABASE_URL='your_prod_url' npx prisma migrate deploy"
echo "6. 로컬에서: DATABASE_URL='your_prod_url' npx tsx prisma/seed.ts"
