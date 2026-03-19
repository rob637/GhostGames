import { useMemo } from 'react'

// Pre-generate confetti pieces
const CONFETTI_PIECES = Array.from({ length: 30 }).map((_, i) => ({
  id: i,
  left: `${(i * 3.33) % 100}%`,
  delay: `${(i * 0.067) % 2}s`,
  color: ['#f97316', '#22c55e', '#3b82f6', '#a855f7', '#ec4899', '#eab308'][i % 6],
  isCircle: i % 2 === 0,
}))

function Confetti() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {CONFETTI_PIECES.map(p => (
        <div
          key={p.id}
          className="absolute w-3 h-3 animated-confetti"
          style={{
            left: p.left,
            top: '-10px',
            backgroundColor: p.color,
            animationDelay: p.delay,
            borderRadius: p.isCircle ? '50%' : '0',
          }}
        />
      ))}
    </div>
  )
}

export default function WordAssociationResults({ game, currentPlayer }) {
  const players = useMemo(() => game?.partyPlayers || [], [game?.partyPlayers])
  
  // Calculate final scores
  const finalStandings = useMemo(() => {
    const scores = {}
    const matchCounts = {} // Track how many times each player matched
    const uniqueCounts = {} // Track unique answers
    
    players.forEach(p => {
      scores[p.id] = 0
      matchCounts[p.id] = 0
      uniqueCounts[p.id] = 0
    })
    
    game?.rounds?.forEach((round) => {
      if (round?.roundScores) {
        Object.entries(round.roundScores).forEach(([playerId, score]) => {
          scores[playerId] = (scores[playerId] || 0) + score
        })
      }
      // Count matches vs unique
      if (round?.matchGroups) {
        Object.values(round.matchGroups).forEach(group => {
          if (group.length > 1) {
            group.forEach(id => {
              matchCounts[id] = (matchCounts[id] || 0) + 1
            })
          } else {
            group.forEach(id => {
              uniqueCounts[id] = (uniqueCounts[id] || 0) + 1
            })
          }
        })
      }
    })
    
    // Build standings array
    const standings = players.map(player => ({
      ...player,
      score: scores[player.id] || 0,
      matches: matchCounts[player.id] || 0,
      uniques: uniqueCounts[player.id] || 0,
    }))
    
    // Sort by score
    standings.sort((a, b) => b.score - a.score)
    
    return standings
  }, [game?.rounds, players])
  
  // Find awards
  const awards = useMemo(() => {
    if (finalStandings.length === 0) return {}
    
    const mostMatches = [...finalStandings].sort((a, b) => b.matches - a.matches)[0]
    const mostUnique = [...finalStandings].sort((a, b) => b.uniques - a.uniques)[0]
    
    return {
      mindMelder: mostMatches?.matches > 0 ? mostMatches : null,
      creative: mostUnique?.uniques > 0 ? mostUnique : null,
    }
  }, [finalStandings])
  
  const winner = finalStandings[0]
  const isWinner = winner?.id === currentPlayer?.id
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {isWinner && <Confetti />}
      
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
            <span>💭</span> Game Over!
          </h1>
        </div>
        
        {/* Winner announcement */}
        {winner && (
          <div className="card mb-6 text-center">
            <div className="text-5xl mb-2">{winner.emoji}</div>
            <h2 className="text-xl font-bold" style={{ color: winner.color }}>
              {winner.name} Wins!
            </h2>
            <p className="text-3xl font-black mt-2">{winner.score} pts</p>
            {isWinner && (
              <p className="text-[var(--success)] mt-2">That's you! 🎉</p>
            )}
          </div>
        )}
        
        {/* Final standings */}
        <div className="card mb-6">
          <h3 className="text-sm font-semibold text-[var(--text-muted)] mb-3">
            Final Standings
          </h3>
          <div className="space-y-2">
            {finalStandings.map((player, index) => (
              <div
                key={player.id}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  player.id === currentPlayer?.id
                    ? 'bg-[var(--ghost)] bg-opacity-10 ring-1 ring-[var(--ghost)]'
                    : 'bg-[var(--surface)]'
                }`}
              >
                <div className={`text-lg font-bold w-6 ${
                  index === 0 ? 'text-[var(--warning)]' : 
                  index === 1 ? 'text-gray-400' :
                  index === 2 ? 'text-amber-600' : 'text-[var(--text-muted)]'
                }`}>
                  {index + 1}
                </div>
                <div className="text-2xl">{player.emoji}</div>
                <div className="flex-1">
                  <p className="font-medium" style={{ color: player.color }}>
                    {player.name}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">
                    {player.matches} matches • {player.uniques} unique
                  </p>
                </div>
                <div className="text-xl font-bold">{player.score}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Awards */}
        {(awards.mindMelder || awards.creative) && (
          <div className="card mb-6">
            <h3 className="text-sm font-semibold text-[var(--text-muted)] mb-3">
              Awards
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {awards.mindMelder && (
                <div className="bg-[var(--surface)] p-3 rounded-lg text-center">
                  <div className="text-2xl mb-1">🧠</div>
                  <p className="text-xs text-[var(--text-muted)]">Mind Melder</p>
                  <p className="font-medium text-sm flex items-center justify-center gap-1">
                    <span>{awards.mindMelder.emoji}</span>
                    <span style={{ color: awards.mindMelder.color }}>
                      {awards.mindMelder.name}
                    </span>
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">
                    {awards.mindMelder.matches} matches
                  </p>
                </div>
              )}
              {awards.creative && (
                <div className="bg-[var(--surface)] p-3 rounded-lg text-center">
                  <div className="text-2xl mb-1">🎨</div>
                  <p className="text-xs text-[var(--text-muted)]">Creative Thinker</p>
                  <p className="font-medium text-sm flex items-center justify-center gap-1">
                    <span>{awards.creative.emoji}</span>
                    <span style={{ color: awards.creative.color }}>
                      {awards.creative.name}
                    </span>
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">
                    {awards.creative.uniques} unique
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Play again */}
        <a
          href="/"
          className="btn btn-primary w-full"
        >
          Play Again
        </a>
      </div>
    </div>
  )
}
