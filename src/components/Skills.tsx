import { useStaggerChildren } from '../hooks/useReveal'
import { SectionHeading } from './SectionHeading'
import { skills, skillsSection } from '../data/portfolio'

export function Skills() {
  const gridRef = useStaggerChildren<HTMLDivElement>({
    selector: '.module',
    mode: 'grid',
    y: 26,
    baseDelay: 100,
    rowGap: 100,
    colGap: 55,
  })

  return (
    <section className="section" id="skills">
      <SectionHeading
        index={skillsSection.index}
        eyebrow={skillsSection.eyebrow}
        heading={skillsSection.heading}
      />

      <div className="modules-grid" ref={gridRef}>
        {skills.map((skill, i) => (
          <div className="module" key={skill}>
            <span className="module-index">SKL_{String(i + 1).padStart(2, '0')}</span>
            <span className="module-name">{skill}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
