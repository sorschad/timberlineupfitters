import type {Metadata} from 'next'
import Link from 'next/link'
import Image from 'next/image'
import {notFound} from 'next/navigation'

import {sanityFetch} from '@/sanity/lib/live'
import {client} from '@/sanity/lib/client'
import {vehicleQuery, vehicleSlugs} from '@/sanity/lib/queries'
import Breadcrumb from '@/app/components/Breadcrumb'
import SpecsTable from '@/app/components/SpecsTable'

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

interface VehiclePageProps {
  params: {
    slug: string
  }
}

/**
 * Generate metadata for the page.
 */
export async function generateMetadata({params}: VehiclePageProps): Promise<Metadata> {
  const vehicle = await client.fetch(vehicleQuery, {slug: params.slug}) as Vehicle | null
  
  if (!vehicle) {
    return {
      title: 'Vehicle Not Found',
    }
  }

  return {
    title: vehicle.seo?.metaTitle || vehicle.title,
    description: vehicle.seo?.metaDescription || `Explore the ${vehicle.title} - ${vehicle.manufacturer.name} ${vehicle.model} ${vehicle.modelYear}. Find specifications, features, and customization options.`,
  }
}

/**
 * Generate static params for all vehicle slugs.
 */
export async function generateStaticParams() {
  const slugs = await client.fetch(vehicleSlugs)
  return slugs.map((slug: any) => ({
    slug: slug.slug,
  }))
}

