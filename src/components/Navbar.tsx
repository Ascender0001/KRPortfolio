import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createTimeline, utils } from 'animejs'
import { navLinks, site } from '../data/portfolio'
import { prefersReducedMotion } from '../hooks/useReveal'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const navRef = useRef<HTMLElement>(null)

  // Entrance: bar slides down, brand flickers in, links cascade.
  useLayoutEffect(() => {
    const header = navRef.current
    if (!header || prefersReducedMotion()) return

    const mark = header.querySelector<HTMLElement>('.brand-mark')
    const name = header.querySelector<HTMLElement>('.brand-name')
    const links = Array.from(header.querySelectorAll<HTMLElement>('.nav-panel a'))

    utils.set([header, mark, name, ...links], { opacity: 0 })

    const timeline = createTimeline({ defaults: { ease: 'outQuart' } })
    timeline.add(header, { opacity: [0, 1], translateY: [-72, 0], duration: 600 }, 0)

    if (mark) {
      timeline.add(
        mark,
        { opacity: [0, 1, 0.25, 1], duration: 320, ease: 'linear' },
        420,
      )
    }
    if (name) {
      timeline.add(name, { opacity: [0, 1], duration: 400 }, 520)
    }
    links.forEach((link, i) => {
      timeline.add(
        link,
        { opacity: [0, 1], translateY: [-14, 0], duration: 450 },
        620 + i * 60,
      )
    })

    return () => {
      timeline.pause()
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    const handleClick = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('click', handleClick)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('click', handleClick)
    }
  }, [isOpen])

  return (
    <header
      className={`site-header${isScrolled ? ' is-scrolled' : ''}${isOpen ? ' has-menu' : ''}`}
      ref={navRef}
    >
      <nav className="navbar" aria-label="Fő navigáció">
        <a className="brand" href="#hero" aria-label="Király Róbert kezdőlap">
          <span className="brand-mark">{site.brand}//</span>
          <span className="brand-name">{site.name}</span>
        </a>

        <button
          className="nav-toggle"
          type="button"
          aria-expanded={isOpen}
          aria-controls="primary-navigation"
          onClick={() => setIsOpen((open) => !open)}
        >
          <span className="nav-toggle-lines" aria-hidden="true" />
          <span className="sr-only">{isOpen ? 'Menü bezárása' : 'Menü megnyitása'}</span>
        </button>

        <div
          className={isOpen ? 'nav-panel is-open' : 'nav-panel'}
          id="primary-navigation"
        >
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setIsOpen(false)}>
              <span className="nav-index">{link.index}</span>
              {link.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  )
}
