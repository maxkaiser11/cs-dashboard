import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getMyInventory, getMyInventoryValue, syncMyInventory } from './api'

export function useMyInventory() {
  return useQuery({ queryKey: ['inventory', 'me'], queryFn: getMyInventory })
}

export function useMyInventoryValue() {
  return useQuery({ queryKey: ['inventory', 'me', 'value'], queryFn: getMyInventoryValue })
}

/**
 * POST /api/inventory/sync. Afterwards (success or 429) every ['inventory', …] query
 * is refetched, so items, value and the cooldown timestamp are all up to date.
 */
export function useSyncInventory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: syncMyInventory,
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['inventory'] }),
  })
}
