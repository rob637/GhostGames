import { useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useGame } from '../hooks/useGame'
import { usePlayer } from '../hooks/usePlayer'
import { playJoinSound } from '../utils/sounds'
import Lobby from '../components/Lobby'
import WordVolley from '../components/games/WordVolley'
import HotTake from '../components/games/HotTake'
import QuickDraw from '../components/games/QuickDraw'
import StoryChain from '../components/games/StoryChain'
import Trivia from '../components/games/Trivia'
import RockPaperScissors from '../components/games/RockPaperScissors'
import GameOver from '../components/GameOver'
import Loading from '../components/Loading'

export default function Game() {
  const { gameId } = useParams()
  const { game, loading, error } = useGame(gameId)
  const { player, getPlayerInGame } = usePlayer()
  const prevStatusRef = useRef(null)

  // Get player with role info once we have game data
  const playerInGame = game ? getPlayerInGame(game) : player

  // Play sound when opponent joins
  useEffect(() => {
    if (prevStatusRef.current === 'waiting' && game?.status === 'active') {
      playJoinSound()
    }
    prevStatusRef.current = game?.status
  }, [game?.status])

  if (loading) {
    return <Loading message="Loading game..." />
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

  if (!game) {
    return <Loading message="Loading game..." />
  }

  // Waiting for opponent
  if (game.status === 'waiting') {
    return <Lobby gameId={gameId} game={game} />
  }

  // Game finished - only use generic GameOver for Word Volley
  // Hot Take and Quick Draw handle their own end screens
  if (game.status === 'finished' && game.gameType === 'word-volley') {
    return <GameOver game={game} gameId={gameId} player={playerInGame} />
  }

  // Active game - render based on game type
  if (game.gameType === 'word-volley') {
    return <WordVolley game={game} gameId={gameId} player={playerInGame} />
  }

  if (game.gameType === 'hot-take') {
    return <HotTake game={game} gameId={gameId} player={playerInGame} />
  }

  if (game.gameType === 'quick-draw') {
    return <QuickDraw game={game} gameId={gameId} player={playerInGame} />
  }

  if (game.gameType === 'story-chain') {
    return <StoryChain game={game} gameId={gameId} player={playerInGame} />
  }

  if (game.gameType === 'trivia') {
    return <Trivia game={game} gameId={gameId} player={playerInGame} />
  }

  if (game.gameType === 'rps') {
    return <RockPaperScissors game={game} gameId={gameId} player={playerInGame} />
  }

  // Default fallback
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Unknown game type</p>
    </div>
  )
}
