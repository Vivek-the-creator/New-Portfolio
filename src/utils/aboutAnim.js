import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

const isMobile = navigator.maxTouchPoints > 1

function wrapWords(el) {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
  const nodes = []
  while (walker.nextNode()) nodes.push(walker.currentNode)
  nodes.forEach(node => {
    const words = node.textContent.split(/(\s+)/)
    const frag  = document.createDocumentFragment()
    words.forEach(w => {
      if (/^\s+$/.test(w)) { frag.appendChild(document.createTextNode(w)) }
      else if (w) {
        const span = document.createElement('span')
        span.className = 'word'; span.textContent = w
        frag.appendChild(span)
      }
    })
    node.parentNode.replaceChild(frag, node)
  })
}

export function setupAbout() {
  const aboutText    = document.getElementById('about-text')
  const aboutSub     = document.getElementById('about-sub')
  const photoWrap    = document.getElementById('about-photo-wrap')
  const aboutVersion = document.querySelector('.about-version')
  const aboutIcon    = aboutVersion?.querySelector('svg')
  if (aboutIcon) aboutIcon.classList.add('word')

  wrapWords(aboutText)
  wrapWords(aboutVersion)
  if (isMobile) {
    ;[...aboutText.querySelectorAll('.word'), ...aboutVersion.querySelectorAll('.word')]
      .forEach(w => { w.style.filter = 'none' })
  }

  ;[...aboutText.querySelectorAll('.word'), ...aboutVersion.querySelectorAll('.word')].forEach(word => {
    gsap.to(word, {
      opacity: 1,
      ...(isMobile ? {} : { filter: 'blur(0px)' }),
      ease: 'none',
      scrollTrigger: { trigger: word, start: 'top 75%', end: 'top 60%', scrub: true }
    })
  })

  gsap.set(aboutSub, isMobile ? { opacity: 0 } : { opacity: 0, filter: 'blur(12px)' })
  gsap.to(aboutSub, {
    opacity: 1, ...(isMobile ? {} : { filter: 'blur(0px)' }),
    ease: 'none',
    scrollTrigger: { trigger: aboutSub, start: 'top 80%', end: 'top 60%', scrub: true }
  })

  const photo = photoWrap.querySelector('.about-photo')
  function initPhotoScroll() {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: photoWrap, start: 'top bottom', end: 'bottom top', scrub: true }
    })
    tl.fromTo(photo, { y: '-50%' }, { y: '50%', ease: 'none' }, 0)
    tl.fromTo(photo, { opacity: 0, filter: 'blur(20px)' }, { opacity: 1, filter: 'blur(0px)', ease: 'none', duration: 0.3 }, 0)
  }
  photo.decode ? photo.decode().then(initPhotoScroll).catch(initPhotoScroll)
               : (photo.onload = initPhotoScroll, photo.complete && initPhotoScroll())
}
