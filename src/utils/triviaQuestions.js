/**
 * Trivia Questions
 * 
 * Questions with varying difficulty and categories.
 * Points: faster answers = more points (max 1000 per question)
 * 
 * Categories ensure variety in game sessions.
 * All answers are lowercase for comparison.
 */

export const TRIVIA_QUESTIONS = [
  // ═══════════════════════════════════════════════════════════════
  // EASY - Common knowledge, quick recall
  // ═══════════════════════════════════════════════════════════════
  
  // General Knowledge
  { question: "What color are bananas when they're ripe?", answer: "yellow", options: ["yellow", "green", "blue", "red"], difficulty: "easy", category: "general" },
  { question: "How many legs does a spider have?", answer: "8", options: ["6", "8", "10", "12"], difficulty: "easy", category: "animals" },
  { question: "What do bees make?", answer: "honey", options: ["milk", "honey", "sugar", "silk"], difficulty: "easy", category: "animals" },
  { question: "How many days are in a week?", answer: "7", options: ["5", "6", "7", "8"], difficulty: "easy", category: "general" },
  { question: "What is frozen water called?", answer: "ice", options: ["snow", "ice", "frost", "sleet"], difficulty: "easy", category: "science" },
  { question: "What animal says 'moo'?", answer: "cow", options: ["pig", "sheep", "cow", "horse"], difficulty: "easy", category: "animals" },
  { question: "How many colors are in a rainbow?", answer: "7", options: ["5", "6", "7", "8"], difficulty: "easy", category: "science" },
  { question: "What is the opposite of hot?", answer: "cold", options: ["warm", "cold", "cool", "freezing"], difficulty: "easy", category: "general" },
  { question: "What shape has three sides?", answer: "triangle", options: ["square", "circle", "triangle", "rectangle"], difficulty: "easy", category: "general" },
  { question: "What is the largest planet in our solar system?", answer: "jupiter", options: ["mars", "saturn", "jupiter", "neptune"], difficulty: "easy", category: "science" },
  
  // Animals - Easy
  { question: "What is the fastest land animal?", answer: "cheetah", options: ["lion", "cheetah", "leopard", "horse"], difficulty: "easy", category: "animals" },
  { question: "How many legs does a dog have?", answer: "4", options: ["2", "4", "6", "8"], difficulty: "easy", category: "animals" },
  { question: "What animal is known as man's best friend?", answer: "dog", options: ["cat", "dog", "horse", "bird"], difficulty: "easy", category: "animals" },
  { question: "What is a baby cat called?", answer: "kitten", options: ["puppy", "kitten", "cub", "calf"], difficulty: "easy", category: "animals" },
  { question: "Which bird can't fly?", answer: "penguin", options: ["eagle", "penguin", "seagull", "hawk"], difficulty: "easy", category: "animals" },
  { question: "What animal has a trunk?", answer: "elephant", options: ["giraffe", "elephant", "rhino", "hippo"], difficulty: "easy", category: "animals" },
  
  // Food - Easy
  { question: "What fruit is typically red and grows on trees?", answer: "apple", options: ["banana", "apple", "grape", "orange"], difficulty: "easy", category: "food" },
  { question: "What meal do you eat in the morning?", answer: "breakfast", options: ["lunch", "dinner", "breakfast", "brunch"], difficulty: "easy", category: "food" },
  { question: "What color is a ripe tomato?", answer: "red", options: ["green", "yellow", "red", "orange"], difficulty: "easy", category: "food" },
  { question: "Milk comes from which animal?", answer: "cow", options: ["chicken", "pig", "cow", "sheep"], difficulty: "easy", category: "food" },
  { question: "What is the main ingredient in bread?", answer: "flour", options: ["sugar", "flour", "salt", "butter"], difficulty: "easy", category: "food" },
  
  // Geography - Easy
  { question: "What is the largest ocean on Earth?", answer: "pacific", options: ["atlantic", "indian", "pacific", "arctic"], difficulty: "easy", category: "geography" },
  { question: "How many continents are there?", answer: "7", options: ["5", "6", "7", "8"], difficulty: "easy", category: "geography" },
  { question: "What is the capital of France?", answer: "paris", options: ["london", "paris", "berlin", "rome"], difficulty: "easy", category: "geography" },
  { question: "What country is famous for pizza and pasta?", answer: "italy", options: ["france", "spain", "italy", "greece"], difficulty: "easy", category: "geography" },
  { question: "What country has the most people?", answer: "china", options: ["india", "usa", "china", "brazil"], difficulty: "easy", category: "geography" },
  
  // Pop Culture - Easy
  { question: "What color is Pikachu?", answer: "yellow", options: ["red", "yellow", "blue", "green"], difficulty: "easy", category: "pop culture" },
  { question: "Who lives in a pineapple under the sea?", answer: "spongebob", options: ["patrick", "spongebob", "squidward", "sandy"], difficulty: "easy", category: "pop culture" },
  { question: "What is Mickey Mouse's girlfriend's name?", answer: "minnie", options: ["daisy", "minnie", "goofy", "pluto"], difficulty: "easy", category: "pop culture" },
  { question: "How many Dalmatians are in the Disney movie title?", answer: "101", options: ["99", "100", "101", "102"], difficulty: "easy", category: "pop culture" },
  { question: "What color is Superman's cape?", answer: "red", options: ["blue", "red", "yellow", "green"], difficulty: "easy", category: "pop culture" },
  
  // ═══════════════════════════════════════════════════════════════
  // MEDIUM - Requires some knowledge
  // ═══════════════════════════════════════════════════════════════
  
  // History - Medium
  { question: "What year did the Titanic sink?", answer: "1912", options: ["1905", "1912", "1920", "1898"], difficulty: "medium", category: "history" },
  { question: "In what year did World War II end?", answer: "1945", options: ["1943", "1944", "1945", "1946"], difficulty: "medium", category: "history" },
  { question: "Who was the first person to walk on the moon?", answer: "neil armstrong", options: ["buzz aldrin", "neil armstrong", "yuri gagarin", "john glenn"], difficulty: "medium", category: "history" },
  { question: "What ancient wonder was located in Egypt?", answer: "pyramids", options: ["colosseum", "pyramids", "parthenon", "stonehenge"], difficulty: "medium", category: "history" },
  { question: "Who painted the Mona Lisa?", answer: "da vinci", options: ["michelangelo", "da vinci", "picasso", "rembrandt"], difficulty: "medium", category: "history" },
  { question: "What empire built the Colosseum?", answer: "roman", options: ["greek", "roman", "persian", "ottoman"], difficulty: "medium", category: "history" },
  { question: "What year did the American Civil War begin?", answer: "1861", options: ["1850", "1861", "1865", "1870"], difficulty: "medium", category: "history" },
  
  // Science - Medium
  { question: "Which planet is known as the Red Planet?", answer: "mars", options: ["venus", "mars", "jupiter", "mercury"], difficulty: "medium", category: "science" },
  { question: "What element does 'O' represent on the periodic table?", answer: "oxygen", options: ["osmium", "oxygen", "oganesson", "gold"], difficulty: "medium", category: "science" },
  { question: "How many bones are in the human body?", answer: "206", options: ["186", "206", "226", "256"], difficulty: "medium", category: "science" },
  { question: "What is the chemical symbol for gold?", answer: "au", options: ["go", "gd", "au", "ag"], difficulty: "medium", category: "science" },
  { question: "What planet is closest to the Sun?", answer: "mercury", options: ["venus", "mercury", "mars", "earth"], difficulty: "medium", category: "science" },
  { question: "What is the hardest natural substance?", answer: "diamond", options: ["titanium", "diamond", "graphene", "tungsten"], difficulty: "medium", category: "science" },
  { question: "What gas do plants absorb from the air?", answer: "carbon dioxide", options: ["oxygen", "nitrogen", "carbon dioxide", "hydrogen"], difficulty: "medium", category: "science" },
  { question: "How many planets are in our solar system?", answer: "8", options: ["7", "8", "9", "10"], difficulty: "medium", category: "science" },
  
  // Geography - Medium
  { question: "What is the capital of Australia?", answer: "canberra", options: ["sydney", "melbourne", "canberra", "perth"], difficulty: "medium", category: "geography" },
  { question: "Which US state is the largest by area?", answer: "alaska", options: ["texas", "california", "alaska", "montana"], difficulty: "medium", category: "geography" },
  { question: "What is the smallest country in the world?", answer: "vatican", options: ["monaco", "vatican", "san marino", "liechtenstein"], difficulty: "medium", category: "geography" },
  { question: "What is the longest river in the world?", answer: "nile", options: ["amazon", "nile", "yangtze", "mississippi"], difficulty: "medium", category: "geography" },
  { question: "What mountain is the tallest in the world?", answer: "everest", options: ["k2", "everest", "kilimanjaro", "denali"], difficulty: "medium", category: "geography" },
  { question: "What country has the most time zones?", answer: "france", options: ["russia", "usa", "france", "china"], difficulty: "medium", category: "geography" },
  { question: "What is the capital of Japan?", answer: "tokyo", options: ["osaka", "tokyo", "kyoto", "hiroshima"], difficulty: "medium", category: "geography" },
  { question: "What country is home to the Amazon rainforest?", answer: "brazil", options: ["peru", "colombia", "brazil", "venezuela"], difficulty: "medium", category: "geography" },
  
  // Pop Culture - Medium
  { question: "How many Harry Potter books are there?", answer: "7", options: ["5", "6", "7", "8"], difficulty: "medium", category: "pop culture" },
  { question: "What is the name of the coffee shop in Friends?", answer: "central perk", options: ["central perk", "java joe", "the brew", "coffee time"], difficulty: "medium", category: "pop culture" },
  { question: "What year was the first Star Wars movie released?", answer: "1977", options: ["1975", "1977", "1979", "1981"], difficulty: "medium", category: "pop culture" },
  { question: "Who played Jack in Titanic?", answer: "dicaprio", options: ["pitt", "dicaprio", "depp", "cruise"], difficulty: "medium", category: "pop culture" },
  { question: "What is the highest-grossing film of all time?", answer: "avatar", options: ["titanic", "avengers endgame", "avatar", "star wars"], difficulty: "medium", category: "pop culture" },
  { question: "What video game character collects coins and fights Bowser?", answer: "mario", options: ["sonic", "mario", "link", "kirby"], difficulty: "medium", category: "pop culture" },
  { question: "What band was John Lennon in?", answer: "beatles", options: ["rolling stones", "beatles", "led zeppelin", "the who"], difficulty: "medium", category: "pop culture" },
  { question: "Who wrote the Game of Thrones books?", answer: "george r.r. martin", options: ["j.r.r. tolkien", "george r.r. martin", "stephen king", "brandon sanderson"], difficulty: "medium", category: "pop culture" },
  
  // Sports - Medium
  { question: "How many players are on a soccer team?", answer: "11", options: ["9", "10", "11", "12"], difficulty: "medium", category: "sports" },
  { question: "What country hosted the 2016 Summer Olympics?", answer: "brazil", options: ["usa", "japan", "brazil", "uk"], difficulty: "medium", category: "sports" },
  { question: "How many rings are on the Olympic flag?", answer: "5", options: ["4", "5", "6", "7"], difficulty: "medium", category: "sports" },
  { question: "What sport uses a shuttlecock?", answer: "badminton", options: ["tennis", "badminton", "squash", "volleyball"], difficulty: "medium", category: "sports" },
  { question: "Which country has won the most FIFA World Cups?", answer: "brazil", options: ["germany", "italy", "brazil", "argentina"], difficulty: "medium", category: "sports" },
  { question: "How many points is a touchdown worth?", answer: "6", options: ["5", "6", "7", "8"], difficulty: "medium", category: "sports" },
  { question: "What sport is Tiger Woods famous for?", answer: "golf", options: ["tennis", "golf", "basketball", "baseball"], difficulty: "medium", category: "sports" },
  
  // Technology - Medium
  { question: "What company makes the iPhone?", answer: "apple", options: ["samsung", "apple", "google", "microsoft"], difficulty: "medium", category: "technology" },
  { question: "What does 'www' stand for?", answer: "world wide web", options: ["world wide web", "web wide world", "wide world web", "world web wide"], difficulty: "medium", category: "technology" },
  { question: "Who founded Microsoft?", answer: "bill gates", options: ["steve jobs", "bill gates", "jeff bezos", "mark zuckerberg"], difficulty: "medium", category: "technology" },
  { question: "What social media platform uses a bird logo?", answer: "twitter", options: ["facebook", "instagram", "twitter", "snapchat"], difficulty: "medium", category: "technology" },
  { question: "What does 'CPU' stand for?", answer: "central processing unit", options: ["central processing unit", "computer personal unit", "central power unit", "core processing unit"], difficulty: "medium", category: "technology" },
  
  // ═══════════════════════════════════════════════════════════════
  // HARD - Requires specific knowledge
  // ═══════════════════════════════════════════════════════════════
  
  // History - Hard
  { question: "In what year did the Berlin Wall fall?", answer: "1989", options: ["1987", "1988", "1989", "1990"], difficulty: "hard", category: "history" },
  { question: "Who was the first female Prime Minister of the UK?", answer: "thatcher", options: ["thatcher", "may", "churchill", "blair"], difficulty: "hard", category: "history" },
  { question: "What year was the Declaration of Independence signed?", answer: "1776", options: ["1774", "1775", "1776", "1777"], difficulty: "hard", category: "history" },
  { question: "What civilization built Machu Picchu?", answer: "inca", options: ["maya", "aztec", "inca", "olmec"], difficulty: "hard", category: "history" },
  { question: "Who was the first woman to win a Nobel Prize?", answer: "marie curie", options: ["marie curie", "mother teresa", "rosa parks", "jane goodall"], difficulty: "hard", category: "history" },
  
  // Science - Hard
  { question: "What element has the atomic number 79?", answer: "gold", options: ["silver", "gold", "platinum", "copper"], difficulty: "hard", category: "science" },
  { question: "How many teeth does an adult human have?", answer: "32", options: ["28", "30", "32", "34"], difficulty: "hard", category: "science" },
  { question: "What is the speed of light in km/s (approximately)?", answer: "300000", options: ["150000", "300000", "450000", "600000"], difficulty: "hard", category: "science" },
  { question: "What is the most abundant gas in Earth's atmosphere?", answer: "nitrogen", options: ["oxygen", "nitrogen", "carbon dioxide", "argon"], difficulty: "hard", category: "science" },
  { question: "What organelle is the powerhouse of the cell?", answer: "mitochondria", options: ["nucleus", "mitochondria", "ribosome", "golgi body"], difficulty: "hard", category: "science" },
  { question: "What is the chemical formula for water?", answer: "h2o", options: ["co2", "h2o", "o2", "nacl"], difficulty: "hard", category: "science" },
  
  // Geography - Hard
  { question: "What is the capital of Mongolia?", answer: "ulaanbaatar", options: ["astana", "ulaanbaatar", "bishkek", "almaty"], difficulty: "hard", category: "geography" },
  { question: "What is the deepest ocean trench?", answer: "mariana", options: ["puerto rico", "mariana", "java", "philippine"], difficulty: "hard", category: "geography" },
  { question: "What is the largest desert in the world?", answer: "antarctica", options: ["sahara", "gobi", "antarctica", "arabian"], difficulty: "hard", category: "geography" },
  { question: "What country has the most islands?", answer: "sweden", options: ["indonesia", "philippines", "sweden", "finland"], difficulty: "hard", category: "geography" },
  { question: "What is the longest country in the world?", answer: "chile", options: ["brazil", "russia", "chile", "china"], difficulty: "hard", category: "geography" },
  
  // Technology - Hard
  { question: "What year was the first iPhone released?", answer: "2007", options: ["2005", "2006", "2007", "2008"], difficulty: "hard", category: "technology" },
  { question: "What year was Wikipedia launched?", answer: "2001", options: ["1999", "2001", "2003", "2005"], difficulty: "hard", category: "technology" },
  { question: "What programming language was created by James Gosling?", answer: "java", options: ["python", "java", "c++", "javascript"], difficulty: "hard", category: "technology" },
  { question: "What year was Facebook founded?", answer: "2004", options: ["2002", "2004", "2006", "2008"], difficulty: "hard", category: "technology" },
  { question: "Who is considered the father of computer science?", answer: "turing", options: ["babbage", "turing", "von neumann", "lovelace"], difficulty: "hard", category: "technology" },
  
  // Pop Culture - Hard
  { question: "How many symphonies did Beethoven compose?", answer: "9", options: ["7", "8", "9", "10"], difficulty: "hard", category: "pop culture" },
  { question: "What year was Minecraft first released?", answer: "2011", options: ["2009", "2010", "2011", "2012"], difficulty: "hard", category: "pop culture" },
  { question: "Who directed Pulp Fiction?", answer: "tarantino", options: ["scorsese", "tarantino", "spielberg", "nolan"], difficulty: "hard", category: "pop culture" },
  { question: "What is the best-selling video game of all time?", answer: "minecraft", options: ["tetris", "minecraft", "gta v", "wii sports"], difficulty: "hard", category: "pop culture" },
  { question: "What year was the first Super Bowl?", answer: "1967", options: ["1963", "1965", "1967", "1969"], difficulty: "hard", category: "pop culture" },
  
  // Sports - Hard
  { question: "Who has won the most Grand Slam tennis titles (men)?", answer: "djokovic", options: ["federer", "nadal", "djokovic", "sampras"], difficulty: "hard", category: "sports" },
  { question: "What country won the first ever FIFA World Cup?", answer: "uruguay", options: ["brazil", "argentina", "uruguay", "italy"], difficulty: "hard", category: "sports" },
  { question: "How many NBA championships did Michael Jordan win?", answer: "6", options: ["4", "5", "6", "7"], difficulty: "hard", category: "sports" },
  { question: "What sport is Wayne Gretzky famous for?", answer: "hockey", options: ["hockey", "basketball", "baseball", "football"], difficulty: "hard", category: "sports" },
  { question: "What year were the first modern Olympics held?", answer: "1896", options: ["1886", "1892", "1896", "1900"], difficulty: "hard", category: "sports" },
  
  // Animals - Hard
  { question: "What is the largest species of shark?", answer: "whale shark", options: ["great white", "whale shark", "hammerhead", "tiger shark"], difficulty: "hard", category: "animals" },
  { question: "How long is an elephant's pregnancy (months)?", answer: "22", options: ["12", "18", "22", "26"], difficulty: "hard", category: "animals" },
  { question: "What animal has the longest lifespan?", answer: "tortoise", options: ["elephant", "whale", "tortoise", "parrot"], difficulty: "hard", category: "animals" },
  { question: "What is a group of crows called?", answer: "murder", options: ["flock", "murder", "herd", "pack"], difficulty: "hard", category: "animals" },
  { question: "What is the only mammal that can truly fly?", answer: "bat", options: ["flying squirrel", "bat", "sugar glider", "colugo"], difficulty: "hard", category: "animals" },
]

