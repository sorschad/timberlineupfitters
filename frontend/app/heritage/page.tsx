import type {Metadata} from 'next'
import Head from 'next/head'

import HeritageHero from '@/app/components/HeritageHero'
import HeritageTimeline from '@/app/components/HeritageTimeline'
import ParallaxVerticalMasonry from '@/app/components/ParallaxVerticalMasonry'
import TeamSection from '@/app/components/TeamSection'
import {sanityFetch} from '@/sanity/lib/live'
import {getPageQuery} from '@/sanity/lib/queries'
import {PageOnboarding} from '@/app/components/Onboarding'

export async function generateMetadata(): Promise<Metadata> {
  const {data: page} = await sanityFetch({
    query: getPageQuery,
    params: {slug: 'heritage'},
    stega: false,
  })

  return {
    title: 'Timberline Upfitters',
    description: page?.heading,
  } satisfies Metadata
}

export default async function HeritagePage() {
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
      <Head>
        <title>Timberline Upfitters</title>
      </Head>

      <div className="mb-12 lg:mb-24 -mt-12 lg:-mt-24">
        <HeritageHero 
          heroBackgroundImages={page?.heroBackgroundImages} 
          title={page?.heading || "Timberline Upfitters"} 
          subtitle={page?.subheading}
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

      {/* Meet the Team */}
      <div className="mt-16 lg:mt-24">
        <TeamSection />
      </div>

      {/* Masonry-style sticky gallery */}
      <div className="mt-8 lg:mt-12">
        {(() => {
          const cmsImages = (page?.heroBackgroundImages || []).map((img: any) => ({
            url: img?.asset?.url,
            alt: img?.alt,
          }))

          // Additional images to enrich the masonry sticky gallery
          const extraImages = [
            {url: '/images/heritage-hero.jpg', alt: 'Heritage hero'},
            {url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop', alt: 'Mountain lake at dawn'},
            {url: 'https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?q=80&w=1600&auto=format&fit=crop', alt: 'Pine forest trail'},
            {url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1600&auto=format&fit=crop', alt: 'Desert road adventure'},
            {url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1600&auto=format&fit=crop', alt: 'Mountain vista'},
            {url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1600&auto=format&fit=crop', alt: 'Forest trail 2'},
          ]

          const images = [...cmsImages, ...extraImages]

          return (
            <ParallaxVerticalMasonry
              images={images}
            />
          )
        })()}
      </div>

      {/* End content; sticky gallery sits above footer */}
    </div>
  )
}


