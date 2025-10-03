'use client'

import {useEffect, useMemo, useState} from 'react'

type GalleryImage = {
  url: string
  alt?: string
}

type ParallaxVerticalMasonryProps = {
  images: GalleryImage[]
}

export default function ParallaxVerticalMasonry({images}: ParallaxVerticalMasonryProps) {
  const safe = useMemo(() => images?.filter((i) => !!i?.url) ?? [], [images])
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY || window.pageYOffset)
    onScroll()
    window.addEventListener('scroll', onScroll, {passive: true})
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!safe.length) return null

  const columns = 3
  const lanes: GalleryImage[][] = Array.from({length: columns}, () => [])
  safe.forEach((img, i) => lanes[i % columns].push(img))

  const speeds = [0.6, 0.9, 1.2] // different vertical speeds for parallax

  return (
    <section className="relative">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {lanes.map((lane, laneIdx) => {
            const speed = speeds[laneIdx % speeds.length]
            const translateY = -(scrollY * (1 - speed)) // slower columns appear to lag
            return (
              <ul
                key={laneIdx}
                className="relative space-y-12"
                style={{transform: `translateY(${translateY}px)`}}
              >
                {lane.map((img, i) => (
                  <li key={`${img.url}-${i}`} className="relative">
                    <div className="pointer-events-none absolute -inset-6 rounded-2xl bg-black/10 blur-2xl opacity-40" />
                    <figure
                      className={[
                        'relative rounded-md bg-white shadow-[0_30px_70px_-30px_rgba(0,0,0,0.45)]',
                        i % 2 === 0 ? 'rotate-[-1.5deg]' : 'rotate-[1deg]',
                      ].join(' ')}
                      style={{zIndex: 10 + i}}
                    >
                      <div
                        className="w-full bg-cover bg-center"
                        style={{
                          backgroundImage: `url(${img.url})`,
                          // varying aspect ratios for more organic layout
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


