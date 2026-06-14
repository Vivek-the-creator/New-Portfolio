import React from 'react'
import { PROJECTS } from '../data'

export default function Projects() {
  return (
    <div className="projects" id="projects">
      <svg className="fluid-line-svg" id="fluid-line-svg"
        viewBox="0 0 1400 1150" preserveAspectRatio="xMidYMid slice">
        <path className="fluid-line" id="fluid-line" d="
          M -150,300
          C 300,-20  600,150  540,400
          C 490,650   0,655    300,1050
          C 600,1385 650,1250 1000,1250
          C 1050,1250 1850,1250 1540,1400
        " />
      </svg>

      {/* Title sits in its own full-height block — scrolls away before list sticks */}
      <div className="projects-title-screen">
        <h2 className="projects-heading">Projects</h2>
      </div>

      {/* List scroll area starts only after the title screen */}
      <div className="projects-inner">
        <div className="projects-list" id="projects-list">
          {PROJECTS.map(p => (
            <div
              key={p.id}
              className="proj-item"
              data-id={p.id}
              data-img={p.cover}
              data-date={p.date}
            >
              {p.title}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
