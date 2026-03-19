/**
 * Ghost Games - Game Configuration
 * 
 * All games are defined here with their metadata, categories, and status.
 * This is the single source of truth for game listings.
 */

// Player count categories
export const PLAYER_CATEGORIES = {
  solo: {
    id: 'solo',
    name: 'Solo',
    emoji: '👤',
    description: 'Play against Ghost',
    minPlayers: 1,
    maxPlayers: 1,
  },
  duo: {
    id: 'duo',
    name: '2 Players',
    emoji: '👥',
    description: 'Play with a friend',
    minPlayers: 2,
    maxPlayers: 2,
  },
  party: {
    id: 'party',
    name: 'Party',
    emoji: '🎉',
    description: '3-8 players',
    minPlayers: 3,
    maxPlayers: 8,
  },
}

// Game status
export const GAME_STATUS = {
  live: 'live',           // Available to all users
  experimental: 'experimental', // Only in experimental mode
  comingSoon: 'coming-soon',    // Shown but disabled
  hidden: 'hidden',       // Not shown at all
}

// All games configuration
export const ALL_GAMES = {
  // ═══════════════════════════════════════════════════════════════
  // SOLO GAMES (vs Ghost)
  // ═══════════════════════════════════════════════════════════════
  'ghost-says': {
    id: 'ghost-says',
    name: 'Ghost Says',
    emoji: '👻',
    description: 'Simon-style memory game. How long can you last?',
    color: 'var(--ghost)',
    category: 'solo',
    status: 'experimental',
    premium: false,
    features: ['single-player', 'high-score'],
  },
  'speed-tap': {
    id: 'speed-tap',
    name: 'Speed Tap',
    emoji: '⚡',
    description: 'Test your reflexes. Tap when you see the ghost!',
    color: 'var(--warning)',
    category: 'solo',
    status: 'experimental',
    premium: false,
    features: ['single-player', 'high-score'],
  },

  // ═══════════════════════════════════════════════════════════════
  // 2-PLAYER GAMES
  // ═══════════════════════════════════════════════════════════════
  'hot-take': {
    id: 'hot-take',
    name: 'Hot Take',
    emoji: '🔥',
    description: 'Spicy questions. See if you match.',
    color: 'var(--warning)',
    category: 'duo',
    status: 'live',
    premium: false,
    features: ['real-time', 'sync'],
  },
  'quick-draw': {
    id: 'quick-draw',
    name: 'Quick Draw',
    emoji: '✏️',
    description: 'Draw and guess. Beat the clock.',
    color: 'var(--success)',
    category: 'duo',
    status: 'live',
    premium: false,
    features: ['real-time', 'drawing'],
  },
  'story-chain': {
    id: 'story-chain',
    name: 'Story Chain',
    emoji: '📖',
    description: 'Build a story together. One word at a time.',
    color: 'var(--accent)',
    category: 'duo',
    status: 'live',
    premium: false,
    features: ['turn-based', 'creative'],
  },
  'trivia': {
    id: 'trivia',
    name: 'Trivia',
    emoji: '🧠',
    description: 'Answer fast for more points!',
    color: 'var(--warning)',
    category: 'duo',
    status: 'live',
    premium: false,
    features: ['real-time', 'knowledge'],
  },
  'rps': {
    id: 'rps',
    name: 'Rock Paper Scissors',
    emoji: '✊',
    description: 'Best of 5. Outsmart your opponent!',
    color: 'var(--success)',
    category: 'duo',
    status: 'live',
    premium: false,
    features: ['real-time', 'quick'],
  },
  'word-volley': {
    id: 'word-volley',
    name: 'Word Volley',
    emoji: '💬',
    description: 'Word chain with themes. Keep it going!',
    color: 'var(--accent)',
    category: 'duo',
    status: 'hidden', // Hidden for now
    premium: false,
    features: ['turn-based', 'words'],
    hasThemes: true,
  },
  'mind-meld': {
    id: 'mind-meld',
    name: 'Mind Meld',
    emoji: '🧠',
    description: 'Think the same word. Sync your minds!',
    color: 'var(--ghost)',
    category: 'party',
    status: 'experimental',
    premium: false,
    features: ['multiplayer', 'sync'],
    minPlayers: 2,
    maxPlayers: 8,
  },
  'sound-off': {
    id: 'sound-off',
    name: 'Sound Off',
    emoji: '🎵',
    description: 'Hum songs, make sounds. Can they guess?',
    color: 'var(--warning)',
    category: 'duo',
    status: 'experimental',
    premium: true,
    features: ['audio', 'creative'],
  },

  // ═══════════════════════════════════════════════════════════════
  // PARTY GAMES (3-8 players)
  // ═══════════════════════════════════════════════════════════════
  'same-page': {
    id: 'same-page',
    name: 'Same Page',
    emoji: '📝',
    description: 'Everyone answers. Score for matching!',
    color: 'var(--accent)',
    category: 'party',
    status: 'experimental',
    premium: false,
    features: ['multiplayer', 'sync'],
  },
  'imposter-artist': {
    id: 'imposter-artist',
    name: 'Imposter Artist',
    emoji: '🎭',
    description: "One person doesn't know the word. Find them!",
    color: 'var(--danger)',
    category: 'party',
    status: 'experimental',
    premium: true,
    features: ['multiplayer', 'drawing', 'deduction'],
  },
  'prediction': {
    id: 'prediction',
    name: 'Prediction',
    emoji: '🔮',
    description: 'Predict how your friends will answer.',
    color: 'var(--ghost)',
    category: 'party',
    status: 'experimental',
    premium: true,
    features: ['multiplayer', 'social'],
  },
  'bluff-battle': {
    id: 'bluff-battle',
    name: 'Bluff Battle',
    emoji: '🃏',
    description: 'Real answer or made up? Vote to find out!',
    color: 'var(--warning)',
    category: 'party',
    status: 'experimental',
    premium: true,
    features: ['multiplayer', 'deduction'],
  },
  'photo-race': {
    id: 'photo-race',
    name: 'Photo Race',
    emoji: '📸',
    description: 'First to capture the challenge wins!',
    color: 'var(--success)',
    category: 'party',
    status: 'experimental',
    premium: true,
    features: ['multiplayer', 'camera', 'active'],
  },
  'talent-show': {
    id: 'talent-show',
    name: 'Talent Show',
    emoji: '🎪',
    description: 'Record ridiculous talents. Vote for the best!',
    color: 'var(--accent)',
    category: 'party',
    status: 'experimental',
    premium: true,
    features: ['multiplayer', 'video', 'async'],
  },
}

