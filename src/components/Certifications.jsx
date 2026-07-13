import { useState, useEffect } from 'react'
import { CERTIFICATIONS } from '../data'

export default function Certifications() {
  const [activeCert, setActiveCert] = useState(null)

  useEffect(() => {
    let pointerStart = null

    const getCertAtPoint = (x, y) => {
      const cards = document.querySelectorAll('.cert-card')

      for (const card of cards) {
        const rect = card.getBoundingClientRect()
        const isInside =
          x >= rect.left &&
          x <= rect.right &&
          y >= rect.top &&
          y <= rect.bottom

        if (isInside) {
          return CERTIFICATIONS[Number(card.dataset.certIndex)]
        }
      }

      return null
    }

    const handlePointerDown = (e) => {
      pointerStart = { x: e.clientX, y: e.clientY }
    }

    const handlePointerUp = (e) => {
      if (activeCert || !pointerStart) return

      const section = document.getElementById('certifications')
      const sectionRect = section?.getBoundingClientRect()
      const isInSection =
        sectionRect &&
        e.clientX >= sectionRect.left &&
        e.clientX <= sectionRect.right &&
        e.clientY >= sectionRect.top &&
        e.clientY <= sectionRect.bottom

      if (!isInSection) return

      const moved = Math.hypot(e.clientX - pointerStart.x, e.clientY - pointerStart.y)
      if (moved > 8) return

      const cert = getCertAtPoint(e.clientX, e.clientY)
      if (cert) {
        e.preventDefault()
        setActiveCert(cert)
      }
    }

    window.addEventListener('pointerdown', handlePointerDown, true)
    window.addEventListener('pointerup', handlePointerUp, true)

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown, true)
      window.removeEventListener('pointerup', handlePointerUp, true)
    }
  }, [activeCert])

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
                data-cert-index={index}
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
