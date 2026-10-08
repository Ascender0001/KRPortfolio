// "Bankai" easter egg (Bleach / Ichigo homage).
//
// Type "bankai" anywhere (or tap the KR logo five times quickly) to transform the site:
// the transformation plays (BankaiOverlay), the particle field forms a sword and turns
// black-and-red, the cursor aura intensifies and the logo keeps its hollow mask.
// Typing it again releases it. State lives on html[data-bankai] for CSS, plus a tiny
// subscription API for the canvas/WebGL parts.

type Listener = (active: boolean) => void

const WORD = 'bankai'
const listeners = new Set<Listener>()
let active = false
let typed = ''

export const isBankai = () => active

export function onBankai(listener: Listener) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function toggleBankai() {
  active = !active
  if (active) document.documentElement.dataset.bankai = 'on'
  else delete document.documentElement.dataset.bankai
  listeners.forEach((listener) => listener(active))
}

window.addEventListener('keydown', (event) => {
  const target = event.target
  if (target instanceof Element && target.closest('input, textarea, [contenteditable="true"]')) return
  if (event.key.length !== 1 || event.ctrlKey || event.metaKey || event.altKey) return
  typed = (typed + event.key.toLowerCase()).slice(-WORD.length)
  if (typed === WORD) {
    typed = ''
    toggleBankai()
  }
})

// Five quick taps on an element (the logo) also trigger it — phones have no keyboard.
export function tapTrigger() {
  let taps: number[] = []
  return () => {
    const now = performance.now()
    taps = [...taps.filter((t) => now - t < 2000), now]
    if (taps.length >= 5) {
      taps = []
      toggleBankai()
    }
  }
}

console.info('%cPsst… próbáld beírni: bankai', 'color:#ff2a1f;font-weight:700;font-size:13px')
