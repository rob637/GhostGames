import { useState, useEffect } from 'react'
import { submitBluffAnswer, submitBluffVote, advanceBluffRound } from '../../services/gameService'

export default function BluffBattle({ game, gameId, currentPlayer }) {
  const [fakeAnswer, setFakeAnswer] = useState('')
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [phase, setPhase] = useState('writing') // 'writing' | 'voting' | 'reveal'
  const [isAdvancing, setIsAdvancing] = useState(false)
  
  const currentRound = game?.currentRound || 0
  const question = game?.prompts?.[currentRound]
  const roundData = game?.rounds?.[currentRound]
  const players = game?.partyPlayers || []
  const totalRounds = game?.totalRounds || 8
  const isHost = currentPlayer?.isHost
  
  // Check current phase
  const hasSubmittedAnswer = roundData?.answers?.[currentPlayer?.id]
  const allAnswered = roundData?.answersComplete
  const hasVoted = roundData?.votes?.[currentPlayer?.id]
  const allVoted = roundData?.complete
  
  // Determine phase
  useEffect(() => {
    if (allVoted) {
      setPhase('reveal')
    } else if (allAnswered) {
      setPhase('voting')
    } else {
      setPhase('writing')
    }
  }, [allAnswered, allVoted])
  
  // Reset state when round changes
  useEffect(() => {
    setFakeAnswer('')
    setSelectedAnswer(null)
    setIsSubmitting(false)
    setIsAdvancing(false)
  }, [currentRound])
  
  const handleSubmitAnswer = async (e) => {
    e.preventDefault()
    if (!fakeAnswer.trim() || isSubmitting || hasSubmittedAnswer) return
    
    setIsSubmitting(true)
    try {
      await submitBluffAnswer(gameId, currentRound, fakeAnswer.trim())
    } catch (err) {
      console.error('Failed to submit:', err)
    }
    setIsSubmitting(false)
  }
  
  const handleVote = async () => {
    if (selectedAnswer === null || isSubmitting || hasVoted) return
    
    setIsSubmitting(true)
    try {
      await submitBluffVote(gameId, currentRound, selectedAnswer)
    } catch (err) {
      console.error('Failed to vote:', err)
    }
    setIsSubmitting(false)
  }
  
  const handleNextRound = async () => {
    if (isAdvancing) return
    setIsAdvancing(true)
    
    try {
      await advanceBluffRound(gameId, currentRound)
    } catch (err) {
      console.error('Failed to advance:', err)
      setIsAdvancing(false)
    }
  }
  
  // Get player by ID
  const getPlayer = (playerId) => {
    return players.find(p => p.id === playerId)
  }
  
  // Build shuffled answer list for voting (only when all answered)
  const getShuffledAnswers = () => {
    if (!roundData?.answers) return []
    
    const answers = []
    
    // Add all player fake answers
    Object.entries(roundData.answers).forEach(([playerId, data]) => {
      answers.push({
        id: playerId,
        text: data.answer,
        isReal: false,
        playerId,
      })
    })
    
    // Add the real answer
    answers.push({
      id: 'real',
      text: question?.answer,
      isReal: true,
      playerId: null,
    })
    
    // Use seeded shuffle based on round
    return answers.sort((a, b) => {
      const hashA = (a.id + currentRound).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
      const hashB = (b.id + currentRound).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
      return hashA - hashB
    })
  }
  
  // Calculate results for reveal
  const getResults = () => {
    if (!roundData?.votes || !roundData?.answers) return null
    
    const answers = getShuffledAnswers()
    const votes = roundData.votes
    const scores = {}
    
    // Initialize scores
    players.forEach(p => { scores[p.id] = 0 })
    
    // Calculate points
    Object.entries(votes).forEach(([voterId, voteData]) => {
      const votedFor = voteData.votedFor
      const votedAnswer = answers.find(a => a.id === votedFor)
      
      if (votedAnswer?.isReal) {
        // Voter guessed correctly
        scores[voterId] = (scores[voterId] || 0) + 500
      } else if (votedAnswer?.playerId && votedAnswer.playerId !== voterId) {
        // Voter was fooled by another player's fake answer
        scores[votedAnswer.playerId] = (scores[votedAnswer.playerId] || 0) + 250
      }
    })
    
    // Count votes for each answer
    const voteCounts = {}
    answers.forEach(a => { voteCounts[a.id] = 0 })
    Object.values(votes).forEach(v => {
      voteCounts[v.votedFor] = (voteCounts[v.votedFor] || 0) + 1
    })
    
    return { scores, answers, voteCounts }
  }
  
  // Count waiting players
  const answeredCount = Object.keys(roundData?.answers || {}).length
  const votedCount = Object.keys(roundData?.votes || {}).length
  
  // Cumulative scores
  const getCumulativeScores = () => {
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
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold mb-1 flex items-center justify-center gap-2">
          <span>🃏</span>
          Bluff Battle
        </h1>
        <div className="text-sm text-[var(--text-muted)]">
          Round {currentRound + 1} of {totalRounds}
        </div>
      </div>
      
      {/* Question Card */}
      <div className="card max-w-lg w-full text-center mb-6">
        <div className="text-sm text-[var(--text-muted)] mb-2">
          {phase === 'writing' ? 'Make up a believable fake answer!' : 
           phase === 'voting' ? 'Which answer is REAL?' : 
           'The truth revealed!'}
        </div>
        <div className="text-xl font-bold leading-relaxed">
          {question?.question || 'Loading...'}
        </div>
      </div>
      
      {/* PHASE: WRITING */}
      {phase === 'writing' && (
        <div className="card max-w-lg w-full">
          {hasSubmittedAnswer ? (
            <div className="text-center">
              <div className="text-4xl mb-4 animate-pulse">✍️</div>
              <h3 className="text-lg font-semibold mb-2">Answer Submitted!</h3>
              <p className="text-[var(--text-muted)] mb-4">
                Waiting for {players.length - answeredCount} more player{players.length - answeredCount !== 1 ? 's' : ''}...
              </p>
              
              <div className="flex flex-wrap justify-center gap-3">
                {players.map(p => {
                  const answered = roundData?.answers?.[p.id]
                  return (
                    <div 
                      key={p.id}
                      className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                        answered 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-[var(--bg-dark)] text-[var(--text-muted)]'
                      }`}
                    >
                      <span>{p.emoji}</span>
                      <span>{p.name}</span>
                      {answered && <span>✓</span>}
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitAnswer}>
              <label className="block text-sm text-[var(--text-muted)] mb-2">
                Write a fake answer that sounds real:
              </label>
              <input
                type="text"
                value={fakeAnswer}
                onChange={(e) => setFakeAnswer(e.target.value)}
                placeholder="Your fake answer..."
                className="input w-full mb-4"
                maxLength={100}
                autoFocus
              />
              <button
                type="submit"
                disabled={!fakeAnswer.trim() || isSubmitting}
                className="btn btn-primary w-full"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Bluff'}
              </button>
            </form>
          )}
        </div>
      )}
      
      {/* PHASE: VOTING */}
      {phase === 'voting' && (
        <div className="card max-w-lg w-full">
          {hasVoted ? (
            <div className="text-center">
              <div className="text-4xl mb-4 animate-pulse">🗳️</div>
              <h3 className="text-lg font-semibold mb-2">Vote Submitted!</h3>
              <p className="text-[var(--text-muted)] mb-4">
                Waiting for {players.length - votedCount} more player{players.length - votedCount !== 1 ? 's' : ''}...
              </p>
            </div>
          ) : (
            <>
              <div className="text-sm text-[var(--text-muted)] mb-4 text-center">
                One of these is the REAL answer. Can you spot it?
              </div>
              
              <div className="space-y-3 mb-6">
                {getShuffledAnswers().map((answer, index) => (
                  <button
                    key={answer.id}
                    onClick={() => answer.playerId !== currentPlayer?.id && setSelectedAnswer(answer.id)}
                    disabled={answer.playerId === currentPlayer?.id}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      answer.playerId === currentPlayer?.id
                        ? 'border-[var(--border)] opacity-50 cursor-not-allowed bg-[var(--bg-dark)]'
                        : selectedAnswer === answer.id
                          ? 'border-[var(--primary)] bg-[var(--primary)]/10 scale-[1.02]'
                          : 'border-[var(--border)] hover:border-[var(--primary)]/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center font-bold text-sm">
                        {String.fromCharCode(65 + index)}
                      </div>
                      <div className="flex-1">
                        {answer.text}
                        {answer.playerId === currentPlayer?.id && (
                          <span className="text-xs text-[var(--text-muted)] ml-2">(yours)</span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              
              <button
                onClick={handleVote}
                disabled={selectedAnswer === null || isSubmitting}
                className="btn btn-primary w-full"
              >
                {isSubmitting ? 'Submitting...' : 'Lock In Vote'}
              </button>
            </>
          )}
        </div>
      )}
      
      {/* PHASE: REVEAL */}
      {phase === 'reveal' && (() => {
        const results = getResults()
        if (!results) return null
        
        return (
          <div className="card max-w-lg w-full">
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">🎭</div>
              <div className="text-lg font-semibold">The Real Answer Was:</div>
              <div className="text-2xl font-bold text-green-400 mt-2">
                {question?.answer}
              </div>
            </div>
            
            {/* Answer Breakdown */}
            <div className="space-y-3 mb-6">
              {results.answers.map((answer, index) => {
                const player = answer.playerId ? getPlayer(answer.playerId) : null
                const voteCount = results.voteCounts[answer.id] || 0
                
                return (
                  <div
                    key={answer.id}
                    className={`p-4 rounded-xl border-2 ${
                      answer.isReal 
                        ? 'border-green-500 bg-green-500/10' 
                        : 'border-[var(--border)] bg-[var(--bg-dark)]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="font-medium">{answer.text}</div>
                        <div className="text-sm text-[var(--text-muted)] mt-1">
                          {answer.isReal ? (
                            <span className="text-green-400">✓ The real answer!</span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <span>{player?.emoji}</span>
                              <span>{player?.name}'s bluff</span>
                            </span>
                          )}
                        </div>
                      </div>
                      {voteCount > 0 && (
                        <div className={`text-sm px-2 py-1 rounded-full ${
                          answer.isReal ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'
                        }`}>
                          {voteCount} fooled
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
            
            {/* Round Scores */}
            <div className="border-t border-[var(--border)] pt-4 mb-4">
              <div className="text-sm text-[var(--text-muted)] mb-3 text-center">Round Points</div>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(results.scores)
                  .sort((a, b) => b[1] - a[1])
                  .map(([playerId, score]) => {
                    const player = getPlayer(playerId)
                    return (
                      <div 
                        key={playerId}
                        className={`flex items-center gap-2 text-sm p-2 rounded ${
                          score > 0 ? 'bg-green-500/10' : 'bg-[var(--bg-dark)]'
                        }`}
                      >
                        <span className="text-lg">{player?.emoji}</span>
                        <span className="flex-1 truncate">{player?.name}</span>
                        <span className={`font-bold ${score > 0 ? 'text-green-400' : ''}`}>
                          +{score}
                        </span>
                      </div>
                    )
                  })}
              </div>
            </div>
            
            {/* Cumulative Standings */}
            <div className="border-t border-[var(--border)] pt-4">
              <div className="text-sm text-[var(--text-muted)] mb-3 text-center">Current Standings</div>
              <div className="flex flex-wrap justify-center gap-3">
                {Object.entries(getCumulativeScores())
                  .sort((a, b) => b[1] - a[1])
                  .map(([playerId, score], i) => {
                    const player = getPlayer(playerId)
                    // Add current round score
                    const total = score + (results.scores[playerId] || 0)
                    return (
                      <div 
                        key={playerId}
                        className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm ${
                          i === 0 && total > 0
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-[var(--bg-dark)]'
                        }`}
                      >
                        <span>{player?.emoji}</span>
                        <span className="font-medium">{total}</span>
                      </div>
                    )
                  })}
              </div>
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
        )
      })()}
    </div>
  )
}
