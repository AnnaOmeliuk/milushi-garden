import type { Product } from '../types/product'

// Фото конкретних сортів; для Айдареду й Рубіну тимчасово використовуємо ілюстрації.
const apples = [
  { slug: 'skifske-zoloto', name: 'Скіфське золото', note: 'Жовті, солодкі, з щільною соковитою м’якоттю' },
  { slug: 'raika', name: 'Райка', note: 'Темно-червоні, кисло-солодкі та хрумкі' },
  { slug: 'champion', name: 'Чемпіон', note: 'Червоні, кисло-солодкі, зі щільною м’якоттю' },
  { slug: 'florina', name: 'Флоріна', note: 'Червоні, солодкі з легкою кислинкою' },
  { slug: 'pinova', name: 'Пінова', note: 'Жовто-червоні, солодкі, соковиті та хрумкі' },
  { slug: 'ligol', name: 'Ліголь', note: 'Червоні, солодкі та хрумкі' },
  { slug: 'idared', name: 'Айдаред', note: 'Яблука з нашого сімейного саду' },
  { slug: 'rubin', name: 'Рубін', note: 'Яблука з нашого сімейного саду' },
  { slug: 'snizhnyi-kalvil', name: 'Сніжний кальвіль', note: 'Домашні яблука з нашого саду' },
  { slug: 'bohemiia', name: 'Богемія', note: 'Домашні яблука з нашого саду' },
  { slug: 'golden', name: 'Голден', note: 'Домашні яблука з нашого саду' },
] as const

const applePhotos: Record<string, string[]> = {
  'skifske-zoloto': ['/images/products/skifske-zoloto-1.webp', '/images/products/skifske-zoloto-2.webp', '/images/products/skifske-zoloto-3.webp', '/images/products/skifske-zoloto-4.webp', '/images/products/skifske-zoloto-5.webp', '/images/products/skifske-zoloto-6.webp'],
  'raika': ['/images/products/raika-1.webp', '/images/products/raika-2.webp'],
  'champion': ['/images/products/champion-1.webp', '/images/products/champion-2.webp', '/images/products/champion-3.webp'],
  'florina': ['/images/products/florina-1.webp', '/images/products/florina-2.webp'],
  'pinova': ['/images/products/pinova-1.webp', '/images/products/pinova-2.webp', '/images/products/pinova-3.webp', '/images/products/pinova-4.webp', '/images/products/pinova-5.webp', '/images/products/pinova-6.webp', '/images/products/pinova-7.webp', '/images/products/pinova-8.webp', '/images/products/pinova-9.webp', '/images/products/pinova-10.webp'],
  'ligol': ['/images/products/ligol-1.webp', '/images/products/ligol-2.webp', '/images/products/ligol-3.webp'],
  'snizhnyi-kalvil': ['/images/products/snizhnyi-kalvil-1.webp', '/images/products/snizhnyi-kalvil-2.webp', '/images/products/snizhnyi-kalvil-3.webp', '/images/products/snizhnyi-kalvil-4.webp', '/images/products/snizhnyi-kalvil-5.webp', '/images/products/snizhnyi-kalvil-6.webp', '/images/products/snizhnyi-kalvil-7.webp', '/images/products/snizhnyi-kalvil-8.webp'],
  'bohemiia': ['/images/products/bohemiia-1.webp'],
  'golden': ['/images/products/golden-1.webp', '/images/products/golden-2.webp', '/images/products/golden-3.webp', '/images/products/golden-4.webp'],
}

const applePacks = [
  { id: '1kg', label: '1 кг', kg: 1 },
  { id: '5kg', label: '5 кг', kg: 5 },
  { id: '10kg', label: '10 кг', kg: 10 },
  { id: '20kg', label: '20 кг', kg: 20 },
]

export const products: Product[] = [
  ...apples.map((apple, index): Product => ({
    slug: apple.slug,
    name: `Яблука «${apple.name}»`,
    category: 'fruits',
    shortDescription: apple.note,
    description: `${apple.note}. Вирощені в сімейному саду в селі Милуші на Волині. Уточніть наявність і зручний спосіб отримання під час замовлення.`,
    images: applePhotos[apple.slug] ?? [`/images/apples-${index % 3 + 1}.svg`],
    pricePerKg: 25,
    secondGradePricePerKg: 20,
    unit: 'kg',
    availability: 'in_stock',
    featured: index < 6,
    packs: applePacks,
  })),
  {
    slug: 'grushi',
    name: 'Груші',
    category: 'fruits',
    shortDescription: 'Соковиті, солодкі та запашні домашні груші.',
    description: 'Домашні груші з нашого саду в Милушах. Є відбірні та другий сорт. Ціну другого сорту уточнюйте під час замовлення.',
    images: ['/images/products/grushi-1.webp', '/images/products/grushi-2.webp'],
    pricePerKg: 60,
    unit: 'kg',
    availability: 'limited',
    featured: true,
    packs: [{ id: '1kg', label: '1 кг', kg: 1 }, { id: '5kg', label: '5 кг', kg: 5 }],
  },
]
export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}
export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured && p.availability !== 'out_of_stock')
}
export function getProductsByCategory(category: Product['category'] | 'all'): Product[] {
  return category === 'all' ? products : products.filter((p) => p.category === category)
}
