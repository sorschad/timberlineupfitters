import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'

// Add CORS headers function
function addCorsHeaders(response: Response) {
  response.headers.set('Access-Control-Allow-Origin', 'https://carve-geo-83436247.figma.site')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  return response
}

/**
 * Builds a GROQ query for filtering additional options by Make, Model, Brand, and/or Package
 */
function buildAdditionalOptionsQuery(filters: {
  make?: string
  model?: string
  brand?: string
  package?: string
}) {
  const conditions: string[] = []
  const params: Record<string, string> = {}

  // Build filter conditions dynamically
  if (filters.make) {
    conditions.push('compatibleVehicles[]->manufacturer->name match "*$make*"')
    params.make = filters.make.trim().replace(/[\\"'*]/g, '')
  }

  if (filters.model) {
    conditions.push('compatibleVehicles[]->model match "*$model*"')
    params.model = filters.model.trim().replace(/[\\"'*]/g, '')
  }

  if (filters.brand) {
    conditions.push('brand->name match "*$brand*"')
    params.brand = filters.brand.trim().replace(/[\\"'*]/g, '')
  }

  if (filters.package) {
    conditions.push('package match "*$package*"')
    params.package = filters.package.trim().replace(/[\\"'*]/g, '')
  }

  const filterClause = conditions.length > 0 
    ? `&& ${conditions.join(' && ')}` 
    : ''

  const query = `
    *[_type == "additionalOption" && isActive == true ${filterClause}] | order(sortOrder asc, name asc) {
      _id,
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
          }
        }
      },
      "brand": brand->{
        _id,
        name,
        primaryColor
      },
      package,
      image{
        asset->{
          _id,
          url,
          metadata {
            dimensions {
              width,
              height,
              aspectRatio
            }
          }
        },
        alt,
        caption
      },
      price{
        amount,
        currency,
        isEstimate
      },
      availability,
      features,
      tags,
      "compatibleVehicles": compatibleVehicles[]->{
        _id,
        title,
        slug,
        model,
        vehicleType,
        modelYear,
        "manufacturer": manufacturer->{
          _id,
          name
        }
      },
      isActive,
      sortOrder
    }
  `

  return { query, params }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Extract filter parameters
    const make = searchParams.get('make')
    const model = searchParams.get('model')
    const brand = searchParams.get('brand')
    const packageName = searchParams.get('package')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build query with filters
    const { query, params } = buildAdditionalOptionsQuery({
      make: make || undefined,
      model: model || undefined,
      brand: brand || undefined,
      package: packageName || undefined,
    })

    // Fetch additional options
    const options = await client.fetch(query, params)

    // Apply pagination
    const paginatedOptions = Array.isArray(options) 
      ? options.slice(offset, offset + limit) 
      : []

    // Format response for carousel display
    const formattedOptions = paginatedOptions.map((option: any) => ({
      id: option._id,
      name: option.name,
      slug: option.slug?.current || option.slug,
      description: option.description,
      manufacturer: option.manufacturer ? {
        id: option.manufacturer._id,
        name: option.manufacturer.name,
        logo: option.manufacturer.logo?.asset?.url || null,
      } : null,
      brand: option.brand ? {
        id: option.brand._id,
        name: option.brand.name,
        primaryColor: option.brand.primaryColor,
      } : null,
      package: option.package,
      image: option.image ? {
        url: option.image.asset?.url || null,
        alt: option.image.alt || option.name,
        caption: option.image.caption || null,
        dimensions: option.image.asset?.metadata?.dimensions || null,
      } : null,
      price: option.price ? {
        amount: option.price.amount,
        currency: option.price.currency || 'USD',
        isEstimate: option.price.isEstimate || false,
      } : null,
      availability: option.availability,
      features: option.features || [],
      tags: option.tags || [],
      compatibleVehicles: option.compatibleVehicles || [],
      isActive: option.isActive,
      sortOrder: option.sortOrder || 0,
    }))

    const response = NextResponse.json({
      success: true,
      data: formattedOptions,
      meta: {
        filters: {
          make: make || null,
          model: model || null,
          brand: brand || null,
          package: packageName || null,
        },
        count: formattedOptions.length,
        total: Array.isArray(options) ? options.length : 0,
        limit,
        offset,
        hasMore: Array.isArray(options) && (offset + limit) < options.length,
        timestamp: new Date().toISOString()
      }
    })

    return addCorsHeaders(response)
  } catch (error) {
    console.error('Error fetching additional options for Figma:', error)
    const errorResponse = NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch additional options',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
    return addCorsHeaders(errorResponse)
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
  const response = new Response(null, { status: 200 })
  return addCorsHeaders(response)
}
