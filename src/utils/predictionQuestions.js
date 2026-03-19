/**
 * Prediction Game Questions
 * 
 * Questions where players predict how a specific person will answer.
 * Mix of preferences, behaviors, and hypotheticals.
 * Categories ensure variety in game sessions.
 */

export const PREDICTION_QUESTIONS = [
  // ═══════════════════════════════════════════════════════════════
  // PREFERENCES
  // ═══════════════════════════════════════════════════════════════
  { question: "Would {name} rather have breakfast for dinner or dinner for breakfast?", options: ["Breakfast for dinner", "Dinner for breakfast"], category: "preferences" },
  { question: "Does {name} prefer window or aisle seats?", options: ["Window", "Aisle"], category: "preferences" },
  { question: "Would {name} rather have unlimited money or unlimited time?", options: ["Unlimited money", "Unlimited time"], category: "preferences" },
  { question: "Does {name} prefer texting or calling?", options: ["Texting", "Calling"], category: "preferences" },
  { question: "Would {name} rather be too hot or too cold?", options: ["Too hot", "Too cold"], category: "preferences" },
  { question: "Does {name} prefer sweet or savory snacks?", options: ["Sweet", "Savory"], category: "preferences" },
  { question: "Would {name} rather live in the city or countryside?", options: ["City", "Countryside"], category: "preferences" },
  { question: "Does {name} prefer mornings or nights?", options: ["Mornings", "Nights"], category: "preferences" },
  { question: "Would {name} rather always be 10 minutes late or 20 minutes early?", options: ["10 min late", "20 min early"], category: "preferences" },
  { question: "Does {name} prefer cats or dogs?", options: ["Cats", "Dogs"], category: "preferences" },
  { question: "Would {name} rather have super strength or super speed?", options: ["Super strength", "Super speed"], category: "preferences" },
  { question: "Does {name} prefer salty or sweet popcorn?", options: ["Salty", "Sweet"], category: "preferences" },
  { question: "Would {name} rather always speak their mind or never speak again?", options: ["Always speak mind", "Never speak"], category: "preferences" },
  { question: "Does {name} prefer summer or winter?", options: ["Summer", "Winter"], category: "preferences" },
  { question: "Would {name} rather be famous or rich?", options: ["Famous", "Rich"], category: "preferences" },
  
  // ═══════════════════════════════════════════════════════════════
  // BEHAVIORS
  // ═══════════════════════════════════════════════════════════════
  { question: "Does {name} hit snooze or wake up immediately?", options: ["Hits snooze", "Wakes up immediately"], category: "behaviors" },
  { question: "Does {name} plan trips in detail or go with the flow?", options: ["Plans in detail", "Goes with flow"], category: "behaviors" },
  { question: "Does {name} eat the crust on pizza?", options: ["Yes, eats crust", "No, leaves it"], category: "behaviors" },
  { question: "Does {name} reply to texts immediately or hours later?", options: ["Immediately", "Hours later"], category: "behaviors" },
  { question: "Does {name} keep their phone on silent or with sound?", options: ["Silent", "With sound"], category: "behaviors" },
  { question: "Does {name} watch the credits at the end of movies?", options: ["Yes", "No"], category: "behaviors" },
  { question: "Does {name} use their turn signal?", options: ["Always", "Sometimes/never"], category: "behaviors" },
  { question: "Does {name} read instructions or figure it out?", options: ["Reads instructions", "Figures it out"], category: "behaviors" },
  { question: "Does {name} leave dishes in the sink or wash immediately?", options: ["Leaves in sink", "Washes immediately"], category: "behaviors" },
  { question: "Does {name} binge shows or watch weekly?", options: ["Binges", "Watches weekly"], category: "behaviors" },
  { question: "Does {name} shower in the morning or at night?", options: ["Morning", "Night"], category: "behaviors" },
  { question: "Does {name} sing in the shower?", options: ["Yes", "No"], category: "behaviors" },
  { question: "Does {name} sleep with socks on?", options: ["Yes", "No"], category: "behaviors" },
  { question: "Does {name} check their phone first thing in the morning?", options: ["Yes", "No"], category: "behaviors" },
  { question: "Does {name} make their bed every day?", options: ["Yes", "No"], category: "behaviors" },
  
  // ═══════════════════════════════════════════════════════════════
  // HYPOTHETICALS
  // ═══════════════════════════════════════════════════════════════
  { question: "If stuck on a deserted island, would {name} want a knife or matches?", options: ["Knife", "Matches"], category: "hypothetical" },
  { question: "In a zombie apocalypse, would {name} fight or hide?", options: ["Fight", "Hide"], category: "hypothetical" },
  { question: "Would {name} rather fight 1 horse-sized duck or 100 duck-sized horses?", options: ["1 horse-sized duck", "100 duck-sized horses"], category: "hypothetical" },
  { question: "If {name} could only eat one food forever, would it be pizza or tacos?", options: ["Pizza", "Tacos"], category: "hypothetical" },
  { question: "Would {name} rather know when they die or how they die?", options: ["When", "How"], category: "hypothetical" },
  { question: "If {name} won the lottery, would they tell everyone or keep it secret?", options: ["Tell everyone", "Keep it secret"], category: "hypothetical" },
  { question: "Would {name} rather have the ability to fly or be invisible?", options: ["Fly", "Be invisible"], category: "hypothetical" },
  { question: "Would {name} rather live without music or without movies?", options: ["Without music", "Without movies"], category: "hypothetical" },
  { question: "Would {name} rather have a rewind button or a pause button for life?", options: ["Rewind", "Pause"], category: "hypothetical" },
  { question: "Would {name} rather explore space or the deep ocean?", options: ["Space", "Deep ocean"], category: "hypothetical" },
  { question: "Would {name} rather read minds or see the future?", options: ["Read minds", "See the future"], category: "hypothetical" },
  { question: "Would {name} rather give up social media or coffee?", options: ["Social media", "Coffee"], category: "hypothetical" },
  { question: "Would {name} rather always have to whisper or always have to shout?", options: ["Whisper", "Shout"], category: "hypothetical" },
  { question: "Would {name} rather have a personal chef or a personal driver?", options: ["Personal chef", "Personal driver"], category: "hypothetical" },
  { question: "Would {name} rather live in the Harry Potter universe or the Marvel universe?", options: ["Harry Potter", "Marvel"], category: "hypothetical" },
  
  // ═══════════════════════════════════════════════════════════════
  // SOCIAL
  // ═══════════════════════════════════════════════════════════════
  { question: "Would {name} rather host a party or attend one?", options: ["Host", "Attend"], category: "social" },
  { question: "Does {name} prefer small gatherings or big parties?", options: ["Small gatherings", "Big parties"], category: "social" },
  { question: "Would {name} rather give a speech to 1000 people or sing karaoke?", options: ["Speech", "Karaoke"], category: "social" },
  { question: "Does {name} prefer meeting new people or hanging with close friends?", options: ["Meeting new people", "Close friends"], category: "social" },
  { question: "Would {name} rather be overdressed or underdressed?", options: ["Overdressed", "Underdressed"], category: "social" },
  { question: "Does {name} prefer going out or staying in?", options: ["Going out", "Staying in"], category: "social" },
  { question: "Would {name} rather have many acquaintances or few close friends?", options: ["Many acquaintances", "Few close friends"], category: "social" },
  { question: "Does {name} make friends easily?", options: ["Yes", "No"], category: "social" },
  { question: "Would {name} rather be the center of attention or blend in?", options: ["Center of attention", "Blend in"], category: "social" },
  { question: "Does {name} prefer board games or video games at parties?", options: ["Board games", "Video games"], category: "social" },
  
  // ═══════════════════════════════════════════════════════════════
  // LIFESTYLE
  // ═══════════════════════════════════════════════════════════════
  { question: "Would {name} rather travel the world or have a dream home?", options: ["Travel the world", "Dream home"], category: "lifestyle" },
  { question: "Does {name} prefer adventure vacations or relaxing ones?", options: ["Adventure", "Relaxing"], category: "lifestyle" },
  { question: "Would {name} rather work one job they love or many that pay well?", options: ["One job they love", "Many that pay well"], category: "lifestyle" },
  { question: "Does {name} prefer cooking at home or eating out?", options: ["Cooking at home", "Eating out"], category: "lifestyle" },
  { question: "Would {name} rather have a 4-day work week or work from home always?", options: ["4-day week", "Work from home"], category: "lifestyle" },
  { question: "Does {name} prefer physical books or e-books?", options: ["Physical books", "E-books"], category: "lifestyle" },
  { question: "Would {name} rather live near family or in their dream location?", options: ["Near family", "Dream location"], category: "lifestyle" },
  { question: "Does {name} prefer coffee or tea?", options: ["Coffee", "Tea"], category: "lifestyle" },
  { question: "Would {name} rather have a big house in the suburbs or small apartment downtown?", options: ["Big house suburbs", "Small apartment downtown"], category: "lifestyle" },
  { question: "Does {name} exercise regularly?", options: ["Yes", "No"], category: "lifestyle" },
  
  // ═══════════════════════════════════════════════════════════════
  // FOOD
  // ═══════════════════════════════════════════════════════════════
  { question: "Does {name} prefer pineapple on pizza?", options: ["Yes", "No"], category: "food" },
  { question: "Would {name} rather give up cheese or chocolate?", options: ["Cheese", "Chocolate"], category: "food" },
  { question: "Does {name} prefer spicy or mild food?", options: ["Spicy", "Mild"], category: "food" },
  { question: "Would {name} rather have burgers or sushi?", options: ["Burgers", "Sushi"], category: "food" },
  { question: "Does {name} dip fries in their milkshake?", options: ["Yes", "No"], category: "food" },
  { question: "Would {name} rather eat only breakfast foods or only dinner foods?", options: ["Breakfast", "Dinner"], category: "food" },
  { question: "Does {name} prefer ice cream or cake?", options: ["Ice cream", "Cake"], category: "food" },
  { question: "Would {name} try a bug if it was a delicacy?", options: ["Yes", "No"], category: "food" },
  { question: "Does {name} like cilantro?", options: ["Yes", "No"], category: "food" },
  { question: "Would {name} rather have unlimited pizza or unlimited tacos?", options: ["Pizza", "Tacos"], category: "food" },
  
  // ═══════════════════════════════════════════════════════════════
  // ENTERTAINMENT
  // ═══════════════════════════════════════════════════════════════
  { question: "Does {name} prefer movies or TV shows?", options: ["Movies", "TV shows"], category: "entertainment" },
  { question: "Would {name} rather watch a comedy or a thriller?", options: ["Comedy", "Thriller"], category: "entertainment" },
  { question: "Does {name} prefer reading or watching?", options: ["Reading", "Watching"], category: "entertainment" },
  { question: "Would {name} rather attend a concert or a sports game?", options: ["Concert", "Sports game"], category: "entertainment" },
  { question: "Does {name} prefer Marvel or DC?", options: ["Marvel", "DC"], category: "entertainment" },
  { question: "Would {name} rather listen to music or podcasts?", options: ["Music", "Podcasts"], category: "entertainment" },
  { question: "Does {name} prefer happy endings or realistic endings?", options: ["Happy endings", "Realistic endings"], category: "entertainment" },
  { question: "Would {name} rather play video games or board games?", options: ["Video games", "Board games"], category: "entertainment" },
  { question: "Does {name} watch reality TV?", options: ["Yes", "No"], category: "entertainment" },
  { question: "Would {name} rather be in a movie or write a book?", options: ["Be in a movie", "Write a book"], category: "entertainment" },
]

// Get random questions with category variety
export function getRandomPredictionQuestions(count = 8) {
  const categories = [...new Set(PREDICTION_QUESTIONS.map(q => q.category))]
  const selected = []
  const usedCategories = new Set()
  
  for (let i = 0; i < count; i++) {
    // Get questions preferring unused categories
    let pool = PREDICTION_QUESTIONS.filter(q => 
      !selected.includes(q) &&
      !usedCategories.has(q.category)
    )
    
    // Fallback: allow reused categories if needed
    if (pool.length === 0) {
      pool = PREDICTION_QUESTIONS.filter(q => !selected.includes(q))
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
  }))
}
