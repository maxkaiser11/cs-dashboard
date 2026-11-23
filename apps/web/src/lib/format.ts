const currencyFormatters = new Map<string, Intl.NumberFormat>()

export function formatCents(cents: number | null | undefined, currency = 'USD'): string {
  if (cents == null) return '–'
  let fmt = currencyFormatters.get(currency)
  if (!fmt) {
    fmt = new Intl.NumberFormat('en-US', { style: 'currency', currency })
    currencyFormatters.set(currency, fmt)
  }
  return fmt.format(cents / 100)
}

const percentFormatter = new Intl.NumberFormat('en-US', {
  style: 'percent',
  maximumFractionDigits: 1,
})

/** `share` is a 0–1 fraction. */
export function formatPercent(share: number): string {
  return percentFormatter.format(share)
}

const countFormatter = new Intl.NumberFormat('en-US')

export function formatCount(n: number): string {
  return countFormatter.format(n)
}

const relativeFormatter = new Intl.RelativeTimeFormat('en-US', { numeric: 'auto' })

export function formatTimeAgo(iso: string, now = Date.now()): string {
  const seconds = Math.round((new Date(iso).getTime() - now) / 1000)
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ['year', 60 * 60 * 24 * 365],
    ['month', 60 * 60 * 24 * 30],
    ['day', 60 * 60 * 24],
    ['hour', 60 * 60],
    ['minute', 60],
  ]
  for (const [unit, size] of units) {
    if (Math.abs(seconds) >= size) return relativeFormatter.format(Math.round(seconds / size), unit)
  }
  return 'just now'
}
