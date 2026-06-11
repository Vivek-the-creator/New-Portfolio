import React from 'react'
import { PROJECTS } from '../data'

export default function CircleGallery() {
  return (
    <section className="circle-gallery" id="circle-gallery">
      <div className="circle-gallery-pin" id="circle-gallery-pin">
        {PROJECTS.map((p, i) => (
          <img
            key={p.id}
            className="cg-img"
            src={p.cover}
            alt={p.title}
            width="3000"
            height="2000"
          />
        ))}
        <p className="cg-phrase" id="cg-phrase">
          Each project is a chance to{' '}
          <span className="other-accent">learn</span>,{' '}
          <span className="other-accent">experiment</span> and push my limits.
        </p>
      </div>
    </section>
  )
}
