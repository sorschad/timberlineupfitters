import createImageUrlBuilder from '@sanity/image-url'
import { projectId, dataset } from '@/sanity/lib/api'

const imageBuilder = createImageUrlBuilder({
  projectId: projectId || '',
  dataset: dataset || '',
})

// Responsive breakpoints for optimal image sizing
export const RESPONSIVE_BREAKPOINTS = {
  mobile: 640,
  tablet: 768,
  desktop: 1024,
  large: 1280,
  xlarge: 1536,
} as const

// Common sizes configurations for different layouts
export const IMAGE_SIZES = {
  // Full width hero images
  hero: '(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw',
  
  // Gallery/masonry layouts
  gallery: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  
  // Card layouts (3 columns)
  card: '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw',
  
  // Two column layouts
  twoColumn: '(max-width: 768px) 100vw, 50vw',
  
  // Single column content
  content: '(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 60vw',
  
  // Thumbnail/small images
  thumbnail: '(max-width: 768px) 150px, 200px',
  
  // Logo images
  logo: '(max-width: 768px) 120px, 150px',
} as const

// Generate responsive srcSet for Sanity images
export function generateResponsiveSrcSet(
  source: any,
  baseWidth: number = 800,
  quality: number = 85
): string {
  if (!source?.asset?._ref) return ''
  
  const widths = [320, 640, 768, 1024, 1280, 1536, 1920]
  const srcSetEntries = widths
    .filter(width => width <= baseWidth * 2) // Don't upscale beyond 2x
    .map(width => {
      const url = imageBuilder
        ?.image(source)
        .width(width)
        .quality(quality)
        .auto('format')
        .url()
      return url ? `${url} ${width}w` : null
    })
    .filter(Boolean)
    .join(', ')
  
  return srcSetEntries
}

// Enhanced URL builder with responsive options
export function urlForImageResponsive(
  source: any,
  options: {
    width?: number
    height?: number
    quality?: number
    fit?: 'clip' | 'crop' | 'fill' | 'fillmax' | 'max' | 'scale' | 'min'
    crop?: any
    auto?: string
  } = {}
) {
  if (!source?.asset?._ref) return undefined

  const {
    width,
    height,
    quality = 85,
    fit = 'crop',
    crop,
    auto = 'format'
  } = options

  const imageRef = source?.asset?._ref
  const { width: originalWidth, height: originalHeight } = require('@sanity/asset-utils').getImageDimensions(imageRef)

  let builder = imageBuilder?.image(source)

  if (crop) {
    // Handle crop if provided
    const croppedWidth = Math.floor(originalWidth * (1 - (crop.right + crop.left)))
    const croppedHeight = Math.floor(originalHeight * (1 - (crop.top + crop.bottom)))
    const left = Math.floor(originalWidth * crop.left)
    const top = Math.floor(originalHeight * crop.top)
    
    builder = builder?.rect(left, top, croppedWidth, croppedHeight)
  }

  if (width) builder = builder?.width(width)
  if (height) builder = builder?.height(height)
  
  return builder?.quality(quality).fit(fit).auto(auto as any)
}

// Get optimal image dimensions for a given container size
export function getOptimalImageDimensions(
  containerWidth: number,
  containerHeight: number,
  aspectRatio?: number
): { width: number; height: number } {
  // Use device pixel ratio for crisp images
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
  const targetWidth = Math.ceil(containerWidth * dpr)
  
  if (aspectRatio) {
    return {
      width: targetWidth,
      height: Math.ceil(targetWidth / aspectRatio)
    }
  }
  
  return {
    width: targetWidth,
    height: Math.ceil(containerHeight * dpr)
  }
}

// Preload critical images
export function preloadImage(src: string, sizes?: string) {
  if (typeof window === 'undefined') return
  
  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = 'image'
  link.href = src
  if (sizes) link.setAttribute('imagesizes', sizes)
  document.head.appendChild(link)
}
