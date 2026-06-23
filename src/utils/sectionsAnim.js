import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

export function setupSkills(lenis) {
  const groups   = [...document.querySelectorAll('.skill-group')]
  const canvas   = document.getElementById('skillsNetwork')
  const N        = groups.length
  groups.forEach(g => gsap.set(g.querySelector('.skill-body'), { height: 0 }))

  let isTransitioning = false
  let currentStep = 0

  function openGroup(idx) {
    const skillsRight = document.querySelector('.skills-right')
    groups.forEach((g, i) => {
      const body = g.querySelector('.skill-body')
      if (i === idx) {
        g.classList.add('open')
        gsap.to(body, {
          height: body.scrollHeight,
          duration: 0.45,
          ease: 'power3.inOut',
          onComplete: () => {
            // After expand, scroll the panel so the group header + items are fully visible
            if (skillsRight) {
              const containerRect = skillsRight.getBoundingClientRect()
              const groupRect    = g.getBoundingClientRect()
              const headerRect   = g.querySelector('.skill-header').getBoundingClientRect()

              // If the bottom of the group is below the container bottom, scroll down
              const overflowBottom = groupRect.bottom - containerRect.bottom
              if (overflowBottom > 0) {
                skillsRight.scrollBy({ top: overflowBottom + 24, behavior: 'smooth' })
              }
              // If the header is above the container top (e.g. scrolled past), scroll up to it
              else if (headerRect.top < containerRect.top) {
                skillsRight.scrollBy({ top: headerRect.top - containerRect.top - 24, behavior: 'smooth' })
              }
            }
          }
        })
        if (canvas?._network) canvas._network.setActiveGroup(g.dataset.group)
      } else {
        g.classList.remove('open')
        gsap.to(body, { height: 0, duration: 0.35, ease: 'power3.inOut' })
      }
    })
  }

  function closeAll() {
    const skillsRight = document.querySelector('.skills-right')
    groups.forEach(g => {
      g.classList.remove('open')
      gsap.to(g.querySelector('.skill-body'), { height: 0, duration: 0.35, ease: 'power3.inOut' })
    })
    if (canvas?._network) canvas._network.setActiveGroup(null)
    // Reset scroll so panel is fresh for next entry
    if (skillsRight) skillsRight.scrollTop = 0
  }

  const stepPx  = 600
  const totalPx = (N + 1) * stepPx
  let lastStep  = -1

  // Track whether scroll is in the pinned skills zone
  let isPinned = false

  const st = ScrollTrigger.create({
    trigger:    '#skills',
    start:      'top top',
    end:        `+=${totalPx}`,
    pin:        true,
    pinSpacing: true,
    onEnter()      { isPinned = true  },
    onLeave()      { isPinned = false; lenis?.start(); closeAll() },
    onEnterBack()  { isPinned = true;  openGroup(N - 1) },
    onLeaveBack()  { isPinned = false; lenis?.start() },
    onUpdate(self) {
      if (!isTransitioning) {
        currentStep = Math.min(N, Math.floor(self.progress * (N + 1)))
      }
      const step = Math.min(N, Math.floor(self.progress * (N + 1)))
      if (step === lastStep) return
      lastStep = step
      if (step < N) openGroup(step)
      else          closeAll()
    },
  })

  function goToStep(step) {
    if (!lenis) return
    isTransitioning = true
    currentStep = step
    const targetScroll = st.start + step * stepPx
    // Re-enable lenis just for this programmatic scroll, then stop again
    lenis.start()
    lenis.scrollTo(targetScroll, {
      duration: 0.85,
      ease: (t) => 1 - Math.pow(1 - t, 3),
      onComplete: () => {
        isTransitioning = false
        // Stop lenis again so the next wheel event doesn't drift
        if (isPinned) lenis.stop()
      }
    })
  }

  // Header click scrolls to the appropriate step
  groups.forEach((g, i) => {
    g.querySelector('.skill-header').addEventListener('click', () => {
      goToStep(i)
    })
  })

  // Use capture:true so this fires BEFORE Lenis's own wheel listener,
  // allowing us to call e.preventDefault() before Lenis processes the event.
  const handleWheel = (e) => {
    if (!isPinned) return
    e.preventDefault() // always prevent so Lenis never sees this event while pinned
    if (isTransitioning) return

    const isScrollDown = e.deltaY > 0
    if (isScrollDown && currentStep < N) {
      goToStep(currentStep + 1)
    } else if (!isScrollDown && currentStep > 0) {
      goToStep(currentStep - 1)
    } else {
      // At boundary — let the user exit the section naturally
      lenis?.start()
    }
  }

  let touchStartY = 0
  const handleTouchStart = (e) => {
    touchStartY = e.touches[0].clientY
  }

  const handleTouchMove = (e) => {
    if (!isPinned) return
    const touchY = e.touches[0].clientY
    const deltaY = touchStartY - touchY
    if (Math.abs(deltaY) < 15 || isTransitioning) return
    e.preventDefault()
    const isScrollDown = deltaY > 0
    if (isScrollDown && currentStep < N) {
      goToStep(currentStep + 1)
    } else if (!isScrollDown && currentStep > 0) {
      goToStep(currentStep - 1)
    } else {
      lenis?.start()
    }
  }

  // capture:true ensures we intercept before Lenis
  window.addEventListener('wheel', handleWheel, { passive: false, capture: true })
  window.addEventListener('touchstart', handleTouchStart, { passive: true })
  window.addEventListener('touchmove', handleTouchMove, { passive: false, capture: true })


  return {
    pinExtra: totalPx,
    destroy() {
      window.removeEventListener('wheel', handleWheel, { capture: true })
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove, { capture: true })
      lenis?.start() // ensure lenis is always re-enabled on teardown
    }
  }
}

