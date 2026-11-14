import { Link } from 'react-router-dom'
import { ProductCard } from '../components/ProductCard'
import { products } from '../data/products'

export function Catalog() {
  return (
    <div className="section-pad">
      <div className="container-page">
        <nav className="text-sm text-muted">
          <Link to="/" className="hover:text-[var(--color-green)]">Головна</Link>
          <span className="mx-2">/</span>Каталог
        </nav>
        <h1 className="mt-4 font-display text-4xl text-[var(--color-green)] sm:text-5xl">Яблука та груші</h1>
        <p className="mt-3 max-w-2xl text-muted">Оберіть сорт яблук або груші з нашого сімейного саду в Милушах.</p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map(product => <ProductCard key={product.slug} product={product} />)}
        </div>
      </div>
    </div>
  )
}
