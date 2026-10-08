// Original stylized hollow mask (Bleach / Ichigo homage) that cracks onto the KR logo on
// hover and stays on in Bankai mode. Drawn from scratch: shaded bone-white face, red
// stripes broken by one eye, black eyes with yellow irises, an open jaw of teeth, cracks.

const TEETH = [13.3, 15.2, 17.1, 19, 20.9, 22.8, 24.7]

export function HollowMask() {
  return (
    <svg className="hollow-mask" viewBox="0 0 40 40" aria-hidden="true">
      <defs>
        <radialGradient id="hm-bone" cx="45%" cy="38%" r="70%">
          <stop offset="0" stopColor="#fdfbf6" />
          <stop offset="0.65" stopColor="#ece6da" />
          <stop offset="1" stopColor="#c9c1b2" />
        </radialGradient>
        <linearGradient id="hm-stripe" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff2a1f" />
          <stop offset="1" stopColor="#8f0000" />
        </linearGradient>
      </defs>

      {/* Face: wide brow, cheekbones, narrowing jaw */}
      <path
        fill="url(#hm-bone)"
        stroke="#8f877a"
        strokeWidth="0.45"
        d="M20 2.2C29.8 2.2 35.6 8.8 35.6 17.4C35.6 22.6 34 26.6 31.6 29.6C30.4 31.2 29.6 33.2 28.4 35.2C27.8 36.3 26.8 37 25.6 37H14.4C13.2 37 12.2 36.3 11.6 35.2C10.4 33.2 9.6 31.2 8.4 29.6C6 26.6 4.4 22.6 4.4 17.4C4.4 8.8 10.2 2.2 20 2.2Z"
      />

      {/* Shading: brow ridges, cheek hollows, centre line */}
      <g fill="none" stroke="#7d7568" strokeLinecap="round" opacity="0.55">
        <path strokeWidth="0.6" d="M7.6 12.8Q12.8 10.6 18.6 13.4" />
        <path strokeWidth="0.6" d="M32.4 12.8Q27.2 10.6 21.4 13.4" />
        <path strokeWidth="0.4" d="M9 23.4Q11.6 25.6 14.2 25.2" />
        <path strokeWidth="0.4" d="M31 23.4Q28.4 25.6 25.8 25.2" />
        <path strokeWidth="0.35" d="M20 5V11.5" opacity="0.6" />
      </g>

      {/* Red stripes on one side, interrupted by the eye */}
      <g fill="url(#hm-stripe)">
        <path d="M23.2 2.6L25.8 2.5L27.6 12.4L25.4 13Z" />
        <path d="M27.9 3.4L30.6 5L31.4 13.2L29.3 13.4Z" />
        <path d="M25.8 21.8L27.9 21.4L28.6 31.8L27 34.6L26.6 30Z" />
        <path d="M29.5 21.2L31.6 20.4L31.4 27.4L30 29.6Z" />
      </g>

      {/* Eyes: black, slanted, with yellow irises */}
      <g fill="#0a0a0a">
        <path d="M8.4 14.4Q13 15.2 17.8 16.8L16.9 20.2Q12.6 20.6 9.8 19.4Q8.6 17.4 8.4 14.4Z" />
        <path d="M31.6 14.4Q27 15.2 22.2 16.8L23.1 20.2Q27.4 20.6 30.2 19.4Q31.4 17.4 31.6 14.4Z" />
      </g>
      <g className="mask-irises">
        <circle cx="13.7" cy="18" r="1.3" fill="#ffd21f" />
        <circle cx="26.3" cy="18" r="1.3" fill="#ffd21f" />
        <circle cx="13.7" cy="18" r="0.55" fill="#0a0a0a" />
        <circle cx="26.3" cy="18" r="0.55" fill="#0a0a0a" />
      </g>

      {/* Nose slits */}
      <path fill="none" stroke="#5f584d" strokeWidth="0.55" strokeLinecap="round" d="M19 22.4L19.5 24.2M21 22.4L20.5 24.2" />

      {/* Open jaw with two rows of teeth */}
      <path fill="#0a0a0a" d="M12.2 27.2Q20 26.2 27.8 27.2L27.3 30.8Q20 31.8 12.7 30.8Z" />
      <g fill="url(#hm-bone)">
        {TEETH.map((x) => (
          <rect key={`t${x}`} x={x} y="27" width="1.5" height="1.75" rx="0.35" />
        ))}
        {TEETH.map((x) => (
          <rect key={`b${x}`} x={x + 0.1} y="29.2" width="1.4" height="1.6" rx="0.35" />
        ))}
      </g>

      {/* Cracks: drawn in when the mask lands */}
      <g className="mask-crack" fill="none" stroke="#3a3530" strokeLinecap="round" strokeLinejoin="round">
        <path pathLength="1" strokeWidth="0.5" d="M18.2 2.4L17 6.2L19.4 8.8L17.6 12.4L18.6 14.2" />
        <path pathLength="1" strokeWidth="0.35" d="M19.4 8.8L22 10.2L23.4 9.4" />
        <path pathLength="1" strokeWidth="0.35" d="M6.2 22.6L8.6 23.2L9.4 25.6" />
      </g>
    </svg>
  )
}
