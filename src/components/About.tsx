import type { CSSProperties } from 'react'
import { useReveal, useStaggerChildren } from '../hooks/useReveal'
import { clamp, easeOut, headingScrubber, range, useScene } from '../scroll/engine'
import { SectionHeading } from './SectionHeading'
import { about, education } from '../data/portfolio'

export function About() {
  const words = about.lead.split(' ')

  // Scroll: heading rises in with the section → the lead lights up word by word → body and
  // education timeline roll in.
  const sceneRef = useScene<HTMLElement>((root) => {
    const heading = headingScrubber(root)
    const wordEls = Array.from(root.querySelectorAll<HTMLElement>('.word'))
    const body = root.querySelector<HTMLElement>('.about-body')!
    const panel = root.querySelector<HTMLElement>('.about-panel')!
    const rail = root.querySelector<HTMLElement>('.timeline-rail')!
    const rows = Array.from(root.querySelectorAll<HTMLElement>('.timeline-row'))

    return ({ p, enter }) => {
      // One timeline across both phases: 0→1 sliding in, 1→2 pinned.
      const c = enter + p
      heading(range(c, 0.25, 1))

      const lit = range(c, 0.6, 1.4) * wordEls.length
      wordEls.forEach((word, i) => {
        word.style.opacity = String(0.12 + 0.88 * clamp(lit - i))
      })

      const bodyIn = easeOut(range(c, 1.25, 1.45))
      body.style.opacity = String(bodyIn)
      body.style.transform = `translateY(${(1 - bodyIn) * 30}px)`

      const panelIn = easeOut(range(c, 1.3, 1.5))
      panel.style.opacity = String(panelIn)
      panel.style.transform = `translateX(${(1 - panelIn) * 60}px)`
      rail.style.transform = `scaleY(${easeOut(range(c, 1.4, 1.75))})`

      rows.forEach((row, i) => {
        const t = easeOut(range(c, 1.45 + i * 0.12, 1.65 + i * 0.12))
        row.style.opacity = String(t)
        row.style.transform = `translateX(${(1 - t) * -40}px)`
      })
    }
  })

  const copyRef = useReveal<HTMLDivElement>({ when: 'reduced' })
  const panelRef = useStaggerChildren<HTMLElement>({
    selector: '.timeline-row',
    x: -26,
    gap: 120,
    baseDelay: 200,
    duration: 700,
    when: 'reduced',
  })

  return (
    <section
      className="scene scene--pin-wide scene-about"
      id="about"
      style={{ '--scene-length': '240vh' } as CSSProperties}
      ref={sceneRef}
    >
      <div className="scene-stage">
        <div className="scene-inner">
          <SectionHeading index={about.index} eyebrow={about.eyebrow} heading={about.heading} />

          <div className="about-grid">
            <div className="about-copy" ref={copyRef}>
              <p className="lead">
                {words.map((word, i) => (
                  <span className="word" key={i}>
                    {word}{' '}
                  </span>
                ))}
              </p>
              <p className="about-body">{about.body}</p>
            </div>

            <aside className="panel panel-corner about-panel" ref={panelRef}>
              <div className="file-head">
                <p className="tech-label">
                  <span className="accent">{about.fileId}</span>
                </p>
                <i className="tech-line" />
                <p className="tech-label">{about.educationLabel.toUpperCase()}</p>
              </div>

              <div className="timeline">
                <i className="timeline-rail" aria-hidden="true" />
                {education.map((item) => (
                  <div className="timeline-row" key={item.school}>
                    <span className="timeline-period">{item.period}</span>
                    <div className="timeline-school">
                      <h4>{item.school}</h4>
                      <p>{item.field}</p>
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  )
}
