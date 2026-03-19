import { useState, useEffect } from 'react'
import { subscribeToGame, joinGame, getOrCreatePlayerId } from '../services/gameService'

export function useGame(gameId) {
  const [game, setGame] = useState(null)
  const [loading, setLoading] = useState(!!gameId)
  const [error, setError] = useState(gameId ? null : new Error('No game ID'))

  useEffect(() => {
    if (!gameId) {
      return
    }

    const playerId = getOrCreatePlayerId()
    let hasJoined = false

    const unsubscribe = subscribeToGame(gameId, async (gameData, err) => {
      if (err) {
        setError(err)
        setLoading(false)
        return
      }

      if (!gameData) {
        setError(new Error('Game not found'))
        setLoading(false)
        return
      }

      // Auto-join if game is waiting and we're not player1
      if (
        gameData.status === 'waiting' &&
        gameData.players?.player1?.id !== playerId &&
        !gameData.players?.player2 &&
        !hasJoined
      ) {
        hasJoined = true
        try {
          await joinGame(gameId, playerId)
        } catch (joinErr) {
          console.error('Failed to join game:', joinErr)
        }
        return // Wait for next snapshot after join
      }

      setGame(gameData)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [gameId])

  return { game, loading, error }
}
