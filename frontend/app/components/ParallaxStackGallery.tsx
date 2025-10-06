'use client'

import {useEffect, useMemo, useRef, useState} from 'react'

type GalleryImage = {
  url: string
  alt?: string
}

type ParallaxStackGalleryProps = {
  images: GalleryImage[]
  sectionHeightVh?: number
}

export default function ParallaxStackGallery({images, sectionHeightVh = 180}: ParallaxStackGalleryProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [progress, setProgress] = useState(0)

  const safeImages = useMemo(() => images?.filter((i) => !!i?.url) ?? [], [images])

  useEffect(() => {
    const onScroll = () => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const total = rect.height - window.innerHeight
      const p = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / (total || 1)))
      setProgress(p)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, {passive: true})
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  if (!safeImages.length) return null

  return (
    <section ref={containerRef} className="relative w-full" style={{height: `${sectionHeightVh}vh`}}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-100 to-neutral-50" />

        {/* Stack */}
        <div className="absolute inset-0">
          {safeImages.map((img, idx) => {
            const t = safeImages.length <= 1 ? 1 : idx / (safeImages.length - 1)
            // Each card appears, parallax-shifts, and scales slightly as we scroll
            const start = t * 0.85 // staggered entrance
            const end = Math.min(1, start + 0.35)
            const local = clamp01((progress - start) / (end - start || 1))

            const translateY = lerp(80, -10 * idx, local) // deeper cards move less (parallax)
            const translateZ = lerp(-200 - idx * 40, 0, local) // move forward
            const rotate = lerp(3 - idx * 0.4, 0, local)
            const scale = lerp(0.9 - idx * 0.02, 1, local)
            const opacity = lerp(0, 1, local)

            return (
              <figure
                key={`${img.url}-${idx}`}
                className="absolute left-1/2 top-1/2 w-[78vw] max-w-5xl -translate-x-1/2 -translate-y-1/2 rounded-md shadow-[0_40px_120px_-40px_rgba(0,0,0,0.5)]"
                style={{
                  transform:
                    `translate3d(0, ${translateY}px, ${translateZ}px) rotate(${rotate}deg) scale(${scale})`,
                  opacity,
                }}
              >
                <div
                  className="aspect-[16/9] w-full bg-cover bg-center"
                  style={{backgroundImage: `url(${img.url})`}}
                  role="img"
                  aria-label={img.alt || 'gallery image'}
                />
                <div className="pointer-events-none absolute inset-0 rounded-md ring-[14px] ring-white" />
              </figure>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n))
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}


