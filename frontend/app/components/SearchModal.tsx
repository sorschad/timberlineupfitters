"use client"

import { useState, useEffect, useRef } from 'react'
import { MagnifyingGlassIcon, XMarkIcon, ClockIcon, ChartBarIcon } from '@heroicons/react/24/outline'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  // Popular searches based on the design
  const popularSearches = [
    'TSPORT',
    'TACTICAL VEHICLES', 
    'F-150',
    'RANGER',
    'EVENTS'
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

  // Handle search
  const handleSearch = (query: string) => {
    if (query.trim()) {
      // Add to recent searches
      const newRecent = [query.trim().toUpperCase(), ...recentSearches.filter(s => s !== query.trim().toUpperCase())].slice(0, 3)
      setRecentSearches(newRecent)
      localStorage.setItem('timberline-recent-searches', JSON.stringify(newRecent))
      
      // TODO: Implement actual search functionality
      console.log('Searching for:', query)
      
      // Close modal
      onClose()
    }
  }

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(searchQuery)
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
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
        <div className="w-full max-w-4xl bg-black/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl">
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
                placeholder="SEARCH TACTICAL VEHICLES, GEAR, EVENTS..."
                className="w-full pl-14 pr-14 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 text-lg font-semibold uppercase tracking-wide focus:outline-none focus:border-[#ff8c42] focus:bg-white/10 transition-all duration-200"
              />
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-200"
              >
                <XMarkIcon className="w-4 h-4 text-white/60" />
              </button>
            </div>
          </div>

          {/* Search Content */}
          <div className="p-6">
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
