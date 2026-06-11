import React, { Children, cloneElement, forwardRef, isValidElement, useEffect, useMemo, useRef } from 'react'
import gsap from 'gsap'
import './CardSwap.css'

export const Card = forwardRef(({ customClass, ...rest }, ref) => (
  <div ref={ref} {...rest} className={`card ${customClass ?? ''} ${rest.className ?? ''}`.trim()} />
))
Card.displayName = 'Card'

const makeSlot = (i, distX, distY, total) => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i
})

const placeNow = (el, slot, skew) => {
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: 'center center',
    zIndex: slot.zIndex,
    force3D: true
  })
}

const CardSwap = ({
  width = 340,
  height = 420,
  cardDistance = 44,
  verticalDistance = 48,
  delay = 4200,
  pauseOnHover = false,
  onCardChange,
  onCardClick,
  activeIndex = 0,
  skewAmount = 6,
  easing = 'smooth',
  children
}) => {
  const config = useMemo(() => (easing === 'elastic'
    ? {
        ease: 'elastic.out(0.65,0.92)',
        durDrop: 1.3,
        durMove: 0.9,
        durReturn: 0.9,
        promoteOverlap: 0.82,
        returnDelay: 0.12
      }
    : easing === 'smooth'
      ? {
          ease: 'power3.out',
          durDrop: 0.58,
          durMove: 0.72,
          durReturn: 0.72,
          promoteOverlap: 0.5,
          returnDelay: 0.12
        }
      : {
          ease: 'power2.inOut',
          durDrop: 0.65,
          durMove: 0.75,
          durReturn: 0.75,
          promoteOverlap: 0.45,
          returnDelay: 0.15
        }), [easing])

  const childArr = useMemo(() => Children.toArray(children), [children])
  const refs = useRef([])
  if (refs.current.length !== childArr.length) {
    refs.current = childArr.map((_, i) => refs.current[i] || React.createRef())
  }
  const order = useRef([])
  if (order.current.length !== childArr.length) {
    order.current = Array.from({ length: childArr.length }, (_, i) => i)
  }
  const tlRef = useRef(null)
  const container = useRef(null)

  const goToCard = (targetIdx) => {
    // If target is already front, do nothing
    if (order.current[0] === targetIdx) return

    // Stop current animation timeline
    tlRef.current?.kill()

    // Run selection transition
    const targetPos = order.current.indexOf(targetIdx)
    if (targetPos === -1) return

    const total = refs.current.length
    const elTarget = refs.current[targetIdx].current
    if (!elTarget) return

    const tl = gsap.timeline({ defaults: { ease: config.ease } })
    tlRef.current = tl

    const frontSlot = makeSlot(0, cardDistance, verticalDistance, total)

    // Pull out target card to the left
    tl.to(elTarget, {
      x: -160,
      y: 40,
      z: 100,
      duration: config.durDrop,
      ease: 'power2.out'
    })

    tl.addLabel('promote', `-=${config.durDrop * config.promoteOverlap}`)
    tl.set(elTarget, { zIndex: total }, 'promote')
    tl.to(elTarget, {
      x: frontSlot.x,
      y: frontSlot.y,
      z: frontSlot.z,
      duration: config.durMove,
      ease: config.ease
    }, 'promote')

    // Calculate the new order of cards
    const newOrder = [targetIdx, ...order.current.slice(targetPos + 1), ...order.current.slice(0, targetPos)]

    newOrder.forEach((idx, newPos) => {
      if (idx === targetIdx) return
      const el = refs.current[idx].current
      if (!el) return
      const slot = makeSlot(newPos, cardDistance, verticalDistance, total)
      tl.set(el, { zIndex: slot.zIndex }, 'promote')
      tl.to(el, {
        x: slot.x,
        y: slot.y,
        z: slot.z,
        duration: config.durMove,
        ease: config.ease
      }, 'promote')
    })

    tl.call(() => {
      order.current = newOrder
      onCardChange?.(order.current[0])
    })
  }

  useEffect(() => {
    if (!childArr.length) return

    const total = refs.current.length
    // Position cards initially based on the current order
    order.current.forEach((idx, i) => {
      const el = refs.current[idx].current
      if (el) {
        placeNow(el, makeSlot(i, cardDistance, verticalDistance, total), skewAmount)
      }
    })
  }, [cardDistance, verticalDistance, skewAmount, childArr.length])

  useEffect(() => {
    if (order.current.length && order.current[0] !== activeIndex) {
      goToCard(activeIndex)
    }
  }, [activeIndex])

  const rendered = childArr.map((child, i) =>
    isValidElement(child)
      ? cloneElement(child, {
          key: i,
          ref: refs.current[i],
          style: {
            width,
            height,
            opacity: activeIndex === i ? 1 : 0.92,
            filter: 'none',
            ...(child.props.style ?? {})
          },
          onClick: e => {
            child.props.onClick?.(e)
            onCardClick?.(i)
          }
        })
      : child
  )

  return (
    <div ref={container} className="card-swap-container" style={{ width, height }}>
      {rendered}
    </div>
  )
}

export default CardSwap