export function setupScrollTimeline(lenis, skillsPinExtra = 0) {
  const timeline = document.getElementById('scroll-timeline')
  const bar      = document.getElementById('st-bar')
  const label    = document.getElementById('st-label')
  const pctEl    = document.getElementById('scroll-pct')

  const isMobile = window.innerWidth <= 768
  const sections = [
    {id:'scroll-wrap',name:'Home'},
    {id:'about',name:'About Me'},
    {id:'projects',name:'Projects'},
    ...(isMobile?[]:[{id:'circle-gallery',name:'Gallery'}]),
    {id:'skills',name:'Skills'},
    {id:'contact',name:'Contact'},
  ].filter(s=>document.getElementById(s.id))

  const scrollY0   = window.scrollY||window.pageYOffset
  const zoneTop    = document.getElementById(sections[0].id).getBoundingClientRect().top+scrollY0
  const lastEl     = document.getElementById(sections[sections.length-1].id)
  const zoneBottom = lastEl.getBoundingClientRect().top+lastEl.offsetHeight+scrollY0

  const PIN_EXTRA = 2000
  const aboutEl = document.getElementById('about')
  const aboutPinExtra = aboutEl ? PIN_EXTRA : 0

  const zoneH = (zoneBottom - zoneTop) + aboutPinExtra + skillsPinExtra

  const segEls = []
  sections.forEach(sec => {
    const el = document.getElementById(sec.id)
    sec.top  = el.getBoundingClientRect().top + scrollY0
    const effectiveH = el.offsetHeight
      + (sec.id === 'about'  ? aboutPinExtra  : 0)
      + (sec.id === 'skills' ? skillsPinExtra : 0)
    sec.ratio = effectiveH / zoneH
    const seg  = document.createElement('div'); seg.className='st-seg'; seg.style.flex=sec.ratio.toFixed(4)
    const fill = document.createElement('div'); fill.className='st-seg-fill'
    seg.appendChild(fill); bar.appendChild(seg)
    seg.addEventListener('click',()=>lenis.scrollTo(document.getElementById(sec.id),{offset:0,duration:1.2}))
    segEls.push({seg,fill})
  })

  ScrollTrigger.create({
    trigger:'#'+sections[0].id, start:'top bottom',
    endTrigger:'#'+sections[sections.length-1].id, end:'bottom bottom',
    onUpdate(self){
      const progress=self.progress
      const docH=document.documentElement.scrollHeight-window.innerHeight
      pctEl.textContent='('+Math.round((window.scrollY/docH)*100)+')'
      if(progress<=0||progress>=0.90){
        timeline.classList.remove('visible'); pctEl.classList.remove('visible'); return
      }
      timeline.classList.add('visible'); pctEl.classList.add('visible')
      let cumul=0, activeIdx=0
      for(let i=0;i<sections.length;i++){
        const segEnd=cumul+sections[i].ratio
        if(progress<segEnd){
          segEls[i].fill.style.height=(Math.min(1,Math.max(0,(progress-cumul)/sections[i].ratio))*100).toFixed(1)+'%'
          activeIdx=i
          for(let j=i+1;j<sections.length;j++) segEls[j].fill.style.height='0%'
          break
        } else { segEls[i].fill.style.height='100%' }
        cumul=segEnd
      }
      label.textContent=sections[activeIdx].name
      label.style.top=(progress*100).toFixed(1)+'%'
    }
  })
}

