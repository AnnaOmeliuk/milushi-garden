import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { getProductBySlug } from '../data/products'
import {
  buildOrderMessage,
  phoneOrderUrl,
  viberOrderUrl,
} from '../lib/order'
import { AVAILABILITY_LABELS, CATEGORY_LABELS, QUALITY_LABELS } from '../types/product'
import type { Quality } from '../types/product'

export function Product() {
  const { slug = '' } = useParams()
  const product = getProductBySlug(slug)

  const [imageIndex, setImageIndex] = useState(0)
  const [quality, setQuality] = useState<Quality>('selected')
  const [weight, setWeight] = useState('5')

  useEffect(() => {
    if (!product) return
    setImageIndex(0)
    setQuality('selected')
    setWeight('5')
  }, [product])

  if (!product) {
    return <Navigate to="/catalog" replace />
  }

  const unavailable = product.availability === 'out_of_stock'
  const weightKg = Number(weight)
  const validWeight = weight.trim() !== '' && Number.isFinite(weightKg) && weightKg > 0 && weightKg <= 999
  const pricePerKg = quality === 'second' ? product.secondGradePricePerKg : product.pricePerKg
  const total = validWeight && pricePerKg !== undefined ? Number((weightKg * pricePerKg).toFixed(2)) : undefined
  const message = validWeight ? buildOrderMessage({ product, weightKg, quality }) : ''

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
            <h1 className="mt-2 font-display text-4xl text-[var(--color-green)] sm:text-5xl">{product.name}</h1>
            <p className="mt-3 text-lg text-muted">{product.shortDescription}</p>
            <p className="mt-5 font-display text-3xl text-[var(--color-text)]">
              {quality === 'second' ? (product.secondGradePricePerKg === undefined ? 'Ціна уточнюється' : `${product.secondGradePricePerKg} грн`) : `${product.pricePerKg} грн`}
              {(quality !== "second" || product.secondGradePricePerKg !== undefined) && <span className="ml-1 text-base font-medium text-muted">/ кг</span>}
            </p>
            <p
              className={`mt-2 text-sm font-semibold ${
                unavailable
                  ? 'text-[#895342]'
                  : product.availability === 'limited'
                    ? 'text-[#80612e]'
                    : 'text-[var(--color-green)]'
              }`}
            >
              {AVAILABILITY_LABELS[product.availability]}
            </p>

            <div className="mt-6 space-y-6 border-t border-[color-mix(in_srgb,var(--color-green)_14%,transparent)] pt-6">
              <fieldset>
                <legend className="text-sm font-semibold uppercase tracking-[0.1em] text-[var(--color-soft-green)]">Якість</legend>
                <div className="mt-3 flex flex-wrap gap-3">
                  {(['selected', 'second'] as const).map((item) => (
                    <label key={item} className="flex cursor-pointer items-center gap-2 rounded-md border px-4 py-2">
                      <input type="radio" name="quality" checked={quality === item} onChange={() => setQuality(item)} />
                      {QUALITY_LABELS[item]}
                    </label>
                  ))}
                </div>
              </fieldset>

              <div>
                <label htmlFor="weight" className="text-sm font-semibold uppercase tracking-[0.1em] text-[var(--color-green)]">
                  Бажана кількість (кг)
                </label>
                <input
                  id="weight"
                  type="number"
                  inputMode="decimal"
                  min="0.1"
                  max="999"
                  step="0.1"
                  value={weight}
                  disabled={unavailable}
                  onChange={(event) => setWeight(event.target.value)}
                  aria-invalid={!validWeight}
                  aria-describedby="weight-hint"
                  className="mt-3 block w-36 rounded-md border border-[color-mix(in_srgb,var(--color-green)_25%,transparent)] bg-[var(--color-bg)] px-3 py-2.5 text-lg font-semibold text-[var(--color-text)] disabled:opacity-50"
                />
                <p id="weight-hint" className="mt-2 text-sm text-muted">
                  {validWeight ? 'Фасування узгодимо під час замовлення.' : 'Введіть вагу більше 0 і не більше 999 кг.'}
                </p>
              </div>
              <div className="rounded-xl bg-[var(--color-cream)] p-5">
                <p className="text-sm font-medium text-muted">Орієнтовна вартість</p>
                <p className="mt-1 font-display text-3xl text-[var(--color-green)]">
                  {!validWeight ? 'Вкажіть вагу' : total === undefined ? 'Ціна уточнюється' : total.toLocaleString('uk-UA') + ' грн'}
                </p>
                <p className="mt-2 text-sm text-muted">Наявність, остаточну вагу та суму підтвердимо під час замовлення.</p>
              </div>
              {unavailable ? (
                <p className="rounded-md bg-[color-mix(in_srgb,#895342_12%,transparent)] px-4 py-3 text-sm text-[#895342]">
                  Зараз немає в наявності. Загляньте пізніше в сезон або напишіть нам щодо наступного збору.
                </p>
              ) : (
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <a
                    href={validWeight ? viberOrderUrl(message) : undefined}
                    aria-disabled={!validWeight}
                    tabIndex={validWeight ? undefined : -1}
                    className={`inline-flex flex-1 items-center justify-center rounded-md bg-[var(--color-leaf)] px-5 py-3 text-sm font-semibold text-[var(--color-bg)] transition hover:brightness-110 ${validWeight ? "" : "pointer-events-none opacity-50"}`}
                  >
                    Замовити у Viber
                  </a>
                  <a
                    href={phoneOrderUrl()}
                    className="inline-flex flex-1 items-center justify-center rounded-md border border-[var(--color-green)] px-5 py-3 text-sm font-semibold text-[var(--color-green)] transition hover:bg-[color-mix(in_srgb,var(--color-soft-green)_25%,transparent)]"
                  >
                    Зателефонувати
                  </a>
                </div>
              )}
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
