export type Season = 'spring' | 'summer' | 'autumn' | 'winter'

export type SeasonTheme = {
  id: Season
  label: string
  heroImage: string
  tagline: string
  pitch: string
  themeColor: string
}

const SEASONS: Record<Season, SeasonTheme> = {
  spring: {
    id: 'spring',
    label: 'Весна',
    heroImage: '/images/hero-spring.svg',
    tagline: 'Перші зелені. Свіжий старт сезону.',
    pitch: 'Прокидається сад і город — ділимось тим, що тільки-но зійшло в Милушах.',
    themeColor: '#4A6B45',
  },
  summer: {
    id: 'summer',
    label: 'Літо',
    heroImage: '/images/hero-summer.svg',
    tagline: 'Сезонне. Свіже. Своє.',
    pitch: 'Сімейне господарство з Волині — вирощуємо для себе й ділимось із сусідами.',
    themeColor: '#536B4F',
  },
  autumn: {
    id: 'autumn',
    label: 'Осінь',
    heroImage: '/images/hero-autumn.svg',
    tagline: 'Урожай із саду й городу.',
    pitch: 'Яблука, овочі й заготівлі з Милушів — збираємо вручну в свій сезон.',
    themeColor: '#6B5A3E',
  },
  winter: {
    id: 'winter',
    label: 'Зима',
    heroImage: '/images/hero-winter.svg',
    tagline: 'Заготівлі й те, що зберігаємо.',
    pitch: 'Зимові запаси з нашого господарства — варення, соки й те, що дбайливо відклали з осені.',
    themeColor: '#3D5248',
  },
}

const VALID_SEASONS = new Set<Season>(['spring', 'summer', 'autumn', 'winter'])

/** Meteorological seasons for Ukraine (Northern Hemisphere). */
export function getSeasonForDate(date: Date = new Date()): Season {
  const month = date.getMonth() + 1
  if (month >= 3 && month <= 5) return 'spring'
  if (month >= 6 && month <= 8) return 'summer'
  if (month >= 9 && month <= 11) return 'autumn'
  return 'winter'
}

/** Optional `?season=` override for previews; otherwise uses the calendar. */
export function resolveSeason(search: string = typeof window !== 'undefined' ? window.location.search : ''): Season {
  const param = new URLSearchParams(search).get('season')?.toLowerCase()
  if (param && VALID_SEASONS.has(param as Season)) {
    return param as Season
  }
  return getSeasonForDate()
}

export function getSeasonTheme(season: Season = resolveSeason()): SeasonTheme {
  return SEASONS[season]
}

export function applySeasonToDocument(season: Season = resolveSeason()): SeasonTheme {
  const theme = getSeasonTheme(season)
  document.documentElement.dataset.season = theme.id
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) {
    meta.setAttribute('content', theme.themeColor)
  }
  return theme
}
