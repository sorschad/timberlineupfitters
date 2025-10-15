'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Breadcrumb from '@/app/components/Breadcrumb'
import InventoryStatusBadge from '@/app/components/InventoryStatusBadge'

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
  specifications?: any
  features?: any
  inventory?: any
  tags?: string[]
}

interface VehiclesClientProps {
  vehicles: Vehicle[]
}

type FilterType = 'all' | 'truck' | 'suv' | 'utility'

export default function VehiclesClient({ vehicles }: VehiclesClientProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')

  // Filter vehicles based on active filter
  const filteredVehicles = useMemo(() => {
    if (activeFilter === 'all') {
      return vehicles
    }
    return vehicles.filter(vehicle => 
      vehicle.vehicleType.toLowerCase() === activeFilter
    )
  }, [vehicles, activeFilter])

  // Group filtered vehicles by manufacturer
  const vehiclesByManufacturer = useMemo(() => {
    return filteredVehicles.reduce((acc: any, vehicle: Vehicle) => {
      const manufacturer = vehicle.manufacturer?.name || 'Unknown Manufacturer'
      if (!acc[manufacturer]) {
        acc[manufacturer] = []
      }
      acc[manufacturer].push(vehicle)
      return acc
    }, {})
  }, [filteredVehicles])

  const filterButtons = [
    { key: 'all', label: 'All Vehicles', count: vehicles.length },
    { key: 'truck', label: 'Trucks', count: vehicles.filter(v => v.vehicleType.toLowerCase() === 'truck').length },
    { key: 'suv', label: 'SUVs', count: vehicles.filter(v => v.vehicleType.toLowerCase() === 'suv').length },
    { key: 'utility', label: 'Utility', count: vehicles.filter(v => v.vehicleType.toLowerCase() === 'utility').length },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-40 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <div className="container text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-6">
            Vehicle Models
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            Discover our complete collection of premium vehicles, 
            each carefully selected and customized for your specific needs and adventures.
          </p>
        </div>
      </section>

      {/* Breadcrumb Navigation */}
      <Breadcrumb 
        items={[
          { label: 'Home', href: '/' },
          { label: 'Vehicles', href: '/vehicles' }
        ]} 
      />
      
      {/* Filter Section */}
      <section className="py-8 bg-gray-50 border-b">
        <div className="container">
          <div className="flex flex-wrap gap-4 justify-center">
            {filterButtons.map((button) => (
              <button
                key={button.key}
                onClick={() => setActiveFilter(button.key as FilterType)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  activeFilter === button.key
                    ? 'bg-brand text-white hover:bg-brand/90'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {button.label} ({button.count})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Vehicles Grid - Isotope Style */}
      <section className="py-20 bg-white">
        <div className="container">
          {Object.keys(vehiclesByManufacturer).length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                No vehicles found
              </h3>
              <p className="text-gray-600 mb-8">
                No vehicles match the selected filter. Try selecting a different category.
              </p>
              <button
                onClick={() => setActiveFilter('all')}
                className="bg-brand hover:bg-brand/90 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300"
              >
                Show All Vehicles
              </button>
            </div>
          ) : (
            Object.entries(vehiclesByManufacturer).map(([manufacturerName, manufacturerVehicles]: [string, any]) => (
              <div key={manufacturerName} className="mb-16">
                {/* Manufacturer Header */}
                <div className="flex items-center gap-4 mb-8">
                  {manufacturerVehicles[0]?.manufacturer?.logo && (
                    <Image
                      src={manufacturerVehicles[0].manufacturer.logo.asset.url}
                      alt={`${manufacturerName} Logo`}
                      width={60}
                      height={60}
                      className="object-contain"
                    />
                  )}
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">{manufacturerName}</h2>
                    <p className="text-gray-600">{manufacturerVehicles.length} Vehicle{manufacturerVehicles.length !== 1 ? 's' : ''}</p>
                  </div>
                </div>

                {/* Isotope Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {manufacturerVehicles.map((vehicle: Vehicle, index: number) => {
                    // Create varying heights for isotope effect
                    const heightClasses = [
                      'h-80', 'h-96', 'h-80', 'h-72', 'h-88', 'h-80', 'h-96', 'h-72'
                    ]
                    const heightClass = heightClasses[index % heightClasses.length]
                    
                    return (
                      <Link
                        key={vehicle._id}
                        href={`/vehicles/${vehicle.slug.current}`}
                        className={`group relative rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden border border-gray-200 ${heightClass}`}
                        style={{
                          backgroundImage: vehicle.coverImage && vehicle.coverImage.asset && vehicle.coverImage.asset.url ? `url(${vehicle.coverImage.asset.url})` : 'none',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat'
                        }}
                      >
                        {/* Background Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/40 group-hover:from-black/10 group-hover:via-black/5 group-hover:to-black/30 transition-all duration-300" />
                        
                        {/* Year Badge */}
                        <div className="absolute top-4 left-4 bg-brand text-white px-3 py-1 rounded-full text-sm font-semibold z-10">
                          {vehicle.modelYear}
                        </div>
                        
                        {/* Inventory Status Badge */}
                        <InventoryStatusBadge availability={vehicle.inventory?.availability} />
                        
                        {/* Vehicle Type Badge */}
                        <div className="absolute top-16 right-4 bg-white/90 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold capitalize z-10">
                          {vehicle.vehicleType}
                        </div>
                        
                        {/* Vehicle Info */}
                        <div className="p-6 flex flex-col h-full relative z-10">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-timberline-orange transition-colors duration-300 drop-shadow-lg">
                              {vehicle.title}
                            </h3>
                            
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-sm text-gray-200">
                                {vehicle.manufacturer.name}
                              </span>
                              <span className="text-gray-300">•</span>
                              <span className="text-sm text-gray-200">
                                {vehicle.model}
                              </span>
                            </div>
                            
                            {vehicle.trim && (
                              <p className="text-sm text-gray-300 mb-3">
                                {vehicle.trim} Trim
                              </p>
                            )}
                            
                            {/* Key Specs */}
                            {vehicle.specifications && (
                              <div className="space-y-2 mb-4">
                                {vehicle.specifications.towingCapacity && (
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-200">Towing:</span>
                                    <span className="font-semibold text-white">{vehicle.specifications.towingCapacity.toLocaleString()} lbs</span>
                                  </div>
                                )}
                                {vehicle.specifications.payloadCapacity && (
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-200">Payload:</span>
                                    <span className="font-semibold text-white">{vehicle.specifications.payloadCapacity.toLocaleString()} lbs</span>
                                  </div>
                                )}
                              </div>
                            )}
                            
                            {/* Tags */}
                            {vehicle.tags && vehicle.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-4">
                                {vehicle.tags.slice(0, 3).map((tag, idx) => (
                                  <span key={idx} className="bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded text-xs border border-white/30">
                                    {tag}
                                  </span>
                                ))}
                                {vehicle.tags.length > 3 && (
                                  <span className="text-gray-300 text-xs">
                                    +{vehicle.tags.length - 3} more
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          
                          {/* CTA */}
                          <div className="mt-auto">
                            <div className="flex items-center justify-between">
                              <span className="text-white font-semibold group-hover:text-timberline-orange transition-colors duration-300">
                                View Details →
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Can&apos;t Find What You&apos;re Looking For?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Our team can help you find the perfect vehicle or create a custom solution for your specific needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-brand hover:bg-brand/90 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Contact Us
            </Link>
            <Link
              href="/custom-build"
              className="bg-white hover:bg-gray-50 text-gray-900 px-8 py-4 rounded-full font-semibold transition-all duration-300 border border-gray-200"
            >
              Custom Build
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
