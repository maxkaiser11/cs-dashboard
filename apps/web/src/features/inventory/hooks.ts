import { useQuery } from '@tanstack/react-query'
import { getMyInventory, getMyInventoryValue } from './api'

export function useMyInventory() {
  return useQuery({ queryKey: ['inventory', 'me'], queryFn: getMyInventory })
}

export function useMyInventoryValue() {
  return useQuery({ queryKey: ['inventory', 'me', 'value'], queryFn: getMyInventoryValue })
}
