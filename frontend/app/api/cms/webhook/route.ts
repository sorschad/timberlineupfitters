import { client } from '@/sanity/lib/client'

// Add CORS headers function
function addCorsHeaders(response: Response) {
  response.headers.set('Access-Control-Allow-Origin', 'https://carve-geo-83436247.figma.site')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  return response
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Handle Sanity webhook events
    if (body.type === 'mutation') {
      // Log the content update for debugging
      console.log('Content updated:', {
        type: body.type,
        documentId: body.documentId,
        timestamp: new Date().toISOString()
      })
      
      // You can add cache invalidation logic here
      // For example, trigger a rebuild of your Figma Make site
      // or invalidate CDN cache
      
      // Example: Send notification to external services
      // await fetch('https://carve-geo-83436247.figma.site/api/rebuild', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ 
      //     updatedDocument: body.documentId,
      //     timestamp: new Date().toISOString()
      //   })
      // })
    }

    const response = Response.json({ 
      success: true,
      message: 'Webhook processed successfully',
      timestamp: new Date().toISOString()
    })

    return addCorsHeaders(response)

  } catch (error) {
    console.error('Webhook processing failed:', error)
    const response = Response.json({ 
      error: 'Webhook processing failed',
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
