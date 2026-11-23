import './LoginButton.css'

// Full-page navigation (not fetch): Steam OpenID needs a real browser redirect.
// In dev, Vite proxies /auth to the Express server.
const STEAM_LOGIN_URL = '/auth/steam'

type LoginButtonProps = {
  size?: 'default' | 'large'
}

export function LoginButton({ size = 'default' }: LoginButtonProps) {
  const className = size === 'large' ? 'login-button login-button--large' : 'login-button'

  return (
    <a className={className} href={STEAM_LOGIN_URL}>
      <svg
        className="login-button__icon"
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
      >
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="15.5" cy="9" r="2.6" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="8.5" cy="15" r="2" fill="currentColor" />
        <path d="M8.5 15 L15.5 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      <span>Login with Steam</span>
    </a>
  )
}
