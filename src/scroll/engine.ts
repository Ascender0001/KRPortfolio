// Scroll-scrubbed section animation.
//
// Each registered section gets its position at a *smoothed* scroll value — one that eases
// toward the real scroll position every frame — so animations tied to scroll stay fluid even
// with coarse mouse-wheel steps. Updates write straight to element styles inside
// requestAnimationFrame, so React never re-renders while scrolling.

import { useLayoutEffect, useRef } from 'react'
import { isReducedMotion } from '../motion'

export const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value))
/** Maps p from [start, end] onto [0, 1]. */
export const range = (p: number, start: number, end: number) => clamp((p - start) / (end - start))
export const easeOut = (t: number) => 1 - (1 - t) ** 3

export interface SceneFrame {
  /** Section top in viewport pixels, at the smoothed scroll position. */
  top: number
  /** 0→1 as the section slides up into the viewport. */
  enter: number
}

export type SceneUpdate = (frame: SceneFrame) => void

interface Scene {
  root: HTMLElement
  update: SceneUpdate
  lastTop: number
}

const scenes = new Set<Scene>()
// Touch scrolling already has native momentum; heavy smoothing there feels like lag.
const SMOOTHING = window.matchMedia('(pointer: coarse)').matches ? 0.3 : 0.12
let smoothY = 0
let frame = 0
let listening = false

function render(scene: Scene, lag: number) {
  const rect = scene.root.getBoundingClientRect()
  const vh = window.innerHeight
  const top = rect.top + lag
  // Skip sections well off screen; they were left in their final state on the way past.
  const near = top < vh * 1.3 && top + rect.height > -vh * 0.3
  if (top === scene.lastTop || (!near && !Number.isNaN(scene.lastTop))) return
  scene.lastTop = top
  scene.update({ top, enter: clamp(1 - top / vh) })
}

function tick() {
  frame = 0
  const target = window.scrollY
  smoothY += (target - smoothY) * SMOOTHING
  if (Math.abs(target - smoothY) < 0.5) smoothY = target
  const lag = target - smoothY
  scenes.forEach((scene) => render(scene, lag))
  if (smoothY !== target) frame = requestAnimationFrame(tick)
}

function schedule() {
  if (!frame) frame = requestAnimationFrame(tick)
}

function remeasure() {
  scenes.forEach((scene) => {
    scene.lastTop = Number.NaN
  })
  schedule()
}

/**
 * Registers a scroll-driven section in full-motion mode. `setup` runs once with the section
 * element (query and measure children there) and returns the per-frame update function.
 */
export function useScene<T extends HTMLElement>(setup: (root: T) => SceneUpdate) {
  const ref = useRef<T>(null)

  useLayoutEffect(() => {
    const root = ref.current
    if (!root || isReducedMotion()) return

    const scene: Scene = { root, update: setup(root), lastTop: Number.NaN }
    scenes.add(scene)

    if (!listening) {
      listening = true
      smoothY = window.scrollY
      window.addEventListener('scroll', schedule, { passive: true })
      window.addEventListener('resize', remeasure)
    }

    // Paint the correct frame before the browser shows anything.
    render(scene, window.scrollY - smoothY)
    return () => {
      scenes.delete(scene)
    }
    // setup is per-mount wiring; re-running it on every render is never wanted.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return ref
}
