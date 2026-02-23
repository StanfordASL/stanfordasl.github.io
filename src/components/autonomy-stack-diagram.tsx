'use client'

import { clsx } from 'clsx'
import { useEffect, useId, useState } from 'react'

type LayerId = 'ingest' | 'embedding' | 'world' | 'policy' | 'control'

type Layer = {
  id: LayerId
  x: number
  count: number
  yMin: number
  yMax: number
  radius: number
}

type Node = {
  id: string
  layer: LayerId
  x: number
  y: number
  radius: number
}

type Link = {
  id: string
  from: string
  to: string
  strength: number
}

type AttentionLink = {
  id: string
  from: string
  to: string
  intensity: number
}

type RenderLink = {
  id: string
  d: string
  strength: number
  delayMs: number
}

type RenderAttentionLink = {
  id: string
  d: string
  intensity: number
  delayMs: number
}

const LAYERS: Layer[] = [
  { id: 'ingest', x: 90, count: 10, yMin: 52, yMax: 448, radius: 4.8 },
  { id: 'embedding', x: 250, count: 12, yMin: 42, yMax: 458, radius: 4.4 },
  { id: 'world', x: 430, count: 16, yMin: 30, yMax: 470, radius: 4.2 },
  { id: 'policy', x: 620, count: 11, yMin: 48, yMax: 452, radius: 4.4 },
  { id: 'control', x: 790, count: 8, yMin: 74, yMax: 426, radius: 5.2 },
]

const SELF_ATTENTION_LAYERS: LayerId[] = ['ingest', 'embedding', 'world']

const BASE_EDGE_KEEP_PROBABILITY = 0.16
const EDGE_BIAS_NEAR_DIAGONAL = 0.18
const MIN_LINKS_PER_SOURCE = 1

const SPARSITY_RESHUFFLE_MS = 1800
const PATTERN_COUNT = 10

function interpolate(min: number, max: number, t: number) {
  return min + (max - min) * t
}

function buildNodes() {
  const nodes: Node[] = []
  for (const layer of LAYERS) {
    for (let i = 0; i < layer.count; i += 1) {
      const t = layer.count === 1 ? 0.5 : i / (layer.count - 1)
      nodes.push({
        id: `${layer.id}-${i}`,
        layer: layer.id,
        x: layer.x,
        y: interpolate(layer.yMin, layer.yMax, t),
        radius: layer.radius,
      })
    }
  }
  return nodes
}

const NODES = buildNodes()
const NODES_BY_ID = new Map(NODES.map((node) => [node.id, node]))

function pseudoRandomUnit(seed: string) {
  let hash = 2166136261
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return (hash >>> 0) / 4294967295
}

function buildLayerLinks(from: Layer, to: Layer, seed: number) {
  const links: Link[] = []
  const included = new Set<string>()
  const incomingCount = new Array<number>(to.count).fill(0)
  const outgoingCount = new Array<number>(from.count).fill(0)

  const addLink = (i: number, j: number, strength: number) => {
    const fromId = `${from.id}-${i}`
    const toId = `${to.id}-${j}`
    const id = `${fromId}->${toId}`
    if (included.has(id)) return
    included.add(id)
    incomingCount[j] += 1
    outgoingCount[i] += 1
    links.push({ id, from: fromId, to: toId, strength })
  }

  for (let i = 0; i < from.count; i += 1) {
    const fromT = from.count === 1 ? 0.5 : i / (from.count - 1)
    const candidates: Array<{ j: number; distance: number; strength: number; rand: number }> = []

    for (let j = 0; j < to.count; j += 1) {
      const toT = to.count === 1 ? 0.5 : j / (to.count - 1)
      const distance = Math.abs(fromT - toT)
      const strength = Math.max(0.25, 1 - distance * 0.9)
      const rand = pseudoRandomUnit(`${seed}:${from.id}:${i}->${to.id}:${j}`)
      const keepProbability = BASE_EDGE_KEEP_PROBABILITY + (1 - distance) * EDGE_BIAS_NEAR_DIAGONAL
      candidates.push({ j, distance, strength, rand })

      if (rand <= keepProbability) {
        addLink(i, j, strength)
      }
    }

    if (outgoingCount[i] < MIN_LINKS_PER_SOURCE) {
      candidates
        .sort((a, b) => a.distance - b.distance || a.rand - b.rand)
        .forEach((candidate) => {
          if (outgoingCount[i] >= MIN_LINKS_PER_SOURCE) return
          addLink(i, candidate.j, candidate.strength)
        })
    }
  }

  // Ensure each target has at least one incoming edge.
  for (let j = 0; j < to.count; j += 1) {
    if (incomingCount[j] > 0) continue
    const toT = to.count === 1 ? 0.5 : j / (to.count - 1)
    let bestSource = 0
    let bestDistance = Number.POSITIVE_INFINITY

    for (let i = 0; i < from.count; i += 1) {
      const fromT = from.count === 1 ? 0.5 : i / (from.count - 1)
      const distance = Math.abs(fromT - toT)
      if (distance < bestDistance) {
        bestDistance = distance
        bestSource = i
      }
    }

    addLink(bestSource, j, Math.max(0.25, 1 - bestDistance * 0.9))
  }

  return links
}

