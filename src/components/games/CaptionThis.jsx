import { useState, useEffect, useMemo } from 'react'
import { submitCaption, submitCaptionVote } from '../../services/gameService'
import { getScene } from '../../utils/captionScenes'

export default function CaptionThis({ game, gameId, player }) {
  const [caption, setCaption] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showResults, setShowResults] = useState(false)
  
  const currentRound = game.currentRound || 0
  const scenes = useMemo(() => game.scenes || [], [game.scenes])
  const currentScene = getScene(scenes, currentRound)
  const rounds = useMemo(() => game.rounds || [], [game.rounds])
  const currentRoundData = rounds[currentRound] || {}
  
  const opponentRole = player?.role === 'player1' ? 'player2' : 'player1'
  const opponent = player?.role === 'player1' ? game.players?.player2 : game.players?.player1
  
  const myCaption = currentRoundData?.[`caption_${player?.role}`]
  const opponentCaption = currentRoundData?.[`caption_${opponentRole}`]
  const bothCaptioned = myCaption && opponentCaption
  
  const myVote = currentRoundData?.[`vote_${player?.role}`]
  const opponentVote = currentRoundData?.[`vote_${opponentRole}`]
  const bothVoted = myVote && opponentVote
  
  // Calculate scores
  const scores = useMemo(() => {
    let player1 = 0
    let player2 = 0
    
    rounds.forEach(round => {
      if (round?.vote_player1 && round?.vote_player2) {
        // Each vote for a player = 1 point
        if (round.vote_player1 === 'player1') player1++
        if (round.vote_player1 === 'player2') player2++
        if (round.vote_player2 === 'player1') player1++
        if (round.vote_player2 === 'player2') player2++
      }
    })
    
    return { player1, player2 }
  }, [rounds])
  
  const myScore = scores[player?.role] || 0
  const opponentScore = scores[opponentRole] || 0

  // Show results when both have voted
  useEffect(() => {
    if (bothVoted && !showResults) {
      setShowResults(true)
      // Auto-advance after 3 seconds
      const timer = setTimeout(() => {
        setShowResults(false)
        setCaption('')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [bothVoted, showResults])

  const handleSubmitCaption = async (e) => {
    e.preventDefault()
    if (!caption.trim() || isSubmitting || myCaption) return
    
    setIsSubmitting(true)
    try {
      await submitCaption(gameId, currentRound, player.role, caption.trim())
      setCaption('')
    } catch (err) {
      console.error('Failed to submit caption:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVote = async (votedFor) => {
    if (isSubmitting || myVote) return
    
    setIsSubmitting(true)
    try {
      await submitCaptionVote(gameId, currentRound, player.role, votedFor)
    } catch (err) {
      console.error('Failed to submit vote:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Game finished
  if (game.status === 'finished' || currentRound >= scenes.length) {
    const winner = myScore > opponentScore ? 'you' : myScore < opponentScore ? 'them' : 'tie'
    
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="card max-w-md w-full text-center animate-slide-up">
          <div className="text-6xl mb-4">
            {winner === 'you' ? '🏆' : winner === 'them' ? '😅' : '🤝'}
          </div>
          
          <h2 className="text-2xl font-bold mb-2">
            {winner === 'you' ? 'You Win!' : winner === 'them' ? 'They Win!' : 'It\'s a Tie!'}
          </h2>
          
          <div className="flex justify-center gap-8 my-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-[var(--accent)]">{myScore}</p>
              <p className="text-sm text-[var(--text-muted)]">You</p>
            </div>
            <div className="text-2xl text-[var(--text-muted)]">vs</div>
            <div className="text-center">
              <p className="text-3xl font-bold text-[var(--warning)]">{opponentScore}</p>
              <p className="text-sm text-[var(--text-muted)]">{opponent?.name || 'Friend'}</p>
            </div>
          </div>
          
          <a href="/" className="btn btn-primary w-full">
            Play Again
          </a>
          
          <a href="/" className="block mt-4 text-sm text-[var(--text-muted)] hover:text-white">
            ← Home
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col p-4 max-w-lg mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📸</span>
          <span className="font-semibold">Caption This</span>
        </div>
        <div className="text-sm">
          Round {currentRound + 1} / {scenes.length}
        </div>
      </header>
      
      {/* Score bar */}
      <div className="flex items-center justify-center gap-4 py-2">
        <span className="text-[var(--accent)]">{myScore}</span>
        <span className="text-[var(--text-muted)]">-</span>
        <span className="text-[var(--warning)]">{opponentScore}</span>
      </div>

      {/* Game area */}
      <div className="flex-1 py-4">
        {showResults && bothVoted ? (
          // Results reveal
          <div className="card text-center animate-slide-up">
            <div className="text-5xl mb-4">
              {myVote === opponentVote ? '🤝' : '⚔️'}
            </div>
            <h3 className="text-lg font-bold mb-4">
              {myVote === player?.role && opponentVote === player?.role 
                ? 'They voted for you!' 
                : myVote === opponentRole && opponentVote === opponentRole
                ? 'You both voted for them!'
                : myVote === opponentRole && opponentVote === player?.role
                ? 'You appreciated each other!'
                : 'Split decision!'}
            </h3>
            <p className="text-sm text-[var(--text-muted)]">
              Next scene coming...
            </p>
          </div>
        ) : bothCaptioned && !myVote ? (
          // Voting phase
          <div className="space-y-4">
            {/* Scene reminder */}
            <div className="text-center mb-4">
              <span className="text-4xl">{currentScene?.emoji}</span>
            </div>
            
            <h3 className="text-center font-semibold mb-4">Vote for the best caption!</h3>
            
            {/* Captions to vote on */}
            <button
              onClick={() => handleVote(player?.role)}
              disabled={isSubmitting}
              className="card w-full text-left hover:bg-white/10 transition-all p-4"
            >
              <p className="text-xs text-[var(--accent)] mb-1">Your caption</p>
              <p className="text-lg">"{myCaption}"</p>
            </button>
            
            <button
              onClick={() => handleVote(opponentRole)}
              disabled={isSubmitting}
              className="card w-full text-left hover:bg-white/10 transition-all p-4"
            >
              <p className="text-xs text-[var(--warning)] mb-1">{opponent?.name || 'Their'} caption</p>
              <p className="text-lg">"{opponentCaption}"</p>
            </button>
            
            <p className="text-center text-sm text-[var(--text-muted)]">
              Tap the better caption
            </p>
          </div>
        ) : bothCaptioned && myVote && !opponentVote ? (
          // Waiting for opponent to vote
          <div className="card text-center">
            <div className="text-4xl mb-4">{currentScene?.emoji}</div>
            <p className="text-[var(--text-muted)]">
              You voted! Waiting for {opponent?.name || 'friend'}...
            </p>
          </div>
        ) : (
          // Captioning phase
          <div className="space-y-4">
            {/* Scene card */}
            <div className="card text-center">
              <div className="text-5xl mb-4 tracking-widest">
                {currentScene?.emoji}
              </div>
              <p className="text-[var(--text-muted)] text-sm mb-2">
                {currentScene?.description}
              </p>
              <p className="text-xs text-[var(--text-muted)] italic">
                Hint: {currentScene?.hint}
              </p>
            </div>
            
            {myCaption ? (
              // Waiting for opponent's caption
              <div className="card text-center">
                <p className="text-[var(--text-muted)] mb-2">Your caption:</p>
                <p className="text-lg font-semibold text-[var(--accent)]">"{myCaption}"</p>
                <p className="text-sm text-[var(--text-muted)] mt-4 animate-pulse">
                  Waiting for {opponent?.name || 'friend'}...
                </p>
              </div>
            ) : (
              // Caption input
              <form onSubmit={handleSubmitCaption} className="space-y-3">
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Write a funny caption..."
                  className="input text-center"
                  maxLength={100}
                  autoComplete="off"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!caption.trim() || isSubmitting}
                  className="btn btn-primary w-full"
                >
                  {isSubmitting ? 'Sending...' : 'Lock In Caption 🔒'}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
      
      {/* vs indicator */}
      <div className="text-center py-4 text-sm text-[var(--text-muted)]">
        vs {opponent?.isAI ? '👻 Ghost' : opponent?.name || 'Opponent'}
      </div>
    </div>
  )
}
