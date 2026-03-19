import { useState } from 'react'
import { PLAYER_CATEGORIES } from '../config/games'
import { useExperimental } from '../contexts/ExperimentalContext'

/**
 * GamePicker - Tabbed game selection with categories
 * 
 * Shows Solo / 2-Player / Party tabs with games in each.
 * Experimental games only show when experimental mode is enabled.
 */
export default function GamePicker({ games, onSelect, disabled }) {
  const { isExperimental } = useExperimental()
  const [activeTab, setActiveTab] = useState('duo')

  // Group games by category
  const gamesByCategory = {
    solo: games.filter(g => g.category === 'solo'),
    duo: games.filter(g => g.category === 'duo'),
    party: games.filter(g => g.category === 'party'),
  }

  // Only show tabs that have games
  const availableTabs = Object.entries(gamesByCategory)
    .filter(([, categoryGames]) => categoryGames.length > 0)
    .map(([category]) => category)

  // If current tab has no games, switch to first available
  if (!availableTabs.includes(activeTab) && availableTabs.length > 0) {
    setActiveTab(availableTabs[0])
  }

  const currentGames = gamesByCategory[activeTab] || []

  return (
    <div className="w-full max-w-md">
      {/* Category Tabs */}
      {availableTabs.length > 1 && (
        <div className="flex gap-2 mb-6 p-1 bg-white/5 rounded-xl">
          {availableTabs.map((categoryId) => {
            const category = PLAYER_CATEGORIES[categoryId]
            const isActive = activeTab === categoryId
            const gameCount = gamesByCategory[categoryId].length
            
            return (
              <button
                key={categoryId}
                onClick={() => setActiveTab(categoryId)}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-[var(--accent)] text-white' 
                    : 'text-[var(--text-muted)] hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="mr-2">{category.emoji}</span>
                <span className="hidden sm:inline">{category.name}</span>
                {!isActive && gameCount > 0 && (
                  <span className="ml-1 text-xs opacity-50">({gameCount})</span>
                )}
              </button>
            )
          })}
        </div>
      )}

      {/* Category Description */}
      {PLAYER_CATEGORIES[activeTab] && (
        <p className="text-center text-sm text-[var(--text-muted)] mb-4">
          {PLAYER_CATEGORIES[activeTab].description}
        </p>
      )}

      {/* Games Grid */}
      <div className="grid gap-4">
        {currentGames.length === 0 ? (
          <div className="text-center py-8 text-[var(--text-muted)]">
            <p className="text-4xl mb-2">🔬</p>
            <p>No games available yet.</p>
            {!isExperimental && (
              <p className="text-sm mt-2">
                Enable experimental mode to see upcoming games!
              </p>
            )}
          </div>
        ) : (
          currentGames.map((game, index) => (
            <GameCard
              key={game.id}
              game={game}
              index={index}
              onSelect={onSelect}
              disabled={disabled}
              isExperimental={isExperimental}
            />
          ))
        )}
      </div>
    </div>
  )
}

/**
 * Individual game card
 */
function GameCard({ game, index, onSelect, disabled, isExperimental }) {
  const isComingSoon = game.status === 'coming-soon'
  const isExperimentalGame = game.status === 'experimental'
  const isDisabled = disabled || isComingSoon

  return (
    <button
      onClick={() => !isDisabled && onSelect(game.id)}
      disabled={isDisabled}
      className={`card text-left transition-all duration-200 hover:scale-[1.02] 
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-white/20'}
        animate-slide-up`}
      style={{ 
        animationDelay: `${index * 100}ms`,
        borderColor: !isDisabled ? `${game.color}20` : undefined 
      }}
    >
      <div className="flex items-center gap-4">
        <div 
          className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
          style={{ backgroundColor: `${game.color}20` }}
        >
          {game.emoji}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-lg">{game.name}</h3>
            {isComingSoon && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-[var(--text-muted)]">
                Soon
              </span>
            )}
            {isExperimentalGame && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--ghost)]/20 text-[var(--ghost)]">
                New
              </span>
            )}
            {game.premium && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--warning)]/20 text-[var(--warning)]">
                Premium
              </span>
            )}
          </div>
          <p className="text-sm text-[var(--text-muted)]">{game.description}</p>
        </div>
        {!isDisabled && (
          <div className="text-[var(--text-muted)]">
            →
          </div>
        )}
      </div>
    </button>
  )
}
