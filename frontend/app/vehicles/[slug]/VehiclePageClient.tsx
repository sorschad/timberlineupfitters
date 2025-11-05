'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { urlForImage } from '@/sanity/lib/utils'
import VehicleGallery from '@/app/components/VehicleGallery'
import VehicleHeroSection from '@/app/components/VehicleHeroSection'
import VehicleDescriptionSection from '@/app/components/VehicleDescriptionSection'
import VehicleGalleryShowcase from '@/app/components/VehicleGalleryShowcase'
// import WarrantyDetailsComponent from '@/app/components/WarrantyDetailsComponent'

interface Vehicle {
  _id: string
  title: string
  slug: { current: string }
  model: string
  vehicleType: string
  modelYear: number
  brand?: string
  trim?: string
  manufacturer: {
    _id: string
    name: string
    logo?: any
  }
  coverImage?: any
  vehicleDetailsPageHeaderBackgroundImage?: {
    asset?: any
    alt?: string
    hotspot?: any
    crop?: any
  }
  gallery?: any[]
  videoTour?: any
  specifications?: any
  features?: {
    baseFeatures?: string[]
    additionalOptions?: string[]
  }
  associatedVehicles?: Array<{
    _id: string
    title: string
    slug: { current: string }
    model: string
    modelYear: number
    brand: string
    manufacturer: {
      _id: string
      name: string
    }
    coverImage?: {
      asset?: {
        _id: string
        url: string
      }
      alt?: string
    }
    excerpt?: string
  }>
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
          const firstSection = featuresSection.querySelector('[data-category="baseFeatures"]')
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


  const handleScrollToFeatures = () => {
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
  }

  return (
    <div className="scroll-smooth">
      <VehicleHeroSection 
        vehicle={vehicle}
        onScrollToFeatures={handleScrollToFeatures}
        isScrolling={isScrolling}
      />
      
      <VehicleDescriptionSection vehicle={vehicle} />
      
      <VehicleGallery
        gallery={filteredGallery || []}
        originalGallery={vehicle.gallery || []}
        vehicleTitle={vehicle.title}
        activeFilter={activeFilter}
        onClearFilter={() => setActiveFilter(null)}
        filterCards={filterCards}
        onFilterChange={(tag) => setActiveFilter(tag)}
        useBuildGallery={true}
      />
      
      <VehicleGalleryShowcase vehicle={vehicle} />
      
      {/* <WarrantyDetailsComponent vehicle={vehicle} /> */}
    </div>
  )
}
