import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

export function setupAwards() {
  const awardItems = gsap.utils.toArray('.award-item')
  if (!awardItems.length) return

  awardItems.forEach(item => {
    ScrollTrigger.create({
      trigger: item,
      start: 'top center+=15%',
      end: 'bottom center-=15%',
      toggleClass: { targets: item, className: 'active-award' }
    })
  })

  const awardCursor = document.createElement('img')
  awardCursor.style.cssText = 'position:fixed;top:0;left:0;width:250px;height:auto;border-radius:5px;pointer-events:none;z-index:99999;'
  document.body.appendChild(awardCursor)
  gsap.set(awardCursor, { xPercent: -50, yPercent: -50, scale: 0.8, opacity: 0 })

  let isHovered = false
  window.addEventListener('mousemove', e => {
    if (isHovered) gsap.set(awardCursor, { x: e.clientX, y: e.clientY })
  })
  awardItems.forEach(item => {
    item.addEventListener('mouseenter', e => {
      isHovered = true
      const src = item.getAttribute('data-cursor-img')
      if (src) awardCursor.src = src
      gsap.set(awardCursor, { x: e.clientX, y: e.clientY })
      gsap.to(awardCursor, { opacity: 1, scale: 1, duration: 0.3, overwrite: 'auto' })
    })
    item.addEventListener('mouseleave', () => {
      isHovered = false
      gsap.to(awardCursor, { opacity: 0, scale: 0.8, duration: 0.3, overwrite: 'auto' })
    })
  })
}
