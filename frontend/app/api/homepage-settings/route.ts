import {NextResponse} from 'next/server'
import {sanityFetch} from '@/sanity/lib/live'
import {homepageSettingsQuery} from '@/sanity/lib/queries'
import {urlForImage} from '@/sanity/lib/utils'

export async function GET() {
  try {
    const {data} = await sanityFetch({query: homepageSettingsQuery, stega: false})
    const slides = ((data as any)?.heroSlides || []).map((s: any, idx: number) => {
      const imageUrl = s?.image ? urlForImage(s.image)?.url() : ''
      return {
        id: idx + 1,
        title: s?.title || '',
        subtitle: s?.subtitle || '',
        image: imageUrl,
        alt: s?.image?.alt || 'Hero background',
      }
    })
    return NextResponse.json({slides})
  } catch (err) {
    console.error('Error fetching homepage settings:', err)
    return NextResponse.json({slides: []})
  }
}


