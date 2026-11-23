import { Navigate, Outlet } from 'react-router'
import { useMe } from '../useMe'
import { Spinner } from '../../../components/ui/Spinner'

/** Route guard: renders child routes only when there is a Steam session. */
export function RequireAuth() {
  const { data: user, isPending, isError } = useMe()

  if (isPending) return <Spinner label="Checking your session…" fullPage />
  if (isError || !user) return <Navigate to="/" replace />

  return <Outlet />
}
