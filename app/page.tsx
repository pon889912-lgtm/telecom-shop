import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-primary-600">
              📱 통신사 쇼핑몰
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/products" className="text-gray-700 hover:text-primary-600">
                상품보기
              </Link>
              <Link href="/compare" className="text-gray-700 hover:text-primary-600">
                가격비교
              </Link>
              <Link href="/admin.html" className="text-gray-700 hover:text-primary-600">
                관리자
              </Link>
              <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
                🛒 장바구니
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">
            스마트폰 최저가 비교, 쉽고 투명하게
          </h1>
          <p className="text-xl mb-8 text-primary-100">
            공시지원금 vs 선택약정, 2년 총 비용을 한눈에 비교하세요
          </p>
          <div className="flex gap-4 justify-center">
            <Link 
              href="/products"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              상품 둘러보기
            </Link>
            <Link 
              href="/calculator"
              className="bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-800 transition border border-white"
            >
              요금 계산기
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">왜 저희 쇼핑몰인가요?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-semibold mb-2">투명한 가격 비교</h3>
              <p className="text-gray-600">
                공시지원금과 선택약정을 실시간으로 비교하여 2년 총 비용이 더 저렴한 방식을 추천합니다
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">🧮</div>
              <h3 className="text-xl font-semibold mb-2">정확한 할부 계산</h3>
              <p className="text-gray-600">
                연 5.9% 할부 이자를 포함한 실제 월 납부액을 원리금 균등상환 방식으로 계산합니다
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">🎁</div>
              <h3 className="text-xl font-semibold mb-2">추가 할인 혜택</h3>
              <p className="text-gray-600">
                제휴카드 할인, 가족결합 할인 등 모든 할인 혜택을 적용하여 최종 금액을 확인하세요
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Products */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">인기 기종</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { name: '갤럭시 S25 Ultra', price: '1,350,000원', image: '📱' },
              { name: '아이폰 17 Pro', price: '1,550,000원', image: '📱' },
              { name: '갤럭시 Z Fold 6', price: '2,300,000원', image: '📱' },
              { name: '아이폰 17', price: '1,250,000원', image: '📱' },
            ].map((product, idx) => (
              <Link
                key={idx}
                href={`/products/${idx + 1}`}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
              >
                <div className="text-6xl mb-4 text-center">{product.image}</div>
                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                <p className="text-primary-600 font-bold text-xl">{product.price}</p>
                <p className="text-sm text-gray-500 mt-2">공시지원금 최대 50만원</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">지금 바로 시작하세요</h2>
          <p className="text-xl mb-8 text-primary-100">
            복잡한 통신비, 이제 쉽고 투명하게 비교하고 구매하세요
          </p>
          <Link 
            href="/products"
            className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            상품 보러가기 →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-semibold mb-4">통신사 쇼핑몰</h4>
              <p className="text-gray-400 text-sm">
                투명하고 정직한 통신비 비교 서비스
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">고객센터</h4>
              <p className="text-gray-400 text-sm">1588-0000</p>
              <p className="text-gray-400 text-sm">평일 09:00-18:00</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">정보</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/about">회사소개</Link></li>
                <li><Link href="/terms">이용약관</Link></li>
                <li><Link href="/privacy">개인정보처리방침</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">통신사</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>SKT</li>
                <li>KT</li>
                <li>LG U+</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
            © 2026 통신사 쇼핑몰. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
