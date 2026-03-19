import { THEMES } from '../utils/themes'

export default function ThemePicker({ onSelect, onBack, disabled }) {
  return (
    <div className="w-full max-w-md animate-slide-up">
      <button 
        onClick={onBack}
        className="mb-6 text-[var(--text-muted)] hover:text-white flex items-center gap-2 transition-colors"
      >
        ← Back to games
      </button>
      
      <h2 className="text-xl font-semibold mb-2 text-center">Pick a Theme</h2>
      <p className="text-[var(--text-muted)] text-sm mb-6 text-center">
        Words must relate to the theme or you lose!
      </p>
      
      <div className="grid grid-cols-2 gap-3">
        {THEMES.map((theme) => (
          <button
            key={theme.id}
            onClick={() => onSelect(theme.id)}
            disabled={disabled}
            className="card p-4 text-left hover:bg-white/10 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            <span className="text-3xl mb-2 block">{theme.emoji}</span>
            <span className="font-semibold block">{theme.name}</span>
            <span className="text-xs text-[var(--text-muted)]">{theme.description}</span>
          </button>
        ))}
      </div>
      
      <button
        onClick={() => onSelect(THEMES[Math.floor(Math.random() * THEMES.length)].id)}
        disabled={disabled}
        className="btn btn-secondary w-full mt-4"
      >
        🎲 Random Theme
      </button>
    </div>
  )
}
