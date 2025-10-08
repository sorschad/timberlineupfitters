"use client"

import Link from 'next/link'
import {useEffect, useMemo, useState} from 'react'
import {Orbitron} from 'next/font/google'
import {urlForImage} from '@/sanity/lib/utils'
import {MagnifyingGlassIcon} from '@heroicons/react/24/outline'
import SearchModal from '@/app/components/SearchModal'
import CompactInventoryBadge from '@/app/components/CompactInventoryBadge'

const orbitron = Orbitron({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '700', '900'],
})

interface Manufacturer {
  _id: string
  name: string
  slug: { current: string }
  logo?: any
  vehicleCount: number
}

export default function HeaderClient({
  settingsTitle,
  appLogo,
  manufacturers,
  timberlineVehicles,
  brands,
}: {
  settingsTitle?: string
  appLogo?: any
  manufacturers?: Manufacturer[]
  timberlineVehicles?: Array<{
    _id: string
    title: string
    slug: { current: string }
    model?: string
    vehicleType?: string
    modelYear?: number
    trim?: string
    sidebarSortOrder?: number
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
    inventory?: {
      availability?: string
      stockNumber?: string
      vin?: string
      location?: string
      mileage?: number
    }
  }>
  brands?: Array<{
    _id: string
    name: string
    slug: { current: string }
    slogan?: string
    logo?: any
    manufacturers?: Array<{
      _id: string
      name: string
      slug: { current: string }
      logo?: any
    }>
  }>
}) {
  const [isSticky, setIsSticky] = useState(false)
  const [isMegaOpen, setIsMegaOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [activeBrand, setActiveBrand] = useState<string | null>(null)
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(false)
  const [selectedManufacturers, setSelectedManufacturers] = useState<string[]>([])

  const filteredVehicles = useMemo(() => {
    if (!activeBrand) return timberlineVehicles || []
    
    // Find the active brand to get its associated manufacturers
    const activeBrandData = brands?.find(brand => brand.name === activeBrand)
    
    return (timberlineVehicles || []).filter((vehicle: any) => {
      // First check if vehicle has a tag matching the brand
      const vehicleTags = vehicle.tags || []
      const hasBrandTag = vehicleTags.some((tag: string) => {
        const tagLower = tag.toLowerCase().trim()
        const brandLower = activeBrand.toLowerCase().trim()
        return tagLower === brandLower || tagLower.includes(brandLower)
      })
      
      // If no brand tag match, exclude the vehicle
      if (!hasBrandTag) return false
      
      // Hide vehicles with "Available Soon" status
      if (vehicle?.inventory?.availability === 'Available Soon') {
        return false
      }
      
      // If brand has manufacturer associations, also check manufacturer filter
      if (activeBrandData?.manufacturers && activeBrandData.manufacturers.length > 0) {
        // If specific manufacturers are selected, filter by those
        if (selectedManufacturers.length > 0) {
          const vehicleManufacturerId = vehicle?.manufacturer?._id
          return vehicleManufacturerId && selectedManufacturers.includes(vehicleManufacturerId)
        }
        // If no manufacturers selected but brand has associations, show all vehicles with brand tag
        return true
      }
      
      // If brand has no manufacturer associations, just return vehicles with brand tag
      return true
    })
  }, [timberlineVehicles, activeBrand, brands, selectedManufacturers])

  const groupedByManufacturer = useMemo(() => {
    const groups: Record<string, Array<{ _id: string; title: string; slug: { current: string }; vehicleType?: string; model?: string; sidebarSortOrder?: number; coverImage?: { asset?: { _id: string; url: string } }; manufacturer?: { _id: string; name: string; logo?: { asset?: { _id: string; url: string } } } }>> = {}
    filteredVehicles.forEach((v: any) => {
      const name = v?.manufacturer?.name || 'Other'
      if (!groups[name]) groups[name] = []
      groups[name].push(v)
    })

    const sortedManufacturerNames = Object.keys(groups).sort((a, b) => a.localeCompare(b))
    return sortedManufacturerNames.map((name) => ({
      name,
      vehicles: groups[name].sort((a, b) => {
        // First sort by sidebarSortOrder (lower numbers first)
        const sortOrderA = a.sidebarSortOrder ?? 999
        const sortOrderB = b.sidebarSortOrder ?? 999
        if (sortOrderA !== sortOrderB) {
          return sortOrderA - sortOrderB
        }
        // Then sort by title alphabetically
        return (a.title || '').localeCompare(b.title || '')
      }),
    }))
  }, [filteredVehicles])

  useEffect(() => {
    const onScroll = () => {
      setIsSticky(window.scrollY > 10)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, {passive: true})
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('sidebar-mega-menu')
      const vehiclesButton = document.querySelector('[aria-controls="sidebar-mega-menu"]')
      
      if (isMegaOpen && sidebar && !sidebar.contains(event.target as Node) && !vehiclesButton?.contains(event.target as Node)) {
        setIsMegaOpen(false)
      }
    }

    if (isMegaOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMegaOpen])

  // Auto-select Timberline brand and its manufacturers when mega menu opens
  useEffect(() => {
    if (isMegaOpen && !activeBrand && brands) {
      const timberlineBrand = brands.find(brand => brand.name === 'Timberline')
      if (timberlineBrand) {
        setActiveBrand('Timberline')
        if (timberlineBrand.manufacturers && timberlineBrand.manufacturers.length > 0) {
          setSelectedManufacturers(timberlineBrand.manufacturers.map(m => m._id))
        }
        setIsLoadingVehicles(true)
        setTimeout(() => setIsLoadingVehicles(false), 300)
      }
    }
  }, [isMegaOpen, activeBrand, brands])

  return (
    <>
      {/* Custom CSS for truck rotation animation */}
      <style jsx>{`
        @keyframes rotateX {
          from {
            transform: rotateX(0deg);
          }
          to {
            transform: rotateX(360deg);
          }
        }
      `}</style>
      
      {/* Background blur overlay when mega menu or search is open */}
      {(isMegaOpen || isSearchOpen) && (
        <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-md" />
      )}
      
      <header
        className={`fixed left-0 right-0 top-0 z-50 h-24 flex items-center transition-all duration-700 ease-out ${
          isSticky 
            ? 'bg-[#553920]/85 shadow-lg backdrop-blur-[2px]' 
            : `bg-transparent lg:bg-transparent sm:bg-transparent bg-[#ff6b00]/90 shadow-none backdrop-blur-0 ${
                !isSearchOpen
                  ? `border-b-2 border-dashed ${
                      isMegaOpen 
                        ? 'border-[#ff8c42]/12 backdrop-blur-lg' 
                        : 'border-[#ff8c42]/60'
                    }`
                  : ''
              }`
        } ${(isMegaOpen || isSearchOpen) ? 'bg-black/50 backdrop-blur-lg' : ''}`}
        style={{willChange: 'background-color, filter, box-shadow'}}
      >
      <div className={`container py-4 sm:py-6 px-3 sm:px-6 ${(isMegaOpen || isSearchOpen) ? 'backdrop-blur-lg blur-lg opacity-[0.12]' : ''}`}>
        <div className={`flex items-center justify-between ${(isMegaOpen || isSearchOpen) ? 'backdrop-blur-lg' : ''}`}>
          {/* Logo Section */}
          <Link
            className={`flex items-center gap-2 ${(isMegaOpen || isSearchOpen) ? 'backdrop-blur-lg' : ''}`}
            href="/"
            aria-label={settingsTitle}
          >
            <span className="sr-only">{settingsTitle}</span>
            {appLogo?.asset?._ref && (
              <img
                src={`${urlForImage(appLogo)?.url()}`}
                alt={appLogo?.alt || 'Application Logo'}
                className="w-21 h-21 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain select-none shrink-0"
              />
            )}
            <div className="hidden lg:flex items-baseline -ml-[23px] select-none">
              <span
                className={`${orbitron.className} select-none tracking-[0.02em] antialiased text-white text-xl sm:text-3xl font-black leading-none transition-colors duration-300 ${
                  isSticky ? '' : 'drop-shadow-[0_0_1px_rgba(0,0,0,1)]'
                }`}
              >
                TIMBERLINE
              </span>
              <span
                className={`${orbitron.className} select-none tracking-[0.01em] antialiased text-xl sm:text-3xl font-black leading-none transition-colors duration-300 ${
                  'text-[#ff8c42]'
                }`}
              >
                UPFITTERS
              </span>
            </div>
          </Link>

          {/* Mobile Navigation */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setIsMegaOpen((v) => !v)}
              aria-expanded={isMegaOpen}
              aria-controls="sidebar-mega-menu"
              className="lg:hidden p-2 rounded-full hover:bg-white/10 transition-all duration-200"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Desktop Navigation */}
            <nav className={`hidden lg:flex items-center gap-6 mr-6 ${(isMegaOpen || isSearchOpen) ? 'backdrop-blur-lg' : ''}`}>
              <button
                type="button"
                onClick={() => setIsMegaOpen((v) => !v)}
                aria-expanded={isMegaOpen}
                aria-controls="sidebar-mega-menu"
                className={`${isSticky ? 'text-white/90 hover:text-white' : 'text-white/90 hover:text-white'} ${isSticky ? '' : 'drop-shadow-[0_0_1px_rgba(0,0,0,0.12)]'} no-underline uppercase cursor-pointer text-sm tracking-[0.18em] font-semibold`}
              >
                Vehicles
              </button>

              <Link href="/brands" className={`${isSticky ? 'text-white/90 hover:text-white' : 'text-white/90 hover:text-white'} ${isSticky ? '' : 'drop-shadow-[0_0_1px_rgba(0,0,0,0.12)]'} no-underline uppercase cursor-pointer text-sm tracking-[0.18em] font-semibold`}>
                Brands
              </Link>

              <Link href="/heritage" className={`${isSticky ? 'text-white/90 hover:text-white' : 'text-white/90 hover:text-white'} ${isSticky ? '' : 'drop-shadow-[0_0_1px_rgba(0,0,0,0.12)]'} no-underline uppercase cursor-pointer text-sm tracking-[0.18em] font-semibold`}>
                Heritage
              </Link>
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Dealer Portal Button - Hidden on mobile, visible on tablet+ */}
              <Link
                className="hidden sm:flex items-center bg-brown/90 hover:bg-[#1a130e] py-2 px-4 sm:py-3 sm:px-6 text-white text-xs uppercase tracking-wide transition-colors duration-200 rounded-full"
                href="https://github.com/sanity-io/sanity-template-nextjs-clean"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="whitespace-nowrap">Dealer Portal</span>
              </Link>
              
              {/* Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 rounded-full hover:bg-white/10 transition-all duration-200 cursor-pointer"
                aria-label="Open search"
              >
                <MagnifyingGlassIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white/70 hover:text-white/90 transition-colors duration-200" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Mega Menu */}
      <div
        id="sidebar-mega-menu"
        className={`fixed top-0 left-0 bottom-0 z-[60] w-full max-w-full sm:max-w-[700px] min-h-screen transform transition-transform duration-500 ease-in-out
        ${isMegaOpen ? 'translate-x-0' : '-translate-x-full'}`}
        aria-hidden={!isMegaOpen}
      >
        <div className="flex flex-col sm:grid sm:grid-cols-[1.6fr_2.4fr] md:grid-cols-[1.7fr_2.3fr] lg:grid-cols-[1.8fr_2.2fr] h-full border border-white/30 shadow-2xl">
          {/* Left Section: Brands */}
          <div className="bg-black/25 backdrop-blur-2xl text-white border-r-0 sm:border-r border-white/20 flex-shrink-0">
            {/* Header */}
            <div className="h-16 sm:h-20 px-4 sm:px-6 flex items-center justify-between border-b border-white/20 bg-gradient-to-r from-black/30 to-black/10">
              <div>
                <div className={`${orbitron.className} uppercase tracking-[0.2em] text-[#ff8c42] text-base sm:text-lg font-bold`}>BRANDS</div>
                <div className="uppercase text-white/80 text-xs tracking-[0.15em] mt-1 font-medium">TIMBERLINE BUILT</div>
              </div>
              <button
                type="button"
                onClick={() => setIsMegaOpen(false)}
                className="w-8 h-8 grid place-items-center rounded-full text-[#ff8c42] hover:bg-[#ff8c42]/20 transition-all duration-200 hover:scale-110"
                aria-label="Close menu"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Brand Cards */}
            <div className="flex sm:flex-col gap-0.5 sm:gap-auto p-4 sm:p-6 space-y-3 max-h-[50vh] sm:max-h-none overflow-y-auto">
              {brands?.sort((a, b) => {
                // Define explicit order: Timberline, TSport, Alpine
                const order = ['Timberline', 'TSport', 'Alpine']
                const aIndex = order.indexOf(a.name)
                const bIndex = order.indexOf(b.name)
                
                // If both brands are in the order array, sort by their position
                if (aIndex !== -1 && bIndex !== -1) {
                  return aIndex - bIndex
                }
                
                // If only one brand is in the order array, prioritize it
                if (aIndex !== -1) return -1
                if (bIndex !== -1) return 1
                
                // If neither brand is in the order array, sort alphabetically
                return a.name.localeCompare(b.name)
              }).map((brand) => (
                <div 
                  key={brand._id} 
                  className={`max-h-[64px] sm:max-h-none rounded-xl border transition-all duration-300 cursor-pointer relative group ${
                    activeBrand === brand.name 
                      ? 'bg-[#ff8c42]/15 border-[#ff8c42]/50 shadow-lg shadow-[#ff8c42]/10' 
                      : 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30'
                  }`}
                  onClick={() => {
                    const newActiveBrand = activeBrand === brand.name ? null : brand.name
                    setActiveBrand(newActiveBrand)
                    
                    if (newActiveBrand) {
                      // Auto-select all manufacturers for the brand
                      const brandData = brands?.find(b => b.name === newActiveBrand)
                      if (brandData?.manufacturers && brandData.manufacturers.length > 0) {
                        setSelectedManufacturers(brandData.manufacturers.map(m => m._id))
                      } else {
                        setSelectedManufacturers([])
                      }
                      
                      setIsLoadingVehicles(true)
                      // Simulate loading time for better UX
                      setTimeout(() => setIsLoadingVehicles(false), 300)
                    } else {
                      setSelectedManufacturers([]) // Reset when brand is deselected
                    }
                  }}
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="text-white text-lg font-bold mb-1 uppercase">{brand.name}</div>
                        <div className="hidden sm:block text-white/60 text-xs leading-tight"><small>{brand.slogan || 'SLOGAN_GOES_HERE'}</small></div>
                      </div>
                      <div className="hidden sm:block ml-3">
                        <svg className={`w-5 h-5 transition-all duration-200 ${
                          activeBrand === brand.name ? 'text-[#ff8c42] rotate-0' : 'text-white/40 group-hover:text-[#ff8c42] group-hover:translate-x-1'
                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                    
                    {/* Manufacturer Filter - Only show when this brand is active */}
                    {activeBrand === brand.name && brand.manufacturers && brand.manufacturers.length > 0 && (
                      <div className="hidden sm:block mt-1 pt-1">
                        <div className="flex flex-wrap gap-2">
                          {brand.manufacturers.map((manufacturer) => (
                            <button
                              key={manufacturer._id}
                              onClick={(e) => {
                                e.stopPropagation() // Prevent brand deselection
                                setSelectedManufacturers(prev => 
                                  prev.includes(manufacturer._id)
                                    ? prev.filter(id => id !== manufacturer._id)
                                    : [...prev, manufacturer._id]
                                )
                              }}
                              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                                selectedManufacturers.includes(manufacturer._id)
                                  ? 'bg-[#ff8c42] text-black shadow-lg shadow-[#ff8c42]/20 transform scale-105'
                                  : 'bg-white/10 text-white hover:bg-white/20 hover:scale-105 border border-white/20'
                              }`}
                            >
                              {manufacturer.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Section: Vehicles */}
          <div className="bg-black/25 backdrop-blur-2xl text-white relative flex-1 min-h-0">
            {/* Header */}
            <div className="h-16 sm:h-20 px-4 sm:px-6 flex items-center border-b border-white/20 bg-gradient-to-r from-black/30 to-black/10">
              <div>
                <div className={`${orbitron.className} uppercase tracking-[0.2em] text-[#ff8c42] text-base sm:text-lg font-bold`}>
                  {activeBrand ? activeBrand.toUpperCase() : 'VEHICLES'}
                </div>
                <div className="uppercase text-white/80 text-xs tracking-[0.15em] mt-1 font-medium">
                  {activeBrand ? 'VEHICLES' : 'LINEUP'}
                </div>
              </div>
            </div>

            {/* Vehicle Content - Using filtered vehicle data */}
            <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(100vh-4rem)] sm:max-h-[calc(100vh-5rem)] scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/30">
              {isLoadingVehicles ? (
                <div className="flex items-center justify-center h-32">
                  <div className="flex flex-col items-center space-y-4">
                    {/* Animated Vehicle Icon with Enhanced UX */}
                    <div className="flex items-center justify-center relative opacity-70">
                      {/* Background pulsing circle outline */}
                      <div className="absolute inset-0 rounded-full border-2 border-[#d0ad66]/30 animate-pulse scale-110"></div>
                      <div className="absolute inset-0 rounded-full border border-[#d0ad66]/15 animate-ping scale-125"></div>
                      
                      {/* Main truck icon */}
                      <div className="relative z-10 flex flex-col items-center justify-center w-16 h-16">
                        <div className="mt-1">
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            strokeWidth="2" 
                            stroke="url(#truckGradient)" 
                            className="w-10 h-10"
                            style={{
                              animation: 'rotateX 2s linear infinite, bounce 1.5s ease-in-out infinite',
                              transformOrigin: 'center'
                            }}
                          >
                            <defs>
                              <linearGradient id="truckGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#d0ad66" stopOpacity="0.8" />
                                <stop offset="50%" stopColor="#c49b5a" stopOpacity="0.8" />
                                <stop offset="100%" stopColor="#b88a4e" stopOpacity="0.8" />
                              </linearGradient>
                            </defs>
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" 
                          />
                        </svg>
                        </div>
                        
                        {/* Loading dots animation - now inside the circle */}
                        <div className="flex space-x-1 -mt-1">
                          <div className="w-1.5 h-1.5 bg-[#d0ad66]/40 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                          <div className="w-1.5 h-1.5 bg-[#c49b5a]/40 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                          <div className="w-1.5 h-1.5 bg-[#b88a4e]/40 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  {groupedByManufacturer.map((group) => (
                    <div key={group.name}>
                      <div className="space-y-1.5">
                        {group.vehicles.map((v) => (
                          <Link
                            key={v._id}
                            href={`/vehicles/${(v as any).slug?.current}`}
                            onClick={() => setIsMegaOpen(false)}
                            className="group block bg-white/8 backdrop-blur-sm rounded-2xl border border-white/15 hover:bg-white/12 hover:border-white/25 hover:shadow-xl hover:shadow-black/20 transition-all duration-500 overflow-hidden max-h-auto sm:h-[87px] relative"
                          >
                            {/* Inventory Badge */}
                            <CompactInventoryBadge availability={(v as any).inventory?.availability} />
                            
                            <div className="flex flex-col sm:grid sm:grid-cols-[1fr_0.8fr] h-auto sm:h-[87px]">
                              {/* Left Section - Text Content */}
                              <div className="flex flex-col justify-center gap-2 p-3 sm:p-2">
                                <div>
                                  {/* Vehicle Title */}
                                  <h3 className="text-white text-xs sm:text-sm font-bold mb-1 group-hover:text-[#ff8c42] transition-colors duration-300 leading-tight">
                                    {v.title}
                                  </h3>
                                  
                                  {/* Vehicle Details */}
                                  <div className="text-white/60 text-xs leading-tight">
                                    {v?.model && (
                                      <span className="block">{v.model}</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              {/* Right Section - Vehicle Image */}
                              <div className="relative h-auto sm:h-[87px]">
                                <div className="h-auto sm:h-[87px] overflow-hidden bg-transparent border border-white/10 group-hover:border-[#ff8c42]/30 transition-all duration-300">
                                  {v?.coverImage?.asset?.url ? (
                                    <img 
                                      src={v.coverImage.asset.url} 
                                      alt={v.title}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <div className="text-center">
                                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-3 mx-auto">
                                          <svg className="w-6 h-6 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                          </svg>
                                        </div>
                                        <span className="text-white/40 text-sm font-medium">Vehicle Image</span>
                                      </div>
                                    </div>
                                  )}
                                </div>
                                
                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Search Modal */}
      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        vehicles={timberlineVehicles as any}
        brands={brands as any}
      />
    </header>
    </>
  )
}
