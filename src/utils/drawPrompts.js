/**
 * Quick Draw Prompts
 * 
 * Drawing prompts organized by difficulty:
 * - Easy: Simple shapes, recognizable with few strokes
 * - Medium: More complex but still concrete objects
 * - Hard: Abstract concepts requiring creative representation
 * 
 * Categories ensure variety in game sessions.
 */

export const DRAW_PROMPTS = [
  // ═══════════════════════════════════════════════════════════════
  // EASY - Simple shapes and iconic objects
  // ═══════════════════════════════════════════════════════════════
  
  // Nature
  { word: 'sun', difficulty: 'easy', category: 'nature' },
  { word: 'moon', difficulty: 'easy', category: 'nature' },
  { word: 'star', difficulty: 'easy', category: 'nature' },
  { word: 'tree', difficulty: 'easy', category: 'nature' },
  { word: 'flower', difficulty: 'easy', category: 'nature' },
  { word: 'cloud', difficulty: 'easy', category: 'nature' },
  { word: 'rain', difficulty: 'easy', category: 'nature' },
  { word: 'mountain', difficulty: 'easy', category: 'nature' },
  { word: 'river', difficulty: 'easy', category: 'nature' },
  { word: 'leaf', difficulty: 'easy', category: 'nature' },
  
  // Animals
  { word: 'cat', difficulty: 'easy', category: 'animals' },
  { word: 'dog', difficulty: 'easy', category: 'animals' },
  { word: 'fish', difficulty: 'easy', category: 'animals' },
  { word: 'bird', difficulty: 'easy', category: 'animals' },
  { word: 'snake', difficulty: 'easy', category: 'animals' },
  { word: 'bunny', difficulty: 'easy', category: 'animals' },
  { word: 'pig', difficulty: 'easy', category: 'animals' },
  { word: 'cow', difficulty: 'easy', category: 'animals' },
  { word: 'bee', difficulty: 'easy', category: 'animals' },
  { word: 'butterfly', difficulty: 'easy', category: 'animals' },
  
  // Food
  { word: 'apple', difficulty: 'easy', category: 'food' },
  { word: 'banana', difficulty: 'easy', category: 'food' },
  { word: 'orange', difficulty: 'easy', category: 'food' },
  { word: 'egg', difficulty: 'easy', category: 'food' },
  { word: 'cookie', difficulty: 'easy', category: 'food' },
  { word: 'bread', difficulty: 'easy', category: 'food' },
  { word: 'cheese', difficulty: 'easy', category: 'food' },
  { word: 'carrot', difficulty: 'easy', category: 'food' },
  { word: 'grapes', difficulty: 'easy', category: 'food' },
  { word: 'lemon', difficulty: 'easy', category: 'food' },
  
  // Objects
  { word: 'house', difficulty: 'easy', category: 'objects' },
  { word: 'car', difficulty: 'easy', category: 'objects' },
  { word: 'boat', difficulty: 'easy', category: 'objects' },
  { word: 'ball', difficulty: 'easy', category: 'objects' },
  { word: 'book', difficulty: 'easy', category: 'objects' },
  { word: 'cup', difficulty: 'easy', category: 'objects' },
  { word: 'hat', difficulty: 'easy', category: 'objects' },
  { word: 'shoe', difficulty: 'easy', category: 'objects' },
  { word: 'key', difficulty: 'easy', category: 'objects' },
  { word: 'heart', difficulty: 'easy', category: 'objects' },
  { word: 'clock', difficulty: 'easy', category: 'objects' },
  { word: 'chair', difficulty: 'easy', category: 'objects' },
  { word: 'table', difficulty: 'easy', category: 'objects' },
  { word: 'lamp', difficulty: 'easy', category: 'objects' },
  { word: 'door', difficulty: 'easy', category: 'objects' },
  { word: 'window', difficulty: 'easy', category: 'objects' },
  { word: 'bed', difficulty: 'easy', category: 'objects' },
  { word: 'flag', difficulty: 'easy', category: 'objects' },
  
  // ═══════════════════════════════════════════════════════════════
  // MEDIUM - More complex but concrete
  // ═══════════════════════════════════════════════════════════════
  
  // Food
  { word: 'pizza', difficulty: 'medium', category: 'food' },
  { word: 'hamburger', difficulty: 'medium', category: 'food' },
  { word: 'ice cream', difficulty: 'medium', category: 'food' },
  { word: 'birthday cake', difficulty: 'medium', category: 'food' },
  { word: 'hot dog', difficulty: 'medium', category: 'food' },
  { word: 'french fries', difficulty: 'medium', category: 'food' },
  { word: 'popcorn', difficulty: 'medium', category: 'food' },
  { word: 'sushi', difficulty: 'medium', category: 'food' },
  { word: 'taco', difficulty: 'medium', category: 'food' },
  { word: 'donut', difficulty: 'medium', category: 'food' },
  { word: 'watermelon', difficulty: 'medium', category: 'food' },
  { word: 'sandwich', difficulty: 'medium', category: 'food' },
  
  // Animals
  { word: 'penguin', difficulty: 'medium', category: 'animals' },
  { word: 'elephant', difficulty: 'medium', category: 'animals' },
  { word: 'giraffe', difficulty: 'medium', category: 'animals' },
  { word: 'lion', difficulty: 'medium', category: 'animals' },
  { word: 'monkey', difficulty: 'medium', category: 'animals' },
  { word: 'turtle', difficulty: 'medium', category: 'animals' },
  { word: 'octopus', difficulty: 'medium', category: 'animals' },
  { word: 'whale', difficulty: 'medium', category: 'animals' },
  { word: 'shark', difficulty: 'medium', category: 'animals' },
  { word: 'dinosaur', difficulty: 'medium', category: 'animals' },
  { word: 'owl', difficulty: 'medium', category: 'animals' },
  { word: 'frog', difficulty: 'medium', category: 'animals' },
  { word: 'kangaroo', difficulty: 'medium', category: 'animals' },
  { word: 'spider', difficulty: 'medium', category: 'animals' },
  { word: 'crab', difficulty: 'medium', category: 'animals' },
  
  // Objects & Things
  { word: 'guitar', difficulty: 'medium', category: 'objects' },
  { word: 'camera', difficulty: 'medium', category: 'objects' },
  { word: 'bicycle', difficulty: 'medium', category: 'objects' },
  { word: 'airplane', difficulty: 'medium', category: 'objects' },
  { word: 'umbrella', difficulty: 'medium', category: 'objects' },
  { word: 'rocket', difficulty: 'medium', category: 'objects' },
  { word: 'laptop', difficulty: 'medium', category: 'objects' },
  { word: 'headphones', difficulty: 'medium', category: 'objects' },
  { word: 'microphone', difficulty: 'medium', category: 'objects' },
  { word: 'scissors', difficulty: 'medium', category: 'objects' },
  { word: 'toothbrush', difficulty: 'medium', category: 'objects' },
  { word: 'glasses', difficulty: 'medium', category: 'objects' },
  { word: 'trophy', difficulty: 'medium', category: 'objects' },
  { word: 'crown', difficulty: 'medium', category: 'objects' },
  { word: 'sword', difficulty: 'medium', category: 'objects' },
  { word: 'anchor', difficulty: 'medium', category: 'objects' },
  { word: 'candle', difficulty: 'medium', category: 'objects' },
  { word: 'magnet', difficulty: 'medium', category: 'objects' },
  
  // Places & Scenes
  { word: 'castle', difficulty: 'medium', category: 'places' },
  { word: 'lighthouse', difficulty: 'medium', category: 'places' },
  { word: 'volcano', difficulty: 'medium', category: 'places' },
  { word: 'island', difficulty: 'medium', category: 'places' },
  { word: 'bridge', difficulty: 'medium', category: 'places' },
  { word: 'tent', difficulty: 'medium', category: 'places' },
  { word: 'igloo', difficulty: 'medium', category: 'places' },
  
  // Weather & Nature
  { word: 'rainbow', difficulty: 'medium', category: 'nature' },
  { word: 'snowman', difficulty: 'medium', category: 'nature' },
  { word: 'tornado', difficulty: 'medium', category: 'nature' },
  { word: 'lightning', difficulty: 'medium', category: 'nature' },
  { word: 'campfire', difficulty: 'medium', category: 'nature' },
  { word: 'sunset', difficulty: 'medium', category: 'nature' },
  { word: 'waterfall', difficulty: 'medium', category: 'nature' },
  
  // Characters
  { word: 'robot', difficulty: 'medium', category: 'characters' },
  { word: 'ghost', difficulty: 'medium', category: 'characters' },
  { word: 'dragon', difficulty: 'medium', category: 'characters' },
  { word: 'mermaid', difficulty: 'medium', category: 'characters' },
  { word: 'superhero', difficulty: 'medium', category: 'characters' },
  { word: 'pirate', difficulty: 'medium', category: 'characters' },
  { word: 'wizard', difficulty: 'medium', category: 'characters' },
  { word: 'ninja', difficulty: 'medium', category: 'characters' },
  { word: 'alien', difficulty: 'medium', category: 'characters' },
  { word: 'vampire', difficulty: 'medium', category: 'characters' },
  { word: 'zombie', difficulty: 'medium', category: 'characters' },
  { word: 'unicorn', difficulty: 'medium', category: 'characters' },
  
  // Sports & Activities
  { word: 'soccer ball', difficulty: 'medium', category: 'sports' },
  { word: 'basketball', difficulty: 'medium', category: 'sports' },
  { word: 'skateboard', difficulty: 'medium', category: 'sports' },
  { word: 'surfboard', difficulty: 'medium', category: 'sports' },
  { word: 'tennis racket', difficulty: 'medium', category: 'sports' },
  { word: 'bowling', difficulty: 'medium', category: 'sports' },
  { word: 'golf', difficulty: 'medium', category: 'sports' },
  
  // ═══════════════════════════════════════════════════════════════
  // HARD - Abstract concepts and challenging subjects
  // ═══════════════════════════════════════════════════════════════
  
  // Emotions & Concepts
  { word: 'happiness', difficulty: 'hard', category: 'abstract' },
  { word: 'sadness', difficulty: 'hard', category: 'abstract' },
  { word: 'love', difficulty: 'hard', category: 'abstract' },
  { word: 'fear', difficulty: 'hard', category: 'abstract' },
  { word: 'anger', difficulty: 'hard', category: 'abstract' },
  { word: 'peace', difficulty: 'hard', category: 'abstract' },
  { word: 'hope', difficulty: 'hard', category: 'abstract' },
  { word: 'dream', difficulty: 'hard', category: 'abstract' },
  { word: 'time', difficulty: 'hard', category: 'abstract' },
  { word: 'freedom', difficulty: 'hard', category: 'abstract' },
  { word: 'silence', difficulty: 'hard', category: 'abstract' },
  { word: 'music', difficulty: 'hard', category: 'abstract' },
  { word: 'chaos', difficulty: 'hard', category: 'abstract' },
  { word: 'balance', difficulty: 'hard', category: 'abstract' },
  { word: 'luck', difficulty: 'hard', category: 'abstract' },
  { word: 'imagination', difficulty: 'hard', category: 'abstract' },
  { word: 'wisdom', difficulty: 'hard', category: 'abstract' },
  { word: 'memory', difficulty: 'hard', category: 'abstract' },
  
  // Actions & Events
  { word: 'birthday party', difficulty: 'hard', category: 'actions' },
  { word: 'wedding', difficulty: 'hard', category: 'actions' },
  { word: 'vacation', difficulty: 'hard', category: 'actions' },
  { word: 'homework', difficulty: 'hard', category: 'actions' },
  { word: 'exercise', difficulty: 'hard', category: 'actions' },
  { word: 'cooking', difficulty: 'hard', category: 'actions' },
  { word: 'sleeping', difficulty: 'hard', category: 'actions' },
  { word: 'dancing', difficulty: 'hard', category: 'actions' },
  { word: 'running late', difficulty: 'hard', category: 'actions' },
  { word: 'traffic jam', difficulty: 'hard', category: 'actions' },
  
  // Science & Nature
  { word: 'gravity', difficulty: 'hard', category: 'science' },
  { word: 'electricity', difficulty: 'hard', category: 'science' },
  { word: 'black hole', difficulty: 'hard', category: 'science' },
  { word: 'evolution', difficulty: 'hard', category: 'science' },
  { word: 'ecosystem', difficulty: 'hard', category: 'science' },
  { word: 'solar system', difficulty: 'hard', category: 'science' },
  
  // Pop Culture Phrases
  { word: 'plot twist', difficulty: 'hard', category: 'phrases' },
  { word: 'cliffhanger', difficulty: 'hard', category: 'phrases' },
  { word: 'brainstorm', difficulty: 'hard', category: 'phrases' },
  { word: 'deadline', difficulty: 'hard', category: 'phrases' },
  { word: 'weekend', difficulty: 'hard', category: 'phrases' },
  { word: 'Monday morning', difficulty: 'hard', category: 'phrases' },
  { word: 'coffee break', difficulty: 'hard', category: 'phrases' },
  { word: 'food coma', difficulty: 'hard', category: 'phrases' },
  { word: 'self portrait', difficulty: 'hard', category: 'phrases' },
]

