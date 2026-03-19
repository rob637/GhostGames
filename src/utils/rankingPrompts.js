/**
 * Ranked Choice - Ranking prompts with options to rank
 * Players rank options from best to worst
 * Points for matching others' rankings
 */

export const RANKING_PROMPTS = [
  // ═══════════════════════════════════════════════════════════════
  // FOOD & DRINK
  // ═══════════════════════════════════════════════════════════════
  {
    id: 1,
    category: 'food',
    prompt: 'Rank these pizza toppings (best to worst)',
    options: ['Pepperoni', 'Mushrooms', 'Pineapple', 'Olives', 'Sausage'],
  },
  {
    id: 2,
    category: 'food',
    prompt: 'Rank these breakfast foods',
    options: ['Pancakes', 'Eggs', 'Bacon', 'Cereal', 'Toast'],
  },
  {
    id: 3,
    category: 'food',
    prompt: 'Rank these desserts',
    options: ['Ice Cream', 'Chocolate Cake', 'Cookies', 'Pie', 'Brownies'],
  },
  {
    id: 4,
    category: 'food',
    prompt: 'Rank these fast food chains',
    options: ['McDonald\'s', 'Chick-fil-A', 'Taco Bell', 'Wendy\'s', 'Subway'],
  },
  {
    id: 5,
    category: 'food',
    prompt: 'Rank these drinks',
    options: ['Coffee', 'Tea', 'Soda', 'Water', 'Juice'],
  },
  {
    id: 6,
    category: 'food',
    prompt: 'Rank these snacks',
    options: ['Chips', 'Popcorn', 'Candy', 'Fruit', 'Crackers'],
  },
  
  // ═══════════════════════════════════════════════════════════════
  // ENTERTAINMENT
  // ═══════════════════════════════════════════════════════════════
  {
    id: 7,
    category: 'entertainment',
    prompt: 'Rank these movie genres',
    options: ['Comedy', 'Action', 'Horror', 'Romance', 'Sci-Fi'],
  },
  {
    id: 8,
    category: 'entertainment',
    prompt: 'Rank these streaming services',
    options: ['Netflix', 'Disney+', 'HBO Max', 'Hulu', 'Amazon Prime'],
  },
  {
    id: 9,
    category: 'entertainment',
    prompt: 'Rank these music genres',
    options: ['Pop', 'Hip-Hop', 'Rock', 'Country', 'Electronic'],
  },
  {
    id: 10,
    category: 'entertainment',
    prompt: 'Rank these video game types',
    options: ['Action', 'Puzzle', 'Racing', 'Sports', 'RPG'],
  },
  {
    id: 11,
    category: 'entertainment',
    prompt: 'Rank these social media platforms',
    options: ['Instagram', 'TikTok', 'X/Twitter', 'YouTube', 'Snapchat'],
  },
  {
    id: 12,
    category: 'entertainment',
    prompt: 'Rank these board games',
    options: ['Monopoly', 'Scrabble', 'Chess', 'Uno', 'Clue'],
  },
  
  // ═══════════════════════════════════════════════════════════════
  // TRAVEL & PLACES
  // ═══════════════════════════════════════════════════════════════
  {
    id: 13,
    category: 'travel',
    prompt: 'Rank these vacation types',
    options: ['Beach', 'Mountains', 'City Trip', 'Cruise', 'Camping'],
  },
  {
    id: 14,
    category: 'travel',
    prompt: 'Rank these travel destinations',
    options: ['Paris', 'Tokyo', 'New York', 'Cancun', 'London'],
  },
  {
    id: 15,
    category: 'travel',
    prompt: 'Rank these things to do on a road trip',
    options: ['Listen to Music', 'Play Games', 'Sleep', 'Eat Snacks', 'Take Photos'],
  },
  {
    id: 16,
    category: 'travel',
    prompt: 'Rank these hotel amenities',
    options: ['Pool', 'Free WiFi', 'Breakfast', 'Gym', 'Room Service'],
  },
  
  // ═══════════════════════════════════════════════════════════════
  // LIFESTYLE
  // ═══════════════════════════════════════════════════════════════
  {
    id: 17,
    category: 'lifestyle',
    prompt: 'Rank these ways to relax',
    options: ['Watch TV', 'Read', 'Nap', 'Bath', 'Video Games'],
  },
  {
    id: 18,
    category: 'lifestyle',
    prompt: 'Rank these weekend activities',
    options: ['Sleep In', 'Go Out', 'Clean House', 'See Friends', 'Exercise'],
  },
  {
    id: 19,
    category: 'lifestyle',
    prompt: 'Rank these pets',
    options: ['Dog', 'Cat', 'Fish', 'Bird', 'Hamster'],
  },
  {
    id: 20,
    category: 'lifestyle',
    prompt: 'Rank these seasons',
    options: ['Spring', 'Summer', 'Fall', 'Winter'],
  },
  {
    id: 21,
    category: 'lifestyle',
    prompt: 'Rank these morning activities',
    options: ['Coffee', 'Shower', 'Exercise', 'Scroll Phone', 'Breakfast'],
  },
  {
    id: 22,
    category: 'lifestyle',
    prompt: 'Rank these date ideas',
    options: ['Dinner', 'Movie', 'Walk', 'Concert', 'Cooking Together'],
  },
  
  // ═══════════════════════════════════════════════════════════════
  // HYPOTHETICAL
  // ═══════════════════════════════════════════════════════════════
  {
    id: 23,
    category: 'hypothetical',
    prompt: 'Rank these superpowers',
    options: ['Flight', 'Invisibility', 'Super Strength', 'Time Travel', 'Mind Reading'],
  },
  {
    id: 24,
    category: 'hypothetical',
    prompt: 'Rank these wishes',
    options: ['Unlimited Money', 'Perfect Health', 'True Love', 'World Peace', 'Fame'],
  },
  {
    id: 25,
    category: 'hypothetical',
    prompt: 'Rank these time periods to visit',
    options: ['Ancient Rome', '1920s', 'Medieval', 'Future', 'Dinosaur Era'],
  },
  {
    id: 26,
    category: 'hypothetical',
    prompt: 'Rank these apocalypse scenarios (survivability)',
    options: ['Zombies', 'AI Takeover', 'Aliens', 'Natural Disaster', 'Plague'],
  },
  {
    id: 27,
    category: 'hypothetical',
    prompt: 'Rank these fictional worlds to live in',
    options: ['Harry Potter', 'Star Wars', 'Marvel', 'Lord of the Rings', 'Pokemon'],
  },
  
  // ═══════════════════════════════════════════════════════════════
  // CONTROVERSIAL / FUN
  // ═══════════════════════════════════════════════════════════════
  {
    id: 28,
    category: 'controversial',
    prompt: 'Rank these condiments',
    options: ['Ketchup', 'Mustard', 'Mayo', 'Ranch', 'Hot Sauce'],
  },
  {
    id: 29,
    category: 'controversial',
    prompt: 'Rank these ice cream flavors',
    options: ['Vanilla', 'Chocolate', 'Strawberry', 'Mint Chip', 'Cookie Dough'],
  },
  {
    id: 30,
    category: 'controversial',
    prompt: 'Rank these holidays',
    options: ['Christmas', 'Halloween', 'Thanksgiving', 'New Years', 'Birthday'],
  },
  {
    id: 31,
    category: 'controversial',
    prompt: 'Rank these chores',
    options: ['Laundry', 'Dishes', 'Vacuuming', 'Cooking', 'Taking Out Trash'],
  },
  {
    id: 32,
    category: 'controversial',
    prompt: 'Rank these things to give up for a year',
    options: ['Coffee', 'Social Media', 'Sugar', 'TV', 'Fast Food'],
  },
  
  // ═══════════════════════════════════════════════════════════════
  // PERSONALITY
  // ═══════════════════════════════════════════════════════════════
  {
    id: 33,
    category: 'personality',
    prompt: 'Rank what you value most',
    options: ['Family', 'Friends', 'Career', 'Health', 'Freedom'],
  },
  {
    id: 34,
    category: 'personality',
    prompt: 'Rank these qualities in a friend',
    options: ['Loyalty', 'Humor', 'Honesty', 'Kindness', 'Fun'],
  },
  {
    id: 35,
    category: 'personality',
    prompt: 'Rank these fears',
    options: ['Public Speaking', 'Heights', 'Spiders', 'Failure', 'Being Alone'],
  },
  {
    id: 36,
    category: 'personality',
    prompt: 'Rank these ways to spend $1000',
    options: ['Travel', 'Shopping', 'Savings', 'Experiences', 'Gifts'],
  },
]

