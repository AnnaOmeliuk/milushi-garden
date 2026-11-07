import { site } from '../data/site'
import type { PackOption, Product, ProductVariant } from '../types/product'
import { UNIT_LABELS } from '../types/product'

export type OrderSelection = {
  product: Product
  quantity: number
  pack?: PackOption
  variant?: ProductVariant
}

export function buildOrderMessage({
  product,
  quantity,
  pack,
  variant,
}: OrderSelection): string {
  const lines = [
    `Доброго дня! Хочу замовити з ${site.brand}:`,
    '',
    `Товар: ${product.name}`,
  ]

  if (variant) {
    lines.push(`Сорт / варіант: ${variant.name}`)
  }

  if (pack) {
    lines.push(`Фасування: ${pack.label}`)
  }

  lines.push(`Кількість: ${quantity} ${UNIT_LABELS[product.unit]}`)
  lines.push(`Ціна орієнтовно: ${product.pricePerKg} грн / ${UNIT_LABELS[product.unit]}`)
  lines.push('')
  lines.push('Будь ласка, підтвердіть наявність і зручний час видачі.')

  return lines.join('\n')
}

export function telegramOrderUrl(message: string): string {
  const text = encodeURIComponent(message)
  return `https://t.me/${site.contacts.telegram}?text=${text}`
}

export function viberOrderUrl(message: string): string {
  const number = site.contacts.viber.replace(/\D/g, '')
  const text = encodeURIComponent(message)
  return `viber://chat?number=%2B${number}&draft=${text}`
}

export function phoneOrderUrl(): string {
  return `tel:${site.contacts.phone}`
}
