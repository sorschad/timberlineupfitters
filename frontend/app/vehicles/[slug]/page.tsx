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
              {/* Main Headline */}
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                {vehicle.title}
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

      {/* Gallery Section - Masonry Grid */}
      {vehicle.gallery && vehicle.gallery.length > 0 && (
        <section className="py-8 pb-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
              {vehicle.gallery.map((image: any, idx: number) => {
                // Create varied aspect ratios for masonry effect
                const aspectRatios = ['aspect-square', 'aspect-[4/3]', 'aspect-[3/4]', 'aspect-[16/9]', 'aspect-[9/16]']
                const aspectClass = aspectRatios[idx % aspectRatios.length]
                
                return (
                  <div key={idx} className={`relative ${aspectClass} rounded-md overflow-hidden shadow-lg break-inside-avoid mb-6 hover:shadow-xl transition-shadow duration-300`}>
                    {image.asset && image.asset.url ? (
                      <Image
                        src={image.asset.url}
                        alt={image.alt || `${vehicle.title} Gallery Image ${idx + 1}`}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">No Image</span>
                      </div>
                    )}
                    {image.caption && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white p-4">
                        <p className="text-sm font-medium">{image.caption}</p>
                      </div>
                    )}
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all duration-300 rounded-md" />
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
