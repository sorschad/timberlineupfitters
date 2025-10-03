'use client'

import {useEffect, useMemo, useRef, useState} from 'react'

type GalleryImage = {
  url: string
  alt?: string
}

type ParallaxVerticalMasonryProps = {
  images: GalleryImage[]
}

export default function ParallaxVerticalMasonry({images}: ParallaxVerticalMasonryProps) {
  const safe = useMemo(() => images?.filter((i) => !!i?.url) ?? [], [images])
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [localScroll, setLocalScroll] = useState(0)
  const [containerHeight, setContainerHeight] = useState(1)

  useEffect(() => {
    const onScroll = () => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const viewH = window.innerHeight
      
      // Calculate how much of this section is visible
      const sectionTop = rect.top
      const sectionBottom = rect.bottom
      const viewportTop = 0
      const viewportBottom = viewH
      
      // If section is above viewport, we've scrolled past it
      if (sectionBottom < viewportTop) {
        setLocalScroll(rect.height)
        return
      }
      
      // If section is below viewport, we haven't reached it yet
      if (sectionTop > viewportBottom) {
        setLocalScroll(0)
        return
      }
      
      // Section is in viewport - calculate scroll progress
      const visibleTop = Math.max(viewportTop, sectionTop)
      const visibleBottom = Math.min(viewportBottom, sectionBottom)
      const visibleHeight = visibleBottom - visibleTop
      const scrolled = Math.max(0, viewportTop - sectionTop)
      
      setLocalScroll(scrolled)
      setContainerHeight(Math.max(1, rect.height))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, {passive: true})
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  if (!safe.length) return null

  const columns = 3
  const lanes: GalleryImage[][] = Array.from({length: columns}, () => [])
  safe.forEach((img, i) => lanes[i % columns].push(img))

  const speeds = [0.6, 0.9, 1.2] // different vertical speeds for parallax

  return (
    <section ref={containerRef} className="relative py-20 lg:py-32">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {lanes.map((lane, laneIdx) => {
            const speed = speeds[laneIdx % speeds.length]
            const translateY = -(localScroll * 0.3 * (1 - speed)) // reduced parallax effect
            return (
              <ul
                key={laneIdx}
                className="relative space-y-12 will-change-transform"
                style={{transform: `translateY(${translateY}px)`}}
              >
                {lane.map((img, i) => (
                  <li key={`${img.url}-${i}`} className="relative">
                    <div className="pointer-events-none absolute -inset-6 rounded-2xl bg-black/10 blur-2xl opacity-40" />
                    <figure
                      className="relative rounded-md bg-white shadow-[0_30px_70px_-30px_rgba(0,0,0,0.45)]"
                      style={{zIndex: 10 + i}}
                    >
                      <div
                        className="w-full bg-cover bg-center"
                        style={{
                          backgroundImage: `url(${img.url})`,
                          // keep images straight; varying aspect ratios optional
                          aspectRatio: i % 3 === 0 ? '16/11' : i % 3 === 1 ? '4/3' : '16/9',
                        }}
                        role="img"
                        aria-label={img.alt || 'gallery image'}
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-md ring-8 ring-white" />
                    </figure>
                  </li>
                ))}
              </ul>
            )
          })}
        </div>
      </div>
    </section>
  )
}


