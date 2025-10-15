import type {Metadata} from 'next'
import Image from 'next/image'
import Link from 'next/link'
import BrandsLandingPageHeader from '@/app/components/BrandsLandingPageHeader'
import PortableText from '@/app/components/PortableText'
import InventoryStatusBadge from '@/app/components/InventoryStatusBadge'
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
  const sortedBrands = brands?.sort((a: any, b: any) => {
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
  const brandsWithVehicles = sortedBrands?.map((brand: any) => {
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

  const getBrandSectionClass = (brand: any, index: number) => {
    // Use background color if available, otherwise fall back to default pattern
    if (brand.backgroundColor) {
      return `py-20 lg:py-32 text-white`
    }
    
    // Fallback to original pattern if no background color
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

  const getBrandSectionStyle = (brand: any) => {
    if (brand.backgroundColor) {
      return { backgroundColor: `#${brand.backgroundColor}` }
    }
    // Fallback to bg-stone with 20% opacity if no background color
    return { backgroundColor: 'rgba(120, 113, 108, 0.2)' }
  }

  const getBrandGradientClass = (brandColors: any) => {
    return `animate-gradient bg-gradient-to-r ${brandColors.primaryGradientFromTo} bg-clip-text text-transparent`
  }

  const getBrandLineClass = (brandColors: any) => {
    return `w-full h-1 bg-gradient-to-r ${brandColors.primaryGradientFromTo} rounded-full`
  }

  // Utility function to convert hex to RGB values
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }

  // Utility function to get brand colors with fallbacks
  const getBrandColors = (brand: any) => {
    // Ensure colors have # prefix for proper hex format
    const primaryColor = brand.primaryColor ? (brand.primaryColor.startsWith('#') ? brand.primaryColor : `#${brand.primaryColor}`) : '#3b82f6'
    const secondaryColor = brand.secondaryColor ? (brand.secondaryColor.startsWith('#') ? brand.secondaryColor : `#${brand.secondaryColor}`) : '#06b6d4'
    const accentColor = brand.accentColor ? (brand.accentColor.startsWith('#') ? brand.accentColor : `#${brand.accentColor}`) : primaryColor
    const backgroundColor = brand.backgroundColor ? (brand.backgroundColor.startsWith('#') ? brand.backgroundColor : `#${brand.backgroundColor}`) : '#ffffff'

    const primaryRgb = hexToRgb(primaryColor)
    const secondaryRgb = hexToRgb(secondaryColor)
    const accentRgb = hexToRgb(accentColor)
    const backgroundRgb = hexToRgb(backgroundColor)

    return {
      primaryColor,
      secondaryColor,
      accentColor,
      backgroundColor,
      primaryRgb,
      secondaryRgb,
      accentRgb,
      backgroundRgb,
      // CSS custom properties for dynamic styling
      primaryGradient: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
      primaryGradientFromTo: `from-[${primaryColor}] to-[${secondaryColor}]`,
      primaryText: `text-[${primaryColor}]`,
      secondaryText: `text-[${secondaryColor}]`,
      accentText: `text-[${accentColor}]`,
      primaryBorder: `border-[${primaryColor}]`,
      secondaryBorder: `border-[${secondaryColor}]`,
      accentBorder: `border-[${accentColor}]`,
      primaryBg: `bg-[${primaryColor}]`,
      secondaryBg: `bg-[${secondaryColor}]`,
      accentBg: `bg-[${accentColor}]`,
      // With opacity variants
      primaryBg10: `bg-[${primaryColor}]/10`,
      primaryBg20: `bg-[${primaryColor}]/20`,
      primaryBorder20: `border-[${primaryColor}]/20`,
      accentBg10: `bg-[${accentColor}]/10`,
      accentBg20: `bg-[${accentColor}]/20`,
      accentBorder20: `border-[${accentColor}]/20`,
    }
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Brands Landing Page Header */}
      <BrandsLandingPageHeader />

      {/* Dynamic Brand Sections */}
      {brandsWithVehicles?.map((brand: BrandWithSectionImage & { vehicles: any[] }, index: number) => {
        const brandColors = getBrandColors(brand)
        return (
        <section 
          key={brand._id} 
          id={brand.slug} 
          className={getBrandSectionClass(brand, index)}
          style={{
            ...getBrandSectionStyle(brand),
            '--brand-primary': brandColors.primaryColor,
            '--brand-secondary': brandColors.secondaryColor,
            '--brand-accent': brandColors.accentColor
          } as React.CSSProperties & { 
            '--brand-primary': string
            '--brand-secondary': string
            '--brand-accent': string
          }}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className={`space-y-2 ${index % 2 === 1 ? 'order-1 lg:order-2' : 'animate-fade-in-left'}`}>
                <div className="">
                  <div className="flex items-center gap-4">
                    {brand.primaryLogo?.asset?._ref && (
                      <div className="flex-shrink-0">
                        <Image
                          src={urlForImage(brand.primaryLogo)?.width(brand.primaryLogo.width || 220).height(brand.primaryLogo.height || 220).fit('max').auto('format').url() || ''}
                          alt={brand.primaryLogo.alt || `${brand.name} logo`}
                          width={brand.primaryLogo.width || 220}
                          height={brand.primaryLogo.height || 220}
                          className="object-contain"
                        />
                      </div>
                    )}
                  </div>
                  <div className={getBrandLineClass(brandColors)}></div>
                </div>

                <div 
                  className="text-lg leading-relaxed"
                  style={{ color: brandColors.primaryColor }}
                >
                  {brand.description ? (
                    <div style={{ color: brandColors.primaryColor }}>
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
                        className={`space-y-2 p-4 rounded-lg transition-colors duration-300 ${brandColors.primaryBg10} hover:${brandColors.primaryBg20} ${brandColors.primaryBorder20} border`}
                      >
                        <h4 
                          className="font-semibold font-orbitron"
                          style={{ color: brandColors.primaryColor }}
                        >
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
                  <div 
                    className="absolute inset-0 bg-gradient-to-t via-transparent to-transparent"
                    style={{
                      background: `linear-gradient(to top, ${brandColors.primaryColor}10, transparent, transparent)`
                    }}
                  ></div>
                </div>
                <div 
                  className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full opacity-20 animate-float-bounce"
                  style={{ backgroundColor: `${brandColors.primaryColor}20` }}
                ></div>
                <div 
                  className="absolute -top-6 -left-6 w-24 h-24 rounded-full opacity-30 animate-bounce-slow"
                  style={{ backgroundColor: `${brandColors.secondaryColor}20` }}
                ></div>
              </div>
            </div>
            
            {/* Elegant Vehicle Showcase */}
            {brand.vehicles && brand.vehicles.length > 0 && (
              <div className="mt-12">
                <div className="text-left mb-3">
                  
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {brand.vehicles.slice(0, 6).map((vehicle: any, vehicleIndex: number) => (
                    <Link
                      key={vehicle._id}
                      href={`/vehicles/${(vehicle as any).slug?.current}`}
                      className="group flex-1 backdrop-blur-sm transition-all duration-500"
                    >
                      <div className="flex flex-col flex-col-reverse sm:grid sm:grid-cols-[1fr_0.8fr] h-[230px] sm:h-[187px]">
                        {/* Left Section - Text Content */}
                        <div className="flex flex-col justify-center gap-2 p-3 sm:p-2">
                          <div>
                            {/* Vehicle Title */}
                            <h3 
                              className="text-xs sm:text-md md:text-lg font-bold font-orbitron mb-1 transition-colors duration-300 leading-tight"
                              style={{ color: brandColors.primaryColor }}
                            >
                              {vehicle.title}
                            </h3>
                            
                            {/* Vehicle Details */}
                            <div className="text-xs leading-tight font-lato" style={{ color: `${brandColors.accentColor}70` }}>
                              {vehicle?.model && (
                                <span className="block">{vehicle.model}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* Right Section - Vehicle Image */}
                        <div className="relative h-[180px] sm:h-[187px]">
                          {/* Inventory Status Badge */}
                          <InventoryStatusBadge availability={vehicle.inventory?.availability} />
                          
                          <div className="h-auto sm:h-[187px] transition-all duration-300">
                            {vehicle?.coverImage?.asset?.url ? (
                              <img 
                                src={vehicle.coverImage.asset.url} 
                                alt={vehicle.title}
                                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
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
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                      </div>
                    </Link>
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
