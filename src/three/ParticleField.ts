import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Group,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  WebGLRenderer,
} from 'three'
import { SHAPES, colors, scatter, seeds, sword } from './shapes'

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uProgress;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uOpacity;
  uniform float uScatter;
  uniform float uTwinkle;
  uniform float uSword;
  uniform float uBankai;

  attribute vec3 aShape1;
  attribute vec3 aShape2;
  attribute vec3 aShape3;
  attribute vec3 aShape4;
  attribute vec3 aShape5;
  attribute vec3 aScatter;
  attribute vec3 aColor;
  attribute float aSeed;

  varying vec3 vColor;
  varying float vAlpha;

  float weight(float i) {
    return clamp(1.0 - abs(uProgress - i), 0.0, 1.0);
  }

  void main() {
    float w0 = weight(0.0);
    float w1 = weight(1.0);
    float w2 = weight(2.0);
    float w3 = weight(3.0);
    float w4 = weight(4.0);

    vec3 p = position * w0 + aShape1 * w1 + aShape2 * w2 + aShape3 * w3 + aShape4 * w4;

    // Each shape keeps a little life of its own.
    p += normalize(position + 1e-4) * sin(uTime * 0.9 + aSeed * 6.2831) * 0.07 * w0;
    p.y += sin(aShape1.x * 1.4 + uTime * 1.3) * cos(aShape1.z * 0.8 + uTime * 0.7) * 0.32 * w1;
    p += normalize(aShape4 + 1e-4) * sin(uTime * 2.0 + atan(aShape4.y, aShape4.x) * 6.0) * 0.06 * w4;

    // Burst apart halfway between two shapes, re-form on arrival.
    float between = 4.0 * max(max(w0 * w1, w1 * w2), max(w2 * w3, w3 * w4));
    p += aScatter * between * 1.7 * uScatter;

    // Bankai: the cloud re-forms as the sword, bursting on the way in and out.
    float forming = 4.0 * uSword * (1.0 - uSword);
    p = mix(p, aShape5, uSword) + aScatter * forming * 1.4;

    // Gentle drift so the cloud never sits perfectly still.
    p += vec3(
      sin(uTime * 0.6 + aSeed * 21.0),
      cos(uTime * 0.5 + aSeed * 13.0),
      sin(uTime * 0.4 + aSeed * 7.0)
    ) * 0.035;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uPixelRatio * (0.55 + aSeed * 0.9) * (1.0 + between * 0.6 * uScatter) * (1.0 + uBankai * 0.15) / -mv.z;

    vColor = aColor;
    float twinkle = mix(0.85, 0.65 + 0.35 * sin(uTime * 1.7 + aSeed * 40.0), uTwinkle);
    vAlpha = uOpacity * twinkle * (1.0 + uBankai * 0.3);
  }
`

const fragmentShader = /* glsl */ `
  uniform float uBankai;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float glow = smoothstep(0.5, 0.0, d);
    // Bankai: every particle turns into a black core with a red rim.
    float core = smoothstep(0.3, 0.05, d) * uBankai;
    vec3 color = mix(vColor, vec3(1.0, 0.07, 0.03), uBankai * 0.6) * (1.0 - core);
    gl_FragColor = vec4(color, glow * glow * vAlpha);
  }
