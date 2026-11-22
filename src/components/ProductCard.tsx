import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import type { Quality } from '../types/product'
import type { Availability, Product } from '../types/product'
import { CATEGORY_LABELS, UNIT_LABELS, QUALITY_LABELS, getAvailabilityLabel } from '../types/product'
import { getEffectiveAvailability } from '../data/products'

type Props = {
  product: Product
  availability?: Availability
}

export function ProductCard({ product, availability }: Props) {
  const status = availability ?? getEffectiveAvailability(product)
  const unavailable = status === 'out_of_stock'
  const { items, add, update, remove } = useCart()
  const qualities: Quality[] = product.secondGradePricePerKg === undefined ? ['selected'] : ['selected', 'second']
  const quantityFor = (quality: Quality) => items.find(item => item.slug === product.slug && item.quality === quality)?.quantity ?? 0
  const selectedTotal = qualities.reduce((sum, quality) => sum + quantityFor(quality) * (quality === 'second' ? (product.secondGradePricePerKg ?? 0) : product.pricePerKg), 0)
  const changeQuantity = (quality: Quality, direction: 'increase' | 'decrease') => {
    if (unavailable) return
    const quantity = quantityFor(quality)
    if (direction === 'increase') {
      if (quantity === 0) add(product.slug, quality, 1)
      else if (quantity < 999) update(product.slug, quality, Math.min(999, Number((quantity + 0.5).toFixed(2))))
    } else if (quantity <= 1) {
      remove(product.slug, quality)
    } else {
      update(product.slug, quality, Number((quantity - 0.5).toFixed(2)))
    }
  }

  return (
    <div
      className="group flex flex-col overflow-hidden rounded-xl border border-[color-mix(in_srgb,var(--color-green)_14%,transparent)] bg-[color-mix(in_srgb,var(--color-bg)_80%,white)] shadow-[0_10px_30px_-24px_rgba(48,53,45,0.55)] transition duration-300 hover:-translate-y-1 hover:border-[color-mix(in_srgb,var(--color-green)_35%,transparent)] hover:shadow-[0_18px_36px_-22px_rgba(48,53,45,0.45)]"
    >
      <Link to={`/product/${product.slug}`} className="relative block aspect-[3/2] overflow-hidden bg-[var(--color-cream)]" aria-label={`Переглянути ${product.name}`}>
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
          loading="lazy"
        />
        <span className="absolute left-3 top-3 rounded-md bg-[color-mix(in_srgb,var(--color-bg)_88%,transparent)] px-2.5 py-1 text-xs font-semibold text-[var(--color-green)]">
          {CATEGORY_LABELS[product.category]}
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl text-[var(--color-text)]"><Link to={`/product/${product.slug}`} className="hover:underline">{product.name}</Link></h3>
          <p className="shrink-0 text-sm font-semibold text-[var(--color-green)]">
            від {Math.min(product.pricePerKg, product.secondGradePricePerKg ?? product.pricePerKg)} грн/{UNIT_LABELS[product.unit]}
          </p>
        </div>
        <p className="text-sm text-muted">{product.shortDescription}</p>
        <p
          className={`mt-auto pt-2 text-xs font-semibold uppercase tracking-[0.08em] ${
            unavailable
              ? 'text-[#8a4b3a]'
              : status === 'limited'
                ? 'text-[#8a6b2a]'
                : 'text-[var(--color-green)]'
          }`}
        >
          {getAvailabilityLabel(product, status)}
        </p>
        {unavailable ? (
          <button type="button" disabled className="mt-2 min-h-11 w-full rounded-md bg-[var(--color-green)] px-4 py-2 font-semibold text-[var(--color-bg)] opacity-50">Немає в наявності</button>
        ) : (
          <div className="mt-2 space-y-2">
            {qualities.map(quality => {
              const quantity = quantityFor(quality)
              const price = quality === 'second' ? product.secondGradePricePerKg : product.pricePerKg
              return (
                <div key={quality} className="flex min-h-12 items-center justify-between gap-2 border-b border-[color-mix(in_srgb,var(--color-green)_12%,transparent)] py-2 last:border-b-0">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[var(--color-text)]">{qualities.length > 1 ? QUALITY_LABELS[quality] : 'Кількість'}</p>
                    <p className="text-xs text-muted">{price} грн/{UNIT_LABELS[product.unit]}</p>
                  </div>
                  {quantity === 0 ? (
                    <button type="button" onClick={() => changeQuantity(quality, 'increase')} aria-label={`Додати ${product.name}, ${QUALITY_LABELS[quality]}`}
                      className="min-h-11 shrink-0 rounded-md bg-[var(--color-green)] px-3 text-sm font-semibold text-[var(--color-bg)] hover:bg-[var(--color-leaf)]">У кошик</button>
                  ) : (
                    <div className="flex shrink-0 items-center gap-1" role="group" aria-label={`Кількість ${product.name}, ${QUALITY_LABELS[quality]}`}>
                      <button type="button" aria-label={`Зменшити кількість: ${QUALITY_LABELS[quality]}`} onClick={() => changeQuantity(quality, 'decrease')}
                        className="min-h-11 min-w-11 rounded-md border border-[var(--color-green)] text-xl font-semibold text-[var(--color-green)]">−</button>
                      <span className="min-w-12 text-center text-sm font-semibold" aria-live="polite">{quantity.toLocaleString('uk-UA')} {UNIT_LABELS[product.unit]}</span>
                      <button type="button" aria-label={`Збільшити кількість: ${QUALITY_LABELS[quality]}`} disabled={quantity >= 999} onClick={() => changeQuantity(quality, 'increase')}
                        className="min-h-11 min-w-11 rounded-md bg-[var(--color-green)] text-xl font-semibold text-[var(--color-bg)] disabled:opacity-50">+</button>
                    </div>
                  )}
                </div>
              )
            })}
            {selectedTotal > 0 && (
              <div className="flex items-center justify-between gap-2 pt-2 text-sm">
                <span className="text-muted">Сума за товар</span>
                <strong className="text-[var(--color-green)]">{selectedTotal.toLocaleString('uk-UA')} грн</strong>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
