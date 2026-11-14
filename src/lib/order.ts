import { site } from '../data/site'
import type { PackOption, Product, Quality } from '../types/product'
import { QUALITY_LABELS } from '../types/product'

export type OrderSelection = {
  product: Product
  quantity: number // кількість упаковок
  pack?: PackOption
  quality: Quality
}

export function buildOrderMessage({ product, quantity, pack, quality }: OrderSelection): string {
  const weight = (pack?.kg ?? 1) * quantity
  const price = quality === 'second' ? product.secondGradePricePerKg : product.pricePerKg
  const lines = [
    `Доброго дня! Хочу замовити з ${site.brand}:`,
    '',
    `Товар: ${product.name}`,
    `Якість: ${QUALITY_LABELS[quality]}`,
    `Фасування: ${pack?.label ?? '1 кг'}`,
    `Кількість упаковок: ${quantity}`,
    `Загальна вага: ${weight} кг`,
    `Ціна за кг: ${price === undefined ? 'уточнюється' : `${price} грн`}`,
  ]
  if (price !== undefined) lines.push(`Орієнтовна сума: ${weight * price} грн`)
  lines.push('', 'Будь ласка, підтвердіть наявність і зручний час видачі.')
  return lines.join('\n')
}
export function telegramOrderUrl(message: string): string {
  return `https://t.me/${site.contacts.telegram}?text=${encodeURIComponent(message)}`
}
export function viberOrderUrl(message: string): string {
  const number = site.contacts.viber.replace(/\D/g, '')
  return `viber://chat?number=%2B${number}&draft=${encodeURIComponent(message)}`
}
export function phoneOrderUrl(): string {
  return `tel:${site.contacts.phone}`
}
