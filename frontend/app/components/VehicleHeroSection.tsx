'use client'

import Image from 'next/image'
import { urlForImage } from '@/sanity/lib/utils'

interface Vehicle {
  _id: string
  title: string
  slug: { current: string }
  model: string
  vehicleType: string
  modelYear: number
  brand?: string
  trim?: string
  manufacturer: {
    _id: string
    name: string
    logo?: any
  }
  coverImage?: any
  headerVehicleImage?: any
  vehicleDetailsPageHeaderBackgroundImage?: {
    asset?: any
    alt?: string
    hotspot?: any
    crop?: any
  }
}

interface VehicleHeroSectionProps {
  vehicle: Vehicle
  onScrollToFeatures: () => void
  isScrolling: boolean
}

export default function VehicleHeroSection({ vehicle, onScrollToFeatures, isScrolling }: VehicleHeroSectionProps) {
  // Get alt text from header background image for subtitle
  const headerAltText = vehicle.vehicleDetailsPageHeaderBackgroundImage?.alt || ''

  return (
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

      <div className="relative z-10 container mx-auto px-4 pt-32 md:pt-32 pb-40 min-h-[500px]">
        {/* Mobile Layout - Stacked */}
        <div className="lg:hidden space-y-8">
          {/* Main Headline */}
          <h1 className="text-center text-5xl md:text-4xl font-bold leading-none mb-2">
            {vehicle.title}
          </h1>

          {/* Vehicle Model */}
          {vehicle.model && (
            <p className="text-xl font-medium text-white/70 max-w-lg leading-tight text-center mx-auto mb-2 uppercase">
              {vehicle.model}
            </p>
          )}

          {/* Subtitle */}
          <p className="text-lg font-normal text-white max-w-lg leading-tight text-center mx-auto">
            {headerAltText}
          </p>

          {/* Vehicle Image - Mobile Only */}
          <div className="relative flex justify-center min-h-[400px]">
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

          {/* CTA Button - Mobile Only */}
          <div className="mt-6">
            <button
              onClick={onScrollToFeatures}
              className="bg-white text-black px-8 py-4 rounded-sm font-semibold text-lg hover:bg-white/90 transition-all duration-300 shadow-lg hover:scale-105 w-full cursor-pointer"
            >
              {isScrolling ? 'Scrolling...' : 'explore features'}
            </button>
          </div>
        </div>

        {/* Desktop Layout - Grid */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-12 items-center h-full">
          {/* Left Content */}
          <div className="space-y-8">
            {vehicle.manufacturer.logo && (
              <Image 
                src={urlForImage(vehicle.manufacturer.logo)!.width(1200).height(800).fit('crop').url()} 
                alt={vehicle.manufacturer.name} 
                width={1200} 
                height={800} 
                className="w-24 h-auto mb-2" 
              />
            )}
            
            {/* Main Headline */}
            <h1 className="uppercase text-center sm:text-left text-4xl md:text-6xl font-extrabold leading-none mb-1">
              {vehicle.title}
            </h1>

            {/* Vehicle Model */}
            {vehicle.model && (
              <p className="text-xl font-bold text-white/70 max-w-lg leading-tight mb-1 uppercase">
                {vehicle.model}
              </p>
            )}

            {/* Subtitle */}
            <p className="text-lg font-base text-white max-w-lg leading-tight">
              {headerAltText}
            </p>

            {/* CTA Button - Desktop Only */}
            <button
              onClick={onScrollToFeatures}
              className="bg-white text-black px-8 py-4 rounded-sm font-semibold text-lg hover:bg-white/90 transition-all duration-300 shadow-lg hover:scale-105 w-full sm:w-auto cursor-pointer"
            >
              {isScrolling ? 'Scrolling...' : 'explore features'}
            </button>
          </div>

          <div className="relative flex justify-center lg:justify-end min-h-[500px]">
            &nbsp;
          </div>
        </div>
      </div>

      {/* Fade Transition Section */}
      <div className="absolute bottom-0 left-0 right-0 z-0">
        <div className="relative">
          {/* Softened gradient fade overlay */}
          <div className="h-50 bg-gradient-to-b from-transparent via-brown/5 to-brown/40"></div>
          <div className="h-60 bg-gradient-to-b from-brown/40 via-brown/70 to-brown"></div>
        </div>
      </div>
    </section>
  )
}
