import { useMemo, useRef, useState } from 'react'
import { useMe } from '../features/auth/useMe'
import { useMyInventory, useMyInventoryValue } from '../features/inventory/hooks'
import {
  applyFilters,
  groupByCategory,
  lastSyncedAt,
  topItemsByValue,
  type InventoryFilters,
} from '../features/inventory/itemDisplay'
import type { InventoryItem } from '../features/inventory/types'
import { StatTiles } from '../features/inventory/components/StatTiles'
import { ValueBreakdown } from '../features/inventory/components/ValueBreakdown'
import { TopItems } from '../features/inventory/components/TopItems'
import { InventoryToolbar } from '../features/inventory/components/InventoryToolbar'
import { ItemCard } from '../features/inventory/components/ItemCard'
import { ItemDetailDialog } from '../features/inventory/components/ItemDetailDialog'
import { formatCount, formatTimeAgo } from '../lib/format'
import './DashboardPage.css'

const DEFAULT_FILTERS: InventoryFilters = {
  search: '',
  category: null,
  sort: 'price-desc',
  tradableOnly: false,
}

export function DashboardPage() {
  const { data: user } = useMe()
  const inventory = useMyInventory()
  const value = useMyInventoryValue()

  const [filters, setFilters] = useState<InventoryFilters>(DEFAULT_FILTERS)
  const [selected, setSelected] = useState<InventoryItem | null>(null)
  const itemsSectionRef = useRef<HTMLElement>(null)

  const items = useMemo(() => inventory.data ?? [], [inventory.data])
  const categories = useMemo(() => groupByCategory(items), [items])
  const topItems = useMemo(() => topItemsByValue(items, 5), [items])
  const visibleItems = useMemo(() => applyFilters(items, filters), [items, filters])
  const syncedAt = useMemo(() => lastSyncedAt(items), [items])

  const firstName = user?.displayName ?? 'there'

  const selectCategoryFromChart = (type: string | null) => {
    setFilters((f) => ({ ...f, category: type }))
    if (type) itemsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const isLoading = inventory.isPending || value.isPending
  const error = inventory.error ?? value.error

  return (
    <main className="dashboard">
      <div className="dashboard__intro">
        <div>
          <h1 className="dashboard__title">Welcome back, {firstName}</h1>
          <p className="dashboard__subtitle">
            {syncedAt
              ? `Inventory synced ${formatTimeAgo(syncedAt)} · prices from the Steam market`
              : 'Your Counter-Strike 2 inventory at a glance'}
          </p>
        </div>
      </div>

      {error ? (
        <ErrorState
          message={error.message}
          onRetry={() => {
            void inventory.refetch()
            void value.refetch()
          }}
        />
      ) : isLoading ? (
        <DashboardSkeleton />
      ) : items.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <StatTiles
            value={value.data!}
            items={items}
            topItem={topItems[0]}
            categoryCount={categories.length}
          />

          <div className="dashboard__panels">
            <ValueBreakdown
              categories={categories}
              totalCents={value.data!.totalCents}
              currency={value.data!.currency}
              activeCategory={filters.category}
              onSelectCategory={selectCategoryFromChart}
            />
            <TopItems items={topItems} totalCents={value.data!.totalCents} onSelectItem={setSelected} />
          </div>

          <section className="dashboard__items" ref={itemsSectionRef}>
            <div className="dashboard__items-head">
              <h2 className="dashboard__section-title">Your items</h2>
              <span className="dashboard__count">
                {visibleItems.length === items.length
                  ? `${formatCount(items.length)} items`
                  : `${formatCount(visibleItems.length)} of ${formatCount(items.length)} items`}
              </span>
            </div>

            <InventoryToolbar
              filters={filters}
              categories={categories}
              totalCount={items.length}
              onChange={setFilters}
            />

            {visibleItems.length > 0 ? (
              <div className="item-grid">
                {visibleItems.map((item) => (
                  <ItemCard key={item.id} item={item} onSelect={setSelected} />
                ))}
              </div>
            ) : (
              <div className="dashboard__no-results">
                <p>No items match these filters.</p>
                <button type="button" className="btn" onClick={() => setFilters(DEFAULT_FILTERS)}>
                  Clear filters
                </button>
              </div>
            )}
          </section>
        </>
      )}

      <ItemDetailDialog
        item={selected}
        totalCents={value.data?.totalCents ?? 0}
        onClose={() => setSelected(null)}
      />
    </main>
  )
}

function DashboardSkeleton() {
  return (
    <div className="dashboard__skeleton" aria-busy="true" aria-label="Loading your inventory">
      <p className="dashboard__skeleton-note">
        Loading your inventory… the first visit fetches it from Steam, which can take a moment.
      </p>
      <div className="stat-tiles">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="skeleton" style={{ height: 110 }} />
        ))}
      </div>
      <div className="dashboard__panels">
        <div className="skeleton" style={{ height: 320 }} />
        <div className="skeleton" style={{ height: 320 }} />
      </div>
      <div className="item-grid">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="skeleton" style={{ height: 260 }} />
        ))}
      </div>
    </div>
  )
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="dashboard__state">
      <h2>Couldn't load your inventory</h2>
      <p>{message}</p>
      <button type="button" className="btn btn--primary" onClick={onRetry}>
        Try again
      </button>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="dashboard__state">
      <h2>No items yet</h2>
      <p>
        We couldn't find any CS2 items in your Steam inventory. Make sure your inventory is set to
        public in your Steam privacy settings.
      </p>
    </div>
  )
}
