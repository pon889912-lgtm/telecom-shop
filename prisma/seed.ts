import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 데이터베이스 시드 시작...')

  // 제조사 데이터
  const samsung = await prisma.manufacturer.create({
    data: {
      name: 'Samsung',
      nameKo: '삼성전자',
    },
  })

  const apple = await prisma.manufacturer.create({
    data: {
      name: 'Apple',
      nameKo: '애플',
    },
  })

  console.log('✅ 제조사 데이터 생성 완료')

  // 통신사 데이터
  const skt = await prisma.carrier.create({
    data: {
      name: 'SKT',
      code: 'skt',
      color: '#ea002c',
    },
  })

  const kt = await prisma.carrier.create({
    data: {
      name: 'KT',
      code: 'kt',
      color: '#e30613',
    },
  })

  const lgu = await prisma.carrier.create({
    data: {
      name: 'LG U+',
      code: 'lgu',
      color: '#c4166d',
    },
  })

  console.log('✅ 통신사 데이터 생성 완료')

  // 상품 데이터
  const galaxyS25 = await prisma.product.create({
    data: {
      name: '갤럭시 S25 Ultra',
      model: 'SM-S938N',
      capacity: '256GB',
      color: '티타늄 그레이',
      retailPrice: 1350000,
      imageUrl: '/images/galaxy-s25-ultra.png',
      thumbnailUrl: '/images/galaxy-s25-ultra-thumb.png',
      releaseDate: new Date('2026-01-15'),
      description: '삼성전자의 최신 프리미엄 스마트폰. 강력한 AI 기능과 200MP 카메라 탑재',
      specs: JSON.stringify({
        display: '6.8인치 Dynamic AMOLED 2X',
        processor: 'Snapdragon 8 Gen 4',
        ram: '12GB',
        camera: '200MP + 50MP + 10MP + 12MP',
        battery: '5000mAh',
      }),
      manufacturerId: samsung.id,
    },
  })

  const galaxyS25Pro = await prisma.product.create({
    data: {
      name: '갤럭시 S25 Ultra',
      model: 'SM-S938N',
      capacity: '512GB',
      color: '티타늄 블랙',
      retailPrice: 1550000,
      imageUrl: '/images/galaxy-s25-ultra-512.png',
      thumbnailUrl: '/images/galaxy-s25-ultra-512-thumb.png',
      releaseDate: new Date('2026-01-15'),
      description: '삼성전자의 최신 프리미엄 스마트폰 512GB 모델',
      specs: JSON.stringify({
        display: '6.8인치 Dynamic AMOLED 2X',
        processor: 'Snapdragon 8 Gen 4',
        ram: '12GB',
        camera: '200MP + 50MP + 10MP + 12MP',
        battery: '5000mAh',
      }),
      manufacturerId: samsung.id,
    },
  })

  const iphone17Pro = await prisma.product.create({
    data: {
      name: '아이폰 17 Pro',
      model: 'A3101',
      capacity: '256GB',
      color: '티타늄 블루',
      retailPrice: 1550000,
      imageUrl: '/images/iphone-17-pro.png',
      thumbnailUrl: '/images/iphone-17-pro-thumb.png',
      releaseDate: new Date('2025-09-20'),
      description: '애플의 최신 프로 모델. A19 Pro 칩과 ProMotion 디스플레이',
      specs: JSON.stringify({
        display: '6.3인치 Super Retina XDR',
        processor: 'A19 Pro',
        ram: '8GB',
        camera: '48MP + 12MP + 12MP',
        battery: '3200mAh',
      }),
      manufacturerId: apple.id,
    },
  })

  const iphone17 = await prisma.product.create({
    data: {
      name: '아이폰 17',
      model: 'A3100',
      capacity: '128GB',
      color: '블랙',
      retailPrice: 1250000,
      imageUrl: '/images/iphone-17.png',
      thumbnailUrl: '/images/iphone-17-thumb.png',
      releaseDate: new Date('2025-09-20'),
      description: '애플의 최신 스탠다드 모델',
      specs: JSON.stringify({
        display: '6.1인치 Super Retina XDR',
        processor: 'A19',
        ram: '6GB',
        camera: '48MP + 12MP',
        battery: '3000mAh',
      }),
      manufacturerId: apple.id,
    },
  })

  console.log('✅ 상품 데이터 생성 완료')

  // 요금제 데이터
  const sktPlans = await Promise.all([
    prisma.plan.create({
      data: {
        name: '5G 프리미어 플러스',
        dataAmount: '무제한',
        monthlyFee: 65000,
        description: '데이터 무제한, 음성/문자 무제한',
        features: JSON.stringify(['데이터 무제한', '음성 무제한', '문자 무제한', '멜론 무료', '넷플릭스 베이직']),
        carrierId: skt.id,
      },
    }),
    prisma.plan.create({
      data: {
        name: '5G 프리미어 에센셜',
        dataAmount: '100GB',
        monthlyFee: 55000,
        description: '데이터 100GB, 음성/문자 무제한',
        features: JSON.stringify(['데이터 100GB', '음성 무제한', '문자 무제한', '멜론 무료']),
        carrierId: skt.id,
      },
    }),
  ])

  const ktPlans = await Promise.all([
    prisma.plan.create({
      data: {
        name: '5G 슈퍼플랜 프리미엄',
        dataAmount: '무제한',
        monthlyFee: 65000,
        description: '데이터 무제한, 음성/문자 무제한',
        features: JSON.stringify(['데이터 무제한', '음성 무제한', '문자 무제한', '지니뮤직 무료']),
        carrierId: kt.id,
      },
    }),
    prisma.plan.create({
      data: {
        name: '5G 슈퍼플랜 스탠다드',
        dataAmount: '150GB',
        monthlyFee: 58000,
        description: '데이터 150GB, 음성/문자 무제한',
        features: JSON.stringify(['데이터 150GB', '음성 무제한', '문자 무제한']),
        carrierId: kt.id,
      },
    }),
  ])

  const lguPlans = await Promise.all([
    prisma.plan.create({
      data: {
        name: '5G 시그니처',
        dataAmount: '무제한',
        monthlyFee: 65000,
        description: '데이터 무제한, 음성/문자 무제한',
        features: JSON.stringify(['데이터 무제한', '음성 무제한', '문자 무제한', 'FLO 무료']),
        carrierId: lgu.id,
      },
    }),
    prisma.plan.create({
      data: {
        name: '5G 프리미어',
        dataAmount: '120GB',
        monthlyFee: 56000,
        description: '데이터 120GB, 음성/문자 무제한',
        features: JSON.stringify(['데이터 120GB', '음성 무제한', '문자 무제한']),
        carrierId: lgu.id,
      },
    }),
  ])

  console.log('✅ 요금제 데이터 생성 완료')

  // 공시지원금 데이터
  const validFrom = new Date('2026-01-01')
  const validUntil = new Date('2026-03-31')

  // 갤럭시 S25 Ultra 공시지원금
  await Promise.all([
    prisma.subsidy.create({
      data: {
        productId: galaxyS25.id,
        carrierId: skt.id,
        publicSubsidy: 400000,
        additionalSubsidy: 100000,
        validFrom,
        validUntil,
      },
    }),
    prisma.subsidy.create({
      data: {
        productId: galaxyS25.id,
        carrierId: kt.id,
        publicSubsidy: 420000,
        additionalSubsidy: 80000,
        validFrom,
        validUntil,
      },
    }),
    prisma.subsidy.create({
      data: {
        productId: galaxyS25.id,
        carrierId: lgu.id,
        publicSubsidy: 410000,
        additionalSubsidy: 90000,
        validFrom,
        validUntil,
      },
    }),
  ])

  // 갤럭시 S25 Ultra 512GB 공시지원금
  await Promise.all([
    prisma.subsidy.create({
      data: {
        productId: galaxyS25Pro.id,
        carrierId: skt.id,
        publicSubsidy: 450000,
        additionalSubsidy: 100000,
        validFrom,
        validUntil,
      },
    }),
    prisma.subsidy.create({
      data: {
        productId: galaxyS25Pro.id,
        carrierId: kt.id,
        publicSubsidy: 470000,
        additionalSubsidy: 80000,
        validFrom,
        validUntil,
      },
    }),
    prisma.subsidy.create({
      data: {
        productId: galaxyS25Pro.id,
        carrierId: lgu.id,
        publicSubsidy: 460000,
        additionalSubsidy: 90000,
        validFrom,
        validUntil,
      },
    }),
  ])

  // 아이폰 17 Pro 공시지원금
  await Promise.all([
    prisma.subsidy.create({
      data: {
        productId: iphone17Pro.id,
        carrierId: skt.id,
        publicSubsidy: 450000,
        additionalSubsidy: 150000,
        validFrom,
        validUntil,
      },
    }),
    prisma.subsidy.create({
      data: {
        productId: iphone17Pro.id,
        carrierId: kt.id,
        publicSubsidy: 480000,
        additionalSubsidy: 120000,
        validFrom,
        validUntil,
      },
    }),
    prisma.subsidy.create({
      data: {
        productId: iphone17Pro.id,
        carrierId: lgu.id,
        publicSubsidy: 470000,
        additionalSubsidy: 130000,
        validFrom,
        validUntil,
      },
    }),
  ])

  // 아이폰 17 공시지원금
  await Promise.all([
    prisma.subsidy.create({
      data: {
        productId: iphone17.id,
        carrierId: skt.id,
        publicSubsidy: 350000,
        additionalSubsidy: 100000,
        validFrom,
        validUntil,
      },
    }),
    prisma.subsidy.create({
      data: {
        productId: iphone17.id,
        carrierId: kt.id,
        publicSubsidy: 380000,
        additionalSubsidy: 70000,
        validFrom,
        validUntil,
      },
    }),
    prisma.subsidy.create({
      data: {
        productId: iphone17.id,
        carrierId: lgu.id,
        publicSubsidy: 370000,
        additionalSubsidy: 80000,
        validFrom,
        validUntil,
      },
    }),
  ])

  console.log('✅ 공시지원금 데이터 생성 완료')

  console.log('🎉 시드 데이터 생성 완료!')
}

main()
  .catch((e) => {
    console.error('❌ 시드 데이터 생성 실패:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
