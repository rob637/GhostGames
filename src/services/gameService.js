import { 
  doc, 
  setDoc, 
  updateDoc, 
  onSnapshot,
  arrayUnion,
  serverTimestamp,
  Timestamp,
  getDoc
} from 'firebase/firestore'
import { db } from './firebase'
import { getRandomQuestions } from '../utils/hotTakeQuestions'
import { getRandomPrompts } from '../utils/drawPrompts'
import { getRandomStarter } from '../utils/storyStarters'
import { getRandomTriviaQuestions } from '../utils/triviaQuestions'
import { getRandomMindMeldPrompts } from '../utils/mindMeldPrompts'
import { getRandomMostLikelyPrompts } from '../utils/mostLikelyPrompts'
import { getRandomBluffQuestions } from '../utils/bluffQuestions'
import { getRandomPredictionQuestions } from '../utils/predictionQuestions'
import { getRandomScenes } from '../utils/captionScenes'

// Generate a short game ID
function generateGameId() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Create a new game
export async function createGame(gameType, themeId = null) {
  const gameId = generateGameId()
  const playerId = getOrCreatePlayerId()
  
  const gameData = {
    id: gameId,
    gameType,
    themeId,
    status: 'waiting',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    players: {
      player1: {
        id: playerId,
        name: 'Player 1',
        isAI: false,
        joinedAt: serverTimestamp(),
      },
      player2: null,
    },
    result: null,
  }

  // Game-specific setup
  if (gameType === 'word-volley') {
    gameData.currentTurn = 'player1'
    gameData.turnDeadline = null
    gameData.words = []
  } else if (gameType === 'hot-take') {
    gameData.questions = getRandomQuestions(5)
    gameData.currentRound = 0
    gameData.rounds = []
  } else if (gameType === 'quick-draw') {
    gameData.prompts = getRandomPrompts()
    gameData.currentRound = 0
    gameData.rounds = []
  } else if (gameType === 'story-chain') {
    gameData.starter = getRandomStarter()
    gameData.sentences = []
    gameData.currentTurn = 'player1'
    gameData.totalRounds = 75
  } else if (gameType === 'trivia') {
    gameData.questions = getRandomTriviaQuestions(7)
    gameData.currentRound = 0
    gameData.rounds = []
  } else if (gameType === 'rps') {
    gameData.currentRound = 0
    gameData.rounds = []
    gameData.bestOf = 5
    gameData.scores = { player1: 0, player2: 0 }
  }

  await setDoc(doc(db, 'games', gameId), gameData)
  return gameId
}

// Join an existing game
export async function joinGame(gameId, playerId) {
  const gameRef = doc(db, 'games', gameId)
  
  await updateDoc(gameRef, {
    'players.player2': {
      id: playerId,
      name: 'Player 2',
      isAI: false,
      joinedAt: serverTimestamp(),
    },
    status: 'active',
    turnDeadline: Timestamp.fromDate(new Date(Date.now() + 30000)),
    updatedAt: serverTimestamp(),
  })
}

// Create a rematch game with both players
export async function createRematchGame(oldGameId, oldGame) {
  const newGameId = generateGameId()
  const playerId = getOrCreatePlayerId()
  
  // Determine roles - the player creating rematch becomes player1
  const isPlayer1 = oldGame.players?.player1?.id === playerId
  const otherPlayer = isPlayer1 ? oldGame.players?.player2 : oldGame.players?.player1
  
  const gameData = {
    id: newGameId,
    gameType: oldGame.gameType,
    themeId: oldGame.themeId || null,
    status: 'waiting', // Wait for other player to join
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    previousGameId: oldGameId, // Link to previous game
    players: {
      player1: {
        id: playerId,
        name: 'Player 1',
        isAI: false,
        joinedAt: serverTimestamp(),
      },
      player2: otherPlayer ? {
        id: otherPlayer.id,
        name: 'Player 2',
        isAI: false,
        ready: false, // They need to click "Join" to confirm
      } : null,
    },
    result: null,
  }

  // Game-specific setup (same as createGame)
  if (oldGame.gameType === 'word-volley') {
    gameData.currentTurn = 'player1'
    gameData.turnDeadline = null
    gameData.words = []
  } else if (oldGame.gameType === 'hot-take') {
    gameData.questions = getRandomQuestions(5)
    gameData.currentRound = 0
    gameData.rounds = []
  } else if (oldGame.gameType === 'quick-draw') {
    gameData.prompts = getRandomPrompts()
    gameData.currentRound = 0
    gameData.rounds = []
  } else if (oldGame.gameType === 'story-chain') {
    gameData.starter = getRandomStarter()
    gameData.sentences = []
    gameData.currentTurn = 'player1'
    gameData.totalRounds = 75
  } else if (oldGame.gameType === 'trivia') {
    gameData.questions = getRandomTriviaQuestions(7)
    gameData.currentRound = 0
    gameData.rounds = []
  } else if (oldGame.gameType === 'rps') {
    gameData.currentRound = 0
    gameData.rounds = []
    gameData.bestOf = 5
    gameData.scores = { player1: 0, player2: 0 }
  }

  // Create the new game
  await setDoc(doc(db, 'games', newGameId), gameData)
  
  // Update old game with link to new game
  const oldGameRef = doc(db, 'games', oldGameId)
  await updateDoc(oldGameRef, {
    nextGameId: newGameId,
    updatedAt: serverTimestamp(),
  })
  
  return newGameId
}

