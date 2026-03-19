import { usePremium } from '../contexts/PremiumContext'

/**
 * UpgradeModal - Shows when user tries to access premium content
 * 
 * Clean, simple modal with clear value prop and single CTA.
 * Stripe integration will replace the test unlock button.
 */
export default function UpgradeModal() {
  const { showUpgrade, setShowUpgrade, price, unlock, isPremium } = usePremium()

  if (!showUpgrade || isPremium) return null

  const handlePurchase = async () => {
    // TODO: Replace with Stripe checkout
    // For now, just unlock for testing
    unlock()
  }

  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={() => setShowUpgrade(false)}
    >
      <div 
        className="card max-w-sm w-full text-center animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Icon */}
        <div className="text-5xl mb-4">👻✨</div>
        
        {/* Title */}
        <h2 className="text-2xl font-bold mb-2">Unlock All Games</h2>
        
        {/* Value prop */}
        <p className="text-secondary mb-6">
          Get access to 10+ premium party games. One purchase, unlimited fun!
        </p>

        {/* What's included */}
        <div className="bg-surface rounded-xl p-4 mb-6 text-left">
          <div className="text-sm font-medium mb-2 text-secondary">Includes:</div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>🎨 Quick Draw</div>
            <div>📖 Story Chain</div>
            <div>🧠 Trivia</div>
            <div>🃏 Bluff Battle</div>
            <div>🔮 Prediction</div>
            <div>📸 Caption This</div>
            <div>💭 Word Association</div>
            <div>🏆 Ranked Choice</div>
            <div>👻 Ghost Says</div>
            <div>+ more coming!</div>
          </div>
        </div>

        {/* Price + CTA */}
        <button 
          className="btn-primary w-full text-lg py-4 mb-3"
          onClick={handlePurchase}
        >
          Unlock for {price}
        </button>

        {/* Cancel */}
        <button 
          className="text-secondary text-sm hover:text-primary transition-colors"
          onClick={() => setShowUpgrade(false)}
        >
          Maybe later
        </button>

        {/* Fine print */}
        <p className="text-xs text-secondary mt-4 opacity-70">
          One-time purchase. No subscription.
        </p>
      </div>
    </div>
  )
}
