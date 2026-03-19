import { useState, useEffect, useCallback } from 'react'
import { submitMostLikelyVote, advanceMostLikelyRound } from '../../services/gameService'

// Crown animation for winner reveal
function CrownReveal() {
  return (
    <div className="animate-bounce text-6xl mb-3">👑</div>
  )
}

export default function MostLikely({ game, gameId, currentPlayer }) {
  const [selectedPlayer, setSelectedPlayer] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [roundWinner, setRoundWinner] = useState(null)
  const [isAdvancing, setIsAdvancing] = useState(false)
  
  const currentRound = game?.currentRound || 0
  const prompt = game?.prompts?.[currentRound]
  const roundData = game?.rounds?.[currentRound]
  const players = game?.partyPlayers || []
  const totalRounds = game?.totalRounds || 10
  const isHost = currentPlayer?.isHost
  
  // Check if current player has voted
  const hasVoted = roundData?.votes?.[currentPlayer?.id]
  
  // Check if all players voted
  const allVoted = roundData?.complete
  
  // Reset state when round changes
  useEffect(() => {
    setSelectedPlayer(null)
    setShowResults(false)
    setRoundWinner(null)
    setIsSubmitting(false)
    setIsAdvancing(false)
  }, [currentRound])
  
  // Calculate results when all voted
  useEffect(() => {
    if (allVoted && roundData?.votes && !showResults) {
      const timer = setTimeout(() => {
        // Count votes for each player
        const voteCounts = {}
        players.forEach(p => { voteCounts[p.id] = 0 })
        
        Object.values(roundData.votes).forEach(({ votedFor }) => {
          if (voteCounts[votedFor] !== undefined) {
            voteCounts[votedFor]++
          }
        })
        
        // Find winner (most votes)
        let maxVotes = 0
        let winners = []
        Object.entries(voteCounts).forEach(([playerId, votes]) => {
          if (votes > maxVotes) {
            maxVotes = votes
            winners = [playerId]
          } else if (votes === maxVotes && votes > 0) {
            winners.push(playerId)
          }
        })
        
        setRoundWinner({ winners, voteCounts, maxVotes })
        setShowResults(true)
      }, 500)
      
      return () => clearTimeout(timer)
    }
  }, [allVoted, roundData, showResults, players])
  
  const handleVote = async () => {
    if (!selectedPlayer || isSubmitting || hasVoted) return
    
    setIsSubmitting(true)
    try {
      await submitMostLikelyVote(gameId, currentRound, selectedPlayer)
    } catch (err) {
      console.error('Failed to submit:', err)
    }
    setIsSubmitting(false)
  }
  
  const handleNextRound = async () => {
    if (isAdvancing) return
    setIsAdvancing(true)
    
    try {
      await advanceMostLikelyRound(gameId, currentRound, roundWinner)
    } catch (err) {
      console.error('Failed to advance:', err)
      setIsAdvancing(false)
    }
  }
  
  // Get player by ID
  const getPlayer = (playerId) => {
    return players.find(p => p.id === playerId)
  }
  
  // Count how many players have voted
  const votedCount = Object.keys(roundData?.votes || {}).length
  const waitingCount = players.length - votedCount
  
  // Calculate cumulative scores
  const getCumulativeScores = useCallback(() => {
    const scores = {}
    players.forEach(p => { scores[p.id] = 0 })
    
    game?.rounds?.forEach((round, i) => {
      if (round?.winnerIds && i <= currentRound) {
        round.winnerIds.forEach(winnerId => {
          scores[winnerId] = (scores[winnerId] || 0) + round.winnerPoints
        })
      }
    })
    
    return scores
  }, [game?.rounds, currentRound, players])
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold mb-1 flex items-center justify-center gap-2">
          <span>🏆</span>
          Most Likely To
        </h1>
        <div className="text-sm text-[var(--text-muted)]">
          Round {currentRound + 1} of {totalRounds}
        </div>
      </div>
      
      {/* Prompt Card */}
      <div className="card max-w-lg w-full text-center mb-6">
        <div className="text-lg font-medium text-[var(--text-muted)] mb-2">
          Who is...
        </div>
        <div className="text-2xl font-bold leading-relaxed">
          {prompt?.prompt || 'Loading...'}
        </div>
      </div>
      
      {/* Results View */}
      {showResults ? (
        <div className="card max-w-lg w-full">
          <div className="text-center">
            {roundWinner?.winners?.length > 0 ? (
              <>
                <CrownReveal />
                <div className="text-lg text-[var(--text-muted)] mb-4">
                  {roundWinner.winners.length > 1 ? 'It\'s a tie!' : 'The group has spoken!'}
                </div>
                
                {/* Winners */}
                <div className="flex flex-wrap justify-center gap-4 mb-6">
                  {roundWinner.winners.map(winnerId => {
                    const winner = getPlayer(winnerId)
                    return (
                      <div 
                        key={winnerId}
                        className="flex flex-col items-center animate-bounce-in"
                      >
                        <div 
                          className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-2 ring-4 ring-yellow-400"
                          style={{ backgroundColor: winner?.color || '#6366f1' }}
                        >
                          {winner?.emoji || '👻'}
                        </div>
                        <div className="font-bold">{winner?.name}</div>
                        <div className="text-sm text-[var(--text-muted)]">
                          {roundWinner.voteCounts[winnerId]} vote{roundWinner.voteCounts[winnerId] !== 1 ? 's' : ''}
                        </div>
                      </div>
                    )
                  })}
                </div>
                
                {/* All Vote Breakdown */}
                <div className="border-t border-[var(--border)] pt-4 mt-4">
                  <div className="text-sm text-[var(--text-muted)] mb-3">Vote breakdown</div>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(roundWinner.voteCounts)
                      .sort((a, b) => b[1] - a[1])
                      .map(([playerId, votes]) => {
                        const player = getPlayer(playerId)
                        return (
                          <div 
                            key={playerId}
                            className="flex items-center gap-2 text-sm p-2 rounded bg-[var(--bg-dark)]"
                          >
                            <span className="text-xl">{player?.emoji}</span>
                            <span className="flex-1 truncate">{player?.name}</span>
                            <span className="font-bold">{votes}</span>
                          </div>
                        )
                      })}
                  </div>
                </div>
                
                {/* Scoreboard */}
                <div className="border-t border-[var(--border)] pt-4 mt-4">
                  <div className="text-sm text-[var(--text-muted)] mb-3">Current Standings</div>
                  <div className="flex flex-wrap justify-center gap-3">
                    {Object.entries(getCumulativeScores())
                      .sort((a, b) => b[1] - a[1])
                      .map(([playerId, score], i) => {
                        const player = getPlayer(playerId)
                        return (
                          <div 
                            key={playerId}
                            className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm ${
                              i === 0 && score > 0
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-[var(--bg-dark)]'
                            }`}
                          >
                            <span>{player?.emoji}</span>
                            <span className="font-medium">{score}</span>
                          </div>
                        )
                      })}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-[var(--text-muted)]">
                No votes this round! 🤷
              </div>
            )}
          </div>
          
          {/* Next Round Button (Host Only) */}
          {isHost && (
            <button
              onClick={handleNextRound}
              disabled={isAdvancing}
              className="btn btn-primary w-full mt-6"
            >
              {isAdvancing 
                ? 'Starting...' 
                : currentRound + 1 >= totalRounds 
                  ? 'See Final Results' 
                  : 'Next Round'
              }
            </button>
          )}
          
          {!isHost && (
            <div className="text-center text-sm text-[var(--text-muted)] mt-6">
              Waiting for host to continue...
            </div>
          )}
        </div>
      ) : hasVoted ? (
        /* Waiting View */
        <div className="card max-w-lg w-full text-center">
          <div className="text-4xl mb-4 animate-pulse">🎯</div>
          <h3 className="text-lg font-semibold mb-2">Vote Submitted!</h3>
          <p className="text-[var(--text-muted)] mb-4">
            Waiting for {waitingCount} more player{waitingCount !== 1 ? 's' : ''}...
          </p>
          
          {/* Show who has voted */}
          <div className="flex flex-wrap justify-center gap-3">
            {players.map(p => {
              const voted = roundData?.votes?.[p.id]
              return (
                <div 
                  key={p.id}
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                    voted 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-[var(--bg-dark)] text-[var(--text-muted)]'
                  }`}
                >
                  <span>{p.emoji}</span>
                  <span>{p.name}</span>
                  {voted && <span>✓</span>}
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        /* Voting View */
        <div className="card max-w-lg w-full">
          <div className="text-center mb-4">
            <div className="text-sm text-[var(--text-muted)]">
              Pick who best fits the prompt
            </div>
          </div>
          
          {/* Player Selection Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {players.map(player => (
              <button
                key={player.id}
                onClick={() => setSelectedPlayer(player.id)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedPlayer === player.id
                    ? 'border-[var(--primary)] bg-[var(--primary)]/10 scale-105'
                    : 'border-[var(--border)] hover:border-[var(--primary)]/50'
                }`}
              >
                <div 
                  className="w-12 h-12 mx-auto rounded-full flex items-center justify-center text-2xl mb-2"
                  style={{ backgroundColor: player.color }}
                >
                  {player.emoji}
                </div>
                <div className="font-medium text-sm truncate">
                  {player.name}
                  {player.id === currentPlayer?.id && (
                    <span className="text-[var(--text-muted)]"> (you)</span>
                  )}
                </div>
              </button>
            ))}
          </div>
          
          {/* Submit Button */}
          <button
            onClick={handleVote}
            disabled={!selectedPlayer || isSubmitting}
            className="btn btn-primary w-full"
          >
            {isSubmitting ? 'Submitting...' : 'Lock In Vote'}
          </button>
          
          {/* Vote Status */}
          <div className="text-center text-sm text-[var(--text-muted)] mt-4">
            {votedCount > 0 && (
              <span>{votedCount} of {players.length} voted</span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
