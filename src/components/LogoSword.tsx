// Simple sword (Tensa Zangetsu homage) that slashes onto the KR logo on hover and stays on
// in Bankai mode: a solid red blade, guard and handle. Drawn upright, then
// turned 45° to sit diagonally.
export function LogoSword() {
  return (
    <svg className="logo-sword" viewBox="0 0 40 40" aria-hidden="true">
      <g transform="rotate(45 20 20)">
        <path fill="#ff2a1f" d="M17.6 27V8L22.4 4V27Z" />
        <rect x="15.4" y="27" width="9.2" height="1.8" rx="0.9" fill="#ff2a1f" />
        <rect x="18.9" y="28.8" width="2.2" height="6.4" rx="1" fill="#ff2a1f" />
      </g>
    </svg>
  )
}
