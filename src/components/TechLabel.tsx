import type { ReactNode } from 'react'

export function TechLabel({ children, accent }: { children: ReactNode; accent?: boolean }) {
  return (
    <p className="tech-label">
      {accent && <span className="accent">// </span>}
      {children}
    </p>
  )
}
