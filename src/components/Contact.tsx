import { useReveal } from '../hooks/useReveal'
import { SectionHeading } from './SectionHeading'
import { channels, contactSection, cvUrl } from '../data/portfolio'
import type { Channel } from '../data/portfolio'

function ChannelRow({ channel, index }: { channel: Channel; index: number }) {
  const ref = useReveal<HTMLAnchorElement>({ delay: 200 + index * 90 })

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
  const introRef = useReveal<HTMLDivElement>()
  const panelRef = useReveal<HTMLElement>({ delay: 120 })
  const cvRef = useReveal<HTMLAnchorElement>({ delay: 380 })

  return (
    <section className="section" id="contact">
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

          <a
            className="channel channel-cv"
            href={cvUrl}
            download
            ref={cvRef}
          >
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
    </section>
  )
}
