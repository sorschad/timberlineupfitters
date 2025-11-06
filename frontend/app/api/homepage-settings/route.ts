import {NextResponse} from 'next/server'
import {sanityFetch} from '@/sanity/lib/live'
import {homepageQuery} from '@/sanity/lib/queries'
import {urlForImage} from '@/sanity/lib/utils'
import {IMAGE_SIZES} from '@/sanity/lib/imageUtils'
import {getImageDimensions} from '@sanity/asset-utils'

// Helper function to enhance hero image with responsive URLs
function enhanceHeroImage(image: any) {
  if (!image?.asset?._ref) return null

  try {
    const imageBuilder = urlForImage(image)
    if (!imageBuilder) return null

    // Get original dimensions
    const dimensions = getImageDimensions(image.asset._ref)
    
    // Hero image breakpoint widths (full-width hero sections)
    const widths = [640, 768, 1024, 1280, 1920]
    
    // Generate responsive URLs for each breakpoint
    const responsiveUrls: Record<string, string> = {}
    const srcSet: string[] = []
    
    widths.forEach(width => {
      const url = imageBuilder
        .width(width)
        .quality(85)
        .auto('format')
        .fit('max')
        .url()
      
      if (url) {
        responsiveUrls[`w${width}`] = url
        srcSet.push(`${url} ${width}w`)
      }
    })

    // Generate optimal URLs for common device sizes
    const mobile = imageBuilder.width(640).quality(85).auto('format').fit('max').url()
    const tablet = imageBuilder.width(1024).quality(85).auto('format').fit('max').url()
    const desktop = imageBuilder.width(1920).quality(90).auto('format').fit('max').url()

    return {
      // Original asset data
      asset: image.asset,
      hotspot: image.hotspot,
      crop: image.crop,
      alt: image.alt || 'Hero background',
      
      // Original dimensions
      width: dimensions.width,
      height: dimensions.height,
      aspectRatio: dimensions.width / dimensions.height,
      
      // Base URL (original, unmodified) - for backward compatibility
      url: image.asset.url,
      
      // Simple image URL for backward compatibility
      image: image.asset.url,
      
      // Responsive URLs by breakpoint
      responsive: {
        mobile: mobile || null,
        tablet: tablet || null,
        desktop: desktop || null,
      },
      
      // Individual breakpoint URLs
      ...responsiveUrls,
      
      // SrcSet for <img srcset> attribute
      srcSet: srcSet.join(', '),
      
      // Recommended sizes attribute for hero images
      sizes: IMAGE_SIZES.hero,
      
      // Optimized URLs with specific dimensions for common use cases
      optimized: {
        thumbnail: imageBuilder.width(150).height(150).quality(80).fit('crop').url() || null,
        small: imageBuilder.width(400).quality(85).fit('max').url() || null,
        medium: imageBuilder.width(800).quality(85).fit('max').url() || null,
        large: imageBuilder.width(1200).quality(90).fit('max').url() || null,
        xlarge: imageBuilder.width(1920).quality(90).fit('max').url() || null,
      }
    }
  } catch (error) {
    console.error('Error processing hero image:', error)
    // Return basic image data if processing fails
    return {
      asset: image.asset,
      hotspot: image.hotspot,
      crop: image.crop,
      alt: image.alt || 'Hero background',
      url: image.asset?.url || null,
      image: image.asset?.url || null,
    }
  }
}

export async function GET() {
  try {
    const {data} = await sanityFetch({query: homepageQuery, stega: false})
    const slides = ((data as any)?.heroBackgroundImages || []).map((image: any, idx: number) => {
      // Enhance image with responsive URLs
      const enhancedImage = enhanceHeroImage(image)
      
      // If image enhancement failed, return basic structure
      if (!enhancedImage) {
        return {
          id: idx + 1,
          title: image?.title || '',
          subtitle: image?.subtitle || '',
          alt: image?.alt || 'Hero background',
          image: image?.asset?.url || '',
        }
      }
      
      return {
        id: idx + 1,
        title: image?.title || '',
        subtitle: image?.subtitle || '',
        alt: enhancedImage.alt,
        // Backward compatibility: simple image URL (string)
        image: enhancedImage.url || enhancedImage.image || '',
        // Enhanced responsive image data (object)
        imageData: enhancedImage,
      }
    })
    return NextResponse.json({slides})
  } catch (err) {
    console.error('Error fetching homepage page:', err)
    return NextResponse.json({slides: []})
  }
}


