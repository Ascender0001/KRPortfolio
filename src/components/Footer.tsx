import { useState } from 'react'
import { useReveal } from '../hooks/useReveal'
import { site } from '../data/portfolio'
import { getMotionPreference, setMotionPreference } from '../motion'
import type { MotionPreference } from '../motion'

const motionCycle: MotionPreference[] = ['auto', 'full', 'reduced']
const motionLabels: Record<MotionPreference, string> = {
  auto: 'AUTO',
  full: 'TELJES',
  reduced: 'VISSZAFOGOTT',
}

// Deliberately low-key: blends into the footer status line instead of being a visible setting.
function MotionSwitch() {
  const [preference] = useState(getMotionPreference)

  const cycle = () => {
    const next = motionCycle[(motionCycle.indexOf(preference) + 1) % motionCycle.length]
    setMotionPreference(next)
    // Entrance choreography is set up on mount, so a reload is the cleanest way to apply it.
    window.location.reload()
  }

  return (
    <button
      type="button"
      className="motion-switch"
      onClick={cycle}
      title="Animációk váltása"
      aria-label={`Animációk: ${motionLabels[preference].toLowerCase()} (váltás)`}
    >
      Animációk: {motionLabels[preference].toLowerCase()}
    </button>
  )
}

export function Footer() {
  const year = new Date().getFullYear()
  const innerRef = useReveal<HTMLDivElement>({ y: 16, duration: 800 })

  return (
    <footer className="site-footer">
      <div className="footer-inner" ref={innerRef}>
        <p className="footer-text">
          © {year} {site.name}
        </p>
        <div className="footer-meta">
          <MotionSwitch />
          <p className="footer-text">
            Szabadka, Szerbia
          </p>
        </div>
      </div>
    </footer>
  )
}
