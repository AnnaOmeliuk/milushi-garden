import { Link } from 'react-router-dom'
import type { Product } from '../types/product'
import { AVAILABILITY_LABELS, CATEGORY_LABELS, UNIT_LABELS } from '../types/product'

type Props = {
  product: Product
}

export function ProductCard({ product }: Props) {
  const unavailable = product.availability === 'out_of_stock'

  return (
    <Link
      to={`/product/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-[color-mix(in_srgb,var(--color-green)_14%,transparent)] bg-[color-mix(in_srgb,var(--color-bg)_80%,white)] shadow-[0_10px_30px_-24px_rgba(48,53,45,0.55)] transition duration-300 hover:-translate-y-1 hover:border-[color-mix(in_srgb,var(--color-green)_35%,transparent)] hover:shadow-[0_18px_36px_-22px_rgba(48,53,45,0.45)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-cream)]">
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
          loading="lazy"
        />
        <span className="absolute left-3 top-3 rounded-md bg-[color-mix(in_srgb,var(--color-bg)_88%,transparent)] px-2.5 py-1 text-xs font-semibold text-[var(--color-green)]">
          {CATEGORY_LABELS[product.category]}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl text-[var(--color-text)]">{product.name}</h3>
          <p className="shrink-0 text-sm font-semibold text-[var(--color-green)]">
            від {product.pricePerKg} грн/{UNIT_LABELS[product.unit]}
          </p>
        </div>
        <p className="text-sm text-muted">{product.shortDescription}</p>
        <p
          className={`mt-auto pt-2 text-xs font-semibold uppercase tracking-[0.08em] ${
            unavailable ? 'text-[#895342]' : product.availability === 'limited' ? 'text-[#80612e]' : 'text-[var(--color-green)]'
          }`}
        >
          {AVAILABILITY_LABELS[product.availability]}
        </p>
      </div>
    </Link>
  )
}
