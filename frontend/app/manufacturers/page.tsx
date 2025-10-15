import type {Metadata} from 'next'
import Link from 'next/link'
import Image from 'next/image'

import {sanityFetch} from '@/sanity/lib/live'
import {client} from '@/sanity/lib/client'
import {allManufacturersQuery} from '@/sanity/lib/queries'
import Breadcrumb from '@/app/components/Breadcrumb'

interface Manufacturer {
  _id: string
  name: string
  slug: { current: string }
  logo?: any
  vehicleCount: number
}

/**
 * Generate metadata for the page.
 */
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Manufacturers',
    description: 'Explore vehicles from top manufacturers including Ford, Ram, and Jeep. Find the perfect vehicle for your needs.',
  }
}

export default async function ManufacturersPage() {
  const manufacturers = await client.fetch(allManufacturersQuery)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-40 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <div className="container text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-6">
            Our Manufacturers
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            Partnering with industry leaders to bring you the finest vehicles, 
            customized for your specific needs and adventures.
          </p>
        </div>
      </section>

      {/* Breadcrumb Navigation */}
      <Breadcrumb 
        items={[
          { label: 'Home', href: '/' },
          { label: 'Manufacturers', href: '/manufacturers' }
        ]} 
      />

      {/* Manufacturers Grid */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {manufacturers?.map((manufacturer: Manufacturer) => (
              <Link
                key={manufacturer._id}
                href={`/manufacturers/${manufacturer.slug.current}`}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden border border-gray-200"
              >
                <div className="aspect-video relative bg-gray-100">
                  {manufacturer.logo ? (
                    <Image
                      src={manufacturer.logo.asset.url}
                      alt={`${manufacturer.name} Logo`}
                      fill
                      className="object-contain p-8"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <span className="text-4xl font-bold text-gray-400">
                        {manufacturer.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-timberline-orange transition-colors duration-300">
                    {manufacturer.name}
                  </h3>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-600">
                      {manufacturer.vehicleCount} Vehicle{manufacturer.vehicleCount !== 1 ? 's' : ''}
                    </span>
                    <span className="text-timberline-orange font-semibold">
                      View Details →
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm">
                    Explore {manufacturer.name} vehicles and packages designed for every adventure.
                  </p>
                </div>
              </Link>
            ))}
          </div>
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
