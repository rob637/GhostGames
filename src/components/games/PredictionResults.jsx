import { useMemo } from 'react'
import Confetti from '../Confetti'

export default function PredictionResults({ game, currentPlayer }) {
  const players = useMemo(() => game?.partyPlayers || [], [game?.partyPlayers])
  
  // Calculate final scores and stats
  const finalStats = useMemo(() => {
    const scores = {}
    const correctPredictions = {}
    const peopleFooled = {}
    const perfectRounds = {}
    
    players.forEach(p => { 
      scores[p.id] = 0
      correctPredictions[p.id] = 0
      peopleFooled[p.id] = 0
      perfectRounds[p.id] = 0
    })
    
    game?.rounds?.forEach((round, roundIndex) => {
      if (round?.roundScores) {
        Object.entries(round.roundScores).forEach(([playerId, score]) => {
          scores[playerId] = (scores[playerId] || 0) + score
        })
      }
      if (round?.correctPredictors) {
        round.correctPredictors.forEach(playerId => {
          correctPredictions[playerId] = (correctPredictions[playerId] || 0) + 1
        })
      }
      if (round?.wrongPredictors) {
        // The hot seat player fooled these people
        const hotSeatIndex = roundIndex % players.length
        const hotSeatId = players[hotSeatIndex]?.id
        if (hotSeatId) {
          peopleFooled[hotSeatId] = (peopleFooled[hotSeatId] || 0) + round.wrongPredictors.length
        }
      }
      if (round?.perfectPrediction) {
        // Count perfect rounds for hot seat
        const hotSeatIndex = roundIndex % players.length
        const hotSeatId = players[hotSeatIndex]?.id
        if (hotSeatId) {
          perfectRounds[hotSeatId] = (perfectRounds[hotSeatId] || 0) + 1
        }
      }
    })
    
    return { scores, correctPredictions, peopleFooled, perfectRounds }
  }, [game?.rounds, players])
  
  // Sort players by score
  const sortedPlayers = useMemo(() => {
    return [...players]
      .map(p => ({ 
        ...p, 
        score: finalStats.scores[p.id] || 0,
        correct: finalStats.correctPredictions[p.id] || 0,
        fooled: finalStats.peopleFooled[p.id] || 0,
      }))
      .sort((a, b) => b.score - a.score)
  }, [players, finalStats])
  
  const winner = sortedPlayers[0]
  const isWinner = winner?.id === currentPlayer?.id
  
  // Awards
  const bestPredictor = [...sortedPlayers].sort((a, b) => b.correct - a.correct)[0]
  const mostUnpredictable = [...sortedPlayers].sort((a, b) => b.fooled - a.fooled)[0]
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Celebration for winner */}
      <Confetti show={isWinner} />
      
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 animate-slide-up">
          <div className="text-6xl mb-4">🔮</div>
          <h1 className="text-3xl font-bold mb-2">Game Over!</h1>
          <p className="text-[var(--text-muted)]">Prediction Complete</p>
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
          <div className="text-sm text-[var(--text-muted)] mt-2">
            🔮 {winner?.correct} correct predictions
          </div>
        </div>
        
        {/* Awards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="card bg-purple-500/10 border-purple-500/30 text-center p-3">
            <div className="text-2xl mb-1">🎯</div>
            <div className="text-xs text-[var(--text-muted)]">Best Predictor</div>
            <div className="font-semibold text-purple-400 flex items-center justify-center gap-1">
              <span>{bestPredictor?.emoji}</span>
              <span>{bestPredictor?.name}</span>
            </div>
            <div className="text-xs text-[var(--text-muted)]">{bestPredictor?.correct} correct</div>
          </div>
          <div className="card bg-orange-500/10 border-orange-500/30 text-center p-3">
            <div className="text-2xl mb-1">🎭</div>
            <div className="text-xs text-[var(--text-muted)]">Most Mysterious</div>
            <div className="font-semibold text-orange-400 flex items-center justify-center gap-1">
              <span>{mostUnpredictable?.emoji}</span>
              <span>{mostUnpredictable?.name}</span>
            </div>
            <div className="text-xs text-[var(--text-muted)]">Fooled {mostUnpredictable?.fooled}</div>
          </div>
        </div>
        
        {/* Final Standings */}
        <div className="card">
          <h3 className="text-sm font-semibold text-[var(--text-muted)] mb-4">Final Standings</h3>
          <div className="space-y-3">
            {sortedPlayers.map((p, i) => {
              const isMe = p.id === currentPlayer?.id
              return (
                <div 
                  key={p.id}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                    i === 0 
                      ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30' 
                      : 'bg-[var(--bg-tertiary)]'
                  }`}
                >
                  {/* Rank */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    i === 0 ? 'bg-yellow-500 text-black' :
                    i === 1 ? 'bg-gray-400 text-black' :
                    i === 2 ? 'bg-orange-600 text-white' :
                    'bg-[var(--bg-dark)] text-[var(--text-muted)]'
                  }`}>
                    {i + 1}
                  </div>
                  
                  {/* Avatar */}
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                    style={{ backgroundColor: `${p.color}30` }}
                  >
                    {p.emoji}
                  </div>
                  
                  {/* Name & Stats */}
                  <div className="flex-1">
                    <div className="font-medium" style={{ color: p.color }}>
                      {p.name}
                      {isMe && <span className="text-[var(--text-muted)] ml-1">(You)</span>}
                    </div>
                    <div className="text-xs text-[var(--text-muted)]">
                      🔮 {p.correct} correct • 🎭 Fooled {p.fooled}
                    </div>
                  </div>
                  
                  {/* Score */}
                  <div className="text-right">
                    <div className="font-bold text-lg">{p.score}</div>
                    <div className="text-xs text-[var(--text-muted)]">pts</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        
        {/* Play Again */}
        <div className="mt-6 text-center">
          <a 
            href="/"
            className="btn btn-primary inline-flex items-center gap-2"
          >
            <span>🏠</span>
            <span>Back to Home</span>
          </a>
        </div>
      </div>
    </div>
  )
}
