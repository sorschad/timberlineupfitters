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
  const safe = useMemo(() => {
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
    
    const filtered = images?.filter((i) => !!i?.url) ?? []
    return filtered.length > 0 ? filtered : unsplashImages
  }, [images])
  
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const viewH = window.innerHeight
      
      // Calculate scroll progress through the sticky section (0 to 1)
      const sectionHeight = rect.height
      const scrolled = Math.max(0, viewH - rect.top)
      const progress = Math.min(1, scrolled / sectionHeight)
      
      setScrollProgress(progress)
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

  // Calculate how much content should be scrolled through
  const totalScrollDistance = safe.length * 200 // 200px per image

  return (
    <section ref={containerRef} className="relative" style={{height: `${safe.length * 100}vh`}}>
      
      {/* Sticky viewport that holds the user */}
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-50 to-neutral-100" />
        
        <div className="relative h-full flex items-center justify-center">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
              {lanes.map((lane, laneIdx) => {
                const speed = speeds[laneIdx % speeds.length]
                const translateY = -(scrollProgress * totalScrollDistance * (1 - speed))
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
        </div>
      </div>
    </section>
  )
}


