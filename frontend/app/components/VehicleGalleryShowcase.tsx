'use client'

import VehiclePerformanceSection from './VehiclePerformanceSection'
import VehicleOffRoadSection from './VehicleOffRoadSection'
import VehicleLuxurySection from './VehicleLuxurySection'

interface Vehicle {
  _id: string
  title: string
}

interface VehicleGalleryShowcaseProps {
  vehicle: Vehicle
}

export default function VehicleGalleryShowcase({ vehicle }: VehicleGalleryShowcaseProps) {
  return (
    <div className="bg-black py-20 border-t-4 border-orange-600">
      <div className="max-w-7xl mx-auto px-8">
        
        <div className="space-y-8">
          {/* <VehiclePerformanceSection vehicle={vehicle} /> */}
          {/* <VehicleOffRoadSection vehicle={vehicle} /> */}
          {/* <VehicleLuxurySection vehicle={vehicle} /> */}
        </div>
      </div>
    </div>
  )
}