// Join a rematch game (when other player created it)
export async function joinRematchGame(gameId) {
  const gameRef = doc(db, 'games', gameId)
  const playerId = getOrCreatePlayerId()
  
  // Get game to check if player is already in player2 slot
  const gameSnap = await getDoc(gameRef)
  const game = gameSnap.data()
  
  // Only update if this player matches the expected player2
  if (game.players?.player2?.id === playerId) {
    await updateDoc(gameRef, {
      'players.player2.ready': true,
      'players.player2.joinedAt': serverTimestamp(),
      status: 'active',
      turnDeadline: Timestamp.fromDate(new Date(Date.now() + 30000)),
      updatedAt: serverTimestamp(),
    })
  } else {
    // Different player - treat as normal join
    await joinGame(gameId, playerId)
  }
}

// Submit a word
export async function submitWord(gameId, word, playerId, playerRole) {
  const gameRef = doc(db, 'games', gameId)
  
  // Switch turn to the other player
  const nextTurn = playerRole === 'player1' ? 'player2' : 'player1'
  
  await updateDoc(gameRef, {
    words: arrayUnion({
      word: word.toLowerCase(),
      playerId,
      timestamp: Timestamp.now(),
    }),
    currentTurn: nextTurn,
    turnDeadline: Timestamp.fromDate(new Date(Date.now() + 30000)),
    updatedAt: serverTimestamp(),
  })
}

// End game with a loser (theme violation, timeout, etc.)
export async function endGameWithLoser(gameId, loserId, reason) {
  const gameRef = doc(db, 'games', gameId)
  
  await updateDoc(gameRef, {
    status: 'finished',
    result: {
      loserId,
      reason,
      endedAt: serverTimestamp(),
    },
    updatedAt: serverTimestamp(),
  })
}

// Hot Take: Submit an answer
export async function submitHotTakeAnswer(gameId, roundIndex, playerRole, answer) {
  const gameRef = doc(db, 'games', gameId)
  const gameSnap = await getDoc(gameRef)
  const game = gameSnap.data()
  
  // Get current rounds array
  const rounds = game.rounds || []
  
  // Ensure rounds array is long enough
  while (rounds.length <= roundIndex) {
    rounds.push({})
  }
  
  // Add this player's answer
  rounds[roundIndex] = {
    ...rounds[roundIndex],
    [playerRole]: answer,
  }
  
  // Check if both players have answered this round
  const roundData = rounds[roundIndex]
  const bothAnswered = roundData.player1 && roundData.player2
  
  const updateData = {
    rounds,
    updatedAt: serverTimestamp(),
  }
  
  // If both answered, advance to next round after a delay (handled client-side)
  if (bothAnswered) {
    const nextRound = roundIndex + 1
    const totalRounds = game.questions?.length || 5
    
    if (nextRound >= totalRounds) {
      updateData.status = 'finished'
    } else {
      updateData.currentRound = nextRound
    }
  }
  
  await updateDoc(gameRef, updateData)
}

// Quick Draw: Update drawing in real-time (stored as JSON string to avoid nested array issue)
export async function updateDrawing(gameId, roundIndex, drawing) {
  const gameRef = doc(db, 'games', gameId)
  
  // Store as JSON string to avoid Firestore nested array limitation
  const drawingJson = JSON.stringify(drawing)
  
  await updateDoc(gameRef, {
    [`currentDrawing`]: drawingJson,
    updatedAt: serverTimestamp(),
  })
}

// Quick Draw: Submit a guess (can happen while drawing)
export async function submitGuess(gameId, roundIndex, guess, isCorrect) {
  const gameRef = doc(db, 'games', gameId)
  const gameSnap = await getDoc(gameRef)
  const game = gameSnap.data()
  
  const rounds = [...(game.rounds || [])]
  
  while (rounds.length <= roundIndex) {
    rounds.push({})
  }
  
  // Store the final drawing from currentDrawing
  const finalDrawing = game.currentDrawing || '[]'
  
  rounds[roundIndex] = {
    ...rounds[roundIndex],
    drawing: finalDrawing,
    guess,
    isCorrect,
    guessedAt: Date.now(),
  }
  
  const updateData = {
    rounds,
    currentDrawing: null, // Clear live drawing
    updatedAt: serverTimestamp(),
  }
  
  // Advance to next round
  const nextRound = roundIndex + 1
  const totalRounds = game.prompts?.length || 6
  
  if (nextRound >= totalRounds) {
    updateData.status = 'finished'
  } else {
    updateData.currentRound = nextRound
  }
  
  await updateDoc(gameRef, updateData)
}

