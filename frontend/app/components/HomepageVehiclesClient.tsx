'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useMemo } from 'react'
import InventoryStatusBadge from '@/app/components/InventoryStatusBadge'
import { BrandsWithSloganQueryResult, AllVehiclesQueryResult } from '@/sanity.types'

interface HomepageVehiclesClientProps {
  vehicles: AllVehiclesQueryResult
  brands: BrandsWithSloganQueryResult
}

export default function HomepageVehiclesClient({ vehicles, brands }: HomepageVehiclesClientProps) {
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null)
  const [isFiltered, setIsFiltered] = useState(false)

  // Listen for brand selection events from the brands section
  useEffect(() => {
    const handleBrandSelected = (event: CustomEvent) => {
      const { brandName, brandData } = event.detail
      setSelectedBrand(brandName)
      setIsFiltered(true)
    }

    window.addEventListener('brandSelected', handleBrandSelected as EventListener)
    
    return () => {
      window.removeEventListener('brandSelected', handleBrandSelected as EventListener)
    }
  }, [])

  // Filter vehicles based on selected brand
  const filteredVehicles = useMemo(() => {
    if (!selectedBrand) {
      return vehicles.filter((vehicle) => {
        return vehicle?.inventory?.availability !== 'Available Soon'
      })
    }

    // Find the selected brand data
    const selectedBrandData = brands.find(brand => brand.name === selectedBrand)
    
    return vehicles.filter((vehicle) => {
      // First check if vehicle has a tag matching the brand
      const vehicleTags = vehicle.tags || []
      const hasBrandTag = vehicleTags.some((tag: string) => {
        const tagLower = tag.toLowerCase().trim()
        const brandLower = selectedBrand.toLowerCase().trim()
        return tagLower === brandLower || tagLower.includes(brandLower)
      })
      
      // If no brand tag match, exclude the vehicle
      if (!hasBrandTag) return false
      
      // Hide vehicles with "Available Soon" status
      if (vehicle?.inventory?.availability === 'Available Soon') {
        return false
      }
      
      // If brand has manufacturer associations, also check manufacturer filter
      if (selectedBrandData?.manufacturers && selectedBrandData.manufacturers.length > 0) {
        const vehicleManufacturerId = vehicle?.manufacturer?._id
        return vehicleManufacturerId && selectedBrandData.manufacturers.some(m => m._id === vehicleManufacturerId)
      }
      
      // If brand has no manufacturer associations, just return vehicles with brand tag
      return true
    })
  }, [vehicles, selectedBrand, brands])

  // Group vehicles by manufacturer for better organization
  const vehiclesByManufacturer = useMemo(() => {
    return filteredVehicles.reduce((acc: any, vehicle) => {
      const manufacturer = vehicle.manufacturer?.name || 'Unknown Manufacturer'
      if (!acc[manufacturer]) {
        acc[manufacturer] = []
      }
      acc[manufacturer].push(vehicle)
      return acc
    }, {})
  }, [filteredVehicles])

  const clearFilter = () => {
    setSelectedBrand(null)
    setIsFiltered(false)
  }

  if (!vehicles || vehicles.length === 0) {
    return null
  }

  return (
    <section id="vehicles-section" className="w-full bg-black py-20 lg:py-32 relative overflow-hidden">
      {/* Topographic Map Background Overlay */}
      <div className="absolute inset-0 w-full h-full">
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/images/topographic-map.svg)',
            opacity: 0.3
          }}
        />
        <div className="absolute inset-0 bg-black opacity-70"></div>
      </div>
      
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-[#ff6a00]/10 to-[#5a3e2b]/10 rounded-full blur-3xl animate-float-bounce"></div>
        <div className="absolute -bottom-20 -left-20 w-32 h-32 bg-gradient-to-tr from-[#5a3e2b]/10 to-[#ff6a00]/10 rounded-full blur-2xl animate-bounce-slow"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-[#ff6a00]/5 to-transparent rounded-full blur-xl animate-float-bounce" style={{animationDelay: '1s'}}></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-16 lg:mb-20 animate-fade-in-up">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-0.5 bg-gradient-to-r from-[#ff6a00] to-[#5a3e2b] animate-gradient"></div>
            <span className="text-[#ff6a00] font-semibold text-sm uppercase tracking-wider">lineup</span>
            <div className="w-12 h-0.5 bg-gradient-to-r from-[#5a3e2b] to-[#ff6a00] animate-gradient"></div>
          </div>
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-6">
            {isFiltered ? `${selectedBrand} Vehicles` : 'Vehicle Showcase'}
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-snug">
            {isFiltered 
              ? `Explore our collection of ${selectedBrand} vehicles, each meticulously customized for your specific needs and adventures.`
              : 'Explore our comprehensive collection of premium vehicles, each meticulously selected and customized for your specific needs and adventures.'
            }
          </p>
          
          {/* Filter indicator and clear button */}
          {isFiltered && (
            <div className="mt-6">
              <div className="inline-flex items-center gap-3 bg-[#ff6a00]/20 border border-[#ff6a00]/30 rounded-full px-4 py-2">
                <span className="text-[#ff6a00] text-sm font-medium">
                  Showing {selectedBrand} vehicles
                </span>
                <button
                  onClick={clearFilter}
                  className="text-[#ff6a00] hover:text-white transition-colors duration-200 cursor-pointer"
                  title="Show all vehicles"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Vehicles Grid by Manufacturer */}
        <div className="space-y-16">
          {Object.keys(vehiclesByManufacturer).length === 0 ? (
            <div className="text-center py-16">
              <div className="text-gray-400 text-lg mb-4">
                No vehicles found for {selectedBrand}
              </div>
              <button
                onClick={clearFilter}
                className="text-[#ff6a00] hover:text-white transition-colors duration-200 font-medium"
              >
                Show all vehicles
              </button>
            </div>
          ) : (
            Object.entries(vehiclesByManufacturer).map(([manufacturerName, manufacturerVehicles]: [string, any], manufacturerIndex: number) => (
              <div key={manufacturerName} className="space-y-8 animate-fade-in-up" style={{animationDelay: `${manufacturerIndex * 0.2}s`}}>
                {/* Manufacturer Header - Hidden when brand filter is applied */}
                {!isFiltered && (
                  <div className="flex flex-row items-center justify-center gap-4 mb-8">
                    <div className="w-full h-0.5 bg-white/20"></div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-2xl lg:text-3xl font-bold text-white uppercase">{manufacturerName}</h3>
                    </div>
                    <div className="w-full h-0.5 bg-white/20"></div>
                  </div>
                )}

                {/* Vehicles Grid - Compact Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                  {manufacturerVehicles.slice(0, 8).map((vehicle: any, index: number) => (
                    <Link
                      key={vehicle._id}
                      href={`/vehicles/${vehicle.slug.current}`}
                      className=""
                      style={{animationDelay: `${(manufacturerIndex * 0.2) + (index * 0.1)}s`}}
                    >
                      <div className="">
                         {/* Right Section - Vehicle Image */}
                         <div className="relative h-[170px] sm:h-[220px]">
                          {/* Inventory Status Badge */}
                          <InventoryStatusBadge availability={vehicle.inventory?.availability} />
                          
                          <div className="h-[170px] sm:h-[220px] overflow-hidden group-hover:border-[#ff8c42]/30 transition-all duration-300">
                            {vehicle?.coverImage?.asset?.url ? (
                              <img 
                                src={vehicle.coverImage.asset.url} 
                                alt={vehicle.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <div className="text-center">
                                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-3 mx-auto">
                                    <svg className="w-6 h-6 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                  </div>
                                  <span className="text-white/40 text-sm font-medium">Vehicle Image</span>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        {/* Left Section - Text Content */}
                        <div className="flex flex-col justify-center gap-2 p-3 sm:p-2">
                          <div>
                            <div className="flex gap-1 text-white/90 text-xs leading-tight uppercase">
                              {vehicle?.manufacturer?.name && (
                                <span className="block">{vehicle.manufacturer.name}</span>
                              )}
                              {vehicle?.model && (
                                <span className="block">{vehicle.model}</span>
                              )}
                            </div>

                            {/* Vehicle Title */}
                            <h3 className="uppercase text-timberline-orange text-sm sm:text-md font-bold mb-1 group-hover:text-[#ff8c42] transition-colors duration-300 leading-tight">
                              {vehicle.title}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Show More Link if there are more vehicles */}
                {manufacturerVehicles.length > 8 && (
                  <div className="text-center pt-4">
                    <Link
                      href="/vehicles"
                      className="inline-flex items-center gap-2 text-[#ff6a00] hover:text-[#5a3e2b] font-semibold transition-colors duration-300"
                    >
                      View All {isFiltered ? 'Vehicles' : `${manufacturerName} Vehicles`}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
