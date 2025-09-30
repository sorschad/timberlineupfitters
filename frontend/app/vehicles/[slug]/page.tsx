import type {Metadata} from 'next'
import Link from 'next/link'
import Image from 'next/image'
import {notFound} from 'next/navigation'

import {sanityFetch} from '@/sanity/lib/live'
import {client} from '@/sanity/lib/client'
import {vehicleQuery, vehicleSlugs} from '@/sanity/lib/queries'
import Breadcrumb from '@/app/components/Breadcrumb'
import SpecsTable from '@/app/components/SpecsTable'
import VehicleGallery from '@/app/components/VehicleGallery'
import VehicleFeaturesGallery from '@/app/components/VehicleFeaturesGallery'
import {urlForImage} from '@/sanity/lib/utils'

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
  headerVehicleImage?: any
  vehicleDetailsPageHeaderBackgroundImage?: any
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
        className="relative max-h-[90vh] text-white overflow-hidden"
        style={{
          backgroundImage: (vehicle.vehicleDetailsPageHeaderBackgroundImage && urlForImage(vehicle.vehicleDetailsPageHeaderBackgroundImage)?.url())
            ? `url(${urlForImage(vehicle.vehicleDetailsPageHeaderBackgroundImage)?.width(1920).height(1080).fit('crop').url()})`
            : (vehicle.coverImage && urlForImage(vehicle.coverImage)?.url())
              ? `url(${urlForImage(vehicle.coverImage)?.width(1920).height(1080).fit('crop').url()})`
              : 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #1d4ed8 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-black/50" />
        
        <div className="relative z-10 container mx-auto px-4 pt-20 pb-40">
          <div className="grid lg:grid-cols-2 gap-12 items-center h-full">
            {/* Left Content */}
            <div className="space-y-8">
              {/* Main Headline */}
              <h1 className="text-3xl md:text-5xl font-bold leading-none">
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
              {(vehicle.headerVehicleImage && urlForImage(vehicle.headerVehicleImage)?.url()) ? (
                <div className="relative">
                  <Image
                    src={urlForImage(vehicle.headerVehicleImage)!.width(1200).height(800).fit('crop').url()}
                    alt={vehicle.title}
                    width={600}
                    height={400}
                    className="rounded-2xl shadow-2xl"
                  />
                </div>
              ) : (vehicle.coverImage && urlForImage(vehicle.coverImage)?.url() ? (
                <div className="relative">
                  <Image
                    src={urlForImage(vehicle.coverImage)!.width(1200).height(800).fit('crop').url()}
                    alt={vehicle.title}
                    width={600}
                    height={400}
                    className="rounded-2xl shadow-2xl"
                  />
                </div>
              ) : (
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl h-96 w-96 flex items-center justify-center">
                  <span className="text-6xl font-bold text-gray-400">
                    {vehicle.manufacturer.name.charAt(0)}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Data Cards Overlay */}
          <div className="absolute bottom-4 left-0 right-0 z-20">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {/* NEW Model Card */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center border border-white/20">
                  <div className="text-base font-bold text-white mb-3 leading-none uppercase">Unique Design</div>
                  <div className="text-sm text-white/70 mb-2 leading-tight font-light">Inspired by the sea, the Ocean build embodies adventure and fun.</div>
                </div>
                
                {/* Starting Price Card */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center border border-white/20">
                  <div className="text-base font-bold text-white mb-3 leading-none uppercase">Sound Performance</div>
                  <div className="text-sm text-white/70 mb-2 leading-tight font-light">Lorem ipsum dolor sit amet, consectetur adipiscing elit</div>
                </div>
                
                {/* Acceleration Card */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center border border-white/20">
                  <div className="text-base font-bold text-white mb-3 leading-none uppercase">Custom Leather Interior</div>
                  <div className="text-sm text-white/70 mb-2 leading-tight font-light">Lorem ipsum dolor sit amet, consectetur adipiscing elit</div>
                </div>
                
                {/* Torque Card */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center border border-white/20">
                  <div className="text-base font-bold text-white mb-3 leading-none uppercase">Off Road Bumpers</div>
                  <div className="text-sm text-white/70 mb-2 leading-tight font-light">Lorem ipsum dolor sit amet, consectetur adipiscing elit</div>
                </div>
                
                {/* Power Card */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center border border-white/20">
                  <div className="text-base font-bold text-white mb-3 leading-none uppercase">Unique Design</div>
                  <div className="text-sm text-white/70 mb-2 leading-tight font-light">Lorem ipsum dolor sit amet, consectetur adipiscing elit</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section - Masonry Grid with Batch Lazy Loading */}
      {vehicle.gallery && vehicle.gallery.length > 0 && (
        <VehicleGallery gallery={vehicle.gallery} vehicleTitle={vehicle.title} />
      )}

      {/* Features Gallery Section */}
      <VehicleFeaturesGallery vehicle={vehicle} />
    </div>
  )
}
