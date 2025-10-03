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
  // Fallback Unsplash images for testing
  const unsplashImages = [
    { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', alt: 'Mountain landscape' },
    { url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop', alt: 'Forest trail' },
    { url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop', alt: 'Lake reflection' },
    { url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=500&fit=crop', alt: 'Desert dunes' },
    { url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=700&fit=crop', alt: 'Ocean waves' },
    { url: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&h=600&fit=crop', alt: 'Forest canopy' },
    { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop', alt: 'Mountain vista' },
    { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=500&fit=crop', alt: 'Mountain range' },
    { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=700&fit=crop', alt: 'Alpine landscape' },
    { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', alt: 'Mountain lake' },
    { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop', alt: 'Peak view' },
    { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=500&fit=crop', alt: 'Mountain peak' },
    { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=700&fit=crop', alt: 'Valley view' },
    { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', alt: 'Summit' },
    { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop', alt: 'Highlands' },
  ]

  const safe = useMemo(() => {
    const filtered = images?.filter((i) => !!i?.url) ?? []
    return filtered.length > 0 ? filtered : unsplashImages
  }, [images])
  
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [localScroll, setLocalScroll] = useState(0)
  const [containerHeight, setContainerHeight] = useState(1)

  useEffect(() => {
    const onScroll = () => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const viewH = window.innerHeight
      
      // Simple scroll calculation - how much we've scrolled through this section
      const scrolled = Math.max(0, viewH - rect.top)
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
    <section ref={containerRef} className="relative py-32 lg:py-48">
      {/* Debug info */}
      <div className="fixed top-4 right-4 bg-black/80 text-white p-2 text-xs z-50">
        Scroll: {Math.round(localScroll)} | Images: {safe.length}
      </div>
      
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {lanes.map((lane, laneIdx) => {
            const speed = speeds[laneIdx % speeds.length]
            const translateY = -(localScroll * 0.8 * (1 - speed)) // increased parallax effect
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


