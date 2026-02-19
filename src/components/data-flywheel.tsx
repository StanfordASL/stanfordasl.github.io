'use client'

import { clsx } from 'clsx'
import { motion } from 'framer-motion'

// Layout constants
const CX = 200
const CY = 155
const R = 105
const CHEVRON_R = R
const PILL_W = 130
const PILL_H = 36

// Heroicons 24x24 outline paths
const ICONS = {
  rocket:
    'M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z',
  signal:
    'M9.348 14.652a3.75 3.75 0 0 1 0-5.304m5.304 0a3.75 3.75 0 0 1 0 5.304m-7.425 2.121a6.75 6.75 0 0 1 0-9.546m9.546 0a6.75 6.75 0 0 1 0 9.546M5.106 18.894c-3.808-3.807-3.808-9.98 0-13.788m13.788 0c3.808 3.807 3.808 9.98 0 13.788M12 12h.008v.008H12V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z',
  warning:
    'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z',
  funnel:
    'M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z',
  cpu: 'M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Zm.75-12h9v9h-9v-9Z',
  shield:
    'M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z',
} as const

// Node definitions — clockwise from top
const NODES = [
  {
    label: 'Deploy Policy',
    subtitle: 'safety envelope',
    angle: 0,
    icon: ICONS.rocket,
  },
  {
    label: 'Robot Telemetry',
    subtitle: 'multi-modal data',
    angle: 60,
    icon: ICONS.signal,
  },
  {
    label: 'Detect Failures',
    subtitle: 'OOD & uncertainty',
    angle: 120,
    icon: ICONS.warning,
  },
  {
    label: 'Curate Data',
    subtitle: 'active learning',
    angle: 180,
    icon: ICONS.funnel,
  },
  {
    label: 'Train & Validate',
    subtitle: 'policy & perception',
    angle: 240,
    icon: ICONS.cpu,
  },
  {
    label: 'Release Gate',
    subtitle: 'sim → HIL → rollout',
    angle: 300,
    icon: ICONS.shield,
  },
] as const

function toRad(deg: number) {
  return (deg * Math.PI) / 180
}

function polar(angleDeg: number, r = R) {
  return {
    x: CX + r * Math.sin(toRad(angleDeg)),
    y: CY - r * Math.cos(toRad(angleDeg)),
  }
}

// --- Subcomponents ---

function Rings() {
  const rings = [
    // { r: R + 40, opacity: 0.2, delay: 0.4 },
    { r: R, opacity: 0.34, delay: 0.2 },
    // { r: R - 40, opacity: 0.24, delay: 0 },
  ]

  return (
    <>
      {rings.map(({ r, opacity, delay }, i) => (
        <motion.circle
          key={i}
          cx={CX}
          cy={CY}
          fill="none"
          stroke="var(--fw-ring)"
          strokeWidth={2}
          variants={{
            idle: { r, opacity },
            active: {
              r: [r, r + 3, r],
              opacity: [opacity, opacity + 0.1, opacity],
              transition: {
                duration: 2.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay,
              },
            },
          }}
        />
      ))}
    </>
  )
}

