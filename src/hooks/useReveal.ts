import { useLayoutEffect, useRef } from 'react'
import { animate, utils } from 'animejs'

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

if (prefersReducedMotion()) {
  console.info(
    '[KRPortfolio] prefers-reduced-motion is active — all entrance/hover animations are intentionally disabled.',
  )
}

type Cleanup = () => void

function observeEnter(el: Element, onEnter: () => void, threshold = 0.15): Cleanup {
  if (!('IntersectionObserver' in window)) {
    onEnter()
    return () => {}
  }

  let fired = false
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || fired) return
        fired = true
        io.disconnect()
        onEnter()
      })
    },
    { threshold, rootMargin: '0px 0px -40px 0px' },
  )
  io.observe(el)
  return () => io.disconnect()
}

interface RevealOptions {
  delay?: number
  y?: number
  x?: number
  duration?: number
}

export function useReveal<T extends HTMLElement>({
  delay = 0,
  y = 30,
  x,
  duration = 950,
}: RevealOptions = {}) {
  const ref = useRef<T>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return

    if (x !== undefined) {
      utils.set(el, { opacity: 0, translateX: x })
    } else {
      utils.set(el, { opacity: 0, translateY: y })
    }

    const stop = observeEnter(
      el,
      () => {
        animate(el, {
          opacity: [0, 1],
          ...(x !== undefined ? { translateX: [x, 0] } : { translateY: [y, 0] }),
          duration,
          delay,
          ease: 'outQuart',
        })
      },
      0.12,
    )

    return stop
    // Options are static per-mount config; capturing them once is intentional.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return ref
}

interface StaggerChildrenOptions {
  selector: string
  mode?: 'sequence' | 'grid'
  y?: number
  x?: number
  gap?: number
  rowGap?: number
  colGap?: number
  baseDelay?: number
  threshold?: number
  duration?: number
}

export function useStaggerChildren<T extends HTMLElement>({
  selector,
  mode = 'sequence',
  y = 22,
  x,
  gap = 90,
  rowGap = 130,
  colGap = 45,
  baseDelay = 0,
  threshold = 0.15,
  duration = 800,
}: StaggerChildrenOptions) {
  const ref = useRef<T>(null)

  useLayoutEffect(() => {
    const root = ref.current
    if (!root || prefersReducedMotion()) return

    const items = Array.from(root.querySelectorAll<HTMLElement>(selector))
    if (!items.length) return

    utils.set(items, {
      opacity: 0,
      ...(x !== undefined ? { translateX: x } : { translateY: y }),
    })

    let delays: number[]

    if (mode === 'grid') {
      const tops: number[] = []
      items.forEach((item) => {
        const top = item.offsetTop
        if (!tops.includes(top)) tops.push(top)
      })
      tops.sort((a, b) => a - b)
      const columnCounters = new Map<number, number>()
      delays = items.map((item) => {
        const rowIndex = Math.max(0, tops.indexOf(item.offsetTop))
        const columnIndex = columnCounters.get(rowIndex) ?? 0
        columnCounters.set(rowIndex, columnIndex + 1)
        return baseDelay + rowIndex * rowGap + columnIndex * colGap
      })
    } else {
      delays = items.map((_, i) => baseDelay + i * gap)
    }

    const stop = observeEnter(
      root,
      () => {
        items.forEach((item, i) => {
          animate(item, {
            opacity: [0, 1],
            ...(x !== undefined ? { translateX: [x, 0] } : { translateY: [y, 0] }),
            duration,
            delay: delays[i],
            ease: 'outQuart',
          })
        })
      },
      threshold,
    )

    return stop
    // Selector/options are static per-mount config; capturing once is intentional.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return ref
}
