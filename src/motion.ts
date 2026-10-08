// Motion level for the whole site.
//
// 'full'    — the complete choreography (cascades, parallax, tilt, ticker).
// 'reduced' — short opacity fades only, no large movement. Used when the OS asks for
//             reduced motion, so the page still feels alive without anything that can
//             trigger motion sickness.
//
// Visitors can override the OS setting with the small switch in the footer; the choice is
// stored under STORAGE_KEY. index.html applies the same logic inline before first paint, so
// html[data-motion] is already set when CSS and these helpers run.

export type MotionPreference = 'auto' | 'full' | 'reduced'
export type MotionLevel = 'full' | 'reduced'

const STORAGE_KEY = 'kr-motion'

export function getMotionPreference(): MotionPreference {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'full' || stored === 'reduced') return stored
  } catch {
    // Storage blocked (private mode etc.) — fall back to the OS setting.
  }
  return 'auto'
}

function resolve(preference: MotionPreference): MotionLevel {
  if (preference !== 'auto') return preference
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'reduced' : 'full'
}

export function setMotionPreference(preference: MotionPreference) {
  try {
    if (preference === 'auto') localStorage.removeItem(STORAGE_KEY)
    else localStorage.setItem(STORAGE_KEY, preference)
  } catch {
    // Not persisted; still applied for this page view below.
  }
  document.documentElement.dataset.motion = resolve(preference)
}

export const isReducedMotion = () => document.documentElement.dataset.motion === 'reduced'

if (!document.documentElement.dataset.motion) {
  document.documentElement.dataset.motion = resolve(getMotionPreference())
}
