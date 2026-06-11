import React, { useEffect, useMemo, useState, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import CardSwap, { Card } from './CardSwap'

const storyCards = [
  {
    title: 'About Me',
    tagline: 'Developer + storyteller',
    description: 'I design cinematic interfaces, write thoughtful product experiences, and build systems that feel human, calm, and memorable.',
    image: '/assets/images/projects/Covers/Portfolio.avif'
  },
  {
    title: 'Full Stack Exploration',
    tagline: 'Frontend / backend / systems',
    description: 'From interactive interfaces to resilient product logic, I love blending elegant design with reliable engineering.',
    image: '/assets/images/projects/Covers/cyberDiag_web.avif'
  },
  {
    title: 'Interest in AI Model Building',
    tagline: 'AI systems & experimentation',
    description: 'I am drawn to model-driven ideas, intelligent automation, and exploring how AI can serve real creative workflows.',
    image: '/assets/images/projects/Covers/SkymcDB.avif'
  },
  {
    title: 'Interest in Tamil Poems',
    tagline: 'Quiet inspiration',
    description: 'During reflective moments, I write Tamil poems that capture emotions, memory, and the softness of human experience.',
    image: '/assets/images/projects/Covers/Echo.avif'
  },
  {
    title: 'Wanderlust',
    tagline: 'Travel, people, places',
    description: 'I find inspiration in movement, observation, and new cities — each journey adds texture to the way I build digital identity.',
    image: '/assets/images/projects/Covers/Symphony.avif'
  }
]

export default function About() {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeStory = useMemo(() => storyCards[activeIndex], [activeIndex])
  const triggerRef = useRef(null)
  const scrollDirRef = useRef('down')

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    // ── DOWN-only pinned trigger ──
    // Pins the section while scrolling down through all 5 cards
    const downTrigger = ScrollTrigger.create({
      trigger: '#about-story-stage',
      pin: true,
      pinSpacing: true,
      start: 'center center',
      end: '+=2000',
      scrub: true,
      onEnter: () => {
        scrollDirRef.current = 'down'
        setActiveIndex(0)
      },
      onUpdate: (self) => {
        if (self.direction < 0) return // ignore when scrolling up
        const prog = self.progress
        const targetIdx = Math.max(0, Math.min(4, Math.floor(prog * 5)))
        setActiveIndex(prev => (prev !== targetIdx ? targetIdx : prev))
      }
    })

    triggerRef.current = downTrigger

    return () => {
      downTrigger.kill()
    }
  }, [])

  const handleCardClick = (index) => {
    const trigger = triggerRef.current
    if (!trigger) return

    const scrollDir = scrollDirRef.current
    const progress = scrollDir === 'down'
      ? (index + 0.5) / 5
      : 1 - (index + 0.5) / 5

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
        <article className="about-story-intro" id="about-story-intro">
          <h2 className="about-text" id="about-text">
            As a<span className="other-accent"> Full Stack Developer</span> and <br />
            <span className="other-accent">AI Enthusiast</span>, I enjoy building <br />
            digital experiences that combine <span className="other-accent">creativity, logic</span> and <span className="other-accent">emotion</span>.
          </h2>

        </article>

        <article className="about-story-stage" id="about-story-stage">
          <div className="about-story-copy" id="about-story-copy">
            <p className="about-story-label">Storyline</p>
            <p className="about-story-eyebrow">{activeStory.tagline}</p>
            <h3>{activeStory.title}</h3>
            <p className="about-story-body">{activeStory.description}</p>
            <div className="about-story-pills">
              <span>Creative systems</span>
              <span>AI curiosity</span>
              <span>Immersive design</span>
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
