import { useLayoutEffect } from 'react'
import { animate, createTimeline, utils } from 'animejs'
import { cvUrl, hero, site } from '../data/portfolio'
import { isReducedMotion } from '../motion'
import { clamp, useScene } from '../scroll/engine'
import { SplitText } from './SplitText'

export function Hero() {
  // Scroll: the intro drifts up and fades as the first shape starts to morph behind it.
  const rootRef = useScene<HTMLElement>((root) => {
    const inner = root.querySelector<HTMLElement>('.hero-inner')!
    const lineA = root.querySelector<HTMLElement>('[data-line="1"]')!
    const lineB = root.querySelector<HTMLElement>('[data-line="2"]')!
    const hint = root.querySelector<HTMLElement>('.scroll-hint')!

    return ({ top }) => {
      const out = clamp(-top / (window.innerHeight * 0.85))
      inner.style.transform = `translate3d(0, ${out * -140}px, 0)`
      inner.style.opacity = String(1 - out * 1.15)
      lineA.style.transform = `translate3d(${out * -8}vw, 0, 0)`
      lineB.style.transform = `translate3d(${out * 8}vw, 0, 0)`
      hint.style.opacity = String(1 - clamp(out * 5))
    }
  })

  // Load: letters rise out of a blur, then the copy and controls follow.
  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return

    const query = (selector: string) => Array.from(root.querySelectorAll<HTMLElement>(selector))
    const rest = [
      ...query('.hero-eyebrow'),
      ...query('.hero-tagline'),
      ...query('.hero-actions > *'),
      ...query('.scroll-hint'),
    ]

    if (isReducedMotion()) {
      const all = [...query('.hero-title'), ...rest]
      utils.set(all, { opacity: 0 })
      const fade = animate(all, { opacity: [0, 1], duration: 600, ease: 'outQuad' })
      return () => {
        fade.pause()
      }
    }

    const chars = query('.split-char')
    utils.set([...chars, ...rest], { opacity: 0 })

    const timeline = createTimeline({ defaults: { ease: 'outExpo' } })
    chars.forEach((char, i) => {
      timeline.add(
        char,
        {
          opacity: [0, 1],
          translateY: ['0.6em', '0em'],
          filter: ['blur(16px)', 'blur(0px)'],
          duration: 1100,
        },
        250 + i * 55,
      )
    })
    rest.forEach((el, i) => {
      timeline.add(el, { opacity: [0, 1], translateY: [28, 0], duration: 1000 }, 900 + i * 110)
    })

    return () => {
      timeline.pause()
    }
  }, [rootRef])

  return (
    <section className="section hero" id="hero" ref={rootRef}>
      <div className="container hero-inner">
        <p className="eyebrow hero-eyebrow">
          <span className="live-dot" aria-hidden="true" />
          {site.role} · {site.location}
        </p>

        <h1 className="hero-title">
          <span className="sr-only">{site.name}</span>
          <span className="hero-line" data-line="1">
            <SplitText text={hero.firstName} />
          </span>
          <span className="hero-line hero-line-accent" data-line="2">
            <SplitText text={hero.lastName} />
          </span>
        </h1>

        <p className="hero-tagline">{hero.tagline}</p>

        <div className="hero-actions">
          <a className="btn btn-primary" href="#projects">
            Projektek <span aria-hidden="true">→</span>
          </a>
          <a className="btn btn-ghost" href="#contact">
            Kapcsolat
          </a>
          <a className="text-link" href={cvUrl} download>
            CV letöltése <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>

      <div className="scroll-hint" aria-hidden="true">
        <span className="scroll-hint-mouse">
          <i />
        </span>
        {hero.cue}
      </div>
    </section>
  )
}
