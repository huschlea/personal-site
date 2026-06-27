'use client'

import { useEffect, useRef, useState } from 'react'

// ============ CONFIG ============
// Drop human-agent-avatar.png into your /public/ folder. Edit this path
// if your portfolio uses a different location or basePath.
const AVATAR_SRC = '/human-agent-avatar.png'

// Literal font-family string. Matches the live site's `font-geist-sans`
// Tailwind class. Geist is on Google Fonts — load it on the destination via:
//   <link rel="preconnect" href="https://fonts.googleapis.com">
//   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
//   <link href="https://fonts.googleapis.com/css2?family=Geist:wght@500&display=swap" rel="stylesheet">
const FONT_SANS = "'Geist', system-ui, sans-serif"

const DOMAIN_RGB: ReadonlyArray<readonly [number, number, number]> = [
  [59, 130, 246],   // Ideas      — blue-500
  [245, 158, 11],   // Relational — amber-500
  [16, 185, 129],   // Action     — emerald-500
  [139, 92, 246],   // Order      — violet-500
]
const DOMAIN_NAMES = ['Ideas', 'Relational', 'Action', 'Order'] as const

// ============ ANIMATION CONSTANTS (verbatim from live) ============
// Particle count scales down on touch / narrow viewports so the canvas
// stays smooth on mobile GPUs. Desktop keeps the original 700.
const PARTICLE_COUNT_DESKTOP = 700
const PARTICLE_COUNT_MOBILE = 300
function getParticleCount() {
  if (typeof window === 'undefined') return PARTICLE_COUNT_DESKTOP
  const isCoarse = window.matchMedia('(hover: none) and (pointer: coarse)').matches
  const isNarrow = window.innerWidth < 700
  return isCoarse || isNarrow ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP
}
// Capping DPR at 2 prevents the canvas backing buffer from ballooning to
// 3x or 4x on high-DPR phones — particles are soft enough that 2x is
// indistinguishable from 3x but ~2x cheaper to clear/redraw per frame.
const MAX_DPR = 2

const SPRING_STIFFNESS = 0.02
const SPRING_DAMPING = 0.84
const SWARM_STIFFNESS = 0.024
const SWARM_DAMPING = 0.86
const BROWNIAN_FORCE = 0.3
const ORBIT_SPEED = 0.00018
const SETTLE_VELOCITY = 0.3
const SETTLE_DISTANCE = 1.5

const LABELS_DELAY = 900
const SWARM_DELAY = 3200
const AVATAR_DELAY_AFTER_SWARM = 1200
const FORCE_AMBIENT_AFTER_SWARM = 4000

// ============ TYPES ============
interface Particle {
  x: number
  y: number
  targetX: number
  targetY: number
  vx: number
  vy: number
  radius: number
  opacity: number
  domainIndex: number
  delay: number
  phaseOffset: number
  orbitRadius: number
  baseAngle: number
  orbitSpeed: number
  settled: boolean
  fill: string
}

type AnimPhase = 'chaos' | 'organize' | 'swarm' | 'ambient'

interface VizLayout {
  center: { x: number; y: number }
  visRadius: number
  clusterR: number
  clusters: { x: number; y: number }[]
  labels: { x: number; y: number }[]
  ringRadius: number
}

