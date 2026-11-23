import { Panel } from '../../../components/ui/Panel'
import { formatCents, formatPercent } from '../../../lib/format'
import type { CategoryStat } from '../itemDisplay'
import '../inventory.css'

type ValueBreakdownProps = {
  categories: CategoryStat[]
  totalCents: number
  currency: string
  activeCategory: string | null
  onSelectCategory: (type: string | null) => void
}

/**
 * Ranked horizontal bars: value per item category. Single series, so one hue.
 * Each row is a button that filters the item grid below.
 */
export function ValueBreakdown({
  categories,
  totalCents,
  currency,
  activeCategory,
  onSelectCategory,
}: ValueBreakdownProps) {
  const max = Math.max(1, ...categories.map((c) => c.valueCents))

  return (
    <Panel
      title="Where your value sits"
      subtitle="Value by category · click a row to filter your items"
      className="breakdown"
    >
      <ul className="breakdown__list">
        {categories.map((c) => {
          const share = totalCents > 0 ? c.valueCents / totalCents : 0
          const isActive = activeCategory === c.type
          return (
            <li key={c.type}>
              <button
                type="button"
                className={isActive ? 'breakdown__row is-active' : 'breakdown__row'}
                aria-pressed={isActive}
                onClick={() => onSelectCategory(isActive ? null : c.type)}
              >
                <span className="breakdown__label">{c.type}</span>
                <span className="breakdown__track" aria-hidden="true">
                  <span
                    className="breakdown__bar"
                    style={{ width: `${Math.max((c.valueCents / max) * 100, c.valueCents > 0 ? 1.5 : 0)}%` }}
                  />
                </span>
                <span className="breakdown__value">{formatCents(c.valueCents, currency)}</span>
                <span className="breakdown__tooltip" role="tooltip">
                  <strong>{c.type}</strong>
                  <span>
                    {c.count} {c.count === 1 ? 'item' : 'items'} · {formatPercent(share)} of total
                  </span>
                  <span>avg {formatCents(Math.round(c.valueCents / c.count), currency)} per item</span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </Panel>
  )
}
