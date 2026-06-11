import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

const _frameModules = import.meta.glob('../assets/frames/frame_*.png', { eager: true })
const _frameUrls = Array.from({ length: 65 }, (_, i) => {
  const key = `../assets/frames/frame_${String(i + 1).padStart(3, '0')}.png`
  return _frameModules[key]?.default
})
const TOTAL_FRAMES = 65
const frameUrl = n => _frameUrls[n - 1]

export async function setupScrollReveal(lenisRef, introSettledXvw) {
  const isMobile = navigator.maxTouchPoints > 1
  const isSlowHardware = isMobile || (navigator.hardwareConcurrency || 8) <= 4

  const pContent  = document.getElementById('preloader-content')
  const pLogo     = document.getElementById('preloader-logo')
  const pLuke     = document.getElementById('preloader-vivek')
  const pBaffait  = document.getElementById('preloader-kk')
  const pDot      = null
  const nameLayer = document.getElementById('name-layer')
  const revealWrap = document.getElementById('reveal-image-wrap')
  const revealSeq  = document.querySelectorAll('.reveal-seq')
  const canvas = document.getElementById('reveal-canvas')
  const ctx    = canvas.getContext('2d')

  // Phrase chars
  const phraseEl = document.getElementById('reveal-phrase')
  phraseEl.innerHTML = [...phraseEl.textContent].map(ch =>
    `<span class="rp-char" style="display:inline-block;">${ch === ' ' ? '&nbsp;' : ch}</span>`
  ).join('')
  const phraseChars = phraseEl.querySelectorAll('.rp-char')
  gsap.set(phraseChars, isMobile ? { opacity: 0 } : { opacity: 0, filter: 'blur(10px)' })

  // Frame loader
  const frames = new Array(TOTAL_FRAMES)
  let loadedFrameIdx = [], totalFrames = 0, drawnIdx = -1

  function rebuildIndex() {
    loadedFrameIdx = []
    for (let i = 0; i < frames.length; i++) {
      if (frames[i]?.naturalWidth) loadedFrameIdx.push(i)
    }
    totalFrames = loadedFrameIdx.length
  }

  canvas.style.willChange = 'transform'

  function resizeCanvas() {
    const dpr = isSlowHardware ? 1 : Math.min(window.devicePixelRatio || 1, 1.5)
    canvas.width  = Math.round(window.innerWidth  * dpr)
    canvas.height = Math.round(window.innerHeight * dpr)
    if (drawnIdx >= 0) { const i = drawnIdx; drawnIdx = -1; drawFrame(i) }
  }

  let _lastDrawMs = 0
  function drawFrame(i) {
    if (i === drawnIdx) return
    if (isSlowHardware) {
      const now = performance.now()
      if (now - _lastDrawMs < 32) return
      _lastDrawMs = now
    }
    if (i < 0 || i >= frames.length) return
    const img = frames[i]
    if (!(img?.naturalWidth)) return
    const cw = canvas.width, ch = canvas.height
    const iw = img.naturalWidth, ih = img.naturalHeight
    const s  = Math.max(cw / iw, ch / ih)
    ctx.clearRect(0, 0, cw, ch)
    ctx.drawImage(img, (cw - iw*s)*.5, (ch - ih*s)*.5, iw*s, ih*s)
    drawnIdx = i
  }

  function probe(n) {
    return new Promise(res => {
      const img = new Image(); img.decoding = 'async'
      img.onload = () => res(img); img.onerror = () => res(null)
      img.src = frameUrl(n)
    })
  }
  async function probeRetry(n, attempts=3) {
    for (let k=0;k<attempts;k++) { const img=await probe(n); if(img) return img }
    return null
  }

  async function loadFirstBatch() {
    const first = await probeRetry(1,3)
    if (!first) return 0
    frames[0] = first; rebuildIndex(); resizeCanvas(); drawFrame(0)
    const t0 = performance.now()
    const batch = Array.from({ length: Math.min(10, TOTAL_FRAMES-1) }, (_,k)=>k+2)
    await Promise.all(batch.map(async n => { const img=await probeRetry(n,2); if(img) frames[n-1]=img }))
    rebuildIndex()
    const elapsed = performance.now() - t0
    return elapsed > 4000 ? 3 : elapsed > 2000 ? 2 : 1
  }

  async function loadRemaining(skip) {
    const toLoad = []
    for (let i=11;i<=TOTAL_FRAMES;i++) { if(skip<=1||i%skip===0) toLoad.push(i) }
    let cursor=0; const CONC = isSlowHardware?2:6
    const worker = async () => {
      while (cursor<toLoad.length) {
        const n=toLoad[cursor++]
        if (frames[n-1]?.naturalWidth) continue
        const img=await probeRetry(n,2)
        if(img){frames[n-1]=img;rebuildIndex()}
      }
    }
    await Promise.all(Array.from({length:CONC},worker))
  }

  window.addEventListener('resize', resizeCanvas)
  let frameSkip = await loadFirstBatch()
  if (isMobile) frameSkip = Math.max(frameSkip,3)
  if (totalFrames===0) return
  loadRemaining(frameSkip).catch(()=>{})

  const introSettledY = Number(gsap.getProperty(pContent,'y')) || 0
  const introXvw = `${introSettledXvw}vw`

  const scrollTl = gsap.timeline({ paused: true })
  scrollTl.fromTo(pContent, { x:introXvw, y:introSettledY }, { x:introXvw, y:introSettledY, duration:0.3, ease:'none' }, 0)
  scrollTl.fromTo('#hero-tagline', { opacity:1 }, { opacity:0, duration:0.15, ease:'none' }, 0)
  scrollTl.fromTo('#hero-bar',     { opacity:1 }, { opacity:0, duration:0.15, ease:'none' }, 0)
  scrollTl.fromTo('#hero-line',    { opacity:1 }, { opacity:0, duration:0.15, ease:'none' }, 0)
  scrollTl.fromTo(revealWrap, { opacity:0 }, { opacity:1, duration:0.01 }, 0.3)
  scrollTl.fromTo(revealSeq, { scale:0 }, { scale:1, duration:0.7, ease:'none' }, 0.3)

  const mobile = window.innerWidth<=768
  const exitL = mobile?'-35vw':'-55vw', exitR = mobile?'35vw':'55vw'
  scrollTl.fromTo(pLogo,    {x:'0vw',opacity:1},{x:exitL,opacity:0,duration:0.7,ease:'none'},0.3)
  scrollTl.fromTo(pLuke,    {x:'0vw',opacity:1},{x:exitL,opacity:0,duration:0.7,ease:'none'},0.3)
  scrollTl.fromTo(pBaffait, {x:'0vw',opacity:1},{x:exitR,opacity:0,duration:0.7,ease:'none'},0.3)
  scrollTl.set(nameLayer, { autoAlpha:0 }, 0.98)
  scrollTl.to(phraseChars, {
    opacity:1, ...(isMobile?{}:{filter:'blur(0px)'}),
    duration:0.06, ease:'none', stagger:{each:0.007,from:'start'}
  }, 0.62)

  function drawFrameAt(p) {
    if (!totalFrames) return
    const clamped = Math.min(1,Math.max(0,p))
    const pos = Math.round(clamped*(totalFrames-1))
    const idx  = loadedFrameIdx[pos]
    if (idx!=null) drawFrame(idx)
  }

  const REVEAL_START = 0.3, REVEAL_DUR = 0.7, EXIT_START = 0.82

  ScrollTrigger.create({
    trigger: '#scroll-wrap',
    start: 'top top', end: 'bottom bottom',
    scrub: 0.5, animation: scrollTl,
    onUpdate: self => {
      const p = self.progress
      if (p < REVEAL_START) { drawFrameAt(0); return }
      const phase2 = Math.min(1,Math.max(0,(p-REVEAL_START)/REVEAL_DUR))
      drawFrameAt(phase2*EXIT_START)
    }
  })

  const revealOverlay = document.getElementById('reveal-overlay')
  const exitTl = gsap.timeline({ paused:true })
  exitTl.to(revealWrap,    { y:'-50vh', ease:'none', duration:1 }, 0)
  exitTl.to(revealOverlay, { opacity:0.7, ease:'none', duration:0.66 }, 0)
  if (!isMobile && CSS.supports('backdrop-filter','blur(1px)')) {
    gsap.set(revealOverlay, { backdropFilter:'blur(0px)' })
    exitTl.to(revealOverlay, { backdropFilter:'blur(16px)', ease:'none', duration:1 }, 0)
  }

  const phraseExitTl = gsap.timeline({ paused:true })
  phraseExitTl.to(phraseChars, { opacity:0, duration:0.2, ease:'none', stagger:{each:0.01,from:'end'} })
  ScrollTrigger.create({
    trigger:'#section-after', start:'top bottom', end:'top top',
    scrub:true, animation:phraseExitTl
  })
  ScrollTrigger.create({
    trigger:'#section-after', start:'top bottom', end:'top top',
    scrub:true, animation:exitTl,
    onUpdate: self => drawFrameAt(EXIT_START + self.progress*(1-EXIT_START)),
    onLeave: ()=>drawFrameAt(1),
    onLeaveBack: ()=>drawFrameAt(EXIT_START),
  })
}
