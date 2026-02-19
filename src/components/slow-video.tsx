'use client'

import { useEffect, useRef } from 'react'

export function SlowVideo({
  src,
  playbackRate = 0.5,
  className,
}: {
  src: string
  playbackRate?: number
  className?: string
}) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.playbackRate = playbackRate
    }
  }, [playbackRate])

  return (
    <video
      ref={ref}
      autoPlay
      loop
      muted
      playsInline
      className={className}
    >
      <source src={src} type="video/mp4" />
    </video>
  )
}