// ============ STYLES ============
const STYLES = `
.ha-root {
  position: relative;
  width: 100%;
  height: 420px;
  background: transparent;
}
/* Height hugs the visualization (a ~380px-tall ring centered in the canvas).
   Taller canvases left a large dead gap above the ring; 450px keeps it above
   both the layout rescale floor (~440px) and the particle-orbit clip threshold
   (~422px), so the viz neither shrinks nor clips. */
@media (min-width: 640px) { .ha-root { height: 450px; } }

.ha-canvas {
  position: absolute;
  inset: 0;
  display: block;
  transform: translateZ(0);
}

.ha-labels {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 20;
}
.ha-label {
  position: absolute;
  transform: translate(-50%, 0);
  text-align: center;
  font-family: ${FONT_SANS};
  font-weight: 500;
  font-size: 11px;
  line-height: 1;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.4s ease;
}
@media (min-width: 640px) { .ha-label { font-size: 12px; } }
.ha-labels[data-show="true"] .ha-label { opacity: 1; }
.ha-labels[data-show="true"] .ha-label[data-i="0"] { transition-delay: 0ms; }
.ha-labels[data-show="true"] .ha-label[data-i="1"] { transition-delay: 100ms; }
.ha-labels[data-show="true"] .ha-label[data-i="2"] { transition-delay: 200ms; }
.ha-labels[data-show="true"] .ha-label[data-i="3"] { transition-delay: 300ms; }

.ha-avatar-wrap {
  position: absolute;
  pointer-events: none;
  z-index: 30;
  /* GPU promotion lives here (instead of on .ha-avatar-inner) so the
     scan element animates reliably. iOS Safari has a known bug where
     positioned children of a clipped + rounded + GPU-promoted parent
     fail to interpolate; promoting the wrap (which is not clipped)
     instead keeps canvas paints isolated without that side effect. */
  transform: translate(-50%, -50%) translateZ(0);
  will-change: opacity, transform;
  opacity: 0;
  transition: opacity 1.2s ease-out;
}
.ha-avatar-wrap[data-show="true"] { opacity: 1; }

.ha-avatar-ring {
  pointer-events: auto;
  position: relative;
  cursor: pointer;
  border-radius: 9999px;
  background: conic-gradient(from 0deg, #3b82f6, #f59e0b, #10b981, #8b5cf6, #3b82f6);
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
/* The blue/purple glow lives on a pseudo-element with a static
   box-shadow whose opacity animates. box-shadow transitions don't
   commit to the compositor on iOS Safari; opacity always does. */
.ha-avatar-ring::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  box-shadow:
    0 0 24px rgba(59, 130, 246, 0.4),
    0 0 48px rgba(139, 92, 246, 0.2);
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}
.ha-avatar-ring[data-hover="true"]::after {
  opacity: 1;
}

.ha-avatar-inner {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 9999px;
  overflow: hidden;
}
/* Two stacked <img> layers — a static grayscale copy underneath and a
   color copy on top whose opacity is animated. Filter interpolation
   on iOS Safari is unreliable, but opacity interpolation is bulletproof
   on every browser. The second <img> shares the cached asset so it
   doesn't double network cost. */
.ha-avatar-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border-radius: 9999px;
  object-fit: cover;
  display: block;
}
.ha-avatar-img-gray {
  filter: grayscale(1);
}
.ha-avatar-img-color {
  opacity: 1;
  transition: opacity 0.5s ease;
  will-change: opacity;
}
.ha-avatar-ring[data-hover="true"] .ha-avatar-img-color {
  opacity: 0;
}

.ha-scan {
  position: absolute;
  left: 0;
  top: -10%;
  width: 100%;
  height: 4px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(96, 165, 250, 0.7) 30%,
    rgba(255, 255, 255, 0.9) 50%,
    rgba(96, 165, 250, 0.7) 70%,
    transparent 100%
  );
  box-shadow: 0 0 8px 2px rgba(96, 165, 250, 0.4);
  border-radius: 2px;
  /* Desktop: transition on top so mid-sweep hover-release reverses
     smoothly from the current position. */
  transition: top 1.1s ease-in-out;
  pointer-events: none;
  will-change: top;
}
.ha-avatar-ring[data-hover="true"] .ha-scan {
  top: 110%;
}

/* Keyframes registered at top level (not inside the media query) —
   iOS Safari sometimes fails to register @keyframes nested inside
   @media, leading to animations that snap instead of interpolate. */
@keyframes ha-scan-down {
  0%   { top: -10%; }
  100% { top: 110%; }
}
@keyframes ha-scan-up {
  0%   { top: 110%; }
  100% { top: -10%; }
}
@keyframes ha-color-fadeout {
  from { opacity: 1; }
  to   { opacity: 0; }
}
@keyframes ha-color-fadein {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes ha-wrap-fadein {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes ha-glow-fadein {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes ha-glow-fadeout {
  from { opacity: 1; }
  to   { opacity: 0; }
}

/* Touch devices: transitions on top, filter, and opacity all fail to
   commit to the compositor on iOS Safari for this element tree, so
   they snap or stay invisible. Override with keyframe animations.
   data-scanned gates the return animations so they don't fire on
   initial mount. */
@media (hover: none) and (pointer: coarse) {
  .ha-avatar-wrap {
    transition: none;
  }
  .ha-avatar-wrap[data-show="true"] {
    animation: ha-wrap-fadein 1.2s ease-out forwards;
  }

  .ha-scan {
    transition: none;
  }
  .ha-avatar-ring[data-hover="true"] .ha-scan {
    animation: ha-scan-down 1.1s ease-in-out forwards;
  }
  .ha-avatar-ring[data-scanned="true"][data-hover="false"] .ha-scan {
    animation: ha-scan-up 1.1s ease-in-out forwards;
  }

  .ha-avatar-img-color {
    transition: none;
  }
  .ha-avatar-ring[data-hover="true"] .ha-avatar-img-color {
    animation: ha-color-fadeout 0.9s ease forwards;
  }
  .ha-avatar-ring[data-scanned="true"][data-hover="false"] .ha-avatar-img-color {
    animation: ha-color-fadein 0.9s ease forwards;
  }

  .ha-avatar-ring::after {
    transition: none;
  }
  .ha-avatar-ring[data-hover="true"]::after {
    animation: ha-glow-fadein 0.5s ease forwards;
  }
  .ha-avatar-ring[data-scanned="true"][data-hover="false"]::after {
    animation: ha-glow-fadeout 0.5s ease forwards;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ha-avatar-wrap,
  .ha-label,
  .ha-avatar-img,
  .ha-scan,
  .ha-avatar-ring { transition-duration: 0.01ms !important; }
}
`

