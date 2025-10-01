'use client'

import { useMemo, useState, useCallback } from 'react'
import Image from 'next/image'
import LazyImage from './LazyImage'
import SkeletonImageGrid from './SkeletonImageGrid'
import { urlForImage } from '@/sanity/lib/utils'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'

interface VehicleGalleryProps {
  gallery: any[]
  vehicleTitle: string
  activeFilter?: string | null
  onClearFilter?: () => void
}

export default function VehicleGallery({ gallery, vehicleTitle, activeFilter, onClearFilter }: VehicleGalleryProps) {
  const [loadedBatches, setLoadedBatches] = useState<Set<number>>(new Set())
  const [loadingBatches, setLoadingBatches] = useState<Set<number>>(new Set())
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const handleBatchLoad = useCallback((batchIndex: number) => {
    if (loadedBatches.has(batchIndex)) return

    setLoadingBatches(prev => new Set([...prev, batchIndex]))
    setLoadedBatches(prev => new Set([...prev, batchIndex]))
  }, [loadedBatches])

  if (!gallery || gallery.length === 0) return null

  // Calculate how many images need skeleton loading
  const lazyImages = gallery.slice(6) // Images 7+
  const totalBatches = Math.ceil(lazyImages.length / 4)
  const loadedBatchesCount = loadedBatches.size
  const remainingBatches = totalBatches - loadedBatchesCount

  const slides = useMemo(() => {
    const items: Array<{ src: string; description?: string }> = []
    ;(gallery || []).forEach((image: any) => {
      try {
        const builder = urlForImage(image)
        if (!builder) return
        const src = builder.width(2000).height(1334).fit('max').url()
        if (!src) return
        items.push({ src, description: image?.caption || `${vehicleTitle}` })
      } catch {
        // skip invalid images
      }
    })
    return items
  }, [gallery, vehicleTitle])

  return (
    <section className="py-8 pb-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Filter Header */}
        {activeFilter && (
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-lg font-semibold text-gray-700">
                Filtered by: <span className="text-blue-600 capitalize">{activeFilter}</span>
              </span>
              <span className="text-sm text-gray-500">
                {gallery.length} image{gallery.length !== 1 ? 's' : ''} found
              </span>
            </div>
            {onClearFilter && (
              <button
                onClick={onClearFilter}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 text-sm font-medium"
              >
                Clear Filter
              </button>
            )}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-[200px]">
          {gallery.map((image: any, idx: number) => {
            // Determine grid span based on image index and aspect ratio
            const getGridSpan = (index: number) => {
              const patterns = [
                { col: 1, row: 1 }, // normal
                { col: 2, row: 1 }, // wide
                { col: 1, row: 2 }, // tall
                { col: 1, row: 1 }, // normal
                { col: 2, row: 2 }, // large
                { col: 1, row: 1 }, // normal
                { col: 1, row: 2 }, // tall
                { col: 2, row: 1 }, // wide
                { col: 1, row: 1 }, // normal
                { col: 1, row: 1 }, // normal
              ]
              return patterns[index % patterns.length]
            }
            
            const gridSpan = getGridSpan(idx)
            const imageUrl = urlForImage(image)?.url()
            
            // Load first 6 images immediately, lazy load the rest in batches of 4
            const shouldLazyLoad = idx >= 6
            const batchIndex = Math.floor((idx - 6) / 4)
            const isBatchLoaded = loadedBatches.has(batchIndex)
            const isBatchLoading = loadingBatches.has(batchIndex)
            
            if (!imageUrl) {
              return (
                <div 
                  key={idx} 
                  className={`relative rounded-md overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gray-200 flex items-center justify-center`}
                  style={{
                    gridColumn: `span ${gridSpan.col}`,
                    gridRow: `span ${gridSpan.row}`
                  }}
                >
                  <span className="text-gray-400">No Image</span>
                </div>
              )
            }
            
            if (shouldLazyLoad) {
              // Show skeleton for images that are loading
              if (isBatchLoading && !isBatchLoaded) {
                return (
                  <div 
                    key={idx} 
                    className={`relative rounded-md overflow-hidden shadow-lg`}
                    style={{
                      gridColumn: `span ${gridSpan.col}`,
                      gridRow: `span ${gridSpan.row}`
                    }}
                  >
                    <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                    </div>
                  </div>
                )
              }
              
              return (
                <LazyImage
                  key={idx}
                  src={urlForImage(image)!.width(1200).height(800).fit('crop').url()}
                  alt={image.alt || `${vehicleTitle} Gallery Image ${idx + 1}`}
                  fill
                  aspectClass=""
                  caption={image.caption}
                  batchIndex={batchIndex}
                  onBatchLoad={handleBatchLoad}
                  onClick={() => { setLightboxIndex(idx); setLightboxOpen(true) }}
                  className="relative rounded-md overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                  style={{
                    gridColumn: `span ${gridSpan.col}`,
                    gridRow: `span ${gridSpan.row}`
                  }}
                />
              )
            }
            
            // Render first 6 images immediately
            return (
              <div 
                key={idx} 
                className="relative rounded-md overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer" 
                onClick={() => { setLightboxIndex(idx); setLightboxOpen(true) }}
                style={{
                  gridColumn: `span ${gridSpan.col}`,
                  gridRow: `span ${gridSpan.row}`
                }}
              >
                <Image
                  src={urlForImage(image)!.width(1200).height(800).fit('crop').url()}
                  alt={image.alt || `${vehicleTitle} Gallery Image ${idx + 1}`}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
                {image.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white p-4">
                    <p className="text-sm font-medium">{image.caption}</p>
                  </div>
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all duration-300 rounded-md" />
              </div>
            )
          })}
        </div>
        
        {/* Show skeleton grid for remaining batches */}
        {remainingBatches > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-[200px]">
            {Array.from({ length: remainingBatches * 4 }).map((_, idx) => (
              <div 
                key={`skeleton-${idx}`}
                className="relative rounded-md overflow-hidden shadow-lg bg-gray-200 animate-pulse flex items-center justify-center"
                style={{
                  gridColumn: `span 1`,
                  gridRow: `span 1`
                }}
              >
                <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
              </div>
            ))}
          </div>
        )}
        {/* Lightbox for gallery images */}
        {slides.length > 0 && (
          <Lightbox
            open={lightboxOpen}
            close={() => setLightboxOpen(false)}
            slides={slides}
            index={lightboxIndex}
          />
        )}
      </div>
    </section>
  )
}
