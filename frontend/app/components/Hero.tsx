import {sanityFetch} from '@/sanity/lib/live'
import {homepageQuery} from '@/sanity/lib/queries'
import {urlForImage} from '@/sanity/lib/utils'
import HeroClient from './HeroClient'

interface HeroSlide {
  id: number
  title: string
  subtitle: string
  image: string
  alt: string
}

export default async function Hero() {
  try {
    // Fetch homepage page using server-side sanityFetch for live preview support
    const {data} = await sanityFetch({
      query: homepageQuery,
      perspective: 'published',
      stega: false,
    })

    console.log('Server-side homepage page data:', data) // Debug log

    // Process slides data from heroBackgroundImages
    const slides: HeroSlide[] = ((data as any)?.heroBackgroundImages || []).map((image: any, idx: number) => {
      const imageUrl = image?.asset?.url || ''
      return {
        id: idx + 1,
        title: image?.title || '',
        subtitle: image?.subtitle || '',
        image: imageUrl,
        alt: image?.alt || 'Hero background',
      }
    })

    console.log('Processed slides on server:', slides) // Debug log

    // Pass slides to client component
    return <HeroClient slides={slides} />
  } catch (error) {
    console.error('Error fetching homepage page:', error)
    // Return empty slides on error
    return <HeroClient slides={[]} />
  }
}
