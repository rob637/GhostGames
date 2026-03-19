import { useState, useEffect, useCallback, useMemo } from 'react'
import { submitWordAssociation, advanceWordAssociationRound } from '../../services/gameService'
import { calculateWordMatches } from '../../utils/wordAssociationPrompts'
import { playTurnSound, playVictorySound, playMatchSound, playTickSound } from '../../utils/sounds'
import Confetti from '../Confetti'

export default function WordAssociation({ game, gameId, currentPlayer }) {
  const [answer, setAnswer] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [roundScores, setRoundScores] = useState(null)
  const [isAdvancing, setIsAdvancing] = useState(false)
  const [timeLeft, setTimeLeft] = useState(15)
  
  const currentRound = game?.currentRound || 0
  const prompt = game?.prompts?.[currentRound]
  const roundData = game?.rounds?.[currentRound]
  const players = useMemo(() => game?.partyPlayers || [], [game?.partyPlayers])
  const totalRounds = game?.totalRounds || 8
  const isHost = currentPlayer?.isHost
  
  // Check if current player has answered
  const hasAnswered = !!roundData?.answers?.[currentPlayer?.id]
  
  // Check if all players answered
  const allAnswered = roundData?.complete
  
  // Submit handler (for timer auto-submit)
  const submitAnswer = useCallback(async (text) => {
    if (!text || isSubmitting || hasAnswered) return
    
    setIsSubmitting(true)
    try {
      await submitWordAssociation(gameId, currentRound, text)
    } catch (err) {
      console.error('Failed to submit:', err)
    }
    setIsSubmitting(false)
  }, [gameId, currentRound, isSubmitting, hasAnswered])
  
  // Reset state when round changes
  useEffect(() => {
    setAnswer('')
    setShowResults(false)
    setRoundScores(null)
    setIsSubmitting(false)
    setIsAdvancing(false)
    setTimeLeft(15)
  }, [currentRound])
  
  // Timer countdown
  useEffect(() => {
    if (hasAnswered || showResults) return
    
    const answerRef = { current: answer }
    answerRef.current = answer
    
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          // Auto-submit current answer when timer runs out
          if (answerRef.current.trim()) {
            submitAnswer(answerRef.current.trim())
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)
    
    return () => clearInterval(interval)
  }, [hasAnswered, showResults, submitAnswer, answer])
  
  // Calculate results when all answered
  useEffect(() => {
    if (allAnswered && roundData?.answers && !showResults) {
      const timer = setTimeout(() => {
        // Build answers object with just the answer strings
        const answersObj = {}
        Object.entries(roundData.answers).forEach(([playerId, data]) => {
          answersObj[playerId] = data.answer
        })
        
        const results = calculateWordMatches(answersObj)
        setRoundScores(results)
        setShowResults(true)
      }, 500)
      
      return () => clearTimeout(timer)
    }
  }, [allAnswered, roundData, showResults])
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    submitAnswer(answer.trim())
  }
  
  const handleNextRound = async () => {
    if (isAdvancing) return
    setIsAdvancing(true)
    
    try {
      await advanceWordAssociationRound(gameId, currentRound)
    } catch (err) {
      console.error('Failed to advance:', err)
      setIsAdvancing(false)
    }
  }
  
  // Get player by ID
  const getPlayer = useCallback((playerId) => players.find(p => p.id === playerId), [players])
  
  // Count submitted
  const submittedCount = Object.keys(roundData?.answers || {}).length
  
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
    if (roundScores?.scores) {
      Object.entries(roundScores.scores).forEach(([playerId, score]) => {
        scores[playerId] = (scores[playerId] || 0) + score
      })
    }
    
    return scores
  }, [game?.rounds, players, roundScores])
  
  const cumulativeScores = getCumulativeScores()
  
  // Check for perfect match
  const hasPerfectMatch = roundScores?.perfectMatch
  
  // Play sounds on phase changes
  useEffect(() => {
    if (hasPerfectMatch) {
      playVictorySound()
    } else if (showResults && roundScores?.matches?.length > 0) {
      playMatchSound()
    }
  }, [showResults, hasPerfectMatch, roundScores])

  // Play sound when new round starts
  useEffect(() => {
    if (!hasAnswered && prompt) {
      playTurnSound()
    }
  }, [currentRound, hasAnswered, prompt])

  // Play tick sound at 3 seconds
  useEffect(() => {
    if (timeLeft === 3 && !hasAnswered) {
      playTickSound()
    }
  }, [timeLeft, hasAnswered])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <Confetti show={hasPerfectMatch} />
      
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
            <span>💭</span> Word Association
          </h1>
          <p className="text-[var(--text-muted)] text-sm mt-1">
            Round {currentRound + 1} of {totalRounds}
          </p>
        </div>
        
        {/* Player scoreboard */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
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
              {showResults && roundScores?.scores?.[player.id] > 0 && (
                <span className="text-[var(--success)] text-xs">
                  +{roundScores.scores[player.id]}
                </span>
              )}
            </div>
          ))}
        </div>
        
        {/* Main card */}
        <div className="card">
          {/* Prompt word */}
          <div className="text-center mb-6">
            <p className="text-[var(--text-muted)] text-xs uppercase tracking-wider mb-2">
              What comes to mind?
            </p>
            <div className="text-5xl font-black tracking-tight text-[var(--ghost)]">
              {prompt?.word || 'WORD'}
            </div>
          </div>
          
          {/* Timer (when not submitted and not showing results) */}
          {!hasAnswered && !showResults && (
            <div className="flex justify-center mb-4">
              <div className={`text-3xl font-bold ${timeLeft <= 5 ? 'text-[var(--danger)] animate-pulse' : 'text-[var(--text-muted)]'}`}>
                {timeLeft}s
              </div>
            </div>
          )}
          
          {/* Input phase */}
          {!showResults && !hasAnswered && (
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your association..."
                className="input w-full text-center text-lg mb-4"
                maxLength={30}
                autoFocus
                disabled={isSubmitting}
              />
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={!answer.trim() || isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </form>
          )}
          
          {/* Waiting for others */}
          {!showResults && hasAnswered && (
            <div className="text-center py-4">
              <div className="text-4xl mb-3">⏳</div>
              <p className="text-[var(--text-muted)]">
                Waiting for others... ({submittedCount}/{players.length})
              </p>
              <p className="text-sm mt-2">
                Your answer: <span className="font-semibold">{roundData?.answers?.[currentPlayer?.id]?.answer}</span>
              </p>
            </div>
          )}
          
          {/* Results phase */}
          {showResults && roundData?.answers && (
            <div className="space-y-4">
              {/* Perfect match celebration */}
              {hasPerfectMatch && (
                <div className="text-center py-3 bg-[var(--success)] bg-opacity-10 rounded-lg mb-4">
                  <div className="text-3xl mb-1">🎯</div>
                  <p className="font-bold text-[var(--success)]">PERFECT MATCH!</p>
                  <p className="text-sm text-[var(--text-muted)]">Everyone thought the same thing!</p>
                </div>
              )}
              
              {/* Show all answers grouped by match */}
              <div className="space-y-3">
                {Object.entries(roundScores?.matchGroups || {}).map(([normalized, groupPlayerIds]) => {
                  const originalAnswer = roundData.answers[groupPlayerIds[0]]?.answer
                  const isMatch = groupPlayerIds.length > 1
                  
                  return (
                    <div
                      key={normalized}
                      className={`p-3 rounded-lg ${
                        isMatch 
                          ? 'bg-[var(--success)] bg-opacity-10 border border-[var(--success)] border-opacity-30'
                          : 'bg-[var(--surface)]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xl font-bold">
                          {originalAnswer}
                        </span>
                        {isMatch && (
                          <span className="text-xs bg-[var(--success)] text-white px-2 py-0.5 rounded-full">
                            +{(groupPlayerIds.length - 1) * 100} each
                          </span>
                        )}
                        {!isMatch && (
                          <span className="text-xs bg-[var(--accent)] text-white px-2 py-0.5 rounded-full">
                            +50 unique
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {groupPlayerIds.map(playerId => {
                          const player = getPlayer(playerId)
                          return (
                            <div
                              key={playerId}
                              className="flex items-center gap-1 text-sm"
                              style={{ color: player?.color }}
                            >
                              <span>{player?.emoji}</span>
                              <span>{player?.name}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
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
                      : 'Next Word →'}
                </button>
              )}
              
              {/* Non-host waiting message */}
              {!isHost && (
                <p className="text-center text-[var(--text-muted)] text-sm mt-4">
                  Waiting for host to continue...
                </p>
              )}
            </div>
          )}
        </div>
        
        {/* Progress dots */}
        <div className="flex justify-center gap-1.5 mt-6">
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
