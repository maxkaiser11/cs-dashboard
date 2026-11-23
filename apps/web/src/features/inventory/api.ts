import { apiGet, apiPost } from '../../lib/apiClient'
import type { InventoryItem, InventoryValue, SyncResult } from './types'

export const getMyInventory = () => apiGet<InventoryItem[]>('/api/inventory/me')

export const getMyInventoryValue = () => apiGet<InventoryValue>('/api/inventory/value')

/** Throws ApiError 429 with `body.retryAfter` (seconds) while on cooldown. */
export const syncMyInventory = () => apiPost<SyncResult>('/api/inventory/sync')
