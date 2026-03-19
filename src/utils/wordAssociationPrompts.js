/**
 * Word Association - Quick-fire association prompts
 * Players see a word and type the first thing that comes to mind
 * Points for matching others, bonuses for unique creative answers
 */

export const WORD_PROMPTS = [
  // ═══════════════════════════════════════════════════════════════
  // COMMON OBJECTS
  // ═══════════════════════════════════════════════════════════════
  { word: 'OCEAN', category: 'nature' },
  { word: 'FIRE', category: 'nature' },
  { word: 'MOON', category: 'nature' },
  { word: 'TREE', category: 'nature' },
  { word: 'RAIN', category: 'nature' },
  { word: 'SUN', category: 'nature' },
  { word: 'STORM', category: 'nature' },
  { word: 'MOUNTAIN', category: 'nature' },
  { word: 'RIVER', category: 'nature' },
  { word: 'STAR', category: 'nature' },
  
  // ═══════════════════════════════════════════════════════════════
  // EMOTIONS & STATES
  // ═══════════════════════════════════════════════════════════════
  { word: 'HAPPY', category: 'emotion' },
  { word: 'SAD', category: 'emotion' },
  { word: 'ANGRY', category: 'emotion' },
  { word: 'LOVE', category: 'emotion' },
  { word: 'FEAR', category: 'emotion' },
  { word: 'PEACE', category: 'emotion' },
  { word: 'HOPE', category: 'emotion' },
  { word: 'DREAM', category: 'emotion' },
  { word: 'CALM', category: 'emotion' },
  { word: 'WILD', category: 'emotion' },
  
  // ═══════════════════════════════════════════════════════════════
  // FOOD & DRINK
  // ═══════════════════════════════════════════════════════════════
  { word: 'PIZZA', category: 'food' },
  { word: 'COFFEE', category: 'food' },
  { word: 'CAKE', category: 'food' },
  { word: 'CHOCOLATE', category: 'food' },
  { word: 'BREAKFAST', category: 'food' },
  { word: 'SPICY', category: 'food' },
  { word: 'DESSERT', category: 'food' },
  { word: 'SNACK', category: 'food' },
  { word: 'DINNER', category: 'food' },
  { word: 'FRUIT', category: 'food' },
  
  // ═══════════════════════════════════════════════════════════════
  // ACTIVITIES
  // ═══════════════════════════════════════════════════════════════
  { word: 'PARTY', category: 'activity' },
  { word: 'VACATION', category: 'activity' },
  { word: 'DANCE', category: 'activity' },
  { word: 'GAME', category: 'activity' },
  { word: 'MUSIC', category: 'activity' },
  { word: 'SPORT', category: 'activity' },
  { word: 'WEEKEND', category: 'activity' },
  { word: 'ADVENTURE', category: 'activity' },
  { word: 'RELAX', category: 'activity' },
  { word: 'TRAVEL', category: 'activity' },
  
  // ═══════════════════════════════════════════════════════════════
  // ANIMALS
  // ═══════════════════════════════════════════════════════════════
  { word: 'DOG', category: 'animal' },
  { word: 'CAT', category: 'animal' },
  { word: 'BIRD', category: 'animal' },
  { word: 'FISH', category: 'animal' },
  { word: 'LION', category: 'animal' },
  { word: 'SNAKE', category: 'animal' },
  { word: 'ELEPHANT', category: 'animal' },
  { word: 'BUTTERFLY', category: 'animal' },
  { word: 'SHARK', category: 'animal' },
  { word: 'OWL', category: 'animal' },
  
  // ═══════════════════════════════════════════════════════════════
  // PLACES
  // ═══════════════════════════════════════════════════════════════
  { word: 'BEACH', category: 'place' },
  { word: 'CITY', category: 'place' },
  { word: 'HOME', category: 'place' },
  { word: 'SCHOOL', category: 'place' },
  { word: 'FOREST', category: 'place' },
  { word: 'SPACE', category: 'place' },
  { word: 'ISLAND', category: 'place' },
  { word: 'CASTLE', category: 'place' },
  { word: 'MALL', category: 'place' },
  { word: 'JUNGLE', category: 'place' },
  
  // ═══════════════════════════════════════════════════════════════
  // TIME & SEASONS
  // ═══════════════════════════════════════════════════════════════
  { word: 'SUMMER', category: 'time' },
  { word: 'WINTER', category: 'time' },
  { word: 'NIGHT', category: 'time' },
  { word: 'MORNING', category: 'time' },
  { word: 'MIDNIGHT', category: 'time' },
  { word: 'HOLIDAY', category: 'time' },
  { word: 'BIRTHDAY', category: 'time' },
  { word: 'FUTURE', category: 'time' },
  { word: 'MEMORY', category: 'time' },
  { word: 'FOREVER', category: 'time' },
  
  // ═══════════════════════════════════════════════════════════════
  // ABSTRACT CONCEPTS
  // ═══════════════════════════════════════════════════════════════
  { word: 'MAGIC', category: 'abstract' },
  { word: 'POWER', category: 'abstract' },
  { word: 'SECRET', category: 'abstract' },
  { word: 'LUCK', category: 'abstract' },
  { word: 'FREEDOM', category: 'abstract' },
  { word: 'CHAOS', category: 'abstract' },
  { word: 'BEAUTY', category: 'abstract' },
  { word: 'MYSTERY', category: 'abstract' },
  { word: 'DANGER', category: 'abstract' },
  { word: 'HERO', category: 'abstract' },
  
  // ═══════════════════════════════════════════════════════════════
  // POP CULTURE
  // ═══════════════════════════════════════════════════════════════
  { word: 'SUPERHERO', category: 'popculture' },
  { word: 'ROBOT', category: 'popculture' },
  { word: 'ZOMBIE', category: 'popculture' },
  { word: 'WIZARD', category: 'popculture' },
  { word: 'MONSTER', category: 'popculture' },
  { word: 'PRINCESS', category: 'popculture' },
  { word: 'PIRATE', category: 'popculture' },
  { word: 'NINJA', category: 'popculture' },
  { word: 'DRAGON', category: 'popculture' },
  { word: 'ALIEN', category: 'popculture' },
  
  // ═══════════════════════════════════════════════════════════════
  // RELATIONSHIPS
  // ═══════════════════════════════════════════════════════════════
  { word: 'FRIEND', category: 'relationship' },
  { word: 'FAMILY', category: 'relationship' },
  { word: 'TRUST', category: 'relationship' },
  { word: 'WEDDING', category: 'relationship' },
  { word: 'PARTNER', category: 'relationship' },
  { word: 'DATE', category: 'relationship' },
  { word: 'CRUSH', category: 'relationship' },
  { word: 'TEAM', category: 'relationship' },
  { word: 'BOSS', category: 'relationship' },
  { word: 'NEIGHBOR', category: 'relationship' },
]

