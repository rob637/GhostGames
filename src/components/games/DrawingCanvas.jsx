import { useRef, useEffect, useState, useCallback } from 'react'

export default function DrawingCanvas({ onDrawingChange, onStrokeEnd, drawing, disabled, showDrawing }) {
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [paths, setPaths] = useState([])
  const [currentPath, setCurrentPath] = useState([])

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    // Set canvas size
    const container = canvas.parentElement
    const size = Math.min(container.clientWidth, 300)
    canvas.width = size
    canvas.height = size
    
    // Clear and set style
    ctx.fillStyle = '#1a1a2e'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.strokeStyle = 'white'
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
  }, [])

  // Redraw when paths change or loading drawing
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    // Clear
    ctx.fillStyle = '#1a1a2e'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Draw all paths
    ctx.strokeStyle = 'white'
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    
    const pathsToDraw = showDrawing && drawing ? drawing : paths
    
    pathsToDraw.forEach(path => {
      if (path.length < 2) return
      ctx.beginPath()
      ctx.moveTo(path[0].x * canvas.width, path[0].y * canvas.height)
      for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i].x * canvas.width, path[i].y * canvas.height)
      }
      ctx.stroke()
    })
    
    // Draw current path
    if (currentPath.length > 1) {
      ctx.beginPath()
      ctx.moveTo(currentPath[0].x * canvas.width, currentPath[0].y * canvas.height)
      for (let i = 1; i < currentPath.length; i++) {
        ctx.lineTo(currentPath[i].x * canvas.width, currentPath[i].y * canvas.height)
      }
      ctx.stroke()
    }
  }, [paths, currentPath, drawing, showDrawing])

  const getCoords = useCallback((e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    
    let clientX, clientY
    if (e.touches) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }
    
    return {
      x: (clientX - rect.left) / rect.width,
      y: (clientY - rect.top) / rect.height
    }
  }, [])

  const handleStart = useCallback((e) => {
    if (disabled || showDrawing) return
    e.preventDefault()
    setIsDrawing(true)
    const coords = getCoords(e)
    setCurrentPath([coords])
  }, [disabled, showDrawing, getCoords])

  const handleMove = useCallback((e) => {
    if (!isDrawing || disabled || showDrawing) return
    e.preventDefault()
    const coords = getCoords(e)
    setCurrentPath(prev => {
      const newPath = [...prev, coords]
      // Stream updates while drawing (include current path with completed paths)
      if (onDrawingChange) {
        onDrawingChange([...paths, newPath])
      }
      return newPath
    })
  }, [isDrawing, disabled, showDrawing, getCoords, paths, onDrawingChange])

  const handleEnd = useCallback(() => {
    if (!isDrawing) return
    setIsDrawing(false)
    if (currentPath.length > 1) {
      const newPaths = [...paths, currentPath]
      setPaths(newPaths)
      // Final sync when stroke completes
      if (onStrokeEnd) {
        onStrokeEnd(newPaths)
      }
    }
    setCurrentPath([])
  }, [isDrawing, currentPath, paths, onStrokeEnd])

  const handleClear = () => {
    setPaths([])
    setCurrentPath([])
    if (onDrawingChange) {
      onDrawingChange([])
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-full max-w-[300px]">
        <canvas
          ref={canvasRef}
          className="rounded-xl border-2 border-white/20 touch-none cursor-crosshair"
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        />
        {disabled && !showDrawing && (
          <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
            <span className="text-[var(--text-muted)]">Waiting...</span>
          </div>
        )}
      </div>
      
      {!disabled && !showDrawing && (
        <button
          onClick={handleClear}
          className="btn btn-secondary text-sm py-2"
        >
          🗑️ Clear
        </button>
      )}
    </div>
  )
}
