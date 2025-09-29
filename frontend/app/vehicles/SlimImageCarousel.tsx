"use client"

import Image from 'next/image'
import {useEffect, useRef, useState} from 'react'

export default function SlimImageCarousel() {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<HTMLDivElement[]>([])
  const [current, setCurrent] = useState(0)
  const [tileSize, setTileSize] = useState(336) // approximate default (320 + 16 gap)
  const images = [
    '/images/tile-1-black.png',
    '/images/tile-grid-black.png',
    '/images/tile-1-black.png',
    '/images/tile-grid-black.png',
    '/images/tile-1-black.png',
  ]

  // Measure tile size (including gap) once mounted
  useEffect(() => {
    const el = scrollerRef.current
    const first = itemRefs.current[0]
    if (el && first) {
      const gap = 16 // gap-4
      setTileSize(first.getBoundingClientRect().width + gap)
    }
    const onResize = () => {
      const firstEl = itemRefs.current[0]
      if (firstEl) setTileSize(firstEl.getBoundingClientRect().width + 16)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const scrollToIndex = (index: number) => {
    const el = scrollerRef.current
    if (!el) return
    el.scrollTo({left: index * tileSize, behavior: 'smooth'})
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
          <div
            ref={scrollerRef}
            className="overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory"
          >
            <div className="flex gap-4">
              {images.map((src, i) => {
                const isActive = i === current
                return (
                  <div
                    key={i}
                    ref={(el) => { if (el) itemRefs.current[i] = el }}
                    className={`snap-start shrink-0 w-[240px] sm:w-[300px] h-[120px] sm:h-[160px] rounded-2xl overflow-hidden border bg-black/20 transition-all duration-300 ${
                      isActive ? 'scale-105 opacity-100 border-white/30 shadow-2xl shadow-black/40' : 'opacity-70 border-white/10 shadow-md'
                    }`}
                  >
                    <Image src={src} alt={`slider-${i}`} width={640} height={340} className="h-full w-full object-cover" />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


