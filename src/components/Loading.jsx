export default function Loading({ message = 'Loading...' }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="text-6xl mb-6 animate-pulse-glow">👻</div>
      <p className="text-[var(--text-muted)]">{message}</p>
    </div>
  )
}
