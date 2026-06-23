import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { PROJECTS } from '../data'

const isMobile = navigator.maxTouchPoints > 1

export function setupProjects(lenis, openProjectFn) {
  const items   = document.querySelectorAll('.proj-item')
  const card    = document.getElementById('proj-card')
  const cover   = document.getElementById('proj-cover')
  const dateEl  = document.getElementById('proj-date')
  const preview = document.getElementById('proj-preview')
  let currentIdx = -1
  gsap.set(card, { opacity: 0 })

  // preload covers
  items.forEach(item => {
    const img = new Image(); img.src = item.dataset.img
    if (img.decode) img.decode().catch(() => {})
  })

  let _visible = false
  ScrollTrigger.create({
    trigger: '#projects', start: 'top 80%', end: 'bottom 20%',
    onEnter:      () => { preview.classList.add('visible');    _visible = true  },
    onLeave:      () => { preview.classList.remove('visible'); _visible = false },
    onEnterBack:  () => { preview.classList.add('visible');    _visible = true  },
    onLeaveBack:  () => { preview.classList.remove('visible'); _visible = false },
  })

  const itemQuickX = [...items].map(item => gsap.quickTo(item,'x',{duration:0.6,ease:'power2.out'}))

  items.forEach((item, i) => {
    item.addEventListener('click', () => {
      if (item.classList.contains('active')) {
        openProjectFn(item.dataset.id, item)
      } else {
        activateProject(i)
        let docTop=0, el=item
        while(el){docTop+=el.offsetTop;el=el.offsetParent}
        lenis.scrollTo(docTop - window.innerHeight/2 + item.offsetHeight/2, {duration:1.2})
      }
    })
  })
  cover.addEventListener('click', () => {
    if (currentIdx >= 0) openProjectFn(items[currentIdx].dataset.id, items[currentIdx])
  })

  function onScroll() {
    if (!_visible) { if (currentIdx>=0) deactivateAll(); return }
    const cy = window.innerHeight/2, halfH = window.innerHeight/2
    let closestIdx=-1, closestDist=Infinity
    items.forEach((item,i) => {
      const rect = item.getBoundingClientRect()
      const itemCy = rect.top + rect.height/2
      const dist = Math.abs(itemCy - cy)
      itemQuickX[i](Math.min(dist/halfH,1)*80)
      if (dist < closestDist) { closestDist=dist; closestIdx=i }
    })
    if (closestIdx>=0 && closestDist < window.innerHeight*0.45) activateProject(closestIdx)
    else deactivateAll()
  }
  lenis.on('scroll', onScroll)
  onScroll()

  function deactivateAll() {
    if (currentIdx>=0) items[currentIdx].classList.remove('active')
    currentIdx=-1
    gsap.to(card,{opacity:0,duration:0.25,ease:'power2.in'})
  }
  function activateProject(i) {
    if (i===currentIdx) return
    if (currentIdx>=0) items[currentIdx].classList.remove('active')
    items[i].classList.add('active')
    if (currentIdx===-1) {
      cover.src = items[i].dataset.img; dateEl.textContent=items[i].dataset.date
      gsap.to(card,{opacity:1,duration:0.4,ease:'power2.out'})
    } else {
      gsap.to(card,{opacity:0,duration:0.18,ease:'power2.in',onComplete:()=>{
        cover.src=items[i].dataset.img; dateEl.textContent=items[i].dataset.date
        gsap.to(card,{opacity:1,duration:0.3,ease:'power2.out'})
      }})
    }
    currentIdx=i
  }

  // cursor
  const projCursor = document.getElementById('proj-cursor')
  const qCursorX = gsap.quickTo(projCursor,'left',{duration:0.35,ease:'power3.out'})
  const qCursorY = gsap.quickTo(projCursor,'top', {duration:0.35,ease:'power3.out'})
  let _tiltRY=0,_tiltRX=0,_tiltTargetRY=0,_tiltTargetRX=0
  cover.addEventListener('mouseenter',()=>projCursor.classList.add('active'))
  cover.addEventListener('mouseleave',()=>projCursor.classList.remove('active'))
  document.addEventListener('mousemove', e => {
    if (_visible) { qCursorX(e.clientX); qCursorY(e.clientY) }
    if (_visible) {
      const rect=card.getBoundingClientRect()
      const cx=rect.left+rect.width/2, cy=rect.top+rect.height/2
      _tiltTargetRY = Math.max(-1,Math.min(1,(e.clientX-cx)/(rect.width/2)))*6
      _tiltTargetRX = -Math.max(-1,Math.min(1,(e.clientY-cy)/(rect.height/2)))*5
    }
  })
  gsap.ticker.add(()=>{
    if (_visible) {
      _tiltRY += (_tiltTargetRY-_tiltRY)*0.12
      _tiltRX += (_tiltTargetRX-_tiltRX)*0.12
      card.style.transform=`rotateY(${_tiltRY.toFixed(2)}deg) rotateX(${_tiltRX.toFixed(2)}deg)`
    }
  })

  // fluid line — starts when first project centres, ends when last project centres
  const linePath = document.getElementById('fluid-line')
  const lineLen  = linePath.getTotalLength()
  gsap.set(linePath,{strokeDasharray:lineLen,strokeDashoffset:lineLen})
  gsap.to(linePath,{
    strokeDashoffset:0, ease:'none',
    scrollTrigger:{
      trigger:'.proj-item:first-child',
      start:'center center',
      endTrigger:'.proj-item:last-child',
      end:'center center',
      scrub:1
    }
  })

  // circle gallery
  if (!isMobile && window.innerWidth > 768) setupCircleGallery()
}

