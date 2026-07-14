import gsap from 'gsap'

export function splitIntoChars(el) {
  const raw = el.textContent
  el.innerHTML = ''
  const inners = []
  raw.split('').forEach(ch => {
    const outer = document.createElement('span')
    outer.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:top;padding:0.15em 0.3em;margin:-0.15em -0.3em;'
    const inner = document.createElement('span')
    inner.className = 'char'
    inner.style.display = 'inline-block'
    inner.textContent = ch === ' ' ? '\u00a0' : ch
    outer.appendChild(inner)
    el.appendChild(outer)
    inners.push(inner)
  })
  return inners
}

export function getViewportSize() {
  const root = document.documentElement
  return { width: root.clientWidth || window.innerWidth, height: window.innerHeight }
}

export function isMobileViewport() {
  return getViewportSize().width <= 768
}

export function runPreloader({ onComplete, startShader }) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const shouldSkip = !!sessionStorage.getItem('index-return-fade') || prefersReducedMotion

  const introBg    = document.getElementById('intro-bg')
  const pContent   = document.getElementById('preloader-content')
  const pLuke      = document.getElementById('preloader-vivek')
  const pBaffait   = document.getElementById('preloader-kk')
  const tPanelRed  = document.getElementById('t-panel-red')
  const tPanelDark = document.getElementById('t-panel-dark')
  const hero       = document.getElementById('hero')
  const nameLayer  = document.getElementById('name-layer')

  const lukeChars   = splitIntoChars(pLuke)
  const baffaitChars = splitIntoChars(pBaffait)
  const allRevealEls = [...lukeChars, ...baffaitChars]

  function getCharGap() {
    return parseFloat(getComputedStyle(pBaffait).fontSize) * 0.15
  }

  function layoutNames() {
    const fs = parseFloat(getComputedStyle(pBaffait).fontSize)
    if (!fs) return
    const gapPx = fs * 0.15
    const baffaitLeftPx = pLuke.offsetLeft + pLuke.offsetWidth + gapPx
    pBaffait.style.left = (baffaitLeftPx / fs) + 'em'
    pBaffait.style.top  = '0em'
  }

  function getTotalWidth() {
    return pLuke.offsetWidth + getCharGap() + pBaffait.offsetWidth
  }

  let _introSettledXvw = 0

  function placeIntroNameAtBottom() {
    layoutNames()
    const totalW = getTotalWidth()
    const offsetX = -(totalW / 2 - pLuke.offsetWidth / 2)
    const offsetX_vw = (offsetX / getViewportSize().width) * 100
    _introSettledXvw = offsetX_vw
    const newH = pContent.offsetHeight
    const vh = getViewportSize().height
    const bottomPad = isMobileViewport() ? Math.max(vh * 0.12, 80) : 80
    const targetBottom = vh - bottomPad
    const offsetY = targetBottom - newH / 2 - vh / 2
    gsap.set(pContent, { x: `${offsetX_vw}vw`, y: offsetY, transformOrigin: '50% 50%' })
  }

  layoutNames()
  gsap.set(pLuke,    { opacity: 1 })
  gsap.set(pBaffait, { opacity: 1 })
  gsap.set(allRevealEls, { yPercent: 110 })
  gsap.set([pContent, tPanelRed, tPanelDark], { willChange: 'transform', force3D: true })
  gsap.set([tPanelRed, tPanelDark], { yPercent: 100, y: 0 })
  gsap.set(pContent, { x: -(getTotalWidth() / 2 - pLuke.offsetWidth / 2) })

  if (shouldSkip) {
    gsap.set(pContent, { scale: 1, x: 0, y: 0 })
    gsap.set(nameLayer, { mixBlendMode: 'difference' })
    const vp = getViewportSize()
    const fs = parseFloat(getComputedStyle(pLuke).fontSize)
    const totalW = getTotalWidth()
    const targetW = vp.width - 240
    const scale = targetW / totalW
    const newFs  = fs * scale
    const vwSize = (newFs / vp.width) * 100
    ;[pLuke, pBaffait].forEach(el => { el.style.fontSize = `${vwSize}vw` })
    placeIntroNameAtBottom()
    gsap.set(allRevealEls, { yPercent: 0 })
    gsap.set(hero, { opacity: 1 })
    gsap.set([tPanelRed, tPanelDark], { yPercent: -100, y: 0 })
    if (introBg) introBg.style.display = 'none'
    startShader()
    onComplete(_introSettledXvw)
    return
  }

  const master = gsap.timeline({ delay: 0.2 })
  let finalNameState = null

  master
    .add(() => {
      layoutNames()
      gsap.set(pContent, { x: -(getTotalWidth() / 2 - pLuke.offsetWidth / 2) })
    })
    .to(allRevealEls, { yPercent: 0, duration: 0.4, ease: 'power3.out', stagger: { each: 0.025, from: 'center' } })
    .add(() => layoutNames())
    .add(() => {
      startShader()
      document.getElementById('hero-tagline')?.style.setProperty('will-change', 'opacity,clip-path')
      document.getElementById('hero-bar')?.style.setProperty('will-change', 'opacity,clip-path')
      document.getElementById('hero-line')?.style.setProperty('will-change', 'transform')
    })
    .to({}, { duration: 0.3 })
    .add(() => {
      const mobile = isMobileViewport()
      const pad    = mobile ? 20 : 120
      const currentW = getTotalWidth()
      const vp = getViewportSize()
      const targetW = vp.width - pad * 2
      const scale = targetW / currentW
      const visualCenterX = getTotalWidth() / 2
      const visualCenterY = pContent.offsetHeight / 2
      gsap.set(pContent, { transformOrigin: `${visualCenterX}px ${visualCenterY}px` })
      const vh = vp.height
      const bottomPad = mobile ? Math.max(vh * 0.18, 110) : 80
      const targetBottom = vh - bottomPad
      const contentRect = pContent.getBoundingClientRect()
      const curVisualCenterY = contentRect.top + visualCenterY
      const targetVisualCenterY = targetBottom - (pContent.offsetHeight * scale / 2)
      const deltaY = targetVisualCenterY - curVisualCenterY
      const baseFontSize = parseFloat(getComputedStyle(pLuke).fontSize)
      const newFontSize  = baseFontSize * scale

      finalNameState = { scale, deltaY, newFontSize, vp }
    })
    .to(pContent, {
      scale: () => finalNameState.scale,
      y: () => `+=${finalNameState.deltaY}`,
      duration: 0.75,
      ease: 'power3.inOut',
      onComplete: () => {
        const { newFontSize, vp } = finalNameState
        pContent.style.visibility = 'hidden'
        gsap.set(pContent, { scale: 1, x: 0, y: 0 })
        gsap.set(nameLayer, { mixBlendMode: 'difference' })
        const vwSize = (newFontSize / vp.width) * 100
        ;[pLuke, pBaffait].forEach(el => { el.style.fontSize = `${vwSize}vw` })
        void pContent.offsetWidth
        placeIntroNameAtBottom()
        pContent.style.visibility = 'visible'
      },
    })
    .to(tPanelDark, { yPercent: 0, duration: 0.42, ease: 'power3.inOut' }, '<+=0.05')
    .to(tPanelRed,  { yPercent: 0, duration: 0.42, ease: 'power3.inOut' }, '-=0.3')
    .set(introBg, { display: 'none' })
    .set(hero, { opacity: 1 })
    .addLabel('heroReveal')
    .to([tPanelRed, tPanelDark], { yPercent: -100, duration: 0.58, ease: 'power3.inOut' }, 'heroReveal')
    .to('#hero-tagline', { opacity: 1, clipPath: 'inset(0 0 0% 0)', duration: 0.85, ease: 'power3.out' }, 'heroReveal+=0.1')
    .to('#hero-bar',     { opacity: 1, clipPath: 'inset(0 0 0% 0)', duration: 0.8, ease: 'power3.out' }, 'heroReveal+=0.18')
    .fromTo('#hero-line', { opacity: 1, scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: 'power3.out' }, 'heroReveal+=0.18')
    .add(() => onComplete(_introSettledXvw))
}
