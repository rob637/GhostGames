import { useState, useEffect } from 'react'

export default function Timer({ deadline, onTimeout }) {
  const [timeLeft, setTimeLeft] = useState(15)

  useEffect(() => {
    if (!deadline) return

    const updateTimer = () => {
      const now = Date.now()
      const remaining = Math.max(0, Math.ceil((deadline - now) / 1000))
      setTimeLeft(remaining)

      if (remaining === 0 && onTimeout) {
        onTimeout()
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 100)
    return () => clearInterval(interval)
  }, [deadline, onTimeout])

  const isUrgent = timeLeft <= 5
  const progress = (timeLeft / 15) * 100

  return (
    <div className="flex items-center gap-3">
      <div className="relative w-12 h-12">
        <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            stroke="var(--bg-tertiary)"
            strokeWidth="3"
          />
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            stroke={isUrgent ? 'var(--danger)' : 'var(--accent)'}
            strokeWidth="3"
            strokeDasharray={`${progress} 100`}
            strokeLinecap="round"
            className="transition-all duration-100"
          />
        </svg>
        <span 
          className={`absolute inset-0 flex items-center justify-center font-mono font-bold
            ${isUrgent ? 'text-[var(--danger)]' : ''}`}
        >
          {timeLeft}
        </span>
      </div>
    </div>
  )
}
