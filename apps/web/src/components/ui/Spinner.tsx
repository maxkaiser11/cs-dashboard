import './ui.css'

type SpinnerProps = {
  label?: string
  fullPage?: boolean
}

export function Spinner({ label = 'Loading…', fullPage = false }: SpinnerProps) {
  return (
    <div className={fullPage ? 'spinner spinner--page' : 'spinner'} role="status">
      <span className="spinner__ring" aria-hidden="true" />
      <span className="spinner__label">{label}</span>
    </div>
  )
}
