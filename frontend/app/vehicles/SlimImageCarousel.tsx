"use client"

import Image from 'next/image'
import {useRef} from 'react'

export default function SlimImageCarousel() {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const images = [
    '/images/tile-1-black.png',
    '/images/tile-grid-black.png',
    '/images/tile-1-black.png',
    '/images/tile-grid-black.png',
    '/images/tile-1-black.png',
  ]

  const scrollBy = (delta: number) => {
    const el = scrollerRef.current
    if (!el) return
    el.scrollBy({left: delta, behavior: 'smooth'})
  }

  return (
    <section className="py-6">
      <div className="container">
        <div className="relative">
          {/* Controls */}
          <button
            type="button"
            onClick={() => scrollBy(-400)}
            className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 h-9 w-9 items-center justify-center rounded-full bg-black/30 hover:bg-black/50 text-white"
            aria-label="Previous"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <button
            type="button"
            onClick={() => scrollBy(400)}
            className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 h-9 w-9 items-center justify-center rounded-full bg-black/30 hover:bg-black/50 text-white"
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
              {images.map((src, i) => (
                <div key={i} className="snap-start shrink-0 w-[260px] sm:w-[320px] h-[140px] sm:h-[170px] rounded-2xl overflow-hidden border border-white/20 bg-black/20">
                  <Image src={src} alt={`slider-${i}`} width={640} height={340} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


