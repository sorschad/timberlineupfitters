import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ representatives: [] })
    }

    // Search for sales representatives by location
    const representatives = await client.fetch(`
      *[_type == "salesRepresentative" && isActive == true && (
        territoryRegion match "*${query}*" ||
        territoryZipCodes match "*${query}*" ||
        name match "*${query}*"
      )] | order(sortOrder asc, name asc) {
        _id,
        name,
        territoryRegion,
        territoryZipCodes,
        email,
        phone,
        mobile,
        fax,
        profileImage {
          asset->{
            url
          },
          alt
        },
        bio,
        specialties
      }
    `)

    return NextResponse.json({ representatives })
  } catch (error) {
    console.error('Error searching sales representatives:', error)
    return NextResponse.json(
      { error: 'Failed to search representatives' },
      { status: 500 }
    )
  }
}
