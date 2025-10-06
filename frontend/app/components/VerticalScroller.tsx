'use client'

import {useEffect, useMemo, useRef, useState} from 'react'

type ScrollerImage = {
  url: string
  alt?: string
}

type VerticalScrollerProps = {
  images?: ScrollerImage[]
  height?: number
  speedPxPerSec?: number
  darkOverlay?: boolean
}

export default function VerticalScroller({
  images = [],
  height = 400,
  speedPxPerSec = 30,
  darkOverlay = false,
}: VerticalScrollerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [offsetY, setOffsetY] = useState(0)

  // Duplicate images to create a seamless loop
  const loopImages = useMemo(() => {
    if (!images || images.length === 0) return [] as ScrollerImage[]
    return [...images, ...images]
  }, [images])

  useEffect(() => {
    // Kick off animation once we have dimensions
    let rafId = 0
    let lastTs = 0

    const animate = (ts: number) => {
      if (!lastTs) lastTs = ts
      const dt = (ts - lastTs) / 1000
      lastTs = ts

      const speed = speedPxPerSec
      setOffsetY((prev) => prev + speed * dt)

      rafId = requestAnimationFrame(animate)
    }

    if (containerRef.current && trackRef.current) {
      setIsReady(true)
      rafId = requestAnimationFrame(animate)
    }

    return () => cancelAnimationFrame(rafId)
  }, [speedPxPerSec])

  // Reset offset to create infinite loop
  useEffect(() => {
    if (!isReady || !trackRef.current) return
    const trackHeight = trackRef.current.scrollHeight / 2 // half, because duplicated
    if (offsetY >= trackHeight) {
      setOffsetY((y) => y - trackHeight)
    }
  }, [offsetY, isReady])

  if (!loopImages.length) {
    return null
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{height}}
    >
      {darkOverlay && <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/30" />}

      <div
        ref={trackRef}
        className="absolute left-0 right-0 will-change-transform"
        style={{transform: `translateY(${-offsetY}px)`}}
      >
        {loopImages.map((img, idx) => (
          <div key={`${img.url}-${idx}`} className="w-full">
            <div
              className="w-full aspect-[16/9] bg-center bg-cover"
              style={{backgroundImage: `url(${img.url})`}}
              role="img"
              aria-label={img.alt || 'Scrolling image'}
            />
          </div>
        ))}
      </div>
    </div>
  )
}


