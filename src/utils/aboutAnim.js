import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

export function setupAbout() {
  const intro = document.getElementById('about-story-intro')
  const storyStage = document.getElementById('about-story-stage')
  const photoWrap = document.getElementById('about-photo-wrap')
  const photo = photoWrap?.querySelector('.about-photo')

  if (intro) {
    gsap.set(intro, { opacity: 1, y: 0 })
  }

  if (storyStage) {
    gsap.set(storyStage, { opacity: 0, y: 18, scale: 0.98 })
    gsap.to(storyStage, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: storyStage,
        start: 'top 82%',
        end: 'top 35%',
        once: true
      }
    })
  }

  if (photoWrap && photo) {
    gsap.fromTo(photoWrap, { opacity: 0.18 }, {
      opacity: 0,
      filter: 'blur(18px)',
      ease: 'none',
      scrollTrigger: {
        trigger: storyStage ?? intro,
        start: 'top 45%',
        end: 'top 10%',
        scrub: true
      }
    })

    const initPhotoScroll = () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: photoWrap,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      })
      tl.fromTo(photo, { y: '-30%' }, { y: '18%', ease: 'none' }, 0)
      tl.fromTo(photo, { opacity: 0.18, filter: 'blur(18px)' }, { opacity: 0.08, filter: 'blur(26px)', ease: 'none', duration: 0.25 }, 0)
    }

    photo.decode ? photo.decode().then(initPhotoScroll).catch(initPhotoScroll)
                 : (photo.onload = initPhotoScroll, photo.complete && initPhotoScroll())
  }
}
