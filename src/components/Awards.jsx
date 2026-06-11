import React from 'react'
import { AWARDS } from '../data'

export default function Awards() {
  return (
    <section className="awards" id="awards">
      <div className="awards-inner">
        <div className="skills-subtitle awards-title">Awards</div>
        <div className="awards-list" id="awards-list">
          {AWARDS.map((a, i) => (
            <div
              key={i}
              className="award-item"
              data-cursor-img={a.img}
            >
              <div className="award-org">{a.org}</div>
              <div className="award-site">{a.site}</div>
              <div className="award-prize">{a.prize}</div>
              <div className="award-date">{a.date}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
