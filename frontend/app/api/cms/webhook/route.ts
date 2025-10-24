import { client } from '@/sanity/lib/client'

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
      // await fetch('https://your-figma-make-site.com/api/rebuild', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ 
      //     updatedDocument: body.documentId,
      //     timestamp: new Date().toISOString()
      //   })
      // })
    }

    return Response.json({ 
      success: true,
      message: 'Webhook processed successfully',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Webhook processing failed:', error)
    return Response.json({ 
      error: 'Webhook processing failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
