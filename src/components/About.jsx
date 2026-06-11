import React from 'react'
import ChrHover from './ChrHover'

export default function About() {
  return (
    <div className="about" id="about">
      <div className="about-text" id="about-text">
        As a<span className="other-accent"> Full Stack Developer</span> and <br></br>
        <span className="other-accent">AI Enthusiast</span>, I enjoy building <br></br>
        digital experiences that combine <span className="other-accent">creativity, logic</span> and <span className="other-accent">emotion</span>.
      </div>

      <div className="about-sub" id="about-sub">
        My name is Luke. A passionate creator and computer science student in
        Vannes, I build memorable digital experiences, always seeking the
        symbiosis between art and information.
      </div>

      <div className="about-btn">
        <ChrHover text="Info" tag="a" href="info/" pageLink="info" />
      </div>

      <div className="about-version" style={{display:'none'}}>
        <svg style={{ width:'1.25em', height:'1.25em', verticalAlign:'-0.25em' }}
          viewBox="0 0 84 85" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M11 38H54L37 21H51L73 43L51 65H37L54 48H11Z"/>
        </svg>
        V3.0
      </div>

      <div className="about-photo-wrap" id="about-photo-wrap">
        <img
          className="about-photo"
          src="/assets/images/profile/me.avif"
          alt="Luke Baffait"
          decoding="async"
          width="2500"
          height="3001"
        />
      </div>
    </div>
  )
}
