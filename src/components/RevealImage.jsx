import React from 'react'

export default function RevealImage() {
  return (
    <div className="reveal-image-wrap" id="reveal-image-wrap">
      <canvas className="reveal-image reveal-seq" id="reveal-canvas" />
      <div className="reveal-frame reveal-seq">
        <span className="reveal-corner tl" />
        <span className="reveal-corner tr" />
        <span className="reveal-corner bl" />
        <span className="reveal-corner br" />
      </div>
      <div className="reveal-overlay" id="reveal-overlay" />
      <p className="reveal-phrase" id="reveal-phrase">Basically, I build cool stuff.</p>
    </div>
  )
}
