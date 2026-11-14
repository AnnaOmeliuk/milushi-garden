import { Link } from 'react-router-dom'
import { site } from '../data/site'
import { ContactIcon } from './ContactIcon'

export function Footer() {
  return (
    <footer className="border-t border-[color-mix(in_srgb,var(--color-green)_16%,transparent)] bg-[color-mix(in_srgb,var(--color-green)_92%,#243428)] text-[var(--color-bg)]">
      <div className="container-page grid gap-8 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-2xl tracking-[0.04em]">{site.brand}</p>
          <p className="mt-2 max-w-sm text-[color-mix(in_srgb,var(--color-bg)_78%,transparent)]">
            {site.tagline} · {site.location}
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
              <a href={`tel:${site.contacts.phone}`} className="inline-flex items-center gap-2 hover:text-white">
                <ContactIcon name="phone" />
                {site.contacts.phoneDisplay}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <ContactIcon name="telegram" />
              <span>Telegram: {site.contacts.phoneDisplay}</span>
            </li>
            <li>
              <a href={`viber://chat?number=%2B380509823434`} className="inline-flex items-center gap-2 hover:text-white">
                <ContactIcon name="viber" />
                <span>Viber: {site.contacts.phoneDisplay}</span>
              </a>
            </li>
            <li><a href="https://www.google.com/maps/search/?api=1&query=%D1%81%D0%B5%D0%BB%D0%BE%20%D0%9C%D0%B8%D0%BB%D1%83%D1%88%D1%96%2C%20%D0%9B%D1%83%D1%86%D1%8C%D0%BA%D0%B8%D0%B9%20%D1%80%D0%B0%D0%B9%D0%BE%D0%BD%2C%20%D0%92%D0%BE%D0%BB%D0%B8%D0%BD%D1%81%D1%8C%D0%BA%D0%B0%20%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D1%8C%2C%20%D0%A3%D0%BA%D1%80%D0%B0%D1%97%D0%BD%D0%B0" target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline hover:text-white" aria-label="Показати село Милуші на Google Maps">{site.contacts.address}</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[color-mix(in_srgb,var(--color-bg)_12%,transparent)] py-4 text-center text-sm text-[color-mix(in_srgb,var(--color-bg)_60%,transparent)]">
        © {new Date().getFullYear()} {site.brand}. Сімейне господарство.
      </div>
    </footer>
  )
}
