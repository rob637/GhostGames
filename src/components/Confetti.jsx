// Shared Confetti celebration component
// Pre-generate confetti data outside component for React compiler purity
const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  animationDelay: `${Math.random() * 0.5}s`,
  backgroundColor: ['#ff6b6b', '#4ecdc4', '#ffe66d', '#95e1d3', '#f38181', '#aa96da', '#fcbad3'][i % 7],
}))

export default function Confetti({ show }) {
  if (!show) return null
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confettiPieces.map(piece => (
        <div
          key={piece.id}
          className="absolute w-3 h-3 animate-confetti"
          style={{
            left: piece.left,
            top: '-20px',
            animationDelay: piece.animationDelay,
            backgroundColor: piece.backgroundColor,
          }}
        />
      ))}
    </div>
  )
}
