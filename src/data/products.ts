import type { Product } from '../types/product'

// Тимчасові ілюстрації; замінити на фотографії конкретних сортів перед запуском.
const apples = [
  { slug: 'skifske-zoloto', name: 'Скіфське золото', note: 'Жовті, солодкі, з щільною соковитою м’якоттю' },
  { slug: 'raika', name: 'Райка', note: 'Темно-червоні, кисло-солодкі та хрумкі' },
  { slug: 'champion', name: 'Чемпіон', note: 'Червоні, кисло-солодкі, зі щільною м’якоттю' },
  { slug: 'florina', name: 'Флоріна', note: 'Червоні, солодкі з легкою кислинкою' },
  { slug: 'pinova', name: 'Пінова', note: 'Жовто-червоні, солодкі, соковиті та хрумкі' },
  { slug: 'ligol', name: 'Ліголь', note: 'Червоні, солодкі та хрумкі' },
  { slug: 'idared', name: 'Айдаред', note: 'Яблука з нашого сімейного саду' },
  { slug: 'rubin', name: 'Рубін', note: 'Яблука з нашого сімейного саду' },
] as const

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
    images: [`/images/apples-${index % 3 + 1}.svg`],
    pricePerKg: 25,
    secondGradePricePerKg: 20,
    unit: 'kg',
    availability: 'in_stock',
    featured: index < 3,
    packs: applePacks,
  })),
  {
    slug: 'grushi',
    name: 'Груші',
    category: 'fruits',
    shortDescription: 'Соковиті, солодкі та запашні домашні груші.',
    description: 'Домашні груші з нашого саду в Милушах. Є відбірні та другий сорт. Ціну другого сорту уточнюйте під час замовлення.',
    images: ['/images/pears.svg'],
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
