import { useStaggerChildren } from '../hooks/useReveal'
import { useTilt } from '../hooks/useTilt'
import { SectionHeading } from './SectionHeading'
import { projects, projectsSection } from '../data/portfolio'
import type { ProjectFile } from '../data/portfolio'

function FileCard({ file, index }: { file: ProjectFile; index: number }) {
  const tiltRef = useTilt<HTMLElement>(4)
  const fileId = `FILE_${String(index + 1).padStart(3, '0')}`
  const chips = file.tags ?? file.meta ?? []

  return (
    <article className="file-card" ref={tiltRef}>
      <div className="file-id-row">
        <p className="tech-label">
          <span className="accent">{fileId}</span>
        </p>
        <p className="tech-label">{file.kind.toUpperCase()}</p>
      </div>
      <h3>{file.title}</h3>
      {file.description && <p>{file.description}</p>}
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
  const gridRef = useStaggerChildren<HTMLDivElement>({
    selector: '.file-card',
    mode: 'grid',
    y: 36,
    baseDelay: 120,
    rowGap: 150,
    colGap: 110,
  })

  return (
    <section className="section" id="projects">
      <SectionHeading
        index={projectsSection.index}
        eyebrow={projectsSection.eyebrow}
        heading={projectsSection.heading}
      />

      <div className="files-grid" ref={gridRef}>
        {projects.map((project, i) => (
          <FileCard key={project.title} file={project} index={i} />
        ))}
      </div>
    </section>
  )
}
