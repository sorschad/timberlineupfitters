import { client } from '@/sanity/lib/client'
import { allAdditionalOptionsQuery } from '@/sanity/lib/queries'

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
  const contentType = searchParams.get('content') || 'all'

  try {
    let content = {}

    // Get all content types in one request for Figma Make
    const [brands, vehicles, manufacturers, homepage, settings, additionalOptions] = await Promise.all([
      client.fetch(`*[_type == "brand" && defined(slug.current)] | order(name asc) {
        _id, 
        name, 
        "slug": slug.current, 
        excerpt, 
        coverImage{
          asset->{
            _id,
            url
          }
        }, 
        primaryLogo{
          asset->{
            _id,
            url
          }
        }, 
        website, 
        primaryColor,
        secondaryColor,
        accentColor,
        backgroundColor,
        features,
        "launchDate": coalesce(launchDate, _updatedAt),
        "manufacturers": manufacturers[]->{
          _id,
          name,
          "slug": slug.current,
          logo{
            asset->{
              _id,
              url
            }
          }
        }
      }`),
      client.fetch(`*[_type == "vehicle" && defined(slug.current)] | order(modelYear desc, title asc) {
        _id, 
        title, 
        "slug": slug.current, 
        model, 
        vehicleType, 
        modelYear,
        trim,
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
        coverImage{
          asset->{
            _id,
            url
          }
        },
        specifications,
        features,
        inventory,
        tags
      }`),
      client.fetch(`*[_type == "manufacturer" && defined(slug.current)] | order(name asc) {
        _id, 
        name, 
        "slug": slug.current, 
        logo{
          asset->{
            _id,
            url
          }
        }, 
        description,
        "vehicleCount": count(*[_type == "vehicle" && references(^._id)])
      }`),
      client.fetch(`*[_type == "page" && name == "Homepage"][0]{
        _id, 
        name, 
        heading, 
        subheading, 
        heroBackgroundImages[]{
          asset->{
            _id,
            url
          },
          alt,
          title,
          subtitle
        }
      }`),
      client.fetch(`*[_type == "settings"][0]{
        ...,
        appLogo{
          asset->{
            _id,
            url
          }
        }
      }`),
      client.fetch(allAdditionalOptionsQuery)
    ])

    switch (contentType) {
      case 'brands':
        content = { brands }
        break
      case 'vehicles':
        content = { vehicles }
        break
      case 'manufacturers':
        content = { manufacturers }
        break
      case 'homepage':
        content = { homepage }
        break
      case 'settings':
        content = { settings }
        break
      case 'additionalOptions':
        content = { additionalOptions }
        break
      case 'all':
      default:
        content = { brands, vehicles, manufacturers, homepage, settings, additionalOptions }
    }

    const response = Response.json({
      success: true,
      content,
      lastUpdated: new Date().toISOString()
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
