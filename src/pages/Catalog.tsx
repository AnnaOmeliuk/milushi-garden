import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ProductCard } from '../components/ProductCard'
import { products, getEffectiveAvailability } from '../data/products'
import { CATEGORY_LABELS } from '../types/product'
import type { Category } from '../types/product'

type AvailabilityFilter = 'all' | 'available' | 'out_of_stock'

export function Catalog() {
  const [category, setCategory] = useState<Category | 'all'>('all')
  const [availability, setAvailability] = useState<AvailabilityFilter>('all')
  const categories = useMemo(
    () => (Object.keys(CATEGORY_LABELS) as Category[]).filter((key) => products.some((product) => product.category === key)),
    [],
  )
  const filtered = products.filter((product) => {
    const matchesCategory = category === 'all' || product.category === category
    const status = getEffectiveAvailability(product)
    const matchesAvailability = availability === 'all' || (availability === 'available' ? status !== 'out_of_stock' : status === 'out_of_stock')
    return matchesCategory && matchesAvailability
  })

  return (
    <div className="section-pad">
      <div className="container-page">
        <nav className="text-sm text-muted"><Link to="/" className="hover:text-[var(--color-green)]">Головна</Link><span className="mx-2">/</span>Каталог</nav>
        <h1 className="mt-4 font-display text-4xl text-[var(--color-green)] sm:text-5xl">Каталог</h1>
        <p className="mt-3 max-w-2xl text-muted">Сезонна продукція нашого сімейного господарства. Обирайте те, що вам до смаку.</p>

        <div className="mt-8 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="mb-3 text-sm font-semibold text-[var(--color-green)]">Категорії</p>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Фільтр за категорією">
              {[{ value: 'all' as const, label: 'Усі товари' }, ...categories.map((value) => ({ value, label: CATEGORY_LABELS[value] }))].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={category === option.value}
                  onClick={() => setCategory(option.value)}
                  className={`min-h-11 rounded-full border px-4 py-2 text-sm font-semibold transition ${category === option.value ? 'border-[var(--color-green)] bg-[var(--color-green)] text-[var(--color-bg)]' : 'border-[color-mix(in_srgb,var(--color-green)_25%,transparent)] text-[var(--color-green)] hover:bg-[var(--color-cream)]'}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="catalog-availability" className="mb-2 block text-sm font-semibold text-[var(--color-green)]">Наявність</label>
            <select
              id="catalog-availability"
              value={availability}
              onChange={(event) => setAvailability(event.target.value as AvailabilityFilter)}
              className="min-h-11 rounded-md border border-[color-mix(in_srgb,var(--color-green)_25%,transparent)] bg-[var(--color-bg)] px-3 text-sm text-[var(--color-text)]"
            >
              <option value="all">Усі товари</option>
              <option value="available">Доступні для замовлення</option>
              <option value="out_of_stock">Немає в наявності</option>
            </select>
          </div>
        </div>

        <p className="mt-6 text-sm text-muted" aria-live="polite">Знайдено товарів: {filtered.length}</p>
        {filtered.length > 0 ? (
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((product) => <ProductCard key={product.slug} product={product} />)}
          </div>
        ) : (
          <div className="mt-4 rounded-xl border border-[color-mix(in_srgb,var(--color-green)_18%,transparent)] p-8 text-center">
            <p className="text-muted">За вибраними фільтрами товарів поки немає.</p>
            <button type="button" onClick={() => { setCategory('all'); setAvailability('all') }} className="mt-4 text-sm font-semibold text-[var(--color-green)] underline underline-offset-4">Скинути фільтри</button>
          </div>
        )}
      </div>
    </div>
  )
}
