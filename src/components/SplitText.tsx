interface Props {
  text: string
}

export function SplitText({ text }: Props) {
  return (
    <span className="split-text" aria-label={text}>
      {Array.from(text).map((char, i) => (
        <span key={`${char}-${i}`} className="split-char" aria-hidden="true">
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  )
}
