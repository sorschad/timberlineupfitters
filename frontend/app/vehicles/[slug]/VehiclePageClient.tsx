'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { urlForImage } from '@/sanity/lib/utils'
import VehicleGallery from '@/app/components/VehicleGallery'

interface Vehicle {
  _id: string
  title: string
  slug: { current: string }
  model: string
  vehicleType: string
  modelYear: number
  trim?: string
  manufacturer: {
    _id: string
    name: string
    logo?: any
  }
  coverImage?: any
  headerVehicleImage?: any
  vehicleDetailsPageHeaderBackgroundImage?: {
    asset?: any
    alt?: string
    hotspot?: any
    crop?: any
  }
  gallery?: any[]
  videoTour?: any
  specifications?: any
  features?: any
  customizationOptions?: any[]
  inventory?: any
  description?: any[]
  tags?: string[]
  seo?: any
}

interface VehiclePageClientProps {
  vehicle: Vehicle
}


export default function VehiclePageClient({ vehicle }: VehiclePageClientProps) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [isScrolling, setIsScrolling] = useState(false)
  const [scrollComplete, setScrollComplete] = useState(false)
  
  // Debug: Log vehicle data to see what's available
  console.log('Vehicle data:', vehicle)
  console.log('Header background image alt text:', vehicle.vehicleDetailsPageHeaderBackgroundImage?.alt)
  
  // Get alt text from header background image for subtitle
  const headerAltText = vehicle.vehicleDetailsPageHeaderBackgroundImage?.alt || ''
  
  console.log('Final headerAltText:', headerAltText) // Debug log

  // Define filter tags for each card
  const filterCards = [
    {
      id: 'exterior',
      title: 'Exterior',
      description: 'unique + styled',
      tag: 'exterior'
    },
    {
      id: 'interior',
      title: 'Interior',
      description: 'custom comforts',
      tag: 'interior'
    },
    {
      id: 'audio',
      title: 'Sound',
      description: 'high-fidelity audio',
      tag: 'audio'
    },
    {
      id: 'accessories',
      title: 'Accessories',
      description: 'bumpers, lights, toolboxes',
      tag: 'accessories'
    },
  ]

  // Filter gallery images based on active filter
  const getFilteredGallery = () => {
    if (!vehicle.gallery || !activeFilter) return vehicle.gallery

    return vehicle.gallery.filter((image: any) => {
      // Check if image has tags that match the active filter
      const imageTags = image.tags || []
      return imageTags.some((tag: string) => 
        tag.toLowerCase().includes(activeFilter.toLowerCase())
      )
    })
  }

  const filteredGallery = getFilteredGallery()

  // Enhanced scroll detection for Features & Options section
  useEffect(() => {
    const handleScroll = () => {
      const featuresSection = document.getElementById('features-options-section')
      if (featuresSection) {
        const rect = featuresSection.getBoundingClientRect()
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0
        
        if (isVisible && scrollComplete) {
          // Trigger animation for first section when Features & Options comes into view
          const firstSection = featuresSection.querySelector('[data-category="exteriorFeatures"]')
          if (firstSection) {
            setTimeout(() => {
              firstSection.classList.add('animate-expand')
            }, 300)
          }
        }
      }
    }

    if (scrollComplete) {
      window.addEventListener('scroll', handleScroll)
      handleScroll() // Check immediately
    }

    return () => window.removeEventListener('scroll', handleScroll)
  }, [scrollComplete])


  return (
    <div className="scroll-smooth">
      {/* Hero Section - Scenic Background with Vehicle */}
      <section 
        className="relative min-h-[50vh] lg:min-h-[320px] text-white overflow-hidden"
        style={{
          backgroundImage: (vehicle.vehicleDetailsPageHeaderBackgroundImage && urlForImage(vehicle.vehicleDetailsPageHeaderBackgroundImage)?.url())
            ? `url(${urlForImage(vehicle.vehicleDetailsPageHeaderBackgroundImage)?.width(1920).height(1080).fit('crop').url()})`
            : (vehicle.coverImage && urlForImage(vehicle.coverImage)?.url())
              ? `url(${urlForImage(vehicle.coverImage)?.width(1920).height(1080).fit('crop').url()})`
              : 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #1d4ed8 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-black/50" />
        
        <div className="relative z-10 container mx-auto px-4 pt-32 md:pt-32 pb-40 min-h-[500px]">
          {/* Mobile Layout - Stacked */}
          <div className="lg:hidden space-y-8">
            {/* Main Headline */}
            <h1 className="text-center text-5xl md:text-4xl font-bold leading-none mb-2">
              {vehicle.title}
            </h1>
            
            {/* Vehicle Model */}
            {vehicle.model && (
              <p className="text-xl font-medium text-white/70 max-w-lg leading-tight text-center mx-auto mb-2 uppercase">
                {vehicle.model}
              </p>
            )}
            
            {/* Subtitle */}
            <p className="text-lg font-normal text-white max-w-lg leading-tight text-center mx-auto">
              {headerAltText}
            </p>
            
            {/* Vehicle Image - Mobile Only */}
            <div className="relative flex justify-center min-h-[400px]">
              {(vehicle.headerVehicleImage && urlForImage(vehicle.headerVehicleImage)?.url()) ? (
                <div className="relative hidden">
                  <Image
                    src={urlForImage(vehicle.headerVehicleImage)!.width(1200).height(800).fit('crop').url()}
                    alt={vehicle.title}
                    width={600}
                    height={400}
                    className="rounded-2xl shadow-2xl"
                  />
                </div>
              ) : (vehicle.coverImage && urlForImage(vehicle.coverImage)?.url() ? (
                <div className="relative hidden">
                  <Image
                    src={urlForImage(vehicle.coverImage)!.width(1200).height(800).fit('crop').url()}
                    alt={vehicle.title}
                    width={600}
                    height={400}
                    className="rounded-2xl shadow-2xl"
                  />
                </div>
              ) : (
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl h-96 w-96 flex items-center justify-center">
                  <span className="text-6xl font-bold text-gray-400">
                    {vehicle.manufacturer.name.charAt(0)}
                  </span>
                </div>
              ))}
            </div>
            
            {/* CTA Button - Mobile Only, positioned after vehicle image */}
            <div className="mt-6">
              <button 
                onClick={() => {
                  console.log('Mobile button clicked') // Debug log
                  setIsScrolling(true)
                  setScrollComplete(false)
                  
                  // Wait for DOM to be ready and try to find the section
                  const scrollToFeatures = () => {
                    const featuresSection = document.getElementById('features-options-section')
                    console.log('Features section found:', featuresSection) // Debug log
                    
                    if (featuresSection) {
                      // Add offset for sticky header
                      const offset = 80
                      const elementPosition = featuresSection.offsetTop - offset
                      console.log('Scrolling to position:', elementPosition) // Debug log
                      
                      // Smooth scroll to the Features & Options section
                      window.scrollTo({
                        top: elementPosition,
                        behavior: 'smooth'
                      })
                      
                      // Wait for scroll animation to complete
                      setTimeout(() => {
                        setIsScrolling(false)
                        setScrollComplete(true)
                      }, 1200) // Slightly longer to ensure scroll is complete
                    } else {
                      console.log('Features section not found, using fallback') // Debug log
                      // Fallback: scroll to bottom of page if section not found
                      window.scrollTo({
                        top: document.body.scrollHeight,
                        behavior: 'smooth'
                      })
                      setTimeout(() => {
                        setIsScrolling(false)
                        setScrollComplete(true)
                      }, 1000)
                    }
                  }
                  
                  // Try immediately, then retry after a short delay if not found
                  scrollToFeatures()
                  if (!document.getElementById('features-options-section')) {
                    setTimeout(scrollToFeatures, 100)
                  }
                }}
                className="bg-white text-black px-8 py-4 rounded-sm font-semibold text-lg hover:bg-white/90 transition-all duration-300 shadow-lg hover:scale-105 w-full cursor-pointer"
              >
                {isScrolling ? 'Scrolling...' : 'explore features'}
              </button>
            </div>
          </div>

          {/* Desktop Layout - Grid */}
          <div className="hidden lg:grid lg:grid-cols-2 gap-12 items-center h-full">
            {/* Left Content */}
            <div className="space-y-8">
              {/* Main Headline */}
              <h1 className="uppercase text-center sm:text-left text-4xl md:text-6xl font-extrabold leading-none mb-1">
                {vehicle.title}
              </h1>
              
              {/* Vehicle Model */}
              {vehicle.model && (
                <p className="text-xl font-bold text-white/70 max-w-lg leading-tight mb-1 uppercase">
                  {vehicle.model}
                </p>
              )}
              
              {/* Subtitle */}
              <p className="text-lg font-base text-white max-w-lg leading-tight">
                {headerAltText}
              </p>
              
              {/* CTA Button - Desktop Only */}
              <button 
                onClick={() => {
                  setIsScrolling(true)
                  setScrollComplete(false)
                  
                  // Target the Features & Options section
                  const featuresSection = document.getElementById('features-options-section')
                  if (featuresSection) {
                    // Add offset for sticky header
                    const offset = 80
                    const elementPosition = featuresSection.offsetTop - offset
                    
                    // Smooth scroll to the Features & Options section
                    window.scrollTo({
                      top: elementPosition,
                      behavior: 'smooth'
                    })
                    
                    // Wait for scroll animation to complete
                    setTimeout(() => {
                      setIsScrolling(false)
                      setScrollComplete(true)
                    }, 1200) // Slightly longer to ensure scroll is complete
                  } else {
                    // Fallback: scroll to bottom of page if section not found
                    window.scrollTo({
                      top: document.body.scrollHeight,
                      behavior: 'smooth'
                    })
                    setTimeout(() => {
                      setIsScrolling(false)
                      setScrollComplete(true)
                    }, 1000)
                  }
                }}
                className="bg-white text-black px-8 py-4 rounded-sm font-semibold text-lg hover:bg-white/90 transition-all duration-300 shadow-lg hover:scale-105 w-full sm:w-auto cursor-pointer"
              >
                {isScrolling ? 'Scrolling...' : 'explore features'}
              </button>
            </div>
            

            <div className="relative flex justify-center lg:justify-end min-h-[500px]">
                &nbsp;
            </div>
          </div>
          
        </div>
        
        {/* Fade Transition Section */}
        <div className="absolute bottom-0 left-0 right-0 z-0">
          <div className="relative">
            {/* Softened gradient fade overlay */}
            <div className="h-20 bg-gradient-to-b from-transparent via-white/5 to-white/40"></div>
            <div className="h-20 bg-gradient-to-b from-white/40 via-white/70 to-white"></div>
            
            {/* Dynamic subtitle section with smooth transition */}
            <div className="bg-white">
              <div className="container mx-auto px-4">
                <div className="text-center">
                  <h2 className="uppercase text-3xl md:text-4xl lg:text-4xl font-bold text-gray-900/80 mb-4 animate-fade-in">
                    Features we Love
                  </h2>
                  <p className="text-base md:text-lg text-gray-600/70 max-w-3xl mx-auto animate-fade-in-delay">
                    features and options available on this vehicle
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section - Now with Filtering */}
      <VehicleGallery 
        gallery={filteredGallery || []} 
        originalGallery={vehicle.gallery || []}
        vehicleTitle={vehicle.title}
        activeFilter={activeFilter}
        onClearFilter={() => setActiveFilter(null)}
        filterCards={filterCards}
        onFilterChange={(tag) => setActiveFilter(tag)}
      />
    </div>
  )
}
