import { useParams, useNavigate } from 'react-router-dom'
import GhostSays from '../components/games/GhostSays'
import SpeedTap from '../components/games/SpeedTap'

export default function SoloGame() {
  const { gameType } = useParams()
  const navigate = useNavigate()

  const handleBack = () => {
    navigate('/')
  }

  // Route to the correct solo game
  switch (gameType) {
    case 'ghost-says':
      return <GhostSays onBack={handleBack} />
    
    case 'speed-tap':
      return <SpeedTap onBack={handleBack} />
    
    default:
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="card text-center max-w-md">
            <div className="text-4xl mb-4">🎮</div>
            <h2 className="text-xl font-semibold mb-2">Game Coming Soon</h2>
            <p className="text-[var(--text-muted)] mb-6">
              This game is still being built. Check back soon!
            </p>
            <button onClick={handleBack} className="btn btn-primary">
              ← Back to Home
            </button>
          </div>
        </div>
      )
  }
}
