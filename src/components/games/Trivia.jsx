import { useState, useEffect, useMemo, useRef } from 'react'
import { submitTriviaAnswer } from '../../services/gameService'
import { calculatePoints } from '../../utils/triviaQuestions'
import QuitButton from '../QuitButton'
import PlayAgainButton from '../PlayAgainButton'

export default function Trivia({ game, gameId, player }) {
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [questionStartTime, setQuestionStartTime] = useState(null)
  const [timeLeft, setTimeLeft] = useState(10)
  
  const questions = useMemo(() => game.questions || [], [game.questions])
  const currentRound = game.currentRound || 0
  const currentQuestion = questions[currentRound]
  const rounds = useMemo(() => game.rounds || [], [game.rounds])
  const currentRoundData = rounds[currentRound] || {}
  
  const opponent = player?.role === 'player1' ? game.players?.player2 : game.players?.player1
  const opponentRole = player?.role === 'player1' ? 'player2' : 'player1'
  
  // Check if I've answered this round
  const myAnswer = currentRoundData[player?.role]
  const opponentAnswer = currentRoundData[opponentRole]
  const bothAnswered = myAnswer && opponentAnswer
  
  // Calculate scores
  const scores = useMemo(() => {
    let myTotal = 0
    let opponentTotal = 0
    
    rounds.forEach((round) => {
      if (round?.player1?.points) {
        if (player?.role === 'player1') myTotal += round.player1.points
        else opponentTotal += round.player1.points
      }
      if (round?.player2?.points) {
        if (player?.role === 'player2') myTotal += round.player2.points
        else opponentTotal += round.player2.points
      }
    })
    
    return { me: myTotal, opponent: opponentTotal }
  }, [rounds, player?.role])

  // Timer countdown
  useEffect(() => {
    if (!currentQuestion || myAnswer) return
    
    setQuestionStartTime(Date.now())
    setTimeLeft(10)
    
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          // Auto-submit wrong answer if time runs out
          if (!myAnswer && !isSubmitting) {
            handleSubmitAnswer(null, true)
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)
    
    return () => clearInterval(interval)
  }, [currentRound, currentQuestion?.id])

  // Reset selected answer on new round
  useEffect(() => {
    setSelectedAnswer(null)
  }, [currentRound])

  const handleSubmitAnswer = async (answer, timedOut = false) => {
    if (isSubmitting || myAnswer) return
    
    setIsSubmitting(true)
    
    const timeTaken = Date.now() - questionStartTime
    const isCorrect = answer?.toLowerCase() === currentQuestion?.answer?.toLowerCase()
    const points = timedOut ? 0 : calculatePoints(timeTaken, isCorrect)
    
    try {
      await submitTriviaAnswer(gameId, currentRound, player.role, {
        answer: answer || '',
        timeTaken,
        isCorrect,
        points,
        timedOut,
      })
    } catch (err) {
      console.error('Failed to submit answer:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSelectAnswer = (answer) => {
    if (myAnswer || isSubmitting) return
    setSelectedAnswer(answer)
    handleSubmitAnswer(answer)
  }

  // Game finished
  if (game.status === 'finished' || currentRound >= questions.length) {
    const iWon = scores.me > scores.opponent
    const tied = scores.me === scores.opponent
    
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="card max-w-md w-full text-center animate-slide-up">
          <div className="text-6xl mb-4">
            {iWon ? '🏆' : tied ? '🤝' : '😅'}
          </div>
          
          <h2 className="text-2xl font-bold mb-2">
            {iWon ? 'You Won!' : tied ? "It's a Tie!" : 'Nice Try!'}
          </h2>
          
          {/* Score comparison */}
          <div className="flex items-center justify-center gap-8 my-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-[var(--accent)]">{scores.me}</p>
              <p className="text-sm text-[var(--text-muted)]">You</p>
            </div>
            <div className="text-2xl text-[var(--text-muted)]">vs</div>
            <div className="text-center">
              <p className="text-4xl font-bold text-[var(--warning)]">{scores.opponent}</p>
              <p className="text-sm text-[var(--text-muted)]">{opponent?.name || 'Friend'}</p>
            </div>
          </div>
          
          {/* Round recap */}
          <div className="space-y-2 mb-6 max-h-[30vh] overflow-y-auto">
            {rounds.map((round, i) => {
              const q = questions[i]
              const myData = round?.[player?.role]
              const oppData = round?.[opponentRole]
              return (
                <div key={i} className="p-3 rounded-lg bg-white/5 text-left text-sm">
                  <p className="text-[var(--text-muted)] mb-1">{q?.question}</p>
                  <div className="flex justify-between">
                    <span className={myData?.isCorrect ? 'text-[var(--success)]' : 'text-[var(--danger)]'}>
                      You: {myData?.points || 0} pts
                    </span>
                    <span className={oppData?.isCorrect ? 'text-[var(--success)]' : 'text-[var(--danger)]'}>
                      {opponent?.name || 'Friend'}: {oppData?.points || 0} pts
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
          
          <PlayAgainButton game={game} gameId={gameId} />
          
          <a href="/" className="block mt-4 text-sm text-[var(--text-muted)] hover:text-white">
            ← Home
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col p-4 max-w-lg mx-auto">
      <QuitButton />
      {/* Header */}
      <header className="flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🧠</span>
          <span className="font-semibold">Trivia</span>
        </div>
        <div className="text-sm">
          Q {currentRound + 1} / {questions.length}
        </div>
      </header>
      
      {/* Score bar */}
      <div className="flex items-center justify-between py-2 px-4 bg-white/5 rounded-xl mb-4">
        <div className="text-center">
          <p className="text-lg font-bold text-[var(--accent)]">{scores.me}</p>
          <p className="text-xs text-[var(--text-muted)]">You</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-[var(--warning)]">{scores.opponent}</p>
          <p className="text-xs text-[var(--text-muted)]">{opponent?.name || 'Friend'}</p>
        </div>
      </div>

      {/* Question area */}
      <div className="flex-1 py-4">
        {bothAnswered ? (
          // Show results
          <div className="card text-center animate-slide-up">
            <div className="text-4xl mb-4">
              {myAnswer.isCorrect ? '✅' : '❌'}
            </div>
            
            <p className="text-lg font-semibold mb-2">
              {myAnswer.isCorrect ? 'Correct!' : 'Wrong!'}
            </p>
            
            <p className="text-[var(--text-muted)] mb-4">
              Answer: <strong className="text-white">{currentQuestion?.answer}</strong>
            </p>
            
            <div className="flex justify-around mb-4 text-sm">
              <div>
                <p className="text-[var(--text-muted)]">Your points</p>
                <p className={`text-xl font-bold ${myAnswer.points > 0 ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                  +{myAnswer.points}
                </p>
              </div>
              <div>
                <p className="text-[var(--text-muted)]">{opponent?.name || 'Friend'}</p>
                <p className={`text-xl font-bold ${opponentAnswer?.points > 0 ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                  +{opponentAnswer?.points || 0}
                </p>
              </div>
            </div>
            
            <p className="text-sm text-[var(--text-muted)] animate-pulse">
              Next question...
            </p>
          </div>
        ) : myAnswer ? (
          // Waiting for opponent
          <div className="card text-center">
            <div className="text-4xl mb-4 animate-bounce">⏳</div>
            <p className="text-lg font-semibold mb-2">
              {myAnswer.isCorrect ? 'Nice!' : 'Hmm...'}
            </p>
            <p className="text-[var(--text-muted)] animate-pulse">
              Waiting for {opponent?.name || 'friend'}...
            </p>
          </div>
        ) : (
          // Active question
          <div className="space-y-4">
            {/* Timer */}
            <div className="flex justify-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold border-4 ${
                timeLeft <= 3 ? 'border-[var(--danger)] text-[var(--danger)] animate-pulse' : 'border-[var(--accent)]'
              }`}>
                {timeLeft}
              </div>
            </div>
            
            {/* Question */}
            <div className="card">
              <p className="text-xs text-[var(--text-muted)] mb-2 uppercase">
                {currentQuestion?.difficulty}
              </p>
              <p className="text-lg font-semibold">
                {currentQuestion?.question}
              </p>
            </div>
            
            {/* Options */}
            <div className="grid grid-cols-2 gap-3">
              {currentQuestion?.options?.map((option, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectAnswer(option)}
                  disabled={isSubmitting || myAnswer}
                  className={`p-4 rounded-xl text-center font-medium transition-all ${
                    selectedAnswer === option
                      ? 'bg-[var(--accent)] text-white scale-95'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            
            <p className="text-center text-sm text-[var(--text-muted)]">
              Faster = more points!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