// Get random prompts for a game
export function getRandomPrompts() {
  // Returns 6 prompts with progressive difficulty
  const easy = DRAW_PROMPTS.filter(p => p.difficulty === 'easy')
  const medium = DRAW_PROMPTS.filter(p => p.difficulty === 'medium')
  const hard = DRAW_PROMPTS.filter(p => p.difficulty === 'hard')
  
  // Get unique categories for variety
  const getFromCategory = (difficultyList, excluded) => {
    const categories = [...new Set(difficultyList.map(p => p.category))]
    const availableCategories = categories.filter(c => !excluded.has(c))
    
    if (availableCategories.length === 0) {
      // Fallback if all categories used
      const shuffled = [...difficultyList].sort(() => Math.random() - 0.5)
      return shuffled[0]
    }
    
    const category = availableCategories[Math.floor(Math.random() * availableCategories.length)]
    const fromCategory = difficultyList.filter(p => p.category === category)
    return fromCategory[Math.floor(Math.random() * fromCategory.length)]
  }
  
  const usedCategories = new Set()
  const selected = []
  
  // 3 easy (from different categories)
  for (let i = 0; i < 3; i++) {
    const prompt = getFromCategory(easy, usedCategories)
    selected.push(prompt)
    usedCategories.add(prompt.category)
  }
  
  // 2 medium (from different categories)
  for (let i = 0; i < 2; i++) {
    const prompt = getFromCategory(medium, usedCategories)
    selected.push(prompt)
    usedCategories.add(prompt.category)
  }
  
  // 1 hard
  const hardPrompt = getFromCategory(hard, usedCategories)
  selected.push(hardPrompt)
  
  // Shuffle maintaining some difficulty progression
  // First 2 easy, then mix, then hard at end
  const easySelected = selected.filter(p => p.difficulty === 'easy')
  const mediumSelected = selected.filter(p => p.difficulty === 'medium')
  const hardSelected = selected.filter(p => p.difficulty === 'hard')
  
  return [
    easySelected[0],
    easySelected[1],
    mediumSelected[0],
    easySelected[2],
    mediumSelected[1],
    hardSelected[0],
  ].filter(Boolean)
}

// Get prompt by index
export function getPrompt(prompts, index) {
  return prompts[index] || null
}
