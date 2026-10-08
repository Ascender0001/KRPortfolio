import type { CSSProperties } from 'react'
import { useStaggerChildren } from '../hooks/useReveal'
import { clamp, easeInOut, easeOut, headingScrubber, range, useScene } from '../scroll/engine'
import { SectionHeading } from './SectionHeading'
import { projects, projectsSection } from '../data/portfolio'
import type { ProjectFile } from '../data/portfolio'

const pad = (n: number) => String(n).padStart(2, '0')

function ProjectCard({ file, index }: { file: ProjectFile; index: number }) {
  const chips = file.tags ?? file.meta ?? []

  return (
    <article className="project-card" style={{ zIndex: index + 1 }}>
      <i className="card-corner card-corner-tl" aria-hidden="true" />
      <i className="card-corner card-corner-tr" aria-hidden="true" />
      <i className="card-corner card-corner-bl" aria-hidden="true" />
      <i className="card-corner card-corner-br" aria-hidden="true" />
      <span className="card-number" aria-hidden="true">
        {pad(index + 1)}
      </span>

      <div className="card-top">
        <p className="tech-label">
          <span className="accent">FILE_{pad(index + 1)}</span> // {file.kind.toUpperCase()}
        </p>
        <p className="tech-label">
          {pad(index + 1)} / {pad(projects.length)}
        </p>
      </div>
      <h3>{file.title}</h3>
      {file.description && <p className="card-desc">{file.description}</p>}
      {chips.length > 0 && (
        <div className="chip-row">
          {chips.map((chip) => (
            <span className="chip" key={chip}>
              {chip}
            </span>
          ))}
        </div>
      )}
    </article>
  )
}

export function Projects() {
  // Scroll: the first card rises in with the section; while pinned, each next card slides up
  // over the previous one, which settles back and dims.
  const sceneRef = useScene<HTMLElement>((root) => {
    const heading = headingScrubber(root)
    const stage = root.querySelector<HTMLElement>('.scene-stage')!
    const counter = root.querySelector<HTMLElement>('.deck-current')!
    const cards = Array.from(root.querySelectorAll<HTMLElement>('.project-card'))
    const n = cards.length

    return ({ p, enter }) => {
      heading(range(enter, 0.25, 1))

      const height = stage.clientHeight
      const s = range(p, 0.05, 0.95) * (n - 1)
      const shown = cards.map((_, i) =>
        i === 0 ? easeOut(range(enter, 0.45, 1)) : easeInOut(clamp(s - (i - 1))),
      )

      cards.forEach((card, i) => {
        let depth = 0
        for (let j = i + 1; j < n; j++) depth += shown[j]
        const y = (1 - shown[i]) * height * (i === 0 ? 0.6 : 1) - depth * 16
        card.style.transform = `translate3d(0, ${y}px, 0) scale(${1 - depth * 0.045})`
        card.style.setProperty('--shade', Math.min(0.72, depth * 0.32).toFixed(3))
      })

      counter.textContent = pad(Math.min(n, Math.round(s) + 1))
    }
  })

  const deckRef = useStaggerChildren<HTMLDivElement>({
    selector: '.project-card',
    y: 30,
    gap: 110,
    when: 'reduced',
  })

  return (
    <section
      className="scene scene-projects"
      id="projects"
      style={{ '--scene-length': `${projects.length * 85 + 90}vh` } as CSSProperties}
      ref={sceneRef}
    >
      <div className="scene-stage">
        <div className="scene-inner deck-head">
          <SectionHeading
            index={projectsSection.index}
            eyebrow={projectsSection.eyebrow}
            heading={projectsSection.heading}
          />
          <p className="tech-label deck-counter" aria-hidden="true">
            <span className="accent">FILE</span> <span className="deck-current">01</span> /{' '}
            {pad(projects.length)}
          </p>
        </div>

        <div className="project-deck" ref={deckRef}>
          {projects.map((project, i) => (
            <ProjectCard key={project.title} file={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
