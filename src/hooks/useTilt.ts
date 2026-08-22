import { useEffect, useRef } from 'react'
import { animate } from 'animejs'
import { prefersReducedMotion } from './useReveal'

export function useTilt<T extends HTMLElement>(max = 4) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    if (!window.matchMedia('(pointer: fine)').matches) return

    let rafId = 0

    const onMove = (event: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      const nx = (event.clientX - rect.left) / rect.width - 0.5
      const ny = (event.clientY - rect.top) / rect.height - 0.5
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        animate(el, {
          rotateY: nx * max * 2,
          rotateX: -ny * max * 2,
          duration: 450,
          ease: 'outQuad',
        })
      })
    }

    const onLeave = () => {
      cancelAnimationFrame(rafId)
      animate(el, {
        rotateX: 0,
        rotateY: 0,
        duration: 800,
        ease: 'outElastic(1, .6)',
      })
    }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
      cancelAnimationFrame(rafId)
    }
  }, [max])

  return ref
}