// ═══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Get games filtered by category and status
 */
export function getGamesByCategory(category, { includeExperimental = false, includePremium = true } = {}) {
  return Object.values(ALL_GAMES).filter(game => {
    // Category match
    if (game.category !== category) return false
    
    // Status filter
    if (game.status === 'hidden') return false
    if (game.status === 'experimental' && !includeExperimental) return false
    
    // Premium filter
    if (game.premium && !includePremium) return false
    
    return true
  })
}

/**
 * Get all visible games grouped by category
 */
export function getGamesGroupedByCategory(options = {}) {
  return {
    solo: getGamesByCategory('solo', options),
    duo: getGamesByCategory('duo', options),
    party: getGamesByCategory('party', options),
  }
}

/**
 * Get a single game by ID
 */
export function getGameById(gameId) {
  return ALL_GAMES[gameId] || null
}

/**
 * Check if a game requires premium
 */
export function isPremiumGame(gameId) {
  return ALL_GAMES[gameId]?.premium || false
}

/**
 * Check if a game is available (not coming soon or hidden)
 */
export function isGameAvailable(gameId, { includeExperimental = false } = {}) {
  const game = ALL_GAMES[gameId]
  if (!game) return false
  if (game.status === 'hidden') return false
  if (game.status === 'coming-soon') return false
  if (game.status === 'experimental' && !includeExperimental) return false
  return true
}
