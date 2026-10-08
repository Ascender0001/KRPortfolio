import type { PointerEvent } from 'react'
import { navLinks, projects, projectsSection } from '../data/portfolio'
import type { ProjectFile } from '../data/portfolio'
import { useScrollReveal } from '../scroll/useScrollReveal'

// Spotlight follows the pointer across the glass card.
function trackPointer(event: PointerEvent<HTMLElement>) {
  const card = event.currentTarget
  const rect = card.getBoundingClientRect()
  card.style.setProperty('--mx', `${event.clientX - rect.left}px`)
  card.style.setProperty('--my', `${event.clientY - rect.top}px`)
}

function ProjectCard({ file, index }: { file: ProjectFile; index: number }) {
  const current = file.meta?.includes('Jelenleg')
  const chips = file.tags ?? file.meta?.filter((m) => m !== 'Jelenleg') ?? []

  return (
    <article className="project-card" data-reveal={index % 2} onPointerMove={trackPointer}>
      <span className="project-num" aria-hidden="true">
        {String(index + 1).padStart(2, '0')}
      </span>
      <div className="project-top">
        <span className="pill">{file.kind}</span>
        {current && (
          <span className="pill pill-live">
            <span className="live-dot" aria-hidden="true" />
            Jelenleg
          </span>
        )}
      </div>
      <h3>{file.title}</h3>
      {file.description && <p className="project-desc">{file.description}</p>}
      {chips.length > 0 && (
        <ul className="tag-row">
          {chips.map((chip) => (
            <li className="tag" key={chip}>
              {chip}
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

export function Projects() {
  const sectionRef = useScrollReveal<HTMLElement>()

  return (
    <section className="section projects" id="projects" ref={sectionRef}>
      <div className="container">
        <p className="eyebrow" data-reveal>
          {navLinks[2].index} — {navLinks[2].label}
        </p>
        <h2 className="section-title" data-reveal>
          {projectsSection.heading}
        </h2>

        <div className="project-grid">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} file={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
