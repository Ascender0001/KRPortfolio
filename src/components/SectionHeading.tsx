import { useLayoutEffect, useRef } from 'react'
import { animate } from 'animejs'
import { useReveal } from '../hooks/useReveal'
import { isReducedMotion } from '../motion'

interface Props {
  index: string
  eyebrow: string
  heading: string
}

export function SectionHeading({ index, eyebrow, heading }: Props) {
  const ref = useReveal<HTMLDivElement>()
  const lineRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const line = lineRef.current
    if (!line || isReducedMotion()) return

    let fired = false
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || fired) return
          fired = true
          io.disconnect()
          animate(line, {
            scaleX: [0, 1],
            duration: 1100,
            delay: 250,
            ease: 'outCubic',
          })
        })
      },
      { threshold: 0.3 },
    )
    io.observe(line)
    return () => io.disconnect()
  }, [])

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
      <i className="heading-line" aria-hidden="true" ref={lineRef} />
    </div>
  )
}
