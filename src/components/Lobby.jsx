import { useState } from 'react'
import ShareLink from './ShareLink'
import { getThemeById } from '../utils/themes'

export default function Lobby({ gameId, game }) {
  const [copied, setCopied] = useState(false)
  const shareUrl = `${window.location.origin}/play/${gameId}`
  const theme = game?.themeId ? getThemeById(game.themeId) : null

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleShare = async () => {
    const shareTexts = {
      'word-volley': theme ? `Word Volley: ${theme.name} theme! 👻` : 'Play Word Volley with me! 👻',
      'hot-take': 'Play Hot Take with me! 🔥',
      'quick-draw': 'Play Quick Draw with me! ✏️',
      'story-chain': 'Build a story with me! 📖',
      'trivia': 'Trivia challenge! 🧠',
      'rps': 'Rock Paper Scissors? ✊✋✌️',
    }
    const shareText = shareTexts[game?.gameType] || 'Play with me! 👻'
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Ghost Games',
          text: shareText,
          url: shareUrl,
        })
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Share failed:', err)
        }
      }
    } else {
      handleCopy()
    }
  }

  const gameEmoji = {
    'word-volley': '💬',
    'hot-take': '🔥',
    'quick-draw': '✏️',
    'story-chain': '📖',
    'trivia': '🧠',
    'rps': '✊',
  }[game?.gameType] || '👻'

  const gameName = {
    'word-volley': 'Word Volley',
    'hot-take': 'Hot Take',
    'quick-draw': 'Quick Draw',
    'story-chain': 'Story Chain',
    'trivia': 'Trivia',
    'rps': 'Rock Paper Scissors',
  }[game?.gameType] || 'Game'

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      {/* Back to home link */}
      <a href="/" className="absolute top-6 left-6 text-[var(--text-muted)] hover:text-white flex items-center gap-1">
        ← Home
      </a>
      
      <div className="card max-w-md w-full text-center animate-slide-up">
        <div className="text-6xl mb-4 animate-pulse-glow">{gameEmoji}</div>
        
        <h2 className="text-2xl font-bold mb-2">{gameName}</h2>
        <p className="text-[var(--text-muted)] mb-4">Waiting for opponent...</p>
        
        {/* Theme badge for Word Volley */}
        {theme && game?.gameType === 'word-volley' && (
          <div className="mb-4 p-3 bg-white/5 rounded-xl inline-block">
            <span className="text-2xl mr-2">{theme.emoji}</span>
            <span className="font-semibold text-[var(--accent)]">{theme.name} Theme</span>
          </div>
        )}
        
        {/* Game Rules */}
        <div className="mb-6 p-4 bg-white/5 rounded-xl text-left">
          <h3 className="font-semibold mb-2 text-center">📜 How to Play</h3>
          
          {game?.gameType === 'word-volley' && (
            <ul className="text-sm text-[var(--text-muted)] space-y-1">
              <li>• Each word must <strong>start with the last letter</strong> of the previous word</li>
              <li>• Words must <strong>fit the theme</strong> or you lose!</li>
              <li>• You have <strong>30 seconds</strong> per turn</li>
              <li>• No repeating words</li>
            </ul>
          )}
          
          {game?.gameType === 'hot-take' && (
            <ul className="text-sm text-[var(--text-muted)] space-y-1">
              <li>• You'll both see the <strong>same question</strong></li>
              <li>• Type your answer <strong>independently</strong></li>
              <li>• See if your answers <strong>match!</strong></li>
              <li>• 5 rounds total</li>
            </ul>
          )}
          
          {game?.gameType === 'quick-draw' && (
            <ul className="text-sm text-[var(--text-muted)] space-y-1">
              <li>• Take turns <strong>drawing and guessing</strong></li>
              <li>• Drawer sees a word to illustrate</li>
              <li>• Guesser tries to figure it out</li>
              <li>• 6 rounds, alternating roles</li>
            </ul>
          )}
          
          {game?.gameType === 'story-chain' && (
            <ul className="text-sm text-[var(--text-muted)] space-y-1">
              <li>• Build a <strong>story together</strong>, one word at a time</li>
              <li>• Take turns adding words</li>
              <li>• Keep it coherent... or get weird!</li>
              <li>• 20 words total</li>
            </ul>
          )}
          
          {game?.gameType === 'trivia' && (
            <ul className="text-sm text-[var(--text-muted)] space-y-1">
              <li>• Race to answer <strong>trivia questions</strong></li>
              <li>• <strong>Faster = more points!</strong></li>
              <li>• Both answer the same questions</li>
              <li>• 7 questions total</li>
            </ul>
          )}
          
          {game?.gameType === 'rps' && (
            <ul className="text-sm text-[var(--text-muted)] space-y-1">
              <li>• Classic <strong>Rock Paper Scissors</strong></li>
              <li>• Pick your move <strong>simultaneously</strong></li>
              <li>• <strong>Best of 5</strong> - first to 3 wins!</li>
              <li>• Outsmart your opponent</li>
            </ul>
          )}
        </div>
        
        <p className="text-[var(--text-muted)] mb-6">
          Share this link with a friend to start
        </p>

        <ShareLink url={shareUrl} onCopy={handleCopy} onShare={handleShare} copied={copied} />

        <div className="mt-6 pt-4 border-t border-white/10">
          <p className="text-sm text-[var(--text-muted)]">
            💡 If they don't join in 5 minutes, you can play against Ghost
          </p>
        </div>
      </div>
    </div>
  )
}
