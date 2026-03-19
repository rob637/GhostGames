import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createRematchGame, joinRematchGame, subscribeToGame } from '../services/gameService'

export default function PlayAgainButton({ game, gameId, className = '' }) {
  const navigate = useNavigate()
  const [isCreatingRematch, setIsCreatingRematch] = useState(false)
  const [nextGameId, setNextGameId] = useState(game?.nextGameId || null)

  // Subscribe to game updates to detect when opponent starts a rematch
  useEffect(() => {
    if (!gameId) return
    
    const unsubscribe = subscribeToGame(gameId, (updatedGame) => {
      if (updatedGame?.nextGameId && updatedGame.nextGameId !== nextGameId) {
        setNextGameId(updatedGame.nextGameId)
      }
    })
    
    return () => unsubscribe()
  }, [gameId, nextGameId])

  const handleRematch = async () => {
    if (isCreatingRematch) return
    setIsCreatingRematch(true)
    
    try {
      const newGameId = await createRematchGame(gameId, game)
      navigate(`/play/${newGameId}`)
    } catch (err) {
      console.error('Failed to create rematch:', err)
      setIsCreatingRematch(false)
    }
  }

  const handleJoinRematch = async () => {
    if (!nextGameId) return
    
    try {
      await joinRematchGame(nextGameId)
      navigate(`/play/${nextGameId}`)
    } catch (err) {
      console.error('Failed to join rematch:', err)
    }
  }

  return (
    <div className={className}>
      {nextGameId ? (
        <>
          <button 
            onClick={handleJoinRematch} 
            className="btn btn-primary w-full animate-pulse"
          >
            Join Rematch! 🎮
          </button>
          <p className="text-sm text-[var(--success)] mt-2 text-center animate-bounce">
            Opponent started a new game!
          </p>
        </>
      ) : (
        <button 
          onClick={handleRematch} 
          className="btn btn-primary w-full"
          disabled={isCreatingRematch}
        >
          {isCreatingRematch ? 'Starting...' : 'Play Again'}
        </button>
      )}
    </div>
  )
}
