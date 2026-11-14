import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Catalog } from './pages/Catalog'
import { Home } from './pages/Home'
import { Product } from './pages/Product'

function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (target) {
        target.scrollIntoView()
        return
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname, hash])

  return null
}

function ScrollUpButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const updateVisibility = () => setVisible(window.scrollY > 400)
    updateVisibility()
    window.addEventListener('scroll', updateVisibility, { passive: true })
    return () => window.removeEventListener('scroll', updateVisibility)
  }, [])

  if (!visible) return null

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })}
      aria-label="Прокрутити сторінку вгору"
      title="Нагору"
      className="fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--color-bg)_30%,transparent)] bg-[var(--color-green)] text-[var(--color-bg)] shadow-lg transition hover:bg-[var(--color-leaf)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] sm:bottom-7 sm:right-7"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
        <path d="m6 14 6-6 6 6" />
      </svg>
    </button>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/product/:slug" element={<Product />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
        <ScrollUpButton />
      </div>
    </BrowserRouter>
  )
}
