import { useState, useEffect, useCallback, useRef } from 'react'

// Ghost-themed colors for the pads
const PADS = [
  { id: 0, color: 'from-purple-500 to-purple-700', activeColor: 'from-purple-300 to-purple-500', note: 'C4' },
  { id: 1, color: 'from-blue-500 to-blue-700', activeColor: 'from-blue-300 to-blue-500', note: 'E4' },
  { id: 2, color: 'from-teal-500 to-teal-700', activeColor: 'from-teal-300 to-teal-500', note: 'G4' },
  { id: 3, color: 'from-pink-500 to-pink-700', activeColor: 'from-pink-300 to-pink-500', note: 'B4' },
]

// Frequencies for each pad (musical notes)
const FREQUENCIES = {
  'C4': 261.63,
  'E4': 329.63,
  'G4': 392.00,
  'B4': 493.88,
}

// Play a tone for a pad
function playTone(note, duration = 300) {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    oscillator.frequency.value = FREQUENCIES[note]
    oscillator.type = 'sine'
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + duration / 1000)
  } catch (e) {
    // Audio not supported, continue silently
  }
}

// Play error sound
function playErrorSound() {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    oscillator.frequency.value = 150
    oscillator.type = 'sawtooth'
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.5)
  } catch (e) {
    // Audio not supported
  }
}

