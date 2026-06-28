import React from 'react'
import { INTERNSHIPS } from '../data'

export default function Internships() {
  return (
    <section className="internships" id="internships">
      <div className="internships-inner">
        <div className="skills-subtitle internships-title">Internships</div>
        <div className="internships-list" id="internships-list">
          {INTERNSHIPS.map((intern, i) => (
            <div
              key={i}
              className="intern-item"
              data-cursor-img={intern.img}
            >
              <div className="intern-company">{intern.company}</div>
              <div className="intern-role">{intern.role}</div>
              <div className="intern-duration">{intern.duration}</div>
              <div className="intern-year">{intern.year}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
