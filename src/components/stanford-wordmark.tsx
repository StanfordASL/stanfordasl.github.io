import { clsx } from 'clsx'

// Lightweight Stanford co-brand wordmark. Set in Source Serif 4 (Stanford's
// brand serif) so it reads as the institutional mark without bundling the
// trademarked signature file. Color/size are supplied by the caller; default
// brand color is Stanford Cardinal (#8C1515).
//
// If the official Stanford signature SVG is later added under /public, this can
// be swapped for an <img>/inline SVG without changing call sites.
export function StanfordWordmark({
  className,
  children = 'Stanford University',
}: {
  className?: string
  children?: React.ReactNode
}) {
  return (
    <span
      className={clsx('font-medium leading-none tracking-tight', className)}
      style={{ fontFamily: "var(--font-source-serif), Georgia, 'Times New Roman', serif" }}
    >
      {children}
    </span>
  )
}
