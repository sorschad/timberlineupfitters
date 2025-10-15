'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Vehicle {
  _id: string
  title: string
  slug: any
  model: string
  vehicleType: string
  modelYear: number
  upfitter?: string
  package?: string
  manufacturer: string
}

interface SpecsTableProps {
  vehicles: Vehicle[]
  manufacturer: any
}

type SpecCategory = 'all' | 'performance' | 'features' | 'dimensions'

const specCategories: { [key in SpecCategory]: string } = {
  all: 'All Specs',
  performance: 'Performance',
  features: 'Features',
  dimensions: 'Dimensions'
}

const specs = [
  { key: 'model', label: 'Model', category: 'all' as SpecCategory },
  { key: 'package', label: 'Package', category: 'all' as SpecCategory },
  { key: 'upfitter', label: 'Upfitter', category: 'features' as SpecCategory },
  { key: 'vehicleType', label: 'Type', category: 'all' as SpecCategory },
  { key: 'modelYear', label: 'Year', category: 'all' as SpecCategory },
  { key: 'horsepower', label: 'Horsepower', category: 'performance' as SpecCategory },
  { key: 'torque', label: 'Torque', category: 'performance' as SpecCategory },
  { key: 'towing', label: 'Towing Capacity', category: 'performance' as SpecCategory },
  { key: 'payload', label: 'Payload', category: 'performance' as SpecCategory },
  { key: 'mpg', label: 'MPG', category: 'performance' as SpecCategory },
  { key: 'bedLength', label: 'Bed Length', category: 'dimensions' as SpecCategory },
  { key: 'groundClearance', label: 'Ground Clearance', category: 'dimensions' as SpecCategory },
]

export default function SpecsTable({ vehicles, manufacturer }: SpecsTableProps) {
  const [selectedCategory, setSelectedCategory] = useState<SpecCategory>('all')
  const [highlightedSpec, setHighlightedSpec] = useState<string | null>(null)

  const filteredSpecs = specs.filter(spec => 
    selectedCategory === 'all' || spec.category === selectedCategory
  )

  const getSpecValue = (vehicle: Vehicle, specKey: string) => {
    switch (specKey) {
      case 'model':
        return vehicle.model
      case 'package':
        return vehicle.package || 'Base'
      case 'upfitter':
        return vehicle.upfitter || '-'
      case 'vehicleType':
        return vehicle.vehicleType.toUpperCase()
      case 'modelYear':
        return vehicle.modelYear.toString()
      case 'horsepower':
        return '450 HP' // Mock data
      case 'torque':
        return '510 lb-ft' // Mock data
      case 'towing':
        return '11,000 lbs' // Mock data
      case 'payload':
        return '2,000 lbs' // Mock data
      case 'mpg':
        return '18/24' // Mock data
      case 'bedLength':
        return '5.5 ft' // Mock data
      case 'groundClearance':
        return '9.8 in' // Mock data
      default:
        return '-'
    }
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {manufacturer.name} Vehicle Specifications
          </h2>
          <p className="text-xl text-gray-600">
            Compare specifications across all {manufacturer.name} packages
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {Object.entries(specCategories).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key as SpecCategory)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                selectedCategory === key
                  ? 'bg-timberline-orange text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Specs Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">
                    Specification
                  </th>
                  {vehicles.map((vehicle) => (
                    <th 
                      key={vehicle._id}
                      className="px-6 py-4 text-center font-semibold text-gray-900 min-w-[200px]"
                    >
                      <div className="space-y-2">
                        <div className="text-lg font-bold">
                          {vehicle.package || 'Base'}
                        </div>
                        <div className="text-sm text-gray-600">
                          {vehicle.upfitter && `${vehicle.upfitter} Package`}
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredSpecs.map((spec, index) => (
                  <tr 
                    key={spec.key}
                    className={`border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200 ${
                      highlightedSpec === spec.key ? 'bg-timberline-orange/10' : ''
                    }`}
                    onClick={() => setHighlightedSpec(highlightedSpec === spec.key ? null : spec.key)}
                  >
                    <td className="px-6 py-4 font-semibold text-gray-900 cursor-pointer">
                      {spec.label}
                    </td>
                    {vehicles.map((vehicle) => (
                      <td 
                        key={vehicle._id}
                        className="px-6 py-4 text-center text-gray-700"
                      >
                        {getSpecValue(vehicle, spec.key)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <button className="bg-timberline-orange hover:bg-timberline-orange/90 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
            Download Full Specs
          </button>
          <Link
            href="/contact"
            className="bg-white hover:bg-gray-50 text-gray-900 px-8 py-4 rounded-full font-semibold transition-all duration-300 border border-gray-200 text-center"
          >
            Contact for Custom Quote
          </Link>
        </div>
      </div>
    </section>
  )
}
