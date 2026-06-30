'use client'

import { clsx } from 'clsx'
import { useId } from 'react'

type Embodiment = {
  id: string
  label: string
  x: number
  glyph: React.ReactNode
}

type Input = {
  id: string
  label: string
  x: number
  glyph: React.ReactNode
}

/* ---------- input modality glyphs (24×24 local) ---------- */
function EyeGlyph() {
  return (
    <g fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12 C6 5.5 18 5.5 22 12 C18 18.5 6 18.5 2 12 Z" />
      <circle cx="12" cy="12" r="3" />
    </g>
  )
}
function ChatGlyph() {
  return (
    <g fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 5 H21 V15 H11 L7 19 V15 H3 Z" />
      <path d="M7 10 H7.01 M12 10 H12.01 M17 10 H17.01" />
    </g>
  )
}
function GaugeGlyph() {
  return (
    <g fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.5 17 A9 9 0 0 1 20.5 17" />
      <path d="M12 17 L16.5 11" />
      <circle cx="12" cy="17" r="1.6" fill="currentColor" stroke="none" />
    </g>
  )
}

/* ---------- embodiment glyphs (56×56 local) ---------- */
function ManipulatorGlyph() {
  return (
    <g fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 50 H26" />
      <path d="M18 50 V36" />
      <path d="M18 36 L36 24" />
      <path d="M36 24 L50 31" />
      <path d="M50 31 L56 26 M50 31 L56 36" />
      <circle cx="18" cy="36" r="2.4" fill="currentColor" stroke="none" />
      <circle cx="36" cy="24" r="2.4" fill="currentColor" stroke="none" />
    </g>
  )
}
function QuadrupedGlyph() {
  return (
    <g fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 24 H42 V32 H14 Z" />
      <path d="M42 26 L52 22 V32 L42 30" />
      <path d="M17 32 V46 M25 32 V46 M33 32 V46 M41 32 V46" />
    </g>
  )
}
function VehicleGlyph() {
  return (
    <g fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 38 Q8 30 16 30 L20 30 L26 21 L40 21 L46 30 L52 30 Q56 30 56 38 L56 40 H8 Z" />
      <circle cx="20" cy="40" r="5" />
      <circle cx="44" cy="40" r="5" />
    </g>
  )
}

const INPUTS: Input[] = [
  { id: 'vision', label: 'Vision', x: 175, glyph: <EyeGlyph /> },
  { id: 'language', label: 'Language', x: 300, glyph: <ChatGlyph /> },
  { id: 'state', label: 'State', x: 425, glyph: <GaugeGlyph /> },
]

const EMBODIMENTS: Embodiment[] = [
  { id: 'manip', label: 'Manipulation', x: 120, glyph: <ManipulatorGlyph /> },
  { id: 'loco', label: 'Locomotion', x: 300, glyph: <QuadrupedGlyph /> },
  { id: 'drive', label: 'Driving', x: 480, glyph: <VehicleGlyph /> },
]

const INPUT = { y: 40, w: 104, h: 40 }
const MODEL = { cx: 300, top: 132, w: 288, h: 104 }
const CHIP = { y: 300, size: 104 }

const MODEL_BOTTOM = MODEL.top + MODEL.h

function inputPath(fromX: number, toX: number) {
  const fromY = INPUT.y + INPUT.h
  const toY = MODEL.top
  const midY = (fromY + toY) / 2
  return `M ${fromX} ${fromY} C ${fromX} ${midY}, ${toX} ${midY}, ${toX} ${toY}`
}

function outputPath(toX: number) {
  const fromX = MODEL.cx
  const fromY = MODEL_BOTTOM
  const toY = CHIP.y
  const midY = (fromY + toY) / 2
  return `M ${fromX} ${fromY} C ${fromX} ${midY}, ${toX} ${midY}, ${toX} ${toY}`
}

// faint transformer texture inside the model node
const TEX_ROWS = 4
const TEX_COLS = 9

