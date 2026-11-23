export class ApiError extends Error {
  readonly status: number
  /** Parsed JSON error body, when there was one (e.g. `{ error, retryAfter }`). */
  readonly body: Record<string, unknown> | null

  constructor(status: number, message: string, body: Record<string, unknown> | null = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

/**
 * Call a JSON endpoint on our own backend. In dev, Vite proxies /api and /auth
 * to Express, so the session cookie is sent automatically (same origin).
 */
async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    credentials: 'same-origin',
    headers: { Accept: 'application/json' },
    ...init,
  })

  if (!res.ok) {
    let message = res.statusText || `Request failed (${res.status})`
    let body: Record<string, unknown> | null = null
    try {
      body = (await res.json()) as Record<string, unknown>
      if (typeof body.error === 'string') message = body.error
    } catch {
      // body wasn't JSON; keep the status text
    }
    throw new ApiError(res.status, message, body)
  }

  return (await res.json()) as T
}

export const apiGet = <T>(path: string) => apiRequest<T>(path)

export const apiPost = <T>(path: string) => apiRequest<T>(path, { method: 'POST' })