// Quick Draw: Time ran out without correct guess
export async function skipDrawingRound(gameId, roundIndex) {
  const gameRef = doc(db, 'games', gameId)
  const gameSnap = await getDoc(gameRef)
  const game = gameSnap.data()
  
  const rounds = [...(game.rounds || [])]
  
  while (rounds.length <= roundIndex) {
    rounds.push({})
  }
  
  rounds[roundIndex] = {
    ...rounds[roundIndex],
    drawing: game.currentDrawing || '[]',
    guess: null,
    isCorrect: false,
    skipped: true,
  }
  
  const updateData = {
    rounds,
    currentDrawing: null,
    updatedAt: serverTimestamp(),
  }
  
  const nextRound = roundIndex + 1
  const totalRounds = game.prompts?.length || 6
  
  if (nextRound >= totalRounds) {
    updateData.status = 'finished'
  } else {
    updateData.currentRound = nextRound
  }
  
  await updateDoc(gameRef, updateData)
}

// Subscribe to game updates
export function subscribeToGame(gameId, callback) {
  const gameRef = doc(db, 'games', gameId)
  
  return onSnapshot(gameRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.data()
      // Convert Firestore timestamps to milliseconds
      callback({
        ...data,
        turnDeadline: data.turnDeadline?.toMillis?.() || null,
      })
    } else {
      callback(null)
    }
  }, (error) => {
    console.error('Game subscription error:', error)
    callback(null, error)
  })
}

// Get or create a player ID (stored in localStorage)
export function getOrCreatePlayerId() {
  let playerId = localStorage.getItem('ghostgames_player_id')
  if (!playerId) {
    playerId = 'player_' + Math.random().toString(36).substring(2, 15)
    localStorage.setItem('ghostgames_player_id', playerId)
  }
  return playerId
}

// Get player role in a game
export function getPlayerRole(game, playerId) {
  if (game.players?.player1?.id === playerId) return 'player1'
  if (game.players?.player2?.id === playerId) return 'player2'
  return null
}

// Story Chain: Submit a sentence
export async function submitStorySentence(gameId, sentence, playerRole) {
  const gameRef = doc(db, 'games', gameId)
  const gameSnap = await getDoc(gameRef)
  const game = gameSnap.data()
  const playerId = getOrCreatePlayerId()
  
  const sentences = game.sentences || []
  sentences.push({
    text: sentence,
    playerId,
    playerRole,
    timestamp: Timestamp.now(),
  })
  
  // Switch turns
  const nextTurn = playerRole === 'player1' ? 'player2' : 'player1'
  const totalRounds = game.totalRounds || 75
  
  const updateData = {
    sentences,
    currentTurn: nextTurn,
    updatedAt: serverTimestamp(),
  }
  
  // Check if game is finished
  if (sentences.length >= totalRounds) {
    updateData.status = 'finished'
  }
  
  await updateDoc(gameRef, updateData)
}

// Trivia: Submit an answer
export async function submitTriviaAnswer(gameId, roundIndex, playerRole, answerData) {
  const gameRef = doc(db, 'games', gameId)
  const gameSnap = await getDoc(gameRef)
  const game = gameSnap.data()
  
  const rounds = [...(game.rounds || [])]
  
  while (rounds.length <= roundIndex) {
    rounds.push({})
  }
  
  rounds[roundIndex] = {
    ...rounds[roundIndex],
    [playerRole]: answerData,
  }
  
  const updateData = {
    rounds,
    updatedAt: serverTimestamp(),
  }
  
  // Check if both have answered
  const roundData = rounds[roundIndex]
  const bothAnswered = roundData.player1 && roundData.player2
  
  if (bothAnswered) {
    // Wait a moment then advance (let clients show results)
    setTimeout(async () => {
      const nextRound = roundIndex + 1
      const totalRounds = game.questions?.length || 7
      
      const advanceData = {
        updatedAt: serverTimestamp(),
      }
      
      if (nextRound >= totalRounds) {
        advanceData.status = 'finished'
      } else {
        advanceData.currentRound = nextRound
      }
      
      await updateDoc(gameRef, advanceData)
    }, 2500) // 2.5 second delay to show results
  }
  
  await updateDoc(gameRef, updateData)
}

