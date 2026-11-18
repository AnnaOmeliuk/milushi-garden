import { site } from '../data/site'
import type { Product, Quality } from '../types/product'
import { QUALITY_LABELS, UNIT_LABELS } from '../types/product'

export type OrderSelection = {
  product: Product
  weightKg: number
  quality: Quality
}

export function buildOrderMessage({ product, weightKg, quality }: OrderSelection): string {
  const price = quality === 'second' ? product.secondGradePricePerKg : product.pricePerKg
  const lines = [
    `Доброго дня! Хочу замовити з ${site.brand}:`,
    '',
    `Товар: ${product.name}`,
    ...(product.category === 'fruits' ? [`Якість: ${QUALITY_LABELS[quality]}`] : []),
    `Бажана кількість: ${weightKg} ${UNIT_LABELS[product.unit]}`,
    `Ціна за ${UNIT_LABELS[product.unit]}: ${price === undefined ? 'уточнюється' : `${price} грн`}`,
  ]

  if (price !== undefined) {
    lines.push(`Орієнтовна сума: ${Number((weightKg * price).toFixed(2))} грн`)
  }

  if (product.preorder) {
    lines.push('')
    lines.push('Це попереднє замовлення (під попереднє замовлення).')
    lines.push('Будь ласка, підтвердіть можливість підготовки й зручну дату видачі.')
  } else {
    lines.push('')
    lines.push('Будь ласка, підтвердіть наявність і зручний час видачі.')
  }

  return lines.join('\n')
}

export function viberOrderUrl(): string {
  const number = site.contacts.viber.replace(/\D/g, '')
  return `viber://chat?number=%2B${number}`
}

export function phoneOrderUrl(): string {
  return `tel:${site.contacts.phone}`
}
