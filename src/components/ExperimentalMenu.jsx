import { useState, useEffect } from 'react'
import { useExperimental } from '../contexts/ExperimentalContext'

/**
 * ExperimentalMenu - Secret settings panel for experimental features
 * 
 * Accessed by clicking the "O" in Ghost 5 times on the home page.
 * Shows toggle for experimental mode and preview of upcoming features.
 */
export default function ExperimentalMenu({ isOpen, onClose }) {
  const { isExperimental, toggleExperimental } = useExperimental()
  const [showConfetti, setShowConfetti] = useState(false)

  // Show confetti when first opened or when enabling
  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true)
      const timer = setTimeout(() => setShowConfetti(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      {/* Menu */}
      <div className="relative bg-[var(--bg-secondary)] rounded-2xl max-w-md w-full p-6 animate-slide-up shadow-2xl border border-white/10">
        {/* Confetti effect */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  backgroundColor: ['#ff6b6b', '#4ecdc4', '#ffe66d', '#95e1d3', '#f38181'][i % 5],
                  animationDelay: `${Math.random() * 0.5}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🔬</div>
          <h2 className="text-xl font-bold">Secret Lab</h2>
          <p className="text-sm text-[var(--text-muted)]">
            You found it! Experimental features await.
          </p>
        </div>

        {/* Experimental Mode Toggle */}
        <div className="bg-white/5 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Experimental Mode</h3>
              <p className="text-sm text-[var(--text-muted)]">
                {isExperimental 
                  ? 'New games and features unlocked!'
                  : 'Enable to see upcoming games'}
              </p>
            </div>
            <button
              onClick={toggleExperimental}
              className={`relative w-14 h-8 rounded-full transition-all duration-300 ${
                isExperimental 
                  ? 'bg-[var(--success)]' 
                  : 'bg-white/20'
              }`}
            >
              <div 
                className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all duration-300 ${
                  isExperimental ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* What's New */}
        {isExperimental && (
          <div className="space-y-3 mb-6 animate-fade-in">
            <h4 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wide">
              What's New
            </h4>
            
            <div className="space-y-2">
              <FeatureItem emoji="👤" title="Solo Games" description="Play against Ghost" />
              <FeatureItem emoji="🎉" title="Party Mode" description="3-8 player games" />
              <FeatureItem emoji="🎭" title="Imposter Artist" description="Find the fake" />
              <FeatureItem emoji="🔮" title="Mind Meld" description="Think as one" />
              <FeatureItem emoji="📸" title="Photo Race" description="Camera challenges" />
            </div>
          </div>
        )}

        {/* Warning */}
        <div className="bg-[var(--warning)]/10 rounded-lg p-3 mb-4 text-sm">
          <span className="mr-2">⚠️</span>
          Experimental features may be buggy or change without notice.
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="btn btn-secondary w-full"
        >
          {isExperimental ? 'Start Experimenting' : 'Maybe Later'}
        </button>
      </div>
    </div>
  )
}

function FeatureItem({ emoji, title, description }) {
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
      <span className="text-xl">{emoji}</span>
      <div>
        <p className="font-medium text-sm">{title}</p>
        <p className="text-xs text-[var(--text-muted)]">{description}</p>
      </div>
    </div>
  )
}
