import type {Metadata} from 'next'
import {client} from '@/sanity/lib/client'
import {allVehiclesQuery} from '@/sanity/lib/queries'
import VehiclesClient from './VehiclesClient'

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
  specifications?: any
  features?: any
  inventory?: any
  tags?: string[]
}

/**
 * Generate metadata for the page.
 */
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Vehicles',
    description: 'Explore our complete inventory of premium vehicles including trucks, SUVs, and utility vehicles. Find the perfect vehicle for your needs.',
  }
}

export default async function VehiclesPage() {
  const vehicles = await client.fetch(allVehiclesQuery)

  // Handle case where no vehicles are found or data structure is different
  if (!vehicles || vehicles.length === 0) {
    return (
      <div className="min-h-screen">
        <div className="py-40 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
          <div className="container text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">
              Vehicle Models
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              No vehicles are currently available. Please check back later or contact us for more information.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return <VehiclesClient vehicles={vehicles} />
}
