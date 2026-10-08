import type { CSSProperties } from 'react'
import { useReveal } from '../hooks/useReveal'
import { easeOut, headingScrubber, range, useScene } from '../scroll/engine'
import { SectionHeading } from './SectionHeading'
import { channels, contactSection, cvUrl } from '../data/portfolio'
import type { Channel } from '../data/portfolio'

function ChannelRow({ channel, index }: { channel: Channel; index: number }) {
  const ref = useReveal<HTMLAnchorElement>({ delay: 200 + index * 90, when: 'reduced' })

  return (
    <a className="channel" href={channel.href} ref={ref}>
      <span className="channel-label">
        {channel.id} // {channel.label}
      </span>
      <span className="channel-arrow" aria-hidden="true">
        ↗
      </span>
      <span className="channel-value">{channel.value}</span>
    </a>
  )
}

export function Contact() {
  // Scroll: heading rises in, the message slides from the left and the channel panel from the
  // right, its rows following one after another.
  const sceneRef = useScene<HTMLElement>((root) => {
    const heading = headingScrubber(root)
    const intro = root.querySelector<HTMLElement>('.contact-intro')!
    const panel = root.querySelector<HTMLElement>('.comm-panel')!
    const rows = Array.from(root.querySelectorAll<HTMLElement>('.channel'))

    return ({ p, enter }) => {
      // One timeline across both phases: 0→1 sliding in, 1→2 pinned.
      const c = enter + p
      heading(range(c, 0.2, 0.9))

      const introIn = easeOut(range(c, 0.45, 1.1))
      intro.style.opacity = String(introIn)
      intro.style.transform = `translateX(${(1 - introIn) * -80}px)`

      const panelIn = easeOut(range(c, 0.55, 1.2))
      panel.style.opacity = String(panelIn)
      panel.style.transform = `translateX(${(1 - panelIn) * 80}px)`

      rows.forEach((row, i) => {
        const t = easeOut(range(c, 0.75 + i * 0.12, 1.05 + i * 0.12))
        row.style.opacity = String(t)
        row.style.transform = `translateY(${(1 - t) * 24}px)`
      })
    }
  })

  const introRef = useReveal<HTMLDivElement>({ when: 'reduced' })
  const panelRef = useReveal<HTMLElement>({ delay: 120, when: 'reduced' })
  const cvRef = useReveal<HTMLAnchorElement>({ delay: 380, when: 'reduced' })

  return (
    <section
      className="scene scene--pin-wide scene-finale"
      id="contact"
      style={{ '--scene-length': '160vh' } as CSSProperties}
      ref={sceneRef}
    >
      <div className="scene-stage">
        <div className="scene-inner finale">
          <SectionHeading
            index={contactSection.index}
            eyebrow={contactSection.eyebrow}
            heading={contactSection.heading}
          />

          <div className="contact-grid">
            <div className="contact-intro" ref={introRef}>
              <p className="tech-label">
                <span className="accent">// </span>
                {contactSection.ctaEyebrow}
              </p>
              <h3 className="contact-title">{contactSection.ctaTitle}</h3>
              <p className="contact-text">{contactSection.ctaText}</p>

              <p className="contact-status">
                <i className="status-dot" aria-hidden="true" />
                {contactSection.statusLabel}
              </p>

              <div className="contact-actions">
                <a className="btn btn-solid" href={channels[0].href}>
                  <span className="btn-mark" aria-hidden="true" />
                  Üzenet küldése
                </a>
                <a className="btn" href={channels[1].href}>
                  Hívás indítása
                </a>
              </div>
            </div>

            <aside className="comm-panel panel-corner" ref={panelRef}>
              <div className="file-head">
                <p className="tech-label">
                  <span className="accent">{contactSection.panelId}</span>
                </p>
                <i className="tech-line" />
                <p className="tech-label">{contactSection.panelLabel.toUpperCase()}</p>
              </div>

              {channels.map((channel, i) => (
                <ChannelRow key={channel.id} channel={channel} index={i} />
              ))}

              <a className="channel channel-cv" href={cvUrl} download ref={cvRef}>
                <span className="channel-label">
                  {contactSection.cvChannel.id} // {contactSection.cvChannel.label}
                </span>
                <span className="channel-arrow" aria-hidden="true">
                  ↓
                </span>
                <span className="channel-value">{contactSection.cvChannel.value}</span>
              </a>
            </aside>
          </div>
        </div>
      </div>
    </section>
  )
}