// Get random prompts with category variety
export function getRandomWordPrompts(count = 8) {
  const categories = [...new Set(WORD_PROMPTS.map(p => p.category))]
  const selected = []
  const usedCategories = new Set()
  
  for (let i = 0; i < count; i++) {
    // Prioritize unused categories
    let pool = WORD_PROMPTS.filter(p => 
      !selected.includes(p) && !usedCategories.has(p.category)
    )
    
    // Fallback: allow category reuse
    if (pool.length === 0) {
      pool = WORD_PROMPTS.filter(p => !selected.includes(p))
    }
    
    if (pool.length > 0) {
      const prompt = pool[Math.floor(Math.random() * pool.length)]
      selected.push(prompt)
      usedCategories.add(prompt.category)
    }
  }
  
  return selected
}

// Normalize answer for matching
export function normalizeWordAnswer(answer) {
  return answer.toLowerCase().trim().replace(/[^a-z0-9]/g, '')
}

// Check if two answers match
export function wordsMatch(a, b) {
  return normalizeWordAnswer(a) === normalizeWordAnswer(b)
}

// Calculate matches for a round
export function calculateWordMatches(answers) {
  const normalized = {}
  const matchGroups = {}
  
  // Normalize all answers
  Object.entries(answers).forEach(([playerId, answer]) => {
    const norm = normalizeWordAnswer(answer)
    normalized[playerId] = norm
    
    if (!matchGroups[norm]) {
      matchGroups[norm] = []
    }
    matchGroups[norm].push(playerId)
  })
  
  // Calculate scores
  const scores = {}
  const matches = {}
  
  Object.entries(normalized).forEach(([playerId, norm]) => {
    const group = matchGroups[norm]
    
    if (group.length > 1) {
      // Matched with others - 100 points per match
      scores[playerId] = (group.length - 1) * 100
      matches[playerId] = group.filter(id => id !== playerId)
    } else {
      // Unique answer - 50 points for creativity
      scores[playerId] = 50
      matches[playerId] = []
    }
  })
  
  // Find largest match group for bonus
  let largestGroup = []
  Object.values(matchGroups).forEach(group => {
    if (group.length > largestGroup.length) {
      largestGroup = group
    }
  })
  
  // Bonus for being in the largest group (if 3+)
  if (largestGroup.length >= 3) {
    largestGroup.forEach(playerId => {
      scores[playerId] += 50 // "Mind meld" bonus
    })
  }
  
  return {
    scores,
    matches,
    matchGroups,
    normalized,
    perfectMatch: largestGroup.length === Object.keys(answers).length,
  }
}
