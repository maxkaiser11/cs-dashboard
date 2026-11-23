import { apiGet } from '../../lib/apiClient'
import type { InventoryItem, InventoryValue } from './types'

export const getMyInventory = () => apiGet<InventoryItem[]>('/api/inventory/me')

export const getMyInventoryValue = () => apiGet<InventoryValue>('/api/inventory/value')
