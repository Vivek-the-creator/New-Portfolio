import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

export function setupSkills() {
  const groups = document.querySelectorAll('.skill-group')
  const firstBody = groups[0].querySelector('.skill-body')
  firstBody.style.height = firstBody.scrollHeight + 'px'

  groups.forEach(group => {
    group.querySelector('.skill-header').addEventListener('click', () => {
      if (group.classList.contains('open')) return
      groups.forEach(g => {
        if (g.classList.contains('open')) {
          g.classList.remove('open')
          gsap.to(g.querySelector('.skill-body'),{height:0,duration:0.45,ease:'power3.inOut'})
        }
      })
      group.classList.add('open')
      const body = group.querySelector('.skill-body')
      gsap.to(body,{height:body.scrollHeight,duration:0.45,ease:'power3.inOut',
        onComplete:()=>ScrollTrigger.refresh()})
    })
  })

  // skills arrow
  const arrow = document.getElementById('skills-arrow')
  if (arrow) {
    gsap.fromTo(arrow,{xPercent:0},{
      xPercent:100,
      x:()=>{
        const left=arrow.parentElement
        const pad=parseFloat(getComputedStyle(left).paddingLeft)+parseFloat(getComputedStyle(left).paddingRight)
        return left.clientWidth-pad-arrow.offsetWidth
      },
      ease:'none',
      scrollTrigger:{trigger:'#skills',start:'top top',endTrigger:'#contact',end:'top center',scrub:0.5}
    })
  }
}

export function setupScrollTimeline(lenis) {
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

  // Extra scroll distance added by the pinned CardSwap inside #about
  const PIN_EXTRA = 2000
  const aboutEl = document.getElementById('about')
  const aboutPinExtra = aboutEl ? PIN_EXTRA : 0

  const zoneH      = (zoneBottom-zoneTop) + aboutPinExtra

  const segEls = []
  sections.forEach(sec => {
    const el=document.getElementById(sec.id)
    sec.top    = el.getBoundingClientRect().top+scrollY0
    const effectiveH = el.offsetHeight + (sec.id === 'about' ? aboutPinExtra : 0)
    sec.ratio  = effectiveH/zoneH
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
