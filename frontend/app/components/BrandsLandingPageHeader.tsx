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
    id: 'timberline-upfitters',
    name: 'Timberline',
    tagline: 'Premium off-road upfits',
    category: 'Performance & Luxury',
    image: 'https://cdn.sanity.io/images/9jrxfm1d/staging/0f4ce3524a12134683b4c9e43a789a3f0f526a3f-2000x1545.png?w=2000&fit=max&auto=format',
    description: 'Premium off-road upfits',
    href: '/brands/timberline-upfitters'
  },
  {
    id: 'alpine',
    name: 'Alpine',
    tagline: 'All-Terrain & AUDIO',
    category: 'OFF-ROAD & AUDIO',
    image: 'https://cdn.sanity.io/images/9jrxfm1d/staging/2d66d8050437728de4ac6cd714e6f96a683812e3-1920x993.jpg?w=2000&fit=max&auto=format',
    description: 'Custom Jeep builds for the Audio & Adventure Enthusiast',
    href: '/brands/alpine'
  },
  {
    id: 'tsport',
    name: 'TSport',
    tagline: 'Enthusiast driven, straight from the dealership',
    category: 'OFF-ROAD PERFORMANCE',
    image: 'https://cdn.sanity.io/images/9jrxfm1d/staging/86931dc013495e4656f156ad2493d901eb876297-2560x1536.webp?w=2000&fit=max&auto=format',
    description: 'The Ultimate Off-Road Performance Package',
    href: '/brands/tsport'
  }
]

export default function BrandsLandingPageHeader() {
  const [activeCard, setActiveCard] = useState(0)
  const [isAutoScrolling, setIsAutoScrolling] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartX, setDragStartX] = useState<number | null>(null)
  const [dragDeltaX, setDragDeltaX] = useState(0)
  const [suppressClick, setSuppressClick] = useState(false)

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

  // Drag/Swipe handlers
  const getClientX = (e: MouseEvent | TouchEvent) => {
    // @ts-ignore
    if (e.touches && e.touches.length > 0) return e.touches[0].clientX
    // @ts-ignore
    if (e.changedTouches && e.changedTouches.length > 0) return e.changedTouches[0].clientX
    // @ts-ignore
    return (e as MouseEvent).clientX
  }

  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsAutoScrolling(false)
    setIsDragging(true)
    setSuppressClick(false)
    const clientX = 'nativeEvent' in e ? getClientX(e.nativeEvent as unknown as MouseEvent | TouchEvent) : 0
    setDragStartX(clientX)
    setDragDeltaX(0)
  }

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || dragStartX === null) return
    const clientX = 'nativeEvent' in e ? getClientX(e.nativeEvent as unknown as MouseEvent | TouchEvent) : 0
    const delta = clientX - dragStartX
    setDragDeltaX(delta)
    if (Math.abs(delta) > 10) {
      setSuppressClick(true)
    }
  }

  const finishDrag = () => {
    if (!isDragging) return
    const threshold = 60
    if (dragDeltaX <= -threshold) {
      nextCard()
    } else if (dragDeltaX >= threshold) {
      prevCard()
    }
    setIsDragging(false)
    setDragStartX(null)
    setDragDeltaX(0)
    // resume auto scroll after a moment
    setTimeout(() => setIsAutoScrolling(true), 2000)
  }

  // Smooth scroll on hash navigation when landing directly on /brands#...
  useEffect(() => {
    if (typeof window === 'undefined') return
    const { hash } = window.location
    if (hash) {
      const target = document.getElementById(hash.replace('#', ''))
      if (target) {
        // slight timeout to allow layout
        setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
      }
    }
  }, [])

  return (
    <section className="min-h-screen bg-black flex items-center relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center relative">
          {/* Left Section - Text Content */}
          <div className="space-y-8">
            {/* Orange line */}
            <div className="w-16 h-0.5 bg-[#ff8c42]"></div>
            
            <div className="text-[#ff8c42] text-sm uppercase tracking-widest font-semibold">
              Brands We Work With
            </div>
            
            {/* Main heading */}
            <div className="space-y-2">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white uppercase leading-[0.9]">
                Team Work
              </h1>
              <h1 className="text-4xl sm:text-5xl lg:text-5xl font-bold text-[#ff8c42] uppercase leading-[0.9]">
                Makes the Dream Work
              </h1>
            </div>
            
            {/* Description */}
            <p className="text-lg text-gray-300 leading-relaxed max-w-lg">
              Every detail, from the sophisticated audio integration to the exclusive vehicle add-ons, was meticulously brought to life by Timberline Upfitters' technical team. The result is a fleet where boundary-pushing sound meets uncompromising off-road performance, crafted to the highest standard.
            </p>
          </div>

          {/* Right Section - Layered 3D Cards */}
          <div className="relative h-[700px] flex items-center justify-center lg:absolute lg:right-0 lg:top-1/2 lg:transform lg:-translate-y-1/2 lg:w-[60%] lg:h-[600px]">
            {/* Card Stack */}
            <div className="relative w-[500px] h-[600px] cursor-grab active:cursor-grabbing"
                 onMouseEnter={handleMouseEnter}
                 onMouseLeave={(e) => { handleMouseLeave(); finishDrag() }}
                 onMouseDown={handlePointerDown}
                 onMouseMove={handlePointerMove}
                 onMouseUp={finishDrag}
                 onTouchStart={handlePointerDown}
                 onTouchMove={handlePointerMove}
                 onTouchEnd={finishDrag}>
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
                  transform = 'translateX(180px) translateY(-40px) rotateY(-25deg) scale(0.8)'
                  zIndex = 20
                  opacity = 0.6
                } else if (isPrev) {
                  transform = 'translateX(-180px) translateY(-40px) rotateY(25deg) scale(0.8)'
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
                    onClick={() => {
                      if (suppressClick) return
                      // If we're on the brands page, smooth scroll to the section; otherwise navigate to the hash
                      if (typeof window !== 'undefined') {
                        const targetId = card.id
                        const isOnBrandsPage = window.location.pathname === '/brands'
                        if (isOnBrandsPage) {
                          const el = document.getElementById(targetId)
                          if (el) {
                            el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                          }
                        } else {
                          window.location.href = `/brands#${targetId}`
                        }
                      }
                    }}
                  >
                    <Image
                      src={card.image}
                      alt={card.name}
                      fill
                      className="object-cover"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    
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
