import type { Product, Quality } from '../types/product'
import { QUALITY_LABELS, UNIT_LABELS } from '../types/product'

export type CartItem = { slug: string; quality: Quality; quantity: number }
export const CART_KEY = 'milushi-garden-cart'

export function readCart(): CartItem[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(CART_KEY) || '[]')
    if (!Array.isArray(value)) return []
    return value.filter((item): item is CartItem =>
      item && typeof item.slug === 'string' &&
      (item.quality === 'selected' || item.quality === 'second') &&
      typeof item.quantity === 'number' && Number.isFinite(item.quantity) &&
      item.quantity >= 1 && item.quantity <= 999 && Number.isInteger(item.quantity * 2)
    )
  } catch { return [] }
}

export function cartPrice(product: Product, quality: Quality): number {
  return quality === 'second' && product.secondGradePricePerKg !== undefined
    ? product.secondGradePricePerKg : product.pricePerKg
}

export function buildCartMessage(items: { product: Product; quality: Quality; quantity: number }[]): string {
  const lines = ['Вітаю! Хочу замовити:']
  let total = 0
  for (const { product, quality, quantity } of items) {
    const sum = Number((cartPrice(product, quality) * quantity).toFixed(2))
    total += sum
    lines.push('', product.name,
      ...(product.secondGradePricePerKg !== undefined ? [QUALITY_LABELS[quality]] : []),
      `${quantity} ${UNIT_LABELS[product.unit]} × ${cartPrice(product, quality)} грн = ${sum} грн`)
  }
  lines.push('', `Разом: ${Number(total.toFixed(2))} грн`)
  return lines.join('\n')
}