function Chevron({ angle, index }: { angle: number; index: number }) {
  const { x, y } = polar(angle, CHEVRON_R)

  // Triangle points along +x in local coordinates; group rotation aligns tangent direction.
  const raw = [
    [-5, -3.5],
    [6, 0],
    [-5, 3.5],
  ] as const
  const pts = raw
    .map(([px, py]) => `${px},${py}`)
    .join(' ')

  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`}>
      <motion.g
        variants={{
          idle: { opacity: 0.55, x: 0, y: 0 },
          active: {
            opacity: [0.55, 1, 0.55],
            x: [0, 4, 0],
            y: [0, -3, 0],
            transition: {
              y: {
                duration: 2.5,
                repeat: Infinity,
                delay: 0.2,
                ease: 'easeInOut',
              },
              opacity: {
                duration: 0.8,
                repeat: Infinity,
                repeatDelay: 2.2,
                delay: index * 0.5,
                ease: 'easeInOut',
              },
              x: {
                duration: 0.8,
                repeat: Infinity,
                repeatDelay: 2.2,
                delay: index * 0.5,
                ease: 'easeInOut',
              },
            },
          },
        }}
      >
        <polygon points={pts} fill="var(--fw-arrow)" />
      </motion.g>
    </g>
  )
}

function NodePill({
  label,
  subtitle,
  icon,
  x,
  y,
  index,
}: {
  label: string
  subtitle: string
  icon: string
  x: number
  y: number
  index: number
}) {
  const iconSize = 14
  const iconX = x - PILL_W / 2 + 11
  const iconY = y - iconSize / 2
  const textX = x + 6

  return (
    <motion.g
      variants={{
        idle: {},
        active: {
          scale: [1, 1.05, 1],
          transition: {
            duration: 0.8,
            repeat: Infinity,
            repeatDelay: 2.2,
            delay: index * 0.5,
            ease: 'easeInOut',
          },
        },
      }}
      style={{ transformOrigin: `${x}px ${y}px` }}
    >
      {/* Shadow */}
      <rect
        x={x - PILL_W / 2}
        y={y - PILL_H / 2 + 1.5}
        width={PILL_W}
        height={PILL_H}
        rx={PILL_H / 2}
        fill="var(--fw-shadow)"
      />
      {/* Pill body */}
      <rect
        x={x - PILL_W / 2}
        y={y - PILL_H / 2}
        width={PILL_W}
        height={PILL_H}
        rx={PILL_H / 2}
        fill="var(--fw-node-bg)"
        stroke="var(--fw-node-border)"
        strokeWidth={1}
      />
      {/* Icon */}
      <svg
        x={iconX}
        y={iconY}
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--fw-icon)"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={icon} />
      </svg>
      {/* Label */}
      <text
        x={textX}
        y={y - 5}
        textAnchor="middle"
        dominantBaseline="central"
        fill="var(--fw-node-text)"
        fontSize={10}
        fontWeight={600}
        fontFamily="ui-sans-serif, system-ui, sans-serif"
      >
        {label}
      </text>
      {/* Subtitle */}
      <text
        x={textX}
        y={y + 9}
        textAnchor="middle"
        dominantBaseline="central"
        fill="var(--fw-subtitle)"
        fontSize={7}
        fontFamily="ui-sans-serif, system-ui, sans-serif"
      >
        {subtitle}
      </text>
    </motion.g>
  )
}

// Chevron angles (tuned positions between nodes)
const CHEVRON_ANGLES = [320, 40, 90, 140, 220, 270]

// --- Main Component ---

export function DataFlywheel({ className }: { className?: string } = {}) {
  return (
    <div
      aria-hidden="true"
      className={clsx(
        'relative h-full',
        className,
        // Light mode
        '[--fw-node-bg:#fff] [--fw-node-border:#d1d5db] [--fw-node-text:#111827]',
        '[--fw-subtitle:#6b7280] [--fw-arrow:#3b82f6] [--fw-ring:#60a5fa]',
        '[--fw-icon:#3b82f6] [--fw-shadow:rgba(0,0,0,0.06)]',
        // Dark mode
        'group-data-dark:[--fw-node-bg:#374151] group-data-dark:[--fw-node-border:#6b7280]',
        'group-data-dark:[--fw-node-text:#f9fafb] group-data-dark:[--fw-subtitle:#d1d5db]',
        'group-data-dark:[--fw-arrow:#93c5fd] group-data-dark:[--fw-ring:#93c5fd]',
        'group-data-dark:[--fw-icon:#93c5fd] group-data-dark:[--fw-shadow:rgba(0,0,0,0.25)]',
      )}
    >
      <svg
        viewBox="0 0 400 320"
        className="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Decorative rings */}
        <Rings />

        {/* Directional chevrons between nodes */}
        {CHEVRON_ANGLES.map((angle, i) => (
          <Chevron key={`c${i}`} angle={angle} index={i} />
        ))}

        {/* Center robot icon */}
        <motion.g
          variants={{
            idle: { opacity: 0.55, scale: 1 },
            active: {
              opacity: [0.55, 0.85, 0.55],
              scale: [1, 1.1, 1],
              transition: {
                duration: 2.5,
                repeat: Infinity,
                ease: 'easeInOut',
              },
            },
          }}
          style={{ transformOrigin: `${CX}px ${CY}px` }}
        >
        <svg
          x={CX - 16}
          y={CY - 16}
          width={32}
          height={32}
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--fw-ring)"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 6a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2l0 -4" />
          <path d="M12 2v2" />
          <path d="M9 12v9" />
          <path d="M15 12v9" />
          <path d="M5 16l4 -2" />
          <path d="M15 14l4 2" />
          <path d="M9 18h6" />
          <path d="M10 8v.01" />
          <path d="M14 8v.01" />
        </svg>
        </motion.g>

        {/* Node pills */}
        {NODES.map((node, i) => {
          const { x, y } = polar(node.angle)
          return (
            <NodePill
              key={`n${i}`}
              label={node.label}
              subtitle={node.subtitle}
              icon={node.icon}
              x={Math.round(x * 10) / 10}
              y={Math.round(y * 10) / 10}
              index={i}
            />
          )
        })}
      </svg>
    </div>
  )
}
