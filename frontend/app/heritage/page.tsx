import type {Metadata} from 'next'

import HeritageHero from '@/app/components/HeritageHero'
import HeritageTimeline from '@/app/components/HeritageTimeline'
import TimberlineTeam from '@/app/components/TimberlineTeam'
import {sanityFetch} from '@/sanity/lib/live'
import {getPageQuery} from '@/sanity/lib/queries'
import {PageOnboarding} from '@/app/components/Onboarding'

export async function generateMetadata(): Promise<Metadata> {
  try {
    const {data: page} = await sanityFetch({
      query: getPageQuery,
      params: {slug: 'heritage'},
      stega: false,
    })

    return {
      title: 'Heritage | Timberline Upfitters',
      description: page?.heading || 'Discover the rich heritage and history of Timberline Upfitters, pioneers in van conversion since 1961.',
    } satisfies Metadata
  } catch (error) {
    console.error('Error generating metadata for heritage page:', error)
    return {
      title: 'Heritage | Timberline Upfitters',
      description: 'Discover the rich heritage and history of Timberline Upfitters, pioneers in van conversion since 1961.',
    }
  }
}

export default async function HeritagePage() {
  try {
    const [{data: page}] = await Promise.all([
      sanityFetch({query: getPageQuery, params: {slug: 'heritage'}}),
    ])

    if (!page?._id) {
      return (
        <div className="py-40">
          <PageOnboarding />
        </div>
      )
    }

    return (
      <div className="my-12 lg:my-24">
        <div className="mb-12 lg:mb-24 -mt-12 lg:-mt-24">
          <HeritageHero 
            heroBackgroundImages={page?.heroBackgroundImages || undefined} 
            title={page?.heading || "Timberline Upfitters"} 
            subtitle={page?.subheading || undefined}
          />
        </div>

        {/* Statement moved above sticky gallery */}
        <div className="mt-12 lg:mt-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight">
              We started converting vans long before it was a movement.
            </h2>
          </div>
        </div>

        {/* Timeline directly under the headline */}
        <div className="mt-8 lg:mt-12">
          <HeritageTimeline heading={''} />
        </div>

        {/* Timberline Team Section */}
        <div className="mt-16 lg:mt-24">
          <TimberlineTeam />
        </div>

      </div>
    )
  } catch (error) {
    console.error('Error loading heritage page:', error)
    
    // Fallback UI when Sanity API fails
    return (
      <div className="my-12 lg:my-24">
        <div className="mb-12 lg:mb-24 -mt-12 lg:-mt-24">
          <HeritageHero 
            heroBackgroundImages={undefined} 
            title="Timberline Upfitters" 
            subtitle="Go anywhere in a moment's notice"
          />
        </div>

        {/* Statement moved above sticky gallery */}
        <div className="mt-12 lg:mt-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight">
              We started converting vans long before it was a movement.
            </h2>
          </div>
        </div>

        {/* Timeline directly under the headline */}
        <div className="mt-8 lg:mt-12">
          <HeritageTimeline heading={''} />
        </div>

        {/* Timberline Team Section */}
        <div className="mt-16 lg:mt-24">
          <TimberlineTeam />
        </div>

      </div>
    )
  }
}


