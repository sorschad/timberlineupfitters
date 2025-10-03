'use client'

import { useState } from 'react'
import { SalesRepresentativeSearchModal } from './SalesRepresentativeSearchModal'

export default function FindDealerSection() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <>
      <section className="relative bg-gradient-to-br from-[#1a1a1a] via-[#2f3f24] to-[#1e3a2b] text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url(/images/tile-grid-black.png)] opacity-5 bg-[length:48px]" />
        
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-32 h-32 bg-[#d4852b] opacity-10 rounded-full blur-xl" />
          <div className="absolute bottom-20 right-20 w-24 h-24 bg-[#c2a463] opacity-15 rounded-full blur-lg" />
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-[#f36f21] opacity-20 rounded-full blur-md" />
        </div>

        <div className="relative container py-16 md:py-20 lg:py-24">
          <div className="max-w-4xl mx-auto text-center">
            {/* Main Title */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Find Your
                <span className="block bg-gradient-to-r from-[#d4852b] to-[#f36f21] bg-clip-text text-transparent">
                  Sales Representative
                </span>
              </h2>
            </div>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-[rgba(255,255,255,0.8)] mb-12 max-w-2xl mx-auto leading-relaxed">
              Connect with our expert sales team in your area. Get personalized support for your commercial vehicle needs.
            </p>

            {/* Search Interface */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-2xl">
              <div className="max-w-2xl mx-auto">
                <label htmlFor="dealer-search" className="block text-sm font-medium text-[rgba(255,255,255,0.9)] mb-4">
                  Enter your location to find nearby representatives
                </label>
                <div className="relative">
                  <input
                    id="dealer-search"
                    type="text"
                    placeholder="Zip Code or City, State"
                    className="w-full px-6 py-4 text-lg bg-white text-gray-900 rounded-xl border-0 focus:ring-4 focus:ring-[#d4852b]/30 focus:outline-none transition-all duration-300 shadow-lg"
                    onClick={() => setIsSearchOpen(true)}
                    readOnly
                  />
                  <button
                    onClick={() => setIsSearchOpen(true)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-r from-[#d4852b] to-[#f36f21] rounded-lg flex items-center justify-center text-white hover:shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Modal */}
      <SalesRepresentativeSearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </>
  )
}
