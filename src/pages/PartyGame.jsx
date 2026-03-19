import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useGame } from '../hooks/useGame'
import { getOrCreatePlayerId, joinPartyGame, getPartyPlayer } from '../services/gameService'
import PartyLobby from '../components/PartyLobby'
import MindMeld from '../components/games/MindMeld'
import MindMeldResults from '../components/games/MindMeldResults'
import MostLikely from '../components/games/MostLikely'
import MostLikelyResults from '../components/games/MostLikelyResults'
import BluffBattle from '../components/games/BluffBattle'
import BluffBattleResults from '../components/games/BluffBattleResults'
import Prediction from '../components/games/Prediction'
import PredictionResults from '../components/games/PredictionResults'
import CaptionThisParty from '../components/games/CaptionThisParty'
import CaptionThisPartyResults from '../components/games/CaptionThisPartyResults'
import Loading from '../components/Loading'

export default function PartyGame() {
  const { gameId } = useParams()
  const navigate = useNavigate()
  const { game, loading, error } = useGame(gameId)
  const [joining, setJoining] = useState(false)
  const [joinError, setJoinError] = useState(null)
  
  const playerId = getOrCreatePlayerId()
  const currentPlayer = game ? getPartyPlayer(game, playerId) : null
  
  // Auto-join when game loads
  useEffect(() => {
    const attemptJoin = async () => {
      if (!game || !game.isPartyGame || joining) return
      
      // Already in game
      if (currentPlayer) return
      
      // Game not in lobby - can't join
      if (game.status !== 'lobby') {
        setJoinError('Game has already started')
        return
      }
      
      setJoining(true)
      try {
        await joinPartyGame(gameId)
      } catch (err) {
        console.error('Failed to join:', err)
        setJoinError(err.message)
      }
      setJoining(false)
    }
    
    attemptJoin()
  }, [game, gameId, currentPlayer, joining])
  
  if (loading || joining) {
    return <Loading message={joining ? 'Joining game...' : 'Loading game...'} />
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="card text-center max-w-md">
          <div className="text-4xl mb-4">😵</div>
          <h2 className="text-xl font-semibold mb-2">Game not found</h2>
          <p className="text-[var(--text-muted)] mb-6">
            This game may have expired or doesn't exist.
          </p>
          <a href="/" className="btn btn-primary inline-block">
            Start New Game
          </a>
        </div>
      </div>
    )
  }
  
  if (joinError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="card text-center max-w-md">
          <div className="text-4xl mb-4">🚫</div>
          <h2 className="text-xl font-semibold mb-2">Can't Join</h2>
          <p className="text-[var(--text-muted)] mb-6">{joinError}</p>
          <a href="/" className="btn btn-primary inline-block">
            Start New Game
          </a>
        </div>
      </div>
    )
  }
  
  if (!game) {
    return <Loading message="Loading game..." />
  }
  
  // Not a party game - redirect to regular game page
  if (!game.isPartyGame) {
    navigate(`/play/${gameId}`, { replace: true })
    return null
  }
  
  // Lobby state - waiting for players
  if (game.status === 'lobby') {
    return (
      <PartyLobby 
        gameId={gameId} 
        game={game} 
        currentPlayer={currentPlayer}
      />
    )
  }
  
  // Active game - render based on game type
  if (game.status === 'active') {
    if (game.gameType === 'mind-meld') {
      return (
        <MindMeld 
          game={game} 
          gameId={gameId} 
          currentPlayer={currentPlayer}
        />
      )
    }
    if (game.gameType === 'most-likely') {
      return (
        <MostLikely 
          game={game} 
          gameId={gameId} 
          currentPlayer={currentPlayer}
        />
      )
    }
    if (game.gameType === 'bluff-battle') {
      return (
        <BluffBattle 
          game={game} 
          gameId={gameId} 
          currentPlayer={currentPlayer}
        />
      )
    }
    if (game.gameType === 'prediction') {
      return (
        <Prediction 
          game={game} 
          gameId={gameId} 
          currentPlayer={currentPlayer}
        />
      )
    }
    if (game.gameType === 'caption-this') {
      return (
        <CaptionThisParty 
          game={game} 
          gameId={gameId} 
          currentPlayer={currentPlayer}
        />
      )
    }
  }
  
  // Finished game - show results
  if (game.status === 'finished') {
    if (game.gameType === 'mind-meld') {
      return (
        <MindMeldResults 
          game={game} 
          gameId={gameId} 
          currentPlayer={currentPlayer}
        />
      )
    }
    if (game.gameType === 'most-likely') {
      return (
        <MostLikelyResults 
          game={game} 
          gameId={gameId} 
          currentPlayer={currentPlayer}
        />
      )
    }
    if (game.gameType === 'bluff-battle') {
      return (
        <BluffBattleResults 
          game={game} 
          gameId={gameId} 
          currentPlayer={currentPlayer}
        />
      )
    }
    if (game.gameType === 'prediction') {
      return (
        <PredictionResults 
          game={game} 
          gameId={gameId} 
          currentPlayer={currentPlayer}
        />
      )
    }
    if (game.gameType === 'caption-this') {
      return (
        <CaptionThisPartyResults 
          game={game} 
          gameId={gameId} 
          currentPlayer={currentPlayer}
        />
      )
    }
  }
  
  // Default fallback
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="card text-center">
        <p className="text-[var(--text-muted)]">Loading game...</p>
      </div>
    </div>
  )
}
