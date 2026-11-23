import { useEffect } from 'react'
import './ui.css'

export type ToastMessage = {
  id: number
  kind: 'success' | 'error'
  text: string
}

type ToastProps = {
  toast: ToastMessage | null
  onDismiss: () => void
  durationMs?: number
}

/** A single bottom-right toast that hides itself after `durationMs`. */
export function Toast({ toast, onDismiss, durationMs = 5000 }: ToastProps) {
  useEffect(() => {
    if (!toast) return
    const id = window.setTimeout(onDismiss, durationMs)
    return () => window.clearTimeout(id)
  }, [toast, onDismiss, durationMs])

  return (
    <div className="toast-region" role="status" aria-live="polite">
      {toast && (
        <div key={toast.id} className={`toast toast--${toast.kind}`}>
          <span className="toast__icon" aria-hidden="true">
            {toast.kind === 'success' ? '✓' : '!'}
          </span>
          <span className="toast__text">{toast.text}</span>
          <button type="button" className="toast__close" onClick={onDismiss} aria-label="Dismiss">
            ×
          </button>
        </div>
      )}
    </div>
  )
}
