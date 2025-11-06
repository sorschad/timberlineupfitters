import { client } from '@/sanity/lib/client'
import { 
  allBrandsQuery, 
  allVehiclesQuery, 
  allManufacturersQuery,
  homepageQuery,
  settingsQuery,
  brandQuery,
  vehicleQuery,
  manufacturerQuery,
  allAdditionalOptionsQuery,
  additionalOptionQuery,
  additionalOptionsByPackageQuery,
  additionalOptionsByManufacturerQuery
} from '@/sanity/lib/queries'
import { transformImagesToWebP } from '@/sanity/lib/apiImageTransform'

// Add CORS headers function
function addCorsHeaders(response: Response) {
  response.headers.set('Access-Control-Allow-Origin', 'https://carve-geo-83436247.figma.site')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  return response
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')
  const slug = searchParams.get('slug')
  const limit = parseInt(searchParams.get('limit') || '10')
  const offset = parseInt(searchParams.get('offset') || '0')

  try {
    let data

    switch (type) {
      case 'brands':
        data = await client.fetch(allBrandsQuery)
        break
      case 'vehicles':
        data = await client.fetch(allVehiclesQuery)
        break
      case 'manufacturers':
        data = await client.fetch(allManufacturersQuery)
        break
      case 'homepage':
        data = await client.fetch(homepageQuery)
        break
      case 'settings':
        data = await client.fetch(settingsQuery)
        break
      case 'additionalOptions':
        data = await client.fetch(allAdditionalOptionsQuery)
        break
      case 'brand':
        if (!slug) throw new Error('Slug required for brand')
        data = await client.fetch(brandQuery, { slug })
        break
      case 'vehicle':
        if (!slug) throw new Error('Slug required for vehicle')
        data = await client.fetch(vehicleQuery, { slug })
        break
      case 'manufacturer':
        if (!slug) throw new Error('Slug required for manufacturer')
        data = await client.fetch(manufacturerQuery, { slug })
        break
      case 'additionalOption':
        if (!slug) throw new Error('Slug required for additional option')
        data = await client.fetch(additionalOptionQuery, { slug })
        break
      case 'additionalOptionsByPackage':
        const packageType = searchParams.get('package')
        if (!packageType) throw new Error('Package parameter required')
        data = await client.fetch(additionalOptionsByPackageQuery, { package: packageType })
        break
      case 'additionalOptionsByManufacturer':
        const manufacturerId = searchParams.get('manufacturerId')
        if (!manufacturerId) throw new Error('Manufacturer ID parameter required')
        data = await client.fetch(additionalOptionsByManufacturerQuery, { manufacturerId })
        break
      default:
        const errorResponse = Response.json({ error: 'Invalid type parameter' }, { status: 400 })
        return addCorsHeaders(errorResponse)
    }

    // Transform all images to WebP format for optimal performance
    const transformedData = transformImagesToWebP(data)

    // Apply pagination if needed
    let paginatedData = transformedData
    if (limit && offset && Array.isArray(transformedData)) {
      paginatedData = transformedData.slice(offset, offset + limit)
    }

    const response = Response.json({
      success: true,
      data: paginatedData,
      meta: {
        type,
        slug,
        count: Array.isArray(paginatedData) ? paginatedData.length : 1,
        timestamp: new Date().toISOString()
      }
    })

    return addCorsHeaders(response)

  } catch (error) {
    const response = Response.json({ 
      error: 'Failed to fetch content',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
    
    return addCorsHeaders(response)
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
  const response = new Response(null, { status: 200 })
  return addCorsHeaders(response)
}