`

interface Target {
  progress: number
  offsetX: number
  opacity: number
}

const approach = (from: number, to: number, rate: number) => from + (to - from) * rate

/**
 * Full-screen particle cloud that morphs between SHAPES as `progress` moves from 0 to 4.
 * The page sets targets; the field eases toward them every frame so motion stays fluid.
 */
export class ParticleField {
  private renderer: WebGLRenderer
  private scene = new Scene()
  private camera = new PerspectiveCamera(45, 1, 0.1, 100)
  private group = new Group()
  private material: ShaderMaterial
  private geometry = new BufferGeometry()
  private frame = 0
  private start = performance.now()
  private target: Target = { progress: 0, offsetX: 0, opacity: 1 }
  private current: Target = { progress: 0, offsetX: 0, opacity: 0 }
  private pointer = { x: 0, y: 0, sx: 0, sy: 0 }
  private bankai = { on: false, level: 0, sword: 0, pulseUntil: 0 }

  private canvas: HTMLCanvasElement

  constructor(canvas: HTMLCanvasElement, count: number) {
    this.canvas = canvas
    this.renderer = new WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: 'high-performance' })
    this.renderer.setClearColor(0x000000, 0)

    const shapes = SHAPES.map((shape) => shape(count))
    this.geometry.setAttribute('position', new BufferAttribute(shapes[0], 3))
    shapes.slice(1).forEach((shape, i) => this.geometry.setAttribute(`aShape${i + 1}`, new BufferAttribute(shape, 3)))
    this.geometry.setAttribute('aShape5', new BufferAttribute(sword(count), 3))
    this.geometry.setAttribute('aScatter', new BufferAttribute(scatter(count), 3))
    this.geometry.setAttribute('aColor', new BufferAttribute(colors(count), 3))
    this.geometry.setAttribute('aSeed', new BufferAttribute(seeds(count), 1))

    this.material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uProgress: { value: 0 },
        uSize: { value: 30 },
        uPixelRatio: { value: 1 },
        uOpacity: { value: 0 },
        uScatter: { value: 1 },
        uTwinkle: { value: 1 },
        uSword: { value: 0 },
        uBankai: { value: 0 },
      },
    })

    const points = new Points(this.geometry, this.material)
    points.frustumCulled = false
    this.group.add(points)
    this.scene.add(this.group)
    this.camera.position.set(0, 0, 7.5)

    this.resize()
  }

  setTarget(target: Target) {
    this.target = target
  }

  /** Bankai mode: black-and-red particles; the sword replaces the last shape. */
  setBankai(on: boolean) {
    this.bankai.on = on
  }

  /** Form the sword for a moment (during the transformation), wherever the page is. */
  pulseSword(ms: number) {
    this.bankai.pulseUntil = performance.now() + ms
  }

  setPointer(x: number, y: number) {
    this.pointer.x = x
    this.pointer.y = y
  }

  resize() {
    const width = this.canvas.clientWidth
    const height = this.canvas.clientHeight
    const ratio = Math.min(window.devicePixelRatio, 1.75)
    this.renderer.setPixelRatio(ratio)
    this.renderer.setSize(width, height, false)
    this.camera.aspect = width / Math.max(1, height)
    this.camera.updateProjectionMatrix()
    this.material.uniforms.uPixelRatio.value = ratio
  }

  /**
   * Eases toward the target every frame and keeps the cloud alive.
   * gentle (reduced motion): shapes still change with scroll, but slowly and without the
   * burst between shapes, twinkling, or pointer tilt.
   */
  play({ gentle = false } = {}) {
    const u = this.material.uniforms
    u.uScatter.value = gentle ? 0 : 1
    u.uTwinkle.value = gentle ? 0 : 1
    const rate = gentle ? 0.04 : 0.06
    const timeScale = gentle ? 0.35 : 1
    const pointerScale = gentle ? 0 : 1
    const loop = () => {
      this.frame = requestAnimationFrame(loop)
      this.step(rate, timeScale, pointerScale)
    }
    loop()
  }

  private step(rate: number, timeScale: number, pointerScale: number) {
    const time = ((performance.now() - this.start) / 1000) * timeScale
    const c = this.current
    c.progress = approach(c.progress, this.target.progress, rate)
    c.offsetX = approach(c.offsetX, this.target.offsetX, rate)
    c.opacity = approach(c.opacity, this.target.opacity, rate * 0.6)
    this.pointer.sx = approach(this.pointer.sx, this.pointer.x * pointerScale, 0.05)
    this.pointer.sy = approach(this.pointer.sy, this.pointer.y * pointerScale, 0.05)

    const b = this.bankai
    const pulsing = performance.now() < b.pulseUntil
    const swordTarget = Math.max(pulsing ? 1 : 0, b.on ? Math.min(1, Math.max(0, (c.progress - 3.3) / 0.7)) : 0)
    b.sword = approach(b.sword, swordTarget, pulsing ? 0.08 : rate)
    b.level = approach(b.level, b.on ? 1 : 0, 0.05)

    const u = this.material.uniforms
    u.uTime.value = time
    u.uProgress.value = c.progress
    u.uOpacity.value = c.opacity
    u.uSword.value = b.sword
    u.uBankai.value = b.level

    this.group.position.x = c.offsetX
    // The sword faces the viewer and only sways; everything else keeps turning.
    const spin = time * 0.09 * (1 + b.level) + c.progress * 1.1 + this.pointer.sx * 0.35
    this.group.rotation.y = spin * (1 - b.sword) + Math.sin(time * 0.6) * 0.3 * b.sword
    this.group.rotation.x = Math.sin(time * 0.15) * 0.12 + this.pointer.sy * 0.25

    this.renderer.render(this.scene, this.camera)
  }

  dispose() {
    cancelAnimationFrame(this.frame)
    this.geometry.dispose()
    this.material.dispose()
    this.renderer.dispose()
  }
}
