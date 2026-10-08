import { useLayoutEffect } from 'react'
import type { CSSProperties } from 'react'
import { animate, createTimeline, utils } from 'animejs'
import { cvUrl, hero, site } from '../data/portfolio'
import { isReducedMotion } from '../motion'
import { easeInOut, lerp, range, useScene } from '../scroll/engine'
import { SplitText } from './SplitText'

export function Hero() {
  // Scroll: the title splits and pushes toward the viewer, the grid floor glides underneath.
  const rootRef = useScene<HTMLElement>((root) => {
    const pick = (selector: string) => root.querySelector<HTMLElement>(selector)!
    const title = pick('.hero-title')
    const lineA = pick('[data-line="1"]')
    const lineB = pick('[data-line="2"]')
    const topline = pick('.hero-topline')
    const meta = pick('.hero-meta')
    const cue = pick('.scroll-cue')
    const floor = pick('.hero-floor')
    const glow = pick('.hero-glow')

    return ({ p }) => {
      const push = easeInOut(range(p, 0, 1))
      title.style.transform = `scale(${lerp(1, 1.9, push)})`
      title.style.opacity = String(1 - range(p, 0.35, 0.95))
      lineA.style.transform = `translateX(${-push * 18}vw)`
      lineB.style.transform = `translateX(${push * 18}vw)`

      const away = easeInOut(range(p, 0, 0.45))
      meta.style.opacity = String(1 - away)
      meta.style.transform = `translateY(${-away * 80}px)`
      topline.style.opacity = String(1 - range(p, 0, 0.3))
      topline.style.transform = `translateY(${-range(p, 0, 0.3) * 40}px)`
      cue.style.opacity = String(1 - range(p, 0, 0.12))

      floor.style.backgroundPosition = `0 ${p * 900}px`
      glow.style.transform = `scale(${1 + p * 0.8})`
    }
  })

  // Load: title cascade out of blur → red light sweep → tagline and controls.
  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return

    const query = (selector: string) => Array.from(root.querySelectorAll<HTMLElement>(selector))

    if (isReducedMotion()) {
      const groups = [query('.hero-topline'), query('.hero-title'), query('.hero-meta')]
      utils.set(groups.flat(), { opacity: 0 })
      const fades = groups.map((group, i) =>
        animate(group, { opacity: [0, 1], duration: 500, delay: 80 + i * 140, ease: 'outQuad' }),
      )
      return () => fades.forEach((fade) => fade.pause())
    }

    const chars = query('.split-char')
    const beam = query('.hero-beam')
    const late = [
      ...query('.hero-topline p'),
      ...query('.tagline'),
      ...query('.hero-actions .btn'),
      ...query('.scroll-cue'),
    ]

    utils.set([...chars, ...late], { opacity: 0 })

    const timeline = createTimeline({ defaults: { ease: 'outQuart' } })
    chars.forEach((char, i) => {
      timeline.add(
        char,
        {
          opacity: [0, 1],
          translateY: [60, 0],
          filter: ['blur(14px)', 'blur(0px)'],
          duration: 900,
          ease: 'outExpo',
        },
        150 + i * 45,
      )
    })
    timeline.add(beam, { left: ['-40%', '120%'], opacity: [0, 1, 0], duration: 1100, ease: 'inOutQuad' }, 500)
    late.forEach((el, i) => {
      timeline.add(el, { opacity: [0, 1], translateY: [24, 0], duration: 700 }, 800 + i * 90)
    })

    return () => {
      timeline.pause()
    }
  }, [rootRef])

  return (
    <section
      className="scene scene-hero"
      id="hero"
      style={{ '--scene-length': '190vh' } as CSSProperties}
      ref={rootRef}
    >
      <div className="scene-stage hero-stage">
        <div className="hero-bg" aria-hidden="true">
          <i className="hero-glow" />
          <i className="hero-floor" />
          <i className="hero-beam" />
        </div>


        <div className="scene-inner hero-content">
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

          <div className="hero-meta">
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
          </div>
        </div>


        <div className="scroll-cue" aria-hidden="true">
          <span>{hero.cue}</span>
          <i className="scroll-cue-line" />
        </div>
      </div>
    </section>
  )
}
