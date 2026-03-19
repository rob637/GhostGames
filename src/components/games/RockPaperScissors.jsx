import { useState, useEffect } from 'react'
import { submitRPSChoice } from '../../services/gameService'
import QuitButton from '../QuitButton'
import PlayAgainButton from '../PlayAgainButton'

const CHOICES = [
  { id: 'rock', emoji: '✊', name: 'Rock', beats: 'scissors' },
  { id: 'paper', emoji: '✋', name: 'Paper', beats: 'rock' },
  { id: 'scissors', emoji: '✌️', name: 'Scissors', beats: 'paper' },
]

export default function RockPaperScissors({ game, gameId, player }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedChoice, setSelectedChoice] = useState(null)
  
  const currentRound = game.currentRound || 0
  const rounds = useMemo(() => game.rounds || [], [game.rounds])
  const scores = game.scores || { player1: 0, player2: 0 }
  const bestOf = game.bestOf || 5
  const winTarget = Math.ceil(bestOf / 2)
  
  const currentRoundData = rounds[currentRound] || {}
  const myChoice = currentRoundData[player?.role]?.choice
  const opponentRole = player?.role === 'player1' ? 'player2' : 'player1'
  const opponentChoice = currentRoundData[opponentRole]?.choice
  const roundWinner = currentRoundData.winner
  
  // Both have chosen - show result
  const showResult = myChoice && opponentChoice && roundWinner
  
  const handleChoice = async (choice) => {
    if (isSubmitting || myChoice) return
    
    setSelectedChoice(choice)
    setIsSubmitting(true)
    
    try {
      await submitRPSChoice(gameId, currentRound, player.role, choice)
    } catch (error) {
      console.error('Failed to submit choice:', error)
      setSelectedChoice(null)
    }
    
    setIsSubmitting(false)
  }
  
  // Reset selected choice when round changes
  useEffect(() => {
    setSelectedChoice(null)
  }, [currentRound])
  
  // Game finished
  if (game.status === 'finished') {
    const iWon = game.winner === player?.role
    const myScore = scores[player?.role] || 0
    const theirScore = scores[opponentRole] || 0
    
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="card max-w-md w-full text-center animate-slide-up">
          <div className="text-6xl mb-4">
            {iWon ? '🏆' : '😅'}
          </div>
          
          <h2 className="text-2xl font-bold mb-2">
            {iWon ? 'You Win!' : 'You Lost!'}
          </h2>
          
          <div className="flex justify-center gap-8 my-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-[var(--success)]">{myScore}</p>
              <p className="text-sm text-[var(--text-muted)]">You</p>
            </div>
            <div className="text-2xl self-center text-[var(--text-muted)]">-</div>
            <div className="text-center">
              <p className="text-4xl font-bold text-[var(--danger)]">{theirScore}</p>
              <p className="text-sm text-[var(--text-muted)]">Opponent</p>
            </div>
          </div>
          
          {/* Round history */}
          <div className="flex justify-center gap-2 mb-6 flex-wrap">
            {rounds.map((round, i) => {
              const myC = round[player?.role]?.choice
              const theirC = round[opponentRole]?.choice
              const myEmoji = CHOICES.find(c => c.id === myC)?.emoji
              const theirEmoji = CHOICES.find(c => c.id === theirC)?.emoji
              const won = round.winner === player?.role
              const tie = round.winner === 'tie'
              
              return (
                <div key={i} className={`p-2 rounded-lg text-center ${won ? 'bg-[var(--success)]/20' : tie ? 'bg-white/10' : 'bg-[var(--danger)]/20'}`}>
                  <div className="text-lg">{myEmoji} vs {theirEmoji}</div>
                  <div className="text-xs">{won ? '✓' : tie ? '=' : '✗'}</div>
                </div>
              )
            })}
          </div>
          
          <PlayAgainButton game={game} gameId={gameId} />
          
          <a href="/" className="block mt-4 text-sm text-[var(--text-muted)] hover:text-white">
            ← Home
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col p-4 max-w-lg mx-auto">
      <QuitButton />
      {/* Header */}
      <header className="flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">✊</span>
          <span className="font-semibold">Rock Paper Scissors</span>
        </div>
        <div className="text-sm">
          Best of {bestOf}
        </div>
      </header>
      
      {/* Score */}
      <div className="flex items-center justify-center gap-6 py-4 bg-white/5 rounded-xl mb-6">
        <div className="text-center">
          <p className={`text-3xl font-bold ${scores.player1 >= scores.player2 ? 'text-[var(--success)]' : ''}`}>
            {player?.role === 'player1' ? scores.player1 : scores.player2}
          </p>
          <p className="text-xs text-[var(--text-muted)]">You</p>
        </div>
        <div className="text-2xl text-[var(--text-muted)]">-</div>
        <div className="text-center">
          <p className={`text-3xl font-bold ${scores.player2 > scores.player1 ? 'text-[var(--danger)]' : ''}`}>
            {player?.role === 'player1' ? scores.player2 : scores.player1}
          </p>
          <p className="text-xs text-[var(--text-muted)]">Opponent</p>
        </div>
      </div>
      
      {/* Round indicator */}
      <div className="text-center mb-4">
        <p className="text-sm text-[var(--text-muted)]">Round {currentRound + 1}</p>
        <p className="text-xs text-[var(--text-muted)]">First to {winTarget} wins</p>
      </div>

      {/* Game area */}
      <div className="flex-1 flex flex-col items-center justify-center py-4">
        {showResult ? (
          // Show round result
          <div className="text-center animate-slide-up">
            <div className="flex items-center justify-center gap-8 mb-6">
              <div className="text-center">
                <div className="text-6xl mb-2">
                  {CHOICES.find(c => c.id === myChoice)?.emoji}
                </div>
                <p className="text-sm text-[var(--text-muted)]">You</p>
              </div>
              <div className="text-2xl text-[var(--text-muted)]">vs</div>
              <div className="text-center">
                <div className="text-6xl mb-2">
                  {CHOICES.find(c => c.id === opponentChoice)?.emoji}
                </div>
                <p className="text-sm text-[var(--text-muted)]">Them</p>
              </div>
            </div>
            
            <div className={`text-2xl font-bold ${
              roundWinner === player?.role ? 'text-[var(--success)]' : 
              roundWinner === 'tie' ? 'text-[var(--warning)]' : 'text-[var(--danger)]'
            }`}>
              {roundWinner === player?.role ? '🎉 You win this round!' : 
               roundWinner === 'tie' ? '🤝 It\'s a tie!' : '😤 They win this round!'}
            </div>
            
            <p className="text-sm text-[var(--text-muted)] mt-4">
              Next round starting...
            </p>
          </div>
        ) : myChoice ? (
          // Waiting for opponent
          <div className="text-center">
            <div className="text-6xl mb-4 animate-bounce">
              {CHOICES.find(c => c.id === myChoice)?.emoji}
            </div>
            <p className="text-lg font-semibold mb-2">
              You chose {CHOICES.find(c => c.id === myChoice)?.name}!
            </p>
            <p className="text-[var(--text-muted)]">
              Waiting for opponent...
            </p>
            <div className="mt-4 flex justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse"></div>
              <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" style={{animationDelay: '0.2s'}}></div>
              <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" style={{animationDelay: '0.4s'}}></div>
            </div>
          </div>
        ) : (
          // Choose
          <div className="w-full">
            <p className="text-center text-lg mb-6">Make your choice!</p>
            
            <div className="grid grid-cols-3 gap-4">
              {CHOICES.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  disabled={isSubmitting}
                  className={`
                    aspect-square rounded-2xl flex flex-col items-center justify-center gap-2
                    transition-all duration-200 
                    ${selectedChoice === choice.id 
                      ? 'bg-[var(--accent)] scale-95' 
                      : 'bg-white/10 hover:bg-white/20 hover:scale-105 active:scale-95'
                    }
                    ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  <span className="text-5xl">{choice.emoji}</span>
                  <span className="text-sm font-medium">{choice.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Round history dots */}
      {rounds.length > 0 && (
        <div className="flex justify-center gap-2 py-4">
          {rounds.map((round, i) => {
            const won = round.winner === player?.role
            const tie = round.winner === 'tie'
            return (
              <div 
                key={i} 
                className={`w-3 h-3 rounded-full ${
                  won ? 'bg-[var(--success)]' : 
                  tie ? 'bg-[var(--warning)]' : 'bg-[var(--danger)]'
                }`}
              />
            )
          })}
        </div>
      )}
      
      {/* Footer */}
      <div className="py-2 text-center text-xs text-[var(--text-muted)]">
        {myChoice && !showResult ? 'Locked in!' : 'Pick wisely...'}
      </div>
    </div>
  )
}
