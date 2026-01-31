'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { comparePaymentOptions, formatCurrency, formatShortCurrency } from '@/utils/calculator'

interface ProductDetailClientProps {
  product: any
  carriers: any[]
}

export default function ProductDetailClient({ product, carriers }: ProductDetailClientProps) {
  const [selectedCarrierId, setSelectedCarrierId] = useState(carriers[0]?.id || '')
  const [selectedPlanId, setSelectedPlanId] = useState('')
  const [cardDiscount, setCardDiscount] = useState(0)
  const [familyDiscount, setFamilyDiscount] = useState(0)

  // 선택한 통신사의 요금제 목록
  const selectedCarrier = carriers.find((c) => c.id === selectedCarrierId)
  const plans = selectedCarrier?.plans || []

  // 선택한 통신사의 공시지원금 정보
  const subsidy = product.subsidies.find((s: any) => s.carrierId === selectedCarrierId)

  // 선택한 요금제
  const selectedPlan = plans.find((p: any) => p.id === selectedPlanId)

  // 가격 계산
  const calculation = useMemo(() => {
    if (!selectedPlan || !subsidy) return null

    return comparePaymentOptions({
      retailPrice: product.retailPrice,
      publicSubsidy: subsidy.publicSubsidy,
      additionalSubsidy: subsidy.additionalSubsidy,
      monthlyPlanFee: selectedPlan.monthlyFee,
      cardDiscount,
      familyDiscount,
    })
  }, [product, subsidy, selectedPlan, cardDiscount, familyDiscount])

  // 초기 요금제 선택
  if (!selectedPlanId && plans.length > 0) {
    setSelectedPlanId(plans[0].id)
  }

  return (
    <>
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-primary-600">
              📱 통신사 쇼핑몰
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/products" className="text-gray-700 hover:text-primary-600">
                상품보기
              </Link>
              <Link href="/" className="text-gray-700 hover:text-primary-600">
                메인으로
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Product Detail */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Product Image */}
          <div className="bg-white rounded-lg p-8 shadow-md">
            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-9xl">
              📱
            </div>
            <div className="mt-6 space-y-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                <p className="text-gray-500 mt-1">
                  {product.manufacturer.nameKo} | {product.capacity} | {product.color}
                </p>
              </div>
              <div>
                <span className="text-gray-600">출고가</span>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(product.retailPrice)}
                </p>
              </div>
              {product.description && (
                <p className="text-gray-600 pt-4 border-t">{product.description}</p>
              )}
            </div>
          </div>

          {/* Right: Configuration */}
          <div className="space-y-6">
            {/* Carrier Selection */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-semibold mb-4">📡 통신사 선택</h3>
              <div className="flex gap-3">
                {carriers.map((carrier) => (
                  <button
                    key={carrier.id}
                    onClick={() => {
                      setSelectedCarrierId(carrier.id)
                      setSelectedPlanId('')
                    }}
                    className={`flex-1 px-4 py-3 rounded-lg font-semibold transition ${
                      selectedCarrierId === carrier.id
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    style={
                      selectedCarrierId === carrier.id
                        ? { backgroundColor: carrier.color }
                        : undefined
                    }
                  >
                    {carrier.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Plan Selection */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-semibold mb-4">📶 요금제 선택</h3>
              <select
                value={selectedPlanId}
                onChange={(e) => setSelectedPlanId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">요금제를 선택하세요</option>
                {plans.map((plan: any) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name} - {formatCurrency(plan.monthlyFee)} (데이터 {plan.dataAmount})
                  </option>
                ))}
              </select>
              {selectedPlan && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• 데이터: {selectedPlan.dataAmount}</li>
                    <li>• 음성: {selectedPlan.voiceAmount}</li>
                    <li>• 문자: {selectedPlan.smsAmount}</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Price Comparison */}
            {calculation && subsidy && (
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-lg font-semibold mb-4">💡 가격 비교 (2년 기준)</h3>
                
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {/* Public Subsidy */}
                  <div
                    className={`p-4 rounded-lg border-2 ${
                      calculation.recommended === 'PUBLIC_SUBSIDY'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">🏷️ 공시지원금</h4>
                      {calculation.recommended === 'PUBLIC_SUBSIDY' && (
                        <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">
                          추천
                        </span>
                      )}
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">출고가</span>
                        <span>{formatCurrency(product.retailPrice)}</span>
                      </div>
                      <div className="flex justify-between text-red-600">
                        <span>지원금</span>
                        <span>
                          -{formatCurrency(subsidy.publicSubsidy + subsidy.additionalSubsidy)}
                        </span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-semibold">
                        <span>할부원금</span>
                        <span>{formatCurrency(calculation.publicSubsidy.installmentPrincipal)}</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>월 할부금</span>
                        <span>{formatCurrency(calculation.publicSubsidy.monthlyInstallment)}</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>월 통신료</span>
                        <span>{formatCurrency(calculation.publicSubsidy.monthlyPlanFee)}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-bold text-lg">
                        <span>월 납부액</span>
                        <span className="text-primary-600">
                          {formatCurrency(calculation.publicSubsidy.monthlyPayment)}
                        </span>
                      </div>
                      <div className="flex justify-between font-semibold text-green-600">
                        <span>2년 총액</span>
                        <span>{formatShortCurrency(calculation.publicSubsidy.totalPayment)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Optional Discount */}
                  <div
                    className={`p-4 rounded-lg border-2 ${
                      calculation.recommended === 'OPTIONAL_DISCOUNT'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">📉 선택약정</h4>
                      {calculation.recommended === 'OPTIONAL_DISCOUNT' && (
                        <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">
                          추천
                        </span>
                      )}
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">출고가</span>
                        <span>{formatCurrency(product.retailPrice)}</span>
                      </div>
                      <div className="flex justify-between text-gray-500">
                        <span>지원금</span>
                        <span>없음</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-semibold">
                        <span>할부원금</span>
                        <span>
                          {formatCurrency(calculation.optionalDiscount.installmentPrincipal)}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>월 할부금</span>
                        <span>
                          {formatCurrency(calculation.optionalDiscount.monthlyInstallment)}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">월 통신료</span>
                        <div className="text-right">
                          <div className="line-through text-gray-400 text-xs">
                            {formatCurrency(calculation.optionalDiscount.originalPlanFee)}
                          </div>
                          <div className="text-red-600">
                            {formatCurrency(calculation.optionalDiscount.monthlyPlanFee)}
                            <span className="text-xs"> (25% 할인)</span>
                          </div>
                        </div>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-bold text-lg">
                        <span>월 납부액</span>
                        <span className="text-primary-600">
                          {formatCurrency(calculation.optionalDiscount.monthlyPayment)}
                        </span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span>2년 총액</span>
                        <span>{formatShortCurrency(calculation.optionalDiscount.totalPayment)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Savings Badge */}
                {calculation.savings > 0 && (
                  <div className="bg-green-100 border border-green-300 rounded-lg p-4 text-center">
                    <p className="text-green-800 font-semibold">
                      {calculation.recommended === 'PUBLIC_SUBSIDY' ? '공시지원금' : '선택약정'} 선택 시{' '}
                      <span className="text-xl font-bold">{formatCurrency(calculation.savings)}</span> 절약!
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Additional Discounts */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-semibold mb-4">🎁 추가 할인</h3>
              <div className="space-y-4">
                <label className="flex items-center justify-between">
                  <span className="text-gray-700">제휴카드 할인</span>
                  <select
                    value={cardDiscount}
                    onChange={(e) => setCardDiscount(Number(e.target.value))}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value={0}>선택 안 함</option>
                    <option value={5000}>5,000원/월</option>
                    <option value={10000}>10,000원/월</option>
                    <option value={15000}>15,000원/월</option>
                  </select>
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-gray-700">가족결합 할인</span>
                  <select
                    value={familyDiscount}
                    onChange={(e) => setFamilyDiscount(Number(e.target.value))}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value={0}>선택 안 함</option>
                    <option value={10000}>10,000원/월 (인터넷 1회선)</option>
                    <option value={15000}>15,000원/월 (인터넷+TV)</option>
                    <option value={20000}>20,000원/월 (가족 2회선+인터넷)</option>
                  </select>
                </label>
                {(cardDiscount > 0 || familyDiscount > 0) && (
                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-600">
                      추가 할인 적용 시 월{' '}
                      <span className="font-semibold text-primary-600">
                        {formatCurrency(cardDiscount + familyDiscount)}
                      </span>{' '}
                      절감
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* CTA Button */}
            <button
              disabled={!selectedPlan}
              className="w-full bg-primary-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-primary-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {selectedPlan ? '📱 지금 신청하기' : '요금제를 선택해주세요'}
            </button>

            {/* Info Text */}
            <p className="text-xs text-gray-500 text-center">
              * 할부 이자 연 5.9% 적용 (원리금 균등상환)
              <br />* 실제 청구 금액은 가입 시점에 따라 달라질 수 있습니다
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
