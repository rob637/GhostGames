// Caption This - funny scenarios to caption (using emojis + descriptions)
export const CAPTION_SCENES = [
  {
    id: 1,
    emoji: '🐕 💼 🏢',
    description: 'A dog sitting at a desk in an office, looking very serious',
    hint: 'Corporate dog life',
  },
  {
    id: 2,
    emoji: '👵 🎮 😤',
    description: 'Grandma intensely playing video games, about to rage quit',
    hint: 'Gamer grandma',
  },
  {
    id: 3,
    emoji: '🐱 📦 👑',
    description: 'A cat sitting in a cardboard box, wearing a tiny crown',
    hint: 'Royal feline',
  },
  {
    id: 4,
    emoji: '🤖 💔 🧹',
    description: 'A sad robot holding a broom, staring at a mess',
    hint: 'Robot problems',
  },
  {
    id: 5,
    emoji: '👶 🍝 😱',
    description: 'A baby covered in spaghetti, looking proud of the chaos',
    hint: 'Pasta disaster',
  },
  {
    id: 6,
    emoji: '🦆 🚗 😎',
    description: 'A duck driving a tiny car with sunglasses on',
    hint: 'Cool duck',
  },
  {
    id: 7,
    emoji: '🐸 ☕ 🔥',
    description: 'A frog sipping coffee while everything around is on fire',
    hint: 'This is fine',
  },
  {
    id: 8,
    emoji: '🦝 🗑️ 🎩',
    description: 'A raccoon in a top hat presenting a trash can like a treasure',
    hint: 'Fancy trash panda',
  },
  {
    id: 9,
    emoji: '🐧 🏖️ ❄️',
    description: 'A penguin at a beach, looking confused by the sunshine',
    hint: 'Wrong vacation',
  },
  {
    id: 10,
    emoji: '👻 📱 😊',
    description: 'A ghost trying to take a selfie but not showing up',
    hint: 'Ghost problems',
  },
  {
    id: 11,
    emoji: '🦁 🥗 😒',
    description: 'A lion staring disappointedly at a salad',
    hint: 'Diet day',
  },
  {
    id: 12,
    emoji: '🐙 🎹 🎶',
    description: 'An octopus playing multiple instruments at once',
    hint: 'Multi-talented',
  },
  {
    id: 13,
    emoji: '🦊 📚 🤓',
    description: 'A fox wearing glasses, buried in a pile of books',
    hint: 'Studious fox',
  },
  {
    id: 14,
    emoji: '🐻 🍯 🚔',
    description: 'A bear being caught red-handed stealing honey',
    hint: 'Honey heist',
  },
  {
    id: 15,
    emoji: '🦄 🌈 😑',
    description: 'A unicorn on a Monday morning, looking very unenthusiastic',
    hint: 'Monday unicorn',
  },
  {
    id: 16,
    emoji: '🐔 🚀 🌙',
    description: 'A chicken in a spacesuit on the moon',
    hint: 'Space chicken',
  },
  {
    id: 17,
    emoji: '🦥 ⏰ 😴',
    description: 'A sloth hitting the snooze button for the 47th time',
    hint: 'Relatable sloth',
  },
  {
    id: 18,
    emoji: '🐶 🎂 🎉',
    description: 'A dog staring at a birthday cake with laser focus',
    hint: 'Birthday wishes',
  },
  {
    id: 19,
    emoji: '🦉 ☀️ 😵',
    description: 'An owl trying to function during daylight hours',
    hint: 'Night shift struggles',
  },
  {
    id: 20,
    emoji: '🐷 💅 👸',
    description: 'A pig at a spa getting a mud bath and looking fabulous',
    hint: 'Self care',
  },
]

// Get random scenes for a game
export function getRandomScenes(count = 5) {
  const shuffled = [...CAPTION_SCENES].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

// Get scene by index
export function getScene(scenes, index) {
  return scenes[index] || null
}
