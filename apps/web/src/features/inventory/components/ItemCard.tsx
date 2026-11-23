import { formatCents } from '../../../lib/format'
import { exteriorShort, parseFloatValue, parseItemName } from '../itemDisplay'
import type { InventoryItem } from '../types'
import { FloatBar } from './FloatBar'
import { ItemBadges } from './ItemBadges'
import '../inventory.css'

type ItemCardProps = {
  item: InventoryItem
  onSelect: (item: InventoryItem) => void
}

export function ItemCard({ item, onSelect }: ItemCardProps) {
  const name = parseItemName(item)
  const float = parseFloatValue(item)
  const wear = exteriorShort(item.exterior)

  return (
    <button type="button" className="item-card" onClick={() => onSelect(item)}>
      <div className="item-card__media">
        <ItemBadges item={item} name={name} />
        {item.iconUrl ? (
          <img className="item-card__img" src={item.iconUrl} alt="" loading="lazy" />
        ) : (
          <span className="item-card__img item-card__img--empty" />
        )}
      </div>

      <div className="item-card__body">
        <span className="item-card__type">
          {item.type ?? 'Item'}
          {wear && <span className="item-card__wear">{wear}</span>}
        </span>
        <span className="item-card__base">
          {name.isStar && <span className="item-card__star">★ </span>}
          {name.base}
        </span>
        <span className="item-card__finish">{name.finish ?? ' '}</span>

        <div className="item-card__float">
          {float != null ? (
            <>
              <FloatBar value={float} />
              <span className="item-card__float-value">{float.toFixed(4)}</span>
            </>
          ) : (
            <span className="item-card__float-none">No float</span>
          )}
        </div>

        <span className="item-card__price">{formatCents(item.priceCents, item.currency)}</span>
      </div>
    </button>
  )
}
