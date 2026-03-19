import { useMemo } from 'react'
import Confetti from '../Confetti'

export default function RankedChoiceResults({ game, currentPlayer }) {
  const players = useMemo(() => game?.partyPlayers || [], [game?.partyPlayers])
  
  // Calculate final scores and stats
  const { finalStandings, awards } = useMemo(() => {
    const scores = {}
    const perfectMatchCounts = {}
    const avgMatchPercents = {}
    const matchCounts = {}
    
    players.forEach(p => {
      scores[p.id] = 0
      perfectMatchCounts[p.id] = 0
      avgMatchPercents[p.id] = { total: 0, count: 0 }
      matchCounts[p.id] = 0
    })
    
    game?.rounds?.forEach((round) => {
      if (round?.roundScores) {
        Object.entries(round.roundScores).forEach(([playerId, score]) => {
          scores[playerId] = (scores[playerId] || 0) + score
        })
      }
      
      // Count perfect matches
      if (round?.comparisons) {
        round.comparisons.forEach(comp => {
          if (comp.isPerfect) {
            comp.players.forEach(id => {
              perfectMatchCounts[id] = (perfectMatchCounts[id] || 0) + 1
            })
          }
          comp.players.forEach(id => {
            avgMatchPercents[id].total += comp.matchPercent
            avgMatchPercents[id].count++
          })
        })
      }
    })
    
    // Build standings
    const standings = players.map(player => ({
      ...player,
      score: scores[player.id] || 0,
      perfectMatches: perfectMatchCounts[player.id] || 0,
      avgMatch: avgMatchPercents[player.id].count > 0
        ? Math.round(avgMatchPercents[player.id].total / avgMatchPercents[player.id].count)
        : 0,
    }))
    
    standings.sort((a, b) => b.score - a.score)
    
    // Find awards
    const mostPerfects = [...standings].sort((a, b) => b.perfectMatches - a.perfectMatches)[0]
    const highestAvg = [...standings].sort((a, b) => b.avgMatch - a.avgMatch)[0]
    
    return {
      finalStandings: standings,
      awards: {
        mindReader: mostPerfects?.perfectMatches > 0 ? mostPerfects : null,
        groupThink: highestAvg?.avgMatch > 0 ? highestAvg : null,
      }
    }
  }, [game?.rounds, players])
  
  const winner = finalStandings[0]
  const isWinner = winner?.id === currentPlayer?.id
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <Confetti show={isWinner} />
      
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
            <span>📊</span> Game Over!
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
                    {player.perfectMatches} perfect • {player.avgMatch}% avg match
                  </p>
                </div>
                <div className="text-xl font-bold">{player.score}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Awards */}
        {(awards.mindReader || awards.groupThink) && (
          <div className="card mb-6">
            <h3 className="text-sm font-semibold text-[var(--text-muted)] mb-3">
              Awards
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {awards.mindReader && (
                <div className="bg-[var(--surface)] p-3 rounded-lg text-center">
                  <div className="text-2xl mb-1">🎯</div>
                  <p className="text-xs text-[var(--text-muted)]">Mind Reader</p>
                  <p className="font-medium text-sm flex items-center justify-center gap-1">
                    <span>{awards.mindReader.emoji}</span>
                    <span style={{ color: awards.mindReader.color }}>
                      {awards.mindReader.name}
                    </span>
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">
                    {awards.mindReader.perfectMatches} perfect matches
                  </p>
                </div>
              )}
              {awards.groupThink && (
                <div className="bg-[var(--surface)] p-3 rounded-lg text-center">
                  <div className="text-2xl mb-1">🧠</div>
                  <p className="text-xs text-[var(--text-muted)]">Group Thinker</p>
                  <p className="font-medium text-sm flex items-center justify-center gap-1">
                    <span>{awards.groupThink.emoji}</span>
                    <span style={{ color: awards.groupThink.color }}>
                      {awards.groupThink.name}
                    </span>
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">
                    {awards.groupThink.avgMatch}% avg match
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
