import { useEffect, useRef } from 'react'
import { animate, utils } from 'animejs'
import { prefersReducedMotion } from '../hooks/useReveal'

export function ScrollProgress() {
  const barRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const bar = barRef.current
    if (!bar || prefersReducedMotion()) return

    let ticking = false

    const update = () => {
      ticking = false
      const doc = document.documentElement
      const max = doc.scrollHeight - window.innerHeight
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      animate(bar, {
        scaleX: progress,
        duration: 260,
        ease: 'outQuad',
      })
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(update)
    }

    utils.set(bar, { scaleX: 0 })
    window.addEventListener('scroll', onScroll, { passive: true })
    update()

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="scroll-progress" aria-hidden="true">
      <span ref={barRef} />
    </div>
  )
}
