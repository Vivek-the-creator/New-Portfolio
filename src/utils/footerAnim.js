import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

const POOLS = [' ','·.,',':;`-~^','=+<>?!:;','|/\\()[]{}«»','÷×±≈≠≤≥∞∑∏√∫','¤†‡§¶©®™°¬','%&#$@¥€£¢']
let seed = 42
function rand() { seed=(seed*16807+0)%2147483647; return seed/2147483647 }

function imageToAscii(img, cols) {
  seed = 42
  const c=document.createElement('canvas'), ctx=c.getContext('2d')
  const rows=Math.round(cols*(img.height/img.width))
  c.width=cols; c.height=rows
  ctx.drawImage(img,0,0,cols,rows)
  const data=ctx.getImageData(0,0,cols,rows).data
  const lines=[], poolGrid=[]
  for(let y=0;y<rows;y++){
    let line=''; const poolRow=[]
    for(let x=0;x<cols;x++){
      const i=(y*cols+x)*4
      const r=data[i],g=data[i+1],b=data[i+2],a=data[i+3]
      if(a<15){line+=' ';poolRow.push(-1);continue}
      const brightness=(0.299*r+0.587*g+0.114*b)/255*(a/255)
      const pi=Math.min(Math.floor(brightness*(POOLS.length-1)*0.8),POOLS.length-1)
      line+=POOLS[pi][Math.floor(rand()*POOLS[pi].length)]
      poolRow.push(pi)
    }
    lines.push(line); poolGrid.push(poolRow)
  }
  return { text:lines.join('\n'), poolGrid }
}

function setupHover(preEl, poolGrid) {
  let origGrid=null
  const cols=poolGrid[0]?poolGrid[0].length:1
  const rows=poolGrid.length
  const noise=Array.from({length:rows},(_,y)=>Array.from({length:cols},(_,x)=>((Math.sin(x*12.9898+y*78.233)*43758.5453%1)+1)%1*5-2.5))
  const hitTime=Array.from({length:rows},()=>new Float64Array(cols))
  const cellDur=Array.from({length:rows},(_,y)=>Array.from({length:cols},(_,x)=>noise[y][x]>0?200:100))
  let animating=false

  function init() {
    origGrid=preEl.textContent.split('\n').map(l=>l.split(''))
  }

  preEl.addEventListener('mousemove', e => {
    if(!origGrid) init()
    const rect=preEl.getBoundingClientRect()
    const charW=rect.width/cols, charH=rect.height/rows
    const mxC=(e.clientX-rect.left)/charW, myC=(e.clientY-rect.top)/charH
    const now=performance.now(), r=2.5+3
    for(let y=Math.max(0,Math.floor(myC-r));y<=Math.min(rows-1,Math.ceil(myC+r));y++){
      for(let x=Math.max(0,Math.floor(mxC-r));x<=Math.min(cols-1,Math.ceil(mxC+r));x++){
        const dx=x-mxC, dy=y-myC, nr=2.5+noise[y][x]
        if(dx*dx+dy*dy<nr*nr) hitTime[y][x]=now
      }
    }
    if(!animating){animating=true;tick()}
  })
  preEl.addEventListener('mouseleave', ()=>{})

  function esc(ch){return ch==='<'?'&lt;':ch==='>'?'&gt;':ch==='&'?'&amp;':ch}
  function tick(){
    const now=performance.now(); let anyActive=false; let html=''
    for(let y=0;y<rows;y++){
      for(let x=0;x<cols;x++){
        const pi=poolGrid[y][x]
        if(pi<0||pi===0){html+=' ';continue}
        const elapsed=now-hitTime[y][x]
        if(hitTime[y][x]>0&&elapsed<cellDur[y][x]){
          anyActive=true
          const pool=POOLS[(POOLS.length-1)-pi]
          html+=`<span style="color:#0a0a0a;background:#ff3b14">${esc(pool[Math.floor(Math.random()*pool.length)])}</span>`
        } else { html+=esc(origGrid[y][x]) }
      }
      html+='\n'
    }
    preEl.innerHTML=html
    if(anyActive) requestAnimationFrame(tick)
    else { animating=false; if(origGrid) preEl.textContent=origGrid.map(r=>r.join('')).join('\n') }
  }
}

