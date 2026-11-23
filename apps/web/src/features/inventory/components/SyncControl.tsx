import { useCallback, useState } from 'react'
import { ApiError } from '../../../lib/apiClient'
import { formatTimeAgo } from '../../../lib/format'
import { useNow } from '../../../lib/useNow'
import { Toast, type ToastMessage } from '../../../components/ui/Toast'
import { useSyncInventory } from '../hooks'
import type { SyncResult } from '../types'
import '../inventory.css'

type SyncControlProps = {
  syncedAt: string | null
  nextSyncAvailableAt: string | null
}

function formatCountdown(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000))
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

function describeResult(r: SyncResult): string {
  const changes = [r.added > 0 && `${r.added} new`, r.removed > 0 && `${r.removed} removed`].filter(Boolean)
  return changes.length > 0
    ? `Inventory synced · ${changes.join(', ')} · prices updated`
    : 'Inventory synced · no new or removed items, prices updated'
}

/** "Synced 3 minutes ago" + Refresh button with a cooldown countdown. */
export function SyncControl({ syncedAt, nextSyncAvailableAt }: SyncControlProps) {
  const sync = useSyncInventory()
  const [toast, setToast] = useState<ToastMessage | null>(null)
  // From a 429's retryAfter, in case the server's cooldown is ahead of our cached value.
  const [cooldownOverride, setCooldownOverride] = useState<number | null>(null)

  const serverCooldownUntil = nextSyncAvailableAt ? new Date(nextSyncAvailableAt).getTime() : 0
  const cooldownUntil = Math.max(serverCooldownUntil, cooldownOverride ?? 0)

  // Ticks every second: drives the countdown and keeps "Synced x ago" fresh.
  const now = useNow(1000)
  const remainingMs = cooldownUntil - now
  const onCooldown = remainingMs > 0
  const isSyncing = sync.isPending

  const dismissToast = useCallback(() => setToast(null), [])

  const handleClick = () => {
    sync.mutate(undefined, {
      onSuccess: (result) => {
        setCooldownOverride(null)
        setToast({ id: Date.now(), kind: 'success', text: describeResult(result) })
      },
      onError: (err) => {
        if (err instanceof ApiError && err.status === 429) {
          const retryAfter = Number(err.body?.retryAfter ?? 0)
          if (retryAfter > 0) setCooldownOverride(Date.now() + retryAfter * 1000)
          setToast({ id: Date.now(), kind: 'error', text: 'Synced recently, please wait a few minutes' })
          return
        }
        setToast({ id: Date.now(), kind: 'error', text: `Sync failed: ${err.message}` })
      },
    })
  }

  let label = 'Refresh'
  if (isSyncing) label = 'Syncing…'
  else if (onCooldown) label = `Refresh in ${formatCountdown(remainingMs)}`

  return (
    <div className="sync-control">
      <span className="sync-control__status">
        {isSyncing
          ? 'Fetching your inventory from Steam…'
          : syncedAt
            ? `Synced ${formatTimeAgo(syncedAt, now)}`
            : 'Not synced yet'}
      </span>
      <button
        type="button"
        className="btn sync-control__button"
        onClick={handleClick}
        disabled={isSyncing || onCooldown}
        title={onCooldown ? 'You can refresh once every 5 minutes' : 'Fetch the latest inventory and prices from Steam'}
      >
        <svg
          className={isSyncing ? 'sync-control__icon is-spinning' : 'sync-control__icon'}
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path
            d="M16.5 10a6.5 6.5 0 1 1-1.9-4.6M16.5 3.5v3.8h-3.8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="sync-control__label">{label}</span>
      </button>
      <Toast toast={toast} onDismiss={dismissToast} />
    </div>
  )
}
