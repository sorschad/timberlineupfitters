'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { urlForImage } from '@/sanity/lib/utils'

interface Vehicle {
  _id: string
  title: string
  slug: { current: string }
  model?: string
  vehicleType?: string
  modelYear?: number
  trim?: string
  coverImage?: {
    asset?: {
      _id: string
      url: string
    }
  }
  manufacturer?: {
    _id: string
    name: string
    logo?: {
      asset?: {
        _id: string
        url: string
      }
    }
  }
}

interface Brand {
  _id: string
  name: string
  slug: { current: string }
  slogan?: string
  logo?: any
}

interface OriginalSearchModalProps {
  isOpen: boolean
  onClose: () => void
  vehicles?: Vehicle[]
  brands?: Brand[]
}

export function OriginalSearchModal({ isOpen, onClose, vehicles = [], brands = [] }: OriginalSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([])
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  // Search functionality
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredVehicles([])
      setFilteredBrands([])
      return
    }

    setIsLoading(true)

    // Debounced search
    const timeoutId = setTimeout(() => {
      const query = searchQuery.toLowerCase().trim()
      
      // Filter vehicles
      const vehicleResults = vehicles.filter(vehicle => 
        vehicle.title.toLowerCase().includes(query) ||
        vehicle.model?.toLowerCase().includes(query) ||
        vehicle.vehicleType?.toLowerCase().includes(query) ||
        vehicle.manufacturer?.name.toLowerCase().includes(query)
      )

      // Filter brands
      const brandResults = brands.filter(brand =>
        brand.name.toLowerCase().includes(query) ||
        brand.slogan?.toLowerCase().includes(query)
      )

      setFilteredVehicles(vehicleResults)
      setFilteredBrands(brandResults)
      setIsLoading(false)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery, vehicles, brands])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#2f3f24] to-[#1e3a2b] text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#d4852b] to-[#f36f21] rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold">Search Vehicles & Brands</h2>
                <p className="text-[rgba(255,255,255,0.8)]">Find vehicles and brands by name, model, or type</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search Form */}
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={handleInputChange}
              placeholder="Search vehicles, brands, models..."
              className="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-4 focus:ring-[#d4852b]/30 focus:border-[#d4852b] focus:outline-none transition-all"
            />
            {isLoading && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="w-5 h-5 border-2 border-[#d4852b] border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {!searchQuery.trim() && (
            <div className="p-8 text-center text-gray-500">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-lg">Enter a search term to find vehicles and brands</p>
            </div>
          )}

          {searchQuery.trim() && !isLoading && filteredVehicles.length === 0 && filteredBrands.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709" />
                </svg>
              </div>
              <p className="text-lg">No results found for "{searchQuery}"</p>
              <p className="text-sm text-gray-400 mt-2">Try searching with different keywords</p>
            </div>
          )}

          {(filteredVehicles.length > 0 || filteredBrands.length > 0) && (
            <div className="p-6">
              {/* Brands Section */}
              {filteredBrands.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Brands ({filteredBrands.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredBrands.map((brand) => (
                      <Link
                        key={brand._id}
                        href={`/brands/${brand.slug.current}`}
                        onClick={onClose}
                        className="block bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {brand.logo && (
                            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                              <img 
                                src={urlForImage(brand.logo)?.url()} 
                                alt={brand.name}
                                className="w-8 h-8 object-contain"
                              />
                            </div>
                          )}
                          <div>
                            <h4 className="font-semibold text-gray-900">{brand.name}</h4>
                            {brand.slogan && (
                              <p className="text-sm text-gray-600">{brand.slogan}</p>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Vehicles Section */}
              {filteredVehicles.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Vehicles ({filteredVehicles.length})
                  </h3>
                  <div className="space-y-3">
                    {filteredVehicles.map((vehicle) => (
                      <Link
                        key={vehicle._id}
                        href={`/vehicles/${vehicle.slug.current}`}
                        onClick={onClose}
                        className="block bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          {vehicle.coverImage?.asset?.url && (
                            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-sm">
                              <img 
                                src={vehicle.coverImage.asset.url} 
                                alt={vehicle.title}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{vehicle.title}</h4>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              {vehicle.manufacturer && (
                                <span>{vehicle.manufacturer.name}</span>
                              )}
                              {vehicle.model && (
                                <>
                                  <span>•</span>
                                  <span>{vehicle.model}</span>
                                </>
                              )}
                              {vehicle.modelYear && (
                                <>
                                  <span>•</span>
                                  <span>{vehicle.modelYear}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