function loadAndRender(src, targetId, cols) {
  const img=new Image(); img.crossOrigin='anonymous'
  img.onload=()=>{
    const el=document.getElementById(targetId)
    if(el){ const res=imageToAscii(img,cols); el.textContent=res.text; setupHover(el,res.poolGrid) }
  }
  img.src=src
}

export function setupFooter() {
  loadAndRender('/assets/images/footer/left.png',  'ascii-left',  80)
  loadAndRender('/assets/images/footer/right.png', 'ascii-right', 80)

  const leftWrap  = document.querySelector('.footer-ascii.left')
  const rightWrap = document.querySelector('.footer-ascii.right')
  if (leftWrap) {
    gsap.fromTo(leftWrap, {xPercent:-100},{xPercent:0,ease:'none',scrollTrigger:{trigger:'#footer-transition',start:'top bottom',end:'bottom bottom',scrub:true}})
  }
  if (rightWrap) {
    gsap.fromTo(rightWrap,{xPercent:100},{xPercent:0,ease:'none',scrollTrigger:{trigger:'#footer-transition',start:'top bottom',end:'bottom bottom',scrub:true}})
  }

  // mouse parallax
  let mx=0,my=0,sx=0,sy=0, footerVisible=false
  const leftPre=document.getElementById('ascii-left'), rightPre=document.getElementById('ascii-right')
  document.addEventListener('mousemove',e=>{mx=(e.clientX/window.innerWidth-0.5)*2;my=(e.clientY/window.innerHeight-0.5)*2})
  function parallaxLoop(){
    if(!footerVisible) return
    sx+=(mx-sx)*0.05; sy+=(my-sy)*0.05
    if(leftPre)  leftPre.style.transform =`translate(${Math.min(0,sx*-15-15)}px,${sy*-10}px)`
    if(rightPre) rightPre.style.transform=`translate(${Math.max(0,sx*15+15)}px,${sy*-10}px)`
    requestAnimationFrame(parallaxLoop)
  }
  ScrollTrigger.create({
    trigger:'#footer-transition', start:'top bottom', end:'bottom bottom',
    onEnter:()=>{footerVisible=true;parallaxLoop()},
    onEnterBack:()=>{footerVisible=true;parallaxLoop()},
    onLeaveBack:()=>{footerVisible=false},
  })


  // footer name chars animation
  function rebuildChars(el, keepFirst) {
    const text=el.textContent; el.textContent=''; const inners=[]
    for(let i=0;i<text.length;i++){
      const outer=document.createElement('span')
      outer.style.cssText='display:inline-block;overflow:hidden;vertical-align:top;padding:0.1em 0.3em;margin:-0.1em -0.3em;'
      if(keepFirst&&i===0) outer.className='first-letter'
      const inner=document.createElement('span')
      inner.style.cssText='display:inline-block;will-change:transform;'
      inner.textContent=text[i]; outer.appendChild(inner); el.appendChild(outer); inners.push(inner)
    }
    return inners
  }
  const vivekEl   = document.querySelector('.footer-name-vivek')
  const karthikeyanEl= document.querySelector('.footer-name-karthikeyan')

  if(vivekEl&&karthikeyanEl){
    const vivekChars   = rebuildChars(vivekEl,true)
    const karthikeyanChars= rebuildChars(karthikeyanEl,false)
    const dotEl       = document.querySelector('.footer-name-dot')
    const dotChars    = dotEl?rebuildChars(dotEl,false):[]
    const vivekRev     = vivekChars.slice().reverse()
    const rightSide   = karthikeyanChars.concat(dotChars)
    const ordered=[]
    for(let i=0;i<Math.max(vivekRev.length,rightSide.length);i++){
      if(rightSide[i]) ordered.push(rightSide[i])
      if(vivekRev[i])   ordered.push(vivekRev[i])
    }
    gsap.set(ordered,{yPercent:110})
    gsap.to(ordered,{
      yPercent:0, ease:'power3.out', stagger:{each:0.04,from:'start'},
      scrollTrigger:{trigger:'#footer-transition',start:'top+=100px bottom',end:'bottom bottom',scrub:true}
    })
  }
}
