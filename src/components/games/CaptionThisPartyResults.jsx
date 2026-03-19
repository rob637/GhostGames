import { useMemo } from 'react'
import Confetti from '../Confetti'

export default function CaptionThisPartyResults({ game, currentPlayer }) {
  const players = useMemo(() => game?.partyPlayers || [], [game?.partyPlayers])
  
  // Calculate final scores and stats
  const finalStats = useMemo(() => {
    const scores = {}
    const totalVotes = {}
    const roundWins = {}
    
    players.forEach(p => { 
      scores[p.id] = 0
      totalVotes[p.id] = 0
      roundWins[p.id] = 0
    })
    
    game?.rounds?.forEach((round) => {
      if (round?.roundScores) {
        Object.entries(round.roundScores).forEach(([playerId, score]) => {
          scores[playerId] = (scores[playerId] || 0) + score
        })
      }
      
      // Count votes received
      if (round?.votes) {
        Object.values(round.votes).forEach(voteData => {
          totalVotes[voteData.votedFor] = (totalVotes[voteData.votedFor] || 0) + 1
        })
      }
      
      // Track round wins
      if (round?.captions) {
        let maxVotes = 0
        let winners = []
        
        Object.keys(round.captions).forEach(playerId => {
          const votes = Object.values(round.votes || {}).filter(v => v.votedFor === playerId).length
          if (votes > maxVotes) {
            maxVotes = votes
            winners = [playerId]
          } else if (votes === maxVotes && votes > 0) {
            winners.push(playerId)
          }
        })
        
        winners.forEach(w => {
          roundWins[w] = (roundWins[w] || 0) + 1
        })
      }
    })
    
    return { scores, totalVotes, roundWins }
  }, [game?.rounds, players])
  
  // Sort players by score
  const sortedPlayers = useMemo(() => {
    return [...players]
      .map(p => ({ 
        ...p, 
        score: finalStats.scores[p.id] || 0,
        votes: finalStats.totalVotes[p.id] || 0,
        wins: finalStats.roundWins[p.id] || 0,
      }))
      .sort((a, b) => b.score - a.score)
  }, [players, finalStats])
  
  const winner = sortedPlayers[0]
  const isWinner = winner?.id === currentPlayer?.id
  
  // Awards
  const mostVotes = [...sortedPlayers].sort((a, b) => b.votes - a.votes)[0]
  const mostWins = [...sortedPlayers].sort((a, b) => b.wins - a.wins)[0]
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Celebration for winner */}
      <Confetti show={isWinner} />
      
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 animate-slide-up">
          <div className="text-6xl mb-4">📸</div>
          <h1 className="text-3xl font-bold mb-2">Game Over!</h1>
          <p className="text-[var(--text-muted)]">Caption This Complete</p>
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
            🗳️ {winner?.votes} total votes • 👑 {winner?.wins} round wins
          </div>
        </div>
        
        {/* Awards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="card bg-pink-500/10 border-pink-500/30 text-center p-3">
            <div className="text-2xl mb-1">🎯</div>
            <div className="text-xs text-[var(--text-muted)]">Most Votes</div>
            <div className="font-semibold text-pink-400 flex items-center justify-center gap-1">
              <span>{mostVotes?.emoji}</span>
              <span>{mostVotes?.name}</span>
            </div>
            <div className="text-xs text-[var(--text-muted)]">{mostVotes?.votes} votes</div>
          </div>
          <div className="card bg-yellow-500/10 border-yellow-500/30 text-center p-3">
            <div className="text-2xl mb-1">👑</div>
            <div className="text-xs text-[var(--text-muted)]">Most Wins</div>
            <div className="font-semibold text-yellow-400 flex items-center justify-center gap-1">
              <span>{mostWins?.emoji}</span>
              <span>{mostWins?.name}</span>
            </div>
            <div className="text-xs text-[var(--text-muted)]">{mostWins?.wins} wins</div>
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
                      🗳️ {p.votes} votes • 👑 {p.wins} wins
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
