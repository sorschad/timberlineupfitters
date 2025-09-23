'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Vehicle {
  _id: string
  title: string
  slug: any
  model: string
  vehicleType: string
  modelYear: number
  upfitter?: string
  package?: string
  manufacturer: string
}

interface VehicleGroup {
  model: string
  upfitter?: string
  vehicles: Vehicle[]
}

interface VehicleShowcaseProps {
  group: VehicleGroup
  index: number
  manufacturer: any
}

export default function VehicleShowcase({ group, index, manufacturer }: VehicleShowcaseProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
      
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect()
        const isInView = rect.top < window.innerHeight && rect.bottom > 0
        setIsVisible(isInView)
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Check initial state
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isEven = index % 2 === 0
  const primaryVehicle = group.vehicles[0]
  const packageCount = group.vehicles.length

  return (
    <section 
      ref={sectionRef}
      data-vehicle-section
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Parallax Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/images/vehicle-showcase-${manufacturer.name.toLowerCase()}-${group.model.toLowerCase().replace(/\s+/g, '-')}.jpg')`,
          transform: `translateY(${scrollY * 0.3}px)`,
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content Overlay Panel */}
      <div className={`relative z-10 w-full max-w-7xl mx-auto px-6 ${
        isVisible ? 'animate-slide-in' : 'opacity-0 translate-x-full'
      }`}>
        <div className={`grid lg:grid-cols-2 gap-12 items-center ${
          isEven ? 'lg:grid-flow-col' : 'lg:grid-flow-col-dense'
        }`}>
          {/* Content Panel */}
          <div className={`${
            isEven ? 'lg:order-1' : 'lg:order-2'
          }`}>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
              {/* Package Badge */}
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-brand text-white px-4 py-2 rounded-full text-sm font-semibold">
                  {packageCount} Package{packageCount > 1 ? 's' : ''}
                </span>
                {group.upfitter && (
                  <span className="bg-white/20 text-white px-4 py-2 rounded-full text-sm">
                    {group.upfitter}
                  </span>
                )}
              </div>

              {/* Model Name */}
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
                {manufacturer.name} {group.model}
              </h2>

              {/* Key Features */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">
                    {group.vehicles.length}
                  </div>
                  <div className="text-sm text-gray-200">Packages</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">
                    {primaryVehicle.modelYear}
                  </div>
                  <div className="text-sm text-gray-200">Model Year</div>
                </div>
              </div>

              {/* Key Features List */}
              <ul className="space-y-3 mb-8">
                {group.vehicles.slice(0, 4).map((vehicle, idx) => (
                  <li key={vehicle._id} className="flex items-center text-white">
                    <div className="w-2 h-2 bg-brand rounded-full mr-3" />
                    <span className="text-lg">
                      {vehicle.package ? `${vehicle.package} Package` : 'Base Model'}
                    </span>
                  </li>
                ))}
                {group.vehicles.length > 4 && (
                  <li className="text-gray-300 text-sm">
                    +{group.vehicles.length - 4} more packages available
                  </li>
                )}
              </ul>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href={`/vehicles/${primaryVehicle.slug.current}`}
                  className="bg-brand hover:bg-brand/90 text-white px-6 py-3 rounded-full text-center font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  View {group.model} Details
                </Link>
                <button className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 border border-white/30">
                  Compare Packages
                </button>
              </div>
            </div>
          </div>

          {/* Vehicle Grid */}
          <div className={`${
            isEven ? 'lg:order-2' : 'lg:order-1'
          }`}>
            <div className="grid grid-cols-2 gap-4">
              {group.vehicles.slice(0, 4).map((vehicle, idx) => (
                <div 
                  key={vehicle._id}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
                >
                  <div className="text-center">
                    <div className="text-white font-semibold mb-2">
                      {vehicle.package || 'Base'}
                    </div>
                    <div className="text-gray-300 text-sm">
                      {vehicle.upfitter && `${vehicle.upfitter} Package`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
