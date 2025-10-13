'use client'

import Image from 'next/image'
import { useState } from 'react'
import { IMAGE_SIZES, getOptimalImageDimensions } from '@/sanity/lib/imageUtils'

interface ResponsiveImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  sizes?: string
  priority?: boolean
  quality?: number
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  onLoad?: () => void
  onError?: () => void
  // Layout-specific size presets
  layout?: 'hero' | 'gallery' | 'card' | 'content' | 'thumbnail' | 'logo' | 'twoColumn'
  // Container dimensions for optimal sizing
  containerWidth?: number
  containerHeight?: number
  aspectRatio?: number
}

export default function ResponsiveImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className = '',
  sizes,
  priority = false,
  quality = 85,
  placeholder = 'empty',
  blurDataURL,
  onLoad,
  onError,
  layout,
  containerWidth,
  containerHeight,
  aspectRatio
}: ResponsiveImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  // Determine sizes based on layout or provided sizes
  const imageSizes = sizes || (layout ? IMAGE_SIZES[layout] : IMAGE_SIZES.content)

  // Calculate optimal dimensions if container dimensions are provided
  const optimalDimensions = containerWidth && containerHeight 
    ? getOptimalImageDimensions(containerWidth, containerHeight, aspectRatio)
    : { width, height }

  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  const handleError = () => {
    setHasError(true)
    onError?.()
  }

  // Error state
  if (hasError) {
    return (
      <div className={`flex items-center justify-center bg-gray-200 text-gray-500 ${className}`}>
        <span className="text-sm">Failed to load image</span>
      </div>
    )
  }

  const imageProps = {
    src,
    alt,
    className: `${className} ${!isLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`,
    sizes: imageSizes,
    priority,
    quality,
    placeholder,
    blurDataURL,
    onLoad: handleLoad,
    onError: handleError,
  }

  if (fill) {
    return (
      <Image
        {...imageProps}
        alt={alt}
        fill
      />
    )
  }

  return (
    <Image
      {...imageProps}
      alt={alt}
      width={optimalDimensions.width || width}
      height={optimalDimensions.height || height}
    />
  )
}

// Convenience components for common layouts
export const HeroImage = (props: Omit<ResponsiveImageProps, 'layout'>) => (
  <ResponsiveImage {...props} layout="hero" priority />
)

export const GalleryImage = (props: Omit<ResponsiveImageProps, 'layout'>) => (
  <ResponsiveImage {...props} layout="gallery" />
)

export const CardImage = (props: Omit<ResponsiveImageProps, 'layout'>) => (
  <ResponsiveImage {...props} layout="card" />
)

export const ContentImage = (props: Omit<ResponsiveImageProps, 'layout'>) => (
  <ResponsiveImage {...props} layout="content" />
)

export const ThumbnailImage = (props: Omit<ResponsiveImageProps, 'layout'>) => (
  <ResponsiveImage {...props} layout="thumbnail" />
)

export const LogoImage = (props: Omit<ResponsiveImageProps, 'layout'>) => (
  <ResponsiveImage {...props} layout="logo" />
)
