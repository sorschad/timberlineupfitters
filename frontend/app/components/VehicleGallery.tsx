'use client'

import { useMemo, useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { urlForImage } from '@/sanity/lib/utils'
import { IMAGE_SIZES } from '@/sanity/lib/imageUtils'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'

interface VehicleGalleryProps {
  gallery: any[]
  originalGallery?: any[] // Add original gallery for empty state detection
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

export default function VehicleGallery({ gallery, originalGallery, vehicleTitle, activeFilter, onClearFilter, filterCards, onFilterChange }: VehicleGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [gridCols, setGridCols] = useState(4)
  const [isResizing, setIsResizing] = useState(false)

  // Debounced resize handler for smooth performance
  const debouncedResize = useCallback(() => {
    let timeoutId: NodeJS.Timeout
    return () => {
      setIsResizing(true)
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        const w = typeof window !== 'undefined' ? window.innerWidth : 1920
        let newCols: number
        
        if (w >= 1536) newCols = 5      // 2xl: 5 columns
        else if (w >= 1280) newCols = 4 // xl: 4 columns  
        else if (w >= 1024) newCols = 3 // lg: 3 columns
        else if (w >= 768) newCols = 2   // md: 2 columns
        else newCols = 1                 // sm: 1 column
        
        setGridCols(newCols)
        setIsResizing(false)
      }, 150) // 150ms debounce
    }
  }, [])

  // Enhanced responsive grid columns with smooth transitions
  useEffect(() => {
    const computeCols = () => {
      const w = typeof window !== 'undefined' ? window.innerWidth : 1920
      if (w >= 1536) return 5      // 2xl: 5 columns
      if (w >= 1280) return 4       // xl: 4 columns  
      if (w >= 1024) return 3      // lg: 3 columns
      if (w >= 768) return 2       // md: 2 columns
      return 1                      // sm: 1 column
    }
    
    const update = () => setGridCols(computeCols())
    update()
    
    const debouncedUpdate = debouncedResize()
    window.addEventListener('resize', debouncedUpdate)
    
    return () => {
      window.removeEventListener('resize', debouncedUpdate)
    }
  }, [debouncedResize])

  // Build a stable, filtered list of renderable images so tile indexes match lightbox indexes
  const validImages = useMemo(() => {
    if (!gallery || gallery.length === 0) return []
    return (gallery || []).filter((img: any) => {
      try {
        return Boolean(urlForImage(img)?.url())
      } catch {
        return false
      }
    })
  }, [gallery])

  // Group images by caption for automatic organization
  const groupedImages = useMemo(() => {
    if (!validImages || validImages.length === 0) return []
    
    // Group images by caption
    const groups = validImages.reduce((acc: any, image: any, index: number) => {
      const caption = image?.caption || 'General'
      
      if (!acc[caption]) {
        acc[caption] = []
      }
      acc[caption].push({ ...image, originalIndex: index })
      
      return acc
    }, {})
    
    // Convert to array format for rendering, sorted alphabetically by caption
    return Object.entries(groups)
      .map(([caption, images]) => ({
        caption,
        images: images as any[]
      }))
      .sort((a, b) => a.caption.localeCompare(b.caption))
  }, [validImages])

  // No lazy loading; render all images immediately

  const slides = useMemo(() => {
    const items: Array<{ src: string; description?: string }> = []
    groupedImages.forEach(group => {
      group.images.forEach((image: any) => {
        try {
          const builder = urlForImage(image)
          if (!builder) return
          const src = builder.width(2000).height(1334).fit('max').url()
          if (!src) return
          items.push({ 
            src, 
            description: image?.caption || `${vehicleTitle} - ${group.caption}` 
          })
        } catch {
          // skip invalid images
        }
      })
    })
    return items
  }, [groupedImages, vehicleTitle])

  // Check if we have any gallery images at all (use original gallery if available, otherwise use current gallery)
  const sourceGallery = originalGallery || gallery
  const hasAnyGalleryImages = sourceGallery && sourceGallery.length > 0


  // If there are no gallery images at all, don't render the section
  if (!hasAnyGalleryImages) return null

  return (
    <section id="vehicle-gallery-section" className="py-8 pb-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Filter Cards Section - Always show if filterCards exist */}
        {filterCards && filterCards.length > 0 && (
          <div className="top-4 z-10 mb-8">
            <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {filterCards.map((card) => (
              <div
                key={card.id}
                onClick={() => onFilterChange?.(activeFilter === card.tag ? null : card.tag)}
                className={`bg-white rounded-lg px-4 py-3 text-center border transition-all duration-200 hover:shadow-md hover:cursor-pointer relative ${
                  activeFilter === card.tag 
                    ? 'border-orange-500 bg-orange-50 shadow-md shadow-orange-100' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="text-sm font-semibold text-gray-900 mb-1 leading-tight">
                  {card.title}
                </div>
                <div className="text-xs text-gray-500 mb-0 leading-tight">
                  {card.description}
                </div>
                {/* Active Filter Badge - Absolutely Positioned */}
                {activeFilter === card.tag && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white rounded-full shadow-md border border-white opacity-85">
                    <div className="flex items-center px-1.5 py-0">
                      <span className="text-xs font-medium lowercase">active</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onFilterChange?.(null)
                        }}
                        className="ml-0.5 w-3 h-3 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer"
                        aria-label="Clear filter"
                      >
                        <svg className="w-1.5 h-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            </div>
          </div>
        )}

        
        {/* Gallery Grid with Grouping or Empty State */}
        {groupedImages.length > 0 ? (
          <div className="space-y-12">
            {groupedImages.map((group, groupIndex) => (
              <div key={group.caption} className="gallery-group">
                {/* Section Header */}
                <div className="mb-6 mr-0 ml-0 sm:mr-1.5 sm:ml-1.5">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {group.caption}
                  </h3>
                  <div className="min-w-12 w-full h-0.5 bg-orange-500/35"></div>
                </div>
                
                {/* Group Grid */}
                <div 
                  className={`grid gap-6 auto-rows-[200px] grid-flow-dense transition-all duration-300 ease-in-out ${
                    isResizing ? 'opacity-75' : 'opacity-100'
                  }`}
                  style={{
                    gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`
                  }}
                >
                  {group.images.map((image: any, idx: number) => {
                    // Calculate global index for lightbox across all groups
                    let globalIndex = 0
                    for (let i = 0; i < groupIndex; i++) {
                      globalIndex += groupedImages[i].images.length
                    }
                    globalIndex += idx
                    
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
                    const isLast = idx === (group.images?.length || 0) - 1
                    const imageUrl = urlForImage(image)?.url()
                    
                    if (!imageUrl) {
                      return null
                    }
                    
                    // Enhanced responsive grid span calculation
                    const getFilteredGridSpan = () => {
                      if (!activeFilter) {
                        // Respect the custom grid span from CMS data
                        return {
                          gridColumn: `span ${Math.min(gridSpan.col, gridCols)}`,
                          gridRow: `span ${gridSpan.row}`
                        }
                      }
                      
                      // When filtering, make images larger to fill space based on current grid columns
                      const totalImages = validImages.length
                      const responsiveCols = Math.min(gridCols, 4) // Cap at 4 for better layout
                      
                      if (totalImages <= 2) {
                        // For 1-2 images, make them span full width
                        return {
                          gridColumn: '1 / -1',
                          gridRow: 'span 2'
                        }
                      } else if (totalImages <= 4) {
                        // For 3-4 images, make them span responsive width
                        const spanCols = Math.max(2, Math.floor(responsiveCols / 2))
                        return {
                          gridColumn: `span ${Math.min(spanCols, gridCols)}`,
                          gridRow: 'span 2'
                        }
                      } else {
                        // For 5+ images, use responsive spans
                        const enhancedCols = Math.min(gridCols, gridSpan.col + 1)
                        return {
                          gridColumn: `span ${Math.min(enhancedCols, gridCols)}`,
                          gridRow: `span ${gridSpan.row + 1}`
                        }
                      }
                    }
                    
                    const filteredGridStyle = getFilteredGridSpan()
                    
                    // Render all images immediately with smooth transitions
                    return (
                      <div 
                        key={`${groupIndex}-${idx}`} 
                        className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer bg-white border border-gray-100" 
                        onClick={() => { setLightboxIndex(globalIndex); setLightboxOpen(true) }}
                        style={{
                          ...filteredGridStyle,
                          transition: 'grid-column 0.3s ease-in-out, grid-row 0.3s ease-in-out, transform 0.3s ease-in-out'
                        }}
                      >
                        <Image
                          src={urlForImage(image)!.width(1200).height(800).fit('crop').url()}
                          alt={image.alt || `${vehicleTitle} Gallery Image ${globalIndex + 1}`}
                          fill
                          sizes={IMAGE_SIZES.gallery}
                          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        {image.caption && (
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent text-white p-4">
                            <p className="text-sm font-medium leading-relaxed">{image.caption}</p>
                          </div>
                        )}
                        {/* Subtle hover overlay with professional styling */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/0 via-transparent to-white/5 group-hover:from-black/10 group-hover:via-black/5 group-hover:to-white/10 transition-all duration-500 ease-out" />
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State - Show when no images match the current filter */
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="text-center max-w-md mx-auto">
              {/* Icon */}
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                  <svg 
                    className="w-8 h-8 text-gray-400" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={1.5} 
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                    />
                  </svg>
                </div>
              </div>
              
              {/* Message */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No images found
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {activeFilter 
                  ? `No images found for the "${activeFilter}" filter. Please try another filter or check back later.`
                  : "No images found for the selected filter. Please try another filter or check back later."
                }
              </p>
              
              {/* Action Button */}
              {activeFilter && (
                <button
                  onClick={() => onClearFilter?.()}
                  className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200 font-medium"
                >
                  <svg 
                    className="w-4 h-4 mr-2" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M6 18L18 6M6 6l12 12" 
                    />
                  </svg>
                  Clear Filter
                </button>
              )}
            </div>
          </div>
        )}
        
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
