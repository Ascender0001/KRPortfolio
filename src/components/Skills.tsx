import { navLinks, skills, skillsSection } from '../data/portfolio'
import { useScrollReveal } from '../scroll/useScrollReveal'

export function Skills() {
  const sectionRef = useScrollReveal<HTMLElement>()

  return (
    <section className="section skills" id="skills" ref={sectionRef}>
      <div className="container split split-right">
        <div className="split-copy">
          <p className="eyebrow" data-reveal>
            {navLinks[1].index} — {navLinks[1].label}
          </p>
          <h2 className="section-title" data-reveal>
            {skillsSection.heading}
          </h2>

          <ul className="skill-list">
            {skills.map((skill, i) => (
              <li className="skill-row" key={skill} data-reveal>
                <span className="skill-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="skill-name">{skill}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
