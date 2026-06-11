import React from 'react'
import ChrHover from './ChrHover'

export default function ProjectDetail() {
  return (
    <section className="project-detail" id="project-detail">
      <div className="detail-back chr-hover" id="detail-back">
        <ChrHover text="🡼BACK" />
      </div>
      <div className="detail-info">
        <div className="detail-title-wrap" id="detail-title-wrap">
          <h1 className="detail-title" id="detail-title" />
          <span className="detail-year" id="detail-year" />
        </div>
        <p className="detail-desc" id="detail-desc" />
        <div className="detail-tags" id="detail-tags" />
      </div>
      <div className="detail-gallery-wrap" id="detail-gallery-wrap">
        <div className="detail-thumbs" id="detail-thumbs">
          <div className="detail-thumbs-inner" id="detail-thumbs-inner" />
        </div>
        <div className="detail-selected" id="detail-selected" />
      </div>
    </section>
  )
}