function buildLinks(seed: number) {
  const links: Link[] = []

  for (let i = 0; i < LAYERS.length - 1; i += 1) {
    const from = LAYERS[i]
    const to = LAYERS[i + 1]
    links.push(...buildLayerLinks(from, to, seed))
  }

  return links
}

function buildSelfAttentionLinks(seed: number) {
  const links: AttentionLink[] = []
  const included = new Set<string>()

  for (const layerId of SELF_ATTENTION_LAYERS) {
    const layerNodes = NODES.filter((node) => node.layer === layerId)
    const activeIndices = layerNodes
      .map((_, index) => index)
      .filter((index) => index % 2 === 0)

    for (const sourceIndex of activeIndices) {
      for (let k = 0; k < 2; k += 1) {
        const targetRand = pseudoRandomUnit(`${seed}:attn:${layerId}:${sourceIndex}:${k}`)
        let targetIndex = Math.floor(targetRand * layerNodes.length)
        if (targetIndex === sourceIndex) {
          targetIndex = (targetIndex + 1) % layerNodes.length
        }

        const from = layerNodes[sourceIndex]
        const to = layerNodes[targetIndex]
        if (!from || !to || from.id === to.id) continue

        const id = `${from.id}~>${to.id}`
        if (included.has(id)) continue
        included.add(id)

        const intensity = 0.35 + 0.65 * pseudoRandomUnit(`${seed}:attn-weight:${id}`)
        links.push({ id, from: from.id, to: to.id, intensity })
      }
    }
  }

  return links
}

function linkPath(from: Node, to: Node) {
  const dx = to.x - from.x
  const c1x = from.x + dx * 0.34
  const c2x = to.x - dx * 0.34
  return `M ${from.x} ${from.y} C ${c1x} ${from.y}, ${c2x} ${to.y}, ${to.x} ${to.y}`
}

function selfAttentionPath(from: Node, to: Node) {
  const distance = Math.abs(to.y - from.y)
  const bend = 22 + distance * 0.12
  const c1x = from.x + bend
  const c2x = to.x + bend
  return `M ${from.x} ${from.y} C ${c1x} ${from.y}, ${c2x} ${to.y}, ${to.x} ${to.y}`
}

function toRenderLinks(links: Link[]): RenderLink[] {
  return links.flatMap((link, index) => {
    const from = NODES_BY_ID.get(link.from)
    const to = NODES_BY_ID.get(link.to)
    if (!from || !to) return []

    return [{
      id: link.id,
      d: linkPath(from, to),
      strength: link.strength,
      delayMs: -((index % 18) * 110),
    }]
  })
}

function toRenderAttentionLinks(links: AttentionLink[]): RenderAttentionLink[] {
  return links.flatMap((link, index) => {
    const from = NODES_BY_ID.get(link.from)
    const to = NODES_BY_ID.get(link.to)
    if (!from || !to) return []

    return [{
      id: link.id,
      d: selfAttentionPath(from, to),
      intensity: link.intensity,
      delayMs: -((index % 12) * 120),
    }]
  })
}

const PRECOMPUTED_PATTERNS = Array.from({ length: PATTERN_COUNT }, (_, index) => {
  const seed = index + 1
  return {
    main: toRenderLinks(buildLinks(seed)),
    attention: toRenderAttentionLinks(buildSelfAttentionLinks(seed + 71)),
  }
})

