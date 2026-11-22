import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { getProductBySlug, getEffectiveAvailability } from '../data/products'
import { cartPrice } from '../lib/cart'
import { QUALITY_LABELS, UNIT_LABELS } from '../types/product'

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

export function Cart() {
  const { items, update, remove, clear } = useCart()
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
      pendingId.current ??= crypto.randomUUID()
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
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Помилка з’єднання. Спробуйте ще раз.')
    } finally {
      submitLock.current = false
      setSending(false)
    }
  }

  return <div className="section-pad"><div className="container-page max-w-3xl">
    <h1 className="font-display text-4xl text-[var(--color-green)]">Кошик</h1>
    {success ? <div role="status" className="mt-8 space-y-4">
      <h2 className="text-xl font-semibold text-[var(--color-green)]">Замовлення надіслано! 🌿</h2>
      <p>Дякуємо! Ми зв’яжемося з вами, щоб підтвердити наявність і домовитися про отримання.</p>
      <Link className="text-[var(--color-green)] underline" to="/catalog">Повернутися до каталогу</Link>
    </div> : entries.length === 0 ? <div className="mt-8 space-y-4"><p>Кошик поки порожній.</p><Link className="text-[var(--color-green)] underline" to="/catalog">Переглянути каталог</Link></div> : <>
      <div className="mt-8 space-y-4">{entries.map(item => {
        const unavailable = getEffectiveAvailability(item.product) === 'out_of_stock'
        const price = cartPrice(item.product, item.quality)
        return <div key={item.slug + item.quality} className="rounded-xl border border-[var(--color-soft-green)] p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div><Link to={`/product/${item.slug}`} className="font-semibold text-[var(--color-green)] hover:underline">{item.product.name}</Link>
              {item.product.secondGradePricePerKg !== undefined && <p className="text-sm text-muted">{QUALITY_LABELS[item.quality]}</p>}
              <p className="text-sm text-muted">{price} грн/{UNIT_LABELS[item.product.unit]}</p>
              {unavailable && <p className="text-sm text-[#8a4b3a]">Немає в наявності — видаліть товар для оформлення</p>}
            </div>
            <button type="button" className="text-sm text-[#8a4b3a] underline" onClick={() => remove(item.slug, item.quality)}>Видалити</button>
          </div>
          <div className="mt-4 flex items-center justify-between gap-3">
            <QuantityInput quantity={item.quantity} unit={UNIT_LABELS[item.product.unit]} onUpdate={value => update(item.slug, item.quality, value)} />
            <strong>{Number((price * item.quantity).toFixed(2))} грн</strong>
          </div>
        </div>
      })}</div>
      <div className="mt-6 flex justify-between text-xl font-semibold"><span>Разом</span><span>{Number(total.toFixed(2))} грн</span></div>
      {blocked && <p className="mt-3 text-sm text-[#8a4b3a]">У кошику є товар не в наявності. Видаліть його, щоб оформити замовлення.</p>}
      <form noValidate onSubmit={submitOrder} className="mt-8 space-y-4 rounded-xl border border-[var(--color-soft-green)] p-5">
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
        <button type="submit" disabled={sending || blocked || !available.length || (delivery === 'lutsk' && total < 500)} className="min-h-11 w-full rounded-md bg-[var(--color-green)] px-5 py-3 font-semibold text-[var(--color-bg)] disabled:opacity-50">{sending ? 'Надсилаємо…' : 'Підтвердити замовлення'}</button>
        <p className="text-sm text-muted">Оплата при отриманні. Після відправлення ми зв’яжемося з вами для підтвердження деталей.</p>
      </form>
      <div className="mt-6 flex justify-between"><Link to="/catalog" className="text-[var(--color-green)] underline">Продовжити покупки</Link><button type="button" className="text-sm text-muted underline" onClick={clear}>Очистити кошик</button></div>
    </>}
  </div></div>
}
