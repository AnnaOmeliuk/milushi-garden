import { Link } from 'react-router-dom'
import { ProductCard } from '../components/ProductCard'
import { useFavorites } from '../context/FavoritesContext'
import { products } from '../data/products'

export function Favorites() {
  const { favorites } = useFavorites()
  const saved = favorites.flatMap(slug => {
    const product = products.find(item => item.slug === slug)
    return product ? [product] : []
  })

  return <div className="section-pad"><div className="container-page">
    <nav className="text-sm text-muted"><Link to="/" className="hover:text-[var(--color-green)]">Головна</Link><span className="mx-2">/</span>Улюблене</nav>
    <h1 className="mt-4 font-display text-4xl text-[var(--color-green)] sm:text-5xl">Улюблене</h1>
    <p className="mt-3 text-muted">Товари, які ви зберегли, щоб повернутися до них пізніше.</p>
    {saved.length ? <>
      <p className="mt-6 text-sm text-muted" aria-live="polite">Збережено товарів: {saved.length}</p>
      <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {saved.map(product => <ProductCard key={product.slug} product={product} />)}
      </div>
    </> : <div className="mt-8 rounded-xl border border-[var(--color-soft-green)] p-8 text-center">
      <p className="text-lg font-semibold text-[var(--color-green)]">Поки немає улюблених товарів ♡</p>
      <p className="mt-2 text-muted">Натисніть сердечко на товарі, щоб зберегти його тут.</p>
      <Link to="/catalog" className="mt-5 inline-flex min-h-11 items-center rounded-md bg-[var(--color-green)] px-5 py-3 font-semibold text-[var(--color-bg)]">Перейти до каталогу</Link>
    </div>}
  </div></div>
}
