'use client'

import { useState } from 'react'
import Image from 'next/image'
import { urlForImage } from '@/sanity/lib/utils'
import VehicleGallery from '@/app/components/VehicleGallery'

interface Vehicle {
  _id: string
  title: string
  slug: { current: string }
  model: string
  vehicleType: string
  modelYear: number
  trim?: string
  manufacturer: {
    _id: string
    name: string
    logo?: any
  }
  coverImage?: any
  headerVehicleImage?: any
  vehicleDetailsPageHeaderBackgroundImage?: any
  gallery?: any[]
  videoTour?: any
  specifications?: any
  features?: any
  customizationOptions?: any[]
  inventory?: any
  description?: any[]
  tags?: string[]
  seo?: any
}

interface VehiclePageClientProps {
  vehicle: Vehicle
}

export default function VehiclePageClient({ vehicle }: VehiclePageClientProps) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null)

  // Define filter tags for each card
  const filterCards = [
    {
      id: 'unique-design',
      title: 'Unique Design',
      description: 'Inspired by the sea, the Ocean build embodies adventure and fun.',
      tag: 'design'
    },
    {
      id: 'sound-performance',
      title: 'Sound Performance',
      description: 'Advanced audio systems for premium driving experience.',
      tag: 'performance'
    },
    {
      id: 'custom-leather',
      title: 'Custom Leather Interior',
      description: 'Premium leather seating and interior materials.',
      tag: 'interior'
    },
    {
      id: 'off-road-bumpers',
      title: 'Off Road Bumpers',
      description: 'Heavy-duty protection for rugged terrain adventures.',
      tag: 'offroad'
    },
    {
      id: 'premium-features',
      title: 'Premium Features',
      description: 'Luxury amenities and advanced technology integration.',
      tag: 'premium'
    }
  ]

  // Filter gallery images based on active filter
  const getFilteredGallery = () => {
    if (!vehicle.gallery || !activeFilter) return vehicle.gallery

    return vehicle.gallery.filter((image: any) => {
      // Check if image has tags that match the active filter
      const imageTags = image.tags || []
      return imageTags.some((tag: string) => 
        tag.toLowerCase().includes(activeFilter.toLowerCase())
      )
    })
  }

  const filteredGallery = getFilteredGallery()

  return (
    <div className="min-h-screen">
      {/* Hero Section - Scenic Background with Vehicle */}
      <section 
        className="relative max-h-[90vh] text-white overflow-hidden"
        style={{
          backgroundImage: (vehicle.vehicleDetailsPageHeaderBackgroundImage && urlForImage(vehicle.vehicleDetailsPageHeaderBackgroundImage)?.url())
            ? `url(${urlForImage(vehicle.vehicleDetailsPageHeaderBackgroundImage)?.width(1920).height(1080).fit('crop').url()})`
            : (vehicle.coverImage && urlForImage(vehicle.coverImage)?.url())
              ? `url(${urlForImage(vehicle.coverImage)?.width(1920).height(1080).fit('crop').url()})`
              : 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #1d4ed8 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-black/50" />
        
        <div className="relative z-10 container mx-auto px-4 pt-20 pb-40">
          <div className="grid lg:grid-cols-2 gap-12 items-center h-full">
            {/* Left Content */}
            <div className="space-y-8">
              {/* Main Headline */}
              <h1 className="text-3xl md:text-5xl font-bold leading-none">
                {vehicle.title}
              </h1>
              
              {/* Subtitle */}
              <p className="text-xl text-white/90 max-w-lg">
                New all electric crossover with long range for road trips and comfort.
              </p>
              
              {/* CTA Button */}
              <button className="bg-white text-black px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/90 transition-all duration-300 shadow-lg">
                Explore
              </button>
            </div>
            
            {/* Right Content - Vehicle Image */}
            <div className="relative flex justify-center lg:justify-end">
              {(vehicle.headerVehicleImage && urlForImage(vehicle.headerVehicleImage)?.url()) ? (
                <div className="relative">
                  <Image
                    src={urlForImage(vehicle.headerVehicleImage)!.width(1200).height(800).fit('crop').url()}
                    alt={vehicle.title}
                    width={600}
                    height={400}
                    className="rounded-2xl shadow-2xl"
                  />
                </div>
              ) : (vehicle.coverImage && urlForImage(vehicle.coverImage)?.url() ? (
                <div className="relative">
                  <Image
                    src={urlForImage(vehicle.coverImage)!.width(1200).height(800).fit('crop').url()}
                    alt={vehicle.title}
                    width={600}
                    height={400}
                    className="rounded-2xl shadow-2xl"
                  />
                </div>
              ) : (
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl h-96 w-96 flex items-center justify-center">
                  <span className="text-6xl font-bold text-gray-400">
                    {vehicle.manufacturer.name.charAt(0)}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Data Cards Overlay - Now with Filter Functionality */}
          <div className="absolute bottom-4 left-0 right-0 z-20">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {filterCards.map((card) => (
                  <button
                    key={card.id}
                    onClick={() => setActiveFilter(activeFilter === card.tag ? null : card.tag)}
                    className={`bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center border transition-all duration-300 hover:scale-105 ${
                      activeFilter === card.tag 
                        ? 'border-white/60 bg-white/20 shadow-lg shadow-white/10' 
                        : 'border-white/20 hover:border-white/40'
                    }`}
                  >
                    <div className="text-base font-bold text-white mb-3 leading-none uppercase">
                      {card.title}
                    </div>
                    <div className="text-sm text-white/70 mb-2 leading-tight font-light">
                      {card.description}
                    </div>
                    {activeFilter === card.tag && (
                      <div className="text-xs text-white/90 font-medium mt-2">
                        ✓ Active Filter
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section - Now with Filtering */}
      <VehicleGallery 
        gallery={filteredGallery} 
        vehicleTitle={vehicle.title}
        activeFilter={activeFilter}
        onClearFilter={() => setActiveFilter(null)}
      />
    </div>
  )
}
