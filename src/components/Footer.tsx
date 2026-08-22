import { useReveal } from '../hooks/useReveal'
import { site } from '../data/portfolio'

export function Footer() {
  const year = new Date().getFullYear()
  const innerRef = useReveal<HTMLDivElement>({ y: 16, duration: 800 })

  return (
    <footer className="site-footer">
      <div className="footer-inner" ref={innerRef}>
        <p className="tech-label">
          © {year} {site.name.toUpperCase()}
        </p>
        <p className="tech-label">
          <span className="status-dot" aria-hidden="true" /> SYS.ONLINE — {site.brand}//PORTFÓLIÓ
        </p>
      </div>
    </footer>
  )
}
