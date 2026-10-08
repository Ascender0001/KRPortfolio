import { channels, contactSection, cvUrl, navLinks } from '../data/portfolio'
import { useScrollReveal } from '../scroll/useScrollReveal'

export function Contact() {
  const sectionRef = useScrollReveal<HTMLElement>()
  const [email, phone] = channels
  // Let the address wrap after the @ on narrow screens instead of mid-word.
  const [emailUser, emailDomain] = email.value.split('@')

  return (
    <section className="section contact" id="contact" ref={sectionRef}>
      <div className="container contact-inner">
        <p className="eyebrow" data-reveal>
          {navLinks[3].index} — {navLinks[3].label}
        </p>
        <h2 className="contact-title" data-reveal>
          {contactSection.ctaTitle}
        </h2>
        <p className="contact-text" data-reveal>
          {contactSection.ctaText}
        </p>

        <a className="contact-email" href={email.href} data-reveal>
          {emailUser}@<wbr />
          {emailDomain}
        </a>

        <div className="contact-links" data-reveal>
          <a className="btn btn-ghost" href={phone.href}>
            {phone.value}
          </a>
          <a className="btn btn-ghost" href={cvUrl} download>
            Önéletrajz <span aria-hidden="true">↓</span>
          </a>
          <span className="pill pill-live">
            <span className="live-dot" aria-hidden="true" />
            {contactSection.ctaEyebrow}
          </span>
        </div>
      </div>
    </section>
  )
}
