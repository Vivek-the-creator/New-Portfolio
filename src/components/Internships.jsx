import React, { useState, useEffect } from 'react'
import { INTERNSHIPS } from '../data'

export default function Internships() {
  const [activeIntern, setActiveIntern] = useState(null)

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveIntern(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <section className="internships" id="internships">
      <div className="internships-inner">
        <h2 className="section-heading-huge internships-title">Internships</h2>
        <div className="internships-list" id="internships-list">
          {INTERNSHIPS.map((intern, i) => (
            <div
              key={i}
              className="intern-item"
              data-cursor-img={intern.img}
              onClick={() => setActiveIntern(intern)}
            >
              <div className="intern-company">{intern.company}</div>
              <div className="intern-role">{intern.role}</div>
              <div className="intern-duration">{intern.duration}</div>
              <div className="intern-year">{intern.year}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Split-Screen Experience Modal */}
      <div 
        className={`internship-modal ${activeIntern ? 'active' : ''}`}
        onClick={() => setActiveIntern(null)}
      >
        <button 
          className="internship-modal-close"
          onClick={(e) => {
            e.stopPropagation()
            setActiveIntern(null)
          }}
          aria-label="Close details"
        >
          &times;
        </button>
        <div 
          className="internship-modal-content"
          onClick={(e) => e.stopPropagation()}
        >
          {activeIntern && (
            <>
              <div className="modal-left">
                <img 
                  src={activeIntern.img} 
                  alt={activeIntern.company} 
                  className="modal-left-img" 
                />
              </div>
              <div className="modal-right">
                <div className="modal-right-header">
                  <h3 className="modal-company">{activeIntern.company}</h3>
                  <div className="modal-badges">
                    <span className="modal-badge role-badge">{activeIntern.role}</span>
                    <span className="modal-badge duration-badge">{activeIntern.duration}</span>
                    <span className="modal-badge year-badge">{activeIntern.year}</span>
                  </div>
                </div>
                <div className="modal-right-body">
                  <h4>Work Experience & Contributions</h4>
                  <p className="modal-experience">{activeIntern.experience}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