export function AutonomyStackDiagram({ className }: { className?: string }) {
  const uid = useId().replace(/:/g, '')
  const [patternIndex, setPatternIndex] = useState(0)
  const signalGradientId = `signal-${uid}`
  const attentionGradientId = `attn-${uid}`
  const nodeGradientId = `node-${uid}`
  const haloGradientId = `halo-${uid}`
  const gridPatternId = `grid-${uid}`
  const glowFilterId = `glow-${uid}`
  const pattern = PRECOMPUTED_PATTERNS[patternIndex]

  useEffect(() => {
    let intervalId: number | null = null

    const start = () => {
      if (intervalId !== null) return
      intervalId = window.setInterval(() => {
        setPatternIndex((current) => (current + 1) % PATTERN_COUNT)
      }, SPARSITY_RESHUFFLE_MS)
    }

    const stop = () => {
      if (intervalId === null) return
      window.clearInterval(intervalId)
      intervalId = null
    }

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        start()
      } else {
        stop()
      }
    }

    onVisibilityChange()
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      stop()
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [])

  return (
    <div
      className={clsx(
        'relative h-[380px] w-full overflow-hidden rounded-2xl',
        'bg-[#050B1A] ring-1 ring-white/10',
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_20%,rgba(56,189,248,0.18),transparent_34%),radial-gradient(circle_at_82%_30%,rgba(59,130,246,0.2),transparent_44%),radial-gradient(circle_at_50%_85%,rgba(20,184,166,0.1),transparent_48%)]" />

      <div className="autonomy-ambient autonomy-ambient-left pointer-events-none absolute -left-24 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="autonomy-ambient autonomy-ambient-right pointer-events-none absolute -right-20 top-20 h-52 w-52 rounded-full bg-blue-400/15 blur-3xl" />

      <svg viewBox="0 0 900 500" className="relative size-full">
        <defs>
          <pattern id={gridPatternId} width="18" height="18" patternUnits="userSpaceOnUse">
            <path d="M18 0H0V18" fill="none" stroke="rgba(148,163,184,0.09)" strokeWidth="1" />
          </pattern>
          <linearGradient id={signalGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(125,211,252,0.42)" />
            <stop offset="48%" stopColor="rgba(59,130,246,0.9)" />
            <stop offset="100%" stopColor="rgba(45,212,191,0.45)" />
          </linearGradient>
          <linearGradient id={attentionGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(45,212,191,0.12)" />
            <stop offset="55%" stopColor="rgba(45,212,191,0.82)" />
            <stop offset="100%" stopColor="rgba(125,211,252,0.24)" />
          </linearGradient>
          <radialGradient id={nodeGradientId}>
            <stop offset="0%" stopColor="#E0F2FE" />
            <stop offset="75%" stopColor="#7DD3FC" />
            <stop offset="100%" stopColor="#2563EB" />
          </radialGradient>
          <radialGradient id={haloGradientId}>
            <stop offset="0%" stopColor="rgba(125,211,252,0.35)" />
            <stop offset="100%" stopColor="rgba(125,211,252,0)" />
          </radialGradient>
          <filter id={glowFilterId} x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="2.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect x="0" y="0" width="900" height="500" fill={`url(#${gridPatternId})`} opacity={0.55} />

        <circle cx="430" cy="250" r="136" fill="none" stroke={`url(#${haloGradientId})`} strokeWidth="1.25" className="autonomy-ring" />
        <circle cx="430" cy="250" r="168" fill="none" stroke="rgba(125,211,252,0.2)" strokeWidth="1" className="autonomy-ring autonomy-ring-secondary" />

        {pattern.attention.map((link) => (
          <path
            key={link.id}
            d={link.d}
            className="autonomy-attn"
            stroke={`url(#${attentionGradientId})`}
            strokeWidth={0.7 + link.intensity * 0.6}
            strokeOpacity={0.26 + link.intensity * 0.24}
            fill="none"
            style={{ animationDelay: `${link.delayMs}ms` }}
          />
        ))}

        {pattern.main.map((link) => (
          <path
            key={link.id}
            d={link.d}
            className="autonomy-signal"
            stroke={`url(#${signalGradientId})`}
            strokeWidth={0.8 + link.strength * 0.9}
            strokeOpacity={0.32 + link.strength * 0.28}
            fill="none"
            style={{ animationDelay: `${link.delayMs}ms` }}
          />
        ))}

        {NODES.map((node, index) => (
          <g key={node.id}>
            <circle cx={node.x} cy={node.y} r={node.radius * 2.2} fill={`url(#${haloGradientId})`} opacity={0.2} />
            <circle
              cx={node.x}
              cy={node.y}
              r={node.radius}
              filter={`url(#${glowFilterId})`}
              fill={`url(#${nodeGradientId})`}
              className="autonomy-node"
              style={{ animationDelay: `${-((index % 15) * 100)}ms` }}
            />
          </g>
        ))}
      </svg>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#050B1A] to-transparent" />

      <style jsx>{`
        @keyframes autonomy-flow {
          0% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: -280;
          }
        }

        @keyframes autonomy-ambient {
          0%,
          100% {
            opacity: 0.22;
            transform: scale(0.94);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.06);
          }
        }

        @keyframes autonomy-ring {
          0%,
          100% {
            opacity: 0.42;
          }
          50% {
            opacity: 0.9;
          }
        }

        @keyframes autonomy-node {
          0%,
          100% {
            opacity: 0.68;
          }
          50% {
            opacity: 1;
          }
        }

        .autonomy-signal {
          stroke-dasharray: 10 12;
          animation: autonomy-flow 4.2s linear infinite;
          will-change: stroke-dashoffset;
        }

        .autonomy-attn {
          stroke-dasharray: 5 9;
          animation: autonomy-flow 3.6s linear infinite;
          will-change: stroke-dashoffset;
        }

        .autonomy-ambient {
          animation: autonomy-ambient 5.6s ease-in-out infinite;
          will-change: transform, opacity;
        }

        .autonomy-ambient-right {
          animation-delay: -1.2s;
        }

        .autonomy-ring {
          animation: autonomy-ring 6.2s ease-in-out infinite;
          will-change: opacity;
        }

        .autonomy-ring-secondary {
          animation-delay: -0.7s;
        }

        .autonomy-node {
          animation: autonomy-node 2.6s ease-in-out infinite;
          will-change: opacity;
        }

        @media (prefers-reduced-motion: reduce) {
          .autonomy-signal,
          .autonomy-attn,
          .autonomy-ambient,
          .autonomy-ring,
          .autonomy-node {
            animation: none;
          }
        }
      `}</style>
    </div>
  )
}
