import { ApiError, apiGet } from '../../lib/apiClient'

export type User = {
  id: number
  steamId: string
  displayName: string | null
  avatar: string | null
  createdAt: string
}

// These are full-page navigations, not fetches (Steam OpenID needs a real redirect).
export const LOGIN_URL = '/auth/steam'
export const LOGOUT_URL = '/auth/logout'

/** Returns the logged-in user, or null when there is no session. */
export async function getMe(): Promise<User | null> {
  try {
    return await apiGet<User>('/auth/me')
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) return null
    throw err
  }
}
