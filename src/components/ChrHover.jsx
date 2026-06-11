import React from 'react'

export function getCharHTML(ch) {
  if (ch === ' ') return '\u00a0'
  if (ch === '🡺' || ch === '🡲')
    return `<svg style="width:1.25em;height:1.25em;vertical-align:-0.25em;" viewBox="0 0 84 85" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M11 38H54L37 21H51L73 43L51 65H37L54 48H11Z"/></svg>`
  if (ch === '🡼')
    return `<svg style="width:1.25em;height:1.25em;vertical-align:-0.25em;" viewBox="0 0 84 85" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><g transform="rotate(-135 42 42.5)"><path d="M11 38H54L37 21H51L73 43L51 65H37L54 48H11Z"/></g></svg>`
  if (ch === '🞣')
    return `<svg style="width:0.9em;height:0.9em;vertical-align:-0.1em;" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C12 7.5 16.5 12 22 12C16.5 12 12 16.5 12 22C12 16.5 7.5 12 2 12C7.5 12 12 7.5 12 2Z"/></svg>`
  return ch
}

export default function ChrHover({
  text, tag = 'span', href, target, rel,
  className = '', style = {}, onClick, pageLink
}) {
  const chars = [...(text || '')]
  const inner = chars.map((ch, i) => (
    <span key={i} className="ch-wrap" style={{ '--i': i }}>
      <span className="ch-top" dangerouslySetInnerHTML={{ __html: getCharHTML(ch) }} />
      <span className="ch-bot" dangerouslySetInnerHTML={{ __html: getCharHTML(ch) }} />
    </span>
  ))

  const props = {
    className: `chr-hover${className ? ' ' + className : ''}`,
    style,
    onClick,
    ...(pageLink ? { 'data-page-link': pageLink } : {})
  }

  if (tag === 'a') {
    return <a href={href} target={target} rel={rel} {...props}>{inner}</a>
  }
  return React.createElement(tag, props, inner)
}
