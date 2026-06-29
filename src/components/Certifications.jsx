import React, { useState, useEffect } from 'react'
import { CERTIFICATIONS } from '../data'

export default function Certifications() {
  const [activeCert, setActiveCert] = useState(null)

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveCert(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <section className="certifications" id="certifications">
      <div className="certifications-sticky">
        <div className="certifications-header">
          <h2 className="section-heading-huge certifications-title">Certifications</h2>
        </div>
        <div className="certifications-track-wrap">
          <div className="certifications-track">
            {CERTIFICATIONS.map((cert, index) => (
              <div 
                className="cert-card" 
                key={index}
                onClick={() => setActiveCert(cert)}
              >
                <div className="cert-img-wrap">
                  <img src={cert.img} alt={cert.title} className="cert-img" loading="lazy" />
                </div>
                <div className="cert-info">
                  <h3 className="cert-card-title">{cert.title}</h3>
                  <p className="cert-card-issuer">{cert.issuer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Premium Lightbox Modal */}
      <div 
        className={`cert-lightbox ${activeCert ? 'active' : ''}`}
        onClick={() => setActiveCert(null)}
      >
        <button 
          className="cert-lightbox-close"
          onClick={(e) => {
            e.stopPropagation()
            setActiveCert(null)
          }}
          aria-label="Close lightbox"
        >
          &times;
        </button>
        <div 
          className="cert-lightbox-content"
          onClick={(e) => e.stopPropagation()}
        >
          {activeCert && (
            <>
              <img 
                src={activeCert.img} 
                alt={activeCert.title} 
                className="cert-lightbox-img" 
              />
              <h3 className="cert-lightbox-title">{activeCert.title}</h3>
              <p className="cert-lightbox-issuer">{activeCert.issuer}</p>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