// RPS: Submit a choice (rock, paper, scissors)
export async function submitRPSChoice(gameId, roundIndex, playerRole, choice) {
  const gameRef = doc(db, 'games', gameId)
  const gameSnap = await getDoc(gameRef)
  const game = gameSnap.data()
  
  const rounds = [...(game.rounds || [])]
  
  while (rounds.length <= roundIndex) {
    rounds.push({})
  }
  
  rounds[roundIndex] = {
    ...rounds[roundIndex],
    [playerRole]: {
      choice,
      submittedAt: Date.now(),
    }
  }
  
  const updateData = {
    rounds,
    updatedAt: serverTimestamp(),
  }
  
  // Check if both have chosen
  const roundData = rounds[roundIndex]
  const bothChose = roundData.player1?.choice && roundData.player2?.choice
  
  if (bothChose) {
    // Determine winner
    const p1 = roundData.player1.choice
    const p2 = roundData.player2.choice
    let winner = null
    
    if (p1 === p2) {
      winner = 'tie'
    } else if (
      (p1 === 'rock' && p2 === 'scissors') ||
      (p1 === 'paper' && p2 === 'rock') ||
      (p1 === 'scissors' && p2 === 'paper')
    ) {
      winner = 'player1'
    } else {
      winner = 'player2'
    }
    
    rounds[roundIndex].winner = winner
    
    // Update scores
    const scores = { ...(game.scores || { player1: 0, player2: 0 }) }
    if (winner === 'player1') scores.player1++
    if (winner === 'player2') scores.player2++
    
    updateData.rounds = rounds
    updateData.scores = scores
    
    // Check for game end (first to 3 in best of 5)
    const winTarget = Math.ceil((game.bestOf || 5) / 2)
    
    if (scores.player1 >= winTarget || scores.player2 >= winTarget) {
      // Game over after delay
      setTimeout(async () => {
        await updateDoc(gameRef, {
          status: 'finished',
          winner: scores.player1 >= winTarget ? 'player1' : 'player2',
          updatedAt: serverTimestamp(),
        })
      }, 2000)
    } else {
      // Next round after delay
      setTimeout(async () => {
        await updateDoc(gameRef, {
          currentRound: roundIndex + 1,
          updatedAt: serverTimestamp(),
        })
      }, 2000)
    }
  }
  
  await updateDoc(gameRef, updateData)
}

// ════════════════════════════════════════════════════════════════════════════
// PARTY GAMES (3-8 players)
// Uses array-based player model instead of player1/player2
// ════════════════════════════════════════════════════════════════════════════

// Generate player avatar/name based on index
const PLAYER_COLORS = [
  '#f97316', // orange
  '#22c55e', // green
  '#3b82f6', // blue
  '#a855f7', // purple
  '#ec4899', // pink
  '#eab308', // yellow
  '#14b8a6', // teal
  '#ef4444', // red
]

const PLAYER_ANIMALS = [
  '🦊', '🐸', '🐙', '🦄', '🐼', '🦁', '🐯', '🐨'
]

function getPlayerAvatar(index) {
  return {
    emoji: PLAYER_ANIMALS[index % PLAYER_ANIMALS.length],
    color: PLAYER_COLORS[index % PLAYER_COLORS.length],
    name: `Player ${index + 1}`,
  }
}

// Create a party game
export async function createPartyGame(gameType) {
  const gameId = generateGameId()
  const playerId = getOrCreatePlayerId()
  const avatar = getPlayerAvatar(0)
  
  const gameData = {
    id: gameId,
    gameType,
    isPartyGame: true,
    status: 'lobby', // lobby -> active -> finished
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    hostId: playerId,
    minPlayers: 2,
    maxPlayers: 8,
    
    // Array-based players for party games
    partyPlayers: [
      {
        id: playerId,
        ...avatar,
        isHost: true,
        joinedAt: Date.now(),
      }
    ],
    
    result: null,
  }
  
  // Game-specific setup
  if (gameType === 'mind-meld') {
    gameData.prompts = getRandomMindMeldPrompts(5)
    gameData.currentRound = 0
    gameData.rounds = []
    gameData.totalRounds = 5
  } else if (gameType === 'most-likely') {
    gameData.prompts = getRandomMostLikelyPrompts(10)
    gameData.currentRound = 0
    gameData.rounds = []
    gameData.totalRounds = 10
  } else if (gameType === 'bluff-battle') {
    gameData.prompts = getRandomBluffQuestions(8)
    gameData.currentRound = 0
    gameData.rounds = []
    gameData.totalRounds = 8
  } else if (gameType === 'prediction') {
    gameData.prompts = getRandomPredictionQuestions(10)
    gameData.currentRound = 0
    gameData.rounds = []
    gameData.totalRounds = 10
  } else if (gameType === 'caption-this') {
    gameData.scenes = getRandomScenes(6)
    gameData.currentRound = 0
    gameData.rounds = []
    gameData.totalRounds = 6
  }
  
  await setDoc(doc(db, 'games', gameId), gameData)
  return gameId
}

