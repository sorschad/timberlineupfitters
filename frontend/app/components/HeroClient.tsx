'use client'

import { useState, useEffect } from 'react'
import { Orbitron, Lato } from 'next/font/google'

interface HeroSlide {
  id: number
  title: string
  subtitle: string
  image: string
  alt: string
}

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  display: 'swap',
})

const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  display: 'swap',
})

interface HeroClientProps {
  slides: HeroSlide[]
}

export default function HeroClient({ slides }: HeroClientProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [heroHeight, setHeroHeight] = useState('80vh')
  const [isPaused, setIsPaused] = useState(false)

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

  // Auto-advance slides
  useEffect(() => {
    if (slides.length <= 1 || isPaused) return
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [slides, isPaused])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
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

  const handleMouseEnter = () => {
    setIsPaused(true)
  }

  const handleMouseLeave = () => {
    setIsPaused(false)
  }

  // Show empty state if no slides
  if (slides.length === 0) {
    return (
      <div 
        className="relative w-full overflow-hidden flex items-center justify-center bg-gray-100"
        style={{ height: heroHeight }}
      >
        <div className="text-center">
          <p className="text-gray-600">No hero slides configured</p>
          <p className="text-sm text-gray-500">Please add slides in Sanity Studio &gt; Homepage Settings</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="relative w-full overflow-hidden"
      style={{ height: heroHeight }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Slides Container */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
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
                  <h1 className={`${orbitron.className} uppercase antialiased text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-4 sm:mb-6 leading-[0.9] tracking-[0.08em]`}>
                    {slide.title}
                  </h1>
                  <p className={`${lato.className} antialiased text-lg sm:text-xl md:text-2xl lg:text-3xl font-normal mb-8 sm:mb-12 max-w-4xl mx-auto leading-[1.4] tracking-[0.01em]`}>
                    {slide.subtitle}
                  </p>
                  <div className="flex flex-col justify-center items-center">
                    <button 
                      onClick={scrollToBrands}
                      className="group relative bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 px-12 text-lg transition-all duration-300 transform hover:scale-105 shadow-xl animate-float-bounce"
                    >
                      <span className="flex items-center justify-center gap-3">
                        <span>EXPLORE OUR BRANDS</span>
                        <svg 
                          className="w-5 h-5 transition-transform duration-300 group-hover:translate-y-1" 
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
            width: `${((currentSlide + 1) / slides.length) * 100}%`
          }}
        />
      </div>
    </div>
  )
}
