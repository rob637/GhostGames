import { useState, useEffect, useMemo, useRef } from 'react'
import { submitStorySentence } from '../../services/gameService'
import { validateWord } from '../../utils/storyStarters'
import QuitButton from '../QuitButton'
import PlayAgainButton from '../PlayAgainButton'

export default function StoryChain({ game, gameId, player }) {
  const [word, setWord] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const storyEndRef = useRef(null)
  const inputRef = useRef(null)
  
  const words = useMemo(() => game.sentences || [], [game.sentences])
  const currentTurn = game.currentTurn
  const isMyTurn = currentTurn === player?.role
  const opponent = player?.role === 'player1' ? game.players?.player2 : game.players?.player1
  const totalRounds = game.totalRounds || 75
  const starterWord = game.starter || 'Once'

  // Auto-scroll to bottom when new words added
  useEffect(() => {
    storyEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [words.length])

  // Auto-focus input when it's my turn
  useEffect(() => {
    if (isMyTurn && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isMyTurn])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!word.trim() || isSubmitting || !isMyTurn) return
    
    const validation = validateWord(word)
    if (!validation.valid) {
      setError(validation.reason)
      return
    }
    
    setError('')
    setIsSubmitting(true)
    
    try {
      await submitStorySentence(gameId, word.trim(), player.role)
      setWord('')
    } catch (err) {
      setError(err.message || 'Failed to submit')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Game finished
  if (game.status === 'finished' || words.length >= totalRounds) {
    const fullStory = starterWord + ' ' + words.map(w => w.text).join(' ')
    
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="card max-w-lg w-full animate-slide-up">
          <div className="text-5xl text-center mb-4">📖</div>
          <h2 className="text-2xl font-bold text-center mb-4">Your Story!</h2>
          
          {/* Full story */}
          <div className="bg-[var(--bg-tertiary)] rounded-xl p-4 mb-6 max-h-[50vh] overflow-y-auto">
            <p className="text-lg leading-relaxed">
              <span className="text-white font-semibold">{starterWord}</span>{' '}
              {words.map((w, i) => (
                <span 
                  key={i}
                  className={w.playerId === player?.id ? 'text-[var(--accent)]' : 'text-[var(--warning)]'}
                >
                  {w.text}{' '}
                </span>
              ))}
            </p>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={async () => {
                if (navigator.share) {
                  await navigator.share({ title: 'Our Story', text: fullStory })
                } else {
                  await navigator.clipboard.writeText(fullStory)
                }
              }}
              className="btn btn-secondary flex-1"
            >
              Share Story
            </button>
            <PlayAgainButton game={game} gameId={gameId} className="flex-1" />
          </div>
          
          <a href="/" className="block mt-4 text-sm text-[var(--text-muted)] hover:text-white text-center">
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
          <span className="text-2xl">📖</span>
          <span className="font-semibold">Story Chain</span>
        </div>
        <div className="text-sm">
          {words.length} / {totalRounds} words
        </div>
      </header>

      {/* Story display */}
      <div className="flex-1 overflow-y-auto py-4">
        <div className="card">
          {/* Story text flowing naturally */}
          <div className="text-lg leading-relaxed">
            <span className="text-white font-semibold">{starterWord}</span>{' '}
            {words.map((w, i) => (
              <span 
                key={i}
                className={`${
                  w.playerId === player?.id 
                    ? 'text-[var(--accent)]' 
                    : 'text-[var(--warning)]'
                }`}
              >
                {w.text}{' '}
              </span>
            ))}
            {isMyTurn && (
              <span className="inline-block w-2 h-5 bg-white/50 animate-pulse" />
            )}
            <span ref={storyEndRef} />
          </div>
          
          {words.length === 0 && (
            <p className="text-center text-[var(--text-muted)] mt-4">
              Add the next word...
            </p>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="py-4 border-t border-white/10">
        {isMyTurn ? (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={word}
                onChange={(e) => setWord(e.target.value.replace(/\s/g, ''))}
                placeholder="Add one word..."
                className="input flex-1 text-center text-lg"
                maxLength={20}
                disabled={isSubmitting}
                autoComplete="off"
                autoCapitalize="off"
              />
              <button
                type="submit"
                disabled={!word.trim() || isSubmitting}
                className="btn btn-primary px-6"
              >
                {isSubmitting ? '...' : '→'}
              </button>
            </div>
            {error && (
              <p className="text-[var(--danger)] text-sm text-center">{error}</p>
            )}
            <p className="text-xs text-[var(--text-muted)] text-center">
              One word at a time • Keep the story going!
            </p>
          </form>
        ) : (
          <div className="text-center py-4">
            <p className="text-[var(--text-muted)] animate-pulse">
              Waiting for {opponent?.name || 'friend'}'s word...
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
