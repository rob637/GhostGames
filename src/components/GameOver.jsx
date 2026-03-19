import { getThemeById } from '../utils/themes'
import PlayAgainButton from './PlayAgainButton'

export default function GameOver({ game, gameId, player }) {

  // Determine winner - loser is stored, winner is the other player
  const loserId = game.result?.loserId
  const isWinner = loserId && loserId !== player?.id
  const isLoser = loserId === player?.id
  const words = game.words || []
  const theme = game.themeId ? getThemeById(game.themeId) : null

  const handleShare = async () => {
    const wordChain = words.map(w => w.word).join(' → ')
    const themeText = theme ? ` (${theme.name} theme)` : ''
    const text = `Word Volley${themeText}: ${wordChain}\n\n${words.length} words! 👻\n\nPlay: ${window.location.origin}`

    if (navigator.share) {
      try {
        await navigator.share({ title: 'Ghost Games Result', text })
      } catch (err) {
        if (err.name !== 'AbortError') {
          await navigator.clipboard.writeText(text)
        }
      }
    } else {
      await navigator.clipboard.writeText(text)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="card max-w-md w-full text-center animate-slide-up">
        <div className="text-6xl mb-4">
          {isWinner ? '🏆' : isLoser ? '😅' : '🤝'}
        </div>

        <h2 className="text-2xl font-bold mb-2">
          {isWinner ? 'You Won!' : isLoser ? 'You Lost!' : 'Game Over'}
        </h2>

        <p className="text-[var(--text-muted)] mb-6">
          {game.result?.reason || 'Game ended'}
        </p>

        {/* Word Chain */}
        {words.length > 0 && (
          <div className="bg-[var(--bg-tertiary)] rounded-xl p-4 mb-6">
            <p className="text-sm text-[var(--text-muted)] mb-2">Word Chain</p>
            <p className="text-lg font-mono">
              {words.map((w, i) => (
                <span key={i}>
                  {i > 0 && <span className="text-[var(--text-muted)]"> → </span>}
                  <span className={w.playerId === player?.id ? 'text-[var(--accent)]' : ''}>
                    {w.word}
                  </span>
                </span>
              ))}
            </p>
            <p className="text-sm text-[var(--text-muted)] mt-2">
              {words.length} words
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={handleShare} className="btn btn-secondary flex-1">
            Share
          </button>
          <PlayAgainButton game={game} gameId={gameId} className="flex-1" />
        </div>

        <a href="/" className="block mt-4 text-sm text-[var(--text-muted)] hover:text-white">
          ← Back to Home
        </a>
      </div>
    </div>
  )
}
