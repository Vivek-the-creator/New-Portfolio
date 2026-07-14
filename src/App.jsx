import { useEffect } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

import Preloader        from './components/Preloader'
import Hero             from './components/Hero'
import RevealImage      from './components/RevealImage'
import About            from './components/About'
import Projects         from './components/Projects'
import CircleGallery    from './components/CircleGallery'
import Skills           from './components/Skills'
import Certifications   from './components/Certifications'
import Internships      from './components/Internships'
import Contact          from './components/Contact'
import Footer           from './components/Footer'
import ProjectPreview   from './components/ProjectPreview'
import ProjectDetail    from './components/ProjectDetail'
import ScrollTimeline   from './components/ScrollTimeline'

import { runPreloader }       from './utils/preloader'
import { setupScrollReveal }  from './utils/scrollReveal'
import { setupAbout }         from './utils/aboutAnim'
import { setupProjects }      from './utils/projectsAnim'
import { setupSkills, setupScrollTimeline, setupContact } from './utils/sectionsAnim'
import { setupFooter }        from './utils/footerAnim'
import { setupProjectDetail } from './utils/projectDetail'
import { setupInternships }   from './utils/internshipsAnim'
import { setupCertifications } from './utils/certificationsAnim'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  useEffect(() => {
    // ── chr-hover chars already rendered by React via ChrHover component ──
    // Build ch-top clip-path reveal animation for all existing .ch-top spans
    const chrHoverTl = gsap.timeline({ paused: true })
    document.querySelectorAll('.chr-hover').forEach((el, elIdx) => {
      el.querySelectorAll('.ch-top').forEach((ch, i) => {
        const pos = elIdx * 0.08 + i * 0.03
        chrHoverTl.fromTo(ch,
          { clipPath: 'inset(100% 0 0 0)', immediateRender: false },
          { clipPath: 'inset(0 0 0 0)', duration: 0.7, ease: 'power3.out' },
          pos
        )
      })
    })

    // ── Lenis smooth scroll ──
    const lenis = new Lenis({
      duration: 1.15,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      lerp: 0.08,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.9,
    })
    window.lenis = lenis
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add(time => lenis.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)
    lenis.stop()
    lenis.scrollTo(0, { immediate: true })

    // ── Shader background ──
    function startShader() {
      const container = document.getElementById('hero-canvas')
      if (container) container.classList.add('ready')
      const data = window._heroProjectData
      if (!data) return
      const blob    = new Blob([JSON.stringify(data)], { type: 'application/json' })
      const blobUrl = URL.createObjectURL(blob)
      if (container) {
        container.setAttribute('data-cr-project-src', blobUrl)
        if (window.CoreRenderer) {
          window.CoreRenderer.init().then(() => URL.revokeObjectURL(blobUrl)).catch(() => {})
        }
      }
    }

    // ── Hero nav fade transition ──
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'))
        if (!target) return
        e.preventDefault()
        const pf = document.getElementById('page-fade')
        pf.style.pointerEvents = 'auto'
        gsap.to(pf, { opacity: 1, duration: 0.4, ease: 'power2.in', onComplete: () => {
          lenis.scrollTo(target, { immediate: true })
          gsap.to(pf, { opacity: 0, duration: 0.5, ease: 'power2.out', delay: 0.05,
            onComplete: () => { pf.style.pointerEvents = 'none' }
          })
        }})
      })
    })

    let destroySkillsFn = null
    let destroyCertsFn = null

    // ── Preloader ──
    runPreloader({
      startShader,
      onComplete: (introSettledXvw) => {
        chrHoverTl.play()
        lenis.start()
        lenis.scrollTo(0, { immediate: true })

        setupScrollReveal(lenis, introSettledXvw).then(() => {
          setupAbout()
          const { openProject } = setupProjectDetail(lenis)
          setupProjects(lenis, openProject)
          const { pinExtra: skillsPinExtra = 0, destroy: destroySkills } = setupSkills(lenis)
          destroySkillsFn = destroySkills
          
          const { pinExtra: certsPinExtra = 0, destroy: destroyCerts } = setupCertifications()
          destroyCertsFn = destroyCerts
          
          setupInternships()
          setupContact(lenis)
          setupScrollTimeline(lenis, skillsPinExtra, certsPinExtra)
          setupFooter()
          ScrollTrigger.refresh()
        })
      }
    })

    // ── page-show (bfcache restore) ──
    window.addEventListener('pageshow', e => {
      if (e.persisted) {
        lenis.scrollTo(0, { immediate: true })
        ScrollTrigger.refresh()
        const pf = document.getElementById('page-fade')
        if (pf) { pf.style.pointerEvents='none'; pf.style.opacity='1'; gsap.to(pf,{opacity:0,duration:0.65,ease:'power2.out'}) }
      }
    })

    return () => {
      lenis.destroy()
      ScrollTrigger.getAll().forEach(t => t.kill())
      destroySkillsFn?.()
      destroyCertsFn?.()
    }
  }, [])

  return (
    <>
      <Preloader />
      <Hero />
      <RevealImage />

      <section className="section-after" id="section-after">
        <About />
        <Projects />
      </section>

      <CircleGallery />
      <Skills />
      <Certifications />
      <Internships />
      <Contact />
      <Footer />

      <ProjectPreview />
      <ProjectDetail />
      <ScrollTimeline />

      {/* overlays */}
      <div className="page-fade"              id="page-fade" />
      <div className="flying-title"           id="flying-title" />
      <div className="work-transition-overlay" id="work-transition-overlay" />
      <div className="work-flying-text"        id="work-flying-text">Work</div>
    </>
  )
}
