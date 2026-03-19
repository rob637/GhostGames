/**
 * Mind Meld Prompts
 * 
 * Categories and prompts for the Mind Meld game.
 * Players try to think of the same word given a category.
 * 
 * Good prompts are:
 * - Specific enough to limit choices
 * - Open enough that matches feel rewarding
 * - Fun and relatable for everyone
 */

export const MIND_MELD_PROMPTS = [
  // Classic categories
  { category: "A fruit", hint: "Think of the most common one" },
  { category: "A color", hint: "Primary colors are popular" },
  { category: "An animal at a zoo", hint: "The iconic ones" },
  { category: "A pizza topping", hint: "Classic choices" },
  { category: "Something you'd find at a beach", hint: "Sun, sand, and..." },
  { category: "A superhero", hint: "Marvel or DC" },
  { category: "A breakfast food", hint: "Morning favorites" },
  { category: "Something in your pocket", hint: "Daily essentials" },
  { category: "A sport", hint: "Ball games count" },
  { category: "A holiday", hint: "The big ones" },
  
  // Pop culture
  { category: "A Disney movie", hint: "Animated classics" },
  { category: "A social media platform", hint: "Where you scroll" },
  { category: "A streaming service", hint: "Binge watching" },
  { category: "A video game", hint: "All time greats" },
  { category: "A fast food restaurant", hint: "Drive-thru favorites" },
  { category: "A soft drink", hint: "Carbonated classics" },
  { category: "A phone brand", hint: "In your hand right now" },
  { category: "A car brand", hint: "On the road" },
  
  // Food & Drink
  { category: "An ice cream flavor", hint: "Scoop it up" },
  { category: "Something you grill", hint: "Backyard BBQ" },
  { category: "A type of pasta", hint: "Italian favorites" },
  { category: "A candy bar", hint: "Sweet tooth" },
  { category: "Something you put on toast", hint: "Breakfast spread" },
  { category: "A cookie type", hint: "Fresh from the oven" },
  { category: "A vegetable", hint: "Eat your greens" },
  { category: "Something you'd order at a bar", hint: "Cheers!" },
  
  // Places
  { category: "A country in Europe", hint: "Across the pond" },
  { category: "A US state", hint: "50 to choose from" },
  { category: "A city with a famous landmark", hint: "Tourist spots" },
  { category: "Somewhere you'd go on vacation", hint: "Dream destination" },
  { category: "A room in a house", hint: "Where you spend time" },
  { category: "A type of store", hint: "Shopping trip" },
  
  // Things
  { category: "Something with wheels", hint: "Gets you around" },
  { category: "Something that flies", hint: "In the sky" },
  { category: "Something you'd find in a kitchen", hint: "Cooking essentials" },
  { category: "Something you'd wear on your feet", hint: "Step by step" },
  { category: "Something you'd take camping", hint: "Great outdoors" },
  { category: "Something with buttons", hint: "Press them" },
  { category: "Something made of glass", hint: "Careful, fragile!" },
  { category: "Something you'd find in a classroom", hint: "School supplies" },
  
  // Abstract
  { category: "A word that means 'happy'", hint: "Positive vibes" },
  { category: "Something that's cold", hint: "Brrr!" },
  { category: "Something that's loud", hint: "Cover your ears" },
  { category: "Something that smells good", hint: "Take a sniff" },
  { category: "Something that's round", hint: "No corners" },
  { category: "Something that's expensive", hint: "Big purchases" },
  { category: "Something you do every day", hint: "Daily routine" },
  { category: "Something that's relaxing", hint: "Unwind" },
  
  // People & Characters
  { category: "A famous singer", hint: "Hit the high notes" },
  { category: "A movie villain", hint: "The bad guy" },
  { category: "A fictional character", hint: "Books, movies, TV" },
  { category: "Someone you'd see at a hospital", hint: "Medical staff" },
  { category: "A type of athlete", hint: "Sports stars" },
  
  // Seasonal
  { category: "Something at a birthday party", hint: "Celebrate!" },
  { category: "Something you'd see at Halloween", hint: "Spooky!" },
  { category: "A Christmas tradition", hint: "Ho ho ho" },
  { category: "Something you do in summer", hint: "Hot days" },
  { category: "Something you'd see at a wedding", hint: "I do!" },
  
  // Fun & Games
  { category: "A board game", hint: "Game night" },
  { category: "Something in a magic trick", hint: "Abracadabra" },
  { category: "A type of dance", hint: "Move your feet" },
  { category: "Something at an amusement park", hint: "Thrills!" },
  { category: "A card game", hint: "Shuffle up" },
  
  // Nature
  { category: "A type of tree", hint: "In the forest" },
  { category: "A type of flower", hint: "In a garden" },
  { category: "Something in the ocean", hint: "Under the sea" },
  { category: "A type of bird", hint: "In the sky" },
  { category: "Something that grows in a garden", hint: "Green thumb" },
  
  // Technology
  { category: "An app on your phone", hint: "Tap to open" },
  { category: "Something with a screen", hint: "Digital life" },
  { category: "A website", hint: "www dot" },
  { category: "Something that uses batteries", hint: "Portable power" },
]

// Get random prompts for a game
export function getRandomMindMeldPrompts(count = 5) {
  const shuffled = [...MIND_MELD_PROMPTS].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

// Simple string similarity for matching answers
export function normalizeAnswer(answer) {
  return answer
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, '') // Remove punctuation
    .replace(/\s+/g, ' ')        // Normalize spaces
    .replace(/^(a|an|the)\s+/i, '') // Remove articles
}

// Check if two answers match
export function answersMatch(a, b) {
  const normA = normalizeAnswer(a)
  const normB = normalizeAnswer(b)
  
  // Exact match
  if (normA === normB) return true
  
  // One contains the other (for minor variations)
  if (normA.includes(normB) || normB.includes(normA)) {
    // Only if they're similar length to avoid false positives
    const lenRatio = Math.min(normA.length, normB.length) / Math.max(normA.length, normB.length)
    return lenRatio > 0.7
  }
  
  return false
}

// Calculate matches and scores for a round
export function calculateRoundMatches(answers) {
  // answers: { playerId: answer, ... }
  const players = Object.keys(answers)
  const matches = {}
  const scores = {}
  
  // Initialize
  players.forEach(p => {
    matches[p] = []
    scores[p] = 0
  })
  
  // Find all matches
  for (let i = 0; i < players.length; i++) {
    for (let j = i + 1; j < players.length; j++) {
      const p1 = players[i]
      const p2 = players[j]
      
      if (answersMatch(answers[p1], answers[p2])) {
        matches[p1].push(p2)
        matches[p2].push(p1)
      }
    }
  }
  
  // Calculate scores
  // Base: 10 points per match
  // Bonus: If EVERYONE matches = 20 points each
  const everyoneMatched = players.every(p => matches[p].length === players.length - 1)
  
  players.forEach(p => {
    const matchCount = matches[p].length
    scores[p] = matchCount * 10
    
    if (everyoneMatched && players.length >= 3) {
      scores[p] += 20 // Perfect mind meld bonus
    }
  })
  
  return { matches, scores, perfectMeld: everyoneMatched && players.length >= 3 }
}
