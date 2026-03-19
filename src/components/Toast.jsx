import { useState, useEffect, useCallback } from 'react'

// Global toast state
let toastListeners = []
let toastId = 0

// Public API to show toasts
export function showToast(message, type = 'error', duration = 4000) {
  const id = ++toastId
  toastListeners.forEach(listener => listener({ id, message, type, duration }))
  return id
}

// Toast container component - add this once at app root
export function ToastContainer() {
  const [toasts, setToasts] = useState([])
  
  useEffect(() => {
    const handleToast = (toast) => {
      setToasts(prev => [...prev, toast])
      
      // Auto-dismiss
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== toast.id))
      }, toast.duration)
    }
    
    toastListeners.push(handleToast)
    return () => {
      toastListeners = toastListeners.filter(l => l !== handleToast)
    }
  }, [])
  
  const dismiss = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])
  
  if (toasts.length === 0) return null
  
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-full max-w-sm px-4">
      {toasts.map(toast => (
        <div
          key={toast.id}
          onClick={() => dismiss(toast.id)}
          className={`
            px-4 py-3 rounded-xl shadow-lg cursor-pointer
            animate-slide-up
            ${toast.type === 'error' 
              ? 'bg-[var(--error)] text-white' 
              : toast.type === 'success'
              ? 'bg-[var(--success)] text-white'
              : 'bg-[var(--card-bg)] text-[var(--text)]'
            }
          `}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">
              {toast.type === 'error' ? '⚠️' : toast.type === 'success' ? '✓' : 'ℹ️'}
            </span>
            <span className="flex-1 text-sm font-medium">{toast.message}</span>
            <span className="opacity-60 text-xs">tap to dismiss</span>
          </div>
        </div>
      ))}
    </div>
  )
}
