import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { httpsCallable } from 'firebase/functions'
import { functions } from '../services/firebase'

const PremiumContext = createContext(null)

const PREMIUM_KEY = 'ghost-games-premium'
const PRICE = '$1.99'

/**
 * PremiumProvider - Manages premium unlock state
 * 
 * Uses Stripe for payments, stores unlock in localStorage.
 * Verifies purchases via Cloud Function on success redirect.
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
  const [isLoading, setIsLoading] = useState(false)

  // Define verifyPurchase with useCallback so it can be used in useEffect
  const verifyPurchase = useCallback(async (sessionId) => {
    try {
      const verifyFn = httpsCallable(functions, 'verifyPurchase')
      const result = await verifyFn({ sessionId })
      
      if (result.data.success) {
        setIsPremiumState(true)
      }
    } catch (error) {
      console.error('Failed to verify purchase:', error)
    }
  }, [])

  // Check for success redirect on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const premiumStatus = params.get('premium')
    const sessionId = params.get('session_id')

    if (premiumStatus === 'success' && sessionId) {
      // Verify the purchase
      verifyPurchase(sessionId)
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname)
    } else if (premiumStatus === 'cancelled') {
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [verifyPurchase])

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(PREMIUM_KEY, isPremium ? 'true' : 'false')
    } catch {
      // localStorage not available
    }
  }, [isPremium])

  const startCheckout = async () => {
    setIsLoading(true)
    try {
      const createSession = httpsCallable(functions, 'createCheckoutSession')
      const result = await createSession()
      
      if (result.data.url) {
        // Redirect to Stripe Checkout
        window.location.href = result.data.url
      }
    } catch (error) {
      console.error('Failed to start checkout:', error)
      setIsLoading(false)
      throw error
    }
  }

  const unlock = () => {
    setIsPremiumState(true)
    setShowUpgrade(false)
  }

  const value = {
    isPremium,
    price: PRICE,
    showUpgrade,
    setShowUpgrade,
    startCheckout,
    isLoading,
    unlock, // Keep for testing
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
