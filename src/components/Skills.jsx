import React, { useEffect, useRef } from 'react'
import { SKILLS } from '../data'

const SKILL_NODES = [
  { name: 'React.js',    type: 'frontend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
  { name: 'Flutter',     type: 'frontend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg' },
  { name: 'TypeScript',  type: 'frontend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
  { name: 'Three.js',    type: 'frontend', icon: 'https://cdn.simpleicons.org/threedotjs/ffffff' },
  { name: 'Tailwind',    type: 'frontend', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg' },
  { name: 'Python',      type: 'backend',  icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
  { name: 'Java',        type: 'backend',  icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
  { name: 'Django',      type: 'backend',  icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg' },
  { name: 'Node.js',     type: 'backend',  icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
  { name: 'TensorFlow',  type: 'ml/dl', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg' },
  { name: 'PyTorch',     type: 'ml/dl', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg' },
  { name: 'ScikitLearn', type: 'ml/dl', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scikitlearn/scikitlearn-original.svg' },
  { name: 'YOLO',        type: 'ml/dl', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/opencv/opencv-original.svg' },
  { name: 'Redis',       type: 'database', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg' },
  { name: 'MySQL',       type: 'database', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
  { name: 'MongoDB',     type: 'database', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
  { name: 'Supabase',    type: 'database', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg' },
  { name: 'Git',         type: 'tools',   icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
  { name: 'Canva',       type: 'tools',   icon: 'https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/canva/default.svg' },
  { name: 'Figma',       type: 'tools',   icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg' },
  { name: 'Docker',      type: 'tools',   icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
]

function SkillsCanvas() {
  const canvasRef = useRef(null)
  const networkRef = useRef(null)

  useEffect(() => {
    let retries = 0
    const init = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      const parent = canvas.parentElement
      const hasSize = parent && parent.getBoundingClientRect().width > 0
      if (hasSize || retries >= 10) {
        networkRef.current = new SkillsNetwork(canvas, SKILL_NODES)
        canvas._network = networkRef.current
      } else {
        retries++
        setTimeout(init, 300)
      }
    }
    const t = setTimeout(init, 500)
    return () => { clearTimeout(t); networkRef.current?.destroy() }
  }, [])

  return <canvas ref={canvasRef} id="skillsNetwork" className="skills-network-canvas" />
}

export default function Skills() {
  return (
    <section className="skills" id="skills">
      <div className="skills-inner">
        <div className="skills-left">
          <h2 className="section-heading-huge skills-heading">Skills</h2>
          <div className="skills-network-wrap">
            <SkillsCanvas />
          </div>
        </div>

        <div className="skills-right" id="skills-right">
          {SKILLS.map((s) => (
            <div key={s.group} className="skill-group" data-group={s.group}>
              <div className="skill-header">
                <span className="skill-header-title">{s.label}</span>
                <span className="skill-header-icon" />
              </div>
              <div className="skill-body" style={{ height: 0 }}>
                <ul className="skill-body-inner">
                  {s.items.map(item => <li key={item}>{item}</li>)}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

class SkillsNetwork {
  constructor(canvas, skills) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.skills = skills
    this.nodes = []
    this.connections = []
    this.activeNode = null
    this.hoverNode = null
    this.activeGroup = null
    this.isVisible = true
    this._destroyed = false
    this.nodesInitialized = false
    this.repulsion = 1400
    this.springLength = 200
    this.springStrength = 0.02
    this.damping = 0.85
    this.centerPull = 0.002
    this.rotationAngle = 0
    this.rotationSpeed = 0.0002  // radians per frame — very slow gentle ambient drift
    this.init()
  }

  setActiveGroup(group) { this.activeGroup = group }

  init() {
    const parent = this.canvas.parentElement
    if (parent) {
      this._ro = new ResizeObserver(() => this.resize())
      this._ro.observe(parent)
    }
    this.skills.forEach(skill => {
      this.nodes.push({ x: Math.random() * 500, y: Math.random() * 500, vx: 0, vy: 0, radius: 36, label: skill.name, icon: skill.icon, type: skill.type, img: null, loaded: false, wanderAngle: Math.random() * Math.PI * 2 })
    })

    // Fisher-Yates shuffle to randomly seed nodes across the network
    for (let i = this.nodes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.nodes[i], this.nodes[j]] = [this.nodes[j], this.nodes[i]]
    }

    this.attemptInit(0)
    this.nodes.forEach(node => {
      const img = new Image()
      img.crossOrigin = 'Anonymous'
      img.onload = () => { node.loaded = true }
      img.src = node.icon
      node.img = img
    })

    // Connect same-type nodes in a chain (rather than cliques) to keep them spread out and prevent clumping
    const nodesByType = {}
    this.nodes.forEach(node => {
      if (!nodesByType[node.type]) nodesByType[node.type] = []
      nodesByType[node.type].push(node)
    })
    Object.values(nodesByType).forEach(groupNodes => {
      for (let i = 0; i < groupNodes.length - 1; i++) {
        this.connections.push({ a: groupNodes[i], b: groupNodes[i + 1] })
      }
    })

    // Add random cross-connections between different types to form a balanced web
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        if (this.nodes[i].type !== this.nodes[j].type && Math.random() < 0.08) {
          this.connections.push({ a: this.nodes[i], b: this.nodes[j] })
        }
      }
    }

    this.addInteraction()
    setInterval(() => { if (!this.activeNode && !this.hoverNode && !this._destroyed) this.disturb() }, 4000)
    this.setupVisibilityObserver()
    this.animate()
  }

  setupVisibilityObserver() {
    this._io = new IntersectionObserver(entries => { this.isVisible = entries[0].isIntersecting }, { threshold: 0, rootMargin: '200px' })
    this._io.observe(this.canvas)
  }

  attemptInit(attempt) {
    const ok = this.resize()
    if (!ok && attempt < 50) {
      setTimeout(() => this.attemptInit(attempt + 1), 200)
    } else if (ok && !this.nodesInitialized) {
      this.nodesInitialized = true
      this.nodes.forEach(n => { n.x = Math.random() * this.width; n.y = Math.random() * this.height })
    }
  }

  disturb() {
    const angle = Math.random() * Math.PI * 2
    const force = 2 + Math.random() * 3
    this.nodes.forEach(n => { n.vx += Math.cos(angle) * force + (Math.random() - 0.5); n.vy += Math.sin(angle) * force + (Math.random() - 0.5) })
  }

  resize() {
    this.isMobile = window.innerWidth < 768
    const parent = this.canvas.parentElement
    let newWidth = this.width
    let newHeight = this.height
    if (parent) {
      const rect = parent.getBoundingClientRect()
      newWidth = rect.width || parent.offsetWidth || window.innerWidth
      newHeight = rect.height || parent.offsetHeight || 0
    } else {
      newWidth = window.innerWidth
      newHeight = this.isMobile ? 300 : 500
    }
    if (newWidth === 0 || newHeight === 0) return false

    if (this.canvas.width !== newWidth || this.canvas.height !== newHeight) {
      this.width = newWidth
      this.height = newHeight
      this.canvas.width = newWidth
      this.canvas.height = newHeight
      this.repulsion = this.isMobile ? 600 : 1300
      this.springLength = this.isMobile ? 120 : 180
      this.nodes.forEach(n => { n.radius = this.isMobile ? 22 : 30 })
    }
    return true
  }

  updatePhysics() {
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        const a = this.nodes[i], b = this.nodes[j]
        const dx = b.x - a.x, dy = b.y - a.y
        const distSq = dx * dx + dy * dy
        if (distSq === 0) continue
        const dist = Math.sqrt(distSq)
        const force = this.repulsion * 10 / distSq
        const fx = (dx / dist) * force, fy = (dy / dist) * force
        a.vx -= fx; a.vy -= fy; b.vx += fx; b.vy += fy
      }
    }
    this.connections.forEach(c => {
      const dx = c.b.x - c.a.x, dy = c.b.y - c.a.y
      const dist = Math.sqrt(dx * dx + dy * dy) || 1
      const force = (dist - this.springLength) * this.springStrength
      const fx = (dx / dist) * force, fy = (dy / dist) * force
      c.a.vx += fx; c.a.vy += fy; c.b.vx -= fx; c.b.vy -= fy
    })
    const cx = this.width / 2, cy = this.height / 2

    // Rotate the coordinates by a tiny constant step each frame
    const cos = Math.cos(this.rotationSpeed)
    const sin = Math.sin(this.rotationSpeed)

    this.nodes.forEach(n => {
      if (n === this.activeNode) {
        // Don't rotate or jitter a node the user is dragging
        n.vx *= this.damping; n.vy *= this.damping
        n.x += n.vx; n.y += n.vy
        return
      }
      // Smooth wander: slowly rotate each node's personal drift angle, then push in that direction
      n.wanderAngle += (Math.random() - 0.5) * 0.25
      n.vx += (cx - n.x) * this.centerPull + Math.cos(n.wanderAngle) * 0.50
      n.vy += (cy - n.y) * this.centerPull + Math.sin(n.wanderAngle) * 0.50
      n.vx *= this.damping; n.vy *= this.damping
      n.x += n.vx; n.y += n.vy

      // Apply orbital rotation around canvas centre
      const rx = n.x - cx, ry = n.y - cy
      n.x = cx + rx * cos - ry * sin
      n.y = cy + rx * sin + ry * cos

      // Clamp AFTER rotation so nodes never escape the canvas
      const m = n.radius + 2
      if (n.x < m) { n.x = m; n.vx = Math.abs(n.vx) * 0.4 }
      if (n.x > this.width - m) { n.x = this.width - m; n.vx = -Math.abs(n.vx) * 0.4 }
      if (n.y < m) { n.y = m; n.vy = Math.abs(n.vy) * 0.4 }
      if (n.y > this.height - m) { n.y = this.height - m; n.vy = -Math.abs(n.vy) * 0.4 }
    })
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height)
    this.connections.forEach(c => {
      const sameGroup = this.activeGroup && c.a.type === this.activeGroup && c.b.type === this.activeGroup
      const hovered = this.hoverNode && (c.a === this.hoverNode || c.b === this.hoverNode)
      if (sameGroup) {
        this.ctx.shadowColor = '#ff1e00'; this.ctx.shadowBlur = 8
        this.ctx.strokeStyle = 'rgba(255,30,0,0.75)'; this.ctx.lineWidth = 2
      } else {
        this.ctx.shadowBlur = 0
        this.ctx.strokeStyle = hovered ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.08)'
        this.ctx.lineWidth = 1
      }
      this.ctx.beginPath(); this.ctx.moveTo(c.a.x, c.a.y); this.ctx.lineTo(c.b.x, c.b.y)
      this.ctx.stroke(); this.ctx.shadowBlur = 0
    })
    this.nodes.forEach(n => {
      const isActive = this.activeGroup && n.type === this.activeGroup
      if (isActive) {
        this.ctx.beginPath(); this.ctx.arc(n.x, n.y, n.radius + 7, 0, Math.PI * 2)
        this.ctx.fillStyle = 'rgba(255,30,0,0.12)'; this.ctx.fill()
      }
      if (n === this.hoverNode || n === this.activeNode) {
        this.ctx.beginPath(); this.ctx.arc(n.x, n.y, n.radius + 5, 0, Math.PI * 2)
        this.ctx.fillStyle = 'rgba(255,255,255,0.08)'; this.ctx.fill()
      }
      this.ctx.beginPath(); this.ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2)
      this.ctx.fillStyle = '#111'; this.ctx.fill()
      this.ctx.strokeStyle = isActive ? 'rgba(255,30,0,0.7)' : 'rgba(255,255,255,0.18)'
      this.ctx.lineWidth = isActive ? 1.5 : 1; this.ctx.stroke()
      if (n.img && n.loaded && n.img.naturalWidth > 0) {
        const s = n.radius * 1.15
        this.ctx.drawImage(n.img, n.x - s / 2, n.y - s / 2, s, s)
      } else {
        this.ctx.fillStyle = 'rgba(255,255,255,0.5)'; this.ctx.font = `${n.radius * 0.7}px Arial`
        this.ctx.textAlign = 'center'; this.ctx.textBaseline = 'middle'
        this.ctx.fillText(n.label.charAt(0), n.x, n.y)
      }
    })
  }

  animate() {
    if (this._destroyed) return
    if (this.width > 0 && this.height > 0 && this.isVisible && !document.hidden) { this.updatePhysics(); this.draw() }
    requestAnimationFrame(() => this.animate())
  }

  addInteraction() {
    const pos = e => { const r = this.canvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top } }
    const nodeAt = (x, y) => this.nodes.find(n => Math.hypot(n.x - x, n.y - y) < n.radius + 10)
    this.canvas.addEventListener('mousedown', e => { const p = pos(e); this.activeNode = nodeAt(p.x, p.y) })
    this.canvas.addEventListener('mousemove', e => {
      const p = pos(e); this.hoverNode = nodeAt(p.x, p.y)
      this.canvas.style.cursor = this.hoverNode ? 'pointer' : 'default'
      if (this.activeNode) { this.activeNode.x = p.x; this.activeNode.y = p.y; this.activeNode.vx = 0; this.activeNode.vy = 0 }
    })
    window.addEventListener('mouseup', () => { this.activeNode = null })
  }

  destroy() { this._destroyed = true; this._ro?.disconnect(); this._io?.disconnect() }
}
