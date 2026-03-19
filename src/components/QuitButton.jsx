import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function QuitButton() {
  const [showConfirm, setShowConfirm] = useState(false)

  if (showConfirm) {
    return (
      <div className="fixed top-4 left-4 z-50 bg-gray-800 rounded-lg p-4 shadow-lg border border-gray-700">
        <p className="text-sm mb-3">Leave game?</p>
        <div className="flex gap-2">
          <Link
            to="/"
            className="px-3 py-1 bg-red-600 hover:bg-red-500 rounded text-sm"
          >
            Leave
          </Link>
          <button
            onClick={() => setShowConfirm(false)}
            className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm"
          >
            Stay
          </button>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="fixed top-4 left-4 z-50 text-gray-400 hover:text-white text-sm flex items-center gap-1 bg-gray-800/80 px-3 py-1.5 rounded-lg hover:bg-gray-700/80 transition-colors"
    >
      ✕ Quit
    </button>
  )
}
