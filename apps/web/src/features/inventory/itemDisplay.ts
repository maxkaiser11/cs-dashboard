import type { InventoryItem } from './types'

export type ParsedItemName = {
  /** e.g. "AK-47" (or the whole name for items without a " | ") */
  base: string
  /** e.g. "Redline"; null for items like agents' plain names */
  finish: string | null
  isStatTrak: boolean
  isSouvenir: boolean
  /** ★ knives & gloves */
  isStar: boolean
}

/**
 * "★ StatTrak™ Karambit | Doppler (Factory New)" →
 * { base: "Karambit", finish: "Doppler", isStatTrak, isStar }
 */
export function parseItemName(item: InventoryItem): ParsedItemName {
  let name = (item.name ?? item.marketHashName).trim()

  const isStar = name.startsWith('★')
  name = name.replace(/^★\s*/, '')

  const isStatTrak = name.startsWith('StatTrak™')
  name = name.replace(/^StatTrak™\s*/, '')

  const isSouvenir = name.startsWith('Souvenir ')
  name = name.replace(/^Souvenir\s+/, '')

  // Drop a trailing "(Field-Tested)" etc. — exterior is shown separately.
  if (item.exterior && name.endsWith(`(${item.exterior})`)) {
    name = name.slice(0, -(item.exterior.length + 2)).trim()
  }

  const sep = name.indexOf(' | ')
  if (sep === -1) return { base: name, finish: null, isStatTrak, isSouvenir, isStar }

  return {
    base: name.slice(0, sep),
    finish: name.slice(sep + 3),
    isStatTrak,
    isSouvenir,
    isStar,
  }
}

export function parseFloatValue(item: InventoryItem): number | null {
  if (item.floatValue == null) return null
  const n = Number(item.floatValue)
  return Number.isFinite(n) ? n : null
}

/** CS2 wear ranges, in float order. */
export const WEAR_RANGES = [
  { label: 'Factory New', short: 'FN', min: 0, max: 0.07 },
  { label: 'Minimal Wear', short: 'MW', min: 0.07, max: 0.15 },
  { label: 'Field-Tested', short: 'FT', min: 0.15, max: 0.38 },
  { label: 'Well-Worn', short: 'WW', min: 0.38, max: 0.45 },
  { label: 'Battle-Scarred', short: 'BS', min: 0.45, max: 1 },
] as const

export function exteriorShort(exterior: string | null): string | null {
  if (!exterior) return null
  return WEAR_RANGES.find((w) => w.label === exterior)?.short ?? exterior
}

export function steamMarketUrl(item: InventoryItem): string {
  return `https://steamcommunity.com/market/listings/730/${encodeURIComponent(item.marketHashName)}`
}

// ---------- Aggregates for the dashboard ----------

export type CategoryStat = {
  type: string
  count: number
  valueCents: number
}

export function groupByCategory(items: InventoryItem[]): CategoryStat[] {
  const map = new Map<string, CategoryStat>()
  for (const item of items) {
    const type = item.type ?? 'Other'
    const stat = map.get(type) ?? { type, count: 0, valueCents: 0 }
    stat.count += 1
    stat.valueCents += item.priceCents ?? 0
    map.set(type, stat)
  }
  return [...map.values()].sort((a, b) => b.valueCents - a.valueCents || b.count - a.count)
}

export function topItemsByValue(items: InventoryItem[], n: number): InventoryItem[] {
  return [...items]
    .filter((i) => i.priceCents != null)
    .sort((a, b) => (b.priceCents ?? 0) - (a.priceCents ?? 0))
    .slice(0, n)
}

// ---------- Filtering & sorting for the item grid ----------

export type SortKey = 'price-desc' | 'price-asc' | 'name' | 'float-asc'

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'name', label: 'Name: A to Z' },
  { value: 'float-asc', label: 'Float: lowest first' },
]

export type InventoryFilters = {
  search: string
  category: string | null
  sort: SortKey
  tradableOnly: boolean
}

export function applyFilters(items: InventoryItem[], filters: InventoryFilters): InventoryItem[] {
  const q = filters.search.trim().toLowerCase()

  const filtered = items.filter((item) => {
    if (filters.category && (item.type ?? 'Other') !== filters.category) return false
    if (filters.tradableOnly && (!item.tradable || item.tradeProtected)) return false
    if (q && !(item.name ?? item.marketHashName).toLowerCase().includes(q)) return false
    return true
  })

  const byName = (a: InventoryItem, b: InventoryItem) =>
    (a.name ?? a.marketHashName).localeCompare(b.name ?? b.marketHashName)

  return filtered.sort((a, b) => {
    switch (filters.sort) {
      case 'price-desc':
        return (b.priceCents ?? -1) - (a.priceCents ?? -1) || byName(a, b)
      case 'price-asc':
        return (a.priceCents ?? Infinity) - (b.priceCents ?? Infinity) || byName(a, b)
      case 'name':
        return byName(a, b)
      case 'float-asc': {
        // Items without a float (stickers, graffiti, agents) go last.
        const fa = parseFloatValue(a) ?? Infinity
        const fb = parseFloatValue(b) ?? Infinity
        return fa - fb || byName(a, b)
      }
    }
  })
}
