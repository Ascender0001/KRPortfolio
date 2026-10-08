import { useEffect, useState } from 'react'
import { channels, cvUrl, navLinks, site } from '../data/portfolio'
import { getMotionPreference, isReducedMotion, setMotionPreference } from '../motion'
import type { MotionPreference } from '../motion'
import { useScrollReveal } from '../scroll/useScrollReveal'

const motionCycle: MotionPreference[] = ['auto', 'full', 'reduced']
const motionLabels: Record<MotionPreference, string> = {
  auto: 'AUTO',
  full: 'TELJES',
  reduced: 'VISSZAFOGOTT',
}

// Deliberately low-key: blends into the footer small print instead of being a visible setting.
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

const timeFormat = new Intl.DateTimeFormat('hu-HU', {
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Europe/Belgrade',
})

// Current time in Szabadka, refreshed every 30 seconds.
function LocalTime() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30_000)
    return () => window.clearInterval(timer)
  }, [])

  return <time dateTime={now.toISOString()}>{timeFormat.format(now)}</time>
}

export function Footer() {
  const year = new Date().getFullYear()
  const footerRef = useScrollReveal<HTMLElement>()
  const [email, phone] = channels

  const toTop = () => window.scrollTo({ top: 0, behavior: isReducedMotion() ? 'auto' : 'smooth' })

  return (
    <footer className="site-footer" ref={footerRef}>
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-brand" data-reveal>
            <p className="footer-title">
              <span className="footer-mark" aria-hidden="true">
                {site.brand}
              </span>
              {site.name}
            </p>
            <p className="footer-tagline">
              {site.role} — modern webes felületek és játékok, Szabadkáról.
            </p>
            <span className="pill pill-live">
              <span className="live-dot" aria-hidden="true" />
              Nyitott új lehetőségekre
            </span>
          </div>

          <nav className="footer-col" aria-label="Lábléc navigáció" data-reveal="1">
            <p className="footer-heading">Oldalak</p>
            <ul>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a className="footer-link" href={link.href}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="footer-col" data-reveal="2">
            <p className="footer-heading">Kapcsolat</p>
            <ul>
              <li>
                <a className="footer-link" href={email.href}>
                  E-mail
                </a>
              </li>
              <li>
                <a className="footer-link" href={phone.href}>
                  {phone.value}
                </a>
              </li>
              <li>
                <a className="footer-link" href={cvUrl} download>
                  Önéletrajz ↓
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-col" data-reveal="3">
            <p className="footer-heading">Helyi idő</p>
            <p className="footer-clock">
              <LocalTime />
            </p>
            <p className="footer-small">{site.location}</p>
            <button type="button" className="to-top" onClick={toTop}>
              Vissza a tetejére <span aria-hidden="true">↑</span>
            </button>
          </div>
        </div>

        <p className="footer-wordmark" aria-hidden="true">
          {site.name}
        </p>

        <div className="footer-bottom">
          <p className="footer-small">
            © {year} {site.name}
          </p>
          <MotionSwitch />
          <p className="footer-small">React · TypeScript · three.js</p>
        </div>
      </div>
    </footer>
  )
}
