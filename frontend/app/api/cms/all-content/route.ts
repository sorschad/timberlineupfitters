import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'

// Build comprehensive query for all content types with nested relationships
// This mirrors the vehicle by-slug endpoint structure but fetches all records
// Using GROQ object literal syntax to return multiple document types in one query
function buildComprehensiveAllContentQuery(vehicleTagFilter?: string) {
  // Build tag filter conditions for vehicles
  let vehicleTagFilterClause = ''
  let vehicleTagFilterParams: Record<string, string> = {}
  let vehicleTagFilterForArrays = '' // For filtering reference arrays before dereferencing
  
  if (vehicleTagFilter && vehicleTagFilter.trim()) {
    // Sanitize input - remove potentially dangerous characters
    const cleanTag = vehicleTagFilter.trim().replace(/[\\"'`]/g, '')
    const cleanTagLower = cleanTag.toLowerCase()
    const tagPattern = `*${cleanTag}*`
    const tagPatternLower = `*${cleanTagLower}*`
    
    // Fuzzy, case-insensitive tag matching using GROQ match operator
    vehicleTagFilterClause = `&& (tags[] match $tagPattern || lower(tags[]) match lower($tagPatternLower))`
    vehicleTagFilterParams = {
      tagPattern,
      tagPatternLower
    }
    
    // For filtering reference arrays, we need to check if the referenced vehicle matches
    // This creates a filter that checks if the reference ID exists in matching vehicles
    vehicleTagFilterForArrays = `[_ref in *[_type == "vehicle" && (tags[] match "*${cleanTag}*" || lower(tags[]) match "*${cleanTagLower}*")]._id]`
  }
  
  // Build brands filter - only include brands that have vehicles matching the tag filter
  // Note: For subqueries in filters, we need to embed the values directly
  let brandsFilterClause = ''
  let manufacturersFilterClause = ''
  
  if (vehicleTagFilter && vehicleTagFilter.trim()) {
    // Sanitize input
    const cleanTag = vehicleTagFilter.trim().replace(/[\\"'`]/g, '')
    const cleanTagLower = cleanTag.toLowerCase()
    
    // Filter brands that have at least one vehicle with matching tags
    // Using embedded values in subquery filter (safe after sanitization)
    brandsFilterClause = `&& count(*[_type == "vehicle" && brand == ^.name && defined(slug.current) && (tags[] match "*${cleanTag}*" || lower(tags[]) match "*${cleanTagLower}*")]) > 0`
    
    // Filter manufacturers that have at least one vehicle with matching tags
    manufacturersFilterClause = `&& count(*[_type == "vehicle" && references(^._id) && (tags[] match "*${cleanTag}*" || lower(tags[]) match "*${cleanTagLower}*")]) > 0`
  }

  return {
    query: `
{
  "vehicles": *[_type == "vehicle" && defined(slug.current)${vehicleTagFilterClause}] | order(modelYear desc, title asc) {
    _id,
    _type,
    _createdAt,
    _updatedAt,
    _rev,
    title,
    slug,
    model,
    vehicleType,
    modelYear,
    brand,
    trim,
    package,
    "manufacturer": manufacturer->{
      _id,
      name,
      logo{
        asset->{
          _id,
          url
        },
        alt
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
    vehicleDetailsPageHeaderBackgroundImage{
      asset->{
        _id,
        url
      },
      hotspot,
      crop,
      alt
    },
    headerVehicleImage{
      asset->{
        _id,
        url
      },
      hotspot,
      crop,
      alt
    },
    gallery[]{
      asset->{
        _id,
        url
      },
      hotspot,
      crop,
      alt,
      caption,
      isBuildCoverImage,
      isBuildTextSummaryBlock,
      isBuildTextSummaryContent,
      view,
      tags,
      gridSpan
    },
    videoTour{
      url,
      title,
      description
    },
    specifications{
      engine[]{
        type,
        horsepower,
        torque,
        fuelType,
        transmission
      },
      drivetrain,
      bedLength,
      cabStyle,
      towingCapacity,
      payloadCapacity,
      fuelEconomy{
        city,
        highway,
        combined
      }
    },
    features{
      baseFeatures,
      "additionalOptions": additionalOptions[]->{
        _id,
        name,
        slug,
        description,
        "manufacturer": manufacturer->{
          _id,
          name
        },
        "brand": brand->{
          _id,
          name
        },
        package,
        image{
          asset->{
            _id,
            url
          },
          alt,
          caption
        },
        price,
        availability,
        features,
        tags
      }
    },
    "associatedVehicles": associatedVehicles${vehicleTagFilterForArrays || ''}[0...3]->{
      _id,
      title,
      slug,
      model,
      modelYear,
      brand,
      tags,
      "manufacturer": manufacturer->{
        _id,
        name
      },
      coverImage{
        asset->{
          _id,
          url
        },
        alt
      },
      excerpt
    },
    customizationOptions[]{
      name,
      description,
      price,
      category,
      isStandard,
      isAvailable
    },
    inventory{
      availability,
      stockNumber,
      vin,
      msrp,
      salePrice,
      location
    },
    description,
    excerpt,
    tags,
    sidebarSortOrder,
    seo{
      title,
      description,
      keywords
    }
  },
  "brands": *[_type == "brand" && defined(slug.current)${brandsFilterClause}] | order(name asc) {
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
    "vehicles": *[_type == "vehicle" && brand == ^.name && defined(slug.current)${vehicleTagFilterClause}] | order(modelYear desc, title asc) {
      _id,
      title,
      slug,
      model,
      vehicleType,
      modelYear,
      brand,
      trim,
      package,
      tags,
      "manufacturer": manufacturer->{
        _id,
        name
      },
      coverImage{
        asset->{
          _id,
          url
        },
        alt
      },
      excerpt
    }
  } | order(name asc),
  "manufacturers": *[_type == "manufacturer" && defined(slug.current)${manufacturersFilterClause}] | order(name asc) {
    _id,
    _type,
    _createdAt,
    _updatedAt,
    _rev,
    name,
    slug,
    logo{
      asset->{
        _id,
        url
      },
      hotspot,
      crop,
      alt
    },
    description,
    heroImage {
      asset-> {
        _id,
        url
      },
      hotspot,
      crop,
      alt
    },
    heroTitle,
    heroSubtitle,
    heroCtaText,
    showcaseImages[] {
      model,
      image {
        asset-> {
          _id,
          url
        },
        hotspot,
        crop,
        alt
      },
      altText
    },
    galleryImages[] {
      image {
        asset-> {
          _id,
          url
        },
        hotspot,
        crop,
        alt
      },
      caption,
      category,
      altText
    },
    ctaTitle,
    ctaDescription,
    ctaStats[] {
      value,
      label
    },
    additionalLinks[] {
      text,
      url
    },
    seoTitle,
    seoDescription,
    seoImage {
      asset-> {
        _id,
        url
      },
      hotspot,
      crop,
      alt
    },
    "vehicles": *[_type == "vehicle" && references(^._id)${vehicleTagFilterClause}] {
      _id,
      title,
      slug,
      model,
      vehicleType,
      modelYear,
      brand,
      package,
      tags,
      "manufacturer": manufacturer->{
        _id,
        name
      },
      coverImage{
        asset->{
          _id,
          url
        },
        alt
      }
    } | order(model asc, brand asc, package asc)
  },
  "additionalOptions": *[_type == "additionalOption" && defined(slug.current)] | order(sortOrder asc, name asc) {
    _id,
    _type,
    _createdAt,
    _updatedAt,
    _rev,
    name,
    slug,
    description,
    "manufacturer": manufacturer->{
      _id,
      name,
      logo{
        asset->{
          _id,
          url
        },
        alt
      }
    },
    "brand": brand->{
      _id,
      name,
      primaryColor,
      secondaryColor,
      accentColor,
      backgroundColor
    },
    package,
    image{
      asset->{
        _id,
        url
      },
      hotspot,
      crop,
      alt,
      caption
    },
    price{
      amount,
      currency,
      isEstimate
    },
    availability,
    "compatibleVehicles": compatibleVehicles${vehicleTagFilterForArrays || ''}[]->{
      _id,
      title,
      slug,
      model,
      vehicleType,
      modelYear,
      tags,
      "manufacturer": manufacturer->{
        _id,
        name
      }
    },
    features,
    installation{
      time,
      difficulty,
      notes
    },
    warranty{
      duration,
      coverage,
      notes
    },
    tags,
    isActive,
    sortOrder
  },
  "pages": *[_type == "page"] | order(name asc) {
    _id,
    _type,
    _createdAt,
    _updatedAt,
    _rev,
    name,
    slug,
    heading,
    subheading,
    heroBackgroundImages[]{
      asset->{
        _id,
        url
      },
      hotspot,
      crop,
      alt,
      title,
      subtitle
    },
    "pageBuilder": pageBuilder[]{
      ...,
      _type == "callToAction" => {
        link {
          ...,
          _type == "link" => {
            "page": page->slug.current,
            "brand": brand->slug.current
          }
        }
      },
      _type == "infoSection" => {
        content[]{
          ...,
          markDefs[]{
            ...,
            _type == "link" => {
              "page": page->slug.current,
              "brand": brand->slug.current
            }
          }
        }
      }
    },
    seo{
      title,
      description,
      keywords
    }
  },
  "settings": *[_type == "settings"][0]{
    _id,
    _type,
    _createdAt,
    _updatedAt,
    _rev,
    ...,
    appLogo{
      asset->{
        _id,
        url
      },
      hotspot,
      crop,
      alt
    }
  },
  "salesRepresentatives": *[_type == "salesRepresentative"] | order(name asc) {
    _id,
    _type,
    _createdAt,
    _updatedAt,
    _rev,
    name,
    email,
    phone,
    title,
    photo{
      asset->{
        _id,
        url
      },
      hotspot,
      crop,
      alt
    },
    bio,
    territory,
    specialties,
    isActive
  }
}
`,
    params: vehicleTagFilterParams
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const vehicleTag = searchParams.get('vehicleTag') || undefined
    
    // Build query with optional tag filtering
    const { query, params } = buildComprehensiveAllContentQuery(vehicleTag)
    
    // Fetch all content with comprehensive nested relationships
    const allContent = await client.fetch(query, params)

    if (!allContent) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to fetch content',
          message: 'No content could be retrieved from Sanity',
          data: null
        },
        { status: 500 }
      )
    }

    // Calculate counts for metadata
    const counts = {
      vehicles: allContent.vehicles?.length || 0,
      brands: allContent.brands?.length || 0,
      manufacturers: allContent.manufacturers?.length || 0,
      additionalOptions: allContent.additionalOptions?.length || 0,
      pages: allContent.pages?.length || 0,
      salesRepresentatives: allContent.salesRepresentatives?.length || 0,
      hasSettings: !!allContent.settings
    }

    return NextResponse.json({
      success: true,
      data: allContent,
      meta: {
        counts,
        filters: {
          vehicleTag: vehicleTag || null
        },
        timestamp: new Date().toISOString(),
        fetched: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Error fetching all content:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch all content',
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

