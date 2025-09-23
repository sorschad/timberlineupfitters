import type {Metadata} from 'next'
import {notFound} from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

import {sanityFetch} from '@/sanity/lib/live'
import {client} from '@/sanity/lib/client'
import {manufacturerQuery, manufacturerSlugs} from '@/sanity/lib/queries'
import Breadcrumb from '@/app/components/Breadcrumb'
import ManufacturerHero from '@/app/components/ManufacturerHero'
import VehicleShowcase from '@/app/components/VehicleShowcase'
import SpecsTable from '@/app/components/SpecsTable'
import GallerySection from '@/app/components/GallerySection'
import CtaSection from '@/app/components/CtaSection'

type Props = {
  params: Promise<{slug: string}>
}

/**
 * Generate the static params for the page.
 */
export async function generateStaticParams() {
  const manufacturers = await client.fetch(manufacturerSlugs)

  return manufacturers?.map((manufacturer: any) => ({
    slug: manufacturer.slug,
  })) || []
}

/**
 * Generate metadata for the page.
 */
export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const {data: manufacturer} = await sanityFetch({
    query: manufacturerQuery,
    params,
  })

  if (!manufacturer) {
    return {
      title: 'Manufacturer Not Found',
    }
  }

  return {
    title: manufacturer.seoTitle || `${manufacturer.name} Vehicles`,
    description: manufacturer.seoDescription || manufacturer.description || `Explore ${manufacturer.name} vehicles and packages available through Timberline Upfitters.`,
    openGraph: {
      images: manufacturer.seoImage ? [manufacturer.seoImage.asset.url] : [],
    },
  }
}

export default async function ManufacturerPage(props: Props) {
  const params = await props.params
  const {data: manufacturer} = await sanityFetch({
    query: manufacturerQuery,
    params,
  })

  if (!manufacturer) {
    notFound()
  }

  // Group vehicles by model and upfitter
  const groupedVehicles = manufacturer.vehicles?.reduce((acc: any, vehicle: any) => {
    const key = `${vehicle.model}-${vehicle.upfitter || 'base'}`
    if (!acc[key]) {
      acc[key] = {
        model: vehicle.model,
        upfitter: vehicle.upfitter,
        vehicles: []
      }
    }
    acc[key].vehicles.push(vehicle)
    return acc
  }, {}) || {}

  const vehicleGroups = Object.values(groupedVehicles)

  return (
    <div className="min-h-screen">
      {/* Breadcrumb Navigation */}
      <Breadcrumb 
        items={[
          { label: 'Home', href: '/' },
          { label: 'Manufacturers', href: '/manufacturers' },
          { label: manufacturer.name, href: `/manufacturers/${manufacturer.slug}` }
        ]} 
      />

      {/* Hero Section */}
      <ManufacturerHero manufacturer={manufacturer} />

      {/* Vehicle Showcase Sections */}
      {vehicleGroups.map((group: any, index: number) => (
        <VehicleShowcase 
          key={`${group.model}-${group.upfitter}`}
          group={group}
          index={index}
          manufacturer={manufacturer}
        />
      ))}

      {/* Interactive Specs Table */}
      <SpecsTable vehicles={manufacturer.vehicles} manufacturer={manufacturer} />

      {/* Gallery Section */}
      <GallerySection manufacturer={manufacturer} />

      {/* Final CTA Section */}
      <CtaSection manufacturer={manufacturer} />
    </div>
  )
}
