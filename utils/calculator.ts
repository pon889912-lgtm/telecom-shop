/**
 * 통신사 쇼핑몰 가격 계산 유틸리티
 * 
 * 한국 통신사 특화 로직:
 * 1. 공시지원금 방식: 출고가 - 지원금 = 할부원금
 * 2. 선택약정 방식: 출고가 그대로 할부, 월 요금 25% 할인
 * 3. 할부 이자: 연 5.9% 원리금 균등상환
 */

export interface CalculationOptions {
  retailPrice: number;        // 출고가
  publicSubsidy?: number;      // 공시지원금
  additionalSubsidy?: number;  // 추가지원금
  monthlyPlanFee: number;      // 월 요금제 비용
  installmentMonths?: number;  // 할부 개월 (기본 24개월)
  interestRate?: number;       // 연 이자율 (기본 5.9%)
  cardDiscount?: number;       // 제휴카드 할인 (월)
  familyDiscount?: number;     // 가족결합 할인 (월)
}

export interface PaymentResult {
  installmentPrincipal: number;  // 할부원금
  monthlyInstallment: number;    // 월 할부금 (이자 포함)
  monthlyPlanFee: number;        // 월 요금
  monthlyPayment: number;        // 최종 월 납부액
  totalPayment: number;          // 총 납부액 (2년)
  totalInterest: number;         // 총 이자
}

export interface OptionalDiscountResult extends PaymentResult {
  originalPlanFee: number;    // 원래 월 요금
  monthlyDiscount: number;    // 월 할인액
}

export interface ComparisonResult {
  publicSubsidy: PaymentResult;
  optionalDiscount: OptionalDiscountResult;
  recommended: 'PUBLIC_SUBSIDY' | 'OPTIONAL_DISCOUNT';
  savings: number;            // 절약액
}

/**
 * 원리금 균등상환 방식으로 월 할부금 계산
 * @param principal 할부원금
 * @param annualRate 연 이자율 (예: 5.9)
 * @param months 할부 개월 수 (예: 24)
 * @returns 월 할부금
 */
export function calculateMonthlyInstallment(
  principal: number,
  annualRate: number,
  months: number
): number {
  if (principal <= 0 || months <= 0) return 0;
  
  const monthlyRate = annualRate / 100 / 12; // 월 이자율
  
  // 이자가 0이면 단순 분할
  if (monthlyRate === 0) {
    return Math.round(principal / months);
  }
  
  // 원리금 균등상환 공식: P * r * (1+r)^n / ((1+r)^n - 1)
  const numerator = principal * monthlyRate * Math.pow(1 + monthlyRate, months);
  const denominator = Math.pow(1 + monthlyRate, months) - 1;
  
  return Math.round(numerator / denominator);
}

/**
 * 공시지원금 방식으로 월 납부액 계산
 */
export function calculatePublicSubsidy(options: CalculationOptions): PaymentResult {
  const {
    retailPrice,
    publicSubsidy = 0,
    additionalSubsidy = 0,
    monthlyPlanFee,
    installmentMonths = 24,
    interestRate = 5.9,
    cardDiscount = 0,
    familyDiscount = 0,
  } = options;
  
  // 1. 할부원금 = 출고가 - 공시지원금 - 추가지원금
  const installmentPrincipal = Math.max(0, retailPrice - publicSubsidy - additionalSubsidy);
  
  // 2. 월 할부금 (이자 포함)
  const monthlyInstallment = calculateMonthlyInstallment(
    installmentPrincipal,
    interestRate,
    installmentMonths
  );
  
  // 3. 총 이자
  const totalInterest = (monthlyInstallment * installmentMonths) - installmentPrincipal;
  
  // 4. 추가 할인 적용
  const totalAdditionalDiscount = cardDiscount + familyDiscount;
  
  // 5. 월 납부액 = 월 할부금 + 월 요금 - 추가 할인
  const monthlyPayment = monthlyInstallment + monthlyPlanFee - totalAdditionalDiscount;
  
  // 6. 총 납부액 (2년)
  const totalPayment = monthlyPayment * installmentMonths;
  
  return {
    installmentPrincipal,
    monthlyInstallment,
    monthlyPlanFee,
    monthlyPayment,
    totalPayment,
    totalInterest,
  };
}

/**
 * 선택약정 방식으로 월 납부액 계산
 */
export function calculateOptionalDiscount(options: CalculationOptions): OptionalDiscountResult {
  const {
    retailPrice,
    monthlyPlanFee,
    installmentMonths = 24,
    interestRate = 5.9,
    cardDiscount = 0,
    familyDiscount = 0,
  } = options;
  
  const discountRate = 0.25; // 25% 할인
  
  // 1. 할부원금 = 출고가 (할인 없음)
  const installmentPrincipal = retailPrice;
  
  // 2. 월 할부금 (이자 포함)
  const monthlyInstallment = calculateMonthlyInstallment(
    installmentPrincipal,
    interestRate,
    installmentMonths
  );
  
  // 3. 총 이자
  const totalInterest = (monthlyInstallment * installmentMonths) - installmentPrincipal;
  
  // 4. 할인된 월 요금
  const discountedPlanFee = Math.round(monthlyPlanFee * (1 - discountRate));
  const monthlyDiscount = monthlyPlanFee - discountedPlanFee;
  
  // 5. 추가 할인 적용
  const totalAdditionalDiscount = cardDiscount + familyDiscount;
  
  // 6. 월 납부액 = 월 할부금 + 할인된 월 요금 - 추가 할인
  const monthlyPayment = monthlyInstallment + discountedPlanFee - totalAdditionalDiscount;
  
  // 7. 총 납부액
  const totalPayment = monthlyPayment * installmentMonths;
  
  return {
    installmentPrincipal,
    monthlyInstallment,
    monthlyPlanFee: discountedPlanFee,
    originalPlanFee: monthlyPlanFee,
    monthlyDiscount,
    monthlyPayment,
    totalPayment,
    totalInterest,
  };
}

/**
 * 공시지원금과 선택약정 두 방식을 비교
 */
export function comparePaymentOptions(options: CalculationOptions): ComparisonResult {
  // 공시지원금 방식 계산
  const publicSubsidy = calculatePublicSubsidy(options);
  
  // 선택약정 방식 계산
  const optionalDiscount = calculateOptionalDiscount(options);
  
  // 최저가 판정
  const recommended = 
    publicSubsidy.totalPayment < optionalDiscount.totalPayment
      ? 'PUBLIC_SUBSIDY'
      : 'OPTIONAL_DISCOUNT';
  
  // 절약액
  const savings = Math.abs(publicSubsidy.totalPayment - optionalDiscount.totalPayment);
  
  return {
    publicSubsidy,
    optionalDiscount,
    recommended,
    savings,
  };
}

/**
 * 금액을 한국 통화 형식으로 포맷팅
 */
export function formatCurrency(amount: number): string {
  return amount.toLocaleString('ko-KR') + '원';
}

/**
 * 금액을 천 단위로 축약 (예: 2,435,000 → 2,435K)
 */
export function formatShortCurrency(amount: number): string {
  if (amount >= 1000000) {
    return (amount / 1000000).toFixed(1) + 'M';
  }
  if (amount >= 1000) {
    return Math.round(amount / 1000) + 'K';
  }
  return amount.toString();
}

/**
 * 백분율 계산
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}
