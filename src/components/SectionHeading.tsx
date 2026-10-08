import { useReveal } from '../hooks/useReveal'

interface Props {
  index: string
  eyebrow: string
  heading: string
}

// In full motion the owning scene scrubs this in with revealHeading(); in reduced mode it fades.
export function SectionHeading({ index, eyebrow, heading }: Props) {
  const ref = useReveal<HTMLDivElement>({ when: 'reduced' })

  return (
    <div className="section-heading" ref={ref}>
      <div className="section-meta">
        <span className="section-index">{index}</span>
        <p className="tech-label">
          <span className="accent">// </span>
          {eyebrow}
        </p>
      </div>
      <h2>{heading}</h2>
      <i className="heading-line" aria-hidden="true" />
    </div>
  )
}
