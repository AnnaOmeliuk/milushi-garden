import { Link } from 'react-router-dom'
import { ProductCard } from '../components/ProductCard'
import { getFeaturedProducts } from '../data/products'
import { site } from '../data/site'

export function Home() {
  const featured = getFeaturedProducts()

  return (
    <>
      <section className="relative min-h-[calc(100svh-var(--header-h))] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/hero.svg')" }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-[linear-gradient(105deg,rgba(48,53,45,0.78)_0%,rgba(63,83,64,0.55)_48%,rgba(48,53,45,0.25)_100%)]"
          aria-hidden="true"
        />

        <div className="container-page relative flex min-h-[calc(100svh-var(--header-h))] flex-col justify-end pb-16 pt-20 sm:justify-center sm:pb-24">
          <p className="fade-up font-display text-[clamp(2.6rem,8vw,5.4rem)] leading-[0.95] tracking-[0.02em] text-[var(--color-bg)]">
            {site.brand}
          </p>
          <h1 className="fade-up-delay mt-4 max-w-xl font-display text-[clamp(1.55rem,3.6vw,2.35rem)] font-medium text-[var(--color-accent)]">
            {site.tagline}
          </h1>
          <p className="fade-up-delay-2 mt-4 max-w-md text-base text-[color-mix(in_srgb,var(--color-bg)_88%,transparent)] sm:text-lg">
            {site.shortPitch} {site.location}.
          </p>
          <div className="fade-up-delay-2 mt-8 flex flex-wrap gap-3">
            <Link
              to="/catalog"
              className="inline-flex items-center justify-center rounded-md bg-[var(--color-accent)] px-5 py-3 text-sm font-semibold text-[var(--color-text)] transition hover:brightness-105"
            >
              Дивитись продукцію
            </Link>
            <a
              href="#contacts"
              className="inline-flex items-center justify-center rounded-md border border-[color-mix(in_srgb,var(--color-bg)_55%,transparent)] px-5 py-3 text-sm font-semibold text-[var(--color-bg)] transition hover:bg-[color-mix(in_srgb,var(--color-bg)_12%,transparent)]"
            >
              Зв’язатись
            </a>
          </div>
        </div>
      </section>

      <section id="products" className="section-pad">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl text-[var(--color-green)] sm:text-4xl">Наша продукція</h2>
              <p className="mt-2 max-w-xl text-muted">Яблука різних сортів і домашні груші з нашого саду.</p>
            </div>
            <Link
              to="/catalog"
              className="text-sm font-semibold text-[var(--color-green)] underline-offset-4 hover:underline"
            >
              Весь каталог
            </Link>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="section-pad bg-[color-mix(in_srgb,var(--color-soft-green)_18%,transparent)]">
        <div className="container-page grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div>
            <h2 className="font-display text-3xl text-[var(--color-green)] sm:text-4xl">{site.about.title}</h2>
            <p className="mt-4 max-w-2xl text-lg text-[var(--color-text)]">{site.about.body}</p>
          </div>
          <div className="overflow-hidden rounded-2xl">
            <img src="/images/apples-2.svg" alt="Сад Milushi Garden" className="h-full w-full object-cover" />
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page">
          <h2 className="font-display text-3xl text-[var(--color-green)] sm:text-4xl">Чому ми</h2>
          <p className="mt-2 max-w-xl text-muted">Три прості принципи сімейного господарства.</p>
          <div className="mt-10 grid gap-10 md:grid-cols-3">
            {site.benefits.map((item, index) => (
              <div key={item.title} className="border-t border-[var(--color-soft-green)] pt-5">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-accent)]">
                  0{index + 1}
                </p>
                <h3 className="mt-3 font-display text-2xl text-[var(--color-green)]">{item.title}</h3>
                <p className="mt-2 text-muted">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="delivery" className="section-pad bg-[color-mix(in_srgb,var(--color-green)_8%,transparent)]">
        <div className="container-page max-w-3xl">
          <h2 className="font-display text-3xl text-[var(--color-green)] sm:text-4xl">{site.delivery.title}</h2>
          <ul className="mt-6 space-y-4">
            {site.delivery.items.map((item) => (
              <li key={item} className="flex gap-3 text-[var(--color-text)]">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="contacts" className="section-pad">
        <div className="container-page grid gap-8 md:grid-cols-[1fr_1fr] md:items-end">
          <div>
            <h2 className="font-display text-3xl text-[var(--color-green)] sm:text-4xl">Контакти</h2>
            <p className="mt-2 max-w-md text-muted">
              Напишіть у месенджер або зателефонуйте — підкажемо, що є сьогодні, і домовимось про видачу.
            </p>
            <dl className="mt-8 space-y-4">
              <div>
                <dt className="text-sm font-semibold uppercase tracking-[0.1em] text-[var(--color-soft-green)]">Телефон</dt>
                <dd className="mt-1 text-lg">
                  <a href={`tel:${site.contacts.phone}`} className="hover:text-[var(--color-green)]">
                    {site.contacts.phoneDisplay}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-semibold uppercase tracking-[0.1em] text-[var(--color-soft-green)]">Telegram</dt>
                <dd className="mt-1 text-lg">+380 50 982 34 34</dd>
              </div>
              <div>
                <dt className="text-sm font-semibold uppercase tracking-[0.1em] text-[var(--color-soft-green)]">Viber</dt>
                <dd className="mt-1 text-lg">
                  <a href="viber://chat?number=%2B380509823434" className="hover:text-[var(--color-green)]">+380 50 982 34 34</a>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-semibold uppercase tracking-[0.1em] text-[var(--color-soft-green)]">Адреса</dt>
                <dd className="mt-1 text-lg">{site.contacts.address}</dd>
              </div>
            </dl>
          </div>
          <div className="rounded-2xl bg-[var(--color-green)] p-8 text-[var(--color-bg)]">
            <p className="font-display text-2xl">Готові замовити?</p>
            <p className="mt-3 text-[color-mix(in_srgb,var(--color-bg)_82%,transparent)]">
              Оберіть товар у каталозі — кнопки Telegram і Viber підставлять текст замовлення автоматично.
            </p>
            <Link
              to="/catalog"
              className="mt-6 inline-flex rounded-md bg-[var(--color-accent)] px-5 py-3 text-sm font-semibold text-[var(--color-text)] transition hover:brightness-105"
            >
              Перейти до каталогу
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
