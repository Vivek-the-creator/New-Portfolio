import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { PROJECTS } from '../data'

let projectOpen = false
let _flyingSourceItem = null
let _galleryRAF = null
let _galleryY = 0, _galleryMaxScroll = 0
let _qGalleryY = null
let _activeThumbIdx = -1, _thumbImgs = [], _cachedSelImg = null

export function isProjectOpen() { return projectOpen }

export function setupProjectDetail(lenis) {
  const detailEl         = document.getElementById('project-detail')
  const detailTitle      = document.getElementById('detail-title')
  const detailTitleWrap  = document.getElementById('detail-title-wrap')
  const detailYear       = document.getElementById('detail-year')
  const detailDesc       = document.getElementById('detail-desc')
  const detailTags       = document.getElementById('detail-tags')
  const detailThumbsInner= document.getElementById('detail-thumbs-inner')
  const detailSelected   = document.getElementById('detail-selected')
  const detailGalleryWrap= document.getElementById('detail-gallery-wrap')
  const detailThumbs     = document.getElementById('detail-thumbs')
  const flyingTitle      = document.getElementById('flying-title')
  const pageFade         = document.getElementById('page-fade')
  const detailBack       = document.getElementById('detail-back')

  function updateActiveThumb() {
    if (!projectOpen) return
    if (!_thumbImgs.length) { _galleryRAF=requestAnimationFrame(updateActiveThumb); return }
    const thumbsRect=detailThumbs.getBoundingClientRect()
    const cy=thumbsRect.top+thumbsRect.height/2
    let closestIdx=0, closestDist=Infinity
    for(let i=0;i<_thumbImgs.length;i++){
      const rect=_thumbImgs[i].getBoundingClientRect()
      const imgCy=rect.top+rect.height/2
      const dist=Math.abs(imgCy-cy)
      if(dist<closestDist){closestDist=dist;closestIdx=i}
      const t=Math.max(0,1-dist/(thumbsRect.height*0.45))
      _thumbImgs[i].style.width=(100+t*t*t*40)+'%'
    }
    if(closestIdx!==_activeThumbIdx){
      if(_activeThumbIdx>=0&&_thumbImgs[_activeThumbIdx]) _thumbImgs[_activeThumbIdx].classList.remove('active')
      _thumbImgs[closestIdx].classList.add('active')
      _activeThumbIdx=closestIdx
      if(_cachedSelImg) _cachedSelImg.src=_thumbImgs[closestIdx].src
    }
    _galleryRAF=requestAnimationFrame(updateActiveThumb)
  }

  function openProject(id, clickedItem) {
    const proj = PROJECTS.find(p=>p.id===id)
    if (!proj||projectOpen) return
    projectOpen=true; _flyingSourceItem=clickedItem
    history.pushState({project:id},'','#'+id)
    lenis.stop()

    const stT=document.getElementById('scroll-timeline'), pctE=document.getElementById('scroll-pct')
    if(stT) stT.style.setProperty('display','none','important')
    if(pctE) pctE.style.setProperty('display','none','important')

    const rect=clickedItem.getBoundingClientRect()
    const cs=getComputedStyle(clickedItem)
    flyingTitle.textContent=clickedItem.textContent
    flyingTitle.style.fontSize=parseFloat(cs.fontSize)+'px'
    flyingTitle.style.lineHeight=cs.lineHeight
    flyingTitle.style.letterSpacing=cs.letterSpacing
    flyingTitle.style.paddingTop=cs.paddingTop
    flyingTitle.style.paddingBottom=cs.paddingBottom
    gsap.set(flyingTitle,{left:rect.left,top:rect.top,opacity:1,scale:1,x:0,y:0,transformOrigin:'left top'})
    clickedItem.style.visibility='hidden'

    detailTitle.textContent=clickedItem.textContent
    detailYear.textContent=proj.year
    detailDesc.textContent=proj.desc
    detailTags.innerHTML=proj.tags.map(t=>`<span class="detail-tag">${t}</span>`).join('')
    + `<a class="detail-github" href="${proj.github}" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
        <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
      </a>`
    const allImages=[clickedItem.dataset.img,...proj.images]
    detailThumbsInner.innerHTML=allImages.map(src=>`<img src="${src}" alt="" decoding="async">`).join('')
    detailSelected.innerHTML=`<img src="${allImages[0]}" alt="" decoding="async">`
    detailThumbsInner.querySelectorAll('img').forEach((img,i)=>{
      if(img.decode) img.decode().catch(()=>{})
      img.addEventListener('click',()=>{
        if(_activeThumbIdx>=0&&_thumbImgs[_activeThumbIdx]) _thumbImgs[_activeThumbIdx].classList.remove('active')
        img.classList.add('active'); _activeThumbIdx=i
        if(_cachedSelImg) _cachedSelImg.src=img.src
      })
    })
    _activeThumbIdx=0; _thumbImgs=[...detailThumbsInner.querySelectorAll('img')]
    _thumbImgs[0].classList.add('active'); _cachedSelImg=detailSelected.querySelector('img')
    _galleryY=0; gsap.set(detailThumbsInner,{y:0})

    const remPx=parseFloat(getComputedStyle(document.documentElement).fontSize)
    const targetTop=window.innerHeight*0.22, targetLeft=remPx*4
    const targetFontSize=Math.min(Math.max(window.innerWidth*0.05,remPx*3),remPx*5)

    const tl=gsap.timeline()
    tl.to(pageFade,{opacity:1,duration:0.8,ease:'power2.inOut'},0)
    tl.to(flyingTitle,{top:targetTop,left:targetLeft,fontSize:targetFontSize,paddingTop:0,paddingBottom:0,duration:1,ease:'power3.inOut'},0.3)
    tl.to(detailEl,{opacity:1,duration:0.4,ease:'power2.out',onStart:()=>detailEl.classList.add('active')},1.0)
    tl.set(flyingTitle,{opacity:0},1.1)
    tl.set(detailTitleWrap,{opacity:1},1.1)
    tl.to(detailDesc,{opacity:1,duration:0.6,ease:'power2.out'},1.2)
    tl.to(detailTags,{opacity:1,duration:0.5,ease:'power2.out'},1.3)
    tl.to(detailBack,{opacity:1,duration:0.5,ease:'power2.out'},1.3)
    tl.fromTo(detailGalleryWrap,{opacity:0},{opacity:1,duration:0.8,ease:'power3.out'},1.2)
    tl.add(()=>{
      _galleryMaxScroll=Math.max(0,detailThumbsInner.scrollHeight-detailThumbs.clientHeight)
      _qGalleryY=gsap.quickTo(detailThumbsInner,'y',{duration:0.8,ease:'power2.out'})
      _galleryRAF=requestAnimationFrame(updateActiveThumb)
    })
  }

  function closeProject() {
    if (!projectOpen) return
    projectOpen=false
    if(_galleryRAF){cancelAnimationFrame(_galleryRAF);_galleryRAF=null}
    _qGalleryY=null
    history.pushState(null,'',window.location.pathname)

    const stT=document.getElementById('scroll-timeline'), pctE=document.getElementById('scroll-pct')
    if(stT) stT.style.removeProperty('display')
    if(pctE) pctE.style.removeProperty('display')

    const tl=gsap.timeline()
    tl.to([detailDesc,detailTags,detailBack],{opacity:0,duration:0.3,ease:'power2.in'},0)
    tl.to(detailGalleryWrap,{opacity:0,duration:0.4,ease:'power2.in'},0)

    const dtRect=detailTitle.getBoundingClientRect()
    const dtCs=getComputedStyle(detailTitle)
    flyingTitle.textContent=detailTitle.textContent
    flyingTitle.style.fontSize=dtCs.fontSize
    flyingTitle.style.lineHeight=dtCs.lineHeight
    flyingTitle.style.letterSpacing=dtCs.letterSpacing
    flyingTitle.style.paddingTop='0'; flyingTitle.style.paddingBottom='0'
    gsap.set(flyingTitle,{left:dtRect.left,top:dtRect.top,opacity:1,x:0,y:0})
    gsap.set(detailTitleWrap,{opacity:0})
    tl.to(detailEl,{opacity:0,duration:0.4,ease:'power2.in'},0.2)
    if(_flyingSourceItem){
      const ir=_flyingSourceItem.getBoundingClientRect(), ic=getComputedStyle(_flyingSourceItem)
      tl.to(flyingTitle,{left:ir.left,top:ir.top,fontSize:parseFloat(ic.fontSize),paddingTop:ic.paddingTop,paddingBottom:ic.paddingBottom,duration:0.9,ease:'power3.inOut'},0.3)
    }
    tl.to(pageFade,{opacity:0,duration:0.6,ease:'power2.out'},0.5)
    tl.add(()=>{
      detailEl.classList.remove('active')
      gsap.set([detailTitleWrap,detailDesc,detailTags,detailBack,detailGalleryWrap],{opacity:0})
      gsap.set(flyingTitle,{opacity:0})
      _activeThumbIdx=-1; _thumbImgs=[]; _cachedSelImg=null
      if(_flyingSourceItem){_flyingSourceItem.style.visibility='';_flyingSourceItem=null}
      lenis.start(); ScrollTrigger.refresh()
    })
  }

  detailEl.addEventListener('wheel', e=>{
    if(!projectOpen) return; e.preventDefault()
    const delta=Math.abs(e.deltaY)>Math.abs(e.deltaX)?e.deltaY:e.deltaX
    _galleryY=Math.max(-_galleryMaxScroll,Math.min(0,_galleryY-delta))
    if(_qGalleryY) _qGalleryY(_galleryY)
  },{passive:false})

  let _touchStartY=0
  detailEl.addEventListener('touchstart', e=>{if(projectOpen) _touchStartY=e.touches[0].clientY},{passive:true})
  detailEl.addEventListener('touchmove', e=>{
    if(!projectOpen) return; e.preventDefault()
    const delta=_touchStartY-e.touches[0].clientY
    _touchStartY=e.touches[0].clientY
    _galleryY=Math.max(-_galleryMaxScroll,Math.min(0,_galleryY-delta))
    if(_qGalleryY) _qGalleryY(_galleryY)
  },{passive:false})

  detailBack.addEventListener('click', closeProject)
  window.addEventListener('popstate', ()=>{ if(projectOpen) closeProject() })

  return { openProject }
}
