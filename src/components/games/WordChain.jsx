export default function WordChain({ words, currentPlayerId }) {
  if (words.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-[var(--text-muted)]">
        <p>Start the chain with any word!</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {words.map((word, index) => {
        const isMe = word.playerId === currentPlayerId
        return (
          <div
            key={index}
            className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-slide-up`}
          >
            <div
              className={`px-4 py-2 rounded-2xl max-w-[80%] ${
                isMe
                  ? 'bg-[var(--accent)] text-white rounded-br-md'
                  : 'bg-[var(--bg-tertiary)] rounded-bl-md'
              }`}
            >
              <span className="font-medium">{word.word}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
