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
  const [isScrolling, setIsScrolling] = useState(false)

  // Define filter tags for each card
  const filterCards = [
    {
      id: 'exterior',
      title: 'Exterior',
      description: 'unique + styled',
      tag: 'exterior'
    },
    {
      id: 'interior',
      title: 'Interior',
      description: 'custom comforts',
      tag: 'interior'
    },
    {
      id: 'audio',
      title: 'Sound System',
      description: 'high-fidelity audio',
      tag: 'audio'
    },
    {
      id: 'accessories',
      title: 'Accessories',
      description: 'bumpers, lights, toolboxes',
      tag: 'accessories'
    },
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
    <div className="scroll-smooth">
      {/* Hero Section - Scenic Background with Vehicle */}
      <section 
        className="relative min-h-[50vh] lg:min-h-[320px] text-white overflow-hidden"
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
              <h1 className="text-3xl md:text-4xl font-bold leading-none">
                {vehicle.title}
              </h1>
              
              {/* Subtitle */}
              <p className="text-lg font-light text-white/60 max-w-lg leading-tight">
                New all electric crossover with long range for road trips and comfort.
              </p>
              
              {/* CTA Button */}
              <button 
                onClick={() => {
                  setIsScrolling(true)
                  const gallerySection = document.getElementById('vehicle-gallery-section')
                  if (gallerySection) {
                    // Add offset for sticky header
                    const offset = 80
                    const elementPosition = gallerySection.offsetTop - offset
                    window.scrollTo({
                      top: elementPosition,
                      behavior: 'smooth'
                    })
                    // Reset scrolling state after animation
                    setTimeout(() => setIsScrolling(false), 1000)
                  }
                }}
                className={`bg-white text-black px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/90 transition-all duration-300 shadow-lg hover:scale-105 ${
                  isScrolling ? 'animate-pulse' : ''
                }`}
              >
                {isScrolling ? 'Scrolling...' : 'Explore'}
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
          
        </div>
        
        {/* Fade Transition Section */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <div className="relative">
            {/* Softened gradient fade overlay */}
            <div className="h-20 bg-gradient-to-b from-transparent via-white/5 to-white/40"></div>
            <div className="h-20 bg-gradient-to-b from-white/40 via-white/70 to-white"></div>
            
            {/* Dynamic subtitle section with smooth transition */}
            <div className="bg-white">
              <div className="container mx-auto px-4">
                <div className="text-center">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 animate-fade-in">
                    Features to Love
                  </h2>
                  <p className="text-base md:text-lg text-gray-600/70 max-w-3xl mx-auto animate-fade-in-delay">
                    feature, addons and customization options offered on this vehicle
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section - Now with Filtering */}
      <VehicleGallery 
        gallery={filteredGallery || []} 
        vehicleTitle={vehicle.title}
        activeFilter={activeFilter}
        onClearFilter={() => setActiveFilter(null)}
        filterCards={filterCards}
        onFilterChange={(tag) => setActiveFilter(tag)}
      />
    </div>
  )
}
