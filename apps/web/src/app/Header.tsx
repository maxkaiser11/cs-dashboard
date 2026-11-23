import { Link, NavLink } from 'react-router'
import { LoginButton } from '../features/auth/components/LoginButton'
import { UserMenu } from '../features/auth/components/UserMenu'
import { useMe } from '../features/auth/useMe'
import './Header.css'

export function Header() {
  const { data: user, isPending } = useMe()

  return (
    <header className="header">
      <div className="header__inner">
        <div className="header__left">
          <Link className="header__brand" to="/">
            <span className="header__logo" aria-hidden="true">
              CS
            </span>
            <span className="header__name">Dashboard</span>
          </Link>
          {user && (
            <nav className="header__nav">
              <NavLink to="/dashboard" className="header__link">
                Inventory
              </NavLink>
            </nav>
          )}
        </div>

        {/* Reserve space while the session check runs so the header doesn't jump. */}
        {isPending ? (
          <span className="header__placeholder" />
        ) : user ? (
          <UserMenu user={user} />
        ) : (
          <LoginButton />
        )}
      </div>
    </header>
  )
}
