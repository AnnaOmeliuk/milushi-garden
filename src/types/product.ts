export type Category = 'fruits' | 'vegetables' | 'berries' | 'seedlings' | 'preserves' | 'other'

export type Season = 'winter' | 'spring' | 'summer' | 'autumn'

export type Availability = 'in_stock' | 'limited' | 'out_of_stock'

export type ProductVariant = {
  id: string
  name: string
  note?: string
}

export type PackOption = {
  id: string
  label: string
  kg?: number
}

export type Product = {
  slug: string
  name: string
  category: Category
  shortDescription: string
  description: string
  images: string[]
  pricePerKg: number
  unit: 'kg' | 'pcs' | 'jar'
  /** Availability when the product is in season. Out of season is treated as out_of_stock. */
  availability: Availability
  /** Seasons when this product is typically offered. Omit or empty = year-round. */
  seasons?: Season[]
  /** Pre-order (під попереднє замовлення). Prefer with availability: 'limited'. */
  preorder?: boolean
  variants?: ProductVariant[]
  packs?: PackOption[]
  featured?: boolean
}

export const CATEGORY_LABELS: Record<Category, string> = {
  fruits: 'Фрукти',
  vegetables: 'Овочі',
  berries: 'Ягоди',
  seedlings: 'Розсада',
  preserves: 'Заготівлі',
  other: 'Інше',
}

export const SEASON_LABELS: Record<Season, string> = {
  winter: 'Зима',
  spring: 'Весна',
  summer: 'Літо',
  autumn: 'Осінь',
}

export const AVAILABILITY_LABELS: Record<Availability, string> = {
  in_stock: 'В наявності',
  limited: 'Обмежена кількість',
  out_of_stock: 'Немає в наявності',
}

export function getAvailabilityLabel(product: Product, availability: Availability): string {
  if (availability === 'limited' && product.preorder) {
    return 'Під попереднє замовлення'
  }
  return AVAILABILITY_LABELS[availability]
}

export const UNIT_LABELS: Record<Product['unit'], string> = {
  kg: 'кг',
  pcs: 'шт',
  jar: 'банка',
}
