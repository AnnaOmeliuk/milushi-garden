export type Category = 'fruits' | 'vegetables' | 'berries' | 'preserves' | 'other'

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
  availability: Availability
  variants?: ProductVariant[]
  packs?: PackOption[]
  featured?: boolean
}

export const CATEGORY_LABELS: Record<Category, string> = {
  fruits: 'Фрукти',
  vegetables: 'Овочі',
  berries: 'Ягоди',
  preserves: 'Заготівлі',
  other: 'Інше',
}

export const AVAILABILITY_LABELS: Record<Availability, string> = {
  in_stock: 'В наявності',
  limited: 'Обмежена кількість',
  out_of_stock: 'Немає в наявності',
}

export const UNIT_LABELS: Record<Product['unit'], string> = {
  kg: 'кг',
  pcs: 'шт',
  jar: 'банка',
}
