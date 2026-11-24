import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { getProductBySlug, getEffectiveAvailability } from '../data/products'
import { cartPrice } from '../lib/cart'
import { QUALITY_LABELS, UNIT_LABELS } from '../types/product'
import type { Quality } from '../types/product'

function formatPhone(input: string): string {
  let digits = input.replace(/\D/g, '')
  if (digits.startsWith('380')) digits = digits.slice(3)
  else if (digits.startsWith('0')) digits = digits.slice(1)
  digits = digits.slice(0, 9)
  const result = '+380' + (digits.length ? ' (' + digits.slice(0, 2) : '')
  if (digits.length <= 2) return result
  return result + ') ' + digits.slice(2, 5) +
    (digits.length > 5 ? '-' + digits.slice(5, 7) : '') +
    (digits.length > 7 ? '-' + digits.slice(7, 9) : '')
}

function QuantityInput({ quantity, unit, onUpdate }: { quantity: number; unit: string; onUpdate: (value: number) => void }) {
  const [draft, setDraft] = useState(String(quantity))
  useEffect(() => { setDraft(String(quantity)) }, [quantity])

  function commit(value: string) {
    const parsed = Number(value.replace(',', '.'))
    if (value.trim() !== '' && Number.isFinite(parsed) && parsed >= 1 && parsed <= 999 && Number.isInteger(parsed * 2)) {
      onUpdate(parsed)
      setDraft(String(parsed))
    } else {
      setDraft(String(quantity))
    }
  }

  return <label className="text-sm">Кількість ({unit})
    <input type="text" inputMode="decimal" value={draft}
      onChange={event => setDraft(event.target.value)}
      onBlur={() => commit(draft)}
      onKeyDown={event => { if (event.key === 'Enter') { event.preventDefault(); commit(draft); event.currentTarget.blur() } }}
      aria-label={`Кількість (${unit})`}
      className="ml-2 w-24 rounded-md border px-2 py-2" />
  </label>
}

