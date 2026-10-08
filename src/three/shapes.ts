// Point clouds the particle field morphs between, one per page section.
// Every generator returns `count` xyz triples so any two shapes can be blended point by point.

// Deterministic PRNG so the field looks the same on every load.
function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

type Generator = (i: number, count: number, rand: () => number) => [number, number, number]

function build(count: number, seed: number, generate: Generator) {
  const rand = mulberry32(seed)
  const out = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const [x, y, z] = generate(i, count, rand)
    out[i * 3] = x
    out[i * 3 + 1] = y
    out[i * 3 + 2] = z
  }
  return out
}

/** Hero: an evenly spread sphere (Fibonacci lattice). */
export const sphere = (count: number) =>
  build(count, 1, (i, n, rand) => {
    const y = 1 - (i / (n - 1)) * 2
    const radius = Math.sqrt(1 - y * y)
    const theta = i * Math.PI * (3 - Math.sqrt(5))
    const r = 2.1 * (0.97 + rand() * 0.06)
    return [Math.cos(theta) * radius * r, y * r, Math.sin(theta) * radius * r]
  })

/** About: a rippling sheet, tilted toward the camera. */
export const wave = (count: number) =>
  build(count, 2, (i, n, rand) => {
    const side = Math.ceil(Math.sqrt(n))
    const x = ((i % side) / side - 0.5) * 7 + (rand() - 0.5) * 0.04
    const z = (Math.floor(i / side) / side - 0.5) * 7 + (rand() - 0.5) * 0.04
    const y = Math.sin(x * 1.1) * Math.cos(z * 0.9) * 0.45
    // Tilt ~55° around X so the sheet faces the viewer.
    const tilt = 0.95
    return [x, y * Math.cos(tilt) - z * Math.sin(tilt), y * Math.sin(tilt) + z * Math.cos(tilt)]
  })

/** Skills: a cube whose faces are traced with lattice lines. */
export const lattice = (count: number) =>
  build(count, 3, (_i, _n, rand) => {
    const half = 1.55
    const step = (half * 2) / 4
    const face = Math.floor(rand() * 6)
    let u = (rand() * 2 - 1) * half
    let v = (rand() * 2 - 1) * half
    // Snap most points onto grid lines so the faces read as a lattice.
    if (rand() < 0.75) {
      if (rand() < 0.5) u = Math.round(u / step) * step
      else v = Math.round(v / step) * step
    }
    const s = face % 2 === 0 ? half : -half
    if (face < 2) return [s, u, v]
    if (face < 4) return [u, s, v]
    return [u, v, s]
  })

/** Projects: a double helix with rungs — things being built. */
export const helix = (count: number) =>
  build(count, 4, (_i, _n, rand) => {
    const turns = 2.4
    const height = 5.4
    const radius = 1.15
    const jitter = () => (rand() - 0.5) * 0.08
    if (rand() < 0.22) {
      // Rung between the two strands.
      const t = Math.round(rand() * 26) / 26
      const a = t * turns * Math.PI * 2
      const k = rand() * 2 - 1
      return [Math.cos(a) * radius * k + jitter(), (t - 0.5) * height, Math.sin(a) * radius * k + jitter()]
    }
    const t = rand()
    const a = t * turns * Math.PI * 2 + (rand() < 0.5 ? 0 : Math.PI)
    return [Math.cos(a) * radius + jitter(), (t - 0.5) * height + jitter(), Math.sin(a) * radius + jitter()]
  })

/** Contact: a ring facing the viewer, like a portal. */
export const ring = (count: number) =>
  build(count, 5, (_i, _n, rand) => {
    const u = rand() * Math.PI * 2
    const v = rand() * Math.PI * 2
    const major = 2.1
    const minor = 0.32 * Math.sqrt(rand())
    return [
      (major + minor * Math.cos(v)) * Math.cos(u),
      (major + minor * Math.cos(v)) * Math.sin(u),
      minor * Math.sin(v),
    ]
  })

export const SHAPES = [sphere, wave, lattice, helix, ring]

/** Random outward directions used to burst the cloud apart mid-morph. */
export const scatter = (count: number) =>
  build(count, 6, (_i, _n, rand) => {
    const theta = rand() * Math.PI * 2
    const y = rand() * 2 - 1
    const r = Math.sqrt(1 - y * y)
    const len = 0.6 + rand() * 1.6
    return [Math.cos(theta) * r * len, y * len, Math.sin(theta) * r * len]
  })

/** Per-particle colour: mostly signature red, some hot orange-red, a few near-white sparks. */
export function colors(count: number) {
  const rand = mulberry32(7)
  const out = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const roll = rand()
    const [r, g, b] = roll < 0.12 ? [1, 0.92, 0.9] : roll < 0.4 ? [1, 0.3, 0.18] : [0.9, 0.04, 0.02]
    out.set([r, g, b], i * 3)
  }
  return out
}

export function seeds(count: number) {
  const rand = mulberry32(8)
  return Float32Array.from({ length: count }, () => rand())
}
