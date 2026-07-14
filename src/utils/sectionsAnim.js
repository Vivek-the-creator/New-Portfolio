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
    lenis.start()
    lenis.scrollTo(targetScroll, {
      duration: 0.85,
      ease: (t) => 1 - Math.pow(1 - t, 3),
      onComplete: () => {
        isTransitioning = false
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

export function setupScrollTimeline(lenis) {
  const timeline = document.getElementById('scroll-timeline')
  const bar      = document.getElementById('st-bar')
  const label    = document.getElementById('st-label')
  const pctEl    = document.getElementById('scroll-pct')
  if (!timeline || !bar || !label || !pctEl) return

  const isMobile = window.innerWidth <= 768
  const sections = [
    { id: 'scroll-wrap', name: 'Home' },
    { id: 'about', name: 'About Me' },
    { id: 'projects', name: 'Projects' },
    ...(isMobile ? [] : [{ id: 'circle-gallery', name: 'Gallery' }]),
    { id: 'skills', name: 'Skills' },
    { id: 'certifications', name: 'Certificates' },
    { id: 'internships', name: 'Internships' },
    { id: 'contact', name: 'Contact' },
    { id: 'footer-transition', name: 'Footer', scrollId: 'footer-transition' },
  ].filter(s => document.getElementById(s.id))

  if (sections.length < 2) return

  bar.innerHTML = ''

  const segEls = sections.map(sec => {
    const seg = document.createElement('div')
    seg.className = 'st-seg'
    const fill = document.createElement('div')
    fill.className = 'st-seg-fill'
    seg.appendChild(fill)
    bar.appendChild(seg)
    seg.addEventListener('click', () => {
      const target = document.getElementById(sec.scrollId || sec.id)
      if (target) lenis?.scrollTo(target, { offset: 0, duration: 1.15 })
    })
    return { seg, fill }
  })

  let zoneTop = 0
  let zoneBottom = 1

  const getTop = (el) => {
    return el.getBoundingClientRect().top + (window.scrollY || window.pageYOffset)
  }

  function getVisibleSectionIndex() {
    const viewH = window.innerHeight
    let bestIndex = -1
    let bestScore = 0

    sections.forEach((sec, index) => {
      const el = document.getElementById(sec.id)
      if (!el) return
      const rect = el.getBoundingClientRect()
      const visible = Math.min(rect.bottom, viewH) - Math.max(rect.top, 0)
      if (visible <= 0) return

      const centerDistance = Math.abs((rect.top + rect.bottom) / 2 - viewH * 0.45)
      const centerScore = Math.max(0, 1 - centerDistance / viewH)
      const score = visible / viewH + centerScore * 0.35
      if (score > bestScore) {
        bestScore = score
        bestIndex = index
      }
    })

    if (bestIndex >= 0) {
      const galleryIndex = sections.findIndex(sec => sec.id === 'circle-gallery')
      const projectsIndex = sections.findIndex(sec => sec.id === 'projects')
      if (bestIndex === galleryIndex && projectsIndex >= 0) {
        const galleryRect = document.getElementById('circle-gallery')?.getBoundingClientRect()
        if (galleryRect && galleryRect.top > window.innerHeight * 0.18) return projectsIndex
      }
      return bestIndex
    }

    return -1
  }

  function recalcSections() {
    const maxScroll = ScrollTrigger.maxScroll(window)
    sections.forEach((sec, index) => {
      const el = document.getElementById(sec.id)
      sec.top = Math.min(maxScroll, Math.max(0, getTop(el)))
      const next = sections[index + 1]
      const nextTop = next ? Math.min(maxScroll, Math.max(0, getTop(document.getElementById(next.id)))) : maxScroll
      sec.bottom = next ? Math.max(sec.top + 1, nextTop) : maxScroll
    })

    zoneTop = sections[0].top
    zoneBottom = Math.max(zoneTop + 1, maxScroll)
    const zoneH = zoneBottom - zoneTop

    sections.forEach((sec, index) => {
      const span = Math.max(1, sec.bottom - sec.top)
      segEls[index].seg.style.flex = (span / zoneH).toFixed(4)
    })
  }

  recalcSections()
  ScrollTrigger.addEventListener('refresh', recalcSections)

  ScrollTrigger.create({
    trigger: '#' + sections[0].id,
    start: 'top top',
    end: () => ScrollTrigger.maxScroll(window),
    onUpdate() {
      const y = window.scrollY || window.pageYOffset
      const docH = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      const progress = Math.min(1, Math.max(0, (y - zoneTop) / (zoneBottom - zoneTop)))
      pctEl.textContent = '(' + Math.round((y / docH) * 100) + ')'

      if (progress <= 0.01 || progress >= 0.985) {
        timeline.classList.remove('visible')
        pctEl.classList.remove('visible')
        return
      }

      timeline.classList.add('visible')
      pctEl.classList.add('visible')

      let activeIdx = getVisibleSectionIndex()
      const fillProgressBySection = sections.map(sec =>
        Math.min(1, Math.max(0, (y - sec.top) / (sec.bottom - sec.top)))
      )

      sections.forEach((sec, index) => {
        if (activeIdx < 0 && y >= sec.top - 4 && y < sec.bottom - 4) activeIdx = index
      })

      if (activeIdx < 0) activeIdx = sections.length - 1

      const projectsIndex = sections.findIndex(sec => sec.id === 'projects')
      const galleryIndex = sections.findIndex(sec => sec.id === 'circle-gallery')
      if (projectsIndex >= 0 && galleryIndex >= 0) {
        const projects = sections[projectsIndex]
        const gallery = sections[galleryIndex]
        const afterGallery = sections[galleryIndex + 1]
        const inProjectsGalleryRange = y >= projects.top && (!afterGallery || y < afterGallery.top)
        if (inProjectsGalleryRange) {
          activeIdx = y >= gallery.top - window.innerHeight * 0.12 ? galleryIndex : projectsIndex
        }
      }

      segEls.forEach(({ fill }, index) => {
        const fillProgress =
          index < activeIdx ? 1 :
          index === activeIdx ? Math.max(0.015, fillProgressBySection[index]) :
          0
        fill.style.height = (fillProgress * 100).toFixed(1) + '%'
      })

      label.textContent = sections[activeIdx].name
      label.style.top = (progress * 100).toFixed(1) + '%'
    }
  })
}

export function setupContact() {
  const blobWrap     = document.getElementById('contact-blob-wrap')
  const blob         = document.getElementById('contact-blob')
  const contactBg    = document.getElementById('contact-bg')
  const stTimeline   = document.getElementById('scroll-timeline')
  const pctEl        = document.getElementById('scroll-pct')
  const contactPin   = document.getElementById('contact-pin')
  const contactCard  = document.getElementById('contact-card')
  const contactDecor = document.getElementById('contact-decorations')
  const footerEl     = document.getElementById('footer')
  if (!blob) return

  const setContactInteractive = (active) => {
    if (!contactCard) return

    contactCard.classList.toggle('is-contact-active', active)
    contactCard.style.pointerEvents = active ? 'auto' : 'none'
    contactCard.style.visibility = active ? 'visible' : 'hidden'
  }

  // Set card hidden initially
  if (contactCard) {
    gsap.set(contactCard, { opacity: 0, y: '0vh', pointerEvents: 'none', visibility: 'hidden' })
    setContactInteractive(false)
  }
  blobWrap.style.visibility = 'hidden'

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '#contact',
      start: 'top center',
      endTrigger: '#footer-transition',
      end: 'bottom bottom',
      scrub: true,
      onEnter: () => {
        blobWrap.style.visibility = 'visible'
        contactBg.style.display = 'block'
        if (contactDecor) contactDecor.classList.add('visible')
        if (footerEl) footerEl.style.visibility = 'visible'
      },
      onLeave: () => {
        blobWrap.style.visibility = 'hidden'
        contactBg.style.display = 'none'
        if (contactDecor) contactDecor.classList.remove('visible')
      },
      onLeaveBack: () => {
        blobWrap.style.visibility = 'hidden'
        contactBg.style.display = 'none'
        if (contactDecor) contactDecor.classList.remove('visible')
        if (footerEl) footerEl.style.visibility = 'hidden'
      },
      onEnterBack: () => {
        blobWrap.style.visibility = 'visible'
        contactBg.style.display = 'block'
        if (contactDecor) contactDecor.classList.add('visible')
        if (footerEl) footerEl.style.visibility = 'visible'
      },
      onUpdate: (self) => {
        setContactInteractive(self.progress > 0.01 && self.progress < 0.45)
      }
    }
  })

  gsap.set(blob, { transformOrigin: '50% 100%' })

  // 1. Blob scales up to fill the viewport
  tl.fromTo(blob, { scale: 0 }, { scale: 1, duration: 0.3, ease: 'none' }, 0)
  
  // 2. Timeline sidebar fades out early
  tl.to([stTimeline, pctEl], { opacity: 0, duration: 0.05 }, 0)

  // 3. Contact card elements slide up and fade in
  if (contactCard) {
    // Fade in the parent container
    tl.to(contactCard, {
      opacity: 1,
      duration: 0.25,
      ease: 'none',
      onStart: () => setContactInteractive(true),
      onReverseComplete: () => setContactInteractive(false)
    }, 0)

    // Slide/Fade in the avatar
    tl.fromTo('.contact-avatar-wrap', 
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' },
      0
    )

    // Stagger the radial links popping in
    const linkRows = gsap.utils.toArray('.contact-link-row')
    tl.fromTo(linkRows,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, stagger: 0.03, duration: 0.25, ease: 'back.out(1.2)' },
      0.05
    )

    // Slide/Fade in the right content
    tl.fromTo('.contact-right-content',
      { opacity: 0, x: 50 },
      { opacity: 1, x: 0, duration: 0.3, ease: 'power3.out' },
      0.08
    )

    // 4. Contact elements fade out and slide up smoothly
    tl.to(['.contact-avatar-wrap', '.contact-right-content', '.contact-kicker-header', linkRows], {
      opacity: 0,
      y: '-15vh',
      stagger: 0.02,
      duration: 0.25,
      ease: 'power3.in',
      onStart: () => setContactInteractive(false),
      onReverseComplete: () => setContactInteractive(true)
    }, 0.45)
  }

  // 5. White contact section slides up to reveal the black footer
  tl.set(blobWrap, { height: '110vh', overflow: 'hidden', borderRadius: '0 0 0px 0px' }, 0.6)
  tl.to(blobWrap, { borderRadius: '0 0 50px 50px', duration: 0.05, ease: 'power2.out' }, 0.6)
  tl.to(blobWrap, { y: () => -(window.innerHeight * 1.8 + 400), duration: 0.4, ease: 'none' }, 0.6)
  tl.to(contactPin, { y: '-40vh', pointerEvents: 'none', duration: 0.4, ease: 'none' }, 0.6)

  // Toggle visibility display states in timeline to free up pointer-events for footer
  tl.set(contactCard, { display: 'flex' }, 0)
  if (contactDecor) tl.set(contactDecor, { display: 'block' }, 0)
  tl.set([contactCard, contactDecor].filter(Boolean), { display: 'none' }, 0.6)

  // Fully disable the contact section pointer-events once scrolled to footer
  tl.set('#contact', { pointerEvents: 'auto' }, 0)
  tl.set('#contact', { pointerEvents: 'none' }, 0.6)

  // Toggle contactBg as the white section scrolls away to let the page/footer backgrounds show cleanly
  tl.set(contactBg, { display: 'block' }, 0)
  tl.set(contactBg, { display: 'none' }, 0.7)
}
