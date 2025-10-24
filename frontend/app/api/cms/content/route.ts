import { client } from '@/sanity/lib/client'
import { 
  allBrandsQuery, 
  allVehiclesQuery, 
  allManufacturersQuery,
  homepageQuery,
  settingsQuery,
  brandQuery,
  vehicleQuery,
  manufacturerQuery
} from '@/sanity/lib/queries'

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
      default:
        return Response.json({ error: 'Invalid type parameter' }, { status: 400 })
    }

    // Apply pagination if needed
    if (limit && offset && Array.isArray(data)) {
      data = data.slice(offset, offset + limit)
    }

    return Response.json({
      success: true,
      data,
      meta: {
        type,
        slug,
        count: Array.isArray(data) ? data.length : 1,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    return Response.json({ 
      error: 'Failed to fetch content',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