// ============ HELPERS ============
function rand(min: number, max: number) {
  return Math.random() * (max - min) + min
}

function computeLayout(w: number, h: number): VizLayout {
  let visR: number
  if (w < 640) visR = Math.min(w * 0.85, 380)
  else if (w < 1024) visR = Math.min(w * 0.42, 360)
  else visR = Math.min(w * 0.26, 320)

  const minGap = 28
  const labelGap = 18
  const labelOffset = 32

  const maxExtent = (h - minGap * 2) / 2
  const organizeExtent = visR * 0.42 + labelOffset
  if (organizeExtent > maxExtent) {
    visR = (maxExtent - labelOffset) / 0.42
  }

  const ringMul = w < 640 ? 0.50 : 0.44
  // Width safety: ambient particles oscillate to roughly ringR * 1.18
  // from center. Slightly relaxed margins (vs the earlier 14 / 1.18)
  // let mobile visR push closer to the column edges without affecting
  // desktop or tablet, where the formula is the limiter anyway.
  const horizMargin = 8
  const widthLimit = (w / 2 - horizMargin) / (ringMul * 1.12)
  visR = Math.min(visR, widthLimit)

  const ringR = visR * ringMul
  const center = { x: w / 2, y: h / 2 }
  const gridSpacing = visR * 0.28
  const clusterR = visR * 0.14

  const clusters = [
    { x: center.x - gridSpacing, y: center.y - gridSpacing },
    { x: center.x + gridSpacing, y: center.y - gridSpacing },
    { x: center.x - gridSpacing, y: center.y + gridSpacing },
    { x: center.x + gridSpacing, y: center.y + gridSpacing },
  ]

  const labels = clusters.map((c) => ({
    x: c.x,
    y: c.y + clusterR + labelGap,
  }))

  return { center, visRadius: visR, clusterR, clusters, labels, ringRadius: ringR }
}

function initParticles(w: number, h: number): Particle[] {
  const lo = computeLayout(w, h)
  const particles: Particle[] = []
  const count = getParticleCount()

  for (let i = 0; i < count; i++) {
    const di = i % 4
    const c = lo.clusters[di]

    const sa = rand(0, Math.PI * 2)
    const sd = Math.pow(Math.random(), 0.5) * lo.ringRadius

    const ta = rand(0, Math.PI * 2)
    const td = Math.pow(Math.random(), 0.5) * lo.clusterR

    const opacity = rand(0.35, 0.75)
    const [r, g, bb] = DOMAIN_RGB[di]

    particles.push({
      x: lo.center.x + Math.cos(sa) * sd,
      y: lo.center.y + Math.sin(sa) * sd,
      targetX: c.x + Math.cos(ta) * td,
      targetY: c.y + Math.sin(ta) * td,
      vx: rand(-0.3, 0.3),
      vy: rand(-0.3, 0.3),
      radius: rand(1.5, 3),
      opacity,
      domainIndex: di,
      delay: di * 300 + rand(0, 450),
      phaseOffset: rand(0, Math.PI * 2),
      orbitRadius: rand(lo.ringRadius * 0.05, lo.ringRadius * 0.11),
      baseAngle: 0,
      orbitSpeed: rand(0.85, 1.15),
      settled: false,
      fill: `rgba(${r},${g},${bb},${opacity.toFixed(2)})`,
    })
  }

  return particles
}

