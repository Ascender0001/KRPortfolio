import { useEffect, useRef } from 'react'
import { isBankai, onBankai } from '../bankai'
import { isReducedMotion } from '../motion'

// Spiritual-pressure ("reiatsu") aura in black and red: dark smoke and red embers rise from
// the cursor and flare up when the page is scrolled fast. In Bankai mode it burns harder, and
// the transformation sends a wall of it up from the bottom of the screen.

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  max: number
  size: number
  seed: number
  kind: 'ember' | 'core' | 'smoke'
}

// Kept modest: every particle is a sprite draw, and the burst must not stall the frame.
const MAX_PARTICLES = 320

function sprite(inner: string, outer: string) {
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  gradient.addColorStop(0, inner)
  gradient.addColorStop(0.35, outer)
  gradient.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
  return canvas
}

export function Reiatsu() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const gentle = isReducedMotion()
    const finePointer = window.matchMedia('(pointer: fine)').matches
    const sprites = {
      ember: sprite('rgba(255,40,25,1)', 'rgba(200,0,0,0.55)'),
      core: sprite('rgba(255,70,45,1)', 'rgba(255,20,10,0.6)'),
      smoke: sprite('rgba(0,0,0,0.95)', 'rgba(30,0,0,0.6)'),
    }
    const particles: Particle[] = []
    let width = 0
    let height = 0
    let frame = 0
    let burstUntil = 0
    let moves = 0
    let pointer: { x: number; y: number } | null = null
    let lastScroll = window.scrollY

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio, 1.25)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * ratio
      canvas.height = height * ratio
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
    }

    const spawn = (x: number, y: number, count: number, spread: number, lift: number, scale = 1) => {
      const bankai = isBankai()
      for (let i = 0; i < count && particles.length < MAX_PARTICLES; i++) {
        const roll = Math.random()
        particles.push({
          x: x + (Math.random() - 0.5) * spread,
          y: y + (Math.random() - 0.5) * spread * 0.4,
          vx: (Math.random() - 0.5) * 0.7,
          vy: -(0.5 + Math.random() * 1.4) * lift,
          life: 0,
          max: 34 + Math.random() * 40,
          size: (3 + Math.random() * 6) * scale * (bankai ? 1.35 : 1),
          seed: Math.random() * 10,
          kind: roll < (bankai ? 0.5 : 0.4) ? 'smoke' : roll > 0.88 ? 'core' : 'ember',
        })
      }
      if (!frame) frame = requestAnimationFrame(draw)
    }

    const draw = () => {
      frame = 0
      ctx.clearRect(0, 0, width, height)

      if (performance.now() < burstUntil) {
        for (let i = 0; i < (gentle ? 2 : 5); i++) {
          spawn(Math.random() * width, height + 20, 1, 30, 6 + Math.random() * 7, 1.5)
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.life++
        if (p.life >= p.max) {
          particles.splice(i, 1)
          continue
        }
        p.x += p.vx + Math.sin(p.life * 0.14 + p.seed) * 0.45
        p.y += p.vy
        p.vy *= 0.985
      }

      // Smoke darkens first, then embers glow additively on top.
      for (const pass of ['smoke', 'glow'] as const) {
        ctx.globalCompositeOperation = pass === 'smoke' ? 'source-over' : 'lighter'
        for (const p of particles) {
          if ((p.kind === 'smoke') !== (pass === 'smoke')) continue
          const t = p.life / p.max
          const size = p.size * (pass === 'smoke' ? 1.8 + t : 1 - t * 0.6)
          ctx.globalAlpha = Math.min(1, (1 - t) * 1.4) * (pass === 'smoke' ? 0.55 : 0.9)
          ctx.drawImage(sprites[p.kind], p.x - size, p.y - size, size * 2, size * 2)
        }
      }
      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = 'source-over'

      if (particles.length || performance.now() < burstUntil) frame = requestAnimationFrame(draw)
    }

    const onPointer = (event: PointerEvent) => {
      pointer = { x: event.clientX, y: event.clientY }
      moves++
      if (gentle && moves % 3) return
      spawn(event.clientX, event.clientY, isBankai() ? 3 : 1, 10, 1)
    }

    // Scrolling fast flares the aura around the cursor, like a surge of spiritual pressure.
    const onScroll = () => {
      const delta = Math.abs(window.scrollY - lastScroll)
      lastScroll = window.scrollY
      if (gentle || !pointer || delta < 35) return
      spawn(pointer.x, pointer.y, Math.min(14, Math.round(delta / 22)) * (isBankai() ? 2 : 1), 34, 2.2, 1.3)
    }

    const offBankai = onBankai((on) => {
      if (on) {
        burstUntil = performance.now() + (gentle ? 800 : 1400)
        if (!frame) frame = requestAnimationFrame(draw)
      }
    })

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('scroll', onScroll, { passive: true })
    if (finePointer) window.addEventListener('pointermove', onPointer, { passive: true })
    return () => {
      offBankai()
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('pointermove', onPointer)
    }
  }, [])

  return <canvas className="reiatsu" ref={canvasRef} aria-hidden="true" />
}