export default async function VehiclePage({params}: VehiclePageProps) {
  const vehicle = await client.fetch(vehicleQuery, {slug: params.slug}) as Vehicle | null

  if (!vehicle) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section - Scenic Background with Vehicle */}
      <section 
        className="relative min-h-screen text-white overflow-hidden"
        style={{
          backgroundImage: vehicle.coverImage && vehicle.coverImage.asset && vehicle.coverImage.asset.url ? `url(${vehicle.coverImage.asset.url})` : 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #1d4ed8 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-black/50" />
        
        <div className="relative z-10 container mx-auto px-4 pt-20 pb-40">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            {/* Left Content */}
            <div className="space-y-8">
              {/* Vehicle Type Badge */}
              <div className="text-lg text-white/90 font-medium">
                2026 {vehicle.vehicleType}*
              </div>
              
              {/* Main Headline */}
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                Built for life.<br />
                Feels like comfort
              </h1>
              
              {/* Subtitle */}
              <p className="text-xl text-white/90 max-w-lg">
                New all electric crossover with long range for road trips and comfort.
              </p>
              
              {/* CTA Button */}
              <button className="bg-white text-black px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/90 transition-all duration-300 shadow-lg">
                Explore
              </button>
            </div>
            
            {/* Right Content - Vehicle Image */}
            <div className="relative flex justify-center lg:justify-end">
              {vehicle.coverImage && vehicle.coverImage.asset && vehicle.coverImage.asset.url ? (
                <div className="relative">
                  <Image
                    src={vehicle.coverImage.asset.url}
                    alt={vehicle.title}
                    width={600}
                    height={400}
                    className="rounded-2xl shadow-2xl"
                  />
                  {/* Range Badge */}
                  <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm">
                    Range 420 mi⁴
                  </div>
                </div>
              ) : (
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl h-96 w-96 flex items-center justify-center">
                  <span className="text-6xl font-bold text-gray-400">
                    {vehicle.manufacturer.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {/* Data Cards Overlay */}
          <div className="absolute bottom-20 left-0 right-0 z-20">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {/* NEW Model Card */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center border border-white/20">
                  <div className="text-sm text-white/70 mb-2">NEW Model</div>
                  <div className="text-2xl font-bold text-white mb-1">Alpha 1</div>
                  <div className="text-xs text-white/60">*sales starting in 2026</div>
                </div>
                
                {/* Starting Price Card */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center border border-white/20">
                  <div className="text-sm text-white/70 mb-2">Starting from</div>
                  <div className="text-2xl font-bold text-white mb-1">$88,990</div>
                  <div className="text-xs text-white/60">Est. $809/mo³</div>
                </div>
                
                {/* Acceleration Card */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center border border-white/20">
                  <div className="text-sm text-white/70 mb-2">Acceleration</div>
                  <div className="text-2xl font-bold text-white mb-1">4.3 sec</div>
                  <div className="text-xs text-white/60">Disclaimer*</div>
                </div>
                
                {/* Torque Card */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center border border-white/20">
                  <div className="text-sm text-white/70 mb-2">Torque</div>
                  <div className="text-2xl font-bold text-white mb-1">413 lb-ft</div>
                  <div className="text-xs text-white/60">Disclaimer*</div>
                </div>
                
                {/* Power Card */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center border border-white/20">
                  <div className="text-sm text-white/70 mb-2">Power</div>
                  <div className="text-2xl font-bold text-white mb-1">266 hp</div>
                  <div className="text-xs text-white/60">Disclaimer*</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interior Features Section - Dark Blue Background */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <h2 className="text-5xl md:text-6xl font-bold leading-tight">
                Comfort in simplicity.<br />
                High-tech for the future of driving
              </h2>
              
              <p className="text-xl text-gray-300 max-w-lg">
                Lorem ipsum dolor sit amet consectetur. Congue ac dictumst nunc eget nunc eros nibh.
              </p>
              
              <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-slate-900 transition-all duration-300">
                Explore
              </button>
            </div>
            
            {/* Right Content - Interior Image with Interactive Elements */}
            <div className="relative">
              {vehicle.gallery && vehicle.gallery.length > 0 ? (
                <div className="relative">
                  <Image
                    src={vehicle.gallery[0].asset.url}
                    alt="Vehicle Interior"
                    width={600}
                    height={400}
                    className="rounded-2xl shadow-2xl"
                  />
                  
                  {/* Interactive Hotspots */}
                  <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-black rounded-full border-2 border-white cursor-pointer hover:scale-125 transition-transform">
                    <div className="absolute top-4 left-4 w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-black rounded-full border-2 border-white cursor-pointer hover:scale-125 transition-transform">
                    <div className="absolute top-4 left-4 w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-black rounded-full border-2 border-white cursor-pointer hover:scale-125 transition-transform">
                    <div className="absolute top-4 left-4 w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  
                  {/* Exterior/Interior Toggle */}
                  <div className="absolute bottom-4 right-4 bg-white/10 backdrop-blur-md rounded-full p-1 border border-white/20">
                    <div className="flex">
                      <button className="px-4 py-2 text-sm font-medium text-slate-900 bg-white rounded-full">
                        Interior
                      </button>
                      <button className="px-4 py-2 text-sm font-medium text-white">
                        Exterior
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl h-96 w-full flex items-center justify-center">
                  <span className="text-6xl font-bold text-gray-400">Interior View</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Feature Cards Row */}
          <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Panoramic Display Feature Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Panoramic display</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Panoramic display with the biggest smart touch display with car controls
              </p>
              <a href="#" className="text-blue-600 underline font-medium">Learn More</a>
            </div>
            
            {/* Additional Feature Cards */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Smart Features</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Advanced AI-powered features for enhanced driving experience
              </p>
              <a href="#" className="text-blue-600 underline font-medium">Learn More</a>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Safety First</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Comprehensive safety systems for peace of mind on every journey
              </p>
              <a href="#" className="text-blue-600 underline font-medium">Learn More</a>
            </div>
          </div>
        </div>
      </section>

      {/* Specifications Section - Clean White Background */}
      {vehicle.specifications && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
              Technical Specifications
            </h2>
            <div className="bg-gray-50 rounded-2xl p-8 max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(vehicle.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center py-4 border-b border-gray-200 last:border-b-0">
                    <span className="text-gray-600 font-medium capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className="text-gray-900 font-semibold">
                      {typeof value === 'number' ? value.toLocaleString() : String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      {vehicle.features && (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
              Features & Amenities
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Object.entries(vehicle.features).map(([category, features]: [string, any]) => (
                <div key={category} className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 capitalize">
                    {category.replace(/([A-Z])/g, ' $1').trim()}
                  </h3>
                  <ul className="space-y-2">
                    {features.map((feature: string, idx: number) => (
                      <li key={idx} className="flex items-center text-gray-600">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mr-3" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery Section */}
      {vehicle.gallery && vehicle.gallery.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
              Image Gallery
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicle.gallery.map((image: any, idx: number) => (
                <div key={idx} className="relative aspect-video rounded-2xl overflow-hidden shadow-lg">
                  {image.asset && image.asset.url ? (
                    <Image
                      src={image.asset.url}
                      alt={image.alt || `${vehicle.title} Gallery Image ${idx + 1}`}
                      fill
                      className="object-cover hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">No Image</span>
                    </div>
                  )}
                  {image.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4">
                      <p className="text-sm">{image.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
 
    </div>
  )
}
