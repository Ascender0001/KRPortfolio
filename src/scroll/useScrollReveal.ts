import { useLayoutEffect } from 'react'
import { animate, utils } from 'animejs'
import { isReducedMotion } from '../motion'
import { easeOut, range, useScene } from './engine'
import type { SceneUpdate } from './engine'

const RISE = 70

/**
 * Scroll-scrubbed entrance for every [data-reveal] element inside a section: each one glides
 * up and sharpens as it moves from the bottom of the viewport toward the middle, tied to the
 * (smoothed) scroll position rather than fired once. A numeric data-reveal value staggers
 * elements that share a row (e.g. buttons): data-reveal="2" starts a little later.
 *
 * `extra` adds section-specific scrubbing on top. Reduced motion gets a short one-time fade.
 */
export function useScrollReveal<T extends HTMLElement>(extra?: (root: T) => SceneUpdate) {
  const ref = useScene<T>((root) => {
    const items = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'))
    const rootTop = root.getBoundingClientRect().top
    // Measured before any transform is applied, relative to the section.
    const offsets = items.map((el) => el.getBoundingClientRect().top - rootTop)
    const delays = items.map((el) => Number(el.dataset.reveal || 0) * 0.04)
    const more = extra?.(root)

    return (frame) => {
      const vh = window.innerHeight
      items.forEach((el, i) => {
        const position = 1 - (frame.top + offsets[i]) / vh
        const t = easeOut(range(position, 0.02 + delays[i], 0.38 + delays[i]))
        el.style.opacity = String(t)
        el.style.transform = t < 1 ? `translate3d(0, ${(1 - t) * RISE}px, 0) scale(${0.96 + t * 0.04})` : ''
      })
      more?.(frame)
    }
  })

  useLayoutEffect(() => {
    const root = ref.current
    if (!root || !isReducedMotion()) return

    const items = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'))
    utils.set(items, { opacity: 0 })
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          io.unobserve(entry.target)
          animate(entry.target as HTMLElement, { opacity: [0, 1], duration: 450, ease: 'outQuad' })
        })
      },
      { threshold: 0.1 },
    )
    items.forEach((item) => io.observe(item))
    return () => io.disconnect()
  }, [ref])

  return ref
}