// Join a party game
export async function joinPartyGame(gameId) {
  const gameRef = doc(db, 'games', gameId)
  const gameSnap = await getDoc(gameRef)
  const game = gameSnap.data()
  
  if (!game) throw new Error('Game not found')
  if (game.status !== 'lobby') throw new Error('Game already started')
  
  const playerId = getOrCreatePlayerId()
  const existingPlayers = game.partyPlayers || []
  
  // Check if already joined
  if (existingPlayers.some(p => p.id === playerId)) {
    return { alreadyJoined: true, playerIndex: existingPlayers.findIndex(p => p.id === playerId) }
  }
  
  // Check if full
  if (existingPlayers.length >= (game.maxPlayers || 8)) {
    throw new Error('Game is full')
  }
  
  const playerIndex = existingPlayers.length
  const avatar = getPlayerAvatar(playerIndex)
  
  const newPlayer = {
    id: playerId,
    ...avatar,
    isHost: false,
    joinedAt: Date.now(),
  }
  
  await updateDoc(gameRef, {
    partyPlayers: arrayUnion(newPlayer),
    updatedAt: serverTimestamp(),
  })
  
  return { alreadyJoined: false, playerIndex }
}

// Start a party game (host only)
export async function startPartyGame(gameId) {
  const gameRef = doc(db, 'games', gameId)
  const playerId = getOrCreatePlayerId()
  const gameSnap = await getDoc(gameRef)
  const game = gameSnap.data()
  
  if (!game) throw new Error('Game not found')
  if (game.hostId !== playerId) throw new Error('Only the host can start')
  if ((game.partyPlayers?.length || 0) < (game.minPlayers || 2)) {
    throw new Error('Not enough players')
  }
  
  await updateDoc(gameRef, {
    status: 'active',
    updatedAt: serverTimestamp(),
  })
}

// Get player info in a party game
export function getPartyPlayer(game, playerId) {
  if (!game?.partyPlayers) return null
  const index = game.partyPlayers.findIndex(p => p.id === playerId)
  if (index === -1) return null
  return {
    ...game.partyPlayers[index],
    index,
  }
}

// Mind Meld: Submit an answer
export async function submitMindMeldAnswer(gameId, roundIndex, answer) {
  const gameRef = doc(db, 'games', gameId)
  const gameSnap = await getDoc(gameRef)
  const game = gameSnap.data()
  const playerId = getOrCreatePlayerId()
  
  if (!game) throw new Error('Game not found')
  
  const rounds = [...(game.rounds || [])]
  
  // Ensure rounds array is long enough
  while (rounds.length <= roundIndex) {
    rounds.push({ answers: {} })
  }
  
  // Add this player's answer
  rounds[roundIndex] = {
    ...rounds[roundIndex],
    answers: {
      ...(rounds[roundIndex].answers || {}),
      [playerId]: {
        answer: answer.trim(),
        submittedAt: Date.now(),
      }
    }
  }
  
  const updateData = {
    rounds,
    updatedAt: serverTimestamp(),
  }
  
  // Check if all players have answered
  const playerCount = game.partyPlayers?.length || 0
  const answerCount = Object.keys(rounds[roundIndex].answers).length
  
  if (answerCount >= playerCount) {
    rounds[roundIndex].complete = true
    rounds[roundIndex].completedAt = Date.now()
    updateData.rounds = rounds
  }
  
  await updateDoc(gameRef, updateData)
}

// Mind Meld: Advance to next round (called after reveal)
export async function advanceMindMeldRound(gameId, roundIndex) {
  const gameRef = doc(db, 'games', gameId)
  const gameSnap = await getDoc(gameRef)
  const game = gameSnap.data()
  
  if (!game) throw new Error('Game not found')
  
  const totalRounds = game.totalRounds || 5
  const nextRound = roundIndex + 1
  
  const updateData = {
    updatedAt: serverTimestamp(),
  }
  
  if (nextRound >= totalRounds) {
    updateData.status = 'finished'
  } else {
    updateData.currentRound = nextRound
  }
  
  await updateDoc(gameRef, updateData)
}

// Most Likely To: Submit a vote
export async function submitMostLikelyVote(gameId, roundIndex, votedForPlayerId) {
  const gameRef = doc(db, 'games', gameId)
  const gameSnap = await getDoc(gameRef)
  const game = gameSnap.data()
  const playerId = getOrCreatePlayerId()
  
  if (!game) throw new Error('Game not found')
  
  const rounds = [...(game.rounds || [])]
  
  // Ensure rounds array is long enough
  while (rounds.length <= roundIndex) {
    rounds.push({ votes: {} })
  }
  
  // Add this player's vote
  rounds[roundIndex] = {
    ...rounds[roundIndex],
    votes: {
      ...(rounds[roundIndex].votes || {}),
      [playerId]: {
        votedFor: votedForPlayerId,
        submittedAt: Date.now(),
      }
    }
  }
  
  const updateData = {
    rounds,
    updatedAt: serverTimestamp(),
  }
  
  // Check if all players have voted
  const playerCount = game.partyPlayers?.length || 0
  const voteCount = Object.keys(rounds[roundIndex].votes).length
  
  if (voteCount >= playerCount) {
    rounds[roundIndex].complete = true
    rounds[roundIndex].completedAt = Date.now()
    updateData.rounds = rounds
  }
  
  await updateDoc(gameRef, updateData)
}

