import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

export function setupCertifications() {
  const section = document.getElementById('certifications')
  const track = document.querySelector('.certifications-track')
  if (!section || !track) return { pinExtra: 0, destroy: () => {} }

  const getScrollAmount = () => {
    const w = track.scrollWidth - window.innerWidth
    const padding = window.innerWidth > 768 ? 160 : 60
    return w + padding
  }

  // Calculate total translation
  const scrollAmount = getScrollAmount()
  if (scrollAmount <= 0) return { pinExtra: 0, destroy: () => {} }

  // Define how long the pin should stay active (scroll length in px)
  const pinDuration = Math.max(1500, scrollAmount * 1.2)

  const st = ScrollTrigger.create({
    trigger: '#certifications',
    start: 'top top',
    end: () => `+=${pinDuration}`,
    pin: true,
    pinSpacing: true,
    scrub: 0.8,
    animation: gsap.to(track, {
      x: () => -getScrollAmount(),
      ease: 'none'
    }),
    invalidateOnRefresh: true
  })

  return {
    pinExtra: pinDuration,
    destroy() {
      st.kill()
    }
  }
}
