import React from 'react'

export default function ProjectPreview() {
  return (
    <>
      <div className="proj-preview" id="proj-preview">
        <div className="proj-card" id="proj-card">
          <div className="proj-meta">
            <span className="proj-date" id="proj-date">01 2025</span>
            <span className="proj-label">Preview</span>
          </div>
          <img
            id="proj-cover"
            src="/assets/images/projects/Covers/cyberDiag_web.avif"
            alt=""
            width="1333"
            height="1000"
          />
        </div>
      </div>
      <div className="proj-cursor" id="proj-cursor">See project</div>
    </>
  )
}