// Most Likely To: Advance to next round with winner info
export async function advanceMostLikelyRound(gameId, roundIndex, roundWinner) {
  const gameRef = doc(db, 'games', gameId)
  const gameSnap = await getDoc(gameRef)
  const game = gameSnap.data()
  
  if (!game) throw new Error('Game not found')
  
  const rounds = [...(game.rounds || [])]
  
  // Store winner info in the round
  if (roundWinner && rounds[roundIndex]) {
    rounds[roundIndex].winnerIds = roundWinner.winners || []
    rounds[roundIndex].winnerPoints = 100 // Points per win
  }
  
  const totalRounds = game.totalRounds || 10
  const nextRound = roundIndex + 1
  
  const updateData = {
    rounds,
    updatedAt: serverTimestamp(),
  }
  
  if (nextRound >= totalRounds) {
    updateData.status = 'finished'
  } else {
    updateData.currentRound = nextRound
  }
  
  await updateDoc(gameRef, updateData)
}

// Bluff Battle: Submit a fake answer
export async function submitBluffAnswer(gameId, roundIndex, answer) {
  const gameRef = doc(db, 'games', gameId)
  const gameSnap = await getDoc(gameRef)
  const game = gameSnap.data()
  const playerId = getOrCreatePlayerId()
  
  if (!game) throw new Error('Game not found')
  
  const rounds = [...(game.rounds || [])]
  
  // Ensure rounds array is long enough
  while (rounds.length <= roundIndex) {
    rounds.push({ answers: {}, votes: {} })
  }
  
  // Add this player's fake answer
  rounds[roundIndex] = {
    ...rounds[roundIndex],
    answers: {
      ...(rounds[roundIndex].answers || {}),
      [playerId]: {
        answer: answer,
        submittedAt: Date.now(),
      }
    }
  }
  
  const updateData = {
    rounds,
    updatedAt: serverTimestamp(),
  }
  
  // Check if all players have submitted answers
  const playerCount = game.partyPlayers?.length || 0
  const answerCount = Object.keys(rounds[roundIndex].answers).length
  
  if (answerCount >= playerCount) {
    rounds[roundIndex].answersComplete = true
    updateData.rounds = rounds
  }
  
  await updateDoc(gameRef, updateData)
}

// Bluff Battle: Submit a vote for which answer is real
export async function submitBluffVote(gameId, roundIndex, votedForId) {
  const gameRef = doc(db, 'games', gameId)
  const gameSnap = await getDoc(gameRef)
  const game = gameSnap.data()
  const playerId = getOrCreatePlayerId()
  
  if (!game) throw new Error('Game not found')
  
  const rounds = [...(game.rounds || [])]
  
  // Add this player's vote
  rounds[roundIndex] = {
    ...rounds[roundIndex],
    votes: {
      ...(rounds[roundIndex].votes || {}),
      [playerId]: {
        votedFor: votedForId,
        submittedAt: Date.now(),
      }
    }
  }
  
  const updateData = {
    rounds,
    updatedAt: serverTimestamp(),
  }
  
  // Check if all players have voted
  const playerCount = game.partyPlayers?.length || 0
  const voteCount = Object.keys(rounds[roundIndex].votes).length
  
  if (voteCount >= playerCount) {
    rounds[roundIndex].complete = true
    rounds[roundIndex].completedAt = Date.now()
    
    // Calculate scores for this round
    const answers = rounds[roundIndex].answers || {}
    const votes = rounds[roundIndex].votes || {}
    const roundScores = {}
    const correctGuessers = []
    const fooledBy = {}
    
    game.partyPlayers.forEach(p => { roundScores[p.id] = 0 })
    
    Object.entries(votes).forEach(([voterId, voteData]) => {
      const votedFor = voteData.votedFor
      
      if (votedFor === 'real') {
        // Voter guessed correctly
        roundScores[voterId] = (roundScores[voterId] || 0) + 500
        correctGuessers.push(voterId)
      } else if (answers[votedFor] && votedFor !== voterId) {
        // Voter was fooled by another player's fake answer
        roundScores[votedFor] = (roundScores[votedFor] || 0) + 250
        fooledBy[votedFor] = (fooledBy[votedFor] || 0) + 1
      }
    })
    
    rounds[roundIndex].roundScores = roundScores
    rounds[roundIndex].correctGuessers = correctGuessers
    rounds[roundIndex].fooledBy = fooledBy
    updateData.rounds = rounds
  }
  
  await updateDoc(gameRef, updateData)
}

