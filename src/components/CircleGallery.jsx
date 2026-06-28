import React from 'react'

const ACHIEVEMENT_IMAGES = Array.from({length: 8}, (_, i) => `/assets/images/achievements/${i + 1}.webp`)

export default function CircleGallery() {
  return (
    <section className="circle-gallery" id="circle-gallery">
      <div className="circle-gallery-pin" id="circle-gallery-pin">
        
        {ACHIEVEMENT_IMAGES.map((src, i) => (
          <img
            key={i}
            className="cg-img"
            src={src}
            alt={`Achievement ${i + 1}`}
            width="3000"
            height="2000"
          />
        ))}
        <div className="cg-caption" id="cg-caption">
          <p id="cg-caption-text"></p>
        </div>
        <p className="cg-phrase" id="cg-phrase">
          Every event helped me to{' '}
          <span className="other-accent">learn</span>{' '}
          something new and{' '}
          <span className="other-accent">implement</span>{' '}
          them to reality.
        </p>
      </div>
    </section>
  )
}
