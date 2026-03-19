// Hot Take questions - spicy opinion questions
export const HOT_TAKE_QUESTIONS = [
  // Would You Rather
  { category: 'Would You Rather', question: 'Would you rather be able to fly or be invisible?' },
  { category: 'Would You Rather', question: 'Would you rather have unlimited money or unlimited time?' },
  { category: 'Would You Rather', question: 'Would you rather live in the city or countryside?' },
  { category: 'Would You Rather', question: 'Would you rather be famous or powerful?' },
  { category: 'Would You Rather', question: 'Would you rather always be hot or always be cold?' },
  { category: 'Would You Rather', question: 'Would you rather lose your phone or your wallet?' },
  { category: 'Would You Rather', question: 'Would you rather have a rewind button or a pause button for life?' },
  { category: 'Would You Rather', question: 'Would you rather know how you die or when you die?' },
  
  // Hot Takes
  { category: 'Hot Take', question: 'Pineapple on pizza: yes or no?' },
  { category: 'Hot Take', question: 'Is a hot dog a sandwich?' },
  { category: 'Hot Take', question: 'Toilet paper: over or under?' },
  { category: 'Hot Take', question: 'Morning person or night owl?' },
  { category: 'Hot Take', question: 'Dogs or cats?' },
  { category: 'Hot Take', question: 'Beach vacation or mountain vacation?' },
  { category: 'Hot Take', question: 'Summer or winter?' },
  { category: 'Hot Take', question: 'Coffee or tea?' },
  { category: 'Hot Take', question: 'Books or movies?' },
  { category: 'Hot Take', question: 'Text or call?' },
  { category: 'Hot Take', question: 'Early bird or procrastinator?' },
  { category: 'Hot Take', question: 'Sweet or savory breakfast?' },
  
  // This or That
  { category: 'This or That', question: 'Netflix or cinema?' },
  { category: 'This or That', question: 'Cooking or ordering in?' },
  { category: 'This or That', question: 'Road trip or flying?' },
  { category: 'This or That', question: 'Suburbs or downtown?' },
  { category: 'This or That', question: 'Save money or spend it?' },
  { category: 'This or That', question: 'Plan everything or go with the flow?' },
  { category: 'This or That', question: 'Big party or small gathering?' },
  { category: 'This or That', question: 'Shower in morning or at night?' },
  
  // Controversial
  { category: 'Controversial', question: 'Is cereal a soup?' },
  { category: 'Controversial', question: 'Should you put milk or cereal first?' },
  { category: 'Controversial', question: 'GIF pronounced "jif" or "gif"?' },
  { category: 'Controversial', question: 'Should you recline your seat on a plane?' },
  { category: 'Controversial', question: 'Does the week start on Sunday or Monday?' },
  { category: 'Controversial', question: 'Socks with sandals: acceptable or not?' },
  
  // Deep Questions
  { category: 'Deep', question: 'Do you believe in fate or free will?' },
  { category: 'Deep', question: 'Quality or quantity in friendships?' },
  { category: 'Deep', question: 'Live fast or live long?' },
  { category: 'Deep', question: 'Fame or privacy?' },
  { category: 'Deep', question: 'Change the past or know the future?' },
]

// Get random questions for a game (5 rounds)
export function getRandomQuestions(count = 5) {
  const shuffled = [...HOT_TAKE_QUESTIONS].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

// Get question by index
export function getQuestion(questions, index) {
  return questions[index] || null
}
