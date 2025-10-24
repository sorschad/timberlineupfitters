export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

export async function GET() {
  return Response.json({ 
    message: 'CORS enabled for Figma Make integration',
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
      'Get specific brand': 'GET /api/cms/content?type=brand&slug=brand-name',
      'Get specific vehicle': 'GET /api/cms/content?type=vehicle&slug=vehicle-name',
      'Get specific manufacturer': 'GET /api/cms/content?type=manufacturer&slug=manufacturer-name'
    }
  }, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  })
}
