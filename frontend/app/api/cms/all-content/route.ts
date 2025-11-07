import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { transformImagesToWebP } from '@/sanity/lib/apiImageTransform'

// Build comprehensive query for all content types with nested relationships
// This mirrors the vehicle by-slug endpoint structure but fetches all records
// Using GROQ object literal syntax to return multiple document types in one query
function buildComprehensiveAllContentQuery(vehicleTagFilter?: string, brandFilter?: string) {
  // Build tag filter conditions for vehicles
  let vehicleTagFilterClause = ''
  let queryParams: Record<string, string> = {}
  let vehicleTagFilterForArrays = '' // For filtering reference arrays before dereferencing
  
  if (vehicleTagFilter && vehicleTagFilter.trim()) {
    // Sanitize input - remove potentially dangerous characters
    const cleanTag = vehicleTagFilter.trim().replace(/[\\"'`]/g, '')
    const cleanTagLower = cleanTag.toLowerCase()
    const tagPattern = `*${cleanTag}*`
    const tagPatternLower = `*${cleanTagLower}*`
    
    // Fuzzy, case-insensitive tag matching using GROQ match operator
    vehicleTagFilterClause = `&& (tags[] match $tagPattern || lower(tags[]) match lower($tagPatternLower))`
    queryParams = {
      tagPattern,
      tagPatternLower
    }
    
    // For filtering reference arrays, we need to check if the referenced vehicle matches
    // This creates a filter that checks if the reference ID exists in matching vehicles
    vehicleTagFilterForArrays = `[_ref in *[_type == "vehicle" && (tags[] match "*${cleanTag}*" || lower(tags[]) match "*${cleanTagLower}*")]._id]`
  }
  
  // Build brand filter conditions for vehicles
  let brandFilterClause = ''
  let brandFilterForArrays = ''
  
  if (brandFilter && brandFilter.trim()) {
    // Sanitize input
    const cleanBrand = brandFilter.trim().replace(/[\\"'`]/g, '')
    const cleanBrandLower = cleanBrand.toLowerCase()
    const brandPattern = `*${cleanBrand}*`
    const brandPatternLower = `*${cleanBrandLower}*`
    
    // Fuzzy, case-insensitive brand matching
    brandFilterClause = `&& (brand match $brandPattern || lower(brand) match lower($brandPatternLower))`
    queryParams = {
      ...queryParams,
      brandPattern,
      brandPatternLower
    }
    
    // For filtering reference arrays by brand
    brandFilterForArrays = `[_ref in *[_type == "vehicle" && (brand match "*${cleanBrand}*" || lower(brand) match "*${cleanBrandLower}*")]._id]`
  }
  
  // Combine both filters for reference arrays
  let combinedArrayFilter = ''
  if (vehicleTagFilterForArrays && brandFilterForArrays) {
    // Both filters - need to combine them
    const cleanTag = vehicleTagFilter?.trim().replace(/[\\"'`]/g, '') || ''
    const cleanTagLower = cleanTag.toLowerCase()
    const cleanBrand = brandFilter?.trim().replace(/[\\"'`]/g, '') || ''
    const cleanBrandLower = cleanBrand.toLowerCase()
    combinedArrayFilter = `[_ref in *[_type == "vehicle" && (tags[] match "*${cleanTag}*" || lower(tags[]) match "*${cleanTagLower}*") && (brand match "*${cleanBrand}*" || lower(brand) match "*${cleanBrandLower}*")]._id]`
  } else if (vehicleTagFilterForArrays) {
    combinedArrayFilter = vehicleTagFilterForArrays
  } else if (brandFilterForArrays) {
    combinedArrayFilter = brandFilterForArrays
  }
  
  // Combine filters for direct vehicle queries
  const combinedVehicleFilter = vehicleTagFilterClause + brandFilterClause
  
  // Build brands filter - only include brands that have vehicles matching the filters
  // Note: For subqueries in filters, we need to embed the values directly
  let brandsFilterClause = ''
  let manufacturersFilterClause = ''
  
  if (vehicleTagFilter?.trim() || brandFilter?.trim()) {
    // Build combined filter conditions for subqueries
    const tagConditions: string[] = []
    const brandConditions: string[] = []
    
    if (vehicleTagFilter?.trim()) {
      const cleanTag = vehicleTagFilter.trim().replace(/[\\"'`]/g, '')
      const cleanTagLower = cleanTag.toLowerCase()
      tagConditions.push(`(tags[] match "*${cleanTag}*" || lower(tags[]) match "*${cleanTagLower}*")`)
    }
    
    if (brandFilter?.trim()) {
      const cleanBrand = brandFilter.trim().replace(/[\\"'`]/g, '')
      const cleanBrandLower = cleanBrand.toLowerCase()
      brandConditions.push(`(brand match "*${cleanBrand}*" || lower(brand) match "*${cleanBrandLower}*")`)
    }
    
    const allConditions = [...tagConditions, ...brandConditions].join(' && ')
    
    // Filter brands that have at least one vehicle matching the filters
    brandsFilterClause = `&& count(*[_type == "vehicle" && brand == ^.name && defined(slug.current) && ${allConditions}]) > 0`
    
    // Filter manufacturers that have at least one vehicle matching the filters
    manufacturersFilterClause = `&& count(*[_type == "vehicle" && references(^._id) && ${allConditions}]) > 0`
  }

  return {
    query: `
{
  "vehicles": *[_type == "vehicle" && defined(slug.current)${combinedVehicleFilter}] | order(modelYear desc, title asc) {
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
      slug,
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
          hotspot,
          crop,
          alt,
          caption
        },
        price,
        availability,
        features,
        tags
      }
    },
    "associatedVehicles": associatedVehicles${combinedArrayFilter || ''}[0...3]->{
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
        hotspot,
        crop,
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
    "vehicles": *[_type == "vehicle" && brand == ^.name && defined(slug.current)${combinedVehicleFilter}] | order(modelYear desc, title asc) {
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
      "associatedVehicles": associatedVehicles${combinedArrayFilter || ''}[0...3]->{
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
          hotspot,
          crop,
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
    "vehicles": *[_type == "vehicle" && references(^._id)${combinedVehicleFilter}] {
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
      "associatedVehicles": associatedVehicles${combinedArrayFilter || ''}[0...3]->{
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
          hotspot,
          crop,
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
      slug,
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
    "compatibleVehicles": compatibleVehicles${combinedArrayFilter || ''}[]->{
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
    },
    appSecondaryLogo{
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
    params: queryParams
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const vehicleTag = searchParams.get('vehicleTag') || undefined
    const brand = searchParams.get('brand') || undefined
    
    // Build query with optional tag and brand filtering
    const { query, params } = buildComprehensiveAllContentQuery(vehicleTag, brand)
    
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

    // Transform all images to WebP format for optimal performance
    const transformedContent = transformImagesToWebP(allContent)

    // Calculate counts for metadata
    const counts = {
      vehicles: transformedContent.vehicles?.length || 0,
      brands: transformedContent.brands?.length || 0,
      manufacturers: transformedContent.manufacturers?.length || 0,
      additionalOptions: transformedContent.additionalOptions?.length || 0,
      pages: transformedContent.pages?.length || 0,
      salesRepresentatives: transformedContent.salesRepresentatives?.length || 0,
      hasSettings: !!transformedContent.settings
    }

    return NextResponse.json({
      success: true,
      data: transformedContent,
      meta: {
        counts,
        filters: {
          vehicleTag: vehicleTag || null,
          brand: brand || null
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

