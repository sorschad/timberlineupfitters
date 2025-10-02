'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

interface Manufacturer {
  _id: string
  name: string
  logo?: any
  description?: string
  vehicles?: any[]
  heroImage?: any
  heroTitle?: string
  heroSubtitle?: string
  heroCtaText?: string
}

interface ManufacturerHeroProps {
  manufacturer: Manufacturer
}

export default function ManufacturerHero({ manufacturer }: ManufacturerHeroProps) {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const vehicleCount = manufacturer.vehicles?.length || 0
  const models = [...new Set(manufacturer.vehicles?.map(v => v.model) || [])]

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Parallax Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: manufacturer.heroImage?.asset?.url
            ? `url('${manufacturer.heroImage.asset.url}')`
            : `url('/images/manufacturer-hero-${manufacturer.name.toLowerCase()}.jpg')`,
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
        <div className="animate-float-bounce">
          {manufacturer.logo && (
            <div className="mb-8">
              <Image
                src={manufacturer.logo.asset.url}
                alt={`${manufacturer.name} Logo`}
                width={120}
                height={60}
                className="mx-auto"
              />
            </div>
          )}
          
          <h1 className="text-3xl md:text-5xl font-bold mb-6">
            {manufacturer.heroTitle || manufacturer.name}
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            {manufacturer.heroSubtitle || manufacturer.description || `Explore ${vehicleCount} ${manufacturer.name} vehicles designed for every adventure.`}
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8 text-sm">
            {models.map((model) => (
              <span 
                key={model}
                className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30"
              >
                {model}
              </span>
            ))}
          </div>

          <button 
            onClick={() => {
              const firstSection = document.querySelector('[data-vehicle-section]')
              firstSection?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="bg-brand hover:bg-brand/90 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 animate-bounce-slow"
          >
            {manufacturer.heroCtaText || 'Explore Vehicles'}
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  )
}
