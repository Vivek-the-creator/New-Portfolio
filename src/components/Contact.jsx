const ANGLES_DEG = [-52, -26, 0, 26, 52]
const WHATSAPP_URL = 'https://wa.me/918667035123?text=Hi%20Vivek!'

const CONTACT_LINKS = [
  {
    label: '+91 8667035123',
    href: 'tel:+918667035123',
    icon: (
      <svg viewBox="0 0 24 24" fill="white" width="22" height="22">
        <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.47 11.47 0 003.58.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.47 11.47 0 00.57 3.58 1 1 0 01-.25 1.01l-2.2 2.2z"/>
      </svg>
    ),
    iconBg: '#0a0a0a',
    filled: true,
  },
  {
    label: 'kevivark0789@gmail.com',
    href: 'mailto:kevivark0789@gmail.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#EA4335" strokeWidth="1.8" width="22" height="22">
        <rect x="2" y="4" width="20" height="16" rx="2"/>
        <path d="M2 7l10 7 10-7"/>
      </svg>
    ),
    iconBg: 'transparent',
    iconBorder: '#EA4335',
    filled: false,
  },
  {
    label: 'vivek-k-k',
    href: 'https://www.linkedin.com/in/vivek-k-k/',
    icon: (
      <svg viewBox="0 0 24 24" fill="white" width="22" height="22">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    iconBg: '#0077B5',
    filled: true,
  },
  {
    label: 'Vivek-the-creator',
    href: 'https://github.com/Vivek-the-creator',
    icon: (
      <svg viewBox="0 0 24 24" fill="#fff" width="22" height="22">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
      </svg>
    ),
    iconBg: '#24292e',
    filled: true,
  },
  {
    label: 'itz.vikshu_07',
    href: 'https://instagram.com/itz.vikshu_07',
    icon: (
      <svg viewBox="0 0 24 24" fill="white" width="22" height="22">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
    iconBg: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)',
    filled: true,
  },
]

export default function Contact() {
  return (
    <>
      <div className="contact-bg" id="contact-bg" />
      <div className="contact-blob-wrap" id="contact-blob-wrap">
        <div className="contact-blob" id="contact-blob" />
      </div>

      {/* Decorative Background Elements */}
      <div className="contact-decorations" id="contact-decorations">
        <div className="contact-decor-circle contact-decor-shape-1" />
        <div className="contact-decor-circle contact-decor-shape-2" />
        <div className="contact-decor-dots" />
        <svg className="contact-decor-curves" viewBox="0 0 1000 1000" preserveAspectRatio="none">
          <path d="M-100,500 C150,800 350,300 600,700 T1100,500" fill="none" stroke="rgba(10,10,10,0.03)" strokeWidth="1.5" />
          <path d="M-100,300 C200,100 400,600 700,200 T1100,800" fill="none" stroke="rgba(255,30,0,0.02)" strokeWidth="1" />
        </svg>
      </div>

      {/* Card is fixed to viewport, shown only when white blob fully covers screen */}
      <div className="contact-card" id="contact-card">

        {/* Top-right header tag */}
        <span className="contact-kicker-header">Let's Connect</span>

        <div className="contact-left-side">
          <div className="contact-avatar-wrap">
            <img
              src="/assets/images/contact/contact.jpeg"
              alt="Vivek K K"
              className="contact-avatar-img"
              onError={e => {
                e.target.src = '/assets/images/profile/me.png'
              }}
            />
          </div>
          <ul className="contact-links">
            {CONTACT_LINKS.map(({ icon, label, href, filled, iconBg, iconBorder }, i) => {
              const rad = (ANGLES_DEG[i] * Math.PI) / 180
              return (
                <li key={label} className="contact-link-row" style={{
                  '--sin': Math.sin(rad).toFixed(4),
                  '--cos': Math.cos(rad).toFixed(4),
                }}>
                  <a href={href} target="_blank" rel="noopener noreferrer" className="contact-link-item">
                    <span
                      className={`contact-link-icon${filled ? ' filled' : ''}`}
                      style={{
                        background: iconBg || undefined,
                        borderColor: iconBorder || (filled ? iconBg : undefined),
                      }}
                    >{icon}</span>
                    <span className="contact-link-label">{label}</span>
                  </a>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="contact-right-side">
          <div className="contact-right-content">
            <h2 className="contact-headline">
              Let's build something <span className="contact-highlight">amazing</span> together.
            </h2>
            <p className="contact-subtext">
              Whether it's a project, collaboration, internship, or just a conversation, I'm always happy to connect.
            </p>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="contact-cta-btn">
              <span>Let's Talk</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cta-arrow">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
          </div>
        </div>
      </div>

      <section className="contact" id="contact">
        <div className="contact-pin" id="contact-pin" />
      </section>
    </>
  )
}
