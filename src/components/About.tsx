import { about, education, navLinks } from '../data/portfolio'
import { clamp, range } from '../scroll/engine'
import { useScrollReveal } from '../scroll/useScrollReveal'

export function About() {
  const words = about.lead.split(' ')

  // On top of the shared reveal: the lead lights up word by word as it scrolls up the screen.
  const sectionRef = useScrollReveal<HTMLElement>((root) => {
    const lead = root.querySelector<HTMLElement>('.about-lead')!
    const wordEls = Array.from(lead.querySelectorAll<HTMLElement>('.word'))
    const leadOffset = lead.getBoundingClientRect().top - root.getBoundingClientRect().top

    return ({ top }) => {
      const position = 1 - (top + leadOffset) / window.innerHeight
      const lit = range(position, 0.12, 0.62) * wordEls.length
      wordEls.forEach((word, i) => {
        word.style.opacity = String(0.14 + 0.86 * clamp(lit - i))
      })
    }
  })

  return (
    <section className="section about" id="about" ref={sectionRef}>
      <div className="container split split-left">
        <div className="split-copy">
          <p className="eyebrow" data-reveal>
            {navLinks[0].index} — {navLinks[0].label}
          </p>
          <h2 className="section-title" data-reveal>
            {about.heading}
          </h2>
          <p className="about-lead">
            {words.map((word, i) => (
              <span className="word" key={i}>
                {word}{' '}
              </span>
            ))}
          </p>
          <p className="about-body" data-reveal>
            {about.body}
          </p>

          <ul className="edu-list">
            {education.map((item) => (
              <li className="edu-item" key={item.school} data-reveal>
                <span className="edu-period">{item.period}</span>
                <span className="edu-school">{item.school}</span>
                <span className="edu-field">{item.field}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
