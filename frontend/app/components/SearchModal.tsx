"use client"

import { useState, useEffect, useRef, useMemo } from 'react'
import Link from 'next/link'
import { MagnifyingGlassIcon, XMarkIcon, ClockIcon, ChartBarIcon } from '@heroicons/react/24/outline'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
  vehicles?: Array<{
    _id: string
    title?: string
    slug?: { current: string }
    model?: string
    vehicleType?: string
    modelYear?: number
    trim?: string
    coverImage?: { asset?: { url?: string } }
    manufacturer?: { name?: string }
    tags?: string[]
  }>
  brands?: Array<{
    _id: string
    name: string
    slug: { current: string }
    logo?: { asset?: { url?: string } } | any
  }>
}

export default function SearchModal({ isOpen, onClose, vehicles = [], brands = [] }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [debouncedQuery, setDebouncedQuery] = useState('')

  // Debounce query to reduce re-computation
  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(searchQuery.trim()), 150)
    return () => clearTimeout(id)
  }, [searchQuery])

  const results = useMemo(() => {
    const q = debouncedQuery.toLowerCase()
    if (!q) return { vehicles: [], brands: [] }

    // Score helper: prioritize startsWith, then includes; more recent modelYear; then title length
    const scoreText = (text: string) => {
      const t = text.toLowerCase()
      if (t.startsWith(q)) return 2
      if (t.includes(q)) return 1
      return 0
    }

    const vehicleMatches = (vehicles || [])
      .map((v) => {
        const title = v.title || ''
        const model = v.model || ''
        const manufacturer = v.manufacturer?.name || ''
        const tags = Array.isArray(v.tags) ? v.tags.join(' ') : ''
        const combined = `${title} ${model} ${manufacturer} ${tags}`
        const s = scoreText(title) * 3 + scoreText(model) * 2 + scoreText(manufacturer) + scoreText(tags)
        return { v, s, combined }
      })
      .filter(({ combined }) => combined.toLowerCase().includes(q))
      .sort((a, b) => {
        if (b.s !== a.s) return b.s - a.s
        const yearA = a.v.modelYear || 0
        const yearB = b.v.modelYear || 0
        if (yearB !== yearA) return yearB - yearA
        return (a.v.title || '').localeCompare(b.v.title || '')
      })
      .slice(0, 6)
      .map(({ v }) => v)

    const brandMatches = (brands || [])
      .map((b) => ({ b, s: scoreText(b.name) }))
      .filter(({ b }) => b.name.toLowerCase().includes(q))
      .sort((a, b) => b.s - a.s || a.b.name.localeCompare(b.b.name))
      .slice(0, 4)
      .map(({ b }) => b)

    return { vehicles: vehicleMatches, brands: brandMatches }
  }, [debouncedQuery, vehicles, brands])

  // Popular searches aligned with Timberline site
  const popularSearches = [
    'TIMBERLINE',
    'TSPORT',
    'ALPINE',
    'VEHICLES',
    'BRANDS'
  ]

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('timberline-recent-searches')
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved))
      } catch (e) {
        setRecentSearches([])
      }
    }
  }, [])

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Close when clicking outside the modal content
  useEffect(() => {
    if (!isOpen) return
    const handleOutsideClick = (e: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [isOpen, onClose])

  // Handle search
  const handleSearch = (query: string) => {
    if (query.trim()) {
      // Add to recent searches
      const candidate = query.trim().toUpperCase()
      const newRecent = [candidate, ...recentSearches.filter(s => s !== candidate)].slice(0, 3)
      setRecentSearches(newRecent)
      localStorage.setItem('timberline-recent-searches', JSON.stringify(newRecent))
      
      // TODO: Implement actual search functionality
      console.log('Searching for:', query)
    }
  }

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      // Do not close on Enter; only record if there are results
      if (searchQuery.trim()) {
        // Optionally only record when there is at least one result
        // const hasResults = results.vehicles.length > 0 || results.brands.length > 0
        // if (hasResults) handleSearch(searchQuery)
        handleSearch(searchQuery)
      }
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  // Handle popular/recent search click
  const handleSearchClick = (query: string) => {
    setSearchQuery(query)
    handleSearch(query)
  }

  if (!isOpen) return null

  return (
    <>
      <style jsx>{`
        @keyframes softOrangeGlow {
          0% { box-shadow: 0 0 0 0 rgba(255, 140, 66, 0.18); }
          50% { box-shadow: 0 0 0 8px rgba(255, 140, 66, 0.06); }
          100% { box-shadow: 0 0 0 0 rgba(255, 140, 66, 0.18); }
        }
        .orangePulse {
          animation: softOrangeGlow 3.2s ease-in-out infinite;
        }
      `}</style>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4" onClick={onClose}>
        <div ref={contentRef} className="w-full max-w-4xl bg-black/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
          {/* Search Bar */}
          <div className="p-6 border-b border-white/10">
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <MagnifyingGlassIcon className="w-6 h-6 text-white/60" />
              </div>
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search"
                className={`w-full pl-14 pr-14 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 text-lg font-semibold uppercase tracking-wide focus:outline-none focus:border-[#ff8c42] focus:bg-white/10 transition-all duration-200 ${
                  searchQuery.trim().length === 0 ? 'orangePulse' : ''
                }`}
              />
              <button
                onClick={() => {
                  if (searchQuery.trim().length === 0) {
                    onClose()
                  } else {
                    setSearchQuery('')
                  }
                }}
                className={`absolute right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 ${
                  searchQuery.trim().length === 0
                    ? 'bg-white/10 hover:bg-red-500/20'
                    : 'bg-white/10 hover:bg-orange-500/20'
                }`}
                aria-label={searchQuery.trim().length === 0 ? 'Close search' : 'Clear search'}
              >
                <XMarkIcon className={`w-4 h-4 ${
                  searchQuery.trim().length === 0 ? 'text-red-500' : 'text-orange-400'
                }`} />
              </button>
            </div>
          </div>

          {/* Search Content */}
          <div className="p-6">
            {debouncedQuery ? (
              <div className="space-y-6">
                {/* Vehicle Results */}
                {results.vehicles.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <ChartBarIcon className="w-5 h-5 text-[#ff8c42]" />
                      <h3 className="text-[#ff8c42] text-lg font-bold uppercase tracking-wide">Vehicles</h3>
                    </div>
                    <div className="space-y-2">
                      {results.vehicles.map((v) => {
                        const href = `/vehicles/${v.slug?.current}`
                        const thumb = v.coverImage?.asset?.url
                        return (
                          <Link
                            key={v._id}
                            href={href}
                            onClick={onClose}
                            className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/20 hover:border-[#ff8c42]/50 transition-all duration-200"
                          >
                            {thumb ? (
                              <img src={thumb} alt={v.title || ''} className="w-14 h-10 object-cover rounded-md border border-white/10" />
                            ) : (
                              <div className="w-14 h-10 rounded-md bg-white/5 border border-white/10" />
                            )}
                            <div className="min-w-0">
                              <div className="text-white font-semibold truncate">
                                {v.title}
                              </div>
                              <div className="text-white/60 text-xs uppercase tracking-wide truncate">
                                {(v.modelYear ? `${v.modelYear} ` : '') + (v.model || '')} {v.manufacturer?.name ? `• ${v.manufacturer.name}` : ''}
                              </div>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Brand Results */}
                {results.brands.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <ClockIcon className="w-5 h-5 text-[#ff8c42]" />
                      <h3 className="text-[#ff8c42] text-lg font-bold uppercase tracking-wide">Brands</h3>
                    </div>
                    <div className="space-y-2">
                      {results.brands.map((b) => {
                        const href = `/brands/${b.slug?.current}`
                        // If logo has direct url field
                        const logoUrl = (b as any).logo?.asset?.url || (b as any).logo?.url
                        return (
                          <Link
                            key={b._id}
                            href={href}
                            onClick={onClose}
                            className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/20 hover:border-[#ff8c42]/50 transition-all duration-200"
                          >
                            {logoUrl ? (
                              <img src={logoUrl} alt={b.name} className="w-10 h-10 object-contain rounded-md border border-white/10 bg-white/5" />
                            ) : (
                              <div className="w-10 h-10 rounded-md bg-white/5 border border-white/10" />
                            )}
                            <div className="min-w-0">
                              <div className="text-white font-semibold truncate">
                                {b.name}
                              </div>
                              <div className="text-white/60 text-xs uppercase tracking-wide truncate">Brand</div>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                )}

                {results.vehicles.length === 0 && results.brands.length === 0 && (
                  <div className="px-4 py-4">
                    <div className="space-y-3">
                      <div className="h-4 rounded bg-white/10 animate-pulse w-3/4" />
                      <div className="h-4 rounded bg-white/10 animate-pulse w-5/6" />
                      <div className="h-4 rounded bg-white/10 animate-pulse w-2/3" />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Popular Searches */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <ChartBarIcon className="w-5 h-5 text-[#ff8c42]" />
                    <h3 className="text-[#ff8c42] text-lg font-bold uppercase tracking-wide">
                      POPULAR SEARCHES
                    </h3>
                  </div>
                <div className="space-y-2">
                  {popularSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearchClick(search)}
                        className="w-full text-left px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-[#ff8c42]/50 rounded-xl text-white font-semibold uppercase tracking-wide transition-all duration-200 hover:scale-[1.02]"
                      >
                        {search}
                      </button>
                  ))}
                  </div>
                </div>

                {/* Recent Searches */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <ClockIcon className="w-5 h-5 text-[#ff8c42]" />
                    <h3 className="text-[#ff8c42] text-lg font-bold uppercase tracking-wide">
                      RECENT SEARCHES
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {recentSearches.length > 0 ? (
                      recentSearches.map((search, index) => (
                        <button
                          key={index}
                          onClick={() => handleSearchClick(search)}
                          className="w-full text-left px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-[#ff8c42]/50 rounded-xl text-white font-semibold uppercase tracking-wide transition-all duration-200 hover:scale-[1.02]"
                        >
                          {search}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-white/40 text-sm uppercase tracking-wide">
                        No recent searches
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Close Button */}
          <div className="p-6 pt-0">
            <button
              onClick={onClose}
              className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/40 rounded-xl text-white font-semibold uppercase tracking-wide transition-all duration-200"
            >
              Close Search
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
