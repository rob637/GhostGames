import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { createGame, createPartyGame } from '../services/gameService'
import { ALL_GAMES } from '../config/games'
import { useExperimental, useSecretPattern } from '../contexts/ExperimentalContext'
import { usePremium } from '../contexts/PremiumContext'
import GamePicker from '../components/GamePicker'
import ThemePicker from '../components/ThemePicker'
import ExperimentalMenu from '../components/ExperimentalMenu'

export default function Home() {
  const navigate = useNavigate()
  const [isCreating, setIsCreating] = useState(false)
  const [selectedGame, setSelectedGame] = useState(null)
  const [showSecretMenu, setShowSecretMenu] = useState(false)
  
  const { isExperimental } = useExperimental()
  const { isPremium, setShowUpgrade } = usePremium()

  // Secret pattern: click "O" in Ghost 5 times
  const handleSecretActivated = useCallback(() => {
    setShowSecretMenu(true)
    if (!isExperimental) {
      // Play a subtle sound or haptic feedback here
    }
  }, [isExperimental])

  const { handleClick: handleSecretClick } = useSecretPattern(5, handleSecretActivated)

  // Get all available games based on experimental mode
  const allGames = Object.values(ALL_GAMES).filter(game => {
    if (game.status === 'hidden') return false
    if (game.status === 'experimental' && !isExperimental) return false
    if (game.status === 'coming-soon') return true // Show but disabled
    return true
  })

  const handleSelectGame = (gameType) => {
    const game = ALL_GAMES[gameType]
    
    // Check if premium game and user isn't premium
    if (game?.premium && !isPremium) {
      setShowUpgrade(true)
      return
    }
    
    // Solo games navigate directly - no Firestore game needed
    if (game?.category === 'solo') {
      navigate(`/solo/${gameType}`)
      return
    }
    
    // Party games use different creation flow
    if (game?.category === 'party') {
      handleCreatePartyGame(gameType)
      return
    }
    
    if (game?.hasThemes) {
      setSelectedGame(gameType)
    } else {
      handleCreateGame(gameType)
    }
  }

  const handleSelectTheme = async (themeId) => {
    if (isCreating) return
    setIsCreating(true)

    try {
      const gameId = await createGame(selectedGame, themeId)
      navigate(`/play/${gameId}`)
    } catch (error) {
      console.error('Failed to create game:', error)
      setIsCreating(false)
    }
  }

  const handleCreateGame = async (gameType, themeId = null) => {
    if (isCreating) return
    setIsCreating(true)

    try {
      const gameId = await createGame(gameType, themeId)
      navigate(`/play/${gameId}`)
    } catch (error) {
      console.error('Failed to create game:', error)
      setIsCreating(false)
    }
  }

  const handleCreatePartyGame = async (gameType) => {
    if (isCreating) return
    setIsCreating(true)

    try {
      const gameId = await createPartyGame(gameType)
      navigate(`/party/${gameId}`)
    } catch (error) {
      console.error('Failed to create party game:', error)
      setIsCreating(false)
    }
  }

  // Show theme picker for games that have themes
  if (selectedGame && ALL_GAMES[selectedGame]?.hasThemes) {
    const game = ALL_GAMES[selectedGame]
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            <span className="mr-2">{game.emoji}</span>
            {game.name}
          </h1>
        </div>
        
        <ThemePicker
          onSelect={handleSelectTheme}
          onBack={() => setSelectedGame(null)}
          disabled={isCreating}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      {/* Header with secret click target */}
      <div className="text-center mb-12 animate-slide-up">
        <h1 className="text-5xl font-bold mb-4">
          <span className="mr-3">👻</span>
          <span>Gh</span>
          <span 
            onClick={handleSecretClick}
            className="cursor-default select-none"
            style={{ userSelect: 'none' }}
          >
            o
          </span>
          <span>st Games</span>
        </h1>
        <p className="text-[var(--text-muted)] text-lg max-w-md mx-auto">
          Quick games with friends. No app needed.
          <br />
          <span className="text-[var(--ghost)]">If they ghost, AI finishes.</span>
        </p>
        
        {/* Experimental mode indicator */}
        {isExperimental && (
          <div 
            className="inline-flex items-center gap-2 mt-4 px-3 py-1 rounded-full bg-[var(--ghost)]/20 text-[var(--ghost)] text-sm cursor-pointer hover:bg-[var(--ghost)]/30 transition-colors"
            onClick={() => setShowSecretMenu(true)}
          >
            <span>🔬</span>
            <span>Experimental Mode</span>
          </div>
        )}
      </div>

      <GamePicker
        games={allGames}
        onSelect={handleSelectGame}
        disabled={isCreating}
      />

      <p className="mt-12 text-sm text-[var(--text-muted)]">
        Share a link. Play in browser. 2 minutes max.
      </p>

      {/* Secret Menu */}
      <ExperimentalMenu 
        isOpen={showSecretMenu} 
        onClose={() => setShowSecretMenu(false)} 
      />
    </div>
  )
}