// Bluff Battle: Advance to next round
export async function advanceBluffRound(gameId, roundIndex) {
  const gameRef = doc(db, 'games', gameId)
  const gameSnap = await getDoc(gameRef)
  const game = gameSnap.data()
  
  if (!game) throw new Error('Game not found')
  
  const totalRounds = game.totalRounds || 8
  const nextRound = roundIndex + 1
  
  const updateData = {
    updatedAt: serverTimestamp(),
  }
  
  if (nextRound >= totalRounds) {
    updateData.status = 'finished'
  } else {
    updateData.currentRound = nextRound
  }
  
  await updateDoc(gameRef, updateData)
}

// ═══════════════════════════════════════════════════════════════
// PREDICTION GAME
// ═══════════════════════════════════════════════════════════════

// Prediction: Submit a prediction (non-hot-seat players)
export async function submitPrediction(gameId, roundIndex, prediction) {
  const gameRef = doc(db, 'games', gameId)
  const gameSnap = await getDoc(gameRef)
  const game = gameSnap.data()
  const playerId = getOrCreatePlayerId()
  
  if (!game) throw new Error('Game not found')
  
  const rounds = [...(game.rounds || [])]
  
  // Ensure rounds array is long enough
  while (rounds.length <= roundIndex) {
    rounds.push({ predictions: {} })
  }
  
  // Add this player's prediction
  rounds[roundIndex] = {
    ...rounds[roundIndex],
    predictions: {
      ...(rounds[roundIndex].predictions || {}),
      [playerId]: {
        prediction,
        submittedAt: Date.now(),
      }
    }
  }
  
  const updateData = {
    rounds,
    updatedAt: serverTimestamp(),
  }
  
  // Check if all non-hot-seat players have predicted
  const players = game.partyPlayers || []
  const predictorCount = players.length - 1 // Exclude hot seat
  const predictionCount = Object.keys(rounds[roundIndex].predictions).length
  
  if (predictionCount >= predictorCount) {
    rounds[roundIndex].predictionsComplete = true
    updateData.rounds = rounds
  }
  
  await updateDoc(gameRef, updateData)
}

// Prediction: Hot seat player submits their answer
export async function submitPredictionAnswer(gameId, roundIndex, answer) {
  const gameRef = doc(db, 'games', gameId)
  const gameSnap = await getDoc(gameRef)
  const game = gameSnap.data()
  const playerId = getOrCreatePlayerId()
  
  if (!game) throw new Error('Game not found')
  
  // Verify this player is in the hot seat
  const players = game.partyPlayers || []
  const hotSeatIndex = roundIndex % players.length
  const hotSeatPlayerId = players[hotSeatIndex]?.id
  
  if (playerId !== hotSeatPlayerId) {
    throw new Error('Only the hot seat player can answer')
  }
  
  const rounds = [...(game.rounds || [])]
  
  // Add the answer
  rounds[roundIndex] = {
    ...rounds[roundIndex],
    answer,
    answeredAt: Date.now(),
    complete: true,
    completedAt: Date.now(),
  }
  
  // Calculate scores for this round
  const predictions = rounds[roundIndex].predictions || {}
  const roundScores = {}
  const correctPredictors = []
  const wrongPredictors = []
  
  // Initialize all scores
  players.forEach(p => { roundScores[p.id] = 0 })
  
  // Score predictions
  Object.entries(predictions).forEach(([predictorId, data]) => {
    if (data.prediction === answer) {
      roundScores[predictorId] = 100 // Correct prediction
      correctPredictors.push(predictorId)
    } else {
      wrongPredictors.push(predictorId)
    }
  })
  
  // Hot seat gets 50 points per person fooled
  roundScores[hotSeatPlayerId] = wrongPredictors.length * 50
  
  // Perfect prediction bonus
  const predictorCount = players.length - 1
  if (correctPredictors.length === predictorCount && predictorCount > 1) {
    correctPredictors.forEach(pId => {
      roundScores[pId] += 50 // Bonus for unanimous prediction
    })
    rounds[roundIndex].perfectPrediction = true
  }
  
  rounds[roundIndex].roundScores = roundScores
  rounds[roundIndex].correctPredictors = correctPredictors
  rounds[roundIndex].wrongPredictors = wrongPredictors
  
  await updateDoc(gameRef, {
    rounds,
    updatedAt: serverTimestamp(),
  })
}

// Prediction: Advance to next round
export async function advancePredictionRound(gameId, roundIndex) {
  const gameRef = doc(db, 'games', gameId)
  const gameSnap = await getDoc(gameRef)
  const game = gameSnap.data()
  
  if (!game) throw new Error('Game not found')
  
  const totalRounds = game.totalRounds || 10
  const nextRound = roundIndex + 1
  
  const updateData = {
    updatedAt: serverTimestamp(),
  }
  
  if (nextRound >= totalRounds) {
    updateData.status = 'finished'
  } else {
    updateData.currentRound = nextRound
  }
  
  await updateDoc(gameRef, updateData)
}

