import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { getProductBySlug, getEffectiveAvailability } from '../data/products'
import { cartPrice } from '../lib/cart'
import { QUALITY_LABELS, UNIT_LABELS } from '../types/product'

export function Cart() {
  const { items, update, remove, clear } = useCart()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [delivery, setDelivery] = useState<'pickup' | 'lutsk'>('pickup')
  const [comment, setComment] = useState('')
  const [website, setWebsite] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const entries = items.flatMap(item => {
    const product = getProductBySlug(item.slug)
    return product ? [{ ...item, product }] : []
  })
  const available = entries.filter(item => getEffectiveAvailability(item.product) !== 'out_of_stock')
  const blocked = entries.length !== available.length
  const total = available.reduce((sum, item) => sum + cartPrice(item.product, item.quality) * item.quantity, 0)

  async function submitOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (sending || blocked || !available.length) return
    setSending(true)
    setError('')
    try {
      const response = await fetch('/api/orders', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, delivery, comment, website, items: items.map(({ slug, quality, quantity }) => ({ slug, quality, quantity })) }),
      })
      if (!response.ok) {
        const text = await response.text()
        throw new Error(response.status === 404 ? 'API недоступне. Перевірте розгортання на Vercel.' : text || 'Не вдалося надіслати замовлення')
      }
      clear()
      setSuccess(true)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Помилка з’єднання. Спробуйте ще раз.')
    } finally {
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
            <label className="text-sm">Кількість ({UNIT_LABELS[item.product.unit]})
              <input type="number" min="1" max="999" step="0.5" value={item.quantity} onChange={event => {
                const value = Number(event.target.value)
                if (value >= 1 && value <= 999 && Number.isInteger(value * 2)) update(item.slug, item.quality, value)
              }} className="ml-2 w-24 rounded-md border px-2 py-2" />
            </label>
            <strong>{Number((price * item.quantity).toFixed(2))} грн</strong>
          </div>
        </div>
      })}</div>
      <div className="mt-6 flex justify-between text-xl font-semibold"><span>Разом</span><span>{Number(total.toFixed(2))} грн</span></div>
      {blocked && <p className="mt-3 text-sm text-[#8a4b3a]">У кошику є товар не в наявності. Видаліть його, щоб оформити замовлення.</p>}
      <form onSubmit={submitOrder} className="mt-8 space-y-4 rounded-xl border border-[var(--color-soft-green)] p-5">
        <h2 className="text-xl font-semibold text-[var(--color-green)]">Оформлення замовлення</h2>
        <label className="block text-sm font-medium">Ваше ім’я *
          <input required minLength={2} maxLength={80} autoComplete="name" value={name} onChange={event => setName(event.target.value)} className="mt-1 block w-full rounded-md border p-3" placeholder="Ім’я" />
        </label>
        <label className="block text-sm font-medium">Телефон *
          <input required type="tel" autoComplete="tel" pattern="[+]?[0-9 ()\\-]{9,20}" value={phone} onChange={event => setPhone(event.target.value)} className="mt-1 block w-full rounded-md border p-3" placeholder="+380 XX XXX XX XX" />
        </label>
        <fieldset className="space-y-2"><legend className="text-sm font-medium">Спосіб отримання *</legend>
          <label className="flex items-center gap-2"><input type="radio" checked={delivery === 'pickup'} onChange={() => setDelivery('pickup')} /> Самовивіз із с. Милуші</label>
          <label className="flex items-center gap-2"><input type="radio" checked={delivery === 'lutsk'} onChange={() => setDelivery('lutsk')} /> Доставка до Луцька (від 500 грн, за домовленістю)</label>
        </fieldset>
        <label className="block text-sm font-medium">Коментар (необов’язково)
          <textarea maxLength={500} rows={3} value={comment} onChange={event => setComment(event.target.value)} className="mt-1 block w-full rounded-md border p-3" placeholder="Побажання щодо замовлення" />
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
