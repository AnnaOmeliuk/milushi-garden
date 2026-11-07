import type { Product } from '../types/product'

export const products: Product[] = [
  {
    slug: 'yabluka',
    name: 'Яблука',
    category: 'fruits',
    shortDescription: 'Сім сортів із нашого саду — від солодких до кислуватих.',
    description:
      'Яблука з сімейного саду в Милушах. Збираємо вручну в сезон достигання. Обирайте сорт і фасування — підготуємо свіжу партію під ваше замовлення.',
    images: [
      '/images/apples-1.svg',
      '/images/apples-2.svg',
      '/images/apples-3.svg',
    ],
    pricePerKg: 35,
    unit: 'kg',
    availability: 'in_stock',
    featured: true,
    variants: [
      { id: 'golden', name: 'Голден Делішес', note: 'Солодкі, жовті, для десерту' },
      { id: 'jonathan', name: 'Джонатан', note: 'Класичний кисло-солодкий смак' },
      { id: 'idared', name: 'Айдаред', note: 'Соковиті, добре лежать' },
      { id: 'champion', name: 'Чемпіон', note: 'Ніжні, ароматні' },
      { id: 'gloster', name: 'Глостер', note: 'Хрусткі, з насиченим смаком' },
      { id: 'ligol', name: 'Ліголь', note: 'Великі, соковиті плоди' },
      { id: 'simirenko', name: 'Ренет Сіміренка', note: 'Зелені, освіжаючі, для пирогів' },
    ],
    packs: [
      { id: '1kg', label: '1 кг', kg: 1 },
      { id: '5kg', label: 'Сітка 5 кг', kg: 5 },
      { id: '10kg', label: 'Сітка 10 кг', kg: 10 },
      { id: 'box', label: 'Ящик ~20 кг', kg: 20 },
    ],
  },
  {
    slug: 'grushi',
    name: 'Груші',
    category: 'fruits',
    shortDescription: 'Соковиті груші осіннього врожаю.',
    description:
      'Груші з нашого саду — м’які, ароматні, ідеальні для свіжого споживання й компотів. Кількість обмежена сезоном.',
    images: ['/images/pears.svg'],
    pricePerKg: 45,
    unit: 'kg',
    availability: 'limited',
    featured: true,
    packs: [
      { id: '1kg', label: '1 кг', kg: 1 },
      { id: '5kg', label: 'Сітка 5 кг', kg: 5 },
    ],
  },
  {
    slug: 'kartoplia',
    name: 'Картопля',
    category: 'vegetables',
    shortDescription: 'Молода й столова картопля з городу.',
    description:
      'Картопля з наших грядок. Фасуємо сітками під замовлення. Добре вариться й смажиться — без зайвої «хімії» з полиць супермаркету.',
    images: ['/images/potatoes.svg'],
    pricePerKg: 18,
    unit: 'kg',
    availability: 'in_stock',
    featured: true,
    packs: [
      { id: '5kg', label: 'Сітка 5 кг', kg: 5 },
      { id: '10kg', label: 'Сітка 10 кг', kg: 10 },
      { id: '20kg', label: 'Мішок 20 кг', kg: 20 },
    ],
  },
  {
    slug: 'morkva',
    name: 'Морква',
    category: 'vegetables',
    shortDescription: 'Солодка морква прямого збору.',
    description:
      'Морква з городу в Милушах — соковита й солодка. Підходить для соків, рагу й свіжих салатів.',
    images: ['/images/carrots.svg'],
    pricePerKg: 22,
    unit: 'kg',
    availability: 'in_stock',
    packs: [
      { id: '1kg', label: '1 кг', kg: 1 },
      { id: '5kg', label: 'Сітка 5 кг', kg: 5 },
    ],
  },
  {
    slug: 'buriak',
    name: 'Буряк',
    category: 'vegetables',
    shortDescription: 'Столовий буряк для борщу й салатів.',
    description:
      'Буряк із наших грядок. Насичений колір і смак — основа домашнього борщу.',
    images: ['/images/beets.svg'],
    pricePerKg: 20,
    unit: 'kg',
    availability: 'in_stock',
    packs: [
      { id: '1kg', label: '1 кг', kg: 1 },
      { id: '5kg', label: 'Сітка 5 кг', kg: 5 },
    ],
  },
  {
    slug: 'polunytsia',
    name: 'Полуниця',
    category: 'berries',
    shortDescription: 'Сезонна полуниця з грядки.',
    description:
      'Полуниця збирається вранці в день видачі. Солодка, ароматна — лише в свій короткий сезон.',
    images: ['/images/strawberries.svg'],
    pricePerKg: 120,
    unit: 'kg',
    availability: 'out_of_stock',
    featured: true,
    packs: [
      { id: '1kg', label: '1 кг', kg: 1 },
      { id: '2kg', label: '2 кг', kg: 2 },
    ],
  },
  {
    slug: 'malyna',
    name: 'Малина',
    category: 'berries',
    shortDescription: 'Ароматна малина для варення й десертів.',
    description:
      'Малина з наших кущів. Ніжна ягода — краще забирати в день збору.',
    images: ['/images/raspberries.svg'],
    pricePerKg: 150,
    unit: 'kg',
    availability: 'limited',
    packs: [
      { id: '0.5kg', label: '0,5 кг', kg: 0.5 },
      { id: '1kg', label: '1 кг', kg: 1 },
    ],
  },
  {
    slug: 'varennia-yabluchne',
    name: 'Варення яблучне',
    category: 'preserves',
    shortDescription: 'Домашнє варення з наших яблук.',
    description:
      'Варимо невеликими партіями з яблук власного саду. Банка 0,5 л — для чаю й млинців.',
    images: ['/images/jam.svg'],
    pricePerKg: 95,
    unit: 'jar',
    availability: 'in_stock',
    packs: [{ id: 'jar05', label: 'Банка 0,5 л' }],
  },
  {
    slug: 'sik-yabluchnyi',
    name: 'Сік яблучний',
    category: 'preserves',
    shortDescription: 'Прямий віджим без концентратів.',
    description:
      'Яблучний сік прямого віджиму з осіннього врожаю. Пастеризований, без цукру.',
    images: ['/images/juice.svg'],
    pricePerKg: 70,
    unit: 'jar',
    availability: 'in_stock',
    packs: [{ id: 'jar1', label: 'Банка 1 л' }],
  },
  {
    slug: 'med',
    name: 'Мед квітковий',
    category: 'other',
    shortDescription: 'Місцевий мед від пасічника-партнера.',
    description:
      'Квітковий мед із Волині — від пасічника, з яким працюємо не перший сезон. Густий, ароматний, у скляній банці.',
    images: ['/images/honey.svg'],
    pricePerKg: 180,
    unit: 'jar',
    availability: 'in_stock',
    featured: true,
    packs: [
      { id: 'jar05', label: 'Банка 0,5 л' },
      { id: 'jar1', label: 'Банка 1 л' },
    ],
  },
]

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured)
}

export function getProductsByCategory(category: Product['category'] | 'all'): Product[] {
  if (category === 'all') return products
  return products.filter((p) => p.category === category)
}
