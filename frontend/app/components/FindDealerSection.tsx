'use client'

import { useState } from 'react'
import { SearchModal } from './SearchModal'

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
              <div className="w-12 h-12 bg-gradient-to-br from-[#d4852b] to-[#f36f21] rounded-full flex items-center justify-center shadow-lg">
                <svg 
                  className="w-6 h-6 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
                  />
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
                  />
                </svg>
              </div>
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

            {/* Features */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#d4852b] to-[#f36f21] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Local Expertise</h3>
                <p className="text-[rgba(255,255,255,0.7)]">Regional specialists who understand your local market</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#d4852b] to-[#f36f21] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Direct Contact</h3>
                <p className="text-[rgba(255,255,255,0.7)]">Get direct phone and email access to your representative</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#d4852b] to-[#f36f21] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Specialized Support</h3>
                <p className="text-[rgba(255,255,255,0.7)]">Expert guidance for commercial and fleet vehicle needs</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Modal */}
      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </>
  )
}
