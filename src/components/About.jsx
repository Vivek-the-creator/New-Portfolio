import React, { useEffect, useMemo, useState, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import CardSwap, { Card } from './CardSwap'

const storyCards = [
  {
    title: 'ABOUT ME',
    tagline: 'Dream | Dare | Do',
    description: `I'm Vivek, currently pursuing my BE in CSE (Artificial Intelligence and Machine Learning) at Sri Eshwar College of Engineering. I love connecting with new people, sharing positive vibes and keeping life chill while staying focused on what I do.

I'm naturally curious and always ready to learn, improve and explore new ideas. Whether it's day or night, if there's something worth building or working on, I'll probably be awake making it happen. I enjoy paying attention to details, experimenting with different styles and adding a creative touch to everything I create!`,
    image: '/assets/images/profile/about_me.png',
    pills: null
  },
  {
    title: 'Full Stack Exploration',
    tagline: 'Frontend | Backend | Systems',
    description: `It all started with curiosity while exploring how websites are built. I began with HTML, CSS and JavaScript, then jumped into mobile app development with Kotlin and Flutter, where I learned the basics and built a few small projects. Later, I returned to web development because I enjoyed its creativity and flexibility even more.

That’s when I started exploring the MERN stack with a strong focus on React, while also learning API integration, backend connectivity, Three.js, MySQL and Python-Django. Currently, I’m continuing my journey with TypeScript, Next.js and PostgreSQL.`,
    image: '/assets/images/profile/fsd.png',
    pills: ['MERN Stack', 'Database & APIs', 'Mobile Dev']
  },
  {
    title: 'Interest in AI Model Building',
    tagline: 'AI Systems & Experimentation',
    description: `My interest in AI began with curiosity about how machines actually learn and make decisions. I learnt Python and slowly explored concepts like Machine Learning, Deep Learning, Computer Vision, Random Forest, XGBoost, CNNs, NLP and YOLO by experimenting with small projects and datasets.

As I kept learning, I started building models for scene understanding, chatbot systems and medical-based applications, which made AI feel more practical and exciting. Right now, I’m continuing to explore model training, optimization and real-world AI applications while learning new frameworks, algorithms and approaches along the way.`,
    image: '/assets/images/projects/Covers/SkymcDB.avif',
    pills: ['ML/DL Models', 'Training Models', 'NLP']
  },
  {
    title: 'Writing Poems | Weaving Stories',
    tagline: 'Echoes of Imagination',
    description: `It all began during the COVID lockdown, when I started expressing my thoughts and emotions through Tamil poems. What started as a simple pastime slowly grew into something I genuinely loved, and over time, I’ve written nearly 30 poems on different themes and emotions. I also won an on-spot Tamil poetry competition during my college days, which made the journey even more special.

At the same time, storytelling has always been a part of me since childhood. I love creating stories in my own imaginary worlds and narrating them to friends, juniors, and kids, which continues to keep my creativity and imagination alive.`,
    image: '/assets/images/profile/poet.jpg',
    pills: ['Tamil Poetry', 'Storytelling', 'Imagination']
  },
  {
    title: 'Wanderlust',
    tagline: 'Finding Stories in Every Place',
    description: `Ever since childhood, I’ve always been fascinated by exploring new places, experiencing different environments, and finding beauty in unfamiliar moments. For me, travelling isn’t just about visiting locations — it’s about collecting memories, discovering new perspectives, and enjoying the peace that comes with exploring something new.

Even when I travel for hackathons or events, once everything is over, I love spending time exploring the place around me instead of rushing back immediately. Long rides, peaceful walks, random streets and new atmospheres give me a different level of joy, clarity and calmness that I genuinely enjoy more than anything else.`,
    image: '/assets/images/profile/wanderlust.png',
    pills: ['Exploration', 'New Perspectives', 'Wanderer']
  }
]

/* ── Word-level data for the intro text ── */
const introWords = [
  // line 1
  [
    { w: 'As',          accent: false },
    { w: 'a',           accent: false },
    { w: 'Full',        accent: true  },
    { w: 'Stack',       accent: true  },
    { w: 'Developer',   accent: true  },
    { w: 'and',         accent: false },
  ],
  // line 2
  [
    { w: 'AI',          accent: true  },
    { w: 'Enthusiast,', accent: true  },
    { w: 'I',           accent: false },
    { w: 'enjoy',       accent: false },
    { w: 'building',    accent: false },
  ],
  // line 3
  [
    { w: 'digital',     accent: false },
    { w: 'experiences', accent: false },
    { w: 'that',        accent: false },
  ],
  // line 4
  [
    { w: 'combine',     accent: false },
    { w: 'my', accent: false},
    { w: 'creativity,', accent: true  },
  ],
  //line 5
  [
    { w: 'logic',       accent: true  },
    { w: 'and',         accent: false },
    { w: 'emotion.',    accent: true  },
  ]
]

/* ── Cinematic word-by-word scroll reveal ── */
function AboutIntro() {
  const panelRef = useRef(null)

  useEffect(() => {
    const words = panelRef.current?.querySelectorAll('.about-word')
    if (!words?.length) return

    // All words start invisible + blurred
    gsap.set(words, { opacity: 0, filter: 'blur(16px)', y: 12 })

    const tl = gsap.timeline({ paused: true })

    // Each word reveals in sequence across the timeline
    tl.to(words, {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      duration: 1,
      ease: 'power2.out',
      stagger: {
        each: 0.06,   // 60 ms between each word
        from: 'start'
      }
    }, 0)

    const st = ScrollTrigger.create({
      trigger: panelRef.current,
      start: 'top 88%',    // start revealing when section enters viewport
      end: 'center 38%',   // fully revealed when section center hits 38% from top
      scrub: 1.4,           // smooth follow of scroll position
      animation: tl
    })

    return () => {
      st.kill()
      tl.kill()
    }
  }, [])

  return (
    <article ref={panelRef} className="about-intro-panel" id="about-story-intro">

      {/* Left: text — every word is individually targeted by GSAP */}
      <div className="about-intro-text">
        <h2 className="about-text" id="about-text">
          {introWords.map((line, li) => (
            <React.Fragment key={li}>
              {line.map(({ w, accent }, wi) => (
                <React.Fragment key={wi}>
                  <span className={`about-word${accent ? ' other-accent' : ''}`}>
                    {w}
                  </span>
                  {/* space between words (not after last word on line) */}
                  {wi < line.length - 1 && ' '}
                </React.Fragment>
              ))}
              {/* line break between lines (not after last line) */}
              {li < introWords.length - 1 && <br />}
            </React.Fragment>
          ))}
        </h2>
      </div>

      {/* Right: cinematic portrait — fades into the dark background */}
      <div className="about-intro-portrait" aria-hidden="true">
        <div className="aip-glow" />
        <img
          src="/assets/images/profile/me.png"
          alt=""
          className="aip-img"
          draggable={false}
        />
        <div className="aip-mask aip-mask-top" />
        <div className="aip-mask aip-mask-bottom" />
        <div className="aip-mask aip-mask-left" />
        <div className="aip-mask aip-mask-right" />
        <div className="aip-vignette" />
      </div>

    </article>
  )
}

/* ── Main About component ─────────────────────────────────────────── */
export default function About() {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeStory  = useMemo(() => storyCards[activeIndex], [activeIndex])
  const triggerRef   = useRef(null)
  const isSkippingBackRef = useRef(false)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const downTrigger = ScrollTrigger.create({
      trigger: '#about-story-stage',
      pin: true,
      pinSpacing: true,
      start: 'center center',
      end: '+=2000',
      scrub: true,
      onEnter: () => { setActiveIndex(0) },
      onUpdate: (self) => {
        if (self.direction < 0) {
          if (!isSkippingBackRef.current) {
            isSkippingBackRef.current = true
            setActiveIndex(0)
            const jumpTarget = self.start - 2
            if (window.lenis) {
              window.lenis.scrollTo(jumpTarget, { immediate: true })
            } else {
              window.scrollTo({ top: jumpTarget, behavior: 'instant' })
            }
            setTimeout(() => { isSkippingBackRef.current = false }, 200)
          }
          return
        }
        const prog      = self.progress
        const targetIdx = Math.max(0, Math.min(4, Math.floor(prog * 5)))
        setActiveIndex(prev => (prev !== targetIdx ? targetIdx : prev))
      }
    })

    triggerRef.current = downTrigger
    return () => { downTrigger.kill() }
  }, [])

  const handleCardClick = (index) => {
    const trigger = triggerRef.current
    if (!trigger) return
    const progress    = (index + 0.5) / storyCards.length
    const targetScroll = trigger.start + progress * (trigger.end - trigger.start)
    if (window.lenis) {
      window.lenis.scrollTo(targetScroll, { duration: 1.2 })
    } else {
      window.scrollTo({ top: targetScroll, behavior: 'smooth' })
    }
  }

  useEffect(() => {
    const copy = document.querySelector('.about-story-copy')
    if (!copy) return
    gsap.fromTo(copy,
      { opacity: 0, y: 18, filter: 'blur(6px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.55, ease: 'power3.out' }
    )
  }, [activeIndex])

  return (
    <section className="about" id="about">
      <div className="about-ambient about-ambient-a" aria-hidden="true" />
      <div className="about-ambient about-ambient-b" aria-hidden="true" />

      <div className="about-shell">

        {/* ── 1. Cinematic intro panel ── */}
        <AboutIntro />

        {/* ── 2. Breathing room between intro and card swap ── */}
        <div className="about-section-spacer" aria-hidden="true" />

        {/* ── 3. Card swap stage ── */}
        <article className="about-story-stage" id="about-story-stage">
          <div className="about-story-copy" id="about-story-copy">
           
            <p className="about-story-eyebrow">{activeStory.tagline}</p>
            <h3>{activeStory.title}</h3>
            <p className="about-story-body" style={{ whiteSpace: 'pre-line' }}>{activeStory.description}</p>
            <div className="about-story-pills">
              {activeIndex === 0 ? (
                <a
                  className="about-resume-btn"
                  href="https://drive.google.com/file/d/1SvhinOcUchdJCBHSNbkAqV-HUeddLid9/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Download Resume
                </a>
              ) : (
                <div className="about-story-pills">
                  {activeStory.pills.map(p => <span key={p}>{p}</span>)}
                </div>
              )}

            </div>
          </div>

          <div className="about-story-swap" aria-label="Interactive storytelling cards">
            <CardSwap
              width={420}
              height={560}
              cardDistance={42}
              verticalDistance={48}
              delay={0}
              pauseOnHover={false}
              skewAmount={4}
              onCardChange={setActiveIndex}
              onCardClick={handleCardClick}
              activeIndex={activeIndex}
            >
              {storyCards.map(item => (
                <Card key={item.title} customClass="story-card-card" aria-label={item.title}>
                  <div className="story-card-image" style={{ backgroundImage: `url(${item.image})` }} />
                  <div className="story-card-overlay" />
                </Card>
              ))}
            </CardSwap>
          </div>
        </article>
      </div>

      <div className="about-photo-wrap" id="about-photo-wrap">
        <img
          className="about-photo"
          src="/assets/images/profile/me.avif"
          alt="Atmospheric profile background"
          decoding="async"
          width="2500"
          height="3001"
        />
      </div>
    </section>
  )
}
