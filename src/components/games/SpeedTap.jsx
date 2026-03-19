import { useState, useEffect, useRef, useCallback } from 'react'

// Play a quick beep sound
function playBeep(frequency = 800, duration = 100) {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    oscillator.frequency.value = frequency
    oscillator.type = 'sine'
    
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + duration / 1000)
  } catch (e) {
    // Audio not supported
  }
}

const TOTAL_ROUNDS = 5

export default function SpeedTap({ onBack }) {
  const [gameState, setGameState] = useState('idle') // idle, waiting, ready, result, gameover
  const [round, setRound] = useState(0)
  const [reactionTimes, setReactionTimes] = useState([])
  const [currentReaction, setCurrentReaction] = useState(null)
  const [tooEarly, setTooEarly] = useState(false)
  const [ghostPosition, setGhostPosition] = useState({ x: 50, y: 50 })
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('speedTapHighScore')
    return saved ? parseInt(saved, 10) : null
  })
  
  const startTimeRef = useRef(null)
  const timeoutRef = useRef(null)

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  // Random position for the ghost (within safe bounds)
  const randomizeGhostPosition = () => {
    setGhostPosition({
      x: 20 + Math.random() * 60, // 20-80%
      y: 20 + Math.random() * 60, // 20-80%
    })
  }

  // Start a new round
  const startRound = useCallback(() => {
    setTooEarly(false)
    setCurrentReaction(null)
    setGameState('waiting')
    randomizeGhostPosition()
    
    // Random delay between 1.5 and 4 seconds
    const delay = 1500 + Math.random() * 2500
    
    timeoutRef.current = setTimeout(() => {
      startTimeRef.current = performance.now()
      setGameState('ready')
      playBeep(600, 150)
    }, delay)
  }, [])

  // Start a new game
  const startGame = () => {
    setRound(1)
    setReactionTimes([])
    setCurrentReaction(null)
    setTooEarly(false)
    startRound()
  }

  // Handle tap on the game area
  const handleTap = useCallback(() => {
    if (gameState === 'waiting') {
      // Tapped too early!
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      setTooEarly(true)
      setGameState('result')
      playBeep(200, 300) // Low error sound
      
      // Add penalty time (999ms)
      setReactionTimes(prev => [...prev, 999])
      setCurrentReaction(999)
    } else if (gameState === 'ready') {
      // Good tap! Record reaction time
      const reactionTime = Math.round(performance.now() - startTimeRef.current)
      setReactionTimes(prev => [...prev, reactionTime])
      setCurrentReaction(reactionTime)
      setGameState('result')
      
      // Sound varies by speed
      if (reactionTime < 200) {
        playBeep(1000, 100) // High pitch for fast
      } else if (reactionTime < 350) {
        playBeep(800, 100) // Medium
      } else {
        playBeep(600, 100) // Lower for slow
      }
    }
  }, [gameState])

  // Continue to next round or end game
  const continueGame = () => {
    if (round >= TOTAL_ROUNDS) {
      // Game over - calculate average
      const avg = Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
      
      // Update high score (lower is better)
      if (!highScore || avg < highScore) {
        setHighScore(avg)
        localStorage.setItem('speedTapHighScore', avg.toString())
      }
      
      setGameState('gameover')
    } else {
      setRound(r => r + 1)
      startRound()
    }
  }

  // Get reaction time rating
  const getRating = (time) => {
    if (time >= 999) return { text: 'Too Early!', emoji: '💀', color: 'text-red-400' }
    if (time < 150) return { text: 'Superhuman!', emoji: '⚡', color: 'text-yellow-400' }
    if (time < 200) return { text: 'Lightning!', emoji: '🔥', color: 'text-orange-400' }
    if (time < 250) return { text: 'Fast!', emoji: '🚀', color: 'text-green-400' }
    if (time < 350) return { text: 'Good', emoji: '👍', color: 'text-blue-400' }
    if (time < 500) return { text: 'Average', emoji: '😐', color: 'text-gray-400' }
    return { text: 'Slow...', emoji: '🐢', color: 'text-gray-500' }
  }

  // Calculate average
  const getAverage = () => {
    if (reactionTimes.length === 0) return null
    return Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
          <span>⚡</span>
          Speed Tap
        </h1>
        <div className="flex gap-4 justify-center text-sm">
          {round > 0 && (
            <span className="text-[var(--text-muted)]">
              Round: <span className="text-[var(--text-primary)] font-bold">{round}/{TOTAL_ROUNDS}</span>
            </span>
          )}
          {highScore && (
            <span className="text-[var(--text-muted)]">
              Best Avg: <span className="text-yellow-500 font-bold">{highScore}ms</span>
            </span>
          )}
        </div>
      </div>

      {/* Game Area */}
      <div 
        onClick={handleTap}
        className={`
          relative w-full max-w-md aspect-square rounded-3xl mb-6
          flex items-center justify-center
          transition-all duration-200 cursor-pointer
          ${gameState === 'idle' ? 'bg-[var(--card-bg)]' : ''}
          ${gameState === 'waiting' ? 'bg-red-900/30 border-2 border-red-500/50' : ''}
          ${gameState === 'ready' ? 'bg-green-900/30 border-2 border-green-500/50' : ''}
          ${gameState === 'result' ? 'bg-[var(--card-bg)]' : ''}
          ${gameState === 'gameover' ? 'bg-[var(--card-bg)]' : ''}
        `}
      >
        {/* Idle state */}
        {gameState === 'idle' && (
          <div className="text-center">
            <div className="text-6xl mb-4">👻</div>
            <p className="text-[var(--text-muted)]">Tap to start</p>
          </div>
        )}

        {/* Waiting state */}
        {gameState === 'waiting' && (
          <div className="text-center">
            <p className="text-xl text-red-400 font-semibold animate-pulse">Wait for the ghost...</p>
            <p className="text-sm text-[var(--text-muted)] mt-2">Don't tap yet!</p>
          </div>
        )}

        {/* Ready state - Ghost appears! */}
        {gameState === 'ready' && (
          <div 
            className="absolute text-7xl animate-bounce-in"
            style={{ 
              left: `${ghostPosition.x}%`, 
              top: `${ghostPosition.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            👻
          </div>
        )}

        {/* Result state */}
        {gameState === 'result' && currentReaction && (
          <div className="text-center animate-fade-in">
            {tooEarly ? (
              <>
                <div className="text-6xl mb-2">💀</div>
                <p className="text-2xl font-bold text-red-400">Too Early!</p>
                <p className="text-[var(--text-muted)] mt-2">+999ms penalty</p>
              </>
            ) : (
              <>
                <div className="text-6xl mb-2">{getRating(currentReaction).emoji}</div>
                <p className={`text-4xl font-bold ${getRating(currentReaction).color}`}>
                  {currentReaction}ms
                </p>
                <p className={`text-lg ${getRating(currentReaction).color}`}>
                  {getRating(currentReaction).text}
                </p>
              </>
            )}
          </div>
        )}

        {/* Game Over state */}
        {gameState === 'gameover' && (
          <div className="text-center animate-fade-in">
            <div className="text-6xl mb-4">🏁</div>
            <p className="text-3xl font-bold mb-2">
              {getAverage()}ms
            </p>
            <p className={`text-lg ${getRating(getAverage()).color}`}>
              {getRating(getAverage()).text} {getRating(getAverage()).emoji}
            </p>
            {getAverage() === highScore && (
              <p className="text-yellow-400 mt-2 font-semibold">🎉 New Best!</p>
            )}
          </div>
        )}
      </div>

      {/* Reaction times display */}
      {reactionTimes.length > 0 && gameState !== 'gameover' && (
        <div className="flex gap-2 mb-4 flex-wrap justify-center">
          {reactionTimes.map((time, i) => (
            <div 
              key={i}
              className={`
                px-3 py-1 rounded-full text-sm font-mono
                ${time >= 999 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}
              `}
            >
              {time >= 999 ? '✗' : `${time}ms`}
            </div>
          ))}
        </div>
      )}

      {/* All times display for game over */}
      {gameState === 'gameover' && (
        <div className="mb-6">
          <div className="flex gap-2 flex-wrap justify-center mb-4">
            {reactionTimes.map((time, i) => (
              <div 
                key={i}
                className={`
                  px-3 py-1 rounded-full text-sm font-mono
                  ${time >= 999 ? 'bg-red-500/20 text-red-400' : 'bg-[var(--card-bg)] text-[var(--text-primary)]'}
                `}
              >
                {time >= 999 ? '✗' : `${time}ms`}
              </div>
            ))}
          </div>
          <p className="text-center text-[var(--text-muted)] text-sm">
            Average of {TOTAL_ROUNDS} rounds
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        {gameState === 'idle' && (
          <button
            onClick={startGame}
            className="btn btn-primary px-8 py-3 text-lg"
          >
            ⚡ Start
          </button>
        )}
        {gameState === 'result' && (
          <button
            onClick={continueGame}
            className="btn btn-primary px-8 py-3 text-lg"
          >
            {round >= TOTAL_ROUNDS ? '🏁 See Results' : '→ Next Round'}
          </button>
        )}
        {gameState === 'gameover' && (
          <button
            onClick={startGame}
            className="btn btn-primary px-8 py-3 text-lg"
          >
            ⚡ Play Again
          </button>
        )}
        <button
          onClick={onBack}
          className="btn btn-secondary px-6 py-3"
        >
          ← Back
        </button>
      </div>

      {/* Instructions */}
      {gameState === 'idle' && (
        <div className="mt-8 text-center text-[var(--text-muted)] text-sm max-w-xs">
          <p>Wait for the 👻 ghost to appear, then tap as fast as you can!</p>
          <p className="mt-2">Tap too early = 999ms penalty</p>
        </div>
      )}
    </div>
  )
}
