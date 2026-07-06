import React from 'react'
import ChrHover from './ChrHover'

export default function Footer() {
  return (
    <>
      <div className="footer-transition" id="footer-transition" />
      <footer className="footer" id="footer">
        <div className="footer-content" id="footer-content">
          <div className="footer-top">
            <div className="footer-top-col">
              <ChrHover text="kevivark0789@gmail.com" tag="a" href="mailto:kevivark0789@gmail.com" className="footer-mail" />
              <ChrHover text="© 2026" className="footer-date" />
            </div>
            <nav className="footer-top-col" aria-label="Social networks">
              <ChrHover text="GitHub"   tag="a" href="https://github.com/Vivek-the-creator"               target="_blank" rel="noopener noreferrer" />
              <ChrHover text="LinkedIn" tag="a" href="https://www.linkedin.com/in/vivek-k-k/" target="_blank" rel="noopener noreferrer" />

            </nav>
            <nav className="footer-top-col" aria-label="Footer navigation">
              <ChrHover text="Work"    tag="a" href="works/"   pageLink="work" />
              <ChrHover text="Info"    tag="a" href="info/"    pageLink="info" />
              <ChrHover text="Contact" tag="a" href="#contact" />
            </nav>
          </div>

          <div className="footer-ascii-wrap">
            <div className="footer-ascii left">
              <pre id="ascii-left" />
            </div>
            <div className="footer-ascii right">
              <pre id="ascii-right" />
            </div>
          </div>

          <div className="footer-name">
            <span className="footer-name-vivek">
              <span className="first-letter">V</span>ivek
            </span>
            <span className="footer-name-karthikeyan-wrap">
              <span className="footer-name-karthikeyan">Karthikeyan</span>
              
            </span>
          </div>
        </div>
      </footer>
    </>
  )
}
