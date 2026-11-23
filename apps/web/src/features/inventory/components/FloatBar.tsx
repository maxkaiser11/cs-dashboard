import { WEAR_RANGES } from '../itemDisplay'
import '../inventory.css'

type FloatBarProps = {
  value: number
  showScale?: boolean
}

/** The 0–1 wear scale split into FN/MW/FT/WW/BS, with a marker at the item's float. */
export function FloatBar({ value, showScale = false }: FloatBarProps) {
  const clamped = Math.min(Math.max(value, 0), 1)

  return (
    <div className="float-bar" title={`Float ${value.toFixed(6)}`}>
      <div className="float-bar__track">
        {WEAR_RANGES.map((w) => (
          <span
            key={w.short}
            className={`float-bar__seg float-bar__seg--${w.short.toLowerCase()}`}
            style={{ width: `${(w.max - w.min) * 100}%` }}
          />
        ))}
        <span className="float-bar__marker" style={{ left: `${clamped * 100}%` }} />
      </div>
      {showScale && (
        <div className="float-bar__scale" aria-hidden="true">
          {WEAR_RANGES.map((w) => (
            <span key={w.short} style={{ width: `${(w.max - w.min) * 100}%` }}>
              {w.short}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