function setSwarmTargets(
  particles: Particle[],
  center: { x: number; y: number },
  ringR: number,
) {
  for (const p of particles) {
    const angle = rand(0, Math.PI * 2)
    const spread = ringR * 0.06
    const r = ringR + rand(-spread, spread)
    p.targetX = center.x + Math.cos(angle) * r
    p.targetY = center.y + Math.sin(angle) * r
    p.baseAngle = angle
    p.delay = rand(0, 350)
    p.settled = false
  }
}

function prepareAmbientOrbit(
  particles: Particle[],
  center: { x: number; y: number },
  ringRadius: number,
) {
  for (const p of particles) {
    const dx = p.x - center.x
    const dy = p.y - center.y
    p.baseAngle = Math.atan2(dy, dx)
    const currentR = Math.sqrt(dx * dx + dy * dy)
    const rDelta = currentR - ringRadius
    const maxOrbit = ringRadius * 0.18
    p.orbitRadius = Math.min(
      Math.max(p.orbitRadius, Math.abs(rDelta) + 0.5),
      maxOrbit,
    )
    p.phaseOffset = Math.asin(rDelta / p.orbitRadius)
    p.settled = true
  }
}

// ============ COMPONENT ============
export function HumanAgentSandbox() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const phaseRef = useRef<AnimPhase>('chaos')
  const phaseStartRef = useRef(0)
  const animRef = useRef(0)
  const isVisibleRef = useRef(false)
  const hasOrganizedRef = useRef(false)
  const layoutRef = useRef<VizLayout | null>(null)
  const ambientStartRef = useRef(0)
  const avatarLoadedRef = useRef(false)
  const hasAutoPlayedRef = useRef(false)

  const [showLabels, setShowLabels] = useState(false)
  const [showAvatar, setShowAvatar] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [hasScanned, setHasScanned] = useState(false)
  const [layout, setLayout] = useState<VizLayout | null>(null)
  const [avatarReady, setAvatarReady] = useState(false)

  // Preload avatar so the reveal doesn't pop. Until the image actually
  // resolves (or 404s), we don't render the avatar wrap at all — that keeps
  // the colored conic-gradient placeholder ring from showing.
  useEffect(() => {
    const img = new window.Image()
    img.src = AVATAR_SRC
    img.onload = () => {
      avatarLoadedRef.current = true
      setAvatarReady(true)
    }
  }, [])

  // Auto-play scan effect once when avatar first appears
  useEffect(() => {
    if (!showAvatar || hasAutoPlayedRef.current) return
    hasAutoPlayedRef.current = true
    const onTimer = setTimeout(() => {
      setIsHovered(true)
      setHasScanned(true)
    }, 900)
    const offTimer = setTimeout(() => setIsHovered(false), 2400)
    return () => {
      clearTimeout(onTimer)
      clearTimeout(offTimer)
    }
  }, [showAvatar])

  // Intersection observer + scripted timeline
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const timers: ReturnType<typeof setTimeout>[] = []
    const track = (id: ReturnType<typeof setTimeout>) => {
      timers.push(id)
      return id
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting

        if (entry.intersectionRatio >= 0.2 && !hasOrganizedRef.current) {
          hasOrganizedRef.current = true
          phaseRef.current = 'organize'
          phaseStartRef.current = performance.now()

          track(setTimeout(() => setShowLabels(true), LABELS_DELAY))

          track(setTimeout(() => {
            setShowLabels(false)

            phaseRef.current = 'swarm'
            phaseStartRef.current = performance.now()

            const lo = layoutRef.current
            if (lo) {
              setSwarmTargets(particlesRef.current, lo.center, lo.ringRadius)
            }

            track(setTimeout(() => {
              const reveal = () => setShowAvatar(true)
              if (avatarLoadedRef.current) {
                reveal()
              } else {
                const img = new window.Image()
                img.src = AVATAR_SRC
                img.onload = reveal
                track(setTimeout(reveal, 300))
              }
            }, AVATAR_DELAY_AFTER_SWARM))

            track(setTimeout(() => {
              if (phaseRef.current === 'swarm') {
                for (const p of particlesRef.current) {
                  p.x = p.targetX
                  p.y = p.targetY
                }
                phaseRef.current = 'ambient'
                ambientStartRef.current = performance.now()
                const lo2 = layoutRef.current
                if (lo2) {
                  prepareAmbientOrbit(
                    particlesRef.current,
                    lo2.center,
                    lo2.ringRadius,
                  )
                }
              }
            }, FORCE_AMBIENT_AFTER_SWARM))
          }, SWARM_DELAY))
        }
      },
      { threshold: [0, 0.2] },
    )

    obs.observe(el)
    return () => {
      obs.disconnect()
      for (const id of timers) clearTimeout(id)
    }
  }, [])

  // Canvas setup + resize
  useEffect(() => {
    const canvas = canvasRef.current
    const section = sectionRef.current
    if (!canvas || !section) return

    const resize = () => {
      const rect = section.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`

      const w = rect.width
      const h = rect.height
      const newLayout = computeLayout(w, h)
      layoutRef.current = newLayout
      setLayout(newLayout)

      const phase = phaseRef.current

      if (!hasOrganizedRef.current) {
        particlesRef.current = initParticles(w, h)
      } else if (phase === 'organize') {
        for (const p of particlesRef.current) {
          const c = newLayout.clusters[p.domainIndex]
          const a = rand(0, Math.PI * 2)
          const d = Math.pow(Math.random(), 0.5) * newLayout.clusterR
          p.targetX = c.x + Math.cos(a) * d
          p.targetY = c.y + Math.sin(a) * d
        }
      } else {
        setSwarmTargets(particlesRef.current, newLayout.center, newLayout.ringRadius)
      }
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(section)
    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(() => requestAnimationFrame(resize))
    }
    return () => ro.disconnect()
  }, [])

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let running = true
    let lastNow = 0

    const tick = (now: number) => {
      if (!running) return
      animRef.current = requestAnimationFrame(tick)

      // Tab-resume guard: a backgrounded tab pauses (or throttles) rAF while the
      // wall clock keeps running, so on return `now` has jumped ahead by however
      // long we were away. The ambient orbit is a function of absolute time, so
      // without this it snaps to a desynced, scrambled ring — and barely
      // recovers afterward, since the orbit speed is tiny. Push the time anchors
      // past the gap so all time-based motion resumes exactly where it paused.
      if (lastNow && now - lastNow > 200) {
        const gap = now - lastNow
        phaseStartRef.current += gap
        ambientStartRef.current += gap
      }
      lastNow = now

      if (!isVisibleRef.current) return

      const lo = layoutRef.current
      if (!lo) return

      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
      const w = canvas.width / dpr
      const h = canvas.height / dpr
      const particles = particlesRef.current
      const phase = phaseRef.current
      const elapsed = now - phaseStartRef.current

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)

      // Glows
      if (phase === 'organize') {
        const glowA = Math.min(elapsed / 2500, 1) * 0.12
        for (let i = 0; i < lo.clusters.length; i++) {
          const c = lo.clusters[i]
          const [r, g, b] = DOMAIN_RGB[i]
          const grad = ctx.createRadialGradient(
            c.x,
            c.y,
            0,
            c.x,
            c.y,
            lo.clusterR * 2.2,
          )
          grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${glowA})`)
          grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)
          ctx.fillStyle = grad
          ctx.beginPath()
          ctx.arc(c.x, c.y, lo.clusterR * 2.2, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // Particles
      let allSettled = true
      const stiffness = phase === 'swarm' ? SWARM_STIFFNESS : SPRING_STIFFNESS
      const damping = phase === 'swarm' ? SWARM_DAMPING : SPRING_DAMPING

      for (const p of particles) {
        if (phase === 'chaos') {
          p.vx += rand(-BROWNIAN_FORCE, BROWNIAN_FORCE)
          p.vy += rand(-BROWNIAN_FORCE, BROWNIAN_FORCE)
          p.vx *= 0.97
          p.vy *= 0.97
          p.x += p.vx
          p.y += p.vy

          const dx = p.x - lo.center.x
          const dy = p.y - lo.center.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist > lo.ringRadius * 0.88) {
            const overshoot = (dist - lo.ringRadius * 0.88) / lo.ringRadius
            p.vx -= (dx / dist) * overshoot * 0.6
            p.vy -= (dy / dist) * overshoot * 0.6
          }
          if (dist > lo.ringRadius) {
            const angle = Math.atan2(dy, dx)
            p.x = lo.center.x + Math.cos(angle) * lo.ringRadius * 0.98
            p.y = lo.center.y + Math.sin(angle) * lo.ringRadius * 0.98
            const dot = (p.vx * dx) / dist + (p.vy * dy) / dist
            p.vx -= 1.5 * dot * (dx / dist)
            p.vy -= 1.5 * dot * (dy / dist)
          }
        } else if (phase === 'organize' || phase === 'swarm') {
          if (elapsed > p.delay) {
            const dx = p.targetX - p.x
            const dy = p.targetY - p.y
            p.vx += dx * stiffness
            p.vy += dy * stiffness
            p.vx *= damping
            p.vy *= damping
            p.x += p.vx
            p.y += p.vy

            const dist = Math.sqrt(dx * dx + dy * dy)
            const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
            if (dist < SETTLE_DISTANCE && speed < SETTLE_VELOCITY) {
              p.settled = true
            } else {
              allSettled = false
            }
          } else {
            p.vx += rand(-BROWNIAN_FORCE * 0.2, BROWNIAN_FORCE * 0.2)
            p.vy += rand(-BROWNIAN_FORCE * 0.2, BROWNIAN_FORCE * 0.2)
            p.vx *= 0.97
            p.vy *= 0.97
            p.x += p.vx
            p.y += p.vy
            allSettled = false
          }
        } else {
          // ambient
          const t = (now - ambientStartRef.current) * ORBIT_SPEED
          const angle = p.baseAngle + t * p.orbitSpeed
          const r =
            lo.ringRadius +
            Math.sin(t * 0.5 * p.orbitSpeed + p.phaseOffset) * p.orbitRadius
          p.x = lo.center.x + Math.cos(angle) * r
          p.y = lo.center.y + Math.sin(angle) * r
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = p.fill
        ctx.fill()
      }

      if (
        phase === 'swarm' &&
        allSettled &&
        particles.length > 0 &&
        elapsed > 1200
      ) {
        phaseRef.current = 'ambient'
        ambientStartRef.current = now
        const lo2 = layoutRef.current
        if (lo2) prepareAmbientOrbit(particles, lo2.center, lo2.ringRadius)
      }
    }

    animRef.current = requestAnimationFrame(tick)
    return () => {
      running = false
      cancelAnimationFrame(animRef.current)
    }
  }, [])

  // Avatar sits inside the particle ring with visible breathing room — the
  // 1.25 factor leaves a clean gap so swarming particles don't visually
  // overlap the avatar edge.
  const ringSize = layout ? layout.ringRadius * 1.25 : 0
  const ringPad = layout ? Math.max(4, layout.ringRadius * 0.055) : 0

  return (
    <>
      <style>{STYLES}</style>
      <div ref={sectionRef} className="ha-root">
        <canvas ref={canvasRef} className="ha-canvas" />

        {layout && (
          <div
            className="ha-avatar-wrap"
            data-show={showAvatar ? 'true' : 'false'}
            style={{
              left: layout.center.x,
              top: layout.center.y,
              width: ringSize,
              height: ringSize,
            }}
          >
            <div
              className="ha-avatar-ring"
              data-hover={isHovered ? 'true' : 'false'}
              data-scanned={hasScanned ? 'true' : 'false'}
              style={{ padding: ringPad }}
              onMouseEnter={() => {
                setIsHovered(true)
                setHasScanned(true)
              }}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div className="ha-avatar-inner">
                <img
                  src={AVATAR_SRC}
                  alt=""
                  aria-hidden="true"
                  className="ha-avatar-img ha-avatar-img-gray"
                  draggable={false}
                />
                <img
                  src={AVATAR_SRC}
                  alt=""
                  aria-hidden="true"
                  className="ha-avatar-img ha-avatar-img-color"
                  draggable={false}
                />
                <div className="ha-scan" />
              </div>
            </div>
          </div>
        )}

        {layout && (
          <div className="ha-labels" data-show={showLabels ? 'true' : 'false'}>
            {DOMAIN_NAMES.map((name, i) => {
              const [r, g, b] = DOMAIN_RGB[i]
              const pos = layout.labels[i]
              return (
                <div
                  key={name}
                  className="ha-label"
                  data-i={i}
                  style={{ left: pos.x, top: pos.y, color: `rgb(${r}, ${g}, ${b})` }}
                >
                  {name}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
