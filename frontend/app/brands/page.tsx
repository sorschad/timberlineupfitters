import type {Metadata} from 'next'
import Image from 'next/image'
import Link from 'next/link'
import BrandsLandingPageHeader from '@/app/components/BrandsLandingPageHeader'
import PortableText from '@/app/components/PortableText'
import {sanityFetch} from '@/sanity/lib/live'
import {allBrandsQuery, timberlineVehiclesQuery} from '@/sanity/lib/queries'
import {AllBrandsQueryResult} from '@/sanity.types'
import {urlForImage} from '@/sanity/lib/utils'

type BrandWithSectionImage = AllBrandsQueryResult[number]

export const metadata: Metadata = {
  title: 'Our Brand Partners',
  description: 'Discover our three flagship brands and the stories behind our partnerships. From Alpine + Rebel Off Road to TSport and SuperDuty, explore how we\'ve built lasting relationships with industry leaders in off-road vehicle customization.',
}

export default async function BrandsPage() {
  const {data: brands} = await sanityFetch({
    query: allBrandsQuery,
    perspective: 'published',
    stega: false,
  })

  // Fetch all vehicles once
  const {data: allVehicles} = await sanityFetch({
    query: timberlineVehiclesQuery,
    perspective: 'published',
    stega: false,
  })

  // Sort brands in specific order: Alpine, TSport, Timberline
  const sortedBrands = brands?.sort((a, b) => {
    const order = ['alpine', 'tsport', 'timberline']
    const aIndex = order.findIndex(name => a.slug.toLowerCase().includes(name))
    const bIndex = order.findIndex(name => b.slug.toLowerCase().includes(name))
    
    // If both brands are in the order list, sort by their position
    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex
    }
    // If only one brand is in the order list, prioritize it
    if (aIndex !== -1) return -1
    if (bIndex !== -1) return 1
    // If neither brand is in the order list, maintain original order
    return 0
  })

  // Filter vehicles for each brand using the same logic as HeaderClient
  const brandsWithVehicles = sortedBrands?.map((brand) => {
    const filteredVehicles = (allVehicles || []).filter((vehicle: any) => {
      // First check if vehicle has a tag matching the brand
      const vehicleTags = vehicle.tags || []
      const hasBrandTag = vehicleTags.some((tag: string) => {
        const tagLower = tag.toLowerCase().trim()
        const brandLower = brand.name.toLowerCase().trim()
        return tagLower === brandLower || tagLower.includes(brandLower)
      })
      
      // If no brand tag match, exclude the vehicle
      if (!hasBrandTag) return false
      
      // If brand has manufacturer associations, also check manufacturer filter
      if (brand.manufacturers && brand.manufacturers.length > 0) {
        const vehicleManufacturerId = vehicle?.manufacturer?._id
        const brandManufacturerIds = brand.manufacturers.map((m: any) => m._id)
        return vehicleManufacturerId && brandManufacturerIds.includes(vehicleManufacturerId)
      }
      
      // If brand has no manufacturer associations, just return vehicles with brand tag
      return true
    })
    
    return { ...brand, vehicles: filteredVehicles }
  }) || []

  const getBrandSectionClass = (index: number) => {
    switch (index % 3) {
      case 0:
        return 'py-20 lg:py-32 bg-white'
      case 1:
        return 'py-20 lg:py-32 bg-gradient-to-br from-gray-900 to-gray-800 text-white'
      case 2:
        return 'py-20 lg:py-32 bg-gradient-to-br from-[#241e16] to-[#1a130e] text-white'
      default:
        return 'py-20 lg:py-32 bg-white'
    }
  }

  const getBrandGradientClass = (index: number) => {
    switch (index % 3) {
      case 0:
        return 'text-blue-600 animate-gradient bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent'
      case 1:
        return 'text-red-500 animate-gradient bg-gradient-to-r from-red-500 to-red-500 bg-clip-text text-transparent'
      case 2:
        return 'text-[#ff8c42] animate-gradient bg-gradient-to-r from-[#ff8c42] to-[#d0ad66] bg-clip-text text-transparent'
      default:
        return 'text-blue-600 animate-gradient bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent'
    }
  }

  const getBrandLineClass = (index: number) => {
    switch (index % 3) {
      case 0:
        return 'w-full h-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full'
      case 1:
        return 'w-full h-1 bg-gradient-to-r from-red-500 to-red-500 rounded-full'
      case 2:
        return 'w-full h-1 bg-gradient-to-r from-[#ff8c42] to-[#d0ad66] rounded-full'
      default:
        return 'w-full h-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full'
    }
  }

  const getBrandColors = (brandSlug: string) => {
    const slug = brandSlug.toLowerCase()
    if (slug.includes('alpine')) {
      return {
        primary: 'from-blue-600 to-cyan-500',
        accent: 'bg-blue-600',
        text: 'text-blue-600',
        border: 'border-blue-200',
        bg: 'bg-blue-50'
      }
    } else if (slug.includes('tsport')) {
      return {
        primary: 'text-red-500 to-red-500',
        accent: 'text-red-500',
        text: 'text-red-500',
        border: 'border-red-200',
        bg: 'bg-red-50'
      }
    } else if (slug.includes('timberline')) {
      return {
        primary: 'from-[#ff8c42] to-[#d0ad66]',
        accent: 'bg-[#ff8c42]',
        text: 'text-[#ff8c42]',
        border: 'border-[#ff8c42]/20',
        bg: 'bg-[#ff8c42]/5'
      }
    }
    return {
      primary: 'from-gray-600 to-gray-500',
      accent: 'bg-gray-600',
      text: 'text-gray-600',
      border: 'border-gray-200',
      bg: 'bg-gray-50'
    }
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Brands Landing Page Header */}
      <BrandsLandingPageHeader />

      {/* Dynamic Brand Sections */}
      {brandsWithVehicles?.map((brand: BrandWithSectionImage & { vehicles: any[] }, index: number) => {
        const brandColors = getBrandColors(brand.slug)
        return (
        <section key={brand._id} id={brand.slug} className={getBrandSectionClass(index)}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className={`space-y-8 ${index % 2 === 1 ? 'order-1 lg:order-2' : 'animate-fade-in-left'}`}>
                <div className="space-y-4">
                  <h2 className={`text-4xl sm:text-5xl lg:text-6xl font-bold ${index % 3 === 0 ? 'text-gray-900' : 'text-white'}`}>
                    <span className={getBrandGradientClass(index)}>{brand.name}</span>
                  </h2>
                  <div className={getBrandLineClass(index)}></div>
                </div>
                <div className={`text-lg leading-relaxed ${
                  brand.slug.toLowerCase().includes('timberline') 
                    ? 'text-[#ff8c42]' 
                    : brand.slug.toLowerCase().includes('tsport') 
                      ? 'text-red-500' 
                      : index % 3 === 0 
                        ? 'text-gray-600' 
                        : 'text-gray-300'
                }`}>
                  {brand.description ? (
                    <div className={brand.slug.toLowerCase().includes('timberline') ? 'text-[#ff8c42]' : ''}>
                      <PortableText value={brand.description as any} />
                    </div>
                  ) : (
                    <p>{brand.excerpt || 'Discover the excellence and innovation that defines our brand partnerships.'}</p>
                  )}
                </div>
                {brand.features && Array.isArray(brand.features) && (brand.features as string[]).length > 0 && (
                  <div className="grid grid-cols-2 gap-6">
                    {(brand.features as string[]).slice(0, 4).map((feature: string, featureIndex: number) => (
                      <div 
                        key={featureIndex}
                        className={`space-y-2 p-4 rounded-lg transition-colors duration-300 ${
                          index % 3 === 0 
                            ? 'bg-blue-50 hover:bg-blue-100' 
                            : index % 3 === 1 
                            ? 'bg-orange-900/20 hover:bg-orange-900/30' 
                            : 'bg-[#ff8c42]/10 hover:bg-[#ff8c42]/20 border border-[#ff8c42]/20'
                        }`}
                      >
                        <h4 className={`font-semibold ${
                          index % 3 === 0 
                            ? 'text-gray-900' 
                            : index % 3 === 1 
                            ? 'text-orange-400' 
                            : 'text-[#ff8c42]'
                        }`}>
                          {feature}
                        </h4>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className={`relative ${index % 2 === 1 ? 'order-2 lg:order-1 animate-fade-in-left' : 'animate-fade-in-right'}`}>
                <div className="aspect-[4/3] relative rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-300">
                  {brand.sectionImage?.asset?._ref ? (
                    <Image
                      src={urlForImage(brand.sectionImage)?.width(2000).height(1500).fit('max').auto('format').url() || ''}
                      alt={brand.sectionImage.alt || `${brand.name} section image`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                    />
                  ) : brand.coverImage?.asset?._ref ? (
                    <Image
                      src={urlForImage(brand.coverImage)?.width(2000).height(1500).fit('max').auto('format').url() || ''}
                      alt={brand.coverImage.alt || `${brand.name} cover image`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">No image available</span>
                    </div>
                  )}
                  <div className={`absolute inset-0 bg-gradient-to-t ${
                    index % 3 === 0 
                      ? 'from-blue-900/60 via-transparent to-transparent' 
                      : index % 3 === 1 
                      ? 'from-gray-900/60 via-transparent to-transparent' 
                      : 'from-[#241e16]/80 via-transparent to-transparent'
                  }`}></div>
                </div>
                <div className={`absolute -bottom-6 -right-6 w-32 h-32 rounded-full opacity-20 animate-float-bounce ${
                  index % 3 === 0 
                    ? 'bg-blue-100' 
                    : index % 3 === 1 
                    ? 'bg-orange-100' 
                    : 'bg-[#ff8c42]/20'
                }`}></div>
                <div className={`absolute -top-6 -left-6 w-24 h-24 rounded-full opacity-30 animate-bounce-slow ${
                  index % 3 === 0 
                    ? 'bg-cyan-100' 
                    : index % 3 === 1 
                    ? 'bg-red-100' 
                    : 'bg-[#d0ad66]/20'
                }`}></div>
              </div>
            </div>
            
            {/* Elegant Vehicle Showcase */}
            {brand.vehicles && brand.vehicles.length > 0 && (
              <div className="mt-20">
                <div className="text-left mb-12">
                  <h3 className={`text-3xl font-bold ${index % 3 === 0 ? 'text-gray-900' : 'text-white'} mb-4`}>
                    {brand.name} Vehicles
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {brand.vehicles.slice(0, 6).map((vehicle: any, vehicleIndex: number) => (
                    <div 
                      key={vehicle._id}
                      className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                    >
                      {/* Vehicle Image */}
                      <div className="aspect-[4/3] relative overflow-hidden">
                        {vehicle.coverImage?.asset?._ref ? (
                          <Image
                            src={urlForImage(vehicle.coverImage)?.width(800).height(600).fit('crop').auto('format').url() || ''}
                            alt={vehicle.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                            <span className="text-gray-500 text-sm">No image available</span>
                          </div>
                        )}
                        
                        {/* Elegant Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        {/* Vehicle Title Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                          <h4 className="text-white text-lg font-semibold mb-2 line-clamp-2">
                            {vehicle.title}
                          </h4>
                          <div className="flex items-center justify-between text-sm text-gray-300">
                            <span>{vehicle.modelYear}</span>
                            <span className="capitalize">{vehicle.vehicleType}</span>
                          </div>
                        </div>
                        
                        {/* Brand Accent Line */}
                        <div className={`absolute top-4 left-4 w-1 h-12 ${brandColors.accent} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                      </div>
                      
                      {/* Elegant Card Footer */}
                      <div className={`p-6 ${index % 3 === 0 ? 'bg-white' : 'bg-gray-900/50 backdrop-blur-sm'}`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className={`font-semibold ${index % 3 === 0 ? 'text-gray-900' : 'text-white'} text-sm mb-1`}>
                              {vehicle.model}
                            </h5>
                            <p className={`text-xs ${index % 3 === 0 ? 'text-gray-600' : 'text-gray-400'}`}>
                              {vehicle.trim || 'Premium Package'}
                            </p>
                          </div>
                          <div className={`w-8 h-8 rounded-full ${brandColors.bg} flex items-center justify-center`}>
                            <div className={`w-3 h-3 rounded-full ${brandColors.accent}`}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
        )
      })}
    </div>
  )
}