export default function GhostSays({ onBack }) {
  const [gameState, setGameState] = useState('idle') // idle, watching, playing, gameover
  const [sequence, setSequence] = useState([])
  const [playerIndex, setPlayerIndex] = useState(0)
  const [activePad, setActivePad] = useState(null)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('ghostSaysHighScore')
    return saved ? parseInt(saved, 10) : 0
  })
  const [level, setLevel] = useState(1)
  const [showGhost, setShowGhost] = useState(false)
  const timeoutRef = useRef(null)

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  // Add a new random pad to the sequence
  const addToSequence = useCallback(() => {
    const newPad = Math.floor(Math.random() * 4)
    setSequence(prev => [...prev, newPad])
  }, [])

  // Play the sequence for the player to watch
  const playSequence = useCallback(async (seq) => {
    setGameState('watching')
    setShowGhost(true)
    
    // Small delay before starting
    await new Promise(resolve => setTimeout(resolve, 500))
    
    for (let i = 0; i < seq.length; i++) {
      const padId = seq[i]
      setActivePad(padId)
      playTone(PADS[padId].note)
      
      // Pad lit duration decreases as level increases (faster = harder)
      const duration = Math.max(200, 500 - (level * 30))
      await new Promise(resolve => setTimeout(resolve, duration))
      
      setActivePad(null)
      
      // Gap between pads also decreases
      const gap = Math.max(100, 300 - (level * 20))
      await new Promise(resolve => setTimeout(resolve, gap))
    }
    
    setShowGhost(false)
    setGameState('playing')
    setPlayerIndex(0)
  }, [level])

  // Start a new game
  const startGame = useCallback(() => {
    setSequence([])
    setScore(0)
    setLevel(1)
    setPlayerIndex(0)
    
    // Generate first sequence item and start
    const firstPad = Math.floor(Math.random() * 4)
    const newSequence = [firstPad]
    setSequence(newSequence)
    
    // Play the sequence after a short delay
    timeoutRef.current = setTimeout(() => {
      playSequence(newSequence)
    }, 500)
  }, [playSequence])

  // Handle player tapping a pad
  const handlePadPress = useCallback((padId) => {
    if (gameState !== 'playing') return
    
    // Light up the pad and play sound
    setActivePad(padId)
    playTone(PADS[padId].note, 200)
    
    setTimeout(() => setActivePad(null), 150)
    
    // Check if correct
    if (sequence[playerIndex] === padId) {
      // Correct!
      const newIndex = playerIndex + 1
      
      if (newIndex === sequence.length) {
        // Completed the sequence! Level up
        const newScore = score + sequence.length * 10 + level * 5
        const newLevel = level + 1
        
        setScore(newScore)
        setLevel(newLevel)
        
        // Update high score if needed
        if (newScore > highScore) {
          setHighScore(newScore)
          localStorage.setItem('ghostSaysHighScore', newScore.toString())
        }
        
        // Add to sequence and play again
        const newPad = Math.floor(Math.random() * 4)
        const newSequence = [...sequence, newPad]
        setSequence(newSequence)
        
        timeoutRef.current = setTimeout(() => {
          playSequence(newSequence)
        }, 1000)
      } else {
        setPlayerIndex(newIndex)
      }
    } else {
      // Wrong! Game over
      playErrorSound()
      setGameState('gameover')
    }
  }, [gameState, sequence, playerIndex, score, level, highScore, playSequence])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
          <span className={`transition-all duration-300 ${showGhost ? 'scale-125 animate-pulse' : ''}`}>
            👻
          </span>
          Ghost Says
        </h1>
        <div className="flex gap-4 justify-center text-sm">
          <span className="text-[var(--text-muted)]">Level: <span className="text-[var(--text-primary)] font-bold">{level}</span></span>
          <span className="text-[var(--text-muted)]">Score: <span className="text-[var(--text-primary)] font-bold">{score}</span></span>
          <span className="text-[var(--text-muted)]">Best: <span className="text-yellow-500 font-bold">{highScore}</span></span>
        </div>
      </div>

      {/* Game Status */}
      <div className="mb-6 h-8 text-center">
        {gameState === 'idle' && (
          <p className="text-[var(--text-muted)]">Press Start to play!</p>
        )}
        {gameState === 'watching' && (
          <p className="text-purple-400 animate-pulse font-semibold">👻 Watch the ghost...</p>
        )}
        {gameState === 'playing' && (
          <p className="text-green-400 font-semibold">Your turn! Repeat the pattern</p>
        )}
        {gameState === 'gameover' && (
          <p className="text-red-400 font-semibold">💀 Game Over!</p>
        )}
      </div>

      {/* Game Pads */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        {PADS.map((pad) => (
          <button
            key={pad.id}
            onClick={() => handlePadPress(pad.id)}
            disabled={gameState !== 'playing'}
            className={`
              w-28 h-28 sm:w-32 sm:h-32 rounded-2xl
              bg-gradient-to-br ${activePad === pad.id ? pad.activeColor : pad.color}
              ${activePad === pad.id ? 'scale-95 shadow-lg ring-4 ring-white/50' : 'shadow-md'}
              ${gameState === 'playing' ? 'cursor-pointer hover:scale-95 active:scale-90' : 'cursor-not-allowed'}
              transition-all duration-150
              disabled:opacity-60
            `}
            style={{
              boxShadow: activePad === pad.id 
                ? `0 0 30px ${pad.id === 0 ? '#a855f7' : pad.id === 1 ? '#3b82f6' : pad.id === 2 ? '#14b8a6' : '#ec4899'}` 
                : undefined
            }}
          />
        ))}
      </div>

      {/* Sequence Progress (dots showing how far in the sequence) */}
      {gameState === 'playing' && sequence.length > 0 && (
        <div className="flex gap-1 mb-6">
          {sequence.map((_, i) => (
            <div 
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${
                i < playerIndex 
                  ? 'bg-green-500' 
                  : i === playerIndex 
                    ? 'bg-white animate-pulse' 
                    : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        {(gameState === 'idle' || gameState === 'gameover') && (
          <button
            onClick={startGame}
            className="btn btn-primary px-8 py-3 text-lg"
          >
            {gameState === 'gameover' ? '👻 Try Again' : '👻 Start'}
          </button>
        )}
        <button
          onClick={onBack}
          className="btn btn-secondary px-6 py-3"
        >
          ← Back
        </button>
      </div>

      {/* Game Over Stats */}
      {gameState === 'gameover' && (
        <div className="mt-6 card bg-[var(--card-bg)] p-6 text-center animate-fade-in">
          <p className="text-2xl font-bold mb-2">
            {score > highScore - (sequence.length * 10 + level * 5) ? '🎉 New High Score!' : 'Nice try!'}
          </p>
          <p className="text-[var(--text-muted)]">
            You reached <span className="text-[var(--text-primary)] font-bold">Level {level}</span> with a sequence of <span className="text-[var(--text-primary)] font-bold">{sequence.length}</span> pads
          </p>
        </div>
      )}
    </div>
  )
}
