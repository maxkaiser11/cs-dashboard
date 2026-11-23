import { useEffect, useRef } from 'react'
import { formatCents, formatTimeAgo } from '../../../lib/format'
import { parseFloatValue, parseItemName, steamMarketUrl } from '../itemDisplay'
import type { InventoryItem } from '../types'
import { FloatBar } from './FloatBar'
import { ItemBadges } from './ItemBadges'
import '../inventory.css'

type ItemDetailDialogProps = {
  item: InventoryItem | null
  totalCents: number
  onClose: () => void
}

export function ItemDetailDialog({ item, totalCents, onClose }: ItemDetailDialogProps) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (item && !dialog.open) dialog.showModal()
    if (!item && dialog.open) dialog.close()
  }, [item])

  const name = item ? parseItemName(item) : null
  const float = item ? parseFloatValue(item) : null

  return (
    <dialog
      ref={ref}
      className="item-dialog"
      onClose={onClose}
      // Clicking the backdrop (the dialog element itself) closes it.
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      {item && name && (
        <div className="item-dialog__content">
          <button type="button" className="item-dialog__close" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>

          <div className="item-dialog__media">
            <ItemBadges item={item} name={name} />
            {item.iconUrl && <img src={item.iconUrl} alt="" />}
          </div>

          <div className="item-dialog__info">
            <span className="item-dialog__type">{item.type ?? 'Item'}</span>
            <h2 className="item-dialog__title">
              {name.isStar && '★ '}
              {name.base}
              {name.finish && <span className="item-dialog__finish"> | {name.finish}</span>}
            </h2>

            <div className="item-dialog__price-row">
              <span className="item-dialog__price">{formatCents(item.priceCents, item.currency)}</span>
              {item.priceCents != null && totalCents > 0 && (
                <span className="item-dialog__share">
                  {((item.priceCents / totalCents) * 100).toFixed(1)}% of your inventory
                </span>
              )}
            </div>

            {float != null && (
              <div className="item-dialog__float">
                <div className="item-dialog__float-head">
                  <span>Float</span>
                  <span className="item-dialog__mono">{float.toFixed(8)}</span>
                </div>
                <FloatBar value={float} showScale />
              </div>
            )}

            <dl className="item-dialog__facts">
              <Fact label="Exterior" value={item.exterior} />
              <Fact label="Pattern seed" value={item.paintSeed} mono />
              <Fact label="Paint index" value={item.paintIndex} mono />
              <Fact label="Phase" value={item.phase} />
              <Fact
                label="Trade status"
                value={
                  item.tradeProtected
                    ? 'Trade protected'
                    : item.tradable
                      ? 'Tradable'
                      : 'Not tradable yet'
                }
              />
              <Fact label="Marketable" value={item.marketable ? 'Yes' : 'No'} />
              <Fact label="Price source" value={item.priceSource} />
              <Fact label="Last updated" value={formatTimeAgo(item.lastUpdated)} />
            </dl>

            <a className="btn btn--primary" href={steamMarketUrl(item)} target="_blank" rel="noreferrer">
              View on Steam Market
              <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                <path
                  d="M6 3h7v7M13 3 4 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>
      )}
    </dialog>
  )
}

function Fact({ label, value, mono }: { label: string; value: string | number | null; mono?: boolean }) {
  if (value == null || value === '') return null
  return (
    <div className="item-dialog__fact">
      <dt>{label}</dt>
      <dd className={mono ? 'item-dialog__mono' : undefined}>{value}</dd>
    </div>
  )
}
