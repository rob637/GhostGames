// Quick Draw prompts - things to draw
export const DRAW_PROMPTS = [
  // Easy
  { word: 'sun', difficulty: 'easy' },
  { word: 'house', difficulty: 'easy' },
  { word: 'tree', difficulty: 'easy' },
  { word: 'cat', difficulty: 'easy' },
  { word: 'dog', difficulty: 'easy' },
  { word: 'fish', difficulty: 'easy' },
  { word: 'bird', difficulty: 'easy' },
  { word: 'flower', difficulty: 'easy' },
  { word: 'star', difficulty: 'easy' },
  { word: 'heart', difficulty: 'easy' },
  { word: 'moon', difficulty: 'easy' },
  { word: 'apple', difficulty: 'easy' },
  { word: 'banana', difficulty: 'easy' },
  { word: 'car', difficulty: 'easy' },
  { word: 'boat', difficulty: 'easy' },
  { word: 'ball', difficulty: 'easy' },
  { word: 'book', difficulty: 'easy' },
  { word: 'cup', difficulty: 'easy' },
  { word: 'hat', difficulty: 'easy' },
  { word: 'shoe', difficulty: 'easy' },
  
  // Medium
  { word: 'pizza', difficulty: 'medium' },
  { word: 'guitar', difficulty: 'medium' },
  { word: 'camera', difficulty: 'medium' },
  { word: 'bicycle', difficulty: 'medium' },
  { word: 'airplane', difficulty: 'medium' },
  { word: 'umbrella', difficulty: 'medium' },
  { word: 'snowman', difficulty: 'medium' },
  { word: 'rainbow', difficulty: 'medium' },
  { word: 'rocket', difficulty: 'medium' },
  { word: 'castle', difficulty: 'medium' },
  { word: 'dragon', difficulty: 'medium' },
  { word: 'robot', difficulty: 'medium' },
  { word: 'penguin', difficulty: 'medium' },
  { word: 'elephant', difficulty: 'medium' },
  { word: 'birthday cake', difficulty: 'medium' },
  { word: 'ice cream', difficulty: 'medium' },
  { word: 'hamburger', difficulty: 'medium' },
  { word: 'laptop', difficulty: 'medium' },
  { word: 'headphones', difficulty: 'medium' },
  { word: 'soccer ball', difficulty: 'medium' },
  
  // Hard
  { word: 'happiness', difficulty: 'hard' },
  { word: 'time', difficulty: 'hard' },
  { word: 'music', difficulty: 'hard' },
  { word: 'freedom', difficulty: 'hard' },
  { word: 'dream', difficulty: 'hard' },
  { word: 'love', difficulty: 'hard' },
  { word: 'gravity', difficulty: 'hard' },
  { word: 'electricity', difficulty: 'hard' },
  { word: 'silence', difficulty: 'hard' },
  { word: 'imagination', difficulty: 'hard' },
]

// Get random prompts for a game
export function getRandomPrompts() {
  // Mix of difficulties - returns 6 prompts
  const easy = DRAW_PROMPTS.filter(p => p.difficulty === 'easy')
  const medium = DRAW_PROMPTS.filter(p => p.difficulty === 'medium')
  const hard = DRAW_PROMPTS.filter(p => p.difficulty === 'hard')
  
  const shuffleAndTake = (arr, n) => {
    const shuffled = [...arr].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, n)
  }
  
  // 3 easy, 2 medium, 1 hard
  const selected = [
    ...shuffleAndTake(easy, 3),
    ...shuffleAndTake(medium, 2),
    ...shuffleAndTake(hard, 1),
  ]
  
  return selected.sort(() => Math.random() - 0.5)
}

// Get prompt by index
export function getPrompt(prompts, index) {
  return prompts[index] || null
}
