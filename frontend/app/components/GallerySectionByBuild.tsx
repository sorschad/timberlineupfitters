'use client'

import { useState } from 'react'
import Image from 'next/image'
import Lightbox from 'yet-another-react-lightbox'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/thumbnails.css'

interface Manufacturer {
  _id: string
  name: string
  vehicles?: any[]
  galleryImages?: Array<{
    image: any
    caption: string
    category: string
    altText?: string
  }>
}

interface GallerySectionProps {
  manufacturer: Manufacturer
}

interface GalleryImage {
  id: string
  src: string
  alt: string
  caption: string
  category: string
}

interface BuildGallery {
  buildName: string
  images: GalleryImage[]
}

// Convert CMS gallery images to component format and group by build
const getBuildGalleries = (manufacturer: Manufacturer): BuildGallery[] => {
  if (!manufacturer.galleryImages || manufacturer.galleryImages.length === 0) {
    // Fallback to mock data if no CMS images
    const baseImages = [
      {
        id: '1',
        src: '/images/gallery/action-shot-1.jpg',
        alt: `${manufacturer.name} vehicle in action`,
        caption: 'Conquering mountain trails with confidence',
        category: 'adventure',
        buildName: 'Adventure Build'
      },
      {
        id: '2',
        src: '/images/gallery/worksite-1.jpg',
        alt: `${manufacturer.name} at worksite`,
        caption: 'Built for the toughest jobs',
        category: 'work',
        buildName: 'Work Build'
      },
      {
        id: '3',
        src: '/images/gallery/camping-1.jpg',
        alt: `${manufacturer.name} camping setup`,
        caption: 'Your adventure basecamp',
        category: 'lifestyle',
        buildName: 'Lifestyle Build'
      }
    ]

    const images = baseImages.map(img => ({
      ...img,
      src: img.src.replace('manufacturer', manufacturer.name.toLowerCase())
    }))

    // Group by build name
    const buildMap = new Map<string, GalleryImage[]>()
    images.forEach(img => {
      const buildName = (img as any).buildName || 'Default Build'
      if (!buildMap.has(buildName)) {
        buildMap.set(buildName, [])
      }
      buildMap.get(buildName)!.push(img)
    })

    return Array.from(buildMap.entries()).map(([buildName, images]) => ({
      buildName,
      images
    }))
  }

  // Convert CMS images to component format
  const images = manufacturer.galleryImages.map((img, index) => ({
    id: `cms-${index}`,
    src: img.image?.asset?.url || '',
    alt: img.altText || `${manufacturer.name} ${img.caption}`,
    caption: img.caption,
    category: img.category,
    buildName: img.category // Use category as build name for now
  }))

  // Group by build name
  const buildMap = new Map<string, GalleryImage[]>()
  images.forEach(img => {
    const buildName = (img as any).buildName || 'Default Build'
    if (!buildMap.has(buildName)) {
      buildMap.set(buildName, [])
    }
    buildMap.get(buildName)!.push(img)
  })

  return Array.from(buildMap.entries()).map(([buildName, images]) => ({
    buildName,
    images
  }))
}

export default function GallerySectionByBuild({ manufacturer }: GallerySectionProps) {
  const [open, setOpen] = useState(false)
  const [currentBuildIndex, setCurrentBuildIndex] = useState(0)
  
  const buildGalleries = getBuildGalleries(manufacturer)

  // If no galleries, return null
  if (buildGalleries.length === 0) {
    return null
  }

  return (
    <section className="py-20 bg-white">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {manufacturer.name} Builds
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our {manufacturer.name} vehicle builds. Each build showcases 
            unique configurations designed for specific adventures and work environments.
          </p>
        </div>

        {/* Build Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {buildGalleries.map((build, buildIndex) => {
            const coverImage = build.images[0] // First image as cover
            const slides = build.images.map(img => ({
              src: img.src,
              alt: img.alt,
              description: img.caption
            }))

            return (
              <div
                key={build.buildName}
                className="group cursor-pointer"
                onClick={() => {
                  setCurrentBuildIndex(buildIndex)
                  setOpen(true)
                }}
              >
                <div className="relative overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300 transform">
                  <div className="aspect-[4/3] relative">
                    <Image
                      src={coverImage.src}
                      alt={coverImage.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />
                    
                    {/* Overlay Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="text-white text-center">
                        <h3 className="text-xl font-bold mb-2">
                          {build.buildName}
                        </h3>
                        <p className="text-sm mb-3">
                          {build.images.length} {build.images.length === 1 ? 'photo' : 'photos'}
                        </p>
                        <div className="flex items-center justify-center gap-2">
                          <span className="bg-timberline-orange px-3 py-1 rounded-full text-sm font-medium">
                            View Gallery
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Build Info */}
                <div className="mt-4 text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {build.buildName}
                  </h3>
                </div>
              </div>
            )
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <p className="text-lg text-gray-600 mb-8">
            Have photos of your {manufacturer.name} in action? Share them with us!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-timberline-orange hover:bg-timberline-orange/90 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
              Share Your Photos
            </button>
            <button className="bg-white hover:bg-gray-50 text-gray-900 px-8 py-4 rounded-full font-semibold transition-all duration-300 border border-gray-200">
              View Full Gallery
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox with Thumbnails */}
      {buildGalleries.length > 0 && (
        <Lightbox
          open={open}
          close={() => setOpen(false)}
          slides={buildGalleries[currentBuildIndex]?.images.map(img => ({
            src: img.src,
            alt: img.alt,
            description: img.caption
          })) || []}
          plugins={[Thumbnails]}
          thumbnails={{ 
            position: "bottom", 
            width: 100, 
            height: 70,
            gap: 8
          }}
        />
      )}
    </section>
  )
}
