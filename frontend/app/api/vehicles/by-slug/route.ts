import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'

// Comprehensive vehicle query with all fields - includes current slug, slug history, and aliases
// Note: We fetch all vehicles and filter in JavaScript for slug history/aliases since GROQ doesn't support direct array membership checks
const comprehensiveVehicleQuery = `
  *[_type == "vehicle" && (
    slug.current match $slug ||
    lower(slug.current) match lower($slug) ||
    slug.current match $slugPattern ||
    lower(slug.current) match lower($slugPattern)
  )] | order(modelYear desc, title asc) {
    _id,
    _type,
    _createdAt,
    _updatedAt,
    _rev,
    title,
    slug,
    slugHistory[] {
      slug,
      activeFrom,
      activeTo
    },
    slugAliases,
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
    
    // First, try to find by current slug
    let vehicles = await client.fetch(comprehensiveVehicleQuery, { 
      slug: cleanSlug,
      slugPattern: slugPattern
    })

    // If not found by current slug, search by slug history or aliases
    if (!vehicles || vehicles.length === 0 || !vehicles[0]) {
      const allVehicles = await client.fetch(`
        *[_type == "vehicle"] {
          _id,
          title,
          slug,
          slugHistory[] {
            slug,
            activeFrom,
            activeTo
          },
          slugAliases
        }
      `)
      
      // Find vehicle where slug matches history or aliases
      const matchingVehicle = allVehicles.find((v: any) => {
        const inHistory = v.slugHistory?.some((entry: any) => entry.slug === cleanSlug)
        const inAliases = v.slugAliases?.includes(cleanSlug)
        return inHistory || inAliases
      })
      
      if (matchingVehicle) {
        // Fetch full vehicle data
        const fullVehicleQuery = `
          *[_type == "vehicle" && _id == $id][0] {
            _id,
            _type,
            _createdAt,
            _updatedAt,
            _rev,
            title,
            slug,
            slugHistory[] {
              slug,
              activeFrom,
              activeTo
            },
            slugAliases,
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
        vehicles = [await client.fetch(fullVehicleQuery, { id: matchingVehicle._id })]
      }
    }

    const vehicle = vehicles && vehicles.length > 0 ? vehicles[0] : null

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

    // Check if the requested slug matches the current slug
    const currentSlug = vehicle.slug?.current
    const isHistoricalSlug = currentSlug !== cleanSlug && (
      vehicle.slugHistory?.some((entry: any) => entry.slug === cleanSlug) ||
      vehicle.slugAliases?.includes(cleanSlug)
    )

    return NextResponse.json({
      success: true,
      data: vehicle,
      meta: {
        slug: cleanSlug,
        currentSlug: currentSlug,
        isHistoricalSlug: isHistoricalSlug,
        redirect: isHistoricalSlug,
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
