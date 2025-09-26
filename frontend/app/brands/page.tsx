import type {Metadata} from 'next'
import {AllBrands} from '@/app/components/Brands'

export const metadata: Metadata = {
  title: 'Brands',
  description: 'Brands we are proud to be a part of. While Timberline Upfitters is our flagship off-road vehicle brand, we\'re proud to provide premier upfit services for the Alpine + RebelX - Ocean and Brigade Edition Jeep Wranglers and Gladiator, TSport F-150 (valor, anthem, sportsman), SuperDuty (valor, anthem, sportsman, and 4x4 Truck).',
}

export default function BrandsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24">
        <div className="text-center mb-12 lg:mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl mb-6">
            Brands
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-4xl mx-auto">
            Brands we are proud to be a part of. While Timberline Upfitters is our flagship off-road vehicle brand, we're proud to provide premier upfit services for the Alpine + RebelX - Ocean and Brigade Edition Jeep Wranglers and Gladiator, TSport F-150 (valor, anthem, sportsman), SuperDuty (valor, anthem, sportsman, and 4x4 Truck).
          </p>
        </div>
        
        <AllBrands />
      </div>
    </div>
  )
}
