import type { Season } from '../types/product'
import { SEASON_LABELS } from '../types/product'

/**
 * Manual season switch for MVP.
 * Change this value to winter | spring | summer | autumn to preview another season.
 * Product `availability` is the in-season status; out-of-season items are treated as out_of_stock.
 */
export const currentSeason: Season = 'autumn'

export const SEASON_BLURBS: Record<Season, string> = {
  winter: 'Зараз сезон яблук',
  spring: 'Зараз сезон розсади',
  summer: 'Зараз сезон ягід і овочів',
  autumn: 'Зараз сезон яблук і груш',
}

export function getCurrentSeasonLabel(): string {
  return SEASON_LABELS[currentSeason]
}

export function getCurrentSeasonBlurb(): string {
  return SEASON_BLURBS[currentSeason]
}
