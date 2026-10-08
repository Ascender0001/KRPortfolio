interface Props {
  text: string
}

// Purely visual: callers must provide the readable text separately (e.g. an .sr-only span).
export function SplitText({ text }: Props) {
  return (
    <span className="split-text" aria-hidden="true">
      {Array.from(text).map((char, i) => (
        <span key={`${char}-${i}`} className="split-char">
          {char === ' ' ? ' ' : char}
        </span>
      ))}
    </span>
  )
}
