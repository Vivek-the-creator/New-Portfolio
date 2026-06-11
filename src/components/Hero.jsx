import React from 'react'
import ChrHover from './ChrHover'
import LiquidEther from './LiquidEther'

export default function Hero() {
  return (
    <div className="scroll-wrap" id="scroll-wrap">
      <section className="hero" id="hero">
        <h1 className="sr-only">
          Vivek — Creative Developer, computer science student in Vannes,
          specialized in web development, animation and interactive design.
        </h1>
        <div className="hero-canvas" id="hero-canvas">
          <LiquidEther
            colors={['#ff6a3d', '#ff1e00', '#e01010', '#c0000a']}
            mouseForce={20}
            cursorSize={100}
            resolution={0.5}
            autoDemo={true}
            autoSpeed={0.5}
            autoIntensity={2.2}
            takeoverDuration={0.25}
            autoResumeDelay={3000}
            autoRampDuration={0.6}
          />
        </div>

        <div className="hero-content">
          <div className="hero-tagline" id="hero-tagline">
            Building logic{' '}
            <span className="other-accent">with creativity</span>,<br />
            crafting ideas into experiences.
          </div>

          <div className="hero-line" id="hero-line" />

          <div className="hero-bar" id="hero-bar">
            <nav className="hero-bar-center" aria-label="Social networks">
              <ChrHover text="Leetcode"  tag="a" href="https://leetcode.com/u/vivek-k-k/"         target="_blank" rel="noopener noreferrer" />
              <span className="sep" aria-hidden="true">/</span>
              <ChrHover text="LinkedIn" tag="a" href="https://www.linkedin.com/in/vivek-k-k/"   target="_blank" rel="noopener noreferrer" />
              <span className="sep" aria-hidden="true">/</span>
              <ChrHover text="GitHub"   tag="a" href="https://github.com/Vivek-the-creator"                 target="_blank" rel="noopener noreferrer" />
            </nav>
            <nav className="hero-bar-right" aria-label="Main navigation">
              <ChrHover text="Projects" tag="a" href="#projects"   />
              <ChrHover text="Gallery"  tag="a" href="#circle-gallery" />
              <ChrHover text="Skills"   tag="a" href="#skills"  />
            </nav>
          </div>
        </div>
      </section>
    </div>
  )
}
