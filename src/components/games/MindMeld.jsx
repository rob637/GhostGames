import { useState, useEffect, useCallback } from 'react'
import { submitMindMeldAnswer, advanceMindMeldRound } from '../../services/gameService'
import { normalizeAnswer, answersMatch, calculateRoundMatches } from '../../utils/mindMeldPrompts'

// Confetti component for perfect melds
function Confetti() {
  const pieces = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 0.5}s`,
    color: ['#f97316', '#22c55e', '#3b82f6', '#a855f7', '#ec4899', '#eab308'][Math.floor(Math.random() * 6)],
  }))
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {pieces.map(p => (
        <div
          key={p.id}
          className="absolute w-3 h-3 animated-confetti"
          style={{
            left: p.left,
            top: '-10px',
            backgroundColor: p.color,
            animationDelay: p.delay,
            borderRadius: Math.random() > 0.5 ? '50%' : '0',
          }}
        />
      ))}
    </div>
  )
}

export default function MindMeld({ game, gameId, currentPlayer }) {
  const [answer, setAnswer] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [roundScores, setRoundScores] = useState(null)
  const [isAdvancing, setIsAdvancing] = useState(false)
  
  const currentRound = game?.currentRound || 0
  const prompt = game?.prompts?.[currentRound]
  const roundData = game?.rounds?.[currentRound]
  const players = game?.partyPlayers || []
  const totalRounds = game?.totalRounds || 5
  const isHost = currentPlayer?.isHost
  
  // Check if current player has answered
  const hasAnswered = roundData?.answers?.[currentPlayer?.id]
  
  // Check if all players answered
  const allAnswered = roundData?.complete
  
  // Reset state when round changes
  useEffect(() => {
    setAnswer('')
    setShowResults(false)
    setRoundScores(null)
    setIsSubmitting(false)
    setIsAdvancing(false)
  }, [currentRound])
  
  // Calculate results when all answered
  useEffect(() => {
    if (allAnswered && roundData?.answers && !showResults) {
      // Short delay for dramatic effect
      const timer = setTimeout(() => {
        // Build answers object with just the answer strings
        const answersObj = {}
        Object.entries(roundData.answers).forEach(([playerId, data]) => {
          answersObj[playerId] = data.answer
        })
        
        const results = calculateRoundMatches(answersObj)
        setRoundScores(results)
        setShowResults(true)
      }, 500)
      
      return () => clearTimeout(timer)
    }
  }, [allAnswered, roundData, showResults])
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!answer.trim() || isSubmitting || hasAnswered) return
    
    setIsSubmitting(true)
    try {
      await submitMindMeldAnswer(gameId, currentRound, answer)
    } catch (err) {
      console.error('Failed to submit:', err)
    }
    setIsSubmitting(false)
  }
  
  const handleNextRound = async () => {
    if (isAdvancing) return
    setIsAdvancing(true)
    
    try {
      await advanceMindMeldRound(gameId, currentRound)
    } catch (err) {
      console.error('Failed to advance:', err)
      setIsAdvancing(false)
    }
  }
  
  // Get player by ID
  const getPlayer = (playerId) => {
    return players.find(p => p.id === playerId)
  }
  
  // Count how many players have answered
  const answeredCount = Object.keys(roundData?.answers || {}).length
  const waitingCount = players.length - answeredCount
  
  // Calculate cumulative scores
  const getCumulativeScores = useCallback(() => {
    const scores = {}
    players.forEach(p => { scores[p.id] = 0 })
    
    game?.rounds?.forEach((round, i) => {
      if (round?.answers && i <= currentRound) {
        const answersObj = {}
        Object.entries(round.answers).forEach(([playerId, data]) => {
          answersObj[playerId] = data.answer
        })
        const results = calculateRoundMatches(answersObj)
        Object.entries(results.scores).forEach(([playerId, score]) => {
          scores[playerId] = (scores[playerId] || 0) + score
        })
      }
    })
    
    return scores
  }, [game?.rounds, currentRound, players])
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Perfect Meld Confetti */}
      {showResults && roundScores?.perfectMeld && <Confetti />}
      
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold mb-1 flex items-center justify-center gap-2">
          <span>🧠</span>
          Mind Meld
        </h1>
        <div className="text-sm text-[var(--text-muted)]">
          Round {currentRound + 1} of {totalRounds}
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full max-w-md mb-6">
        <div className="h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
          <div 
            className="h-full bg-[var(--ghost)] transition-all duration-500"
            style={{ width: `${((currentRound + (showResults ? 1 : 0)) / totalRounds) * 100}%` }}
          />
        </div>
      </div>
      
      {/* Main Game Area */}
      <div className="w-full max-w-md">
        {!showResults ? (
          // ANSWERING PHASE
          <>
            {/* Prompt */}
            <div className="card bg-[var(--ghost)]/10 border border-[var(--ghost)]/30 text-center mb-6 animate-fade-in">
              <div className="text-3xl mb-3">🎯</div>
              <h2 className="text-xl font-bold mb-2">{prompt?.category}</h2>
              {prompt?.hint && (
                <p className="text-sm text-[var(--text-muted)]">Hint: {prompt.hint}</p>
              )}
            </div>
            
            {/* Answer Input or Waiting */}
            {!hasAnswered ? (
              <form onSubmit={handleSubmit} className="mb-6 animate-fade-in">
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type your answer..."
                  className="input w-full text-center text-lg mb-4"
                  autoFocus
                  disabled={isSubmitting}
                  maxLength={50}
                />
                <button
                  type="submit"
                  disabled={!answer.trim() || isSubmitting}
                  className="btn btn-primary w-full py-4"
                >
                  {isSubmitting ? 'Submitting...' : '🧠 Lock In Answer'}
                </button>
              </form>
            ) : (
              <div className="card bg-[var(--success)]/10 border border-[var(--success)]/30 text-center mb-6 animate-fade-in">
                <div className="text-2xl mb-2">✅</div>
                <p className="text-[var(--success)] font-semibold">Answer locked in!</p>
                <p className="text-[var(--text-muted)] text-sm mt-1">
                  Your answer: <span className="font-mono">{hasAnswered.answer}</span>
                </p>
              </div>
            )}
            
            {/* Waiting Status */}
            <div className="text-center">
              {waitingCount > 0 ? (
                <p className="text-[var(--text-muted)] animate-pulse">
                  Waiting for {waitingCount} player{waitingCount > 1 ? 's' : ''}...
                </p>
              ) : (
                <p className="text-[var(--success)]">
                  Everyone answered! Revealing...
                </p>
              )}
              
              {/* Player status indicators */}
              <div className="flex justify-center gap-2 mt-4">
                {players.map((player) => {
                  const answered = roundData?.answers?.[player.id]
                  return (
                    <div
                      key={player.id}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all ${
                        answered ? 'scale-110' : 'opacity-50'
                      }`}
                      style={{ 
                        backgroundColor: `${player.color}30`,
                        borderWidth: answered ? 2 : 1,
                        borderColor: answered ? player.color : 'transparent',
                      }}
                      title={`${player.name}${answered ? ' ✓' : ' ...'}`}
                    >
                      {player.emoji}
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        ) : (
          // RESULTS PHASE
          <>
            {/* Perfect Meld Banner */}
            {roundScores?.perfectMeld && (
              <div className="card bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/50 text-center mb-6 animate-bounce-in">
                <div className="text-4xl mb-2">🎉</div>
                <h2 className="text-xl font-bold text-purple-400">PERFECT MIND MELD!</h2>
                <p className="text-[var(--text-muted)]">Everyone said the same thing! +20 bonus</p>
              </div>
            )}
            
            {/* Prompt Reminder */}
            <div className="text-center mb-4">
              <p className="text-[var(--text-muted)] text-sm">
                Category: <span className="text-[var(--text-primary)]">{prompt?.category}</span>
              </p>
            </div>
            
            {/* All Answers */}
            <div className="card mb-6 space-y-3 animate-fade-in">
              {players.map((player) => {
                const playerAnswer = roundData?.answers?.[player.id]?.answer || '—'
                const matches = roundScores?.matches?.[player.id] || []
                const score = roundScores?.scores?.[player.id] || 0
                const hasMatches = matches.length > 0
                
                return (
                  <div 
                    key={player.id}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                      hasMatches 
                        ? 'bg-[var(--success)]/10 border border-[var(--success)]/30' 
                        : 'bg-[var(--bg-tertiary)]'
                    }`}
                  >
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                      style={{ backgroundColor: `${player.color}30` }}
                    >
                      {player.emoji}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm" style={{ color: player.color }}>
                        {player.name}
                        {player.id === currentPlayer?.id && (
                          <span className="text-[var(--text-muted)] ml-1">(You)</span>
                        )}
                      </div>
                      <div className={`font-bold ${hasMatches ? 'text-[var(--success)]' : ''}`}>
                        "{playerAnswer}"
                      </div>
                    </div>
                    {score > 0 && (
                      <div className="text-[var(--success)] font-bold">
                        +{score}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            
            {/* Match Summary */}
            {roundScores && (
              <div className="text-center mb-6">
                {Object.values(roundScores.scores).some(s => s > 0) ? (
                  <p className="text-[var(--success)]">
                    🎯 {Object.values(roundScores.matches).filter(m => m.length > 0).length} player{Object.values(roundScores.matches).filter(m => m.length > 0).length !== 1 ? 's' : ''} matched!
                  </p>
                ) : (
                  <p className="text-[var(--text-muted)]">
                    No matches this round 😅
                  </p>
                )}
              </div>
            )}
            
            {/* Next Round Button (Host Only) */}
            {isHost && currentRound < totalRounds - 1 && (
              <button
                onClick={handleNextRound}
                disabled={isAdvancing}
                className="btn btn-primary w-full py-4 animate-fade-in"
              >
                {isAdvancing ? 'Loading...' : '→ Next Round'}
              </button>
            )}
            
            {/* Final Round - End Game */}
            {isHost && currentRound === totalRounds - 1 && (
              <button
                onClick={handleNextRound}
                disabled={isAdvancing}
                className="btn btn-primary w-full py-4 animate-fade-in"
              >
                {isAdvancing ? 'Loading...' : '🏆 See Final Results'}
              </button>
            )}
            
            {!isHost && (
              <div className="text-center text-[var(--text-muted)] animate-pulse">
                Waiting for host to continue...
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Score Sidebar */}
      <div className="fixed bottom-4 right-4 card bg-[var(--bg-secondary)]/90 backdrop-blur p-3 text-sm max-w-[150px]">
        <div className="font-semibold text-[var(--text-muted)] mb-2 text-xs">SCORES</div>
        {players
          .map(p => ({ ...p, score: getCumulativeScores()[p.id] || 0 }))
          .sort((a, b) => b.score - a.score)
          .map((player, i) => (
            <div key={player.id} className="flex items-center gap-2 py-1">
              <span>{player.emoji}</span>
              <span className="flex-1 truncate text-xs" style={{ color: player.color }}>
                {player.name}
              </span>
              <span className="font-bold">{player.score}</span>
            </div>
          ))
        }
      </div>
    </div>
  )
}
