import { useEffect, useRef } from 'react'
import type { ParticleField } from '../three/ParticleField'
import { isReducedMotion } from '../motion'

// One entry per section, in page order; index = the shape the field morphs into (see SHAPES).
// side: where the shape sits on wide screens (-1 left, 1 right) so it never covers the copy.
const SECTIONS = [
  { id: 'hero', side: 0.72, opacity: 1 },
  { id: 'about', side: 1, opacity: 0.95 },
  { id: 'skills', side: 0, opacity: 0.5 },
  { id: 'projects', side: 0, opacity: 0.45 },
  { id: 'contact', side: 0, opacity: 0.6 },
]

const lerp = (a: number, b: number, t: number) => a + (b - a) * t

type FieldClass = typeof ParticleField

/** Wires the field to scroll, resize and pointer. Returns a cleanup function. */
function run(canvas: HTMLCanvasElement, Field: FieldClass) {
  const narrow = () => window.innerWidth < 900
  let field: ParticleField
  try {
    field = new Field(canvas, narrow() ? 4500 : 9000)
  } catch {
    // No WebGL: the page works fine without the backdrop.
    canvas.hidden = true
    return () => {}
  }

  const sections = SECTIONS.map((s) => document.getElementById(s.id))

  // Each shape holds while its section is on screen; the morph into the next shape plays while
  // that next section scrolls from the bottom of the viewport up to about a quarter from the top.
  const update = () => {
    const vh = window.innerHeight
    let progress = 0
    for (let k = 1; k < sections.length; k++) {
      const top = sections[k]?.getBoundingClientRect().top ?? Infinity
      progress += Math.min(1, Math.max(0, (vh * 0.9 - top) / (vh * 0.65)))
    }

    const i = Math.min(SECTIONS.length - 1, Math.floor(progress))
    const j = Math.min(SECTIONS.length - 1, i + 1)
    const t = progress - i
    const halfWidth = Math.tan((45 / 2) * (Math.PI / 180)) * 7.5 * (window.innerWidth / window.innerHeight)
    const sideScale = narrow() ? 0 : halfWidth * 0.48

    field.setTarget({
      progress,
      offsetX: lerp(SECTIONS[i].side, SECTIONS[j].side, t) * sideScale,
      opacity: lerp(SECTIONS[i].opacity, SECTIONS[j].opacity, t) * (narrow() ? 0.55 : 1),
    })
  }

  const onResize = () => {
    field.resize()
    update()
  }

  const onPointer = (event: PointerEvent) => {
    field.setPointer(event.clientX / window.innerWidth - 0.5, event.clientY / window.innerHeight - 0.5)
  }

  update()
  // Reduced motion still follows the scroll from shape to shape, just calmly (see play()).
  field.play({ gentle: isReducedMotion() })
  window.addEventListener('scroll', update, { passive: true })
  window.addEventListener('resize', onResize)
  window.addEventListener('pointermove', onPointer, { passive: true })
  return () => {
    window.removeEventListener('scroll', update)
    window.removeEventListener('resize', onResize)
    window.removeEventListener('pointermove', onPointer)
    field.dispose()
  }
}

export function Background3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // three.js is loaded on demand so the page itself paints first; the field fades in after.
    let cleanup: (() => void) | undefined
    let cancelled = false
    import('../three/ParticleField')
      .then(({ ParticleField: Field }) => {
        if (!cancelled) cleanup = run(canvas, Field)
      })
      .catch(() => {
        canvas.hidden = true
      })

    return () => {
      cancelled = true
      cleanup?.()
    }
  }, [])

  return <canvas className="bg3d" ref={canvasRef} aria-hidden="true" />
}
