import { useState, useRef, useEffect, useMemo } from 'react'
import { submitWord, endGameWithLoser } from '../../services/gameService'
import { playTurnSound, playWordSound } from '../../utils/sounds'
import { getThemeById, validateWordForTheme } from '../../utils/themes'
import Timer from '../Timer'
import WordChain from './WordChain'

export default function WordVolley({ game, gameId, player }) {
  const [input, setInput] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showRules, setShowRules] = useState(true)
  const inputRef = useRef(null)
  const prevTurnRef = useRef(null)
  const prevWordsLengthRef = useRef(0)

  const isMyTurn = game.currentTurn === player?.role
  const words = useMemo(() => game.words || [], [game.words])
  const opponent = player?.role === 'player1' ? game.players?.player2 : game.players?.player1
  const theme = game.themeId ? getThemeById(game.themeId) : null

  // Auto-hide rules after first word is played
  useEffect(() => {
    if (words.length > 0) {
      setShowRules(false)
    }
  }, [words.length])

  // Play sound when it becomes your turn
  useEffect(() => {
    if (prevTurnRef.current !== null && prevTurnRef.current !== player?.role && isMyTurn) {
      playTurnSound()
    }
    prevTurnRef.current = game.currentTurn
  }, [game.currentTurn, isMyTurn, player?.role])

  // Play sound when opponent submits a word
  useEffect(() => {
    if (words.length > prevWordsLengthRef.current && words.length > 0) {
      const lastWord = words[words.length - 1]
      if (lastWord.playerId !== player?.id) {
        playWordSound()
      }
    }
    prevWordsLengthRef.current = words.length
  }, [words.length, player?.id, words])

  useEffect(() => {
    if (isMyTurn && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isMyTurn])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || isSubmitting || !isMyTurn) return

    const word = input.trim().toLowerCase()

    // Local validation
    if (word.length < 2) {
      setError('Word must be at least 2 characters')
      return
    }

    if (words.some(w => w.word.toLowerCase() === word)) {
      setError('Word already used!')
      return
    }

    // Letter chain validation (if not first word)
    if (words.length > 0) {
      const lastWord = words[words.length - 1].word.toLowerCase()
      const requiredLetter = lastWord[lastWord.length - 1]
      if (word[0] !== requiredLetter) {
        setError(`Word must start with "${requiredLetter.toUpperCase()}"`)
        return
      }
    }

    // Theme validation
    if (theme) {
      const themeCheck = validateWordForTheme(word, game.themeId)
      if (!themeCheck.valid) {
        // Player loses for violating theme!
        setError(themeCheck.reason)
        setIsSubmitting(true)
        try {
          await endGameWithLoser(gameId, player.id, `Played "${word}" - doesn't fit ${theme.name} theme`)
        } catch (err) {
          console.error('Failed to end game:', err)
        }
        return
      }
    }

    setError('')
    setIsSubmitting(true)

    try {
      await submitWord(gameId, word, player.id, player.role)
      setInput('')
    } catch (err) {
      setError(err.message || 'Failed to submit word')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTimeout = () => {
    // Timeout is handled by the backend/service
    console.log('Turn timed out')
  }

  return (
    <div className="min-h-screen flex flex-col p-4 max-w-lg mx-auto">
      {/* Rules overlay for player 2 joining */}
      {showRules && player?.role === 'player2' && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6">
          <div className="card max-w-sm text-center animate-slide-up">
            <div className="text-4xl mb-4">💬</div>
            <h2 className="text-xl font-bold mb-4">Word Volley</h2>
            
            {theme && (
              <div className="mb-4 p-3 bg-[var(--accent)]/20 rounded-lg">
                <span className="text-2xl mr-2">{theme.emoji}</span>
                <span className="font-semibold text-[var(--accent)]">{theme.name} Theme</span>
              </div>
            )}
            
            <ul className="text-sm text-left space-y-2 mb-6">
              <li>✅ Each word starts with the <strong>last letter</strong> of the previous word</li>
              <li>✅ Words must <strong>fit the theme</strong> or you lose!</li>
              <li>✅ <strong>30 seconds</strong> per turn</li>
              <li>✅ No repeating words</li>
            </ul>
            
            <button 
              onClick={() => setShowRules(false)}
              className="btn btn-primary w-full"
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">💬</span>
          <span className="font-semibold">Word Volley</span>
          {theme && (
            <span className="text-sm bg-[var(--accent)]/20 text-[var(--accent)] px-2 py-0.5 rounded-full">
              {theme.emoji} {theme.name}
            </span>
          )}
        </div>
        <div className="text-sm text-[var(--text-muted)]">
          vs {opponent?.isAI ? '👻 Ghost' : opponent?.name || 'Opponent'}
        </div>
      </header>

      {/* Word Chain */}
      <div className="flex-1 overflow-y-auto py-4">
        <WordChain words={words} currentPlayerId={player?.id} />
      </div>

      {/* Input Area */}
      <div className="py-4 border-t border-white/10">
        {isMyTurn ? (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex items-center gap-3">
              <Timer deadline={game.turnDeadline} onTimeout={handleTimeout} />
              <div className="flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a related word..."
                  className="input"
                  disabled={isSubmitting}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                />
              </div>
              <button
                type="submit"
                disabled={!input.trim() || isSubmitting}
                className="btn btn-primary"
              >
                {isSubmitting ? '...' : 'Send'}
              </button>
            </div>
            {error && (
              <p className="text-[var(--danger)] text-sm">{error}</p>
            )}
            {words.length === 0 && (
              <p className="text-[var(--text-muted)] text-sm">
                You go first! Enter any {theme ? `${theme.name.toLowerCase()}-related ` : ''}word to start.
              </p>
            )}
            {words.length > 0 && (
              <p className="text-[var(--text-muted)] text-sm">
                Word must start with "<span className="text-[var(--accent)] font-bold">{words[words.length - 1]?.word.slice(-1).toUpperCase()}</span>"
                {theme && ` and fit the ${theme.name} theme`}
              </p>
            )}
          </form>
        ) : (
          <div className="flex items-center gap-3">
            <Timer deadline={game.turnDeadline} />
            <div className="flex-1 text-center text-[var(--text-muted)]">
              Waiting for {opponent?.isAI ? '👻 Ghost' : opponent?.name || 'opponent'}...
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
