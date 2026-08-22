import { useReveal, useStaggerChildren } from '../hooks/useReveal'
import { SectionHeading } from './SectionHeading'
import { about, education } from '../data/portfolio'

export function About() {
  const copyRef = useReveal<HTMLDivElement>()
  const panelRef = useStaggerChildren<HTMLElement>({
    selector: '.timeline-row',
    x: -26,
    gap: 120,
    baseDelay: 200,
    duration: 700,
  })

  return (
    <section className="section" id="about">
      <SectionHeading index={about.index} eyebrow={about.eyebrow} heading={about.heading} />

      <div className="about-grid">
        <div className="about-copy" ref={copyRef}>
          <p className="lead">{about.lead}</p>
          <p>{about.body}</p>
        </div>

        <aside className="panel panel-corner" ref={panelRef}>
          <div className="file-head">
            <p className="tech-label">
              <span className="accent">{about.fileId}</span>
            </p>
            <i className="tech-line" />
            <p className="tech-label">{about.educationLabel.toUpperCase()}</p>
          </div>

          <div className="timeline">
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
    </section>
  )
}
