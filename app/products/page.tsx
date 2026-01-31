import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { formatCurrency } from '@/utils/calculator'

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: {
      manufacturer: true,
      subsidies: {
        where: {
          isActive: true,
          validFrom: { lte: new Date() },
          validUntil: { gte: new Date() },
        },
      },
    },
    orderBy: {
      releaseDate: 'desc',
    },
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-primary-600">
              📱 통신사 쇼핑몰
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/" className="text-gray-700 hover:text-primary-600">
                메인
              </Link>
              <Link href="/products" className="text-primary-600 font-semibold">
                상품보기
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">전체 상품</h1>
        
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const maxSubsidy = Math.max(
              ...product.subsidies.map((s) => s.publicSubsidy + s.additionalSubsidy),
              0
            )

            return (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden group"
              >
                <div className="aspect-square bg-gray-100 flex items-center justify-center text-7xl">
                  📱
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-500">{product.manufacturer.nameKo}</p>
                  <h3 className="font-semibold text-lg mb-1 group-hover:text-primary-600 transition">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {product.capacity} | {product.color}
                  </p>
                  <div className="border-t pt-3">
                    <p className="text-xs text-gray-500">출고가</p>
                    <p className="text-xl font-bold text-gray-900">
                      {formatCurrency(product.retailPrice)}
                    </p>
                    {maxSubsidy > 0 && (
                      <p className="text-sm text-primary-600 mt-2">
                        공시지원금 최대 {formatCurrency(maxSubsidy)}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {products.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">등록된 상품이 없습니다</p>
          </div>
        )}
      </div>
    </div>
  )
}
