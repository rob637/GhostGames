import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const ExperimentalContext = createContext(null)

// Key for localStorage
const STORAGE_KEY = 'ghostgames_experimental'

/**
 * ExperimentalProvider - Manages experimental mode state
 * 
 * Experimental mode unlocks:
 * - New games in development
 * - Upcoming features
 * - Debug tools
 */
export function ExperimentalProvider({ children }) {
  const [isExperimental, setIsExperimental] = useState(() => {
    // Check localStorage on initial load
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEY) === 'true'
    }
    return false
  })

  // Persist to localStorage when changed
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, isExperimental.toString())
  }, [isExperimental])

  const enableExperimental = useCallback(() => {
    setIsExperimental(true)
  }, [])

  const disableExperimental = useCallback(() => {
    setIsExperimental(false)
  }, [])

  const toggleExperimental = useCallback(() => {
    setIsExperimental(prev => !prev)
  }, [])

  const value = {
    isExperimental,
    enableExperimental,
    disableExperimental,
    toggleExperimental,
  }

  return (
    <ExperimentalContext.Provider value={value}>
      {children}
    </ExperimentalContext.Provider>
  )
}

/**
 * Hook to access experimental mode state
 */
export function useExperimental() {
  const context = useContext(ExperimentalContext)
  if (!context) {
    throw new Error('useExperimental must be used within ExperimentalProvider')
  }
  return context
}

/**
 * Hook to detect secret click pattern
 * 
 * Usage: const { targetRef, isActivated } = useSecretPattern(5, callback)
 * 
 * @param requiredClicks - Number of clicks needed to activate
 * @param onActivate - Callback when pattern is completed
 * @param timeout - Time window for clicks (default 3 seconds)
 */
export function useSecretPattern(requiredClicks = 5, onActivate, timeout = 3000) {
  const [clickCount, setClickCount] = useState(0)
  const [lastClickTime, setLastClickTime] = useState(0)
  const [isActivated, setIsActivated] = useState(false)

  const handleClick = useCallback(() => {
    const now = Date.now()
    
    // Reset if too much time has passed
    if (now - lastClickTime > timeout) {
      setClickCount(1)
    } else {
      setClickCount(prev => prev + 1)
    }
    
    setLastClickTime(now)
  }, [lastClickTime, timeout])

  // Check if pattern is complete
  useEffect(() => {
    if (clickCount >= requiredClicks && !isActivated) {
      setIsActivated(true)
      setClickCount(0)
      onActivate?.()
    }
  }, [clickCount, requiredClicks, isActivated, onActivate])

  // Reset activation after a moment (for re-triggering)
  useEffect(() => {
    if (isActivated) {
      const timer = setTimeout(() => setIsActivated(false), 500)
      return () => clearTimeout(timer)
    }
  }, [isActivated])

  return {
    handleClick,
    clickCount,
    isActivated,
  }
}
