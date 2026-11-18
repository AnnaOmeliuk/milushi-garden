import { site } from '../data/site'
import type { Product, Quality } from '../types/product'
import { QUALITY_LABELS, UNIT_LABELS } from '../types/product'

export type OrderSelection = {
  product: Product
  quantity: number
  quality?: Quality
}

export function buildOrderMessage({ product, quantity, quality }: OrderSelection): string {
  const hasQualityOptions = product.secondGradePricePerKg !== undefined
  const selectedQuality = hasQualityOptions && quality === 'second' ? 'second' : 'selected'
  const price = selectedQuality === 'second' ? product.secondGradePricePerKg! : product.pricePerKg
  const name = product.name.replace(/^Яблука «(.+)»$/, '$1')
  const lines = [
    'Вітаю! Хочу замовити:',
    name,
    ...(hasQualityOptions ? [QUALITY_LABELS[selectedQuality]] : []),
    `${quantity} ${UNIT_LABELS[product.unit]}`,
    price === undefined ? 'Ціну уточніть' : `${Number((quantity * price).toFixed(2))} грн`,
  ]
  return lines.join('\n')
}

export function viberOrderUrl(message: string): string {
  const number = site.contacts.viber.replace(/\D/g, '')
  return `viber://chat?number=%2B${number}&draft=${encodeURIComponent(message)}`
}

export function phoneOrderUrl(): string {
  return `tel:${site.contacts.phone}`
}
