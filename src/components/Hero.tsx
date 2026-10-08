import { useEffect, useLayoutEffect, useRef } from 'react'
import { animate, createTimeline, utils } from 'animejs'
import { channels, cvUrl, hero, site } from '../data/portfolio'
import { prefersReducedMotion } from '../hooks/useReveal'
import { SplitText } from './SplitText'

export function Hero() {
  const rootRef = useRef<HTMLElement>(null)

  // Entrance mega-timeline: corners → topline → char cascade → scanline → copy → actions → strip.
  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root || prefersReducedMotion()) return

    const query = (selector: string) =>
      Array.from(root.querySelectorAll<HTMLElement>(selector))

    const corners = query('.hero-corner')
    const topline = root.querySelector<HTMLElement>('.hero-topline')
    const charsA = query('[data-line="1"] .split-char')
    const charsB = query('[data-line="2"] .split-char')
    const tagline = root.querySelector<HTMLElement>('.tagline')
    const buttons = query('.hero-actions .btn')
    const stripItems = query('.strip-item')
    const hint = root.querySelector<HTMLElement>('.scroll-hint')
    const scanline = root.querySelector<HTMLElement>('.hero-scanline')

    const all = [
      ...corners,
      topline,
      ...charsA,
      ...charsB,
      tagline,
      ...buttons,
      ...stripItems,
      hint,
    ].filter((el): el is HTMLElement => Boolean(el))

    if (!all.length) return

    utils.set(all, { opacity: 0 })

    const timeline = createTimeline({ defaults: { ease: 'outQuart' } })

    corners.forEach((corner, i) => {
      timeline.add(
        corner,
        { opacity: [0, 1], scale: [0, 1], duration: 380, ease: 'outCubic' },
        80 + i * 70,
      )
    })

    if (topline) {
      timeline.add(
        topline,
        { opacity: [0, 1], translateY: [-16, 0], duration: 550 },
        220,
      )
    }

    const cascade = (chars: HTMLElement[], start: number) =>
      chars.forEach((char, i) => {
        timeline.add(
          char,
          {
            opacity: [0, 1],
            translateY: [46, 0],
            rotateX: [-75, 0],
            duration: 620,
            ease: 'outCubic',
          },
          start + i * 26,
        )
      })

    cascade(charsA, 430)
    cascade(charsB, 760)

    if (scanline) {
      timeline.add(
        scanline,
        { top: ['-14%', '114%'], duration: 950, ease: 'inOutQuad' },
        1180,
      )
    }

    if (tagline) {
      timeline.add(tagline, { opacity: [0, 1], translateY: [24, 0], duration: 600 }, 1420)
    }

    buttons.forEach((button, i) => {
      timeline.add(
        button,
        { opacity: [0, 1], translateY: [18, 0], duration: 520 },
        1560 + i * 80,
      )
    })

    stripItems.forEach((item, i) => {
      timeline.add(
        item,
        { opacity: [0, 1], translateY: [20, 0], duration: 520 },
        1760 + i * 95,
      )
    })

    if (hint) {
      timeline.add(hint, { opacity: [0, 1], duration: 600 }, 2150)
    }

    return () => {
      timeline.pause()
    }
  }, [])

  // Cursor parallax: glow drifts against the cursor, title leans with it.
  useEffect(() => {
    const root = rootRef.current
    if (!root || prefersReducedMotion()) return

    const glow = root.querySelector<HTMLElement>('.hero-glow')
    const title = root.querySelector<HTMLElement>('.hero-title')
    let rafId = 0
    let lastRun = 0

    const onMove = (event: MouseEvent) => {
      const now = performance.now()
      if (now - lastRun < 32) return
      lastRun = now

      const nx = event.clientX / window.innerWidth - 0.5
      const ny = event.clientY / window.innerHeight - 0.5

      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        if (glow) {
          animate(glow, {
            translateX: nx * -34,
            translateY: ny * -34,
            duration: 900,
            ease: 'outQuad',
          })
        }
        if (title) {
          animate(title, {
            translateX: nx * 10,
            translateY: ny * 8,
            duration: 700,
            ease: 'outQuad',
          })
        }
      })
    }

    root.addEventListener('mousemove', onMove)
    return () => {
      root.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  // Ambient slow zoom on the glow field.
  useEffect(() => {
    const root = rootRef.current
    if (!root || prefersReducedMotion()) return

    const glow = root.querySelector<HTMLElement>('.hero-glow')
    if (!glow) return

    const zoom = animate(glow, {
      scale: [1, 1.14],
      duration: 24000,
      ease: 'inOutSine',
      loop: true,
      alternate: true,
    })

    return () => {
      zoom.pause()
    }
  }, [])

  return (
    <section className="hero" id="hero" ref={rootRef}>
      <div className="hero-bg" aria-hidden="true">
        <i className="hero-glow" />
        <i className="hero-slash" />
        <i className="hero-scanline" />
      </div>
      <div className="hero-frame" aria-hidden="true">
        <i className="hero-corner hero-corner-tl" />
        <i className="hero-corner hero-corner-tr" />
        <i className="hero-corner hero-corner-bl" />
        <i className="hero-corner hero-corner-br" />
      </div>

      <div className="hero-topline">
        <p className="tech-label">
          <span className="accent">// </span>
          {hero.eyebrow}
        </p>
        <p className="tech-label">
          {site.location.toUpperCase()} — {site.coordinates}
        </p>
      </div>

      <h1 className="hero-title">
        <span className="sr-only">{site.name}</span>
        <span className="hero-title-line" data-line="1">
          <SplitText text={hero.firstName} />
        </span>
        <span className="hero-title-line hero-title-last" data-line="2">
          <SplitText text={hero.lastName} />
        </span>
      </h1>

      <p className="tagline">{hero.tagline}</p>

      <div className="hero-actions">
        <a className="btn btn-solid" href="#projects">
          <span className="btn-mark" aria-hidden="true" />
          Projektek megtekintése
        </a>
        <a className="btn" href="#contact">
          Kapcsolat
        </a>
        <a className="btn" href={cvUrl} download>
          CV letöltése
        </a>
      </div>

      <dl className="data-strip">
        <div className="strip-item">
          <dt>TEL</dt>
          <dd>
            <a href={channels[1].href}>{channels[1].value}</a>
          </dd>
        </div>
        <div className="strip-item">
          <dt>MAIL</dt>
          <dd>
            <a href={channels[0].href}>{channels[0].value}</a>
          </dd>
        </div>
        <div className="strip-item">
          <dt>FOKUSZ</dt>
          <dd>Web / React / Python</dd>
        </div>
      </dl>

      <div className="scroll-hint" aria-hidden="true">
        <span>Scroll</span>
        <i className="scroll-hint-line" />
      </div>
    </section>
  )
}
