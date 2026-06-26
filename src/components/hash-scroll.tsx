'use client'

import { useEffect } from 'react'

/**
 * Scrolls to the element matching the current URL hash after the page settles.
 *
 * Next.js attempts a single scroll-to-hash right after a cross-page navigation,
 * but on image-heavy pages the images load afterwards and shift the layout,
 * leaving the user near the top. This re-runs the scroll a few times as content
 * settles (and once more on window load) so deep links like /research#safety
 * land on the right section.
 */
export function HashScroll() {
  useEffect(() => {
    if (!window.location.hash) return
    const id = decodeURIComponent(window.location.hash.slice(1))

    const scrollToTarget = () => {
      const el = document.getElementById(id)
      if (el) el.scrollIntoView()
    }

    scrollToTarget()
    const raf = requestAnimationFrame(scrollToTarget)
    const timers = [100, 300, 600].map((ms) => setTimeout(scrollToTarget, ms))
    window.addEventListener('load', scrollToTarget)

    return () => {
      cancelAnimationFrame(raf)
      timers.forEach(clearTimeout)
      window.removeEventListener('load', scrollToTarget)
    }
  }, [])

  return null
}
