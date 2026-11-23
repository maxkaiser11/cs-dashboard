import { Link } from 'react-router'
import { LoginButton } from '../features/auth/components/LoginButton'
import { useMe } from '../features/auth/useMe'
import './HomePage.css'

const FEATURES = [
  {
    title: 'Your whole inventory',
    body: 'Every skin, knife, glove and sticker, synced from Steam with wear, float and pattern.',
    icon: (
      <path d="M4 5h7v7H4zM13 5h7v7h-7zM4 14h7v5H4zM13 14h7v5h-7z" />
    ),
  },
  {
    title: 'Live market value',
    body: 'See what your items are worth right now and which ones carry your total.',
    icon: <path d="M4 18 9 12l4 3 7-9M15 6h5v5" />,
  },
  {
    title: 'Value over time',
    body: 'Snapshots of your total value so you can see how your investment has moved.',
    icon: <path d="M4 4v16h16M8 15l3-4 3 2 4-6" />,
  },
]

// Decorative sample data for the hero preview card (not real user data).
const PREVIEW_POINTS = [32, 38, 35, 44, 41, 52, 49, 58, 63, 60, 71, 78]

function sparklinePath(points: number[], width: number, height: number) {
  const max = Math.max(...points)
  const min = Math.min(...points)
  const stepX = width / (points.length - 1)
  return points
    .map((p, i) => {
      const x = i * stepX
      const y = height - ((p - min) / (max - min)) * height
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
}

export function HomePage() {
  const line = sparklinePath(PREVIEW_POINTS, 300, 90)
  const { data: user } = useMe()

  return (
    <main className="home">
      <section className="hero">
        <div className="hero__copy">
          <span className="hero__eyebrow">Counter-Strike 2 inventory tracker</span>
          <h1 className="hero__title">
            Know what your <span className="hero__accent">inventory</span> is worth.
          </h1>
          <p className="hero__lead">
            Sign in with Steam and get a clear dashboard of your CS2 items, their prices and
            how your total value changes over time.
          </p>
          <div className="hero__actions">
            {user ? (
              <Link className="login-button login-button--large" to="/dashboard">
                Open your dashboard
              </Link>
            ) : (
              <LoginButton size="large" />
            )}
            <a className="hero__secondary" href="#features">
              See what's inside
            </a>
          </div>
        </div>

        <div className="preview" aria-hidden="true">
          <div className="preview__head">
            <span className="preview__label">Inventory value</span>
            <span className="preview__badge">+12.4%</span>
          </div>
          <div className="preview__value">$1,284.50</div>
          <svg className="preview__chart" viewBox="0 0 300 90" preserveAspectRatio="none">
            <path d={`${line} L300,90 L0,90 Z`} className="preview__area" />
            <path d={line} className="preview__line" />
          </svg>
          <ul className="preview__items">
            <li>
              <span className="preview__dot preview__dot--covert" />
              <span className="preview__item-name">AK-47 | Redline</span>
              <span className="preview__item-price">$42.10</span>
            </li>
            <li>
              <span className="preview__dot preview__dot--classified" />
              <span className="preview__item-name">AWP | Atheris</span>
              <span className="preview__item-price">$8.75</span>
            </li>
            <li>
              <span className="preview__dot preview__dot--restricted" />
              <span className="preview__item-name">Glock-18 | Vogue</span>
              <span className="preview__item-price">$3.20</span>
            </li>
          </ul>
        </div>
      </section>

      <section id="features" className="features">
        {FEATURES.map((f) => (
          <article key={f.title} className="feature">
            <svg
              className="feature__icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {f.icon}
            </svg>
            <h2 className="feature__title">{f.title}</h2>
            <p className="feature__body">{f.body}</p>
          </article>
        ))}
      </section>

      <footer className="footer">
        <span>CS Dashboard</span>
        <span className="footer__note">Not affiliated with Valve or Steam.</span>
      </footer>
    </main>
  )
}
