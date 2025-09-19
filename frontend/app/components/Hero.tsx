'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface HeroSlide {
  id: number
  title: string
  subtitle: string
  image: string
  alt: string
}

const heroSlides: HeroSlide[] = [
  {
    id: 1,
    title: 'Premium Outdoor Gear',
    subtitle: 'Discover our curated collection of high-quality outdoor equipment',
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=5120&h=2880&fit=crop&crop=center&auto=format&q=80',
    alt: 'Mountain landscape with outdoor gear'
  },
  {
    id: 2,
    title: 'Expert Guidance',
    subtitle: 'Get personalized recommendations from our outdoor specialists',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=5120&h=2880&fit=crop&crop=center&auto=format&q=80',
    alt: 'Expert guide helping with outdoor equipment'
  },
  {
    id: 3,
    title: 'Adventure Ready',
    subtitle: 'Everything you need for your next outdoor adventure',
    image: 'https://images.unsplash.com/photo-1464822759844-d150baec0b0b?w=5120&h=2880&fit=crop&crop=center&auto=format&q=80',
    alt: 'Adventure gear and equipment setup'
  },
  {
    id: 4,
    title: 'Quality Assured',
    subtitle: 'Trusted by outdoor enthusiasts for over two decades',
    image: 'https://images.unsplash.com/photo-1551524164-6cf2ac5313c2?w=5120&h=2880&fit=crop&crop=center&auto=format&q=80',
    alt: 'Quality outdoor equipment display'
  }
]

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)
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

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  return (
    <div 
      className="relative w-full overflow-hidden"
      style={{ height: heroHeight }}
    >
      {/* Slides Container */}
      <div className="relative w-full h-full">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Background Image */}
            <div className="relative w-full h-full">
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                priority={index === 0}
                className="object-cover"
                sizes="100vw"
                quality={90}
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-40" />
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center text-white">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed">
                    {slide.subtitle}
                  </p>
                  <button className="bg-brand hover:bg-brand/90 text-white font-semibold py-3 px-8 sm:py-4 sm:px-12 text-lg sm:text-xl rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                    Shop Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 sm:left-6 lg:left-8 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 sm:p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 sm:right-6 lg:right-8 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 sm:p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
        aria-label="Next slide"
      >
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 sm:space-x-3">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-white scale-125'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
        <div
          className="h-full bg-white transition-all duration-100 ease-linear"
          style={{
            width: `${((currentSlide + 1) / heroSlides.length) * 100}%`
          }}
        />
      </div>
    </div>
  )
}
