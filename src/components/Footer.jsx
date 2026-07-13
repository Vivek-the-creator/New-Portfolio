import React from 'react'
import ChrHover from './ChrHover'

export default function Footer() {
  return (
    <>
      <div className="footer-transition" id="footer-transition" />
      <footer className="footer" id="footer">
        <div className="footer-content" id="footer-content">

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
