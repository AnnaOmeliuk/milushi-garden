import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { site } from '../data/site'

export function Header() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  const hrefFor = (href: string) => {
    if (href.startsWith('/#') && location.pathname === '/') {
      return href.slice(1)
    }
    return href
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[color-mix(in_srgb,var(--color-green)_14%,transparent)] bg-[color-mix(in_srgb,var(--color-bg)_92%,transparent)] backdrop-blur-md">
      <div className="container-page flex h-[var(--header-h)] items-center justify-between gap-4">
        <Link to="/" className="font-display text-lg tracking-[0.04em] text-[var(--color-green)] sm:text-xl">
          {site.brand}
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Головна навігація">
          {site.nav.map((item) =>
            item.href === '/catalog' ? (
              <NavLink
                key={item.href}
                to="/catalog"
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors hover:text-[var(--color-green)] ${
                    isActive ? 'text-[var(--color-green)]' : 'text-muted'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ) : (
              <a
                key={item.href}
                href={hrefFor(item.href)}
                className="text-sm font-medium text-muted transition-colors hover:text-[var(--color-green)]"
              >
                {item.label}
              </a>
            ),
          )}
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[color-mix(in_srgb,var(--color-green)_25%,transparent)] text-[var(--color-green)] md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'Закрити меню' : 'Відкрити меню'}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Меню</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            {open ? (
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.6" />
            ) : (
              <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.6" />
            )}
          </svg>
        </button>
      </div>

      {open ? (
        <div id="mobile-nav" className="border-t border-[color-mix(in_srgb,var(--color-green)_12%,transparent)] bg-[var(--color-bg)] md:hidden">
          <nav className="container-page flex flex-col gap-1 py-3" aria-label="Мобільна навігація">
            {site.nav.map((item) =>
              item.href === '/catalog' ? (
                <Link
                  key={item.href}
                  to="/catalog"
                  className="rounded-md px-2 py-2.5 text-base font-medium text-[var(--color-text)] hover:bg-[color-mix(in_srgb,var(--color-soft-green)_28%,transparent)]"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.href}
                  href={hrefFor(item.href)}
                  className="rounded-md px-2 py-2.5 text-base font-medium text-[var(--color-text)] hover:bg-[color-mix(in_srgb,var(--color-soft-green)_28%,transparent)]"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              ),
            )}
          </nav>
        </div>
      ) : null}
    </header>
  )
}
