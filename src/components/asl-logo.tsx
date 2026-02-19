import { clsx } from 'clsx'

export function ASLLogo({
  className,
  inverted = false,
  isLight = false
}: {
  className?: string
  inverted?: boolean
  isLight?: boolean
}) {
  // If isLight is true, we want white logo (no inversion needed for white logo)
  // If isLight is false, we want dark logo (invert the white logo)
  const shouldInvert = !isLight || inverted

  return (
    <img
      src="/lab-logo/ASL_Logo_White.png"
      alt="ASL Lab"
      className={clsx(className, {
        'filter invert': shouldInvert,
        'filter-none': !shouldInvert,
      })}
    />
  )
}

// Alternative with explicit dark version
export function ASLLogoDark({ className }: { className?: string }) {
  return (
    <img
      src="/lab-logo/ASL_Logo_White.png"
      alt="ASL Lab"
      className={clsx(className, 'filter invert')}
      style={{ filter: 'invert(1)' }}
    />
  )
}

// Alternative with explicit white version (no inversion)
export function ASLLogoWhite({ className }: { className?: string }) {
  return (
    <img
      src="/lab-logo/ASL_Logo_White.png"
      alt="ASL Lab"
      className={className}
    />
  )
}