export default function ShareLink({ url, onCopy, onShare, copied }) {
  const canShare = typeof navigator !== 'undefined' && navigator.share

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={url}
          readOnly
          className="input text-sm font-mono"
          onClick={(e) => e.target.select()}
        />
        <button
          onClick={onCopy}
          className="btn btn-secondary whitespace-nowrap"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>

      {canShare && (
        <button
          onClick={onShare}
          className="btn btn-primary w-full"
        >
          Share Link
        </button>
      )}
    </div>
  )
}
