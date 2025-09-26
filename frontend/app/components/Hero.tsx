'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Montserrat } from 'next/font/google'
import { urlForImage } from '@/sanity/lib/utils'

interface HeroSlide {
  id: number
  title: string
  subtitle: string
  image: string
  alt: string
}

const heroSlides: HeroSlide[] = []

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '700', '800'],
  display: 'swap',
})

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [heroHeight, setHeroHeight] = useState('80vh')

  // Calculate hero height (20% less than device fold)
  useEffect(() => {
    const updateHeight = () => {
      const viewportHeight = window.innerHeight
      const calculatedHeight = viewportHeight * 0.8 // 20% less than full height
      setHeroHeight(`${calculatedHeight}px`)
    }

    updateHeight()
    window.addEventListener('resize', updateHeight)
    return () => window.removeEventListener('resize', updateHeight)
  }, [])

  // Load slides from API to avoid server-only in client components
  useEffect(() => {
    let isMounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/homepage-settings', {cache: 'no-store'})
        const json = await res.json()
        console.log('Fetched slides:', json?.slides)
        const fetched = (json?.slides || []).map((s: any, idx: number) => ({
          id: idx + 1,
          title: s?.title || '',
          subtitle: s?.subtitle || '',
          image: s?.image || '',
          alt: s?.alt || 'Hero background',
        })) as HeroSlide[]
        if (isMounted && fetched.length > 0) {
          console.log('Setting slides:', fetched)
          setSlides(fetched)
        }
      } catch (e) {
        console.error('Error loading slides:', e)
      }
    })()
    return () => {
      isMounted = false
    }
  }, [])

  // Auto-advance slides
  useEffect(() => {
    const total = (slides.length || heroSlides.length)
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % total)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [slides])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const goToPrevious = () => {
    const total = slides.length || heroSlides.length
    setCurrentSlide((prev) => (prev - 1 + total) % total)
  }

  const goToNext = () => {
    const total = slides.length || heroSlides.length
    setCurrentSlide((prev) => (prev + 1) % total)
  }

  const scrollToBrands = () => {
    const brandsSection = document.getElementById('brands-section')
    if (brandsSection) {
      brandsSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  return (
    <div 
      className="relative w-full overflow-hidden"
      style={{ height: heroHeight }}
    >
      {/* Slides Container */}
      <div className="relative w-full h-full">
        {(slides.length > 0 ? slides : heroSlides).map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Background Image */}
            <div className="relative w-full h-full">
              <div
                className="absolute inset-0 bg-center bg-cover"
                style={{backgroundImage: `url(${slide.image})`}}
                aria-hidden="true"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/50" />
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto text-center text-white pt-32 sm:pt-24">
                  <h1 className={`${montserrat.className} uppercase antialiased text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold mb-6 sm:mb-8 leading-[0.95] tracking-[0.05em]`}>
                    {slide.title}
                  </h1>
                  <p className={`${montserrat.className} antialiased text-base sm:text-lg md:text-xl lg:text-2xl font-light mb-10 sm:mb-16 max-w-3xl sm:max-w-4xl mx-auto leading-relaxed tracking-[0.01em]`}>
                    {slide.subtitle}
                  </p>
                  <div className="flex flex-col justify-center items-center">
                    <button 
                      onClick={scrollToBrands}
                      className="group relative bg-brand hover:bg-brand/90 text-white font-semibold py-3 px-8 sm:py-5 sm:px-20 text-base sm:text-xl transition-all duration-300 transform hover:scale-105 shadow-lg w-full max-w-sm sm:max-w-md animate-float-bounce"
                    >
                      <span className="flex items-center justify-center gap-2 sm:gap-3">
                        <span className="sm:hidden">EXPLORE</span>
                        <span className="hidden sm:inline">EXPLORE OUR BRANDS</span>
                        <svg 
                          className="w-4 h-4 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:translate-y-1" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M19 14l-7 7m0 0l-7-7m7 7V3" 
                          />
                        </svg>
                      </span>
                      {/* Pulsing ring effect */}
                      <div className="absolute inset-0 rounded-lg bg-brand/20 animate-ping opacity-75"></div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 sm:left-6 lg:left-8 top-1/2 transform -translate-y-1/2 text-[#4ee3c0] p-2 cursor-pointer transition-colors transition-opacity duration-300 ease-out opacity-80 hover:text-[#2db79a] hover:opacity-100"
        aria-label="Previous slide"
      >
        <svg
          className="w-4 h-20 sm:w-5 sm:h-16 transition-colors duration-300 ease-out"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 10 40"
          preserveAspectRatio="none"
        >
          <path
            d="M7 36 L3 20 L7 4"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            strokeWidth={1.5}
          />
        </svg>
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 sm:right-6 lg:right-8 top-1/2 transform -translate-y-1/2 text-[#4ee3c0] p-2 cursor-pointer transition-colors transition-opacity duration-300 ease-out opacity-80 hover:text-[#2db79a] hover:opacity-100"
        aria-label="Next slide"
      >
        <svg
          className="w-4 h-20 sm:w-5 sm:h-16 transition-colors duration-300 ease-out"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 10 40"
          preserveAspectRatio="none"
        >
          <path
            d="M3 4 L7 20 L3 36"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            strokeWidth={1.5}
          />
        </svg>
      </button>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
        <div
          className="h-full bg-white transition-all duration-100 ease-linear"
          style={{
            width: `${((currentSlide + 1) / ((slides.length || heroSlides.length))) * 100}%`
          }}
        />
      </div>
    </div>
  )
}
