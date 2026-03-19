import { useState, useEffect, useCallback, useMemo } from 'react'
import { submitRanking, advanceRankingRound } from '../../services/gameService'
import { playTurnSound, playVictorySound, playMatchSound } from '../../utils/sounds'
import { showToast } from '../Toast'
import Confetti from '../Confetti'

export default function RankedChoice({ game, gameId, currentPlayer }) {
  const [ranking, setRanking] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [roundResults, setRoundResults] = useState(null)
  const [isAdvancing, setIsAdvancing] = useState(false)
  
  const currentRound = game?.currentRound || 0
  const prompt = game?.prompts?.[currentRound]
  const roundData = game?.rounds?.[currentRound]
  const players = useMemo(() => game?.partyPlayers || [], [game?.partyPlayers])
  const totalRounds = game?.totalRounds || 6
  const isHost = currentPlayer?.isHost
  
  // Check if current player has submitted
  const hasSubmitted = !!roundData?.rankings?.[currentPlayer?.id]
  
  // Check if all players submitted
  const allSubmitted = roundData?.complete
  
  // Calculate results function
  const calculateResults = useCallback(() => {
    if (!roundData?.rankings) return
    
    const rankings = roundData.rankings
    const playerIds = Object.keys(rankings)
    const results = {
      comparisons: [],
      scores: {},
      consensusRanking: null,
      perfectMatches: [],
    }
    
    // Initialize scores
    players.forEach(p => { results.scores[p.id] = 0 })
    
    // Use round scores from backend
    if (roundData.roundScores) {
      Object.entries(roundData.roundScores).forEach(([pid, score]) => {
        results.scores[pid] = score
      })
    }
    
    // Calculate comparing between players
    playerIds.forEach(pid => {
      const playerRanking = rankings[pid].ranking
      const player = players.find(p => p.id === pid)
      
      playerIds.forEach(otherPid => {
        if (pid >= otherPid) return // Avoid duplicates
        
        const otherPlayer = players.find(p => p.id === otherPid)
        const otherRanking = rankings[otherPid].ranking
        
        const matchPercent = roundData.matchPercentages?.[pid]?.[otherPid] || 0
        
        results.comparisons.push({
          player1: player,
          player2: otherPlayer,
          ranking1: playerRanking,
          ranking2: otherRanking,
          matchPercent,
        })
        
        // Track perfect matches
        if (matchPercent === 100) {
          results.perfectMatches.push([player, otherPlayer])
        }
      })
    })
    
    // Use consensus from backend
    if (roundData.consensus) {
      results.consensusRanking = roundData.consensus
    }
    
    setRoundResults(results)
  }, [roundData, players])
  
  // Initialize ranking on round change
  useEffect(() => {
    if (prompt?.options) {
      setRanking([...prompt.options])
    }
    setSelectedIndex(null)
    setIsSubmitting(false)
    setShowResults(false)
    setRoundResults(null)
    setIsAdvancing(false)
  }, [currentRound, prompt])
  
  // Calculate results when all submitted
  useEffect(() => {
    if (allSubmitted && roundData?.rankings && !showResults) {
      const timer = setTimeout(() => {
        calculateResults()
        setShowResults(true)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [allSubmitted, roundData, showResults, calculateResults])
  
  // Handle tap to swap
  const handleItemTap = (index) => {
    if (hasSubmitted) return
    
    if (selectedIndex === null) {
      setSelectedIndex(index)
    } else if (selectedIndex === index) {
      setSelectedIndex(null)
    } else {
      // Swap items
      const newRanking = [...ranking]
      const temp = newRanking[selectedIndex]
      newRanking[selectedIndex] = newRanking[index]
      newRanking[index] = temp
      setRanking(newRanking)
      setSelectedIndex(null)
    }
  }
  
  // Move item up
  const moveUp = (index) => {
    if (index === 0 || hasSubmitted) return
    const newRanking = [...ranking]
    const temp = newRanking[index]
    newRanking[index] = newRanking[index - 1]
    newRanking[index - 1] = temp
    setRanking(newRanking)
  }
  
  // Move item down
  const moveDown = (index) => {
    if (index === ranking.length - 1 || hasSubmitted) return
    const newRanking = [...ranking]
    const temp = newRanking[index]
    newRanking[index] = newRanking[index + 1]
    newRanking[index + 1] = temp
    setRanking(newRanking)
  }
  
  const handleSubmit = async () => {
    if (isSubmitting || hasSubmitted || ranking.length === 0) return
    
    setIsSubmitting(true)
    try {
      await submitRanking(gameId, currentRound, ranking)
    } catch (err) {
      console.error('Failed to submit:', err)
      showToast('Failed to submit ranking. Please try again.')
    }
    setIsSubmitting(false)
  }
  
  const handleNextRound = async () => {
    if (isAdvancing) return
    setIsAdvancing(true)
    
    try {
      await advanceRankingRound(gameId, currentRound)
    } catch (err) {
      console.error('Failed to advance:', err)
      showToast('Failed to continue. Please try again.')
      setIsAdvancing(false)
    }
  }
  
  // Get player by ID
  const getPlayer = useCallback((playerId) => players.find(p => p.id === playerId), [players])
  
  // Count submitted
  const submittedCount = Object.keys(roundData?.rankings || {}).length
  
  // Cumulative scores
  const getCumulativeScores = useCallback(() => {
    const scores = {}
    players.forEach(p => { scores[p.id] = 0 })
    
    game?.rounds?.forEach((round) => {
      if (round?.roundScores) {
        Object.entries(round.roundScores).forEach(([playerId, score]) => {
          scores[playerId] = (scores[playerId] || 0) + score
        })
      }
    })
    
    // Add current round scores if showing results
    if (roundResults?.scores) {
      Object.entries(roundResults.scores).forEach(([playerId, score]) => {
        scores[playerId] = (scores[playerId] || 0) + score
      })
    }
    
    return scores
  }, [game?.rounds, players, roundResults])
  
  const cumulativeScores = getCumulativeScores()
  
  // Check for perfect matches
  const hasPerfectMatch = roundResults?.perfectMatches?.length >= 2

  // Play sounds on phase changes
  useEffect(() => {
    if (hasPerfectMatch) {
      playVictorySound()
    } else if (showResults && roundResults?.comparisons?.some(c => c.matchPercent >= 80)) {
      playMatchSound()
    }
  }, [showResults, hasPerfectMatch, roundResults])

  // Play sound when new round starts
  useEffect(() => {
    if (!hasSubmitted && prompt) {
      playTurnSound()
    }
  }, [currentRound, hasSubmitted, prompt])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <Confetti show={hasPerfectMatch} />
      
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
            <span>📊</span> Ranked Choice
          </h1>
          <p className="text-[var(--text-muted)] text-sm mt-1">
            Round {currentRound + 1} of {totalRounds}
          </p>
        </div>
        
        {/* Player scoreboard */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {players.map((player) => (
            <div
              key={player.id}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm ${
                player.id === currentPlayer?.id
                  ? 'bg-[var(--ghost)] bg-opacity-20 ring-2 ring-[var(--ghost)]'
                  : 'bg-[var(--surface)]'
              }`}
            >
              <span>{player.emoji}</span>
              <span className="font-medium">{cumulativeScores[player.id] || 0}</span>
              {showResults && roundResults?.scores?.[player.id] > 0 && (
                <span className="text-[var(--success)] text-xs">
                  +{roundResults.scores[player.id]}
                </span>
              )}
            </div>
          ))}
        </div>
        
        {/* Main card */}
        <div className="card">
          {/* Prompt */}
          <div className="text-center mb-4">
            <h2 className="text-lg font-bold">{prompt?.prompt || 'Loading...'}</h2>
            {!hasSubmitted && !showResults && (
              <p className="text-[var(--text-muted)] text-sm mt-1">
                Tap to select, tap another to swap. Or use arrows.
              </p>
            )}
          </div>
          
          {/* Ranking input */}
          {!showResults && !hasSubmitted && (
            <div className="space-y-2 mb-4">
              {ranking.map((item, index) => (
                <div
                  key={item}
                  onClick={() => handleItemTap(index)}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                    selectedIndex === index
                      ? 'bg-[var(--ghost)] bg-opacity-20 ring-2 ring-[var(--ghost)]'
                      : 'bg-[var(--surface)] hover:bg-[var(--border)]'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-[var(--ghost)] text-white flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <span className="flex-1 font-medium">{item}</span>
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); moveUp(index); }}
                      disabled={index === 0}
                      className="p-1.5 rounded hover:bg-[var(--border)] disabled:opacity-30"
                    >
                      ▲
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); moveDown(index); }}
                      disabled={index === ranking.length - 1}
                      className="p-1.5 rounded hover:bg-[var(--border)] disabled:opacity-30"
                    >
                      ▼
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Submit button */}
          {!showResults && !hasSubmitted && (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="btn btn-primary w-full"
            >
              {isSubmitting ? 'Submitting...' : 'Lock In Ranking'}
            </button>
          )}
          
          {/* Waiting for others */}
          {!showResults && hasSubmitted && (
            <div className="text-center py-6">
              <div className="text-4xl mb-3">⏳</div>
              <p className="text-[var(--text-muted)]">
                Waiting for others... ({submittedCount}/{players.length})
              </p>
              <div className="mt-4 space-y-1">
                {roundData?.rankings?.[currentPlayer?.id]?.ranking?.map((item, idx) => (
                  <div key={item} className="text-sm">
                    <span className="font-bold">{idx + 1}.</span> {item}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Results */}
          {showResults && roundResults && (
            <div className="space-y-4">
              {/* Perfect match celebration */}
              {hasPerfectMatch && (
                <div className="text-center py-3 bg-[var(--success)] bg-opacity-10 rounded-lg mb-4">
                  <div className="text-3xl mb-1">🎯</div>
                  <p className="font-bold text-[var(--success)]">PERFECT MATCH!</p>
                  <p className="text-sm text-[var(--text-muted)]">
                    {roundResults.perfectMatches.map(id => getPlayer(id)?.name).join(' & ')} ranked identically!
                  </p>
                </div>
              )}
              
              {/* Consensus ranking */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-[var(--text-muted)] mb-2">
                  Group Consensus
                </h3>
                <div className="space-y-1">
                  {roundResults.consensusRanking?.map((item, idx) => (
                    <div 
                      key={item} 
                      className="flex items-center gap-2 p-2 bg-[var(--surface)] rounded"
                    >
                      <span className="w-6 h-6 rounded-full bg-[var(--ghost)] text-white flex items-center justify-center text-sm font-bold">
                        {idx + 1}
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Match comparisons */}
              <div>
                <h3 className="text-sm font-semibold text-[var(--text-muted)] mb-2">
                  How You Matched
                </h3>
                <div className="space-y-2">
                  {roundResults.comparisons
                    .filter(c => c.players.includes(currentPlayer?.id))
                    .map((comp, idx) => {
                      const otherId = comp.players.find(id => id !== currentPlayer?.id)
                      const other = getPlayer(otherId)
                      return (
                        <div 
                          key={idx}
                          className={`flex items-center justify-between p-3 rounded-lg ${
                            comp.isPerfect 
                              ? 'bg-[var(--success)] bg-opacity-10 border border-[var(--success)]' 
                              : 'bg-[var(--surface)]'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span>{other?.emoji}</span>
                            <span style={{ color: other?.color }}>{other?.name}</span>
                          </div>
                          <div className={`font-bold ${
                            comp.matchPercent >= 80 ? 'text-[var(--success)]' :
                            comp.matchPercent >= 50 ? 'text-[var(--warning)]' :
                            'text-[var(--danger)]'
                          }`}>
                            {comp.matchPercent}% match
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>
              
              {/* Next round button (host only) */}
              {isHost && (
                <button
                  onClick={handleNextRound}
                  disabled={isAdvancing}
                  className="btn btn-primary w-full mt-4"
                >
                  {isAdvancing 
                    ? 'Loading...' 
                    : currentRound + 1 >= totalRounds 
                      ? 'See Final Results' 
                      : 'Next Round →'}
                </button>
              )}
              
              {/* Non-host waiting */}
              {!isHost && (
                <p className="text-center text-[var(--text-muted)] text-sm mt-4">
                  Waiting for host to continue...
                </p>
              )}
            </div>
          )}
        </div>
        
        {/* Progress dots */}
        <div className="flex justify-center gap-1.5 mt-4">
          {Array.from({ length: totalRounds }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${
                i < currentRound 
                  ? 'bg-[var(--success)]'
                  : i === currentRound
                    ? 'bg-[var(--ghost)] scale-125'
                    : 'bg-[var(--border)]'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
