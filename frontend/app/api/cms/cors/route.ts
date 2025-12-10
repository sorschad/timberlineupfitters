// Add CORS headers function
function addCorsHeaders(response: Response) {
  response.headers.set('Access-Control-Allow-Origin', 'https://carve-geo-83436247.figma.site')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  return response
}

export async function OPTIONS() {
  const response = new Response(null, { status: 200 })
  return addCorsHeaders(response)
}

export async function GET() {
  const response = Response.json({ 
    message: 'CORS enabled for Figma Make integration',
    allowedOrigin: 'https://carve-geo-83436247.figma.site',
    endpoints: [
      '/api/cms/content',
      '/api/cms/simple',
      '/api/cms/webhook'
    ],
    usage: {
      'Get all content': 'GET /api/cms/simple?content=all',
      'Get brands only': 'GET /api/cms/simple?content=brands',
      'Get vehicles only': 'GET /api/cms/simple?content=vehicles',
      'Get manufacturers only': 'GET /api/cms/simple?content=manufacturers',
      'Get additional options only': 'GET /api/cms/simple?content=additionalOptions',
      'Get specific brand': 'GET /api/cms/content?type=brand&slug=brand-name',
      'Get specific vehicle': 'GET /api/cms/content?type=vehicle&slug=vehicle-name',
      'Get specific manufacturer': 'GET /api/cms/content?type=manufacturer&slug=manufacturer-name',
      'Get specific additional option': 'GET /api/cms/content?type=additionalOption&slug=option-name',
      'Get additional options by package': 'GET /api/cms/content?type=additionalOptionsByPackage&package=performance'
    }
  })

  return addCorsHeaders(response)
}
