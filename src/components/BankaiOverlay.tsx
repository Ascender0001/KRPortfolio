import { useEffect, useRef } from 'react'
import { createTimeline } from 'animejs'
import { onBankai } from '../bankai'
import { isReducedMotion } from '../motion'

// The transformation itself: a red flash, BANKAI slamming in, and a short shudder.
// Only opacity and transform are animated so it stays on the GPU and never janks. Releasing Bankai shows a small toast instead.
export function BankaiOverlay() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(
    () =>
      onBankai((on) => {
        const root = rootRef.current
        if (!root) return
        const pick = (selector: string) => root.querySelector<HTMLElement>(selector)!
        const status = pick('.bankai-status')
        const gentle = isReducedMotion()

        root.classList.add('is-playing')
        status.textContent = on ? 'Bankai mód bekapcsolva' : 'Bankai mód kikapcsolva'
        const timeline = createTimeline({
          defaults: { ease: 'outExpo' },
          onComplete: () => root.classList.remove('is-playing'),
        })

        if (!on) {
          timeline.add(pick('.bankai-toast'), { opacity: [0, 1, 1, 0], translateY: [16, 0, 0, -6], duration: 1800 })
          return
        }

        timeline
          .add(pick('.bankai-flash'), { opacity: [0, 0.9, 0], duration: 1500, ease: 'outQuad' }, 0)
          .add(
            pick('.bankai-title'),
            {
              opacity: [0, 1, 1, 0],
              scale: gentle ? [1, 1, 1, 1] : [2.4, 1, 1, 1.05],
              duration: 2500,
            },
            120,
          )
          .add(
            pick('.bankai-sub'),
            { opacity: [0, 1, 1, 0], letterSpacing: ['0.2em', '0.7em', '0.7em', '0.7em'], duration: 2500 },
            450,
          )

        if (!gentle) {
          pick('.bankai-title').animate(
            [
              { translate: '0 0' },
              { translate: '-8px 4px' },
              { translate: '7px -5px' },
              { translate: '-4px 2px' },
              { translate: '0 0' },
            ],
            { duration: 420, delay: 260, easing: 'ease-out' },
          )
        }
      }),
    [],
  )

  return (
    <div className="bankai-overlay" ref={rootRef}>
      <div className="bankai-flash" aria-hidden="true" />
      <p className="bankai-title" aria-hidden="true">
        Bankai
      </p>
      <p className="bankai-sub" aria-hidden="true">
        Tensa Zangetsu
      </p>
      <p className="bankai-toast" aria-hidden="true">
        Bankai feloldva
      </p>
      <span className="sr-only bankai-status" role="status" />
    </div>
  )
}
