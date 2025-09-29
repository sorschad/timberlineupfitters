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

  const scrollToIndex = (index: number) => {
    const el = scrollerRef.current
    const card = itemRefs.current[index]
    if (!el || !card) return
    const left = card.offsetLeft - (el.clientWidth - card.clientWidth) / 2
    el.scrollTo({left, behavior: 'smooth'})
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
            className="overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory px-6"
          >
            <div className="flex items-center gap-4">
              {images.map((src, i) => {
                const isActive = i === current
                return (
                  <div
                    key={i}
                    ref={(el) => { if (el) itemRefs.current[i] = el }}
                    className={`snap-center shrink-0 rounded-2xl overflow-hidden border bg-black/20 transition-all duration-300 ${
                      isActive
                        ? 'w-[320px] sm:w-[380px] h-[160px] sm:h-[200px] opacity-100 border-white/30 shadow-2xl shadow-black/40 z-10'
                        : 'w-[220px] sm:w-[260px] h-[110px] sm:h-[140px] opacity-60 border-white/10 shadow-md'
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


