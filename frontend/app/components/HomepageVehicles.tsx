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
    logo?: any
  }
  coverImage?: any
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
    <section id="vehicles-section" className="w-full dark:bg-mountain-beige/45 py-20 lg:py-32 relative overflow-hidden">
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
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-6">
            Vehicle Showcase
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Explore our comprehensive collection of premium vehicles, each meticulously selected and customized for your specific needs and adventures.
          </p>
        </div>

        {/* Vehicles Grid by Manufacturer */}
        <div className="space-y-16">
          {Object.entries(vehiclesByManufacturer).map(([manufacturerName, manufacturerVehicles]: [string, any], manufacturerIndex: number) => (
            <div key={manufacturerName} className="space-y-8 animate-fade-in-up" style={{animationDelay: `${manufacturerIndex * 0.2}s`}}>
              {/* Manufacturer Header */}
              <div className="flex flex-row items-center justify-center gap-4 mb-8">
                <div className="w-full h-0.5 bg-black/90"></div>
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 uppercase">{manufacturerName}</h3>
                <div className="w-full h-0.5 bg-black/90"></div>
              </div>

              {/* Vehicles Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {manufacturerVehicles.slice(0, 8).map((vehicle: Vehicle, index: number) => (
                  <Link
                    key={vehicle._id}
                    href={`/vehicles/${vehicle.slug.current}`}
                    className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-200 hover:border-[#ff6a00]/30 animate-fade-in-up"
                    style={{animationDelay: `${(manufacturerIndex * 0.2) + (index * 0.1)}s`}}
                  >
                    {/* Vehicle Image */}
                    <div className="relative h-48 overflow-hidden">
                      {vehicle.coverImage?.asset?.url ? (
                        <Image
                          src={vehicle.coverImage.asset.url}
                          alt={vehicle.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-3 mx-auto">
                              <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                            <span className="text-gray-500 text-sm font-medium">Vehicle Image</span>
                          </div>
                        </div>
                      )}
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Year Badge */}
                      <div className="absolute top-3 left-3 bg-[#ff6a00] text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                        {vehicle.modelYear}
                      </div>
                      
                      {/* Vehicle Type Badge */}
                      {vehicle.vehicleType && (
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1 rounded-full text-xs font-semibold capitalize shadow-lg">
                          {vehicle.vehicleType}
                        </div>
                      )}
                    </div>

                    {/* Vehicle Content */}
                    <div className="p-6">
                      <div className="space-y-3">
                        {/* Vehicle Title */}
                        <h4 className="text-lg font-bold text-gray-900 group-hover:text-[#ff6a00] transition-colors duration-300 line-clamp-2">
                          {vehicle.title}
                        </h4>
                        
                        {/* Manufacturer & Model */}
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="font-medium">{vehicle.manufacturer.name}</span>
                          <span className="text-gray-400">•</span>
                          <span>{vehicle.model}</span>
                        </div>
                        
                        {/* Trim */}
                        {vehicle.trim && (
                          <p className="text-sm text-gray-500">
                            {vehicle.trim} Trim
                          </p>
                        )}
                        
                        {/* Key Specifications */}
                        {vehicle.specifications && (
                          <div className="space-y-2 pt-2 border-t border-gray-100">
                            {vehicle.specifications.towingCapacity && (
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Towing:</span>
                                <span className="font-semibold text-gray-900">{vehicle.specifications.towingCapacity.toLocaleString()} lbs</span>
                              </div>
                            )}
                            {vehicle.specifications.payloadCapacity && (
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Payload:</span>
                                <span className="font-semibold text-gray-900">{vehicle.specifications.payloadCapacity.toLocaleString()} lbs</span>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Tags */}
                        {vehicle.tags && vehicle.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-2">
                            {vehicle.tags.slice(0, 2).map((tag, idx) => (
                              <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                                {tag}
                              </span>
                            ))}
                            {vehicle.tags.length > 2 && (
                              <span className="text-gray-400 text-xs">
                                +{vehicle.tags.length - 2} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* CTA */}
                      <div className="mt-6 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <span className="text-[#ff6a00] font-semibold text-sm group-hover:text-[#5a3e2b] transition-colors duration-300">
                            View Details →
                          </span>
                          {vehicle.inventory?.availability && (
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
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
