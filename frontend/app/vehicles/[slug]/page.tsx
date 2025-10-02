import type {Metadata} from 'next'
import Link from 'next/link'
import Image from 'next/image'
import {notFound} from 'next/navigation'

import {sanityFetch} from '@/sanity/lib/live'
import {client} from '@/sanity/lib/client'
import {vehicleQuery, vehicleSlugs} from '@/sanity/lib/queries'
import Breadcrumb from '@/app/components/Breadcrumb'
import SpecsTable from '@/app/components/SpecsTable'
import VehicleFeaturesGallery from '@/app/components/VehicleFeaturesGallery'
// @ts-expect-error - FeaturesAndOptionsSection module may be missing or not typed
import FeaturesAndOptionsSection from '@/app/components/FeaturesAndOptionsSection'
import VehiclePageClient from './VehiclePageClient'
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
      {/* Main Vehicle Page with Filtering */}
      <VehiclePageClient vehicle={vehicle} />

      {/* Features & Options Section */}
      <FeaturesAndOptionsSection features={vehicle.features} />
      
      {/* Features Gallery Section */}
      <VehicleFeaturesGallery vehicle={vehicle} />
    </div>
  )
}
