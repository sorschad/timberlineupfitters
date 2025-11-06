import { urlForImage } from './utils'
import { generateSrcSet } from './imageUtils'

/**
 * Recursively transforms all Sanity image objects in API response data to WebP format
 * This ensures all images served via CDN are in WebP format for optimal performance
 */
export function transformImagesToWebP(data: any): any {
  if (!data) return data

  // Handle arrays
  if (Array.isArray(data)) {
    return data.map(item => transformImagesToWebP(item))
  }

  // Handle objects
  if (typeof data === 'object' && data !== null) {
    // Check if this is an image object (has asset with _ref or url)
    if (data.asset && (data.asset._ref || data.asset.url)) {
      return transformImageObject(data)
    }

    // Recursively transform all properties
    const transformed: any = {}
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        transformed[key] = transformImagesToWebP(data[key])
      }
    }
    return transformed
  }

  // Return primitives as-is
  return data
}

/**
 * Transforms a single image object to include WebP URLs and srcsets
 */
function transformImageObject(image: any): any {
  if (!image?.asset) {
    return image
  }

  // Use urlForImage builder if we have a _ref (full image object from Sanity)
  if (image.asset._ref) {
    const builder = urlForImage(image)
    if (!builder) return image

    // Generate WebP URL (preserve original quality and dimensions if specified)
    const webpUrl = builder.format('webp').url()
    
    // Generate srcset for responsive images
    const srcSet = generateSrcSet(image, [320, 640, 768, 1024, 1280, 1536, 1920], { quality: 85 })

    return {
      ...image,
      asset: {
        ...image.asset,
        // Keep original URL for backward compatibility
        url: webpUrl || image.asset.url,
        // Add WebP-specific properties
        webpUrl: webpUrl,
        srcSet: srcSet
      }
    }
  }

  // If we only have a URL (from GROQ queries with asset->{url}), transform it directly
  if (image.asset.url && typeof image.asset.url === 'string') {
    // Try to use the image object with urlForImage if we have enough info
    // This handles cases where we might have _id that can be converted to _ref
    if (image.asset._id && !image.asset._ref) {
      // Try constructing a reference from _id
      const imageWithRef = {
        ...image,
        asset: {
          ...image.asset,
          _ref: image.asset._id,
          _type: 'reference'
        }
      }
      const builder = urlForImage(imageWithRef)
      if (builder) {
        const webpUrl = builder.format('webp').url()
        const srcSet = generateSrcSet(imageWithRef, [320, 640, 768, 1024, 1280, 1536, 1920], { quality: 85 })
        
        return {
          ...image,
          asset: {
            ...image.asset,
            url: webpUrl || image.asset.url,
            webpUrl: webpUrl,
            srcSet: srcSet
          }
        }
      }
    }

    // If we can't use the builder, transform the URL directly using Sanity CDN parameters
    const webpUrl = transformUrlToWebP(image.asset.url)
    
    // Generate srcset by creating multiple URLs with different widths
    const srcSet = generateSrcSetFromUrl(image.asset.url, [320, 640, 768, 1024, 1280, 1536, 1920])
    
    return {
      ...image,
      asset: {
        ...image.asset,
        url: webpUrl,
        webpUrl: webpUrl,
        srcSet: srcSet
      }
    }
  }

  return image
}

/**
 * Transforms a Sanity CDN URL to WebP format
 * Handles URLs in format: https://cdn.sanity.io/images/{project}/{dataset}/{id}-{w}x{h}.{ext}
 * Sanity CDN supports ?fm=webp parameter to force WebP format
 */
function transformUrlToWebP(url: string): string {
  if (!url || typeof url !== 'string') return url

  try {
    const urlObj = new URL(url)
    // Sanity CDN supports ?fm=webp parameter to force WebP format
    urlObj.searchParams.set('fm', 'webp')
    return urlObj.toString()
  } catch {
    // If URL parsing fails, return original
    return url
  }
}

/**
 * Generates a srcset from a base Sanity CDN URL by adding width parameters
 * This is used when we only have a URL (from GROQ queries) without a full image object
 */
function generateSrcSetFromUrl(baseUrl: string, widths: number[]): string {
  if (!baseUrl || typeof baseUrl !== 'string') return ''
  
  try {
    const baseUrlObj = new URL(baseUrl)
    const srcSetEntries = widths
      .map(width => {
        // Clone URL and add width parameter
        const url = new URL(baseUrl)
        url.searchParams.set('w', width.toString())
        url.searchParams.set('fm', 'webp')
        url.searchParams.set('q', '85') // Default quality
        return `${url.toString()} ${width}w`
      })
      .filter(Boolean)
      .join(', ')
    
    return srcSetEntries
  } catch {
    // If URL parsing fails, return empty string
    return ''
  }
}

