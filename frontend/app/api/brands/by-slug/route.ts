import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { urlForImage } from '@/sanity/lib/utils'
import { IMAGE_SIZES } from '@/sanity/lib/imageUtils'
import { getImageDimensions } from '@sanity/asset-utils'

// Comprehensive brand query with fuzzy, case-insensitive search
// Searches by slug (exact and pattern) and by name (exact and pattern)
const comprehensiveBrandQuery = `
  *[_type == "brand" && (
    // Exact slug match (case-insensitive)
    lower(slug.current) == lower($slug) ||
    // Fuzzy slug match (case-insensitive)
    lower(slug.current) match lower($slugPattern) ||
    // Exact name match (case-insensitive)
    lower(name) == lower($slug) ||
    // Fuzzy name match (case-insensitive)
    lower(name) match lower($namePattern) ||
    // Additional fuzzy patterns for better matching
    slug.current match $fuzzySlugPattern ||
    name match $fuzzyNamePattern
  )] | order(
    // Prioritize exact matches first
    select(
      lower(slug.current) == lower($slug) => 0,
      lower(name) == lower($slug) => 1,
      lower(slug.current) match lower($slugPattern) => 2,
      lower(name) match lower($namePattern) => 3,
      4
    ) asc,
    _updatedAt desc
  ) [0] {
    _id,
    _type,
    _createdAt,
    _updatedAt,
    _rev,
    "status": select(_originalId in path("drafts.**") => "draft", "published"),
    "name": coalesce(name, "Untitled"),
    "slug": slug.current,
    slogan,
    excerpt,
    description[]{
      ...,
      markDefs[]{
        ...,
        _type == "link" => {
          "page": page->slug.current,
          "brand": brand->slug.current
        }
      }
    },
    coverImage{
      asset->{
        _id,
        url
      },
      hotspot,
      crop,
      alt
    },
    sectionImage{
      asset->{
        _id,
        url
      },
      hotspot,
      crop,
      alt
    },
    primaryLogo{
      asset->{
        _id,
        url
      },
      hotspot,
      crop,
      alt
    },
    secondaryLogo{
      asset->{
        _id,
        url
      },
      hotspot,
      crop,
      alt
    },
    website,
    primaryColor,
    secondaryColor,
    accentColor,
    backgroundColor,
    features,
    "launchDate": coalesce(launchDate, _updatedAt),
    sidebarMenuSortOrder,
    "manufacturers": manufacturers[]->{
      _id,
      name,
      "slug": slug.current,
      logo{
        asset->{
          _id,
          url
        },
        alt
      }
    },
    "vehicles": *[_type == "vehicle" && brand == ^.name && defined(slug.current)] | order(modelYear desc, title asc) [0...6] {
      _id,
      title,
      slug,
      model,
      vehicleType,
      modelYear,
      trim,
      coverImage{
        asset->{
          _id,
          url
        },
        alt
      },
      excerpt
    }
  }
`

// Helper function to enhance image with responsive URLs
function enhanceImageWithResponsiveUrls(image: any, imageType: 'cover' | 'section' | 'logo' | 'thumbnail' = 'cover') {
  if (!image?.asset?._ref) return null

  try {
    const imageBuilder = urlForImage(image)
    if (!imageBuilder) return null

    // Get original dimensions
    const dimensions = getImageDimensions(image.asset._ref)
    
    // Define breakpoint widths based on image type
    const breakpointWidths = {
      cover: [640, 768, 1024, 1280, 1920],      // Full-width hero images
      section: [640, 768, 1024, 1280],         // Section images
      logo: [120, 200, 300, 400],              // Logo images
      thumbnail: [150, 300, 400]                // Thumbnail images
    }

    const widths = breakpointWidths[imageType] || breakpointWidths.cover
    
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
    const desktop = imageBuilder.width(1920).quality(85).auto('format').fit('max').url()

    return {
      // Original asset data
      asset: image.asset,
      hotspot: image.hotspot,
      crop: image.crop,
      alt: image.alt,
      
      // Original dimensions
      width: dimensions.width,
      height: dimensions.height,
      aspectRatio: dimensions.width / dimensions.height,
      
      // Base URL (original, unmodified)
      url: image.asset.url,
      
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
      
      // Recommended sizes attribute based on image type
      sizes: {
        cover: IMAGE_SIZES.hero,
        section: IMAGE_SIZES.twoColumn,
        logo: IMAGE_SIZES.logo,
        thumbnail: IMAGE_SIZES.thumbnail,
      }[imageType] || IMAGE_SIZES.content,
      
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
    console.error('Error processing image:', error)
    // Return basic image data if processing fails
    return {
      asset: image.asset,
      hotspot: image.hotspot,
      crop: image.crop,
      alt: image.alt,
      url: image.asset?.url || null,
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')

    if (!slug || slug.trim().length === 0) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Slug parameter is required',
          message: 'Please provide a brand slug or name to search for'
        },
        { status: 400 }
      )
    }

    // Clean and prepare the search term for fuzzy matching
    const cleanSlug = slug.trim()
    const slugLower = cleanSlug.toLowerCase()
    
    // Create multiple fuzzy patterns for better matching
    const slugPattern = `*${cleanSlug}*`           // Pattern: *search*
    const namePattern = `*${cleanSlug}*`          // Pattern for name: *search*
    const fuzzySlugPattern = `*${slugLower}*`    // Lowercase fuzzy pattern
    const fuzzyNamePattern = `*${slugLower}*`    // Lowercase fuzzy pattern for name
    
    // Fetch the brand with comprehensive data using fuzzy matching
    const brand = await client.fetch(comprehensiveBrandQuery, { 
      slug: cleanSlug,
      slugLower: slugLower,
      slugPattern: slugPattern,
      namePattern: namePattern,
      fuzzySlugPattern: fuzzySlugPattern,
      fuzzyNamePattern: fuzzyNamePattern
    })

    if (!brand) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Brand not found',
          message: `No brand found matching slug or name: ${cleanSlug}`,
          data: null
        },
        { status: 404 }
      )
    }

    // Enhance images with responsive URLs
    const enhancedBrand = {
      ...brand,
      coverImage: enhanceImageWithResponsiveUrls(brand.coverImage, 'cover'),
      sectionImage: enhanceImageWithResponsiveUrls(brand.sectionImage, 'section'),
      primaryLogo: enhanceImageWithResponsiveUrls(brand.primaryLogo, 'logo'),
      secondaryLogo: enhanceImageWithResponsiveUrls(brand.secondaryLogo, 'logo'),
      manufacturers: brand.manufacturers?.map((manufacturer: any) => ({
        ...manufacturer,
        logo: enhanceImageWithResponsiveUrls(manufacturer.logo, 'logo'),
      })),
      vehicles: brand.vehicles?.map((vehicle: any) => ({
        ...vehicle,
        coverImage: enhanceImageWithResponsiveUrls(vehicle.coverImage, 'thumbnail'),
      })),
    }

    return NextResponse.json({
      success: true,
      data: enhancedBrand,
      meta: {
        slug: cleanSlug,
        matchedSlug: brand.slug,
        matchedName: brand.name,
        found: true,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Error fetching brand by slug:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch brand',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        data: null
      },
      { status: 500 }
    )
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, { 
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  })
}

