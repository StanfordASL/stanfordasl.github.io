'use client'

import { Carousel } from 'motion-plus/react'

interface ImageCarouselProps {
  images: string[]
  className?: string
}

export function ImageCarousel({ images, className }: ImageCarouselProps) {
  if (images.length === 0) {
    return null
  }

  return (
    <div className={className} style={{ overflowX: 'clip' }}>
      <Carousel
        className="w-full"
        items={images.map((image, index) => (
          <img
            key={image}
            draggable={false}
            src={`/visual-highlights/${image}`}
            alt={`Visual highlight ${index + 1}`}
            className="h-[340px] rounded-2xl object-cover"
            style={{ aspectRatio: '4 / 3' }}
          />
        ))}
        overflow
        gap={16}
        snap={false}
      />
    </div>
  )
}
