import { useMemo } from 'react'

export default function BluffBattleResults({ game, gameId, currentPlayer }) {
  const players = game?.partyPlayers || []
  
  // Calculate final scores
  const finalStats = useMemo(() => {
    const scores = {}
    const correctGuesses = {}
    const peopleFooled = {}
    
    players.forEach(p => { 
      scores[p.id] = 0
      correctGuesses[p.id] = 0
      peopleFooled[p.id] = 0
    })
    
    game?.rounds?.forEach((round) => {
      if (round?.roundScores) {
        Object.entries(round.roundScores).forEach(([playerId, score]) => {
          scores[playerId] = (scores[playerId] || 0) + score
        })
      }
      if (round?.correctGuessers) {
        round.correctGuessers.forEach(playerId => {
          correctGuesses[playerId] = (correctGuesses[playerId] || 0) + 1
        })
      }
      if (round?.fooledBy) {
        Object.entries(round.fooledBy).forEach(([blufferId, count]) => {
          peopleFooled[blufferId] = (peopleFooled[blufferId] || 0) + count
        })
      }
    })
    
    return { scores, correctGuesses, peopleFooled }
  }, [game?.rounds, players])
  
  // Sort players by score
  const sortedPlayers = useMemo(() => {
    return [...players]
      .map(p => ({ 
        ...p, 
        score: finalStats.scores[p.id] || 0,
        correct: finalStats.correctGuesses[p.id] || 0,
        fooled: finalStats.peopleFooled[p.id] || 0,
      }))
      .sort((a, b) => b.score - a.score)
  }, [players, finalStats])
  
  const winner = sortedPlayers[0]
  const isWinner = winner?.id === currentPlayer?.id
  
  // Find best bluffer (fooled the most people)
  const bestBluffer = [...sortedPlayers].sort((a, b) => b.fooled - a.fooled)[0]
  const mostTruthful = [...sortedPlayers].sort((a, b) => b.correct - a.correct)[0]
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Celebration for winner */}
      {isWinner && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                backgroundColor: ['#f97316', '#22c55e', '#3b82f6', '#a855f7', '#ec4899', '#eab308'][Math.floor(Math.random() * 6)],
                animationDelay: `${Math.random() * 2}s`,
                borderRadius: Math.random() > 0.5 ? '50%' : '0',
              }}
            />
          ))}
        </div>
      )}
      
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 animate-slide-up">
          <div className="text-6xl mb-4">🃏</div>
          <h1 className="text-3xl font-bold mb-2">Game Over!</h1>
          <p className="text-[var(--text-muted)]">Bluff Battle Complete</p>
        </div>
        
        {/* Winner Banner */}
        <div 
          className="card mb-6 text-center animate-bounce-in"
          style={{ 
            background: `linear-gradient(135deg, ${winner?.color}20, ${winner?.color}10)`,
            borderColor: winner?.color,
            borderWidth: 2,
          }}
        >
          <div className="text-5xl mb-2">{winner?.emoji}</div>
          <h2 className="text-2xl font-bold" style={{ color: winner?.color }}>
            {winner?.name} {isWinner && '(You!)'}
          </h2>
          <p className="text-3xl font-bold mt-2">{winner?.score} points</p>
          <p className="text-sm text-[var(--text-muted)] mt-1">👑 Master of Deception</p>
        </div>
        
        {/* Leaderboard */}
        <div className="card mb-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <h3 className="font-semibold mb-4 text-center">Final Standings</h3>
          <div className="space-y-3">
            {sortedPlayers.map((player, index) => (
              <div 
                key={player.id}
                className={`flex items-center gap-3 p-3 rounded-xl ${
                  index === 0 ? 'bg-yellow-500/10 border border-yellow-500/30' :
                  index === 1 ? 'bg-gray-400/10 border border-gray-400/30' :
                  index === 2 ? 'bg-orange-700/10 border border-orange-700/30' :
                  'bg-[var(--bg-tertiary)]'
                }`}
              >
                <div className="w-8 text-center font-bold">
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}`}
                </div>
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                  style={{ backgroundColor: `${player.color}30` }}
                >
                  {player.emoji}
                </div>
                <div className="flex-1">
                  <div className="font-medium" style={{ color: player.color }}>
                    {player.name}
                    {player.id === currentPlayer?.id && (
                      <span className="text-[var(--text-muted)] text-sm ml-1">(You)</span>
                    )}
                  </div>
                  <div className="text-xs text-[var(--text-muted)]">
                    {player.correct} correct • {player.fooled} fooled others
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">{player.score}</div>
                  <div className="text-xs text-[var(--text-muted)]">pts</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Fun Awards */}
        <div className="card mb-6 animate-fade-in" style={{ animationDelay: '400ms' }}>
          <h3 className="font-semibold mb-4 text-center">Awards</h3>
          <div className="space-y-3">
            {bestBluffer && bestBluffer.fooled > 0 && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-500/10 border border-purple-500/30">
                <div className="text-2xl">🎭</div>
                <div className="flex-1">
                  <div className="font-medium text-purple-400">Best Bluffer</div>
                  <div className="text-sm text-[var(--text-muted)]">
                    {bestBluffer.name} fooled {bestBluffer.fooled} people
                  </div>
                </div>
                <div className="text-2xl">{bestBluffer.emoji}</div>
              </div>
            )}
            {mostTruthful && mostTruthful.correct > 0 && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-green-500/10 border border-green-500/30">
                <div className="text-2xl">🔍</div>
                <div className="flex-1">
                  <div className="font-medium text-green-400">Truth Seeker</div>
                  <div className="text-sm text-[var(--text-muted)]">
                    {mostTruthful.name} spotted {mostTruthful.correct} real answers
                  </div>
                </div>
                <div className="text-2xl">{mostTruthful.emoji}</div>
              </div>
            )}
          </div>
        </div>
        
        {/* Game Stats */}
        <div className="card mb-6 animate-fade-in" style={{ animationDelay: '500ms' }}>
          <h3 className="font-semibold mb-4 text-center">Game Stats</h3>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-[var(--bg-tertiary)] rounded-xl p-4">
              <div className="text-2xl mb-1">❓</div>
              <div className="text-lg font-bold">{game?.totalRounds || 8}</div>
              <div className="text-xs text-[var(--text-muted)]">Questions</div>
            </div>
            <div className="bg-[var(--bg-tertiary)] rounded-xl p-4">
              <div className="text-2xl mb-1">😈</div>
              <div className="text-lg font-bold">
                {Object.values(finalStats.peopleFooled).reduce((a, b) => a + b, 0)}
              </div>
              <div className="text-xs text-[var(--text-muted)]">Total Fooled</div>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="space-y-3 animate-fade-in" style={{ animationDelay: '600ms' }}>
          <a 
            href="/" 
            className="btn btn-primary w-full text-center block"
          >
            Play Again
          </a>
          <button
            onClick={() => {
              const text = `🃏 ${winner?.name} won Bluff Battle with ${winner?.score} points! Master of Deception!`
              if (navigator.share) {
                navigator.share({ text })
              } else if (navigator.clipboard) {
                navigator.clipboard.writeText(text)
              }
            }}
            className="btn w-full border border-[var(--border)]"
          >
            Share Results 📤
          </button>
        </div>
      </div>
    </div>
  )
}
