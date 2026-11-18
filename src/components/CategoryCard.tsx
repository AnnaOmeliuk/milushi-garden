import { Link } from 'react-router-dom'
import type { Category } from '../types/product'
import { CATEGORY_LABELS } from '../types/product'

const CATEGORY_BLURBS: Record<Category, string> = {
  fruits: 'Яблука, груші та сезонний сад',
  vegetables: 'З городу — прямо до столу',
  berries: 'Короткий сезон, повний смак',
  preserves: 'Варення, соки, заготівлі',
  other: 'Мед і супутні смаколики',
}

type Props = {
  category: Category
}

export function CategoryCard({ category }: Props) {
  return (
    <Link
      to={`/catalog?category=${category}`}
      className="group block border-b border-[color-mix(in_srgb,var(--color-green)_18%,transparent)] py-5 transition hover:border-[var(--color-accent)]"
    >
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="font-display text-2xl text-[var(--color-green)] transition group-hover:text-[var(--color-leaf)] sm:text-3xl">
          {CATEGORY_LABELS[category]}
        </h3>
        <span className="text-sm font-medium text-[var(--color-soft-green)] transition group-hover:text-[var(--color-accent)]">
          Дивитись →
        </span>
      </div>
      <p className="mt-1 text-muted">{CATEGORY_BLURBS[category]}</p>
    </Link>
  )
}
