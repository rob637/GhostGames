import { useState } from 'react'
import { startPartyGame } from '../services/gameService'
import ShareLink from './ShareLink'

export default function PartyLobby({ gameId, game, currentPlayer }) {
  const [isStarting, setIsStarting] = useState(false)
  const [error, setError] = useState(null)
  
  const players = game?.partyPlayers || []
  const minPlayers = game?.minPlayers || 2
  const maxPlayers = game?.maxPlayers || 8
  const isHost = currentPlayer?.isHost
  const canStart = players.length >= minPlayers
  
  const handleStart = async () => {
    if (!canStart || isStarting) return
    setIsStarting(true)
    setError(null)
    
    try {
      await startPartyGame(gameId)
    } catch (err) {
      console.error('Failed to start game:', err)
      setError(err.message)
      setIsStarting(false)
    }
  }
  
  // Game info based on type
  const getGameInfo = () => {
    switch (game?.gameType) {
      case 'mind-meld':
        return {
          title: '🧠 Mind Meld',
          description: 'Think alike! Everyone answers at once. Match with others to score!',
          rules: [
            'A category appears (e.g., "A fruit")',
            'Everyone types their answer secretly',
            'Answers are revealed - matches score points!',
            'Perfect meld (everyone same answer) = bonus!',
          ],
        }
      default:
        return {
          title: '🎉 Party Game',
          description: 'Get ready to play!',
          rules: [],
        }
    }
  }
  
  const gameInfo = getGameInfo()
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Game Title */}
        <div className="text-center mb-8 animate-slide-up">
          <h1 className="text-3xl font-bold mb-2">{gameInfo.title}</h1>
          <p className="text-[var(--text-muted)]">{gameInfo.description}</p>
        </div>
        
        {/* Players List */}
        <div className="card mb-6 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">
              Players ({players.length}/{maxPlayers})
            </h2>
            {players.length < minPlayers && (
              <span className="text-sm text-[var(--warning)]">
                Need {minPlayers - players.length} more
              </span>
            )}
          </div>
          
          <div className="space-y-3">
            {players.map((player, index) => (
              <div 
                key={player.id}
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{ backgroundColor: `${player.color}15` }}
              >
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                  style={{ backgroundColor: `${player.color}30` }}
                >
                  {player.emoji}
                </div>
                <div className="flex-1">
                  <div className="font-medium" style={{ color: player.color }}>
                    {player.name}
                    {player.id === currentPlayer?.id && (
                      <span className="text-[var(--text-muted)] text-sm ml-2">(You)</span>
                    )}
                  </div>
                  {player.isHost && (
                    <div className="text-xs text-[var(--text-muted)]">👑 Host</div>
                  )}
                </div>
                {index === players.length - 1 && index > 0 && (
                  <div className="text-xs text-[var(--success)] animate-pulse">
                    Just joined!
                  </div>
                )}
              </div>
            ))}
            
            {/* Empty slots */}
            {Array.from({ length: Math.min(maxPlayers - players.length, 3) }).map((_, i) => (
              <div 
                key={`empty-${i}`}
                className="flex items-center gap-3 p-3 rounded-xl border-2 border-dashed border-white/10"
              >
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[var(--text-muted)]">
                  ?
                </div>
                <div className="text-[var(--text-muted)]">
                  Waiting for player...
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Share Link */}
        <div className="mb-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <ShareLink gameId={gameId} />
        </div>
        
        {/* Game Rules */}
        {gameInfo.rules.length > 0 && (
          <div className="card mb-6 bg-[var(--ghost)]/10 border border-[var(--ghost)]/20 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <h3 className="font-semibold mb-3 text-[var(--ghost)]">How to Play</h3>
            <ol className="space-y-2 text-sm text-[var(--text-muted)]">
              {gameInfo.rules.map((rule, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-[var(--ghost)]">{i + 1}.</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
        
        {/* Start Button (Host Only) */}
        {isHost ? (
          <div className="text-center animate-fade-in" style={{ animationDelay: '300ms' }}>
            {error && (
              <p className="text-red-400 text-sm mb-3">{error}</p>
            )}
            <button
              onClick={handleStart}
              disabled={!canStart || isStarting}
              className={`btn btn-primary w-full py-4 text-lg ${!canStart ? 'opacity-50' : ''}`}
            >
              {isStarting ? (
                <span className="animate-pulse">Starting...</span>
              ) : canStart ? (
                '🎉 Start Game!'
              ) : (
                `Waiting for ${minPlayers - players.length} more player${minPlayers - players.length > 1 ? 's' : ''}...`
              )}
            </button>
          </div>
        ) : (
          <div className="text-center animate-fade-in" style={{ animationDelay: '300ms' }}>
            <div className="card bg-[var(--bg-tertiary)] text-center">
              <p className="text-[var(--text-muted)]">
                ⏳ Waiting for host to start...
              </p>
            </div>
          </div>
        )}
        
        {/* Back Button */}
        <div className="text-center mt-6">
          <a href="/" className="text-[var(--text-muted)] text-sm hover:text-[var(--text-primary)]">
            ← Leave Game
          </a>
        </div>
      </div>
    </div>
  )
}
