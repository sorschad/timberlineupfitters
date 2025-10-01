import type {Metadata} from 'next'
import Head from 'next/head'

import PageBuilderPage from '@/app/components/PageBuilder'
import HeritageHero from '@/app/components/HeritageHero'
import HeritageTimeline from '@/app/components/HeritageTimeline'
import {sanityFetch} from '@/sanity/lib/live'
import {getPageQuery} from '@/sanity/lib/queries'
import {GetPageQueryResult} from '@/sanity.types'
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
        <HeritageHero imageUrl="/images/heritage-hero.jpg" title="Timberline Upfitters" />
      </div>

      {/* Intentionally skip the generic heading block for Heritage */}

      <PageBuilderPage page={page as GetPageQueryResult} />

      <div className="mt-16 lg:mt-24">
        <HeritageTimeline />
      </div>
    </div>
  )
}


