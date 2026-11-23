import { useFavorites } from '../context/FavoritesContext'

export function FavoriteButton({ slug, name, className = '' }: { slug: string; name: string; className?: string }) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const active = isFavorite(slug)
  return <button
    type="button"
    onClick={() => toggleFavorite(slug)}
    aria-pressed={active}
    aria-label={active ? `Прибрати ${name} з улюбленого` : `Додати ${name} до улюбленого`}
    title={active ? 'Прибрати з улюбленого' : 'Додати до улюбленого'}
    className={`inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--color-green)_18%,transparent)] bg-[var(--color-bg)] text-[var(--color-green)] shadow-sm transition hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-green)] ${className}`}
  >
    <svg viewBox="0 0 24 24" width="23" height="23" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z" />
    </svg>
  </button>
}
