// Story Chain - word-by-word collaborative stories
// Each starter is a category/theme to guide the story

export const STORY_STARTERS = [
  { starter: "Once", category: "Classic Tale" },
  { starter: "The", category: "Mystery" },
  { starter: "Nobody", category: "Surprise" },
  { starter: "Suddenly", category: "Action" },
  { starter: "In", category: "Adventure" },
  { starter: "A", category: "Random" },
  { starter: "When", category: "Time Travel" },
  { starter: "My", category: "Personal" },
  { starter: "There", category: "Fantasy" },
  { starter: "One", category: "Drama" },
  { starter: "It", category: "Horror" },
  { starter: "After", category: "Sequel" },
  { starter: "Before", category: "Prequel" },
  { starter: "Deep", category: "Exploration" },
  { starter: "Every", category: "Universal" },
]

// Get a random story starter
export function getRandomStarter() {
  const choice = STORY_STARTERS[Math.floor(Math.random() * STORY_STARTERS.length)]
  return choice.starter
}

// Validate a word (basic checks)
export function validateWord(word) {
  const trimmed = word.trim()
  
  // Only letters and basic punctuation
  if (!/^[a-zA-Z',.-]+$/.test(trimmed)) {
    return { valid: false, reason: 'Letters only! One word at a time.' }
  }
  
  if (trimmed.length < 1) {
    return { valid: false, reason: 'Enter a word!' }
  }
  
  if (trimmed.length > 20) {
    return { valid: false, reason: 'Too long! Max 20 characters.' }
  }
  
  // Check for spaces (multiple words)
  if (word.includes(' ')) {
    return { valid: false, reason: 'One word only!' }
  }
  
  return { valid: true }
}

// Legacy export for backwards compatibility
export function validateSentence(sentence) {
  return validateWord(sentence)
}
