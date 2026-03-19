import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { updateDrawing, submitGuess, skipDrawingRound } from '../../services/gameService'
import { getPrompt } from '../../utils/drawPrompts'
import DrawingCanvas from './DrawingCanvas'
import QuitButton from '../QuitButton'
import PlayAgainButton from '../PlayAgainButton'

const ROUND_TIME = 45 // seconds per round
const FEEDBACK_TIME = 2500 // show result for 2.5 seconds

export default function QuickDraw({ game, gameId, player }) {
  const [guess, setGuess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [localDrawing, setLocalDrawing] = useState([])
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME)
  const [wrongGuesses, setWrongGuesses] = useState([])
  const [roundFeedback, setRoundFeedback] = useState(null) // { type: 'correct'|'timeout', word: string }
  const [showWrongFlash, setShowWrongFlash] = useState(false)
  const lastUpdateRef = useRef(0)
  const timerRef = useRef(null)
  const prevRoundRef = useRef(0)
  
  const currentRound = game.currentRound || 0
  const prompts = useMemo(() => game.prompts || [], [game.prompts])
  const currentPrompt = getPrompt(prompts, currentRound)
  const rounds = useMemo(() => game.rounds || [], [game.rounds])
  
  const opponent = player?.role === 'player1' ? game.players?.player2 : game.players?.player1
  
  // Determine who draws this round (alternates)
  const drawerRole = currentRound % 2 === 0 ? 'player1' : 'player2'
  const isDrawer = player?.role === drawerRole
  
  // Parse current drawing from Firestore (stored as JSON string)
  const liveDrawing = useMemo(() => {
    if (!game.currentDrawing) return []
    try {
      return JSON.parse(game.currentDrawing)
    } catch {
      return []
    }
  }, [game.currentDrawing])
  
  // Calculate scores
  const scores = useMemo(() => {
    let correct = 0
    rounds.forEach((round) => {
      if (round?.isCorrect) correct++
    })
    return { correct, total: rounds.length }
  }, [rounds])

  // Show feedback when round changes
  useEffect(() => {
    if (currentRound > prevRoundRef.current && rounds.length > 0) {
      const lastRound = rounds[currentRound - 1]
      const lastPrompt = prompts[currentRound - 1]
      if (lastRound) {
        setRoundFeedback({
          type: lastRound.isCorrect ? 'correct' : 'timeout',
          word: lastPrompt?.word || '???'
        })
        // Clear feedback after delay
        setTimeout(() => setRoundFeedback(null), FEEDBACK_TIME)
      }
    }
    prevRoundRef.current = currentRound
  }, [currentRound, rounds, prompts])

  // Timer countdown
  useEffect(() => {
    // Reset state on new round
    setTimeLeft(ROUND_TIME)
    setWrongGuesses([])
    setGuess('')
    setLocalDrawing([])
    setShowWrongFlash(false)
    
    if (timerRef.current) clearInterval(timerRef.current)
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          // Time's up - drawer skips round
          if (isDrawer && game.status === 'active') {
            skipDrawingRound(gameId, currentRound).catch(console.error)
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [currentRound, gameId, isDrawer, game.status])

  // Stream drawing updates to Firestore (debounced)
  const handleDrawingChange = useCallback((newDrawing) => {
    setLocalDrawing(newDrawing)
    
    // Don't sync empty drawings (e.g., from Clear button)
    if (!newDrawing || newDrawing.length === 0) return
    
    // Debounce updates to Firestore (every 100ms max for smoother real-time)
    const now = Date.now()
    if (now - lastUpdateRef.current > 100) {
      lastUpdateRef.current = now
      updateDrawing(gameId, currentRound, newDrawing).catch(console.error)
    }
  }, [gameId, currentRound])

  // Final update when stroke ends - receives drawing data directly
  const handleStrokeEnd = useCallback((drawingData) => {
    if (drawingData && drawingData.length > 0) {
      updateDrawing(gameId, currentRound, drawingData).catch(console.error)
    }
  }, [gameId, currentRound])

  const handleSubmitGuess = async (e) => {
    e.preventDefault()
    if (!guess.trim() || isSubmitting) return
    
    const normalizedGuess = guess.trim().toLowerCase()
    const correctAnswer = currentPrompt?.word?.toLowerCase()
    const isCorrect = normalizedGuess === correctAnswer
    
    if (isCorrect) {
      // Correct! End round
      setIsSubmitting(true)
      if (timerRef.current) clearInterval(timerRef.current)
      await submitGuess(gameId, currentRound, guess.trim(), true)
      setIsSubmitting(false)
    } else {
      // Wrong - add to list, flash feedback, and let them try again
      setWrongGuesses(prev => [...prev, guess.trim()])
      setGuess('')
      setShowWrongFlash(true)
      setTimeout(() => setShowWrongFlash(false), 800)
    }
  }

  // Game finished
  if (game.status === 'finished' || currentRound >= prompts.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="card max-w-md w-full text-center animate-slide-up">
          <div className="text-6xl mb-4">
            {scores.correct >= 4 ? '🎨' : scores.correct >= 2 ? '✏️' : '🤔'}
          </div>
          
          <h2 className="text-2xl font-bold mb-2">
            {scores.correct >= 4 ? 'Amazing artists!' : scores.correct >= 2 ? 'Not bad!' : 'Keep practicing!'}
          </h2>
          
          <p className="text-4xl font-bold text-[var(--success)] mb-4">
            {scores.correct} / {scores.total}
          </p>
          
          <p className="text-[var(--text-muted)] mb-6">
            {scores.correct} correct guess{scores.correct !== 1 ? 'es' : ''}
          </p>
          
          {/* Round recap */}
          <div className="space-y-2 mb-6">
            {rounds.map((round, i) => {
              const prompt = prompts[i]
              return (
                <div key={i} className={`p-3 rounded-lg text-left ${round?.isCorrect ? 'bg-[var(--success)]/20' : 'bg-white/5'}`}>
                  <p className="text-sm">
                    <strong>{prompt?.word}</strong>
                    {round?.isCorrect ? ' ✓' : round?.skipped ? ' (time up)' : ''}
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
          <span className="text-2xl">✏️</span>
          <span className="font-semibold">Quick Draw</span>
        </div>
        <div className="text-sm">
          Round {currentRound + 1} / {prompts.length}
        </div>
      </header>
      
      {/* Timer and Score */}
      <div className="flex items-center justify-between py-2 px-4 bg-white/5 rounded-xl mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-[var(--text-muted)]">Correct:</span>
          <span className="text-lg font-bold text-[var(--success)]">{scores.correct}</span>
        </div>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold border-4 ${
          timeLeft <= 10 ? 'border-[var(--danger)] text-[var(--danger)] animate-pulse' : 'border-[var(--accent)]'
        }`}>
          {timeLeft}
        </div>
      </div>

      {/* Game area */}
      <div className="flex-1 py-4">
        {/* Round feedback overlay */}
        {roundFeedback && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in">
            <div className="card text-center max-w-sm mx-4 animate-slide-up">
              {roundFeedback.type === 'correct' ? (
                <>
                  <div className="text-6xl mb-4">🎉</div>
                  <h2 className="text-2xl font-bold text-[var(--success)] mb-2">Correct!</h2>
                  <p className="text-lg">It was <strong>{roundFeedback.word}</strong></p>
                </>
              ) : (
                <>
                  <div className="text-6xl mb-4">⏱️</div>
                  <h2 className="text-2xl font-bold text-[var(--warning)] mb-2">Time's Up!</h2>
                  <p className="text-lg">It was <strong>{roundFeedback.word}</strong></p>
                </>
              )}
              <p className="text-sm text-[var(--text-muted)] mt-4">Next round starting...</p>
            </div>
          </div>
        )}

        {isDrawer ? (
          // Drawing mode
          <div className="space-y-4">
            <div className="card text-center">
              <p className="text-sm text-[var(--text-muted)] mb-1">Draw this:</p>
              <p className="text-2xl font-bold text-[var(--success)]">
                {currentPrompt?.word}
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Your opponent is guessing live!
              </p>
            </div>
            
            <DrawingCanvas
              key={`drawer-${currentRound}`}
              onDrawingChange={handleDrawingChange}
              onStrokeEnd={handleStrokeEnd}
              disabled={false}
            />
            
            <p className="text-center text-sm text-[var(--text-muted)]">
              Keep drawing! They see it in real-time.
            </p>
          </div>
        ) : (
          // Guessing mode - see drawing live
          <div className="space-y-4">
            <div className="card text-center">
              <p className="text-lg font-semibold">
                Your opponent is drawing...
              </p>
              <p className="text-sm text-[var(--text-muted)]">
                Guess what it is!
              </p>
            </div>
            
            <DrawingCanvas
              key={`guesser-${currentRound}`}
              drawing={liveDrawing}
              showDrawing={true}
              disabled={true}
            />
            
            {/* Guess input */}
            <form onSubmit={handleSubmitGuess} className="space-y-3">
              {/* Wrong flash feedback */}
              {showWrongFlash && (
                <div className="text-center py-2 bg-[var(--danger)]/20 rounded-lg animate-pulse">
                  <span className="text-[var(--danger)] font-bold">❌ Nope! Try again</span>
                </div>
              )}
              
              <input
                type="text"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                placeholder="Type your guess..."
                className={`input text-center text-lg ${showWrongFlash ? 'border-[var(--danger)]' : ''}`}
                autoComplete="off"
                autoFocus
                disabled={isSubmitting}
              />
              <button
                type="submit"
                disabled={!guess.trim() || isSubmitting}
                className="btn btn-primary w-full"
              >
                {isSubmitting ? 'Checking...' : 'Guess! 🎯'}
              </button>
            </form>
            
            {/* Wrong guesses */}
            {wrongGuesses.length > 0 && (
              <div className="text-center">
                <p className="text-sm text-[var(--text-muted)]">Wrong guesses:</p>
                <p className="text-[var(--danger)]">
                  {wrongGuesses.join(', ')}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="py-2 text-center text-xs text-[var(--text-muted)]">
        {isDrawer ? "You're drawing" : "You're guessing"} • vs Opponent
      </div>
    </div>
  )
}
