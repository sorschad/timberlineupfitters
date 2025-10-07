import Link from 'next/link'
import Image from 'next/image'
import {sanityFetch} from '@/sanity/lib/live'
import {allVehiclesQuery} from '@/sanity/lib/queries'

interface Vehicle {
  _id: string
  title: string
  slug: { current: string }
  model: string
  vehicleType: string | null
  modelYear: number
  trim?: string | null
  manufacturer: {
    _id: string
    name: string
    logo?: {
      asset?: {
        _id: string
        url: string
      }
    }
  }
  coverImage?: {
    asset?: {
      _id: string
      url: string
    }
  }
  specifications?: any
  features?: any
  inventory?: any
  tags?: string[] | null
}

export const HomepageVehicles = async () => {
  const {data: vehicles} = await sanityFetch({
    query: allVehiclesQuery,
    perspective: 'published',
    stega: false,
  })

  if (!vehicles || vehicles.length === 0) {
    return null
  }

  // Debug: Log the first vehicle to check image data structure
  if (vehicles.length > 0) {
    console.log('First vehicle coverImage:', vehicles[0].coverImage)
  }

  // Group vehicles by manufacturer for better organization
  const vehiclesByManufacturer = vehicles.reduce((acc: any, vehicle: Vehicle) => {
    const manufacturer = vehicle.manufacturer?.name || 'Unknown Manufacturer'
    if (!acc[manufacturer]) {
      acc[manufacturer] = []
    }
    acc[manufacturer].push(vehicle)
    return acc
  }, {})

  return (
    <section id="vehicles-section" className="w-full bg-gradient-to-br from-gray-900 via-gray-800 to-black py-20 lg:py-32 relative overflow-hidden">
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
            Vehicle Showcase
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Explore our comprehensive collection of premium vehicles, each meticulously selected and customized for your specific needs and adventures.
          </p>
        </div>

        {/* Vehicles Grid by Manufacturer */}
        <div className="space-y-16">
          {Object.entries(vehiclesByManufacturer).map(([manufacturerName, manufacturerVehicles]: [string, any], manufacturerIndex: number) => (
            <div key={manufacturerName} className="space-y-8 animate-fade-in-up" style={{animationDelay: `${manufacturerIndex * 0.2}s`}}>
              {/* Manufacturer Header */}
              <div className="flex flex-row items-center justify-center gap-4 mb-8">
                <div className="w-full h-0.5 bg-white/20"></div>
                <div className="flex items-center gap-3">
                  {manufacturerVehicles[0]?.manufacturer?.logo?.asset?.url && (
                    <div className="flex-shrink-0">
                      <Image
                        src={manufacturerVehicles[0].manufacturer.logo.asset.url}
                        alt={`${manufacturerName} Logo`}
                        width={32}
                        height={32}
                        className="object-contain"
                      />
                    </div>
                  )}
                  <h3 className="text-2xl lg:text-3xl font-bold text-white uppercase">{manufacturerName}</h3>
                </div>
                <div className="w-full h-0.5 bg-white/20"></div>
              </div>

              {/* Vehicles Grid - Compact Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {manufacturerVehicles.slice(0, 8).map((vehicle: Vehicle, index: number) => (
                  <Link
                    key={vehicle._id}
                    href={`/vehicles/${vehicle.slug.current}`}
                    className="group flex-1 bg-white/8 backdrop-blur-sm rounded-2xl border border-white/15 hover:bg-white/12 hover:border-white/25 hover:shadow-xl hover:shadow-black/20 transition-all duration-500 overflow-hidden h-[280px] sm:h-[87px] animate-fade-in-up"
                    style={{animationDelay: `${(manufacturerIndex * 0.2) + (index * 0.1)}s`}}
                  >
                    <div className="flex flex-col sm:grid sm:grid-cols-[1fr_0.8fr] h-[280px] sm:h-[87px]">
                      {/* Left Section - Text Content */}
                      <div className="flex flex-col justify-center gap-2 p-3 sm:p-2">
                        <div>
                          {/* Vehicle Title */}
                          <h3 className="text-white text-xs sm:text-sm font-bold mb-1 group-hover:text-[#ff8c42] transition-colors duration-300 leading-tight">
                            {vehicle.title}
                          </h3>
                          
                          {/* Vehicle Details */}
                          <div className="text-white/60 text-xs leading-tight">
                            {vehicle?.model && (
                              <span className="block">{vehicle.model}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Right Section - Vehicle Image */}
                      <div className="relative h-[280px] sm:h-[87px]">
                        <div className="h-[280px] sm:h-[87px] overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 group-hover:border-[#ff8c42]/30 transition-all duration-300">
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
                    View All {manufacturerName} Vehicles
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
