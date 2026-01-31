/**
 * 계산 로직 테스트
 */

import {
  calculateMonthlyInstallment,
  calculatePublicSubsidy,
  calculateOptionalDiscount,
  comparePaymentOptions,
  formatCurrency,
  formatShortCurrency,
} from './calculator';

// 테스트 케이스
console.log('=== 통신사 쇼핑몰 계산 로직 테스트 ===\n');

// 예시: 갤럭시 S25 Ultra (1,350,000원)
const testOptions = {
  retailPrice: 1350000,
  publicSubsidy: 400000,
  additionalSubsidy: 100000,
  monthlyPlanFee: 65000,
  cardDiscount: 10000,
  familyDiscount: 10000,
};

console.log('📱 테스트 상품: 갤럭시 S25 Ultra');
console.log(`출고가: ${formatCurrency(testOptions.retailPrice)}`);
console.log(`공시지원금: ${formatCurrency(testOptions.publicSubsidy)}`);
console.log(`추가지원금: ${formatCurrency(testOptions.additionalSubsidy)}`);
console.log(`월 요금제: ${formatCurrency(testOptions.monthlyPlanFee)}`);
console.log(`제휴카드 할인: ${formatCurrency(testOptions.cardDiscount)}/월`);
console.log(`가족결합 할인: ${formatCurrency(testOptions.familyDiscount)}/월\n`);

// 1. 월 할부금 계산 테스트
console.log('--- 1. 월 할부금 계산 (원리금 균등상환) ---');
const principal = 850000; // 1,350,000 - 500,000
const monthlyInstallment = calculateMonthlyInstallment(principal, 5.9, 24);
console.log(`할부원금: ${formatCurrency(principal)}`);
console.log(`월 할부금 (연 5.9%, 24개월): ${formatCurrency(monthlyInstallment)}`);
console.log(`총 상환액: ${formatCurrency(monthlyInstallment * 24)}`);
console.log(`총 이자: ${formatCurrency((monthlyInstallment * 24) - principal)}\n`);

// 2. 공시지원금 방식
console.log('--- 2. 공시지원금 방식 ---');
const publicResult = calculatePublicSubsidy(testOptions);
console.log(`할부원금: ${formatCurrency(publicResult.installmentPrincipal)}`);
console.log(`월 할부금: ${formatCurrency(publicResult.monthlyInstallment)}`);
console.log(`월 통신료: ${formatCurrency(publicResult.monthlyPlanFee)}`);
console.log(`총 이자: ${formatCurrency(publicResult.totalInterest)}`);
console.log(`💰 월 납부액: ${formatCurrency(publicResult.monthlyPayment)}`);
console.log(`📊 2년 총액: ${formatCurrency(publicResult.totalPayment)}\n`);

// 3. 선택약정 방식
console.log('--- 3. 선택약정 방식 (25% 요금 할인) ---');
const optionalResult = calculateOptionalDiscount(testOptions);
console.log(`할부원금: ${formatCurrency(optionalResult.installmentPrincipal)}`);
console.log(`월 할부금: ${formatCurrency(optionalResult.monthlyInstallment)}`);
console.log(`원래 월 요금: ${formatCurrency(optionalResult.originalPlanFee)}`);
console.log(`할인된 월 요금: ${formatCurrency(optionalResult.monthlyPlanFee)} (${formatCurrency(optionalResult.monthlyDiscount)} 할인)`);
console.log(`총 이자: ${formatCurrency(optionalResult.totalInterest)}`);
console.log(`💰 월 납부액: ${formatCurrency(optionalResult.monthlyPayment)}`);
console.log(`📊 2년 총액: ${formatCurrency(optionalResult.totalPayment)}\n`);

// 4. 두 방식 비교
console.log('--- 4. 가격 비교 결과 ---');
const comparison = comparePaymentOptions(testOptions);
console.log(`공시지원금 총액: ${formatCurrency(comparison.publicSubsidy.totalPayment)}`);
console.log(`선택약정 총액: ${formatCurrency(comparison.optionalDiscount.totalPayment)}`);
console.log(`✅ 추천 방식: ${comparison.recommended === 'PUBLIC_SUBSIDY' ? '공시지원금' : '선택약정'}`);
console.log(`💵 절약액: ${formatCurrency(comparison.savings)}\n`);

// 5. 추가 할인 없는 경우 테스트
console.log('--- 5. 추가 할인 없는 경우 ---');
const noDiscountOptions = {
  ...testOptions,
  cardDiscount: 0,
  familyDiscount: 0,
};
const noDiscountComparison = comparePaymentOptions(noDiscountOptions);
console.log(`공시지원금 월 납부액: ${formatCurrency(noDiscountComparison.publicSubsidy.monthlyPayment)}`);
console.log(`선택약정 월 납부액: ${formatCurrency(noDiscountComparison.optionalDiscount.monthlyPayment)}`);
console.log(`✅ 추천 방식: ${noDiscountComparison.recommended === 'PUBLIC_SUBSIDY' ? '공시지원금' : '선택약정'}`);
console.log(`💵 절약액: ${formatCurrency(noDiscountComparison.savings)}\n`);

// 6. 포맷팅 테스트
console.log('--- 6. 포맷팅 테스트 ---');
console.log(`2,435,000원 → ${formatShortCurrency(2435000)}`);
console.log(`1,350,000원 → ${formatShortCurrency(1350000)}`);
console.log(`65,000원 → ${formatShortCurrency(65000)}`);

console.log('\n✅ 모든 테스트 완료!');
