import type { IncomingMessage, ServerResponse } from 'node:http'
import { getEffectiveAvailability, getProductBySlug } from '../src/data/products.js'
import { QUALITY_LABELS, UNIT_LABELS } from '../src/types/product.js'
import type { Quality } from '../src/types/product.js'

type Item = { slug: string; quality: Quality; quantity: number }
type Order = { requestId?: string; name: string; phone: string; delivery: 'pickup' | 'lutsk'; comment?: string; items: Item[]; website?: string }

const MAX_BODY_BYTES = 12_000
const recentRequests = new Map<string, number>()
const inFlight = new Set<string>()

function sendError(res: ServerResponse, status: number, message: string) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' })
  res.end(JSON.stringify({ ok: false, message }))
}

export default async function handler(req: IncomingMessage & { body?: unknown }, res: ServerResponse) {
  res.setHeader('Cache-Control', 'no-store')
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); res.writeHead(405).end('Method not allowed'); return }
  let activeRequestId: string | undefined
  try {
    const length = Number(req.headers['content-length'])
    if (Number.isFinite(length) && length > MAX_BODY_BYTES) {
      sendError(res, 413, 'Замовлення завелике'); return
    }
    let raw: unknown = req.body
    if (raw === undefined) {
      let data = ''
      for await (const chunk of req) {
        data += String(chunk)
        if (Buffer.byteLength(data, 'utf8') > MAX_BODY_BYTES) { sendError(res, 413, 'Замовлення завелике'); return }
      }
      raw = JSON.parse(data)
    }
    if (raw !== undefined && Buffer.byteLength(JSON.stringify(raw), 'utf8') > MAX_BODY_BYTES) {
      sendError(res, 413, 'Замовлення завелике'); return
    }
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) { res.writeHead(400).end('Invalid order'); return }
    const order = raw as Order
    if (typeof order.requestId !== 'string' || !/^[0-9a-f-]{36}$/i.test(order.requestId)) {
      sendError(res, 400, 'Оновіть сторінку й повторіть замовлення'); return
    }
    // Best-effort duplicate protection per warm function instance; shared storage
    // is required to guarantee idempotency across Vercel instances.
    const now = Date.now()
    for (const [key, expiry] of recentRequests) if (expiry <= now) recentRequests.delete(key)
    if (recentRequests.has(order.requestId)) {
      res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify({ ok: true, duplicate: true })); return
    }
    if (inFlight.has(order.requestId)) {
      sendError(res, 409, 'Замовлення вже надсилається. Зачекайте'); return
    }
    // Honeypot for basic spam filtering.
    if (order.website) { res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify({ ok: true })); return }
    const name = typeof order.name === 'string' ? order.name.trim() : ''
    const phone = typeof order.phone === 'string' ? order.phone.trim() : ''
    const comment = typeof order.comment === 'string' ? order.comment.trim() : ''
    if (name.length < 2 || name.length > 80 || !/^\+380 \((?:39|50|63|66|67|68|73|75|77|91|92|93|94|95|96|97|98|99)\) \d{3}-\d{2}-\d{2}$/.test(phone) ||
      comment.length > 500 || !['pickup', 'lutsk'].includes(order.delivery) ||
      !Array.isArray(order.items) || order.items.length < 1 || order.items.length > 30) {
      sendError(res, 400, 'Перевірте дані замовлення, зокрема мобільний номер'); return
    }
    let total = 0
    const lines: string[] = []
    for (const item of order.items) {
      if (!item || typeof item.slug !== 'string' ||
        (item.quality !== 'selected' && item.quality !== 'second') ||
        typeof item.quantity !== 'number' || !Number.isFinite(item.quantity) ||
        item.quantity < 1 || item.quantity > 999 || !Number.isInteger(item.quantity * 2)) {
        res.writeHead(400).end('Некоректна кількість товару'); return
      }
      const product = getProductBySlug(item.slug)
      if (!product || getEffectiveAvailability(product) === 'out_of_stock' ||
        (item.quality === 'second' && product.secondGradePricePerKg === undefined)) {
        res.writeHead(400).end('Один із товарів недоступний'); return
      }
      const price = item.quality === 'second' ? product.secondGradePricePerKg! : product.pricePerKg
      const sum = Math.round(item.quantity * price * 100) / 100
      total += sum
      lines.push(`• ${product.name} ${product.secondGradePricePerKg === undefined ? '' : '(' + QUALITY_LABELS[item.quality] + ') '}— ${item.quantity} ${UNIT_LABELS[product.unit]} × ${price} грн = ${sum} грн`)
    }
    if (order.delivery === 'lutsk' && total < 500) {
      res.writeHead(400).end('Доставка до Луцька доступна для замовлень від 500 грн'); return
    }
    const token = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_CHAT_ID
    if (!token || !chatId) { res.writeHead(503).end('Замовлення тимчасово недоступні'); return }
    const message = [
      '🛒 Нове замовлення — Milushi Garden', '',
      ...lines, '', `Разом: ${Math.round(total * 100) / 100} грн`, '',
      `Покупець: ${name}`, `Телефон: ${phone}`,
      `Отримання: ${order.delivery === 'pickup' ? 'Самовивіз, с. Милуші' : 'Доставка до Луцька (за погодженням)'}`,
      ...(comment ? [`Коментар: ${comment}`] : []),
      '', 'Підтвердіть наявність, час та умови отримання з покупцем.'
    ].join('\n')
    activeRequestId = order.requestId
    inFlight.add(activeRequestId)
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: message }),
      signal: AbortSignal.timeout(10000),
    })
    if (!response.ok) { console.error('Telegram send failed', response.status); res.writeHead(502).end('Не вдалося надіслати замовлення'); return }
    recentRequests.set(order.requestId, Date.now() + 10 * 60_000)
    res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify({ ok: true }))
  } catch (error) {
    console.error('Order submission failed', error instanceof Error ? error.message : 'unknown')
    sendError(res, 500, 'Не вдалося обробити замовлення. Спробуйте пізніше')
  } finally {
    if (activeRequestId) inFlight.delete(activeRequestId)
  }
}
