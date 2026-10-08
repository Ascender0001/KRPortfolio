// Small broad-bladed sword (Tensa Zangetsu homage) that slashes onto the KR logo on hover
// and stays on in Bankai mode. Drawn upright, then turned 45° to sit diagonally.
export function LogoSword() {
  return (
    <svg className="logo-sword" viewBox="0 0 40 40" aria-hidden="true">
      <defs>
        <linearGradient id="ls-blade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#050505" />
          <stop offset="0.55" stopColor="#1c1c1c" />
          <stop offset="1" stopColor="#3a3a3a" />
        </linearGradient>
        <filter id="ls-glow" x="-1" y="-1" width="3" height="3">
          <feGaussianBlur stdDeviation="0.7" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g transform="rotate(45 20 20) translate(20 20) scale(0.8) translate(-20 -20)">
        {/* Chain swinging from the pommel */}
        <g fill="none" stroke="#8a8a8a" strokeWidth="0.45">
          <ellipse cx="20" cy="37.4" rx="0.55" ry="0.8" />
          <ellipse cx="20.6" cy="38.9" rx="0.8" ry="0.5" />
          <ellipse cx="21.6" cy="40.1" rx="0.55" ry="0.8" />
        </g>

        {/* Handle with criss-cross wrap */}
        <rect x="18.7" y="29.4" width="2.6" height="7.4" rx="0.5" fill="#141414" />
        <path
          fill="none"
          stroke="#c40000"
          strokeWidth="0.5"
          d="M18.8 30.4L21.2 32M21.2 30.4L18.8 32M18.8 32.6L21.2 34.2M21.2 32.6L18.8 34.2M18.8 34.8L21.2 36.4M21.2 34.8L18.8 36.4"
        />

        {/* Round guard */}
        <ellipse cx="20" cy="28.9" rx="3.8" ry="1.25" fill="#222" stroke="#777" strokeWidth="0.3" />

        {/* Broad black blade with an angled tip and a glowing red edge */}
        <path fill="url(#ls-blade)" d="M17.2 28.1V7.4L22.8 2.6V28.1Z" />
        <path fill="none" stroke="#ff2a1f" strokeWidth="0.55" filter="url(#ls-glow)" d="M22.8 28.1V2.6L17.2 7.4" />
        <path fill="none" stroke="#000" strokeWidth="0.35" opacity="0.7" d="M19.4 27.4V9.4" />
      </g>
    </svg>
  )
}
