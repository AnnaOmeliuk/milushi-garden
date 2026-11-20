import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { getProductBySlug, getEffectiveAvailability } from '../data/products'
import { buildCartMessage, cartPrice } from '../lib/cart'
import { viberOrderUrl } from '../lib/order'
import { QUALITY_LABELS, UNIT_LABELS } from '../types/product'

export function Cart() {
  const { items, update, remove, clear } = useCart()
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState(false)
  const entries = items.flatMap(item => {
    const product = getProductBySlug(item.slug)
    return product ? [{ ...item, product }] : []
  })
  const available = entries.filter(item => getEffectiveAvailability(item.product) !== 'out_of_stock')
  const blocked = entries.length !== available.length
  const total = available.reduce((sum, item) => sum + cartPrice(item.product, item.quality) * item.quantity, 0)
  const message = buildCartMessage(available)
  async function copyOrder() {
    try {
      await navigator.clipboard.writeText(message)
      setCopied(true)
      setCopyError(false)
    } catch {
      setCopied(false)
      setCopyError(true)
    }
  }
  return (
    <div className="section-pad"><div className="container-page max-w-3xl">
      <h1 className="font-display text-4xl text-[var(--color-green)]">Кошик</h1>
      {entries.length === 0 ? <div className="mt-8 space-y-4"><p>Кошик поки порожній.</p><Link className="text-[var(--color-green)] underline" to="/catalog">Переглянути каталог</Link></div> : <>
        <div className="mt-8 space-y-4">
          {entries.map(item => {
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
          })}
        </div>
        <div className="mt-6 flex justify-between text-xl font-semibold"><span>Разом</span><span>{Number(total.toFixed(2))} грн</span></div>
        {blocked && <p className="mt-3 text-sm text-[#8a4b3a]">У кошику є товар не в наявності. Видаліть його, щоб оформити замовлення.</p>}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button type="button" disabled={blocked || !available.length} onClick={copyOrder} className="min-h-11 flex-1 rounded-md bg-[var(--color-green)] px-5 py-3 font-semibold text-[var(--color-bg)] disabled:opacity-50">{copied ? 'Скопійовано!' : 'Скопіювати замовлення'}</button>
          <a href={!blocked && available.length ? viberOrderUrl('') : undefined} aria-disabled={blocked || !available.length} className={`inline-flex min-h-11 flex-1 items-center justify-center rounded-md border border-[var(--color-green)] px-5 py-3 font-semibold text-[var(--color-green)] ${blocked || !available.length ? 'pointer-events-none opacity-50' : ''}`}>Відкрити Viber</a>
        </div>
        <p className="mt-3 text-sm text-muted">Спочатку скопіюйте замовлення, потім відкрийте Viber та вставте текст у чат. Якщо там є стара чернетка, замініть її скопійованим повідомленням.</p>
        {copyError && <div className="mt-3 space-y-2"><p className="text-sm text-[#8a4b3a]">Браузер не дозволив копіювання. Виділіть і скопіюйте текст нижче вручну.</p><textarea readOnly value={message} className="w-full rounded-md border p-3" rows={8} aria-label="Текст замовлення" /></div>}
        <div className="mt-6 flex justify-between"><Link to="/catalog" className="text-[var(--color-green)] underline">Продовжити покупки</Link><button type="button" className="text-sm text-muted underline" onClick={clear}>Очистити кошик</button></div>
      </>}
    </div></div>
  )
}
