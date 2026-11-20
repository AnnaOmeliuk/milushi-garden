import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { Quality } from '../types/product'
import { CART_KEY, readCart } from '../lib/cart'
import type { CartItem } from '../lib/cart'

type CartContextValue = {
  items: CartItem[]
  add: (slug: string, quality: Quality, quantity: number) => void
  update: (slug: string, quality: Quality, quantity: number) => void
  remove: (slug: string, quality: Quality) => void
  clear: () => void
}
const CartContext = createContext<CartContextValue | null>(null)
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(readCart)
  useEffect(() => { localStorage.setItem(CART_KEY, JSON.stringify(items)) }, [items])
  const add = (slug: string, quality: Quality, quantity: number) => {
    if (!Number.isFinite(quantity) || quantity < 1 || quantity > 999 || !Number.isInteger(quantity)) return
    setItems(previous => {
      const exists = previous.some(item => item.slug === slug && item.quality === quality)
      return exists ? previous.map(item => item.slug === slug && item.quality === quality
        ? { ...item, quantity: Math.min(999, Number((item.quantity + quantity).toFixed(2))) } : item)
        : [...previous, { slug, quality, quantity }]
    })
  }
  const update = (slug: string, quality: Quality, quantity: number) => {
    if (!Number.isFinite(quantity) || quantity < 1 || quantity > 999 || !Number.isInteger(quantity)) return
    setItems(previous => previous.map(item => item.slug === slug && item.quality === quality ? { ...item, quantity } : item))
  }
  const remove = (slug: string, quality: Quality) => setItems(previous => previous.filter(item => item.slug !== slug || item.quality !== quality))
  const clear = () => setItems([])
  return <CartContext.Provider value={{ items, add, update, remove, clear }}>{children}</CartContext.Provider>
}
export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used inside CartProvider')
  return context
}
