'use client'

import { clsx } from 'clsx'

export function Logo({ className, isLight = false }: { className?: string; isLight?: boolean }) {
  // If isLight is true, show white logo (original)
  // If isLight is false, show dark logo (inverted)
  return (
    <img
      src="/lab-logo/ASL_Logo_White.png"
      alt="ASL Lab"
      className={clsx(className)}
      style={{ filter: isLight ? 'none' : 'invert(1)' }}
    />
  )
}

export function Mark({ className, isLight = false }: { className?: string; isLight?: boolean }) {
  // Using the same logo for Mark component - you may want to use a square version if available
  return (
    <img
      src="/lab-logo/ASL_Logo_White.png"
      alt="ASL Lab"
      className={clsx(className)}
      style={{ filter: isLight ? 'none' : 'invert(1)' }}
    />
  )
}