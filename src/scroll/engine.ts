// Scroll-scrubbed scenes: the whole page plays as one continuous animation driven by scroll.
//
// A scene is a tall <section class="scene"> holding a sticky .scene-stage. Each scene gets:
//   enter — 0→1 while the section slides up into the viewport (before it pins)
//   p     — 0→1 while the stage is pinned and the page keeps scrolling
// and the engine itself handles the exit: once the stage unpins, it drifts back and dims while
// the next section slides over it, so one scene hands off to the next without a cut.
//
// Progress is computed from a smoothed scroll position that eases toward the real one, which
// keeps motion fluid even with coarse mouse-wheel steps.
//
// When a stage is not pinned (.scene--pin-wide on small screens) p instead runs while the
// section's top travels through the viewport, so the same update code still plays.
//
// All writes go straight to element styles inside requestAnimationFrame, so React never
// re-renders while scrolling.

import { useLayoutEffect, useRef } from 'react'
import { isReducedMotion } from '../motion'

export const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value))
/** Maps p from [start, end] onto [0, 1]. */
export const range = (p: number, start: number, end: number) => clamp((p - start) / (end - start))
export const lerp = (from: number, to: number, t: number) => from + (to - from) * t
export const easeOut = (t: number) => 1 - (1 - t) ** 3
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2)

export interface SceneFrame {
  /** 0→1 while pinned (or while scrolling into view when unpinned). */
  p: number
  /** 0→1 as the section slides up into the viewport. */
  enter: number
  pinned: boolean
}

export type SceneUpdate = (frame: SceneFrame) => void

interface Scene {
  root: HTMLElement
  stage: HTMLElement | null
  pinned: boolean
  update: SceneUpdate
  lastP: number
  lastEnter: number
  lastLeave: number
}

const scenes = new Set<Scene>()
const SMOOTHING = 0.14
let smoothY = 0
let frame = 0
let listening = false

const isPinned = (stage: HTMLElement | null) =>
  Boolean(stage) && getComputedStyle(stage!).position === 'sticky'

function render(scene: Scene, lag: number) {
  const rect = scene.root.getBoundingClientRect()
  const vh = window.innerHeight
  // Where the section would be at the smoothed scroll position.
  const top = rect.top + lag

  const enter = clamp(1 - top / vh)
  let p: number
  if (scene.pinned) {
    const distance = rect.height - vh
    p = distance > 0 ? clamp(-top / distance) : top <= 0 ? 1 : 0
  } else {
    p = clamp((vh * 0.85 - top) / (vh * 0.7))
  }

  if (p !== scene.lastP || enter !== scene.lastEnter) {
    scene.lastP = p
    scene.lastEnter = enter
    scene.update({ p, enter, pinned: scene.pinned })
  }

  // Exit: after unpinning, the stage lags behind the scroll and dims under the next section.
  // Uses the real position so the stage never visibly detaches from its section.
  if (scene.stage && scene.pinned) {
    const leave = clamp((vh - rect.bottom) / vh)
    if (leave !== scene.lastLeave) {
      scene.lastLeave = leave
      const eased = easeOut(leave)
      scene.stage.style.transform = leave
        ? `translate3d(0, ${eased * vh * 0.45}px, 0) scale(${1 - eased * 0.08})`
        : ''
      scene.stage.style.opacity = leave ? String(1 - eased * 0.75) : ''
    }
  }
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
    scene.pinned = isPinned(scene.stage)
    scene.lastP = scene.lastEnter = scene.lastLeave = -1
    if (scene.stage && !scene.pinned) {
      scene.stage.style.transform = ''
      scene.stage.style.opacity = ''
    }
  })
  schedule()
}

/** Returns a scrubber for a scene's .section-heading: rises in, then its red rule draws out. */
export function headingScrubber(root: HTMLElement) {
  const heading = root.querySelector<HTMLElement>('.section-heading')
  const line = root.querySelector<HTMLElement>('.heading-line')
  return (t: number) => {
    if (!heading) return
    const rise = easeOut(range(t, 0, 0.75))
    heading.style.opacity = String(rise)
    heading.style.transform = `translateY(${(1 - rise) * 70}px)`
    if (line) line.style.transform = `scaleX(${easeOut(range(t, 0.4, 1))})`
  }
}

/**
 * Registers a scroll scene in full-motion mode. `setup` runs once with the section element
 * (query and cache children there) and returns the per-frame update function.
 */
export function useScene<T extends HTMLElement>(setup: (root: T) => SceneUpdate) {
  const ref = useRef<T>(null)

  useLayoutEffect(() => {
    const root = ref.current
    if (!root || isReducedMotion()) return

    const stage = root.querySelector<HTMLElement>(':scope > .scene-stage')
    const scene: Scene = {
      root,
      stage,
      pinned: isPinned(stage),
      update: setup(root),
      lastP: -1,
      lastEnter: -1,
      lastLeave: -1,
    }
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
    // setup is per-mount scene wiring; re-running it on every render is never wanted.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return ref
}
