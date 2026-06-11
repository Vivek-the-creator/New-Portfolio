import React from 'react'
import { PROJECTS } from '../data'

export default function Projects() {
  return (
    <div className="projects" id="projects">
      <svg className="fluid-line-svg" id="fluid-line-svg"
        viewBox="0 0 1400 1400" preserveAspectRatio="xMidYMid slice">
        <path className="fluid-line" id="fluid-line" d="
          M -80,0
          C 300,-20  600,150  540,400
          C 490,650   0,655    300,1050
          C 600,1385 650,1250 850,1200
          C 1050,1150 1350,1250 1540,1300
        " />
      </svg>

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
