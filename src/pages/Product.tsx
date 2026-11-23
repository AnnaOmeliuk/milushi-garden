import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { getEffectiveAvailability, getProductBySlug } from '../data/products'
import {
  phoneOrderUrl,
  viberOrderUrl,
} from '../lib/order'
import { CATEGORY_LABELS, UNIT_LABELS, QUALITY_LABELS, getAvailabilityLabel } from '../types/product'
import type { Quality } from '../types/product'
import { useCart } from '../context/CartContext'
import { ContactIcon } from '../components/ContactIcon'
import { FavoriteButton } from '../components/FavoriteButton'

export function Product() {
  const { slug = '' } = useParams()
  const { items, add, update, remove } = useCart()
  const product = getProductBySlug(slug)

  const [imageIndex, setImageIndex] = useState(0)
  const [quality, setQuality] = useState<Quality>('selected')

  useEffect(() => {
    if (!product) return
    setImageIndex(0)
    setQuality('selected')
  }, [product])

  if (!product) {
    return <Navigate to="/catalog" replace />
  }

  const availability = getEffectiveAvailability(product)
  const unavailable = availability === 'out_of_stock'
  const isPreorder = !unavailable && Boolean(product.preorder)
  const hasSecondGrade = product.secondGradePricePerKg !== undefined
  const chosenQuality = hasSecondGrade ? quality : 'selected'
  const quantity = items.find(item => item.slug === product.slug && item.quality === chosenQuality)?.quantity ?? 0
  const weightKg = quantity || 1
  const pricePerUnit = chosenQuality === 'second' ? product.secondGradePricePerKg! : product.pricePerKg
  const total = Number((weightKg * pricePerUnit).toFixed(2))
  const message = `Вітаю! Маю запитання щодо товару: ${product.name}.`
  const changeQuantity = (direction: 'increase' | 'decrease') => {
    if (unavailable) return
    if (direction === 'increase') {
      if (quantity === 0) add(product.slug, chosenQuality, 1)
      else if (quantity < 999) update(product.slug, chosenQuality, Math.min(999, quantity + 0.5))
    } else if (quantity <= 1) {
      remove(product.slug, chosenQuality)
    } else {
      update(product.slug, chosenQuality, quantity - 0.5)
    }
  }


  return (
    <div className="section-pad">
      <div className="container-page">
        <nav className="text-sm text-muted">
          <Link to="/" className="hover:text-[var(--color-green)]">
            Головна
          </Link>
          <span className="mx-2">/</span>
          <Link to="/catalog" className="hover:text-[var(--color-green)]">
            Каталог
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[var(--color-text)]">{product.name}</span>
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="overflow-hidden rounded-2xl bg-[var(--color-cream)]">
              <img
                src={product.images[imageIndex] ?? product.images[0]}
                alt={product.name}
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
            {product.images.length > 1 ? (
              <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
                {product.images.map((src, index) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setImageIndex(index)}
                    className={`shrink-0 overflow-hidden rounded-lg border-2 ${
                      index === imageIndex
                        ? 'border-[var(--color-green)]'
                        : 'border-transparent opacity-80 hover:opacity-100'
                    }`}
                    aria-label={`Фото ${index + 1}`}
                  >
                    <img src={src} alt="" className="h-20 w-24 object-cover" />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-soft-green)]">
              {CATEGORY_LABELS[product.category]}
            </p>
            <div className="mt-2 flex items-start justify-between gap-3"><h1 className="font-display text-4xl text-[var(--color-green)] sm:text-5xl">{product.name}</h1><FavoriteButton slug={product.slug} name={product.name} className="shrink-0" /></div>
            <p className="mt-3 text-lg text-muted">{product.shortDescription}</p>
            <p className="mt-5 font-display text-3xl text-[var(--color-text)]">
              {pricePerUnit} грн
              <span className="ml-1 text-base font-medium text-muted">/ {UNIT_LABELS[product.unit]}</span>
            </p>
            <p
              className={`mt-2 text-sm font-semibold ${
                unavailable
                  ? 'text-[#8a4b3a]'
                  : availability === 'limited'
                    ? 'text-[#8a6b2a]'
                    : 'text-[var(--color-green)]'
              }`}
            >
              {getAvailabilityLabel(product, availability)}
            </p>
            {isPreorder ? (
              <p className="mt-2 text-sm text-muted">
                Під попереднє замовлення — узгодимо дату підготовки й видачі в месенджері.
              </p>
            ) : null}

            <div className="mt-6 space-y-6 border-t border-[color-mix(in_srgb,var(--color-green)_14%,transparent)] pt-6">
              {hasSecondGrade ? <fieldset>
                <legend className="text-sm font-semibold uppercase tracking-[0.1em] text-[var(--color-soft-green)]">Якість</legend>
                <div className="mt-3 flex flex-wrap gap-3">
                  {(['selected', 'second'] as const).map((item) => (
                    <label key={item} className="flex cursor-pointer items-center gap-2 rounded-md border px-4 py-2">
                      <input type="radio" name="quality" checked={quality === item} onChange={() => setQuality(item)} />
                      {QUALITY_LABELS[item]}
                    </label>
                  ))}
                </div>
              </fieldset> : null}

              <div className="rounded-xl bg-[var(--color-cream)] p-5">
                <p className="text-sm font-medium text-muted">Орієнтовна вартість за {weightKg.toLocaleString('uk-UA')} {UNIT_LABELS[product.unit]}</p>
                <p className="mt-1 font-display text-3xl text-[var(--color-green)]">
                  {total.toLocaleString('uk-UA')} грн
                </p>
                <p className="mt-2 text-sm text-muted">Наявність, остаточну вагу та суму підтвердимо під час замовлення.</p>
              </div>
              {unavailable ? (
                <div className="space-y-3">
                  <p className="rounded-md bg-[color-mix(in_srgb,#895342_12%,transparent)] px-4 py-3 text-sm text-[#895342]">
                    Цього товару наразі немає в наявності. Перегляньте інші смаколики з нашого саду!
                  </p>
                  <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <Link
                      to="/catalog"
                      className="inline-flex min-h-11 flex-1 items-center justify-center rounded-md bg-[var(--color-green)] px-5 py-3 text-sm font-semibold text-[var(--color-bg)] transition hover:bg-[var(--color-leaf)]"
                    >
                      Переглянути каталог
                    </Link>
                    <a
                      href={phoneOrderUrl()}
                      className="inline-flex min-h-11 flex-1 items-center justify-center rounded-md border border-[var(--color-green)] px-5 py-3 text-sm font-semibold text-[var(--color-green)] transition hover:bg-[color-mix(in_srgb,var(--color-soft-green)_25%,transparent)]"
                    >
                      Зателефонувати
                    </a>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  {quantity === 0 ? (
                    <button type="button" onClick={() => changeQuantity('increase')} className="min-h-11 w-full rounded-md bg-[var(--color-green)] px-5 py-3 text-sm font-semibold text-[var(--color-bg)] hover:bg-[var(--color-leaf)]">У кошик</button>
                  ) : (
                    <div className="flex min-h-11 w-full items-center justify-between gap-3" role="group" aria-label={`Кількість ${product.name}, ${QUALITY_LABELS[chosenQuality]}`}>
                      <button type="button" aria-label="Зменшити кількість" onClick={() => changeQuantity('decrease')} className="min-h-11 min-w-11 rounded-md border border-[var(--color-green)] text-xl font-semibold text-[var(--color-green)]">−</button>
                      <div className="flex flex-1 flex-col items-center gap-1 text-center">
                        <span className="font-semibold" aria-live="polite">{quantity.toLocaleString('uk-UA')} {UNIT_LABELS[product.unit]}</span>
                        <span className="text-xs text-muted">У кошику</span>
                      </div>
                      <button type="button" aria-label="Збільшити кількість" disabled={quantity >= 999} onClick={() => changeQuantity('increase')} className="min-h-11 min-w-11 rounded-md bg-[var(--color-green)] text-xl font-semibold text-[var(--color-bg)] disabled:opacity-50">+</button>
                    </div>
                  )}

                </div>
              )}
              {quantity > 0 && !unavailable && <Link to="/cart" className="inline-block text-sm font-semibold text-[var(--color-green)] underline">Перейти до кошика</Link>}
              <div className="border-t border-[color-mix(in_srgb,var(--color-green)_14%,transparent)] pt-4">
                <p className="text-sm font-semibold">Маєте запитання щодо товару?</p>
                <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                  <a href={viberOrderUrl(message)} className="inline-flex min-h-11 items-center gap-2 text-[#7360a9] hover:underline"><ContactIcon name="viber" />Написати нам у Viber</a>
                  {!unavailable && <a href={phoneOrderUrl()} className="inline-flex min-h-11 items-center gap-2 text-[var(--color-green)] hover:underline"><ContactIcon name="phone" />Зателефонувати</a>}
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="font-display text-2xl text-[var(--color-green)]">Опис</h2>
              <p className="mt-3 text-[var(--color-text)]">{product.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
