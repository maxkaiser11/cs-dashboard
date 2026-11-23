import { formatCents, formatCount, formatPercent } from '../../../lib/format'
import { parseItemName } from '../itemDisplay'
import type { InventoryItem, InventoryValue } from '../types'
import '../inventory.css'

type StatTilesProps = {
  value: InventoryValue
  items: InventoryItem[]
  topItem: InventoryItem | undefined
  categoryCount: number
}

export function StatTiles({ value, items, topItem, categoryCount }: StatTilesProps) {
  const tradableNow = items.filter((i) => i.tradable && !i.tradeProtected).length
  const locked = items.length - tradableNow
  const topShare =
    topItem?.priceCents != null && value.totalCents > 0 ? topItem.priceCents / value.totalCents : 0
  const topName = topItem ? parseItemName(topItem) : null

  return (
    <div className="stat-tiles">
      <div className="stat-tile stat-tile--hero">
        <span className="stat-tile__label">Total inventory value</span>
        <span className="stat-tile__value stat-tile__value--hero">
          {formatCents(value.totalCents, value.currency)}
        </span>
        <span className="stat-tile__meta">Based on latest Steam market prices</span>
      </div>

      <div className="stat-tile">
        <span className="stat-tile__label">Items</span>
        <span className="stat-tile__value">{formatCount(value.itemCount)}</span>
        <span className="stat-tile__meta">
          across {categoryCount} {categoryCount === 1 ? 'category' : 'categories'}
        </span>
      </div>

      <div className="stat-tile">
        <span className="stat-tile__label">Most valuable</span>
        {topItem && topName ? (
          <>
            <span className="stat-tile__value">{formatCents(topItem.priceCents, topItem.currency)}</span>
            <span className="stat-tile__meta stat-tile__meta--truncate" title={topItem.name ?? ''}>
              {topName.base}
              {topName.finish ? ` | ${topName.finish}` : ''} · {formatPercent(topShare)} of total
            </span>
          </>
        ) : (
          <span className="stat-tile__value">–</span>
        )}
      </div>

      <div className="stat-tile">
        <span className="stat-tile__label">Tradable now</span>
        <span className="stat-tile__value">
          {formatCount(tradableNow)}
          <span className="stat-tile__of"> / {formatCount(items.length)}</span>
        </span>
        <span className="stat-tile__meta">
          {locked > 0 ? `${locked} trade protected or locked` : 'Nothing trade locked'}
        </span>
      </div>
    </div>
  )
}