export function RobotFoundationDiagram({ className }: { className?: string }) {
  const uid = useId().replace(/:/g, '')
  const gridId = `rfm-grid-${uid}`
  const modelGradId = `rfm-model-${uid}`
  const flowGradId = `rfm-flow-${uid}`
  const clipId = `rfm-clip-${uid}`
  const glowId = `rfm-glow-${uid}`

  const modelLeft = MODEL.cx - MODEL.w / 2
  const modelTop = MODEL.top

  return (
    <div className={clsx('relative size-full overflow-hidden bg-white', className)}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(79,70,229,0.10),transparent_55%),radial-gradient(circle_at_12%_90%,rgba(14,165,233,0.12),transparent_50%),radial-gradient(circle_at_88%_88%,rgba(99,102,241,0.10),transparent_50%)]" />
      <div className="rfm-blob rfm-blob-a pointer-events-none absolute -left-16 top-1/3 h-44 w-44 rounded-full bg-indigo-400/15 blur-3xl" />
      <div className="rfm-blob rfm-blob-b pointer-events-none absolute -right-12 top-10 h-40 w-40 rounded-full bg-sky-400/15 blur-3xl" />

      <svg viewBox="0 0 600 420" preserveAspectRatio="xMidYMid meet" className="relative size-full">
        <defs>
          <pattern id={gridId} width="22" height="22" patternUnits="userSpaceOnUse">
            <path d="M22 0H0V22" fill="none" stroke="rgba(15,23,42,0.045)" strokeWidth="1" />
          </pattern>
          <linearGradient id={modelGradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4f46e5" />
            <stop offset="55%" stopColor="#4338ca" />
            <stop offset="100%" stopColor="#0ea5e9" />
          </linearGradient>
          <linearGradient id={flowGradId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4f46e5" />
            <stop offset="100%" stopColor="#0ea5e9" />
          </linearGradient>
          <clipPath id={clipId}>
            <rect x={modelLeft} y={modelTop} width={MODEL.w} height={MODEL.h} rx={18} />
          </clipPath>
          <filter id={glowId} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect x="0" y="0" width="600" height="420" fill={`url(#${gridId})`} />

        {/* input -> model connectors */}
        {INPUTS.map((inp, i) => {
          const id = `rfm-in-${uid}-${inp.id}`
          const tx = MODEL.cx + (inp.x - MODEL.cx) * 0.42
          const d = inputPath(inp.x, tx)
          return (
            <g key={`in-${inp.id}`}>
              <path id={id} d={d} fill="none" stroke="#6366f1" strokeOpacity={0.8} strokeWidth={2.2} strokeLinecap="round" />
              <circle r={2.6} className="rfm-particle" fill="#6366f1">
                <animateMotion dur="2.6s" begin={`${i * 0.5}s`} repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="linear">
                  <mpath href={`#${id}`} />
                </animateMotion>
              </circle>
            </g>
          )
        })}

        {/* model -> embodiment connectors */}
        {EMBODIMENTS.map((e, i) => {
          const id = `rfm-out-${uid}-${e.id}`
          const d = outputPath(e.x)
          return (
            <g key={`out-${e.id}`}>
              <path id={id} d={d} fill="none" stroke="#2563eb" strokeOpacity={0.8} strokeWidth={2.2} strokeLinecap="round" />
              <circle r={2.8} className="rfm-particle" fill="#0ea5e9">
                <animateMotion dur="2.8s" begin={`${0.3 + i * 0.45}s`} repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="linear">
                  <mpath href={`#${id}`} />
                </animateMotion>
              </circle>
            </g>
          )
        })}

        {/* input modality pills */}
        {INPUTS.map((inp) => {
          const x = inp.x - INPUT.w / 2
          return (
            <g key={`pill-${inp.id}`}>
              <rect x={x} y={INPUT.y} width={INPUT.w} height={INPUT.h} rx={INPUT.h / 2} fill="#ffffff" stroke="rgba(79,70,229,0.18)" strokeWidth={1.4} />
              <g transform={`translate(${x + 16}, ${INPUT.y + INPUT.h / 2 - 12})`} className="text-sky-600">
                {inp.glyph}
              </g>
              <text x={inp.x + 14} y={INPUT.y + INPUT.h / 2 + 4} textAnchor="middle" className="rfm-input-label" fill="#334155">
                {inp.label}
              </text>
            </g>
          )
        })}

        {/* central foundation model node */}
        <g filter={`url(#${glowId})`}>
          <rect x={modelLeft} y={modelTop} width={MODEL.w} height={MODEL.h} rx={18} fill={`url(#${modelGradId})`} />
        </g>
        {/* faint latent dot matrix backdrop */}
        <g clipPath={`url(#${clipId})`} opacity={0.3}>
          {Array.from({ length: TEX_ROWS }).map((_, r) =>
            Array.from({ length: TEX_COLS }).map((_, c) => {
              const px = modelLeft + 26 + (c * (MODEL.w - 52)) / (TEX_COLS - 1)
              const py = modelTop + 22 + r * 18
              return <circle key={`tex-${r}-${c}`} cx={px} cy={py} r={1.3} fill="rgba(255,255,255,0.5)" />
            }),
          )}
        </g>
        <rect x={modelLeft} y={modelTop} width={MODEL.w} height={MODEL.h} rx={18} fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth={1} />
        <text x={MODEL.cx} y={modelTop + MODEL.h / 2 + 7} textAnchor="middle" className="rfm-title" fill="#ffffff">
          Embodied Intelligence
        </text>

        {/* embodiment chips */}
        {EMBODIMENTS.map((e) => {
          const half = CHIP.size / 2
          return (
            <g key={`chip-${e.id}`}>
              <rect x={e.x - half} y={CHIP.y} width={CHIP.size} height={CHIP.size} rx={16} fill="#ffffff" stroke="rgba(79,70,229,0.18)" strokeWidth={1.5} />
              <rect x={e.x - half} y={CHIP.y} width={CHIP.size} height={3} rx={1.5} fill={`url(#${flowGradId})`} opacity={0.7} />
              <g transform={`translate(${e.x - 28}, ${CHIP.y + 16})`} className="text-indigo-600">
                {e.glyph}
              </g>
              <text x={e.x} y={CHIP.y + CHIP.size - 14} textAnchor="middle" className="rfm-label" fill="#334155">
                {e.label}
              </text>
            </g>
          )
        })}
      </svg>

      <style jsx>{`
        :global(.rfm-title) {
          font-size: 19px;
          font-weight: 600;
          letter-spacing: -0.01em;
        }
        :global(.rfm-label) {
          font-size: 13px;
          font-weight: 600;
        }
        :global(.rfm-input-label) {
          font-size: 12px;
          font-weight: 600;
        }
        .rfm-blob {
          animation: rfm-blob-pulse 6s ease-in-out infinite;
          will-change: transform, opacity;
        }
        .rfm-blob-b {
          animation-delay: -2s;
        }
        @keyframes rfm-blob-pulse {
          0%,
          100% {
            opacity: 0.5;
            transform: scale(0.95);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.05);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .rfm-blob {
            animation: none;
          }
          .rfm-particle {
            display: none;
          }
        }
      `}</style>
    </div>
  )
}
