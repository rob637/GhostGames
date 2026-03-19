import { createContext, useContext, useState, useEffect } from 'react'

const PremiumContext = createContext(null)

const PREMIUM_KEY = 'ghost-games-premium'
const PRICE = '$1.99'
const PRICE_CENTS = 199

/**
 * PremiumProvider - Manages premium unlock state
 * 
 * For now, stores in localStorage. When Stripe is integrated,
 * this will verify purchases server-side.
 */
export function PremiumProvider({ children }) {
  const [isPremium, setIsPremiumState] = useState(() => {
    try {
      return localStorage.getItem(PREMIUM_KEY) === 'true'
    } catch {
      return false
    }
  })
  const [showUpgrade, setShowUpgrade] = useState(false)

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(PREMIUM_KEY, isPremium ? 'true' : 'false')
    } catch {
      // localStorage not available
    }
  }, [isPremium])

  const unlock = () => {
    setIsPremiumState(true)
    setShowUpgrade(false)
  }

  const value = {
    isPremium,
    price: PRICE,
    priceCents: PRICE_CENTS,
    showUpgrade,
    setShowUpgrade,
    unlock,
  }

  return (
    <PremiumContext.Provider value={value}>
      {children}
    </PremiumContext.Provider>
  )
}

export function usePremium() {
  const context = useContext(PremiumContext)
  if (!context) {
    throw new Error('usePremium must be used within PremiumProvider')
  }
  return context
}