export function setupContact(lenis) {
  const blobWrap   = document.getElementById('contact-blob-wrap')
  const blob       = document.getElementById('contact-blob')
  const title      = document.getElementById('contact-title')
  const socials    = document.getElementById('contact-socials')
  const mailEl     = document.getElementById('contact-mail')
  const dispo      = document.getElementById('contact-dispo')
  const frame      = document.getElementById('contact-frame')
  const dispo2     = document.getElementById('contact-dispo-2')
  const frame2     = document.getElementById('contact-frame-2')
  const contactBg  = document.getElementById('contact-bg')
  const stTimeline = document.getElementById('scroll-timeline')
  const pctEl      = document.getElementById('scroll-pct')
  const contactPin = document.getElementById('contact-pin')
  const footerEl   = document.getElementById('footer')
  if (!blob) return

  ScrollTrigger.create({
    trigger:'#contact', start:'top bottom', endTrigger:'#footer-transition', end:'bottom bottom',
    onEnter:()=>{blobWrap.style.visibility='visible';contactBg.style.display='block'},
    onLeave:()=>{blobWrap.style.visibility='hidden';contactBg.style.display='none'},
    onLeaveBack:()=>{blobWrap.style.visibility='hidden';contactBg.style.display='none'},
    onEnterBack:()=>{blobWrap.style.visibility='visible';contactBg.style.display='block'},
  })
  blobWrap.style.visibility='hidden'

  const tl = gsap.timeline({
    scrollTrigger:{trigger:'#contact',start:'top bottom',end:'bottom bottom',scrub:true}
  })
  tl.fromTo(blob,{scale:0},{scale:1,duration:0.6,ease:'none'},0)
  tl.to([stTimeline,pctEl],{opacity:0,duration:0.08},0.1)
  gsap.set(title,{yPercent:0,x:()=>window.innerWidth*1.1})
  tl.to(title,{x:0,duration:0.3,ease:'power3.out'},0.18)
  tl.fromTo(socials,{clipPath:'inset(0 0 100% 0)'},{clipPath:'inset(0 0 0% 0)',duration:0.2,ease:'none'},0.28)
  tl.fromTo(mailEl, {clipPath:'inset(0 0 100% 0)'},{clipPath:'inset(0 0 0% 0)',duration:0.2,ease:'none'},0.36)

  const pairStart=0.22, frameDur=0.65
  const frameY   =()=>window.innerHeight*1.1
  const frameYEnd=()=>-window.innerHeight*1.4
  const dispoY   =()=>window.innerHeight*1.1
  const dispoYEnd=()=>-window.innerHeight*1.65

  if (frame) {
    gsap.set(frame,{yPercent:-50,y:frameY})
    tl.to(frame,{y:frameYEnd,duration:frameDur,ease:'none'},pairStart)
  }
  if (dispo) {
    gsap.set(dispo,{yPercent:-50,y:dispoY,opacity:1,clipPath:'inset(0% 0 0% 0)'})
    tl.to(dispo,{y:dispoYEnd,duration:frameDur,ease:'none'},pairStart)
    tl.to(dispo,{opacity:0,clipPath:'inset(100% 0 0% 0)',duration:0.15,ease:'power2.in'},pairStart+0.45)
  }
  if (frame2) {
    gsap.set(frame2,{yPercent:-50,y:()=>window.innerHeight*1.3})
    tl.to(frame2,{y:frameYEnd,duration:frameDur,ease:'none'},pairStart+0.07)
  }
  if (dispo2) {
    gsap.set(dispo2,{yPercent:-50,y:frameY,opacity:1,clipPath:'inset(0% 0 0% 0)'})
    tl.to(dispo2,{y:dispoYEnd,duration:frameDur,ease:'none'},pairStart)
    tl.to(dispo2,{opacity:0,clipPath:'inset(100% 0 0% 0)',duration:0.15,ease:'power2.in'},pairStart+0.45)
  }

  // footer transition
  const ftl = gsap.timeline({
    scrollTrigger:{
      trigger:'#footer-transition', start:'top bottom+=550', end:'bottom bottom',
      scrub:true,
      onUpdate(self){
        if(self.progress>0.2){contactBg.style.display='none'}
        else{contactBg.style.display='block'}
      }
    }
  })
  ftl.set(blobWrap,{height:'110vh',overflow:'hidden',borderRadius:'0 0 0px 0px'},0)
  ftl.to(blobWrap,{borderRadius:'0 0 50px 50px',duration:0.15,ease:'power2.out'},0)
  ftl.to(blobWrap,{y:()=>-(window.innerHeight*1.8+400),immediateRender:false,duration:1.0,ease:'none'},0)
  ftl.to(contactPin,{y:'-40vh',pointerEvents:'none',immediateRender:false,duration:1.0,ease:'none'},0)
  ftl.fromTo([socials,mailEl],{clipPath:'inset(0 0 0% 0)'},{clipPath:'inset(0 0 100% 0)',duration:0.1,ease:'none'},0)
  ftl.fromTo(title,{clipPath:'inset(0 0 0% 0)'},{clipPath:'inset(0 0 100% 0)',duration:0.25,ease:'power2.in'},0)

  // footer visibility
  ScrollTrigger.create({
    trigger:'#footer-transition', start:'top bottom+=500', end:'bottom bottom',
    onEnter:()=>{ footerEl.style.visibility='visible' },
    onLeaveBack:()=>{ footerEl.style.visibility='hidden' },
  })
}
