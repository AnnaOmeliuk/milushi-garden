import { Link } from 'react-router-dom'
import { site } from '../data/site'
import { getSeasonTheme } from '../lib/season'

export function Footer() {
  const season = getSeasonTheme()

  return (
    <footer className="border-t border-[color-mix(in_srgb,var(--color-green)_16%,transparent)] bg-[color-mix(in_srgb,var(--color-green)_92%,#1e261c)] text-[var(--color-bg)]">
      <div className="container-page grid gap-8 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-2xl tracking-[0.04em]">{site.brand}</p>
          <p className="mt-2 max-w-sm text-[color-mix(in_srgb,var(--color-bg)_78%,transparent)]">
            {season.tagline} · {site.location}
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-accent)]">Навігація</p>
          <ul className="mt-3 space-y-2 text-[color-mix(in_srgb,var(--color-bg)_86%,transparent)]">
            <li>
              <Link to="/catalog" className="hover:text-white">
                Каталог
              </Link>
            </li>
            <li>
              <a href="/#about" className="hover:text-white">
                Про нас
              </a>
            </li>
            <li>
              <a href="/#delivery" className="hover:text-white">
                Доставка
              </a>
            </li>
            <li>
              <a href="/#contacts" className="hover:text-white">
                Контакти
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-accent)]">Зв’язок</p>
          <ul className="mt-3 space-y-2 text-[color-mix(in_srgb,var(--color-bg)_86%,transparent)]">
            <li>
              <a href={`tel:${site.contacts.phone}`} className="hover:text-white">
                {site.contacts.phoneDisplay}
              </a>
            </li>
            <li>
              <a
                href={`https://t.me/${site.contacts.telegram}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white"
              >
                Telegram @{site.contacts.telegram}
              </a>
            </li>
            <li>{site.contacts.address}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[color-mix(in_srgb,var(--color-bg)_12%,transparent)] py-4 text-center text-sm text-[color-mix(in_srgb,var(--color-bg)_60%,transparent)]">
        © {new Date().getFullYear()} {site.brand}. Сімейне господарство.
      </div>
    </footer>
  )
}
