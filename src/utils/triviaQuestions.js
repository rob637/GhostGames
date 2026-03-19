// Trivia questions with varying difficulty
// Points: faster answers = more points (max 1000 per question)

export const TRIVIA_QUESTIONS = [
  // Easy
  { question: "What color are bananas when they're ripe?", answer: "yellow", options: ["yellow", "green", "blue", "red"], difficulty: "easy" },
  { question: "How many legs does a spider have?", answer: "8", options: ["6", "8", "10", "12"], difficulty: "easy" },
  { question: "What is the largest planet in our solar system?", answer: "jupiter", options: ["mars", "saturn", "jupiter", "neptune"], difficulty: "easy" },
  { question: "What do bees make?", answer: "honey", options: ["milk", "honey", "sugar", "silk"], difficulty: "easy" },
  { question: "How many days are in a week?", answer: "7", options: ["5", "6", "7", "8"], difficulty: "easy" },
  { question: "What is frozen water called?", answer: "ice", options: ["snow", "ice", "frost", "sleet"], difficulty: "easy" },
  { question: "What animal says 'moo'?", answer: "cow", options: ["pig", "sheep", "cow", "horse"], difficulty: "easy" },
  { question: "How many colors are in a rainbow?", answer: "7", options: ["5", "6", "7", "8"], difficulty: "easy" },
  { question: "What is the opposite of hot?", answer: "cold", options: ["warm", "cold", "cool", "freezing"], difficulty: "easy" },
  { question: "What shape has three sides?", answer: "triangle", options: ["square", "circle", "triangle", "rectangle"], difficulty: "easy" },
  
  // Medium
  { question: "What year did the Titanic sink?", answer: "1912", options: ["1905", "1912", "1920", "1898"], difficulty: "medium" },
  { question: "What is the capital of Australia?", answer: "canberra", options: ["sydney", "melbourne", "canberra", "perth"], difficulty: "medium" },
  { question: "How many bones are in the human body?", answer: "206", options: ["186", "206", "226", "256"], difficulty: "medium" },
  { question: "Which planet is known as the Red Planet?", answer: "mars", options: ["venus", "mars", "jupiter", "mercury"], difficulty: "medium" },
  { question: "What is the largest ocean on Earth?", answer: "pacific", options: ["atlantic", "indian", "pacific", "arctic"], difficulty: "medium" },
  { question: "In what year did World War II end?", answer: "1945", options: ["1943", "1944", "1945", "1946"], difficulty: "medium" },
  { question: "What element does 'O' represent on the periodic table?", answer: "oxygen", options: ["osmium", "oxygen", "oganesson", "gold"], difficulty: "medium" },
  { question: "How many continents are there?", answer: "7", options: ["5", "6", "7", "8"], difficulty: "medium" },
  { question: "What is the fastest land animal?", answer: "cheetah", options: ["lion", "cheetah", "leopard", "horse"], difficulty: "medium" },
  { question: "What language has the most native speakers?", answer: "mandarin", options: ["english", "spanish", "mandarin", "hindi"], difficulty: "medium" },
  { question: "What is the smallest country in the world?", answer: "vatican", options: ["monaco", "vatican", "san marino", "liechtenstein"], difficulty: "medium" },
  { question: "How many strings does a standard guitar have?", answer: "6", options: ["4", "5", "6", "8"], difficulty: "medium" },
  { question: "What is the chemical symbol for gold?", answer: "au", options: ["go", "gd", "au", "ag"], difficulty: "medium" },
  { question: "Which US state is the largest by area?", answer: "alaska", options: ["texas", "california", "alaska", "montana"], difficulty: "medium" },
  { question: "How many Harry Potter books are there?", answer: "7", options: ["5", "6", "7", "8"], difficulty: "medium" },
  
  // Hard
  { question: "What year was the first iPhone released?", answer: "2007", options: ["2005", "2006", "2007", "2008"], difficulty: "hard" },
  { question: "What is the capital of Mongolia?", answer: "ulaanbaatar", options: ["astana", "ulaanbaatar", "bishkek", "almaty"], difficulty: "hard" },
  { question: "How many teeth does an adult human have?", answer: "32", options: ["28", "30", "32", "34"], difficulty: "hard" },
  { question: "What element has the atomic number 79?", answer: "gold", options: ["silver", "gold", "platinum", "copper"], difficulty: "hard" },
  { question: "In what year did the Berlin Wall fall?", answer: "1989", options: ["1987", "1988", "1989", "1990"], difficulty: "hard" },
  { question: "What is the longest river in the world?", answer: "nile", options: ["amazon", "nile", "yangtze", "mississippi"], difficulty: "hard" },
  { question: "How many symphonies did Beethoven compose?", answer: "9", options: ["7", "8", "9", "10"], difficulty: "hard" },
  { question: "What is the hardest natural substance?", answer: "diamond", options: ["titanium", "diamond", "graphene", "tungsten"], difficulty: "hard" },
  { question: "Which country has won the most FIFA World Cups?", answer: "brazil", options: ["germany", "italy", "brazil", "argentina"], difficulty: "hard" },
  { question: "What year was Wikipedia launched?", answer: "2001", options: ["1999", "2001", "2003", "2005"], difficulty: "hard" },
]

// Get random questions for a game
export function getRandomTriviaQuestions(count = 7) {
  const shuffled = [...TRIVIA_QUESTIONS].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count).map((q, i) => ({
    ...q,
    id: i,
    // Shuffle options for each question
    options: [...q.options].sort(() => Math.random() - 0.5),
  }))
}

// Calculate points based on time taken (max 10 seconds)
export function calculatePoints(timeTakenMs, isCorrect) {
  if (!isCorrect) return 0
  
  const maxTime = 10000 // 10 seconds
  const minPoints = 100
  const maxPoints = 1000
  
  if (timeTakenMs >= maxTime) return minPoints
  
  // Linear scale: faster = more points
  const timeRatio = 1 - (timeTakenMs / maxTime)
  const points = Math.round(minPoints + (maxPoints - minPoints) * timeRatio)
  
  return points
}
