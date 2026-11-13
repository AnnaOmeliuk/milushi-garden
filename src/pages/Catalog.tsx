import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ProductCard } from '../components/ProductCard'
import {
  getEffectiveAvailability,
  isAvailableNow,
  products,
} from '../data/products'
import { getCurrentSeasonBlurb } from '../data/season'
import type { Category } from '../types/product'
import { CATEGORY_LABELS } from '../types/product'

const FILTERS: Array<{ id: 'all' | Category; label: string }> = [
  { id: 'all', label: 'Усе' },
  ...Object.entries(CATEGORY_LABELS).map(([id, label]) => ({
    id: id as Category,
    label,
  })),
]

type AvailabilityFilter = 'available' | 'all'

export function Catalog() {
  const [params, setParams] = useSearchParams()
  const rawCategory = params.get('category') ?? 'all'
  const active = FILTERS.some((f) => f.id === rawCategory) ? rawCategory : 'all'
  const showAll = params.get('show') === 'all'
  const availabilityFilter: AvailabilityFilter = showAll ? 'all' : 'available'

  const filtered = useMemo(() => {
    let list = products
    if (active !== 'all') {
      list = list.filter((p) => p.category === active)
    }
    if (availabilityFilter === 'available') {
      list = list.filter((p) => isAvailableNow(p))
    }
    return list
  }, [active, availabilityFilter])

  const setCategory = (id: string) => {
    const next = new URLSearchParams(params)
    if (id === 'all') next.delete('category')
    else next.set('category', id)
    setParams(next)
  }

  const setAvailabilityFilter = (value: AvailabilityFilter) => {
    const next = new URLSearchParams(params)
    if (value === 'all') next.set('show', 'all')
    else next.delete('show')
    setParams(next)
  }

  return (
    <div className="section-pad">
      <div className="container-page">
        <nav className="text-sm text-muted">
          <Link to="/" className="hover:text-[var(--color-green)]">
            Головна
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[var(--color-text)]">Каталог</span>
        </nav>

        <h1 className="mt-4 font-display text-4xl text-[var(--color-green)] sm:text-5xl">Каталог</h1>
        <p className="mt-3 max-w-2xl text-muted">
          {getCurrentSeasonBlurb()}. За замовчуванням показуємо те, що можна замовити зараз.
        </p>

        <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Наявність">
          {(
            [
              { id: 'available' as const, label: 'У продажу зараз' },
              { id: 'all' as const, label: 'Усі товари' },
            ] as const
          ).map((filter) => {
            const isActive = availabilityFilter === filter.id
            return (
              <button
                key={filter.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setAvailabilityFilter(filter.id)}
                className={`rounded-md px-3.5 py-2 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-[var(--color-accent)] text-[var(--color-text)]'
                    : 'bg-[color-mix(in_srgb,var(--color-soft-green)_28%,transparent)] text-[var(--color-text)] hover:bg-[color-mix(in_srgb,var(--color-soft-green)_45%,transparent)]'
                }`}
              >
                {filter.label}
              </button>
            )
          })}
        </div>

        <div className="mt-4 flex flex-wrap gap-2" role="tablist" aria-label="Фільтр категорій">
          {FILTERS.map((filter) => {
            const isActive = active === filter.id
            return (
              <button
                key={filter.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setCategory(filter.id)}
                className={`rounded-md px-3.5 py-2 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-[var(--color-green)] text-[var(--color-bg)]'
                    : 'bg-[color-mix(in_srgb,var(--color-soft-green)_28%,transparent)] text-[var(--color-text)] hover:bg-[color-mix(in_srgb,var(--color-soft-green)_45%,transparent)]'
                }`}
              >
                {filter.label}
              </button>
            )
          })}
        </div>

        {filtered.length === 0 ? (
          <p className="mt-12 text-muted">
            {availabilityFilter === 'available'
              ? 'Зараз немає товарів у продажу в цій категорії. Спробуйте «Усі товари».'
              : 'У цій категорії поки немає товарів.'}
          </p>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((product) => (
              <ProductCard
                key={product.slug}
                product={product}
                availability={getEffectiveAvailability(product)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
