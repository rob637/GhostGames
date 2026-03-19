import { useMemo } from 'react'
import { getOrCreatePlayerId, getPlayerRole } from '../services/gameService'

export function usePlayer() {
  const player = useMemo(() => {
    const playerId = getOrCreatePlayerId()
    return {
      id: playerId,
      name: 'You',
    }
  }, [])

  // Enhanced player info when we have game context
  const getPlayerInGame = (game) => {
    if (!player || !game) return null
    
    const role = getPlayerRole(game, player.id)
    return {
      ...player,
      role,
    }
  }

  return { 
    player,
    getPlayerInGame,
  }
}
