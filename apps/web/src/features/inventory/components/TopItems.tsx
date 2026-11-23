import { Panel } from '../../../components/ui/Panel'
import { formatCents, formatPercent } from '../../../lib/format'
import { exteriorShort, parseItemName } from '../itemDisplay'
import type { InventoryItem } from '../types'
import '../inventory.css'

type TopItemsProps = {
  items: InventoryItem[]
  totalCents: number
  onSelectItem: (item: InventoryItem) => void
}

export function TopItems({ items, totalCents, onSelectItem }: TopItemsProps) {
  const topShare = items.reduce((sum, i) => sum + (i.priceCents ?? 0), 0) / Math.max(totalCents, 1)

  return (
    <Panel
      title="Top items"
      subtitle={`Your ${items.length} most valuable hold ${formatPercent(topShare)} of the total`}
      className="top-items"
    >
      <ol className="top-items__list">
        {items.map((item, index) => {
          const name = parseItemName(item)
          const share = totalCents > 0 ? (item.priceCents ?? 0) / totalCents : 0
          return (
            <li key={item.id}>
              <button type="button" className="top-items__row" onClick={() => onSelectItem(item)}>
                <span className="top-items__rank">{index + 1}</span>
                <span className="top-items__thumb">
                  {item.iconUrl && <img src={item.iconUrl} alt="" loading="lazy" />}
                </span>
                <span className="top-items__text">
                  <span className="top-items__name">
                    {name.isStar && '★ '}
                    {name.base}
                    {name.finish && <span className="top-items__finish"> | {name.finish}</span>}
                  </span>
                  <span className="top-items__meta">
                    {[exteriorShort(item.exterior), name.isStatTrak && 'StatTrak™', item.type]
                      .filter(Boolean)
                      .join(' · ')}
                  </span>
                </span>
                <span className="top-items__price">
                  {formatCents(item.priceCents, item.currency)}
                  <span className="top-items__share">{formatPercent(share)}</span>
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </Panel>
  )
}
