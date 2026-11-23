export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

/**
 * GET a JSON endpoint on our own backend. In dev, Vite proxies /api and /auth
 * to Express, so the session cookie is sent automatically (same origin).
 */
export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    credentials: 'same-origin',
    headers: { Accept: 'application/json' },
    ...init,
  })

  if (!res.ok) {
    let message = res.statusText || `Request failed (${res.status})`
    try {
      const body = (await res.json()) as { error?: string }
      if (body.error) message = body.error
    } catch {
      // body wasn't JSON; keep the status text
    }
    throw new ApiError(res.status, message)
  }

  return (await res.json()) as T
}
