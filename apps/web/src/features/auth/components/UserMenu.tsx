import type { User } from '../api'
import { LOGOUT_URL } from '../api'
import './UserMenu.css'

export function UserMenu({ user }: { user: User }) {
  const name = user.displayName ?? 'Steam user'

  return (
    <div className="user-menu">
      {user.avatar ? (
        <img className="user-menu__avatar" src={user.avatar} alt="" width={32} height={32} />
      ) : (
        <span className="user-menu__avatar user-menu__avatar--fallback" aria-hidden="true">
          {name.charAt(0).toUpperCase()}
        </span>
      )}
      <span className="user-menu__name">{name}</span>
      <a className="user-menu__logout" href={LOGOUT_URL}>
        Log out
      </a>
    </div>
  )
}
