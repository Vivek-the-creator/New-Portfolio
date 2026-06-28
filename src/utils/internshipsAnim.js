import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

export function setupInternships() {
  const internItems = gsap.utils.toArray('.intern-item')
  if (!internItems.length) return

  internItems.forEach(item => {
    ScrollTrigger.create({
      trigger: item,
      start: 'top center+=15%',
      end: 'bottom center-=15%',
      toggleClass: { targets: item, className: 'active-intern' }
    })
  })

  const internCursor = document.createElement('img')
  internCursor.style.cssText = 'position:fixed;top:0;left:0;width:250px;height:auto;border-radius:5px;pointer-events:none;z-index:99999;'
  document.body.appendChild(internCursor)
  gsap.set(internCursor, { xPercent: -50, yPercent: -50, scale: 0.8, opacity: 0 })

  let isHovered = false
  window.addEventListener('mousemove', e => {
    if (isHovered) gsap.set(internCursor, { x: e.clientX, y: e.clientY })
  })
  internItems.forEach(item => {
    item.addEventListener('mouseenter', e => {
      isHovered = true
      const src = item.getAttribute('data-cursor-img')
      if (src) internCursor.src = src
      gsap.set(internCursor, { x: e.clientX, y: e.clientY })
      gsap.to(internCursor, { opacity: 1, scale: 1, duration: 0.3, overwrite: 'auto' })
    })
    item.addEventListener('mouseleave', () => {
      isHovered = false
      gsap.to(internCursor, { opacity: 0, scale: 0.8, duration: 0.3, overwrite: 'auto' })
    })
  })
}
