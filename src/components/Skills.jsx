import React from 'react'
import ChrHover from './ChrHover'
import { SKILLS } from '../data'

export default function Skills() {
  return (
    <section className="skills" id="skills">
      <div className="skills-inner">
        <div className="skills-left">
          <div className="skills-subtitle">Skills</div>
          <div className="skills-text">
            Computer Science student in Vannes, specialized in cybersecurity,
            passionate about web development and design.
          </div>
          <div className="skills-separator" />
          <div>
            <ChrHover text="Contact me" tag="a" href="#contact" className="skills-contact" />
          </div>
          <div className="skills-arrow" id="skills-arrow">
            <svg style={{ width:'1.25em', height:'1.25em', verticalAlign:'-0.25em' }}
              viewBox="0 0 84 85" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 38H54L37 21H51L73 43L51 65H37L54 48H11Z"/>
            </svg>
          </div>
        </div>

        <div className="skills-right" id="skills-right">
          {SKILLS.map((s, idx) => (
            <div
              key={s.group}
              className={`skill-group${idx === 0 ? ' open' : ''}`}
              data-group={s.group}
            >
              <div className="skill-header">
                <span className="skill-header-title">{s.label}</span>
                <span className="skill-header-icon" />
              </div>
              <div className="skill-body" style={idx === 0 ? undefined : { height: 0 }}>
                <ul className="skill-body-inner">
                  {s.items.map(item => <li key={item}>{item}</li>)}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
