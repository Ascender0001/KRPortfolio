import { navLinks, skills, skillsSection } from '../data/portfolio'
import { clamp, range } from '../scroll/engine'
import { useScrollReveal } from '../scroll/useScrollReveal'

export function Skills() {
  // Each name fills in left to right as it scrolls up the screen; the row nearest the middle
  // of the viewport takes the spotlight (red, nudged right, note revealed).
  const sectionRef = useScrollReveal<HTMLElement>((root) => {
    const rows = Array.from(root.querySelectorAll<HTMLElement>('.skill-row'))
    const rootTop = root.getBoundingClientRect().top
    const centers = rows.map((row) => {
      const rect = row.getBoundingClientRect()
      return rect.top - rootTop + rect.height / 2
    })
    const rowHeight = rows[0]?.offsetHeight ?? 80

    return ({ top }) => {
      const vh = window.innerHeight
      rows.forEach((row, i) => {
        const y = top + centers[i]
        const fill = range(1 - y / vh, 0.12, 0.5)
        const focus = 1 - clamp(Math.abs(y - vh * 0.5) / (rowHeight * 0.7))
        row.style.setProperty('--fill', fill.toFixed(3))
        row.style.setProperty('--focus', focus.toFixed(3))
      })
    }
  })

  return (
    <section className="section skills" id="skills" ref={sectionRef}>
      <div className="container">
        <p className="eyebrow" data-reveal>
          {navLinks[1].index} — {navLinks[1].label}
        </p>
        <h2 className="section-title" data-reveal>
          {skillsSection.heading}
        </h2>

        <ul className="skill-list">
          {skills.map((skill, i) => (
            <li className="skill-row" key={skill.name}>
              <span className="skill-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="skill-name">
                {skill.name}
                <span className="skill-fill" aria-hidden="true">
                  {skill.name}
                </span>
              </span>
              <span className="skill-note">{skill.note}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