// Get random questions for a game with category variety
export function getRandomTriviaQuestions(count = 7) {
  const categories = [...new Set(TRIVIA_QUESTIONS.map(q => q.category))]
  const selected = []
  const usedCategories = new Set()
  
  // Progressive difficulty: start easier, get harder
  const difficulties = ['easy', 'easy', 'medium', 'medium', 'medium', 'hard', 'hard']
  
  for (let i = 0; i < count; i++) {
    const targetDifficulty = difficulties[i] || 'medium'
    
    // Get questions matching difficulty, preferring unused categories
    let pool = TRIVIA_QUESTIONS.filter(q => 
      q.difficulty === targetDifficulty && 
      !selected.includes(q) &&
      !usedCategories.has(q.category)
    )
    
    // Fallback: allow reused categories if needed
    if (pool.length === 0) {
      pool = TRIVIA_QUESTIONS.filter(q => 
        q.difficulty === targetDifficulty && 
        !selected.includes(q)
      )
    }
    
    // Fallback: any unused question
    if (pool.length === 0) {
      pool = TRIVIA_QUESTIONS.filter(q => !selected.includes(q))
    }
    
    if (pool.length > 0) {
      const question = pool[Math.floor(Math.random() * pool.length)]
      selected.push(question)
      usedCategories.add(question.category)
    }
  }
  
  return selected.map((q, i) => ({
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
