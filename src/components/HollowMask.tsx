// Original stylized hollow mask (Bleach / Ichigo homage) that cracks onto the KR logo on
// hover and stays on in Bankai mode. Drawn from scratch in a grunge style: half a bone-white
// face that splinters into splatter on the left, red claw stripes sweeping over the brow,
// one black eye with a glowing yellow iris, and a jagged row of teeth.

// Mouth runs along two slightly slanted lines; teeth are triangles hanging off each.
const upper = (x: number) => 28.9 - (x - 15.4) * 0.1
const lower = (x: number) => 33.3 - (x - 16.6) * 0.1
const UPPER_TEETH = Array.from({ length: 8 }, (_, i) => 15.6 + i * 1.95)
const LOWER_TEETH = Array.from({ length: 7 }, (_, i) => 16.9 + i * 1.95)

// Splatter where the face breaks apart: [x, y, r, opacity].
const SPLATTER: [number, number, number, number][] = [
  [11.4, 5.6, 0.55, 0.9],
  [8.6, 9.4, 0.75, 0.85],
  [6.4, 12.8, 0.4, 0.7],
  [9.2, 14.6, 0.35, 0.8],
  [6.9, 18.2, 0.9, 0.75],
  [4.8, 21.6, 0.35, 0.6],
  [8.4, 22.8, 0.5, 0.8],
  [6.2, 26.4, 0.45, 0.65],
  [9.6, 27.8, 0.7, 0.8],
  [7.4, 30.6, 0.3, 0.6],
  [10.8, 32.4, 0.45, 0.75],
  [12.6, 35.8, 0.4, 0.7],
  [4.2, 16.2, 0.25, 0.5],
  [5.6, 29.4, 0.2, 0.5],
]

// Grit on the bone.
const SPECKS: [number, number, number][] = [
  [21.4, 25.6, 0.22],
  [30.4, 24.6, 0.18],
  [25.2, 7.4, 0.16],
  [33.2, 15.2, 0.2],
  [18.6, 22.2, 0.18],
  [27.6, 33.8, 0.2],
  [15.8, 15.4, 0.16],
]

export function HollowMask() {
  return (
    <svg className="hollow-mask" viewBox="0 0 40 40" aria-hidden="true">
      <defs>
        <linearGradient id="hm-bone" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#5d5953" />
          <stop offset="0.38" stopColor="#d9d3c7" />
          <stop offset="0.7" stopColor="#f6f3ec" />
          <stop offset="1" stopColor="#e2dccf" />
        </linearGradient>
        <linearGradient id="hm-stripe" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff2a1f" />
          <stop offset="1" stopColor="#9a0000" />
        </linearGradient>
        <filter id="hm-glow" x="-1" y="-1" width="3" height="3">
          <feGaussianBlur stdDeviation="0.8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Face: solid on the right, ragged and splintering on the left */}
      <path
        fill="url(#hm-bone)"
        d="M17.2 2.8C24.4 2.2 31.2 4.6 34.6 10.4C36.8 14.2 36.8 19.6 35.6 23.6C34.6 27 32.8 29.8 30.6 32.6C28.6 35.2 26 37.4 22.4 37.9C20.2 38.2 17.8 37.9 16.4 37.2L15.1 35.4L15.9 33.6L13.8 32.2L14.9 30.4L12.4 28.6L13.6 26.4L11.2 24.8L12.6 22.6L10.4 20.6L12.2 18.6L9.8 16.4L12.1 14.6L10.6 12.2L12.9 10.6L11.9 8.2L14.4 7.1L13.9 4.6Z"
      />
      <g fill="#d9d4ca">
        {SPLATTER.map(([x, y, r, o]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={r} opacity={o} />
        ))}
      </g>

      {/* Red claw stripes sweeping from the brow toward the eye */}
      <g fill="url(#hm-stripe)">
        <path d="M14.8 8Q21.8 11.2 24.6 18.6Q19.4 14.6 13.8 11.8Z" />
        <path d="M18 3.8Q24.4 7.2 27.2 14.6Q22 10.2 16.8 6.6Z" />
        <path d="M22.4 3Q28.2 6.2 30.4 13.4Q26 9.2 21.2 5.4Z" />
        <path d="M27 3.8Q31.8 6.8 33.6 12.6Q30 9.4 26 5.9Z" />
      </g>

      {/* Brow shadow and a faint hollow where the left eye breaks apart */}
      <path fill="none" stroke="#3b3732" strokeWidth="0.6" strokeLinecap="round" d="M21 16.2Q26.4 13.6 33 15.6" />
      <path fill="#2b2824" opacity="0.65" d="M11.8 18.8Q14.2 17.4 17.4 18.8Q15.2 20.6 12.6 20.1Z" />

      {/* The eye: black, slanted, glowing yellow iris with a slit pupil */}
      <path fill="#0a0a0a" d="M20.6 19.4Q25.6 15.4 32.2 17.2Q28 21.8 21.8 21.2Z" />
      <ellipse cx="27.2" cy="18.7" rx="2.7" ry="1.55" fill="#ffd21f" filter="url(#hm-glow)" />
      <ellipse cx="27.2" cy="18.7" rx="0.45" ry="1.3" fill="#0a0a0a" />

      {/* Jagged teeth */}
      <path fill="#0a0a0a" d={`M15.4 ${upper(15.4)}L31.6 ${upper(31.6)}L30.2 ${lower(30.2)}L16.6 ${lower(16.6)}Z`} />
      <g fill="#f1ede4">
        {UPPER_TEETH.map((x) => (
          <path key={`u${x}`} d={`M${x} ${upper(x) - 0.2}L${x + 1.95} ${upper(x + 1.95) - 0.2}L${x + 0.95} ${upper(x) + 2.5}Z`} />
        ))}
        {LOWER_TEETH.map((x) => (
          <path key={`l${x}`} d={`M${x} ${lower(x) + 0.2}L${x + 1.95} ${lower(x + 1.95) + 0.2}L${x + 1} ${lower(x) - 2.3}Z`} />
        ))}
      </g>

      {/* Grit */}
      <g fill="#3b3732" opacity="0.45">
        {SPECKS.map(([x, y, r]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={r} />
        ))}
      </g>

      {/* Cracks: drawn in when the mask lands */}
      <g className="mask-crack" fill="none" stroke="#2e2a26" strokeLinecap="round" strokeLinejoin="round">
        <path pathLength="1" strokeWidth="0.45" d="M34.8 21.6L32.4 22.8L33 25.4L30.8 26.6" />
        <path pathLength="1" strokeWidth="0.35" d="M24.4 24.4L22.8 25.6L23.6 27" />
      </g>
    </svg>
  )
}
