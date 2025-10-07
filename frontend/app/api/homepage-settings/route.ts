import {NextResponse} from 'next/server'
import {sanityFetch} from '@/sanity/lib/live'
import {homepageQuery} from '@/sanity/lib/queries'
import {urlForImage} from '@/sanity/lib/utils'

export async function GET() {
  try {
    const {data} = await sanityFetch({query: homepageQuery, stega: false})
    const slides = ((data as any)?.heroBackgroundImages || []).map((image: any, idx: number) => {
      const imageUrl = image?.asset?.url || ''
      return {
        id: idx + 1,
        title: (data as any)?.heading || '',
        subtitle: (data as any)?.subheading || '',
        image: imageUrl,
        alt: image?.alt || 'Hero background',
      }
    })
    return NextResponse.json({slides})
  } catch (err) {
    console.error('Error fetching homepage page:', err)
    return NextResponse.json({slides: []})
  }
}


