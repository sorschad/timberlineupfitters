'use client'

import { useEffect, useState } from 'react'
import { Montserrat } from 'next/font/google'

type HeritageHeroCategory = {
  label: string
  imageUrl?: string
}

type HeritageHeroProps = {
  imageUrl: string
  title?: string
  subtitle?: string
  categories?: HeritageHeroCategory[]
}

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '700', '800'],
  display: 'swap',
})

export default function HeritageHero({ imageUrl, title = 'Timberline Upfitters', subtitle = "Go anywhere in a moment’s notice", categories }: HeritageHeroProps) {
  const [heroHeight, setHeroHeight] = useState('80vh')
  const tabs: HeritageHeroCategory[] = (categories && categories.length > 0)
    ? categories
    : [
        { label: 'Off-road adventures', imageUrl: '/images/heritage-offroad.jpg' },
        { label: 'Family trips to nature', imageUrl: '/images/heritage-family.jpg' },
        { label: 'Digital nomad', imageUrl: '/images/heritage-digital.jpg' },
        { label: 'Hike & bike', imageUrl: '/images/heritage-hike.jpg' },
      ]
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const updateHeight = () => {
      const viewportHeight = window.innerHeight
      const calculatedHeight = viewportHeight * 0.8
      setHeroHeight(`${calculatedHeight}px`)
    }
    updateHeight()
    window.addEventListener('resize', updateHeight)
    return () => window.removeEventListener('resize', updateHeight)
  }, [])

  return (
    <section className="relative w-full overflow-hidden" style={{ height: heroHeight }}>
      <div className="absolute inset-0 bg-center bg-cover" style={{ backgroundImage: `url(${imageUrl})` }} />
      <div className="absolute inset-0 bg-black/30" />

      <div className="relative z-10 h-full">
        <div className="container h-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-full items-center">
            <div className="text-white drop-shadow-md max-w-6xl">
              <h1 className={`${montserrat.className} uppercase antialiased font-extrabold leading-[0.9] tracking-[0.02em] text-[10vw] sm:text-[9vw] md:text-[8vw] lg:text-[7vw] xl:text-[6vw]`}>{title}</h1>
              {subtitle && (
                <p className={`${montserrat.className} antialiased mt-4 sm:mt-6 text-white/95 text-base sm:text-lg md:text-xl lg:text-2xl font-semibold max-w-xl`}>{subtitle}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom tabs (clickable) - active tab becomes transparent to reveal image */}
      <div className="absolute bottom-0 left-0 right-0 h-16 z-20">
        <div className="w-full h-full grid grid-cols-4">
          {tabs.map((t, idx) => (
            <button
              key={t.label}
              onClick={() => {
                console.log('Tab clicked:', t.label, 'index:', idx)
                setActiveIndex(idx)
              }}
              className={`text-left px-3 sm:px-6 flex items-center h-16 border-t ${idx !== 0 ? 'border-l' : ''} border-white/60 text-[10px] sm:text-xs tracking-widest uppercase transition-colors cursor-pointer ${
                idx === activeIndex
                  ? 'bg-transparent text-black'
                  : 'bg-white/80 backdrop-blur-[2px] text-black/70 hover:text-black'
              }`}
            >
              <span className="mr-2 sm:mr-3 opacity-70">{String(idx + 1).padStart(2, '0')}</span>
              <span className="truncate">{t.label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}


