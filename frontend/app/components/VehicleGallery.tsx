'use client'

import { useMemo, useState, useEffect } from 'react'
import Image from 'next/image'
import { urlForImage } from '@/sanity/lib/utils'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'

interface VehicleGalleryProps {
  gallery: any[]
  vehicleTitle: string
  activeFilter?: string | null
  onClearFilter?: () => void
  filterCards?: Array<{
    id: string
    title: string
    description: string
    tag: string
  }>
  onFilterChange?: (tag: string | null) => void
}

export default function VehicleGallery({ gallery, vehicleTitle, activeFilter, onClearFilter, filterCards, onFilterChange }: VehicleGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [gridCols, setGridCols] = useState(4)

  // Track responsive grid columns to compute filler span
  useEffect(() => {
    const computeCols = () => {
      const w = typeof window !== 'undefined' ? window.innerWidth : 1920
      if (w >= 1280) return 4
      if (w >= 1024) return 3
      if (w >= 768) return 2
      return 1
    }
    const update = () => setGridCols(computeCols())
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  if (!gallery || gallery.length === 0) return null

  // Build a stable, filtered list of renderable images so tile indexes match lightbox indexes
  const validImages = useMemo(() => {
    return (gallery || []).filter((img: any) => {
      try {
        return Boolean(urlForImage(img)?.url())
      } catch {
        return false
      }
    })
  }, [gallery])

  // No lazy loading; render all images immediately

  const slides = useMemo(() => {
    const items: Array<{ src: string; description?: string }> = []
    ;(validImages || []).forEach((image: any) => {
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
  }, [validImages, vehicleTitle])

  return (
    <section className="py-8 pb-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Filter Cards Section */}
        {filterCards && filterCards.length > 0 && (
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Features You'll Love</h2>
              <div className="w-16 h-0.5 bg-[#9c8a7e] mx-auto text-center justify-center"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {filterCards.map((card) => (
                <button
                  key={card.id}
                  onClick={() => onFilterChange?.(activeFilter === card.tag ? null : card.tag)}
                  className={`bg-white rounded-xl p-6 text-center border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg relative ${
                    activeFilter === card.tag 
                      ? 'border-orange-500 bg-orange-50 shadow-lg shadow-orange-100' 
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-lg font-bold text-gray-900 mb-3 leading-tight">
                    {card.title}
                  </div>
                  <div className="text-sm text-gray-400 mb-0 leading-snug">
                    {card.description}
                  </div>
                  {activeFilter === card.tag && (
                    <div className="text-xs text-orange-600 font-semibold mt-2 flex items-center justify-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Active Filter
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onFilterChange?.(null)
                        }}
                        className="ml-2 w-4 h-4 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer"
                        aria-label="Clear filter"
                      >
                        <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-[200px] grid-flow-dense">
          {validImages.map((image: any, idx: number) => {
            // Get grid span from Sanity data or use defaults
            const getGridSpan = (image: any, currentGridCols: number) => {
              const gridSpan = image?.gridSpan
              if (!gridSpan) {
                // Default fallback pattern
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
                return patterns[idx % patterns.length]
              }

              // Use responsive grid span based on current grid columns
              let span
              if (currentGridCols >= 3 && gridSpan.desktop) {
                span = gridSpan.desktop
              } else if (currentGridCols >= 2 && gridSpan.tablet) {
                span = gridSpan.tablet
              } else if (gridSpan.mobile) {
                span = gridSpan.mobile
              } else {
                // Fallback to defaults
                return { col: 1, row: 1 }
              }

              return { col: span.col || 1, row: span.row || 1 }
            }
            
            const gridSpan = getGridSpan(image, gridCols)
            const isLast = idx === (validImages?.length || 0) - 1
            const imageUrl = urlForImage(image)?.url()
            
            if (!imageUrl) {
              return null
            }
            
            // When filter is active, override grid spans to fill empty space
            const getFilteredGridSpan = () => {
              if (!activeFilter) {
                return {
                  gridColumn: isLast ? '1 / -1' : `span ${gridSpan.col}`,
                  gridRow: isLast ? 'span 2' : `span ${gridSpan.row}`
                }
              }
              
              // When filtering, make images larger to fill space
              const totalImages = validImages.length
              if (totalImages <= 2) {
                // For 1-2 images, make them span full width
                return {
                  gridColumn: '1 / -1',
                  gridRow: 'span 2'
                }
              } else if (totalImages <= 4) {
                // For 3-4 images, make them span half width
                return {
                  gridColumn: `span ${Math.max(2, Math.floor(gridCols / 2))}`,
                  gridRow: 'span 2'
                }
              } else {
                // For 5+ images, use original spans but slightly larger
                return {
                  gridColumn: `span ${Math.min(gridCols, gridSpan.col + 1)}`,
                  gridRow: `span ${gridSpan.row + 1}`
                }
              }
            }
            
            const filteredGridStyle = getFilteredGridSpan()
            
            // Render all images immediately
            const lastBlock = (
              <div 
                key={idx} 
                className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer bg-white border border-gray-100" 
                onClick={() => { setLightboxIndex(idx); setLightboxOpen(true) }}
                style={filteredGridStyle}
              >
                <Image
                  src={urlForImage(image)!.width(1200).height(800).fit('crop').url()}
                  alt={image.alt || `${vehicleTitle} Gallery Image ${idx + 1}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                {image.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent text-white p-4">
                    <p className="text-sm font-medium leading-relaxed">{image.caption}</p>
                  </div>
                )}
                {/* Subtle hover overlay with professional styling */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/0 via-transparent to-white/5 group-hover:from-black/10 group-hover:via-black/5 group-hover:to-white/10 transition-all duration-500 ease-out" />
                {/* Info button overlay */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-black/80 text-white text-xs font-medium px-3 py-1.5 rounded-lg backdrop-blur-sm">
                    Info
                  </div>
                </div>
              </div>
            )
            return lastBlock
          })}
        </div>
        
        {/* No skeleton grid; all images render immediately */}
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