// Get random ranking prompts with category variety
export function getRandomRankingPrompts(count = 6) {
  const categories = [...new Set(RANKING_PROMPTS.map(p => p.category))]
  const selected = []
  const usedCategories = new Set()
  
  for (let i = 0; i < count; i++) {
    // Prioritize unused categories
    let pool = RANKING_PROMPTS.filter(p => 
      !selected.includes(p) && !usedCategories.has(p.category)
    )
    
    // Fallback: allow category reuse
    if (pool.length === 0) {
      pool = RANKING_PROMPTS.filter(p => !selected.includes(p))
    }
    
    if (pool.length > 0) {
      const prompt = pool[Math.floor(Math.random() * pool.length)]
      selected.push(prompt)
      usedCategories.add(prompt.category)
    }
  }
  
  return selected
}

// Calculate score difference between two rankings
// Lower score = more similar
export function calculateRankingDifference(ranking1, ranking2) {
  let diff = 0
  ranking1.forEach((item, index) => {
    const otherIndex = ranking2.indexOf(item)
    if (otherIndex !== -1) {
      diff += Math.abs(index - otherIndex)
    }
  })
  return diff
}

// Calculate match percentage (100 = perfect match)
export function calculateMatchPercent(ranking1, ranking2) {
  const maxDiff = ranking1.length * (ranking1.length - 1) / 2 * 2
  const diff = calculateRankingDifference(ranking1, ranking2)
  return Math.round((1 - diff / maxDiff) * 100)
}
