// Web Audio API synthesized chime for QR scan confirmations
// Pure zero-dependency client-side audio synthesizer

let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (AudioContextClass) {
      audioCtx = new AudioContextClass()
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {})
  }
  return audioCtx
}

/**
 * Plays a subtle, pleasant two-tone confirmation chime (D5 -> A5)
 * Duration: ~220ms, gentle volume envelope to avoid harsh clicks
 */
export function playSuccessChime(): void {
  try {
    const ctx = getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime

    // Tone 1: D5 (587.33 Hz)
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.type = 'sine'
    osc1.frequency.setValueAtTime(587.33, now)

    gain1.gain.setValueAtTime(0.001, now)
    gain1.gain.exponentialRampToValueAtTime(0.12, now + 0.02)
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.09)

    osc1.connect(gain1)
    gain1.connect(ctx.destination)

    osc1.start(now)
    osc1.stop(now + 0.1)

    // Tone 2: A5 (880.00 Hz)
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(880.0, now + 0.07)

    gain2.gain.setValueAtTime(0.001, now + 0.07)
    gain2.gain.exponentialRampToValueAtTime(0.14, now + 0.09)
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.22)

    osc2.connect(gain2)
    gain2.connect(ctx.destination)

    osc2.start(now + 0.07)
    osc2.stop(now + 0.23)
  } catch {
    // Graceful fallback if audio is not permitted by browser autoplay policy
  }
}