// ═══════════════════════════════════════════════════════════════
// CAPTION THIS PARTY GAME
// ═══════════════════════════════════════════════════════════════

// Caption This: Submit a caption for the current scene
export async function submitCaptionParty(gameId, roundIndex, caption) {
  const gameRef = doc(db, 'games', gameId)
  const gameSnap = await getDoc(gameRef)
  const game = gameSnap.data()
  const playerId = getOrCreatePlayerId()
  
  if (!game) throw new Error('Game not found')
  
  const rounds = [...(game.rounds || [])]
  
  // Ensure rounds array is long enough
  while (rounds.length <= roundIndex) {
    rounds.push({ captions: {}, votes: {} })
  }
  
  // Add this player's caption
  rounds[roundIndex] = {
    ...rounds[roundIndex],
    captions: {
      ...(rounds[roundIndex].captions || {}),
      [playerId]: {
        caption: caption.trim(),
        submittedAt: Date.now(),
      }
    }
  }
  
  const updateData = {
    rounds,
    updatedAt: serverTimestamp(),
  }
  
  // Check if all players have submitted captions
  const playerCount = game.partyPlayers?.length || 0
  const captionCount = Object.keys(rounds[roundIndex].captions).length
  
  if (captionCount >= playerCount) {
    rounds[roundIndex].captionsComplete = true
    updateData.rounds = rounds
  }
  
  await updateDoc(gameRef, updateData)
}

// Caption This: Submit a vote for favorite caption
export async function submitCaptionVoteParty(gameId, roundIndex, votedForPlayerId) {
  const gameRef = doc(db, 'games', gameId)
  const gameSnap = await getDoc(gameRef)
  const game = gameSnap.data()
  const playerId = getOrCreatePlayerId()
  
  if (!game) throw new Error('Game not found')
  
  // Can't vote for yourself
  if (votedForPlayerId === playerId) {
    throw new Error("Can't vote for your own caption")
  }
  
  const rounds = [...(game.rounds || [])]
  
  // Add this player's vote
  rounds[roundIndex] = {
    ...rounds[roundIndex],
    votes: {
      ...(rounds[roundIndex].votes || {}),
      [playerId]: {
        votedFor: votedForPlayerId,
        submittedAt: Date.now(),
      }
    }
  }
  
  const updateData = {
    rounds,
    updatedAt: serverTimestamp(),
  }
  
  // Check if all players have voted
  const playerCount = game.partyPlayers?.length || 0
  const voteCount = Object.keys(rounds[roundIndex].votes).length
  
  if (voteCount >= playerCount) {
    rounds[roundIndex].votesComplete = true
    rounds[roundIndex].completedAt = Date.now()
    
    // Calculate scores for this round
    const votes = rounds[roundIndex].votes || {}
    const roundScores = {}
    const votesCounts = {}
    
    // Initialize scores and vote counts
    game.partyPlayers.forEach(p => {
      roundScores[p.id] = 0
      votesCounts[p.id] = 0
    })
    
    // Count votes and score
    Object.entries(votes).forEach(([voterId, voteData]) => {
      const votedFor = voteData.votedFor
      if (votedFor && votedFor !== voterId) {
        votesCounts[votedFor] = (votesCounts[votedFor] || 0) + 1
        roundScores[votedFor] = (roundScores[votedFor] || 0) + 100 // +100 per vote
      }
    })
    
    // Find winner(s) and give bonus
    const maxVotes = Math.max(...Object.values(votesCounts))
    const roundWinners = []
    if (maxVotes > 0) {
      Object.entries(votesCounts).forEach(([pId, count]) => {
        if (count === maxVotes) {
          roundWinners.push(pId)
        }
      })
      
      // Bonus for winning (+200, split if tied)
      const bonusPerWinner = Math.floor(200 / roundWinners.length)
      roundWinners.forEach(winnerId => {
        roundScores[winnerId] += bonusPerWinner
      })
    }
    
    rounds[roundIndex].roundScores = roundScores
    rounds[roundIndex].voteCounts = votesCounts
    rounds[roundIndex].roundWinners = roundWinners
    rounds[roundIndex].complete = true
    updateData.rounds = rounds
  }
  
  await updateDoc(gameRef, updateData)
}

// Caption This: Advance to next round
export async function advanceCaptionRound(gameId, roundIndex) {
  const gameRef = doc(db, 'games', gameId)
  const gameSnap = await getDoc(gameRef)
  const game = gameSnap.data()
  
  if (!game) throw new Error('Game not found')
  
  const totalRounds = game.totalRounds || 6
  const nextRound = roundIndex + 1
  
  const updateData = {
    updatedAt: serverTimestamp(),
  }
  
  if (nextRound >= totalRounds) {
    updateData.status = 'finished'
  } else {
    updateData.currentRound = nextRound
  }
  
  await updateDoc(gameRef, updateData)
}
