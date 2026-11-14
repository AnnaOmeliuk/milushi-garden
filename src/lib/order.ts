import { site } from '../data/site'
import type { Product, Quality } from '../types/product'
import { QUALITY_LABELS } from '../types/product'

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
    `Якість: ${QUALITY_LABELS[quality]}`,
    `Бажана вага: ${weightKg} кг`,
    `Ціна за кг: ${price === undefined ? 'уточнюється' : `${price} грн`}`,
  ]
  if (price !== undefined) lines.push(`Орієнтовна сума: ${Number((weightKg * price).toFixed(2))} грн`)
  lines.push('', 'Будь ласка, підтвердіть наявність, остаточну суму та спосіб отримання.')
  return lines.join('\n')
}

export function viberOrderUrl(message: string): string {
  const number = site.contacts.viber.replace(/\D/g, '')
  return `viber://chat?number=%2B${number}&draft=${encodeURIComponent(message)}`
}

export function phoneOrderUrl(): string {
  return `tel:${site.contacts.phone}`
}
