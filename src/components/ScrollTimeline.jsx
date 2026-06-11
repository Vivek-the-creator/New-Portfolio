import React from 'react'

export default function ScrollTimeline() {
  return (
    <>
      <div className="scroll-pct" id="scroll-pct">(0)</div>
      <div className="scroll-timeline" id="scroll-timeline">
        <span className="st-label" id="st-label" />
        <div className="st-bar" id="st-bar" />
      </div>
    </>
  )
}
