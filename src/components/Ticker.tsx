import { useEffect, useRef } from 'react'
import { animate } from 'animejs'
import { isReducedMotion } from '../motion'

const phrase =
  'OVER THE FRONTIER // KIRÁLY RÓBERT // WEB- ÉS JÁTÉKFEJLESZTÉS // SZABADKA, SZERBIA // '

export function Ticker() {
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track || isReducedMotion()) return

    const loop = animate(track, {
      translateX: [0, '-50%'],
      duration: 24000,
      ease: 'linear',
      loop: true,
    })

    return () => {
      loop.pause()
    }
  }, [])

  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker-track" ref={trackRef}>
        <span>{phrase.repeat(3)}</span>
        <span>{phrase.repeat(3)}</span>
      </div>
    </div>
  )
}
