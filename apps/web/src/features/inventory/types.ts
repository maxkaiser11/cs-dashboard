/** One row of GET /api/inventory/me (a Prisma InventoryItem serialized to JSON). */
export type InventoryItem = {
  id: number
  assetId: string
  marketHashName: string
  name: string | null
  type: string | null
  exterior: string | null
  priceCents: number | null
  priceSource: string | null
  currency: string
  /** Prisma Decimal → serialized as a string */
  floatValue: string | null
  paintSeed: number | null
  paintIndex: number | null
  phase: string | null
  iconUrl: string | null
  tradable: boolean
  marketable: boolean
  tradeProtected: boolean
  /** ISO date string */
  lastUpdated: string
}

/** GET /api/inventory/value */
export type InventoryValue = {
  itemCount: number
  totalCents: number
  total: string
  currency: string
}
