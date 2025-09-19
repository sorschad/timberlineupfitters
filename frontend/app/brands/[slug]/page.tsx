import type {Metadata, ResolvingMetadata} from 'next'
import {notFound} from 'next/navigation'
import {type PortableTextBlock} from 'next-sanity'
import {Suspense} from 'react'

import CoverImage from '@/app/components/CoverImage'
import {MoreBrands} from '@/app/components/Brands'
import PortableText from '@/app/components/PortableText'
import DateComponent from '@/app/components/Date'
import {sanityFetch} from '@/sanity/lib/live'
import {brandPagesSlugs, brandQuery} from '@/sanity/lib/queries'
import {resolveOpenGraphImage} from '@/sanity/lib/utils'

type Props = {
  params: Promise<{slug: string}>
}

/**
 * Generate the static params for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-static-params
 */
export async function generateStaticParams() {
  const {data} = await sanityFetch({
    query: brandPagesSlugs,
    // Use the published perspective in generateStaticParams
    perspective: 'published',
    stega: false,
  })
  return data
}

/**
 * Generate metadata for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */
export async function generateMetadata(props: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const params = await props.params
  const {data: brand} = await sanityFetch({
    query: brandQuery,
    params,
    // Metadata should never contain stega
    stega: false,
  })
  const previousImages = (await parent).openGraph?.images || []
  const ogImage = resolveOpenGraphImage(brand?.coverImage)

  return {
    title: brand?.name,
    description: brand?.excerpt,
    openGraph: {
      images: ogImage ? [ogImage, ...previousImages] : previousImages,
    },
  } satisfies Metadata
}

export default async function BrandPage(props: Props) {
  const params = await props.params
  const [{data: brand}] = await Promise.all([sanityFetch({query: brandQuery, params})])

  if (!brand?._id) {
    return notFound()
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'anthem':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'alpine':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'timberline':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'coming-soon':
        return 'bg-yellow-100 text-yellow-800'
      case 'discontinued':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <>
      <div className="">
        <div className="container my-12 lg:my-24 grid gap-12">
          <div>
            <div className="pb-6 grid gap-6 mb-6 border-b border-gray-100">
              <div className="max-w-3xl flex flex-col gap-6">
                <div className="flex items-center gap-4 mb-4">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getCategoryColor(brand.category)}`}>
                    {brand.category?.replace('-', ' ')}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(brand.status)}`}>
                    {brand.status?.replace('-', ' ')}
                  </span>
                </div>
                <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-7xl">
                  {brand.name}
                </h2>
                {brand.excerpt && (
                  <p className="text-xl text-gray-600 leading-relaxed">
                    {brand.excerpt}
                  </p>
                )}
              </div>
              <div className="max-w-3xl flex gap-4 items-center">
                <div className="flex items-center text-gray-500 text-sm">
                  <span className="mr-2">🚗</span>
                  Vehicle Brand
                </div>
                <time className="text-gray-500 text-sm font-mono" dateTime={brand.launchDate}>
                  Launched: <DateComponent dateString={brand.launchDate} />
                </time>
              </div>
            </div>
            <article className="gap-6 grid max-w-4xl">
              <div className="">
                {brand?.coverImage && <CoverImage image={brand.coverImage} priority />}
              </div>
              {brand.features && brand.features.length > 0 && (
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {brand.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-700">
                        <span className="w-2 h-2 bg-brand rounded-full mr-3 flex-shrink-0"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {brand.description?.length && (
                <PortableText className="max-w-2xl" value={brand.description as PortableTextBlock[]} />
              )}
            </article>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-100 bg-gray-50">
        <div className="container py-12 lg:py-24 grid gap-12">
          <aside>
            <Suspense>{await MoreBrands({skip: brand._id, limit: 2})}</Suspense>
          </aside>
        </div>
      </div>
    </>
  )
}
