'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

interface SalesRepresentative {
  _id: string
  name: string
  territoryRegion: string
  territoryZipCodes: string[]
  email: string
  phone: {
    countryCode: string
    number: string
    extension?: string
  }
  mobile?: {
    countryCode: string
    number: string
    extension?: string
  }
  fax?: {
    countryCode: string
    number: string
    extension?: string
  }
  profileImage?: {
    asset: {
      url: string
    }
    alt?: string
  }
  bio?: string
  specialties?: string[]
}

interface SalesRepresentativeSearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SalesRepresentativeSearchModal({ isOpen, onClose }: SalesRepresentativeSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState<SalesRepresentative[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
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

  const searchRepresentatives = async (query: string) => {
    if (!query.trim()) {
      setResults([])
      setHasSearched(false)
      return
    }

    setIsLoading(true)
    setHasSearched(true)

    try {
      const response = await fetch('/api/sales-representatives', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: query.trim() }),
      })

      if (response.ok) {
        const data = await response.json()
        setResults(data.representatives || [])
      } else {
        console.error('Search failed')
        setResults([])
      }
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    searchRepresentatives(searchQuery)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    
    // Debounced search
    const timeoutId = setTimeout(() => {
      if (value.trim()) {
        searchRepresentatives(value)
      } else {
        setResults([])
        setHasSearched(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }

  const formatPhoneNumber = (phone: { countryCode: string; number: string; extension?: string }) => {
    const { countryCode, number, extension } = phone
    const formatted = `${countryCode} ${number}`
    return extension ? `${formatted} ext. ${extension}` : formatted
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold">Find Your Sales Representative</h2>
                <p className="text-[rgba(255,255,255,0.8)]">Search by location to find nearby representatives</p>
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
          <form onSubmit={handleSearch} className="relative">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={handleInputChange}
                  placeholder="Enter zip code, city, or state..."
                  className="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-4 focus:ring-[#d4852b]/30 focus:border-[#d4852b] focus:outline-none transition-all"
                />
                {isLoading && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <div className="w-5 h-5 border-2 border-[#d4852b] border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3 bg-gradient-to-r from-[#d4852b] to-[#f36f21] text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {!hasSearched && !isLoading && (
            <div className="p-8 text-center text-gray-500">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-lg">Enter your location to find sales representatives</p>
            </div>
          )}

          {isLoading && (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-4 border-[#d4852b] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Searching for representatives...</p>
            </div>
          )}

          {hasSearched && !isLoading && results.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709" />
                </svg>
              </div>
              <p className="text-lg">No representatives found for that location</p>
              <p className="text-sm text-gray-400 mt-2">Try searching with a different zip code or city</p>
            </div>
          )}

          {results.length > 0 && (
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {results.length} Representative{results.length !== 1 ? 's' : ''} Found
                </h3>
              </div>
              <div className="space-y-4">
                {results.map((rep) => (
                  <div key={rep._id} className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      {/* Profile Image */}
                      <div className="w-16 h-16 bg-gradient-to-br from-[#d4852b] to-[#f36f21] rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        {rep.profileImage ? (
                          <Image 
                            src={rep.profileImage.asset.url} 
                            alt={rep.profileImage.alt || rep.name}
                            width={64}
                            height={64}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          rep.name.split(' ').map(n => n[0]).join('').toUpperCase()
                        )}
                      </div>

                      {/* Representative Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xl font-semibold text-gray-900 mb-1">{rep.name}</h4>
                        <p className="text-[#d4852b] font-medium mb-2">{rep.territoryRegion}</p>
                        
                        {rep.bio && (
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{rep.bio}</p>
                        )}

                        {/* Contact Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <a 
                              href={`mailto:${rep.email}`}
                              className="text-[#d4852b] hover:text-[#f36f21] transition-colors"
                            >
                              {rep.email}
                            </a>
                          </div>

                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <a 
                              href={`tel:${rep.phone.countryCode}${rep.phone.number}`}
                              className="text-[#d4852b] hover:text-[#f36f21] transition-colors"
                            >
                              {formatPhoneNumber(rep.phone)}
                            </a>
                          </div>

                          {rep.mobile && (
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                              <a 
                                href={`tel:${rep.mobile.countryCode}${rep.mobile.number}`}
                                className="text-[#d4852b] hover:text-[#f36f21] transition-colors"
                              >
                                Mobile: {formatPhoneNumber(rep.mobile)}
                              </a>
                            </div>
                          )}

                          {rep.fax && (
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <span className="text-gray-600">
                                Fax: {formatPhoneNumber(rep.fax)}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Specialties */}
                        {rep.specialties && rep.specialties.length > 0 && (
                          <div className="mt-3">
                            <div className="flex flex-wrap gap-2">
                              {rep.specialties.map((specialty, index) => (
                                <span 
                                  key={index}
                                  className="px-3 py-1 bg-[#d4852b]/10 text-[#d4852b] text-xs font-medium rounded-full"
                                >
                                  {specialty}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
