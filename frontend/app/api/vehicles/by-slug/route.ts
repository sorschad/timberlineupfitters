import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'

// Comprehensive vehicle query with all fields
const comprehensiveVehicleQuery = `
  *[_type == "vehicle" && (
    slug.current match $slug ||
    lower(slug.current) match lower($slug) ||
    slug.current match $slugPattern ||
    lower(slug.current) match lower($slugPattern)
  )] | order(modelYear desc, title asc) [0] {
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
      alt
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
        image,
        price,
        availability,
        features,
        tags
      }
    },
    "associatedVehicles": associatedVehicles[0...3]->{
      _id,
      title,
      slug,
      model,
      modelYear,
      brand,
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
  }
`

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')

    if (!slug || slug.trim().length === 0) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Slug parameter is required',
          message: 'Please provide a vehicle slug to search for'
        },
        { status: 400 }
      )
    }

    // Clean and prepare the slug for search
    const cleanSlug = slug.trim()
    const slugPattern = `*${cleanSlug}*`
    
    // Fetch the vehicle with comprehensive data
    const vehicle = await client.fetch(comprehensiveVehicleQuery, { 
      slug: cleanSlug,
      slugPattern: slugPattern
    })

    if (!vehicle) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Vehicle not found',
          message: `No vehicle found with slug: ${cleanSlug}`,
          data: null
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: vehicle,
      meta: {
        slug: cleanSlug,
        found: true,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Error fetching vehicle by slug:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch vehicle',
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
