import { useState, useEffect, useCallback, useMemo } from 'react'
import { submitCaptionParty, submitCaptionVoteParty, advanceCaptionRound } from '../../services/gameService'

// Pre-generate confetti pieces
const CONFETTI_PIECES = Array.from({ length: 25 }).map((_, i) => ({
  id: i,
  left: `${(i * 4) % 100}%`,
  delay: `${(i * 0.04) % 1}s`,
  color: ['#f97316', '#22c55e', '#3b82f6', '#a855f7', '#ec4899', '#eab308'][i % 6],
  borderRadius: i % 2 === 0 ? '50%' : '0',
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
            borderRadius: p.borderRadius,
          }}
        />
      ))}
    </div>
  )
}

export default function CaptionThisParty({ game, gameId, currentPlayer }) {
  const [caption, setCaption] = useState('')
  const [selectedCaption, setSelectedCaption] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [roundResults, setRoundResults] = useState(null)
  const [isAdvancing, setIsAdvancing] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60)
  
  const currentRound = game?.currentRound || 0
  const scene = game?.prompts?.[currentRound]
  const roundData = game?.rounds?.[currentRound]
  const players = useMemo(() => game?.partyPlayers || [], [game?.partyPlayers])
  const totalRounds = game?.totalRounds || 6
  const isHost = currentPlayer?.isHost
  
  // Check phases
  const hasSubmittedCaption = roundData?.captions?.[currentPlayer?.id]
  const allCaptioned = roundData?.captionsComplete
  const hasVoted = roundData?.votes?.[currentPlayer?.id]
  const allVoted = roundData?.complete
  
  // Determine phase
  const getPhase = () => {
    if (allVoted) return 'reveal'
    if (allCaptioned && !allVoted) return 'voting'
    return 'writing'
  }
  const phase = getPhase()
  
  // Submit caption handler (defined early for timer use)
  const submitCaption = useCallback(async (text) => {
    if (!text || isSubmitting || hasSubmittedCaption) return
    
    setIsSubmitting(true)
    try {
      await submitCaptionParty(gameId, currentRound, text)
    } catch (err) {
      console.error('Failed to submit:', err)
    }
    setIsSubmitting(false)
  }, [gameId, currentRound, isSubmitting, hasSubmittedCaption])
  
  // Reset state when round changes
  useEffect(() => {
    setCaption('')
    setSelectedCaption(null)
    setIsSubmitting(false)
    setShowResults(false)
    setRoundResults(null)
    setIsAdvancing(false)
    setTimeLeft(60)
  }, [currentRound])
  
  // Timer for writing phase
  useEffect(() => {
    if (phase !== 'writing' || hasSubmittedCaption) return
    
    const captionRef = { current: caption } // Capture current caption in ref
    captionRef.current = caption
    
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          // Auto-submit current caption when timer ends
          if (captionRef.current.trim()) {
            submitCaption(captionRef.current.trim())
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)
    
    return () => clearInterval(interval)
  }, [phase, hasSubmittedCaption, submitCaption, caption])
  
  const calculateResults = useCallback(() => {
    if (!roundData?.captions || !roundData?.votes) return
    
    const results = {
      captions: [],
      voteCounts: {},
      scores: {},
      winner: null,
      maxVotes: 0,
    }
    
    // Initialize
    players.forEach(p => { 
      results.voteCounts[p.id] = 0
      results.scores[p.id] = 0
    })
    
    // Count votes
    Object.values(roundData.votes).forEach(voteData => {
      const votedFor = voteData.votedFor
      results.voteCounts[votedFor] = (results.voteCounts[votedFor] || 0) + 1
    })
    
    // Calculate scores and find winner
    Object.entries(results.voteCounts).forEach(([playerId, voteCount]) => {
      results.scores[playerId] = voteCount * 100
      if (voteCount > results.maxVotes) {
        results.maxVotes = voteCount
        results.winner = playerId
      }
    })
    
    // Bonus for winner (if they got any votes)
    if (results.winner && results.maxVotes > 0) {
      // Check for ties
      const winnersAtMax = Object.entries(results.voteCounts)
        .filter(([, count]) => count === results.maxVotes)
        .map(([id]) => id)
      
      if (winnersAtMax.length === 1) {
        results.scores[results.winner] += 200 // Solo winner bonus
      } else {
        // Split bonus for ties
        winnersAtMax.forEach(id => {
          results.scores[id] += 100
        })
      }
    }
    
    // Build captions array for display
    Object.entries(roundData.captions).forEach(([playerId, data]) => {
      results.captions.push({
        playerId,
        text: data.caption,
        votes: results.voteCounts[playerId] || 0,
        score: results.scores[playerId] || 0,
        isWinner: results.voteCounts[playerId] === results.maxVotes && results.maxVotes > 0,
      })
    })
    
    // Sort by votes (descending)
    results.captions.sort((a, b) => b.votes - a.votes)
    
    setRoundResults(results)
  }, [roundData, players])
  
  // Calculate results when all voted
  useEffect(() => {
    if (allVoted && roundData && !showResults) {
      const timer = setTimeout(() => {
        calculateResults()
        setShowResults(true)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [allVoted, roundData, showResults, calculateResults])
  
  const handleSubmitCaption = async (e) => {
    if (e) e.preventDefault()
    submitCaption(caption.trim())
  }
  
  const handleVote = async () => {
    if (selectedCaption === null || isSubmitting || hasVoted) return
    
    setIsSubmitting(true)
    try {
      await submitCaptionVoteParty(gameId, currentRound, selectedCaption)
    } catch (err) {
      console.error('Failed to vote:', err)
    }
    setIsSubmitting(false)
  }
  
  const handleNextRound = async () => {
    if (isAdvancing) return
    setIsAdvancing(true)
    
    try {
      await advanceCaptionRound(gameId, currentRound)
    } catch (err) {
      console.error('Failed to advance:', err)
      setIsAdvancing(false)
    }
  }
  
  // Get player by ID
  const getPlayer = useCallback((playerId) => players.find(p => p.id === playerId), [players])
  
  // Build shuffled captions for voting (deterministic shuffle based on round)
  const captions = roundData?.captions
  const shuffledCaptions = useMemo(() => {
    if (!captions || phase !== 'voting') return []
    
    const captionsList = Object.entries(captions).map(([playerId, data]) => ({
      playerId,
      text: data.caption,
    }))
    
    // Seeded shuffle based on round
    return captionsList.sort((a, b) => {
      const hashA = (a.playerId + currentRound).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
      const hashB = (b.playerId + currentRound).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
      return hashA - hashB
    })
  }, [captions, currentRound, phase])
  
  // Count waiting players
  const captionedCount = Object.keys(roundData?.captions || {}).length
  const votedCount = Object.keys(roundData?.votes || {}).length
  
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
    
    return scores
  }, [game?.rounds, players])
  
  const cumulativeScores = getCumulativeScores()
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Winner confetti */}
      {showResults && roundResults?.winner === currentPlayer?.id && <Confetti />}
      
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold mb-1 flex items-center justify-center gap-2">
          <span>📸</span>
          Caption This
        </h1>
        <div className="text-sm text-[var(--text-muted)]">
          Round {currentRound + 1} of {totalRounds}
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full max-w-md mb-4">
        <div className="h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
          <div 
            className="h-full bg-[var(--ghost)] transition-all duration-500"
            style={{ width: `${((currentRound + (showResults ? 1 : 0)) / totalRounds) * 100}%` }}
          />
        </div>
      </div>
      
      {/* Scene Card */}
      <div className="card max-w-md w-full text-center mb-6 animate-fade-in">
        <div className="text-5xl mb-4 tracking-widest">{scene?.emoji}</div>
        <p className="text-lg text-[var(--text-muted)]">{scene?.description}</p>
        {scene?.hint && phase === 'writing' && (
          <p className="text-xs text-[var(--text-muted)] mt-2 opacity-60">
            💡 Hint: {scene.hint}
          </p>
        )}
      </div>
      
      {/* PHASE: WRITING */}
      {phase === 'writing' && (
        <div className="card max-w-md w-full">
          {hasSubmittedCaption ? (
            <div className="text-center">
              <div className="text-4xl mb-4 animate-pulse">✍️</div>
              <h3 className="text-lg font-semibold mb-2">Caption Submitted!</h3>
              <p className="text-[var(--text-muted)] mb-2">
                Your caption: <span className="italic">"{hasSubmittedCaption.caption}"</span>
              </p>
              <p className="text-sm text-[var(--text-muted)]">
                Waiting for {players.length - captionedCount} more player{players.length - captionedCount !== 1 ? 's' : ''}...
              </p>
              
              {/* Player status */}
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {players.map(p => {
                  const submitted = roundData?.captions?.[p.id]
                  return (
                    <div 
                      key={p.id}
                      className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                        submitted 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-[var(--bg-dark)] text-[var(--text-muted)]'
                      }`}
                    >
                      <span>{p.emoji}</span>
                      <span>{p.id === currentPlayer?.id ? 'You' : p.name}</span>
                      {submitted && <span>✓</span>}
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <>
              {/* Timer */}
              <div className="flex justify-center mb-4">
                <div className={`text-4xl font-bold ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : ''}`}>
                  {timeLeft}s
                </div>
              </div>
              
              <form onSubmit={handleSubmitCaption}>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Write a funny caption..."
                  className="input w-full mb-4 resize-none"
                  rows={3}
                  maxLength={150}
                  autoFocus
                />
                <div className="flex justify-between text-xs text-[var(--text-muted)] mb-4">
                  <span>{caption.length}/150</span>
                  <span>Be creative!</span>
                </div>
                <button
                  type="submit"
                  disabled={!caption.trim() || isSubmitting}
                  className="btn btn-primary w-full"
                >
                  {isSubmitting ? 'Submitting...' : '📝 Submit Caption'}
                </button>
              </form>
            </>
          )}
        </div>
      )}
      
      {/* PHASE: VOTING */}
      {phase === 'voting' && (
        <div className="card max-w-md w-full">
          {hasVoted ? (
            <div className="text-center">
              <div className="text-4xl mb-4 animate-pulse">🗳️</div>
              <h3 className="text-lg font-semibold mb-2">Vote Cast!</h3>
              <p className="text-[var(--text-muted)] mb-4">
                Waiting for {players.length - votedCount} more vote{players.length - votedCount !== 1 ? 's' : ''}...
              </p>
            </div>
          ) : (
            <>
              <div className="text-sm text-[var(--text-muted)] mb-4 text-center">
                Vote for the funniest caption! (You can't vote for your own)
              </div>
              
              <div className="space-y-3 mb-6">
                {shuffledCaptions.map((cap, index) => {
                  const isOwn = cap.playerId === currentPlayer?.id
                  return (
                    <button
                      key={cap.playerId}
                      onClick={() => !isOwn && setSelectedCaption(cap.playerId)}
                      disabled={isOwn}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                        isOwn
                          ? 'border-[var(--border)] opacity-50 cursor-not-allowed bg-[var(--bg-dark)]'
                          : selectedCaption === cap.playerId
                            ? 'border-[var(--primary)] bg-[var(--primary)]/10 scale-[1.02]'
                            : 'border-[var(--border)] hover:border-[var(--primary)]/50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center font-bold text-sm shrink-0">
                          {String.fromCharCode(65 + index)}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium leading-relaxed">"{cap.text}"</p>
                          {isOwn && (
                            <span className="text-xs text-[var(--text-muted)] mt-1 block">(yours)</span>
                          )}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
              
              <button
                onClick={handleVote}
                disabled={selectedCaption === null || isSubmitting}
                className="btn btn-primary w-full"
              >
                {isSubmitting ? 'Voting...' : '🗳️ Cast Vote'}
              </button>
            </>
          )}
        </div>
      )}
      
      {/* PHASE: REVEAL */}
      {phase === 'reveal' && showResults && roundResults && (
        <div className="card max-w-md w-full animate-fade-in">
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">🏆</div>
            <h3 className="text-lg font-semibold">Results</h3>
          </div>
          
          {/* Caption Results */}
          <div className="space-y-4 mb-6">
            {roundResults.captions.map((cap, i) => {
              const player = getPlayer(cap.playerId)
              const isMe = cap.playerId === currentPlayer?.id
              
              return (
                <div 
                  key={cap.playerId}
                  className={`p-4 rounded-xl ${
                    cap.isWinner 
                      ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/50' 
                      : 'bg-[var(--bg-dark)] border border-[var(--border)]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Rank */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                      i === 0 && cap.votes > 0 ? 'bg-yellow-500 text-black' : 'bg-[var(--bg-tertiary)]'
                    }`}>
                      {i === 0 && cap.votes > 0 ? '👑' : i + 1}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <p className="font-medium mb-2">"{cap.text}"</p>
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                          style={{ backgroundColor: `${player?.color}30` }}
                        >
                          {player?.emoji}
                        </span>
                        <span className="text-sm" style={{ color: player?.color }}>
                          {player?.name}
                          {isMe && <span className="text-[var(--text-muted)] ml-1">(You)</span>}
                        </span>
                      </div>
                    </div>
                    
                    {/* Votes & Score */}
                    <div className="text-right">
                      <div className="text-lg font-bold">{cap.votes} 🗳️</div>
                      <div className={`text-sm ${cap.score > 0 ? 'text-[var(--success)]' : 'text-[var(--text-muted)]'}`}>
                        +{cap.score}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          
          {/* Current Standings */}
          <div className="mb-6">
            <div className="text-sm text-[var(--text-muted)] mb-2 text-center">Current Standings</div>
            <div className="flex flex-wrap justify-center gap-4">
              {[...players]
                .sort((a, b) => (cumulativeScores[b.id] || 0) - (cumulativeScores[a.id] || 0))
                .map((p, i) => (
                  <div 
                    key={p.id}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--bg-tertiary)]"
                  >
                    {i === 0 && cumulativeScores[p.id] > 0 && <span>👑</span>}
                    <span style={{ color: p.color }}>{p.emoji}</span>
                    <span className="font-bold">{cumulativeScores[p.id] || 0}</span>
                  </div>
                ))
              }
            </div>
          </div>
          
          {/* Next Round Button (Host only) */}
          {isHost && currentRound + 1 < totalRounds && (
            <button
              onClick={handleNextRound}
              disabled={isAdvancing}
              className="btn btn-primary w-full"
            >
              {isAdvancing ? 'Loading...' : '→ Next Round'}
            </button>
          )}
          
          {isHost && currentRound + 1 >= totalRounds && (
            <button
              onClick={handleNextRound}
              disabled={isAdvancing}
              className="btn btn-primary w-full bg-gradient-to-r from-purple-500 to-pink-500"
            >
              {isAdvancing ? 'Loading...' : '🏆 See Final Results'}
            </button>
          )}
          
          {!isHost && (
            <p className="text-center text-[var(--text-muted)] text-sm">
              Waiting for host to continue...
            </p>
          )}
        </div>
      )}
      
      {/* Leaderboard Sidebar */}
      <div className="fixed top-4 right-4 hidden md:block">
        <div className="card bg-[var(--bg-secondary)]/80 backdrop-blur-sm p-3 min-w-[140px]">
          <div className="text-xs text-[var(--text-muted)] mb-2">Scores</div>
          {[...players]
            .sort((a, b) => (cumulativeScores[b.id] || 0) - (cumulativeScores[a.id] || 0))
            .map((p) => (
              <div 
                key={p.id}
                className="flex items-center gap-2 py-1 text-sm"
              >
                <span>{p.emoji}</span>
                <span className="flex-1 truncate" style={{ color: p.color }}>{p.name}</span>
                <span className="font-mono font-bold">{cumulativeScores[p.id] || 0}</span>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}
