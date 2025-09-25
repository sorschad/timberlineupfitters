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
  }>
  brands?: Array<{
    _id: string
    name: string
    slug: { current: string }
    slogan?: string
  }>
}) {
  const [isSticky, setIsSticky] = useState(false)
  const [isMegaOpen, setIsMegaOpen] = useState(false)
  const [activeBrand, setActiveBrand] = useState<string | null>(null)
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(false)

  const filteredVehicles = useMemo(() => {
    if (!activeBrand) return timberlineVehicles || []
    
    return (timberlineVehicles || []).filter((vehicle: any) => {
      // Check if the vehicle has tags that match the active brand name exactly or contains it
      const vehicleTags = vehicle.tags || []
      return vehicleTags.some((tag: string) => {
        const tagLower = tag.toLowerCase().trim()
        const brandLower = activeBrand.toLowerCase().trim()
        // Check for exact match or if the tag contains the brand name
        return tagLower === brandLower || tagLower.includes(brandLower)
      })
    })
  }, [timberlineVehicles, activeBrand])

  const groupedByManufacturer = useMemo(() => {
    const groups: Record<string, Array<{ _id: string; title: string; slug: { current: string }; vehicleType?: string; model?: string }>> = {}
    filteredVehicles.forEach((v: any) => {
      const name = v?.manufacturer?.name || 'Other'
      if (!groups[name]) groups[name] = []
      groups[name].push(v)
    })

    const sortedManufacturerNames = Object.keys(groups).sort((a, b) => a.localeCompare(b))
    return sortedManufacturerNames.map((name) => ({
      name,
      vehicles: groups[name].sort((a, b) => (a.title || '').localeCompare(b.title || '')),
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
        } ${isMegaOpen ? 'backdrop-blur-md' : ''}`}
        style={{willChange: 'background-color, filter, box-shadow'}}
      >
      <div className="container py-6 px-2 sm:px-6">
        <div className="grid grid-cols-3 items-center gap-5">
          <Link
            className="flex items-center gap-0.5"
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

          <nav className="justify-self-center" />

          <nav className="justify-self-end">
            <ul
              role="list"
              className="flex items-center gap-5 md:gap-8 leading-5 text-sm tracking-[0.18em] font-semibold font-sans"
            >
              <li>
                <button
                  type="button"
                  onClick={() => setIsMegaOpen((v) => !v)}
                  aria-expanded={isMegaOpen}
                  aria-controls="sidebar-mega-menu"
                  className={`${isSticky ? 'text-white/90 hover:text-white' : 'text-white/90 hover:text-white'} ${isSticky ? '' : 'drop-shadow-[0_0_1px_rgba(0,0,0,0.12)]'} no-underline uppercase cursor-pointer`}
                >
                  Vehicles
                </button>
              </li>

              <li className="relative group">
                <button className={`flex items-center gap-1 ${isSticky ? 'text-white/90 hover:text-white' : 'text-white/90 hover:text-white'} ${isSticky ? '' : 'drop-shadow-[0_0_1px_rgba(0,0,0,0.12)]'} no-underline uppercase cursor-pointer`}>
                  Manufacturers
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
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
        <div className="grid grid-cols-[1fr_1.8fr] sm:grid-cols-[1.2fr_1.8fr] md:grid-cols-[1.3fr_1.7fr] lg:grid-cols-[1.4fr_1.6fr] h-full border border-white/20">
          {/* Left Section: Brands */}
          <div className="bg-black/20 backdrop-blur-xl text-white">
            {/* Header */}
            <div className="h-24 px-6 flex items-center justify-between border-b border-white/10 bg-black/20 backdrop-blur-xl">
              <div>
                <div className={`${orbitron.className} uppercase tracking-[0.18em] text-[#ff8c42] text-lg`}>Brands</div>
                        <div className="uppercase text-white text-xs tracking-widest mt-1">Timberline Built</div>
              </div>
              <button
                type="button"
                onClick={() => setIsMegaOpen(false)}
                className="w-10 h-10 grid place-items-center rounded-full text-[#ff8c42] hover:bg-white/10 transition"
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            {/* Brand Cards */}
            <div className="p-6 space-y-2">
              {brands?.map((brand) => (
                <div 
                  key={brand._id} 
                  className={`rounded-lg border border-white/20 p-4 transition-colors cursor-pointer relative ${
                    activeBrand === brand.name 
                      ? 'bg-[#ff8c42]/20 border-[#ff8c42]/40' 
                      : 'bg-white/5 hover:bg-black'
                  }`}
                  onClick={() => {
                    const newActiveBrand = activeBrand === brand.name ? null : brand.name
                    setActiveBrand(newActiveBrand)
                    if (newActiveBrand) {
                      setIsLoadingVehicles(true)
                      // Simulate loading time for better UX
                      setTimeout(() => setIsLoadingVehicles(false), 300)
                    }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-white text-xl font-bold">{brand.name}</div>
                      <div className="text-white/70 text-sm">{brand.slogan || 'Tactical vehicle platform'}</div>
                    </div>
                    <span className="text-[#ff8c42] absolute top-4 right-4">&gt;</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Section: TSPORT Lineup */}
          <div className="bg-black/20 backdrop-blur-xl text-white border-l border-white/10 relative">
            {/* Header */}
            <div className="h-24 px-6 flex items-center border-b border-white/10 bg-black/20 backdrop-blur-xl">
              <div>
                <div className={`${orbitron.className} uppercase tracking-[0.18em] text-[#ff8c42] text-lg`}>
                  {activeBrand ? `${activeBrand}` : 'Vehicles'}
                </div>
                <div className="uppercase text-white text-xs tracking-widest mt-1">
                  {activeBrand ? 'Brand Vehicles' : 'Models Lineup'}
                </div>
              </div>
            </div>

            {/* Vehicle Content - Using filtered vehicle data */}
            <div className="p-6 overflow-y-auto h-[calc(100%-6rem)]">
              {isLoadingVehicles ? (
                <div className="flex items-center justify-center h-32">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff8c42]"></div>
                    <div className="text-white/70 text-sm">Loading vehicles...</div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {groupedByManufacturer.map((group) => (
                    <div key={group.name}>
                      <h3 className={`${orbitron.className} text-right uppercase tracking-[0.14em] text-white/90 mb-3`}>{group.name}</h3>
                      {group.vehicles.map((v) => (
                        <Link
                          key={v._id}
                          href={`/vehicles/${(v as any).slug?.current}`}
                          onClick={() => setIsMegaOpen(false)}
                          className="block rounded-lg border border-white/20 bg-white/5 hover:bg-black p-4 transition-colors mb-2"
                        >
                          <div className="flex items-start gap-4">
                            <div className="flex-1">
                              <div className="text-white text-sm font-bold uppercase leading-tight">{v.title}</div>
                              <div className="text-[#ff8c42] text-sm font-semibold mt-1">FROM $XX,XXX</div>
                            </div>
                            <div className="w-16 h-12 bg-gray-700 rounded flex items-center justify-center">
                              <span className="text-white/50 text-xs">IMG</span>
                            </div>
                          </div>
                        </Link>
                      ))}
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


