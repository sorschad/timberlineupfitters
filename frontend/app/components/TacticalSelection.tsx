"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/24/outline'

interface BrandCard {
  id: string
  name: string
  tagline: string
  category: string
  image: string
  description: string
  href: string
}

const brandCards: BrandCard[] = [
  {
    id: 'timberline-elite',
    name: 'TIMBERLINE ELITE',
    tagline: 'EXECUTIVE PROTECTION MEETS UNCOMPROMISING LUXURY',
    category: 'LUXURY TACTICAL',
    image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    description: 'Premium executive protection vehicles with luxury finishes',
    href: '/brands/timberline-elite'
  },
  {
    id: 'alpine',
    name: 'ALPINE',
    tagline: 'ALL-TERRAIN DOMINANCE',
    category: 'ALL-TERRAIN DOMINANCE',
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    description: 'Rugged all-terrain vehicles for extreme conditions',
    href: '/brands/alpine'
  },
  {
    id: 'tsport',
    name: 'TSPORT',
    tagline: 'PURE PERFORMANCE',
    category: 'PURE PERFORMANCE',
    image: 'https://images.unsplash.com/photo-1549317336-206569e8475c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    description: 'High-performance vehicles engineered for speed and precision',
    href: '/brands/tsport'
  }
]

export default function TacticalSelection() {
  const [activeCard, setActiveCard] = useState(0)
  const [isAutoScrolling, setIsAutoScrolling] = useState(true)

  const nextCard = () => {
    setActiveCard((prev) => (prev + 1) % brandCards.length)
  }

  const prevCard = () => {
    setActiveCard((prev) => (prev - 1 + brandCards.length) % brandCards.length)
  }

  // Auto-scroll effect
  useEffect(() => {
    if (!isAutoScrolling) return

    const interval = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % brandCards.length)
    }, 4000) // Change card every 4 seconds

    return () => clearInterval(interval)
  }, [isAutoScrolling])

  // Pause auto-scroll on hover
  const handleMouseEnter = () => {
    setIsAutoScrolling(false)
  }

  const handleMouseLeave = () => {
    setIsAutoScrolling(true)
  }

  return (
    <section className="min-h-screen bg-black flex items-center relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center relative">
          {/* Left Section - Text Content */}
          <div className="space-y-8">
            {/* Orange line */}
            <div className="w-16 h-0.5 bg-[#ff8c42]"></div>
            
            {/* TACTICAL SELECTION */}
            <div className="text-[#ff8c42] text-sm uppercase tracking-widest font-semibold">
              TACTICAL SELECTION
            </div>
            
            {/* Main heading */}
            <div className="space-y-2">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white uppercase leading-tight">
                UNLOCK YOUR
              </h1>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#ff8c42] uppercase leading-tight">
                TACTICAL POTENTIAL
              </h1>
            </div>
            
            {/* Description */}
            <p className="text-lg text-gray-300 leading-relaxed max-w-lg">
              Choose your mission profile. Each brand represents a different approach to tactical excellence, engineered for specific operational requirements.
            </p>
            
            {/* CTA Button */}
            <Link 
              href="/brands"
              className="inline-flex items-center bg-[#ff8c42] hover:bg-[#ff8c42]/90 text-white px-8 py-4 rounded-full font-semibold uppercase tracking-wide transition-all duration-500 ease-out transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              EXPLORE LINEUP
              <ChevronRightIcon className="ml-2 w-5 h-5 transition-transform duration-300 ease-out group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Right Section - Layered 3D Cards */}
          <div className="relative h-[700px] flex items-center justify-center lg:absolute lg:right-0 lg:top-1/2 lg:transform lg:-translate-y-1/2 lg:w-[60%] lg:h-[600px]">
            {/* Card Stack */}
            <div className="relative w-[500px] h-[600px]"
                 onMouseEnter={handleMouseEnter}
                 onMouseLeave={handleMouseLeave}>
              {/* Background Cards (3D Layered Effect) */}
              {brandCards.map((card, index) => {
                const isActive = index === activeCard
                const isNext = index === (activeCard + 1) % brandCards.length
                const isPrev = index === (activeCard - 1 + brandCards.length) % brandCards.length
                
                let transform = ''
                let zIndex = 0
                let opacity = 0.3
                
                if (isActive) {
                  transform = 'translateX(0) translateY(0) rotateY(0deg) scale(1)'
                  zIndex = 30
                  opacity = 1
                } else if (isNext) {
                  transform = 'translateX(100px) translateY(-40px) rotateY(-25deg) scale(0.8)'
                  zIndex = 20
                  opacity = 0.6
                } else if (isPrev) {
                  transform = 'translateX(-100px) translateY(-40px) rotateY(25deg) scale(0.8)'
                  zIndex = 10
                  opacity = 0.4
                } else {
                  transform = 'translateX(0) translateY(80px) rotateY(0deg) scale(0.7)'
                  zIndex = 5
                  opacity = 0.15
                }
                
                return (
                  <div
                    key={card.id}
                    className={`absolute inset-0 rounded-2xl overflow-hidden shadow-2xl cursor-pointer transform-gpu`}
                    style={{
                      transform,
                      zIndex,
                      opacity,
                      transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                    onClick={() => setActiveCard(index)}
                  >
                    <Image
                      src={card.image}
                      alt={card.name}
                      fill
                      className="object-cover"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    
                    {/* Category tag */}
                    <div className="absolute top-4 right-4">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#ff8c42] rounded-full"></div>
                        <span className="text-black text-xs font-semibold uppercase tracking-wide">
                          {card.category}
                        </span>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="absolute bottom-10 left-10 right-10">
                      <h3 className="text-white text-4xl font-bold uppercase mb-4">
                        {card.name}
                      </h3>
                      <p className="text-gray-300 text-lg uppercase font-semibold">
                        {card.tagline}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
            
            {/* Navigation Arrows */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-8">
              {/* Left Arrow */}
              <button
                onClick={prevCard}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-4 transition-all duration-500 ease-out hover:scale-110 hover:shadow-lg"
              >
                <ChevronLeftIcon className="w-7 h-7 text-white transition-transform duration-300 ease-out" />
              </button>
              
              {/* Auto-scroll indicator */}
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full transition-all duration-500 ease-in-out ${isAutoScrolling ? 'bg-[#ff8c42] scale-110' : 'bg-white/50 scale-100'}`}></div>
                <span className="text-white/70 text-sm uppercase tracking-wide transition-all duration-300 ease-out">
                  {isAutoScrolling ? 'AUTO' : 'PAUSED'}
                </span>
              </div>
              
              {/* Right Arrow */}
              <button
                onClick={nextCard}
                className="bg-[#ff8c42] hover:bg-[#ff8c42]/90 rounded-full p-4 transition-all duration-500 ease-out hover:scale-110 hover:shadow-xl shadow-lg"
              >
                <ChevronRightIcon className="w-7 h-7 text-white transition-transform duration-300 ease-out" />
              </button>
            </div>
            
            
          </div>
        </div>
      </div>
    </section>
  )
}
