import type { CSSProperties } from 'react'
import { useStaggerChildren } from '../hooks/useReveal'
import { clamp, headingScrubber, lerp, range, useScene } from '../scroll/engine'
import { SectionHeading } from './SectionHeading'
import { skills, skillsSection } from '../data/portfolio'

const pad = (n: number) => String(n).padStart(2, '0')

export function Skills() {
  // Scroll: the card row is already gliding in as the section arrives, then runs sideways
  // while pinned; the card nearest the centre comes into focus.
  const sceneRef = useScene<HTMLElement>((root) => {
    const heading = headingScrubber(root)
    const stage = root.querySelector<HTMLElement>('.scene-stage')!
    const track = root.querySelector<HTMLElement>('.skill-track')!
    const frames = Array.from(root.querySelectorAll<HTMLElement>('.skill-card'))

    return ({ p, enter }) => {
      // One timeline across both phases: 0→1 sliding in, 1→2 pinned.
      const c = enter + p
      heading(range(c, 0.25, 1))

      // From the first card entering on the right to the last card resting in the centre.
      const width = stage.clientWidth
      const centerOf = (frame: HTMLElement) => frame.offsetLeft + frame.offsetWidth / 2
      const from = width * 1.05 - centerOf(frames[0])
      const to = width / 2 - centerOf(frames[frames.length - 1])
      const x = lerp(from, to, range(c, 0.45, 1.92))
      track.style.transform = `translate3d(${x}px, 0, 0)`

      frames.forEach((frame) => {
        const center = centerOf(frame) + x
        const focus = 1 - clamp(Math.abs(center - width / 2) / (width * 0.42))
        frame.style.setProperty('--focus', focus.toFixed(3))
      })
    }
  })

  const railRef = useStaggerChildren<HTMLDivElement>({
    selector: '.skill-card',
    y: 20,
    gap: 60,
    when: 'reduced',
  })

  return (
    <section
      className="scene scene-skills"
      id="skills"
      style={{ '--scene-length': '340vh' } as CSSProperties}
      ref={sceneRef}
    >
      <div className="scene-stage">
        <div className="scene-inner">
          <SectionHeading
            index={skillsSection.index}
            eyebrow={skillsSection.eyebrow}
            heading={skillsSection.heading}
          />
        </div>

        <div className="skill-rail" ref={railRef}>
          <div className="skill-track">
            {skills.map((skill, i) => (
              <div className="skill-card" key={skill}>
                <span className="skill-index">SKL_{pad(i + 1)}</span>
                <span className="skill-ghost" aria-hidden="true">
                  {pad(i + 1)}
                </span>
                <span className="skill-name">{skill}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="scene-inner skill-caption">
          <p className="tech-label">
            <span className="accent">// </span>
            {skills.length} technológia
          </p>
        </div>
      </div>
    </section>
  )
}
