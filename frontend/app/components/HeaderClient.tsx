"use client"

import Link from 'next/link'
import {useEffect, useMemo, useState} from 'react'
import {Orbitron} from 'next/font/google'
import {urlForImage} from '@/sanity/lib/utils'

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
  const [activeBrand, setActiveBrand] = useState<string | null>(null)
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(false)
  const [selectedManufacturers, setSelectedManufacturers] = useState<string[]>([])

  const filteredVehicles = useMemo(() => {
    if (!activeBrand) return timberlineVehicles || []
    
    // Find the active brand to get its associated manufacturers
    const activeBrandData = brands?.find(brand => brand.name === activeBrand)
    if (!activeBrandData?.manufacturers) {
      // Fallback to tag-based filtering if no manufacturer associations
      return (timberlineVehicles || []).filter((vehicle: any) => {
        const vehicleTags = vehicle.tags || []
        return vehicleTags.some((tag: string) => {
          const tagLower = tag.toLowerCase().trim()
          const brandLower = activeBrand.toLowerCase().trim()
          return tagLower === brandLower || tagLower.includes(brandLower)
        })
      })
    }
    
    // Filter vehicles by manufacturer associations
    let manufacturerIds = activeBrandData.manufacturers.map(m => m._id)
    
    // If specific manufacturers are selected, filter by those
    if (selectedManufacturers.length > 0) {
      manufacturerIds = manufacturerIds.filter(id => selectedManufacturers.includes(id))
    }
    
    return (timberlineVehicles || []).filter((vehicle: any) => {
      const vehicleManufacturerId = vehicle?.manufacturer?._id
      return vehicleManufacturerId && manufacturerIds.includes(vehicleManufacturerId)
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

  return (
    <>
      {/* Background blur overlay when mega menu is open */}
      {isMegaOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-md" />
      )}
      
      <header
        className={`fixed left-0 right-0 top-0 z-50 h-24 flex items-center transition-all duration-700 ease-out ${
          isSticky ? 'bg-[#553920]/85 shadow-lg backdrop-blur-[2px]' : 'bg-transparent shadow-none backdrop-blur-0'
        } ${isMegaOpen ? 'bg-black/50 backdrop-blur-lg' : ''}`}
        style={{willChange: 'background-color, filter, box-shadow'}}
      >
      <div className={`container py-6 px-2 sm:px-6 ${isMegaOpen ? 'backdrop-blur-lg' : ''}`}>
        <div className={`grid grid-cols-3 items-center gap-5 ${isMegaOpen ? 'backdrop-blur-lg' : ''}`}>
          <Link
            className={`flex items-center gap-0.5 ${isMegaOpen ? 'backdrop-blur-lg' : ''}`}
            href="/"
            aria-label={settingsTitle}
          >
            <span className="sr-only">{settingsTitle}</span>
            {appLogo?.asset?._ref && (
              <img
                src={`${urlForImage(appLogo)?.url()}`}
                alt={appLogo?.alt || 'Application Logo'}
                className="w-[120px] h-auto object-contain select-none shrink-0"
              />
            )}
            <div className="flex items-baseline -ml-[23px] select-none">
              <span
                className={`${orbitron.className} select-none tracking-[0.06em] antialiased text-white text-xl sm:text-3xl font-black leading-none transition-colors duration-300 ${
                  isSticky ? '' : 'drop-shadow-[0_0_1px_rgba(0,0,0,1)]'
                }`}
              >
                TIMBERLINE
              </span>
              <span
                className={`${orbitron.className} select-none tracking-[0.05em] antialiased text-xl sm:text-3xl font-black leading-none transition-colors duration-300 ${
                  'text-[#ff5500]'
                }`}
              >
                UPFITTERS
              </span>
            </div>
          </Link>

          <nav className={`justify-self-center ${isMegaOpen ? 'backdrop-blur-lg' : ''}`} />

          <nav className={`justify-self-end ${isMegaOpen ? 'backdrop-blur-lg' : ''}`}>
            <ul
              role="list"
              className={`flex items-center gap-5 md:gap-8 leading-5 text-sm tracking-[0.18em] font-semibold font-sans ${isMegaOpen ? 'backdrop-blur-lg' : ''}`}
            >
              <li>
                <button
                  type="button"
                  onClick={() => setIsMegaOpen((v) => !v)}
                  aria-expanded={isMegaOpen}
                  aria-controls="sidebar-mega-menu"
                  className={`${isSticky ? 'text-white/90 hover:text-white' : 'text-white/90 hover:text-white'} ${isSticky ? '' : 'drop-shadow-[0_0_1px_rgba(0,0,0,0.12)]'} no-underline uppercase cursor-pointer ${isMegaOpen ? 'backdrop-blur-lg' : ''}`}
                >
                  Vehicles
                </button>
              </li>

              <li className={`relative group ${isMegaOpen ? 'backdrop-blur-lg' : ''}`}>
                <button className={`flex items-center gap-1 ${isSticky ? 'text-white/90 hover:text-white' : 'text-white/90 hover:text-white'} ${isSticky ? '' : 'drop-shadow-[0_0_1px_rgba(0,0,0,0.12)]'} no-underline uppercase cursor-pointer ${isMegaOpen ? 'backdrop-blur-lg' : ''}`}>
                  Manufacturers
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className={`absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 ${isMegaOpen ? 'backdrop-blur-lg' : ''}`}>
                  <div className="py-2 max-h-[60vh] overflow-auto">
                    {manufacturers?.map((manufacturer) => (
                      <Link
                        key={manufacturer._id}
                        href={`/manufacturers/${manufacturer.slug.current}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
                      >
                        {manufacturer.name}
                        <span className="text-xs text-gray-500 ml-2">({manufacturer.vehicleCount} vehicles)</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </li>

              <li>
                <Link href="/about" className={`${isSticky ? 'text-white/90 hover:text-white' : 'text-white/90 hover:text-white'} ${isSticky ? '' : 'drop-shadow-[0_0_1px_rgba(0,0,0,0.12)]'} no-underline uppercase cursor-pointer`}>
                  Heritage
                </Link>
              </li>

              <li className="flex sm:gap-4 md:gap-6">
                <Link
                  className="rounded-full flex items-center bg-brown/90 hover:bg-[#1a130e] py-3 px-6 justify-center sm:py-3 sm:px-8 text-white text-xs uppercase tracking-wide transition-colors duration-200"
                  href="https://github.com/sanity-io/sanity-template-nextjs-clean"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="whitespace-nowrap">Dealer Portal</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Sidebar Mega Menu */}
      <div
        id="sidebar-mega-menu"
        className={`fixed top-0 left-0 bottom-0 z-[60] w-full max-w-[700px] transform transition-transform duration-500 ease-in-out
        ${isMegaOpen ? 'translate-x-0' : '-translate-x-full'}`}
        aria-hidden={!isMegaOpen}
      >
        <div className="grid grid-cols-[1fr_1.8fr] sm:grid-cols-[1.2fr_1.8fr] md:grid-cols-[1.3fr_1.7fr] lg:grid-cols-[1.4fr_1.6fr] h-full border border-white/30 shadow-2xl">
          {/* Left Section: Brands */}
          <div className="bg-black/25 backdrop-blur-2xl text-white border-r border-white/20">
            {/* Header */}
            <div className="h-20 px-6 flex items-center justify-between border-b border-white/20 bg-gradient-to-r from-black/30 to-black/10">
              <div>
                <div className={`${orbitron.className} uppercase tracking-[0.2em] text-[#ff8c42] text-lg font-bold`}>BRANDS</div>
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
            <div className="p-6 space-y-3">
              {brands?.map((brand) => (
                <div 
                  key={brand._id} 
                  className={`rounded-xl border transition-all duration-300 cursor-pointer relative group ${
                    activeBrand === brand.name 
                      ? 'bg-[#ff8c42]/15 border-[#ff8c42]/50 shadow-lg shadow-[#ff8c42]/10' 
                      : 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30'
                  }`}
                  onClick={() => {
                    const newActiveBrand = activeBrand === brand.name ? null : brand.name
                    setActiveBrand(newActiveBrand)
                    setSelectedManufacturers([]) // Reset manufacturer selection when brand changes
                    if (newActiveBrand) {
                      setIsLoadingVehicles(true)
                      // Simulate loading time for better UX
                      setTimeout(() => setIsLoadingVehicles(false), 300)
                    }
                  }}
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="text-white text-lg font-bold mb-1">{brand.name}</div>
                        <div className="text-white/60 text-sm leading-relaxed">{brand.slogan || 'Tactical vehicle platform'}</div>
                      </div>
                      <div className="ml-3">
                        <svg className={`w-5 h-5 transition-all duration-200 ${
                          activeBrand === brand.name ? 'text-[#ff8c42] rotate-0' : 'text-white/40 group-hover:text-[#ff8c42] group-hover:translate-x-1'
                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Section: Vehicles */}
          <div className="bg-black/25 backdrop-blur-2xl text-white relative">
            {/* Header */}
            <div className="h-20 px-6 flex items-center border-b border-white/20 bg-gradient-to-r from-black/30 to-black/10">
              <div>
                <div className={`${orbitron.className} uppercase tracking-[0.2em] text-[#ff8c42] text-lg font-bold`}>
                  {activeBrand ? activeBrand.toUpperCase() : 'VEHICLES'}
                </div>
                <div className="uppercase text-white/80 text-xs tracking-[0.15em] mt-1 font-medium">
                  {activeBrand ? 'VEHICLES' : 'LINEUP'}
                </div>
              </div>
            </div>

            {/* Manufacturers Filter Section */}
            {activeBrand && brands?.find(b => b.name === activeBrand)?.manufacturers && (
              <div className="px-6 py-5 border-b border-white/20 bg-gradient-to-r from-black/20 to-black/5">
                <div className="mb-4">
                  <p className="text-white/70 text-sm font-medium mb-3">Filter by manufacturer</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {brands?.find(b => b.name === activeBrand)?.manufacturers?.map((manufacturer) => (
                    <button
                      key={manufacturer._id}
                      onClick={() => {
                        setSelectedManufacturers(prev => 
                          prev.includes(manufacturer._id)
                            ? prev.filter(id => id !== manufacturer._id)
                            : [...prev, manufacturer._id]
                        )
                      }}
                      className={`px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
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

            {/* Vehicle Content - Using filtered vehicle data */}
            <div className="p-6 overflow-y-auto h-[calc(100%-8rem)] scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/30">
              {isLoadingVehicles ? (
                <div className="flex items-center justify-center h-32">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#ff8c42]/30 border-t-[#ff8c42]"></div>
                    <div className="text-white/70 text-sm font-medium">Loading vehicles...</div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {groupedByManufacturer.map((group) => (
                    <div key={group.name}>
                      <div className="space-y-3">
                        {group.vehicles.map((v) => (
                          <Link
                            key={v._id}
                            href={`/vehicles/${(v as any).slug?.current}`}
                            onClick={() => setIsMegaOpen(false)}
                            className="block rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30 p-4 transition-all duration-300 group"
                          >
                            <div className="flex items-start gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  {v?.manufacturer?.logo?.asset?.url ? (
                                    <img 
                                      src={v.manufacturer.logo.asset.url} 
                                      alt={`${v.manufacturer.name} logo`}
                                      className="w-5 h-5 object-contain"
                                    />
                                  ) : (
                                    <div className="w-5 h-5 bg-white/10 rounded flex items-center justify-center">
                                      <span className="text-white/40 text-xs font-bold">{v?.manufacturer?.name?.charAt(0) || 'M'}</span>
                                    </div>
                                  )}
                                  <span className="text-white/60 text-xs font-medium">{v?.manufacturer?.name || 'Unknown Manufacturer'}</span>
                                </div>
                                <div className="text-white text-sm font-bold uppercase leading-tight group-hover:text-[#ff8c42] transition-colors duration-200">{v.title}</div>
                              </div>
                              <div className="w-16 h-12 rounded-lg overflow-hidden border border-white/10 group-hover:border-[#ff8c42]/30 transition-all duration-200">
                                {v?.coverImage?.asset?.url ? (
                                  <img 
                                    src={v.coverImage.asset.url} 
                                    alt={v.title}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                                    <span className="text-white/40 text-xs font-medium">IMG</span>
                                  </div>
                                )}
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
    </header>
    </>
  )
}


