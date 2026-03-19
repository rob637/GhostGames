// Simple notification sounds using Web Audio API
// No external files needed

let audioContext = null

function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
  }
  return audioContext
}

// Play a pleasant "ding" sound
export function playJoinSound() {
  try {
    const ctx = getAudioContext()
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.frequency.setValueAtTime(880, ctx.currentTime) // A5
    oscillator.frequency.setValueAtTime(1108.73, ctx.currentTime + 0.1) // C#6
    
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.3)

    // Also vibrate on mobile
    if (navigator.vibrate) {
      navigator.vibrate(100)
    }
  } catch (e) {
    console.log('Sound not available:', e)
  }
}

// Play a subtle "pop" for new word
export function playWordSound() {
  try {
    const ctx = getAudioContext()
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.frequency.setValueAtTime(600, ctx.currentTime)
    gainNode.gain.setValueAtTime(0.2, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.1)
  } catch (e) {
    console.log('Sound not available:', e)
  }
}

// Play "your turn" alert
export function playTurnSound() {
  try {
    const ctx = getAudioContext()
    
    // Two-tone alert
    const osc1 = ctx.createOscillator()
    const osc2 = ctx.createOscillator()
    const gainNode = ctx.createGain()

    osc1.connect(gainNode)
    osc2.connect(gainNode)
    gainNode.connect(ctx.destination)

    osc1.frequency.setValueAtTime(523.25, ctx.currentTime) // C5
    osc2.frequency.setValueAtTime(659.25, ctx.currentTime + 0.15) // E5

    gainNode.gain.setValueAtTime(0.25, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)

    osc1.start(ctx.currentTime)
    osc1.stop(ctx.currentTime + 0.15)
    osc2.start(ctx.currentTime + 0.15)
    osc2.stop(ctx.currentTime + 0.3)

    if (navigator.vibrate) {
      navigator.vibrate([50, 50, 50])
    }
  } catch (e) {
    console.log('Sound not available:', e)
  }
}

// Request notification permission (for future push notifications)
export async function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }
  return Notification.permission === 'granted'
}

// Show browser notification
export function showNotification(title, body) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: '/favicon.svg',
      badge: '/favicon.svg',
    })
  }
}
