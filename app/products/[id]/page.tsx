import { prisma } from '@/lib/prisma'
import ProductDetailClient from '@/components/ProductDetailClient'
import { notFound } from 'next/navigation'

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      manufacturer: true,
      subsidies: {
        where: {
          isActive: true,
          validFrom: { lte: new Date() },
          validUntil: { gte: new Date() },
        },
        include: {
          carrier: true,
        },
      },
    },
  })

  if (!product) {
    notFound()
  }

  // 모든 통신사 및 요금제 가져오기
  const carriers = await prisma.carrier.findMany({
    include: {
      plans: {
        where: { isActive: true },
      },
    },
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <ProductDetailClient 
        product={product} 
        carriers={carriers}
      />
    </div>
  )
}
