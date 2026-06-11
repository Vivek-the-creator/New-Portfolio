import React from 'react'
import ChrHover from './ChrHover'

export default function Contact() {
  return (
    <>
      <div className="contact-bg" id="contact-bg" />
      <div className="contact-blob-wrap" id="contact-blob-wrap">
        <div className="contact-blob" id="contact-blob" />
      </div>

      <section className="contact" id="contact">
        <div className="contact-pin" id="contact-pin">
          <div className="contact-title" id="contact-title">Contact</div>

          <div className="contact-dispo" id="contact-dispo">
            <p>
              Looking for an{' '}
              <span className="other-accent">apprenticeship</span> starting
              September. Eager to join an innovative team and contribute to
              ambitious projects.
            </p>
          </div>

          <div className="contact-frame" id="contact-frame">
            <span className="frame-corner tl" />
            <span className="frame-corner tr" />
            <span className="frame-corner bl" />
            <span className="frame-corner br" />
          </div>

          <div className="contact-dispo" id="contact-dispo-2">
            <p>
              I'm available for
              <span className="other-accent"> freelance missions worldwide</span>,
              on
              <span className="other-accent"> your ambitious projects</span> and
              international collaborations.
            </p>
          </div>

          <div className="contact-frame" id="contact-frame-2">
            <span className="frame-corner tl" />
            <span className="frame-corner tr" />
            <span className="frame-corner bl" />
            <span className="frame-corner br" />
          </div>

          <div className="contact-bottom" id="contact-bottom">
            <nav className="contact-socials" id="contact-socials" aria-label="Social networks">
              <ChrHover text="GitHub"   tag="a" href="https://github.com/SkyNigh1"               target="_blank" rel="noopener noreferrer" />
              <ChrHover text="LinkedIn" tag="a" href="https://www.linkedin.com/in/luke-baffait/" target="_blank" rel="noopener noreferrer" />
              <ChrHover text="Behance"  tag="a" href="https://www.behance.net/lukebaffait"       target="_blank" rel="noopener noreferrer" />
            </nav>
            <a className="contact-mail" id="contact-mail" href="mailto:luke.baffait@yahoo.com">
              luke.baffait@yahoo.com
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
