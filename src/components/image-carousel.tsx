'use client'

import { useEffect, useState } from 'react'
import { clsx } from 'clsx'
import Image from 'next/image'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

interface ImageCarouselProps {
  images: string[]
  className?: string
  autoPlayInterval?: number
}

export function ImageCarousel({
  images,
  className,
  autoPlayInterval = 4000
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (images.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [images.length, autoPlayInterval])

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1)
  }

  const goToNext = () => {
    setCurrentIndex((currentIndex + 1) % images.length)
  }

  if (images.length === 0) {
    return (
      <div className={clsx('flex items-center justify-center bg-gray-100 rounded-2xl', className)}>
        <p className="text-gray-500">No images available</p>
      </div>
    )
  }

  return (
    <div className={clsx('relative group overflow-hidden rounded-2xl bg-gray-900', className)}>
      {/* Main Image */}
      <div className="relative aspect-[16/10] w-full">
        {images.map((image, index) => (
          <div
            key={image}
            className={clsx(
              'absolute inset-0 transition-opacity duration-1000 ease-in-out',
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            )}
          >
            <Image
              src={`/visual-highlights/${image}`}
              alt={`Visual highlight ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
              onLoad={() => index === 0 && setIsLoading(false)}
            />
          </div>
        ))}

        {/* Loading placeholder */}
        {isLoading && (
          <div className="absolute inset-0 animate-pulse bg-gray-200" />
        )}
      </div>

      {/* Navigation Buttons - Only show if more than one image */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/70"
            aria-label="Previous image"
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/70"
            aria-label="Next image"
          >
            <ChevronRightIcon className="h-6 w-6" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={clsx(
                  'w-2 h-2 rounded-full transition-all duration-300',
                  index === currentIndex
                    ? 'bg-white w-6'
                    : 'bg-white/50 hover:bg-white/75'
                )}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}