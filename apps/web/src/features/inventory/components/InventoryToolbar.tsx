import type { CategoryStat, InventoryFilters, SortKey } from '../itemDisplay'
import { SORT_OPTIONS } from '../itemDisplay'
import '../inventory.css'

type InventoryToolbarProps = {
  filters: InventoryFilters
  categories: CategoryStat[]
  totalCount: number
  onChange: (next: InventoryFilters) => void
}

export function InventoryToolbar({ filters, categories, totalCount, onChange }: InventoryToolbarProps) {
  const set = <K extends keyof InventoryFilters>(key: K, value: InventoryFilters[K]) =>
    onChange({ ...filters, [key]: value })

  return (
    <div className="toolbar">
      <div className="toolbar__row">
        <label className="toolbar__search">
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <circle cx="9" cy="9" r="6" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <path d="m13.5 13.5 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            placeholder="Search your items…"
            value={filters.search}
            onChange={(e) => set('search', e.target.value)}
            aria-label="Search items"
          />
        </label>

        <label className="toolbar__toggle">
          <input
            type="checkbox"
            checked={filters.tradableOnly}
            onChange={(e) => set('tradableOnly', e.target.checked)}
          />
          <span>Tradable only</span>
        </label>

        <label className="toolbar__sort">
          <span className="visually-hidden">Sort by</span>
          <select value={filters.sort} onChange={(e) => set('sort', e.target.value as SortKey)}>
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="toolbar__chips" role="group" aria-label="Filter by category">
        <button
          type="button"
          className={filters.category === null ? 'chip is-active' : 'chip'}
          aria-pressed={filters.category === null}
          onClick={() => set('category', null)}
        >
          All <span className="chip__count">{totalCount}</span>
        </button>
        {categories.map((c) => (
          <button
            key={c.type}
            type="button"
            className={filters.category === c.type ? 'chip is-active' : 'chip'}
            aria-pressed={filters.category === c.type}
            onClick={() => set('category', filters.category === c.type ? null : c.type)}
          >
            {c.type} <span className="chip__count">{c.count}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