function setupCircleGallery() {
  const vw=window.innerWidth, vh=window.innerHeight
  const SLICES=10
  const imgW=Math.min(Math.max(120,vw*0.14),210)
  const imgH=imgW*2/3
  const orbitR=(vw*0.34+500)/2
  const bendRad=imgW/orbitR
  const cylR=orbitR
  const sliceW=imgW/SLICES
  const totalBendDeg=bendRad*180/Math.PI
  const stepDeg=totalBendDeg/SLICES

  document.querySelectorAll('.cg-img').forEach(img => {
    const src=img.getAttribute('src')
    const wrapper=document.createElement('div')
    wrapper.className='cg-img'
    for(let s=0;s<SLICES;s++){
      const sl=document.createElement('div')
      sl.className='cg-slice'
      const dw=sliceW+1.5
      sl.style.width=dw.toFixed(1)+'px'
      sl.style.left='50%'
      sl.style.marginLeft=(-dw/2).toFixed(1)+'px'
      sl.style.backgroundImage=`url(${src})`
      sl.style.backgroundSize=`${imgW.toFixed(1)}px ${imgH.toFixed(1)}px`
      sl.style.backgroundPosition=`${(-s*sliceW).toFixed(1)}px 0`
      sl.style.transformOrigin=`50% 50% ${(-cylR).toFixed(1)}px`
      sl.style.transform=`rotateY(${((s-(SLICES-1)/2)*stepDeg).toFixed(2)}deg)`
      wrapper.appendChild(sl)
    }
    img.parentNode.replaceChild(wrapper,img)
  })

  const cgImgs      = gsap.utils.toArray('.cg-img')
  const cgPhrase    = document.getElementById('cg-phrase')
  const cgCaption   = document.getElementById('cg-caption')
  const cgCaptionTx = document.getElementById('cg-caption-text')
  const count       = cgImgs.length

  const CAPTIONS = [
    'Winner at Techgyan GEN AI Hackathon, NIT Trichy',
    'Winner at Android App Development Hackathon, IIT Madras',
    "Winner at Appathon '25 - 12 hrs App Development Hackathon, SCT Salem",
    'Awarded as the youngest team for active involvement & outstanding achievements in High-Level Competitions.',
    'Finalists of Aventus 3.0 (24-hrs Hackathon), Dayananda Sagar College of Engineering, Bangalore.',
    'Finalists of Sustain-A-Thon 2025 (UNSDGs Hackathon), Sharda University, Greater Noida, UP.',
    'Finalists of AI Ignite 2026 (Agentic AI Hackathon), SMVEC Puducherry.',
    'Finalists Agentica 2.0 (60-hrs Hackathon), IIIT SriCity.',
  ]

  // wrap phrase words
  const walker=document.createTreeWalker(cgPhrase,NodeFilter.SHOW_TEXT)
  const tnodes=[]; while(walker.nextNode()) tnodes.push(walker.currentNode)
  tnodes.forEach(node=>{
    const words=node.textContent.split(/(\s+)/)
    const frag=document.createDocumentFragment()
    words.forEach(w=>{
      if(/^\s+$/.test(w)){frag.appendChild(document.createTextNode(w))}
      else if(w){const sp=document.createElement('span');sp.className='word';sp.textContent=w;frag.appendChild(sp)}
    })
    node.parentNode.replaceChild(frag,node)
  })
  const cgPhraseWords = gsap.utils.toArray('#cg-phrase .word')

  const rx=vw*0.34, rz=500, tiltY=180, offsetY=-80
  const entryAngle=Math.PI/2, offX=vw*0.85
  const stagger=0.09, totalRange=1+stagger*(count-1)

  function getPos(t) {
    if(t<=0.12){const p=t/0.12;return{x:-offX*(1-p),y:tiltY+offsetY,z:rz*p,rotY:0}}
    if(t<=0.88){
      const p=(t-0.12)/0.76
      const angle=entryAngle-p*Math.PI*2
      return{x:Math.cos(angle)*rx,y:(Math.sin(angle)*rz/rz)*tiltY+offsetY,z:Math.sin(angle)*rz,rotY:p*Math.PI*2}
    }
    const p=(t-0.88)/0.12
    return{x:offX*p,y:tiltY+offsetY,z:rz*(1-p),rotY:Math.PI*2}
  }

  cgImgs.forEach(img=>{ img.style.opacity='0' })
  gsap.set(cgCaption, {opacity:0})
  let lastCaptionIdx = -1

  ScrollTrigger.create({
    trigger:'#circle-gallery',start:'top top',end:'bottom bottom',
    pin:'#circle-gallery-pin',
    onUpdate(self){
      const progress=self.progress
      // centreIdx: highest image whose imgT is in [0.13, 0.94] — purely derived, no flags
      let centreIdx = -1

      cgImgs.forEach((img,i)=>{
        const imgT=progress*totalRange-i*stagger
        if(imgT<=0||imgT>=1){img.style.opacity='0';return}
        let alpha=1
        if(imgT<0.06)alpha=imgT/0.06; else if(imgT>0.94)alpha=(1-imgT)/0.06
        const pos=getPos(imgT)
        img.style.transform=`translate3d(${pos.x.toFixed(1)}px,${pos.y.toFixed(1)}px,${pos.z.toFixed(1)}px) rotateY(${(pos.rotY*180/Math.PI).toFixed(1)}deg)`
        img.style.opacity=alpha
        img.style.zIndex=Math.round(pos.z+600)
        if(imgT>=0.09 && imgT<0.15) centreIdx=Math.max(centreIdx,i)
      })

      // caption swaps cleanly in both directions
      if(centreIdx!==lastCaptionIdx){
        lastCaptionIdx=centreIdx
        gsap.killTweensOf(cgCaption)
        if(centreIdx>=0){
          cgCaptionTx.textContent=CAPTIONS[centreIdx]
          gsap.fromTo(cgCaption,{opacity:0,y:10},{opacity:1,y:0,duration:0.4,ease:'power2.out'})
        } else {
          gsap.to(cgCaption,{opacity:0,duration:0.3,ease:'power2.in'})
        }
      }

      // phrase — starts after 8th caption clears (~progress 0.93), runs to end
      const ps=0.479,pe=0.99,travelY=60
      if(centreIdx>=0||progress<ps){cgPhrase.style.opacity='0';return}
      const gp=Math.min(1,(progress-ps)/(pe-ps))
      cgPhrase.style.transform=`translateY(${(travelY*(0.5-gp)).toFixed(1)}px)`
      cgPhraseWords.forEach((w,wi)=>{
        const rEnd=0.5
        if(gp<rEnd){
          const revP=gp/rEnd
          const wP=Math.max(0,Math.min(1,(revP*(cgPhraseWords.length+4)-wi)/3))
          w.style.opacity=wP;w.style.filter=`blur(${(8*(1-wP)).toFixed(1)}px)`
        } else {w.style.opacity='1';w.style.filter='blur(0px)'}
      })
      let alpha=1
      if(gp<0.08)alpha=gp/0.08
      cgPhrase.style.opacity=alpha
    }
  })
}
