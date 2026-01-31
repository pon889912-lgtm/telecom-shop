import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '통신사 쇼핑몰 - 스마트폰 최저가 비교',
  description: '갤럭시 S25, 아이폰 17 등 최신 스마트폰을 공시지원금과 선택약정으로 비교하여 가장 저렴한 가격에 구매하세요',
  keywords: ['스마트폰', '통신사', '공시지원금', '선택약정', '갤럭시 S25', '아이폰 17', 'SKT', 'KT', 'LG U+'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="antialiased min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  )
}
