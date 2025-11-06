import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { 
  searchAdditionalOptionsQuery,
  searchAdditionalOptionsByVehicleMakeQuery,
  searchAdditionalOptionsByMakeOnlyQuery
} from '@/sanity/lib/queries'

// Add CORS headers function
function addCorsHeaders(response: Response) {
  response.headers.set('Access-Control-Allow-Origin', 'https://carve-geo-83436247.figma.site')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  return response
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const make = searchParams.get('make')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Validate that we have at least one search parameter
    if (!query && !make) {
      const emptyResponse = NextResponse.json({
        success: true,
        data: [],
        meta: {
          query: '',
          make: '',
          count: 0,
          total: 0,
          limit,
          offset,
          hasMore: false,
          timestamp: new Date().toISOString()
        }
      })
      return addCorsHeaders(emptyResponse)
    }

    let options

    if (make && query) {
      // Search by both make and option
      const sanitizedMake = make.trim().replace(/[\\"'*]/g, '')
      const sanitizedQuery = query.trim().replace(/[\\"'*]/g, '')
      
      options = await client.fetch(searchAdditionalOptionsByVehicleMakeQuery, { 
        makeQuery: sanitizedMake,
        optionQuery: sanitizedQuery
      })
    } else if (make) {
      // Search only by make
      const sanitizedMake = make.trim().replace(/[\\"'*]/g, '')
      
      options = await client.fetch(searchAdditionalOptionsByMakeOnlyQuery, { 
        makeQuery: sanitizedMake
      })
    } else {
      // Search only by option (original functionality)
      const sanitizedQuery = query.trim().replace(/[\\"'*]/g, '')
      
      options = await client.fetch(searchAdditionalOptionsQuery, { 
        query: sanitizedQuery
      })
    }

    // Apply pagination
    const paginatedOptions = Array.isArray(options) 
      ? options.slice(offset, offset + limit) 
      : []

    const response = NextResponse.json({
      success: true,
      data: paginatedOptions,
      meta: {
        query: query || '',
        make: make || '',
        count: paginatedOptions.length,
        total: Array.isArray(options) ? options.length : 0,
        limit,
        offset,
        hasMore: Array.isArray(options) && (offset + limit) < options.length,
        timestamp: new Date().toISOString()
      }
    })

    return addCorsHeaders(response)
  } catch (error) {
    console.error('Error searching additional options:', error)
    const errorResponse = NextResponse.json(
      { 
        success: false,
        error: 'Failed to search additional options',
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
