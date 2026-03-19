import { useState, useEffect, useMemo } from 'react'
import { submitHotTakeAnswer } from '../../services/gameService'
import { getQuestion } from '../../utils/hotTakeQuestions'
import QuitButton from '../QuitButton'
import PlayAgainButton from '../PlayAgainButton'

export default function HotTake({ game, gameId, player }) {
  const [answer, setAnswer] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showResult, setShowResult] = useState(false)
  
  const currentRound = game.currentRound || 0
  const questions = useMemo(() => game.questions || [], [game.questions])
  const currentQuestion = getQuestion(questions, currentRound)
  const rounds = useMemo(() => game.rounds || [], [game.rounds])
  const currentRoundData = rounds[currentRound]
  
  const myAnswer = currentRoundData?.[player?.role]
  const opponentRole = player?.role === 'player1' ? 'player2' : 'player1'
  const opponentAnswer = currentRoundData?.[opponentRole]
  const opponent = player?.role === 'player1' ? game.players?.player2 : game.players?.player1
  
  const bothAnswered = myAnswer && opponentAnswer
  const isMatch = bothAnswered && myAnswer.toLowerCase().trim() === opponentAnswer.toLowerCase().trim()
  
  // Calculate scores
  const scores = useMemo(() => {
    let matches = 0
    rounds.forEach(round => {
      if (round?.player1 && round?.player2) {
        if (round.player1.toLowerCase().trim() === round.player2.toLowerCase().trim()) {
          matches++
        }
      }
    })
    return { matches, total: rounds.filter(r => r?.player1 && r?.player2).length }
  }, [rounds])

  // Show result when both have answered
  useEffect(() => {
    if (bothAnswered && !showResult) {
      setShowResult(true)
      // Auto-advance after 3 seconds
      const timer = setTimeout(() => {
        setShowResult(false)
        setAnswer('')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [bothAnswered, showResult])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!answer.trim() || isSubmitting || myAnswer) return
    
    setIsSubmitting(true)
    try {
      await submitHotTakeAnswer(gameId, currentRound, player.role, answer.trim())
      setAnswer('')
    } catch (err) {
      console.error('Failed to submit answer:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Game finished
  if (game.status === 'finished' || currentRound >= questions.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="card max-w-md w-full text-center animate-slide-up">
          <div className="text-6xl mb-4">
            {scores.matches >= 3 ? '🔥' : scores.matches >= 1 ? '👀' : '😬'}
          </div>
          
          <h2 className="text-2xl font-bold mb-2">
            {scores.matches >= 3 ? 'You\'re in sync!' : scores.matches >= 1 ? 'Some matches!' : 'Total opposites!'}
          </h2>
          
          <p className="text-4xl font-bold text-[var(--warning)] mb-4">
            {scores.matches} / {scores.total}
          </p>
          
          <p className="text-[var(--text-muted)] mb-6">
            You matched on {scores.matches} question{scores.matches !== 1 ? 's' : ''}
          </p>
          
          {/* Round recap */}
          <div className="space-y-2 mb-6">
            {rounds.map((round, i) => {
              const q = questions[i]
              const matched = round?.player1?.toLowerCase().trim() === round?.player2?.toLowerCase().trim()
              return (
                <div key={i} className={`p-3 rounded-lg text-left ${matched ? 'bg-[var(--success)]/20' : 'bg-white/5'}`}>
                  <p className="text-sm text-[var(--text-muted)]">{q?.question}</p>
                  <p className="text-sm mt-1">
                    You: <strong>{round?.[player?.role]}</strong> 
                    {matched ? ' ✓' : ` vs ${round?.[opponentRole]}`}
                  </p>
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
          <span className="text-2xl">🔥</span>
          <span className="font-semibold">Hot Take</span>
        </div>
        <div className="text-sm">
          Round {currentRound + 1} / {questions.length}
        </div>
      </header>
      
      {/* Score bar */}
      <div className="flex items-center justify-center gap-4 py-2">
        <span className="text-sm text-[var(--text-muted)]">Matches:</span>
        <span className="text-xl font-bold text-[var(--warning)]">{scores.matches}</span>
      </div>

      {/* Question Card */}
      <div className="flex-1 flex flex-col items-center justify-center py-8">
        {showResult && bothAnswered ? (
          // Result reveal
          <div className="card w-full text-center animate-slide-up">
            <div className="text-5xl mb-4">{isMatch ? '🎉' : '🤔'}</div>
            <h3 className="text-xl font-bold mb-4">
              {isMatch ? 'You matched!' : 'Different takes!'}
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-white/10 rounded-lg">
                <p className="text-xs text-[var(--text-muted)] mb-1">You said</p>
                <p className="font-semibold text-[var(--accent)]">{myAnswer}</p>
              </div>
              <div className="p-3 bg-white/10 rounded-lg">
                <p className="text-xs text-[var(--text-muted)] mb-1">{opponent?.name || 'They'} said</p>
                <p className="font-semibold text-[var(--warning)]">{opponentAnswer}</p>
              </div>
            </div>
            
            <p className="text-sm text-[var(--text-muted)] mt-4">
              Next question coming...
            </p>
          </div>
        ) : (
          // Question
          <div className="card w-full text-center">
            <span className="text-xs text-[var(--text-muted)] uppercase tracking-wide">
              {currentQuestion?.category}
            </span>
            <h2 className="text-2xl font-bold mt-2 mb-6">
              {currentQuestion?.question}
            </h2>
            
            {myAnswer ? (
              // Waiting for opponent
              <div className="py-4">
                <p className="text-[var(--text-muted)] mb-2">Your answer:</p>
                <p className="text-xl font-semibold text-[var(--accent)]">{myAnswer}</p>
                <p className="text-sm text-[var(--text-muted)] mt-4 animate-pulse">
                  Waiting for {opponent?.name || 'opponent'}...
                </p>
              </div>
            ) : (
              // Answer input
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type your answer..."
                  className="input text-center text-lg"
                  autoComplete="off"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!answer.trim() || isSubmitting}
                  className="btn btn-primary w-full"
                >
                  {isSubmitting ? 'Sending...' : 'Lock In 🔒'}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
      
      {/* vs indicator */}
      <div className="text-center py-4 text-sm text-[var(--text-muted)]">
        vs {opponent?.isAI ? '👻 Ghost' : opponent?.name || 'Opponent'}
      </div>
    </div>
  )
}
