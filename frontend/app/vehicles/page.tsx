import type {Metadata} from 'next'
import Link from 'next/link'
import Image from 'next/image'

import {sanityFetch} from '@/sanity/lib/live'
import {client} from '@/sanity/lib/client'
import {allVehiclesQuery} from '@/sanity/lib/queries'
import Breadcrumb from '@/app/components/Breadcrumb'

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

/**
 * Generate metadata for the page.
 */
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Vehicles',
    description: 'Explore our complete inventory of premium vehicles including trucks, SUVs, and commercial vehicles. Find the perfect vehicle for your needs.',
  }
}

export default async function VehiclesPage() {
  const vehicles = await client.fetch(allVehiclesQuery)

  // Handle case where no vehicles are found or data structure is different
  if (!vehicles || vehicles.length === 0) {
    return (
      <div className="min-h-screen">
        <Breadcrumb 
          items={[
            { label: 'Home', href: '/' },
            { label: 'Vehicles', href: '/vehicles' }
          ]} 
        />
        <section className="py-40 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
          <div className="container text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Vehicle Models
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              No vehicles are currently available. Please check back later or contact us for more information.
            </p>
          </div>
        </section>
      </div>
    )
  }

  // Group vehicles by manufacturer for better organization
  const vehiclesByManufacturer = vehicles?.reduce((acc: any, vehicle: Vehicle) => {
    const manufacturer = vehicle.manufacturer?.name || 'Unknown Manufacturer'
    if (!acc[manufacturer]) {
      acc[manufacturer] = []
    }
    acc[manufacturer].push(vehicle)
    return acc
  }, {}) || {}

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-40 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <div className="container text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
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
            <button className="px-6 py-3 bg-brand text-white rounded-full font-semibold transition-all duration-300 hover:bg-brand/90">
              All Vehicles
            </button>
            <button className="px-6 py-3 bg-white text-gray-700 rounded-full font-semibold transition-all duration-300 hover:bg-gray-100 border border-gray-200">
              Trucks
            </button>
            <button className="px-6 py-3 bg-white text-gray-700 rounded-full font-semibold transition-all duration-300 hover:bg-gray-100 border border-gray-200">
              SUVs
            </button>
            <button className="px-6 py-3 bg-white text-gray-700 rounded-full font-semibold transition-all duration-300 hover:bg-gray-100 border border-gray-200">
              Commercial
            </button>
          </div>
        </div>
      </section>

      {/* Vehicles Grid - Isotope Style */}
      <section className="py-20 bg-white">
        <div className="container">
          {/* Group by Manufacturer */}
          {Object.entries(vehiclesByManufacturer).map(([manufacturerName, manufacturerVehicles]: [string, any]) => (
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
                      className={`group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden border border-gray-200 ${heightClass}`}
                    >
                      {/* Vehicle Image */}
                      <div className="relative h-48 bg-gray-100">
                        {vehicle.coverImage ? (
                          <Image
                            src={vehicle.coverImage.asset.url}
                            alt={vehicle.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <span className="text-4xl font-bold text-gray-400">
                              {vehicle.manufacturer.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        
                        {/* Year Badge */}
                        <div className="absolute top-4 left-4 bg-brand text-white px-3 py-1 rounded-full text-sm font-semibold">
                          {vehicle.modelYear}
                        </div>
                        
                        {/* Vehicle Type Badge */}
                        <div className="absolute top-4 right-4 bg-white/90 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold capitalize">
                          {vehicle.vehicleType}
                        </div>
                      </div>
                      
                      {/* Vehicle Info */}
                      <div className="p-6 flex flex-col h-full">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-brand transition-colors duration-300">
                            {vehicle.title}
                          </h3>
                          
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-sm text-gray-600">
                              {vehicle.manufacturer.name}
                            </span>
                            <span className="text-gray-300">•</span>
                            <span className="text-sm text-gray-600">
                              {vehicle.model}
                            </span>
                          </div>
                          
                          {vehicle.trim && (
                            <p className="text-sm text-gray-500 mb-3">
                              {vehicle.trim} Trim
                            </p>
                          )}
                          
                          {/* Key Specs */}
                          {vehicle.specifications && (
                            <div className="space-y-2 mb-4">
                              {vehicle.specifications.towingCapacity && (
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">Towing:</span>
                                  <span className="font-semibold">{vehicle.specifications.towingCapacity.toLocaleString()} lbs</span>
                                </div>
                              )}
                              {vehicle.specifications.payloadCapacity && (
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">Payload:</span>
                                  <span className="font-semibold">{vehicle.specifications.payloadCapacity.toLocaleString()} lbs</span>
                                </div>
                              )}
                            </div>
                          )}
                          
                          {/* Tags */}
                          {vehicle.tags && vehicle.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-4">
                              {vehicle.tags.slice(0, 3).map((tag, idx) => (
                                <span key={idx} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                                  {tag}
                                </span>
                              ))}
                              {vehicle.tags.length > 3 && (
                                <span className="text-gray-400 text-xs">
                                  +{vehicle.tags.length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        
                        {/* CTA */}
                        <div className="mt-auto">
                          <div className="flex items-center justify-between">
                            <span className="text-brand font-semibold">
                              View Details →
                            </span>
                            {vehicle.inventory?.availability && (
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                vehicle.inventory.availability === 'In Stock' 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}>
                                {vehicle.inventory.availability}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
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
