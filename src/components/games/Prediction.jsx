import { useState, useEffect, useCallback, useMemo } from 'react'
import { submitPrediction, submitPredictionAnswer, advancePredictionRound } from '../../services/gameService'
import { playTurnSound, playVictorySound, playMatchSound } from '../../utils/sounds'
import Confetti from '../Confetti'

// Crystal ball animation for reveals
function CrystalBall({ correct }) {
  return (
    <div className={`text-6xl transition-all duration-500 ${correct ? 'scale-125' : 'grayscale opacity-50'}`}>
      {correct ? '🔮' : '💨'}
    </div>
  )
}

export default function Prediction({ game, gameId, currentPlayer }) {
  const [selectedOption, setSelectedOption] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [roundResults, setRoundResults] = useState(null)
  const [isAdvancing, setIsAdvancing] = useState(false)
  
  const currentRound = game?.currentRound || 0
  const question = game?.prompts?.[currentRound]
  const roundData = game?.rounds?.[currentRound]
  const players = useMemo(() => game?.partyPlayers || [], [game?.partyPlayers])
  const totalRounds = game?.totalRounds || 8
  const isHost = currentPlayer?.isHost
  
  // Determine the hot seat player (rotates through players)
  const hotSeatIndex = currentRound % players.length
  const hotSeatPlayer = players[hotSeatIndex]
  const isInHotSeat = currentPlayer?.id === hotSeatPlayer?.id
  
  // Get predictors (everyone except hot seat)
  const predictors = useMemo(() => players.filter(p => p.id !== hotSeatPlayer?.id), [players, hotSeatPlayer?.id])
  
  // Check current phase
  const hasPredicted = roundData?.predictions?.[currentPlayer?.id]
  const hasAnswered = roundData?.answer !== undefined
  const allPredicted = roundData?.predictionsComplete
  const roundComplete = roundData?.complete
  
  // Determine phase
  const getPhase = () => {
    if (roundComplete) return 'reveal'
    if (allPredicted && !hasAnswered) return 'answer' // Hot seat answers
    if (allPredicted && hasAnswered) return 'reveal'
    return 'predict'
  }
  const phase = getPhase()
  
  // Replace {name} in question
  const displayQuestion = question?.question?.replace('{name}', hotSeatPlayer?.name || 'Player') || ''
  
  // Reset state when round changes
  useEffect(() => {
    setSelectedOption(null)
    setIsSubmitting(false)
    setShowResults(false)
    setRoundResults(null)
    setIsAdvancing(false)
  }, [currentRound])
  
  // Calculate results function
  const calculateResults = useCallback(() => {
    if (!roundData?.predictions || roundData?.answer === undefined) return
    
    const actualAnswer = roundData.answer
    const results = {
      correctPredictors: [],
      wrongPredictors: [],
      scores: {},
      hotSeatScore: 0,
      perfectPrediction: false,
    }
    
    // Initialize scores
    players.forEach(p => { results.scores[p.id] = 0 })
    
    // Check each prediction
    Object.entries(roundData.predictions).forEach(([playerId, data]) => {
      if (data.prediction === actualAnswer) {
        results.correctPredictors.push(playerId)
        results.scores[playerId] = 100 // Correct prediction
      } else {
        results.wrongPredictors.push(playerId)
      }
    })
    
    // Hot seat scoring: 50 points per person fooled
    results.hotSeatScore = results.wrongPredictors.length * 50
    if (hotSeatPlayer) {
      results.scores[hotSeatPlayer.id] = results.hotSeatScore
    }
    
    // Perfect prediction bonus
    if (results.correctPredictors.length === predictors.length && predictors.length > 1) {
      results.perfectPrediction = true
      results.correctPredictors.forEach(playerId => {
        results.scores[playerId] += 50 // Bonus for group think
      })
    }
    
    setRoundResults(results)
  }, [roundData, players, hotSeatPlayer, predictors.length])
  
  // Calculate results when round is complete
  useEffect(() => {
    if (roundComplete && roundData && !showResults) {
      const timer = setTimeout(() => {
        calculateResults()
        setShowResults(true)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [roundComplete, roundData, showResults, calculateResults])
  
  const handlePredict = async () => {
    if (selectedOption === null || isSubmitting || hasPredicted || isInHotSeat) return
    
    setIsSubmitting(true)
    try {
      await submitPrediction(gameId, currentRound, selectedOption)
    } catch (err) {
      console.error('Failed to predict:', err)
    }
    setIsSubmitting(false)
  }
  
  const handleAnswer = async () => {
    if (selectedOption === null || isSubmitting || !isInHotSeat || hasAnswered) return
    
    setIsSubmitting(true)
    try {
      await submitPredictionAnswer(gameId, currentRound, selectedOption)
    } catch (err) {
      console.error('Failed to answer:', err)
    }
    setIsSubmitting(false)
  }
  
  const handleNextRound = async () => {
    if (isAdvancing) return
    setIsAdvancing(true)
    
    try {
      await advancePredictionRound(gameId, currentRound)
    } catch (err) {
      console.error('Failed to advance:', err)
      setIsAdvancing(false)
    }
  }
  
  // Get player by ID
  const getPlayer = (playerId) => players.find(p => p.id === playerId)
  
  // Count predictions
  const predictionCount = Object.keys(roundData?.predictions || {}).length
  const waitingCount = predictors.length - predictionCount
  
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

  // Play sounds on phase changes
  useEffect(() => {
    if (showResults && roundResults?.perfectPrediction) {
      playVictorySound()
    } else if (showResults && roundResults?.correctPlayers?.length > 0) {
      playMatchSound()
    }
  }, [showResults, roundResults])

  // Play sound when it's your turn to answer
  useEffect(() => {
    const phase = roundData?.phase || 'predicting'
    if (phase === 'answering' && isInHotSeat) {
      playTurnSound()
    }
  }, [roundData?.phase, isInHotSeat])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Perfect prediction confetti */}
      <Confetti show={showResults && roundResults?.perfectPrediction} />
      
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold mb-1 flex items-center justify-center gap-2">
          <span>🔮</span>
          Prediction
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
      
      {/* Hot Seat Player Card */}
      <div className="card max-w-md w-full text-center mb-4 animate-fade-in">
        <div className="text-sm text-[var(--text-muted)] mb-2">
          {phase === 'predict' ? 'Predict how they\'ll answer!' : 
           phase === 'answer' ? 'Your turn to answer!' :
           'The verdict is in!'}
        </div>
        <div className="flex items-center justify-center gap-3 mb-4">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center text-3xl animate-bounce-in"
            style={{ backgroundColor: `${hotSeatPlayer?.color}30`, borderWidth: 3, borderColor: hotSeatPlayer?.color }}
          >
            {hotSeatPlayer?.emoji}
          </div>
          <div className="text-left">
            <div className="text-lg font-bold" style={{ color: hotSeatPlayer?.color }}>
              {hotSeatPlayer?.name}
              {isInHotSeat && <span className="text-[var(--text-muted)] text-sm ml-2">(You!)</span>}
            </div>
            <div className="text-sm text-[var(--text-muted)]">
              {isInHotSeat ? 'You\'re in the hot seat!' : 'is in the hot seat'}
            </div>
          </div>
        </div>
      </div>
      
      {/* Question Card */}
      <div className="card max-w-md w-full bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/30 text-center mb-6">
        <div className="text-xl font-bold leading-relaxed">
          {displayQuestion}
        </div>
      </div>
      
      {/* PHASE: PREDICT (non-hot-seat players) */}
      {phase === 'predict' && !isInHotSeat && (
        <div className="card max-w-md w-full">
          {hasPredicted ? (
            <div className="text-center">
              <div className="text-4xl mb-4 animate-pulse">🔮</div>
              <h3 className="text-lg font-semibold mb-2">Prediction Locked!</h3>
              <p className="text-[var(--text-muted)] mb-4">
                You predicted: <span className="font-bold text-[var(--primary)]">{question?.options?.[hasPredicted.prediction]}</span>
              </p>
              <p className="text-sm text-[var(--text-muted)]">
                Waiting for {waitingCount} more prediction{waitingCount !== 1 ? 's' : ''}...
              </p>
              
              {/* Predictor status */}
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {predictors.map(p => {
                  const predicted = roundData?.predictions?.[p.id]
                  return (
                    <div 
                      key={p.id}
                      className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm transition-all ${
                        predicted 
                          ? 'bg-purple-500/20 text-purple-400' 
                          : 'bg-[var(--bg-dark)] text-[var(--text-muted)]'
                      }`}
                    >
                      <span>{p.emoji}</span>
                      <span>{p.id === currentPlayer?.id ? 'You' : p.name}</span>
                      {predicted && <span>✓</span>}
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <>
              <div className="text-sm text-[var(--text-muted)] mb-4 text-center">
                What do you think {hotSeatPlayer?.name} will choose?
              </div>
              
              <div className="space-y-3 mb-6">
                {question?.options?.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedOption(index)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      selectedOption === index
                        ? 'border-[var(--primary)] bg-[var(--primary)]/10 scale-[1.02]'
                        : 'border-[var(--border)] hover:border-[var(--primary)]/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        selectedOption === index ? 'bg-[var(--primary)] text-white' : 'bg-[var(--bg-tertiary)]'
                      }`}>
                        {index === 0 ? 'A' : 'B'}
                      </div>
                      <div className="font-medium">{option}</div>
                    </div>
                  </button>
                ))}
              </div>
              
              <button
                onClick={handlePredict}
                disabled={selectedOption === null || isSubmitting}
                className="btn btn-primary w-full"
              >
                {isSubmitting ? 'Locking in...' : '🔮 Lock In Prediction'}
              </button>
            </>
          )}
        </div>
      )}
      
      {/* PHASE: PREDICT (hot seat player waits) */}
      {phase === 'predict' && isInHotSeat && (
        <div className="card max-w-md w-full text-center">
          <div className="text-5xl mb-4 animate-bounce">🤔</div>
          <h3 className="text-lg font-semibold mb-2">Think About Your Answer...</h3>
          <p className="text-[var(--text-muted)] mb-4">
            Everyone is predicting what you'll choose!
          </p>
          <p className="text-sm text-[var(--text-muted)]">
            Waiting for {waitingCount} prediction{waitingCount !== 1 ? 's' : ''}...
          </p>
          
          {/* Predictor status */}
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {predictors.map(p => {
              const predicted = roundData?.predictions?.[p.id]
              return (
                <div 
                  key={p.id}
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm transition-all ${
                    predicted 
                      ? 'bg-purple-500/20 text-purple-400' 
                      : 'bg-[var(--bg-dark)] text-[var(--text-muted)]'
                  }`}
                >
                  <span>{p.emoji}</span>
                  <span>{p.name}</span>
                  {predicted && <span>✓</span>}
                </div>
              )
            })}
          </div>
        </div>
      )}
      
      {/* PHASE: ANSWER (hot seat player answers) */}
      {phase === 'answer' && isInHotSeat && (
        <div className="card max-w-md w-full animate-bounce-in">
          <div className="text-center mb-4">
            <div className="text-4xl mb-2">⭐</div>
            <h3 className="text-lg font-semibold">Your Turn!</h3>
            <p className="text-[var(--text-muted)] text-sm">
              Everyone has made their prediction. What's YOUR answer?
            </p>
          </div>
          
          <div className="space-y-3 mb-6">
            {question?.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => setSelectedOption(index)}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                  selectedOption === index
                    ? 'border-[var(--success)] bg-[var(--success)]/10 scale-[1.02]'
                    : 'border-[var(--border)] hover:border-[var(--success)]/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    selectedOption === index ? 'bg-[var(--success)] text-white' : 'bg-[var(--bg-tertiary)]'
                  }`}>
                    {index === 0 ? 'A' : 'B'}
                  </div>
                  <div className="font-medium">{option}</div>
                </div>
              </button>
            ))}
          </div>
          
          <button
            onClick={handleAnswer}
            disabled={selectedOption === null || isSubmitting}
            className="btn btn-primary w-full"
          >
            {isSubmitting ? 'Revealing...' : '✨ Reveal My Answer!'}
          </button>
        </div>
      )}
      
      {/* PHASE: ANSWER (others wait for hot seat) */}
      {phase === 'answer' && !isInHotSeat && (
        <div className="card max-w-md w-full text-center">
          <div className="text-5xl mb-4 animate-pulse">⏳</div>
          <h3 className="text-lg font-semibold mb-2">Waiting for {hotSeatPlayer?.name}...</h3>
          <p className="text-[var(--text-muted)]">
            They're choosing their answer!
          </p>
        </div>
      )}
      
      {/* PHASE: REVEAL */}
      {phase === 'reveal' && showResults && roundResults && (
        <div className="card max-w-md w-full animate-fade-in">
          {/* The Answer */}
          <div className="text-center mb-6">
            <div className="text-sm text-[var(--text-muted)] mb-2">{hotSeatPlayer?.name} chose:</div>
            <div className="text-3xl font-bold text-[var(--primary)] mb-2">
              {question?.options?.[roundData?.answer]}
            </div>
            
            {roundResults.perfectPrediction && (
              <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/50">
                <div className="text-2xl mb-1">🎯✨</div>
                <div className="font-bold text-purple-400">PERFECT PREDICTION!</div>
                <div className="text-sm text-[var(--text-muted)]">Everyone knew exactly what they'd pick!</div>
              </div>
            )}
          </div>
          
          {/* Prediction Results */}
          <div className="space-y-3 mb-6">
            {predictors.map(p => {
              const prediction = roundData?.predictions?.[p.id]
              const predictedOption = prediction?.prediction
              const isCorrect = predictedOption === roundData?.answer
              const player = getPlayer(p.id)
              
              return (
                <div 
                  key={p.id}
                  className={`p-3 rounded-xl flex items-center gap-3 transition-all ${
                    isCorrect 
                      ? 'bg-[var(--success)]/10 border border-[var(--success)]/50' 
                      : 'bg-[var(--bg-dark)] border border-[var(--border)]'
                  }`}
                >
                  <CrystalBall correct={isCorrect} />
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                    style={{ backgroundColor: `${player?.color}30` }}
                  >
                    {player?.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium" style={{ color: player?.color }}>
                      {player?.name}
                      {p.id === currentPlayer?.id && <span className="text-[var(--text-muted)] ml-1">(You)</span>}
                    </div>
                    <div className="text-sm text-[var(--text-muted)]">
                      Predicted: {question?.options?.[predictedOption]}
                    </div>
                  </div>
                  <div className={`font-bold ${isCorrect ? 'text-[var(--success)]' : 'text-[var(--text-muted)]'}`}>
                    {isCorrect ? '+100' : '+0'}
                  </div>
                </div>
              )
            })}
            
            {/* Hot Seat Player Score */}
            <div 
              className={`p-3 rounded-xl flex items-center gap-3 ${
                roundResults.hotSeatScore > 0 
                  ? 'bg-orange-500/10 border border-orange-500/50' 
                  : 'bg-[var(--bg-dark)] border border-[var(--border)]'
              }`}
            >
              <div className="text-3xl">🎪</div>
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                style={{ backgroundColor: `${hotSeatPlayer?.color}30` }}
              >
                {hotSeatPlayer?.emoji}
              </div>
              <div className="flex-1">
                <div className="font-medium" style={{ color: hotSeatPlayer?.color }}>
                  {hotSeatPlayer?.name}
                  {isInHotSeat && <span className="text-[var(--text-muted)] ml-1">(You)</span>}
                </div>
                <div className="text-sm text-[var(--text-muted)]">
                  {roundResults.wrongPredictors.length > 0 
                    ? `Fooled ${roundResults.wrongPredictors.length} player${roundResults.wrongPredictors.length !== 1 ? 's' : ''}!`
                    : 'Everyone knew your answer!'
                  }
                </div>
              </div>
              <div className={`font-bold ${roundResults.hotSeatScore > 0 ? 'text-orange-400' : 'text-[var(--text-muted)]'}`}>
                +{roundResults.hotSeatScore}
              </div>
            </div>
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
