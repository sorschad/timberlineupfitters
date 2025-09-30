'use client'

import { useState } from 'react'
import Image from 'next/image'
import { urlForImage } from '@/sanity/lib/utils'

interface VehicleFeaturesGalleryProps {
  vehicle: {
    title: string
    gallery?: any[]
    coverImage?: any
    headerVehicleImage?: any
    features?: Array<{
      title: string
      description: string
      icon?: any
      image?: any
      position?: { x: number; y: number }
    }>
  }
}

export default function VehicleFeaturesGallery({ vehicle }: VehicleFeaturesGalleryProps) {
  const [activeView, setActiveView] = useState<'interior' | 'exterior'>('interior')
  const [activeFeature, setActiveFeature] = useState<string | null>(null)

  // Default features if not provided
  const defaultFeatures = [
    {
      id: 'panoramic-display',
      title: 'Panoramic Display',
      description: 'Panoramic display with the biggest smart touch display with car controls',
      position: { x: 60, y: 30 }
    },
    {
      id: 'premium-seating',
      title: 'Premium Seating',
      description: 'Luxurious quilted seating with premium materials and comfort features',
      position: { x: 40, y: 70 }
    },
    {
      id: 'smart-controls',
      title: 'Smart Controls',
      description: 'Intuitive dashboard controls with advanced technology integration',
      position: { x: 70, y: 50 }
    }
  ]

  const features = vehicle.features || defaultFeatures

  // Get the main display image based on active view
  const getMainImage = () => {
    if (activeView === 'interior' && vehicle.headerVehicleImage) {
      return vehicle.headerVehicleImage
    }
    if (activeView === 'exterior' && vehicle.coverImage) {
      return vehicle.coverImage
    }
    return vehicle.gallery?.[0] || vehicle.coverImage
  }

  const mainImage = getMainImage()
  const imageUrl = mainImage ? urlForImage(mainImage)?.url() : null

  return (
    <section className="py-16 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-1 gap-12 items-center">
          <h2 className="text-4xl md:text-6xl font-bold text-center text-white leading-tight">
            Comfort in simplicity. High-tech future of driving
          </h2>
        </div>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Section - Hero Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="relative aspect-[16/10] -mt-16">
                  <Image
                    src={urlForImage(mainImage)!.width(1200).height(800).fit('crop').url()}
                    alt={`${vehicle.title} ${activeView} view`}
                    fill
                    className="object-cover"
                  />
                  {/* Interactive Hotspots */}
                  {activeView === 'interior' && features.map((feature, index) => (
                    <button
                      key={feature.id}
                      onClick={() => setActiveFeature(activeFeature === feature.id ? null : feature.id)}
                      className={`absolute w-8 h-8 rounded-full border-2 border-white bg-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-110 ${
                        activeFeature === feature.id ? 'bg-white/40 scale-110' : ''
                      }`}
                      style={{
                        left: `${feature.position?.x || 50}%`,
                        top: `${feature.position?.y || 50}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                      aria-label={`View ${feature.title} details`}
                    >
                      <div className="w-full h-full rounded-full bg-white/60 flex items-center justify-center">
                        <span className="text-slate-900 font-bold text-sm">+</span>
                      </div>
                    </button>
                  ))}
                  {/* View Selector */}
                  <div className="absolute bottom-0 right-4 flex gap-2 left-4 w-full justify-center">
                    <button
                      onClick={() => setActiveView('exterior')}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                        activeView === 'exterior'
                          ? 'bg-white text-slate-900'
                          : 'bg-slate-900/50 text-white hover:bg-slate-900/70'
                      }`}
                    >
                      Exterior
                    </button>
                    <button
                      onClick={() => setActiveView('interior')}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                        activeView === 'interior'
                          ? 'bg-white text-slate-900'
                          : 'bg-slate-900/50 text-white hover:bg-slate-900/70'
                      }`}
                    >
                      Interior
                    </button>
                  </div>
              </div>
            </div>
          </div>

          {/* Right Section - Interactive Feature Display */}
          <div className="relative">

            {/* Feature Cards */}
            <div className="space-y-4">
              {features.slice(0, 2).map((feature, index) => (
                <div
                  key={feature.id}
                  className={`bg-blue-500 rounded-xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl ring-2 ring-blue-500 shadow-blue-500/20 ${
                    activeFeature === feature.id ? 'ring-2 ring-blue-500 shadow-blue-500/20' : ''
                  }`}
                  onClick={() => setActiveFeature(activeFeature === feature.id ? null : feature.id)}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed mb-3">
                        {feature.description}
                      </p>
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
