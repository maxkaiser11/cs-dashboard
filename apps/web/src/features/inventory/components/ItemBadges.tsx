import type { ParsedItemName } from '../itemDisplay'
import type { InventoryItem } from '../types'
import '../inventory.css'

export function ItemBadges({ item, name }: { item: InventoryItem; name: ParsedItemName }) {
  const locked = !item.tradable || item.tradeProtected

  if (!name.isStatTrak && !name.isSouvenir && !locked && !item.phase) return null

  return (
    <div className="item-badges">
      {name.isStatTrak && <span className="item-badge item-badge--stattrak">StatTrak™</span>}
      {name.isSouvenir && <span className="item-badge item-badge--souvenir">Souvenir</span>}
      {item.phase && <span className="item-badge">{item.phase}</span>}
      {locked && (
        <span className="item-badge item-badge--locked" title="Trade protected or not tradable yet">
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path
              d="M4.5 7V5a3.5 3.5 0 0 1 7 0v2M3.5 7h9v6.5h-9z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
          Locked
        </span>
      )}
    </div>
  )
}