function createRequestId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const bytes = new Uint8Array(16)
    crypto.getRandomValues(bytes)
    bytes[6] = (bytes[6] & 0x0f) | 0x40
    bytes[8] = (bytes[8] & 0x3f) | 0x80
    const hex = Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('')
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
  }
  // Non-cryptographic fallback for older or insecure browser contexts.
  return `order-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function Cart() {
  const { items, update, changeQuality, remove, clear } = useCart()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('+380')
  const [delivery, setDelivery] = useState<'pickup' | 'lutsk'>('pickup')
  const [comment, setComment] = useState('')
  const [website, setWebsite] = useState('')
  const [sending, setSending] = useState(false)
  const pendingId = useRef<string | null>(null)
  const submitLock = useRef(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)
  const [pendingQuality, setPendingQuality] = useState<{ slug: string; from: Quality; to: Quality } | null>(null)
  const [phoneTouched, setPhoneTouched] = useState(false)
  const [nameTouched, setNameTouched] = useState(false)
  const nameValid = /^[\p{L}]+(?:[\p{L} '\u2019-]*[\p{L}])?$/u.test(name.trim()) && name.trim().length >= 2 && name.trim().length <= 80
  const phoneValid = /^\+380 \([1-9]\d\) \d{3}-\d{2}-\d{2}$/.test(phone)
  const entries = items.flatMap(item => {
    const product = getProductBySlug(item.slug)
    return product ? [{ ...item, product }] : []
  })
  const available = entries.filter(item => getEffectiveAvailability(item.product) !== 'out_of_stock')
  const blocked = entries.length !== available.length
  const total = available.reduce((sum, item) => sum + cartPrice(item.product, item.quality) * item.quantity, 0)

  function requestQualityChange(slug: string, from: Quality, to: Quality) {
    if (from === to) return
    const source = items.find(item => item.slug === slug && item.quality === from)
    const existing = items.find(item => item.slug === slug && item.quality === to)
    if (!source) return
    if (existing) {
      if (source.quantity + existing.quantity > 999) return
      setPendingQuality({ slug, from, to })
      return
    }
    pendingId.current = null
    changeQuality(slug, from, to)
  }

  function confirmQualityChange() {
    if (!pendingQuality) return
    pendingId.current = null
    changeQuality(pendingQuality.slug, pendingQuality.from, pendingQuality.to)
    setPendingQuality(null)
  }

  async function submitOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitLock.current || sending) return
    if (blocked || !available.length) { setError('Перевірте наявність товарів у кошику'); return }
    if (delivery === 'lutsk' && total < 500) { setError('Для доставки до Луцька мінімальна сума замовлення — 500 грн'); return }
    setPhoneTouched(true)
    setNameTouched(true)
    if (!nameValid) { setError('Введіть коректне ім’я'); return }
    if (!phoneValid) { setError('Введіть коректний номер телефону'); return }
    submitLock.current = true
    setSending(true)
    setError('')
    try {
      pendingId.current ??= createRequestId()
      const response = await fetch('/api/orders', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId: pendingId.current, name, phone, delivery, comment, website, items: items.map(({ slug, quality, quantity }) => ({ slug, quality, quantity })) }),
      })
      if (!response.ok) {
        const text = await response.text()
        let message = 'Не вдалося надіслати замовлення. Спробуйте пізніше.'
        try { const data = JSON.parse(text) as { message?: string }; if (data.message) message = data.message } catch { /* Do not expose internal server responses */ }
        if (response.status === 429) message = 'Забагато спроб. Зачекайте хвилину та повторіть.'
        if (response.status === 404) message = 'Сервіс замовлень тимчасово недоступний.'
        throw new Error(message)
      }
      pendingId.current = null
      clear()
      setSuccess(true)
      window.scrollTo({ top: 0, behavior: 'instant' })
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Помилка з’єднання. Спробуйте ще раз.')
    } finally {
      submitLock.current = false
      setSending(false)
    }
  }

  return <div className="section-pad"><div className="container-page max-w-3xl lg:max-w-none">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h1 className="font-display text-4xl text-[var(--color-green)]">Кошик</h1>
      {!success && entries.length > 0 && <button type="button" disabled={sending} className="inline-flex min-h-11 items-center gap-2 text-sm text-[#8a4b3a] hover:underline disabled:opacity-50" onClick={() => setConfirmClear(true)}><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M3 6h18M9 6V4h6v2M5 6l1 14h12l1-14M10 10v6M14 10v6" /></svg>Очистити кошик</button>}
    </div>
    {confirmClear && !success && entries.length > 0 && <div role="group" aria-label="Підтвердження очищення кошика" className="mt-4 rounded-lg border border-[var(--color-soft-green)] bg-[var(--color-cream)] p-4">
      <p className="text-sm">Видалити всі товари з кошика?</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" disabled={sending} onClick={() => { clear(); pendingId.current = null; setPendingQuality(null); setConfirmClear(false); setError('') }} className="min-h-11 rounded-md bg-[#8a4b3a] px-4 font-semibold text-white disabled:opacity-50">Очистити</button>
        <button type="button" onClick={() => setConfirmClear(false)} className="min-h-11 rounded-md border border-[var(--color-soft-green)] px-4">Скасувати</button>
      </div>
    </div>}
    {success ? <div role="status" className="mt-8 space-y-4">
      <h2 className="text-xl font-semibold text-[var(--color-green)]">Замовлення надіслано! 🌿</h2>
      <p>Дякуємо! Ми зв’яжемося з вами, щоб підтвердити наявність і домовитися про отримання.</p>
      <Link className="text-[var(--color-green)] underline" to="/catalog">Повернутися до каталогу</Link>
    </div> : entries.length === 0 ? <div className="mt-8 space-y-4"><p>Кошик поки порожній.</p><Link className="text-[var(--color-green)] underline" to="/catalog">Переглянути каталог</Link></div> : <>
      <div className="mt-8 grid min-w-0 gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-start lg:gap-8">
      <div className="min-w-0">
      <div className="space-y-4">{entries.map(item => {
        const unavailable = getEffectiveAvailability(item.product) === 'out_of_stock'
        const price = cartPrice(item.product, item.quality)
        return <div key={item.slug + item.quality} className="rounded-xl border border-[var(--color-soft-green)] p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex min-w-0 flex-1 items-start gap-3">
              <Link to={`/product/${item.slug}`} className="shrink-0 overflow-hidden rounded-lg bg-[var(--color-cream)]" aria-label={`Переглянути ${item.product.name}`}>
                <img src={item.product.images[0]} alt={item.product.name} loading="lazy" className="h-20 w-20 object-cover sm:h-24 sm:w-24" />
              </Link>
              <div className="min-w-0"><Link to={`/product/${item.slug}`} className="font-semibold text-[var(--color-green)] hover:underline">{item.product.name}</Link>
              {item.product.secondGradePricePerKg !== undefined && (
                <label className="mt-2 block text-sm text-muted">Якість
                  <select value={item.quality}
                    onChange={event => requestQualityChange(item.slug, item.quality, event.target.value as Quality)}
                    className="mt-1 block min-h-11 rounded-md border border-[var(--color-soft-green)] bg-[var(--color-bg)] px-3 text-[var(--color-text)]"
                    aria-label={`Якість: ${item.product.name}`}>
                    <option value="selected" disabled={item.quality !== 'selected' && (items.find(other => other.slug === item.slug && other.quality === 'selected')?.quantity ?? 0) + item.quantity > 999}>Відбірні</option>
                    <option value="second" disabled={item.quality !== 'second' && (items.find(other => other.slug === item.slug && other.quality === 'second')?.quantity ?? 0) + item.quantity > 999}>Другий сорт</option>
                  </select>
                </label>
              )}
              <p className="mt-1 text-sm text-muted">{price} грн/{UNIT_LABELS[item.product.unit]}</p>
              {unavailable && <p className="text-sm text-[#8a4b3a]">Немає в наявності — видаліть товар для оформлення</p>}
              </div>
            </div>
            <button type="button" aria-label={`Видалити ${item.product.name}, ${QUALITY_LABELS[item.quality]}`} title="Видалити товар" disabled={sending} className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-md text-[#8a4b3a] hover:bg-[var(--color-cream)] disabled:opacity-50" onClick={() => { remove(item.slug, item.quality); pendingId.current = null; setPendingQuality(null); setConfirmClear(false) }}><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M3 6h18M9 6V4h6v2M5 6l1 14h12l1-14M10 10v6M14 10v6" /></svg></button>
          </div>
              {pendingQuality?.slug === item.slug && pendingQuality.from === item.quality && (() => {
                const other = items.find(entry => entry.slug === item.slug && entry.quality === pendingQuality.to)
                if (!other) return null
                const combined = Number((item.quantity + other.quantity).toFixed(2))
                return <div role="alert" className="mt-4 w-full rounded-lg border border-[var(--color-soft-green)] bg-[var(--color-cream)] p-3 text-sm">
                  <p>У кошику вже є «{QUALITY_LABELS[pendingQuality.to]}». Об’єднати позиції в одну: {combined.toLocaleString('uk-UA')} {UNIT_LABELS[item.product.unit]}?</p>
                  <p className="mt-1 text-muted">Нова вартість: {Number((combined * cartPrice(item.product, pendingQuality.to)).toFixed(2)).toLocaleString('uk-UA')} грн.</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button type="button" onClick={confirmQualityChange} className="min-h-11 rounded-md bg-[var(--color-green)] px-4 font-semibold text-[var(--color-bg)]">Об’єднати</button>
                    <button type="button" onClick={() => setPendingQuality(null)} className="min-h-11 rounded-md border border-[var(--color-soft-green)] px-4">Скасувати</button>
                  </div>
                </div>
              })()}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <QuantityInput quantity={item.quantity} unit={UNIT_LABELS[item.product.unit]} onUpdate={value => update(item.slug, item.quality, value)} />
            <strong>{Number((price * item.quantity).toFixed(2))} грн</strong>
          </div>
        </div>
      })}</div>
      <div className="mt-6"><Link to="/catalog" className="text-[var(--color-green)] underline">Продовжити покупки</Link></div>
      </div>
      <div className="min-w-0 lg:self-start lg:[@media(min-height:900px)]:sticky lg:top-[calc(var(--header-h)+1rem)]">
      <div className="rounded-xl border border-[var(--color-soft-green)] bg-[var(--color-bg)] p-4 sm:p-5">
      {blocked && <p className="mt-3 text-sm text-[#8a4b3a]">У кошику є товар не в наявності. Видаліть його, щоб оформити замовлення.</p>}
      <form id="checkout" noValidate onSubmit={submitOrder} className="space-y-4 scroll-mt-[calc(var(--header-h)+1rem)]">
        <h2 className="text-xl font-semibold text-[var(--color-green)]">Оформлення замовлення</h2>
        <label className="block text-sm font-medium">Ваше ім’я *
          <input required minLength={2} maxLength={80} autoComplete="name" value={name} onChange={event => { pendingId.current = null; setName(event.target.value) }} onBlur={() => setNameTouched(true)} aria-invalid={nameTouched && !nameValid} className="mt-1 block w-full rounded-md border p-3" placeholder="Ім’я" />
          {nameTouched && !nameValid && <span className="mt-1 block text-sm text-[#8a4b3a]">Введіть ім’я літерами (можна з пробілом, дефісом або апострофом)</span>}
        </label>
        <label className="block text-sm font-medium">Телефон *
          <input required type="tel" inputMode="numeric" autoComplete="tel" value={phone}
            onChange={event => { pendingId.current = null; setPhone(formatPhone(event.target.value)); setError('') }}
            onBlur={() => setPhoneTouched(true)}
            aria-invalid={phoneTouched && !phoneValid}
            aria-describedby={phoneTouched && !phoneValid ? 'phone-error' : undefined}
            className="mt-1 block w-full rounded-md border p-3" placeholder="+380 (00) 000-00-00" />
          {phoneTouched && !phoneValid && <span id="phone-error" className="mt-1 block text-sm text-[#8a4b3a]">Введіть коректний мобільний номер України: +380 (00) 000-00-00</span>}
        </label>
        <fieldset className="space-y-2"><legend className="text-sm font-medium">Спосіб отримання *</legend>
          <label className="flex items-center gap-2"><input type="radio" checked={delivery === 'pickup'} onChange={() => { pendingId.current = null; setDelivery('pickup') }} /> Самовивіз із с. Милуші</label>
          <label className="flex items-center gap-2"><input type="radio" checked={delivery === 'lutsk'} onChange={() => { pendingId.current = null; setDelivery('lutsk') }} /> Доставка до Луцька (від 500 грн, за домовленістю)</label>
        </fieldset>
        <label className="block text-sm font-medium">Коментар (необов’язково)
          <textarea maxLength={500} rows={3} value={comment} onChange={event => { pendingId.current = null; setComment(event.target.value) }} className="mt-1 block w-full rounded-md border p-3" placeholder="Побажання щодо замовлення" />
        </label>
        <div className="hidden" aria-hidden="true"><label>Website<input tabIndex={-1} autoComplete="off" value={website} onChange={event => setWebsite(event.target.value)} /></label></div>
        {delivery === 'lutsk' && total < 500 && <p className="text-sm text-[#8a4b3a]">Для доставки до Луцька сума замовлення має бути від 500 грн.</p>}
        {error && <p role="alert" className="text-sm text-[#8a4b3a]">{error}</p>}
        <div className="flex justify-between gap-3 border-t border-[var(--color-soft-green)] pt-4 text-xl font-semibold"><span>Разом</span><span>{Number(total.toFixed(2))} грн</span></div>
        <button type="submit" disabled={sending || blocked || !available.length || (delivery === 'lutsk' && total < 500)} className="min-h-11 w-full rounded-md bg-[var(--color-green)] px-5 py-3 font-semibold text-[var(--color-bg)] disabled:opacity-50">{sending ? 'Надсилаємо…' : 'Підтвердити замовлення'}</button>
        <p className="text-sm text-muted">Оплата при отриманні. Після відправлення ми зв’яжемося з вами для підтвердження деталей.</p>
      </form>
      </div>
      </div>
      </div>
      <div className="sticky bottom-0 z-20 mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--color-soft-green)] bg-[var(--color-bg)] px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden">
        <span className="font-semibold">Разом: {Number(total.toFixed(2))} грн</span>
        <button type="button" onClick={() => document.getElementById("checkout")?.scrollIntoView({ block: "start" })} className="min-h-11 rounded-md bg-[var(--color-green)] px-4 py-2 text-sm font-semibold text-[var(--color-bg)]">До оформлення</button>
      </div>
    </>}
  </div></div>
}
