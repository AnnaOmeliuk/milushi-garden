import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { products } from '../data/products'

const STORAGE_KEY = 'milushi-favorites'
const validSlugs = new Set(products.map(product => product.slug))

function readFavorites(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed: unknown = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed)
      ? [...new Set(parsed.filter((slug): slug is string => typeof slug === 'string' && validSlugs.has(slug)))]
      : []
  } catch {
    return []
  }
}

type FavoritesValue = {
  favorites: string[]
  toggleFavorite: (slug: string) => void
  isFavorite: (slug: string) => boolean
}

const FavoritesContext = createContext<FavoritesValue | null>(null)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>(readFavorites)

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites)) } catch { /* Storage may be unavailable */ }
  }, [favorites])

  const toggleFavorite = (slug: string) => {
    if (!validSlugs.has(slug)) return
    setFavorites(previous => previous.includes(slug) ? previous.filter(item => item !== slug) : [...previous, slug])
  }

  const isFavorite = (slug: string) => favorites.includes(slug)

  return <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>{children}</FavoritesContext.Provider>
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) throw new Error('useFavorites must be used inside FavoritesProvider')
  return context
}
