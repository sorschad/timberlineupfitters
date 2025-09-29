"use client"

import Image from 'next/image'
import {useEffect, useRef, useState} from 'react'

export default function SlimImageCarousel() {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<HTMLDivElement[]>([])
  const [current, setCurrent] = useState(0)
  const images = [
    '/images/tile-1-black.png',
    '/images/tile-grid-black.png',
    '/images/tile-1-black.png',
    '/images/tile-grid-black.png',
    '/images/tile-1-black.png',
  ]

  // Center the active card on mount and resize
  useEffect(() => {
    const onResize = () => scrollToIndex(current)
    window.addEventListener('resize', onResize)
    scrollToIndex(0)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const scrollToIndex = (_index: number) => {
    // no-op for coverflow mode; we position via transforms
  }

  const goPrev = () => {
    const next = (current - 1 + images.length) % images.length
    setCurrent(next)
    scrollToIndex(next)
  }

  const goNext = () => {
    const next = (current + 1) % images.length
    setCurrent(next)
    scrollToIndex(next)
  }

  return (
    <section className="py-6">
      <div className="container">
        <div className="relative">
          {/* Controls */}
          <button
            type="button"
            onClick={goPrev}
            className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 h-9 w-9 items-center justify-center rounded-full bg-black/30 hover:bg-black/50 text-white shadow-lg"
            aria-label="Previous"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <button
            type="button"
            onClick={goNext}
            className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 h-9 w-9 items-center justify-center rounded-full bg-black/30 hover:bg-black/50 text-white shadow-lg"
            aria-label="Next"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
          </button>

          {/* Slider */}
          <div className="relative h-[260px] sm:h-[320px] overflow-visible" ref={scrollerRef}>
            {/* Ground/floor glow for 3D feel */}
            <div className="pointer-events-none absolute left-0 right-0 bottom-0 h-24 bg-gradient-to-t from-black/20 via-black/10 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center [perspective:1200px]">
              <div className="relative w-full h-full">
                {images.map((src, i) => {
                  // compute relative position in circular list so neighbors wrap around
                  const len = images.length
                  let raw = i - current
                  if (raw > len / 2) raw -= len
                  if (raw < -len / 2) raw += len
                  const isActive = raw === 0
                  const translateX = raw * 240 // px per step
                  const rotateY = -raw * 20 // deg
                  const translateZ = isActive ? 120 : -60 // depth
                  const scale = isActive ? 1.02 : 0.86
                  const opacity = isActive ? 1 : 0.28
                  const zIndex = 50 - Math.abs(raw)
                  return (
                    <div
                      key={i}
                      ref={(el) => { if (el) itemRefs.current[i] = el }}
                      className="absolute left-1/2 top-1/2 will-change-transform"
                      style={{
                        width: isActive ? 560 : 320,
                        height: isActive ? 280 : 180,
                        transform: `translate3d(${translateX}px, -50%, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                        opacity,
                        zIndex,
                        transformStyle: 'preserve-3d'
                      }}
                    >
                      {/* Card shell */}
                      <div className="relative w-full h-full rounded-2xl bg-white shadow-[0_30px_60px_rgba(0,0,0,0.35)] border border-white/20 overflow-hidden">
                        <Image src={src} alt={`slider-${i}`} fill className="object-cover" sizes="(max-width: 1024px) 90vw, 560px" />
                        {/* Soft inner vignette */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
                      </div>
                      {/* Floor shadow */}
                      <div className="pointer-events-none absolute left-1/2 top-full -translate-x-1/2 -mt-2 w-[70%] h-6 rounded-full blur-xl bg-black/40 opacity-40" />
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


