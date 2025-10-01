'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'

interface LazyImageProps {
  src: string
  alt: string
  fill?: boolean
  width?: number
  height?: number
  className?: string
  aspectClass?: string
  caption?: string
  onLoad?: () => void
  batchIndex?: number
  onBatchLoad?: (batchIndex: number) => void
  onClick?: () => void
  style?: React.CSSProperties
}

export default function LazyImage({
  src,
  alt,
  fill = false,
  width,
  height,
  className = '',
  aspectClass = '',
  caption,
  onLoad,
  onClick,
  batchIndex = 0,
  onBatchLoad,
  style
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [shouldLoad, setShouldLoad] = useState(false)
  const imgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          // Trigger batch loading when this image comes into view
          if (onBatchLoad && batchIndex !== undefined) {
            onBatchLoad(batchIndex)
          }
          observer.disconnect()
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px'
      }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [onBatchLoad, batchIndex])

  // Load image when in view
  useEffect(() => {
    if (isInView) {
      setShouldLoad(true)
    }
  }, [isInView])

  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  return (
    <div 
      ref={imgRef}
      onClick={onClick}
      className={`relative ${aspectClass} rounded-md overflow-hidden shadow-lg break-inside-avoid hover:shadow-xl transition-shadow duration-300 ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      } transition-opacity duration-500 ${onClick ? 'cursor-pointer' : ''}`}
      style={style}
    >
      {shouldLoad && (
        <>
          {fill ? (
            <Image
              src={src}
              alt={alt}
              fill
              className={`object-cover hover:scale-105 transition-transform duration-500 ${className}`}
              onLoad={handleLoad}
            />
          ) : (
            <Image
              src={src}
              alt={alt}
              width={width}
              height={height}
              className={`hover:scale-105 transition-transform duration-500 ${className}`}
              onLoad={handleLoad}
            />
          )}
          
          {caption && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white p-4">
              <p className="text-sm font-medium">{caption}</p>
            </div>
          )}
          
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all duration-300 rounded-md" />
        </>
      )}
      
      {/* Loading placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  )
}
