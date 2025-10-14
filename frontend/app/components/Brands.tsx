import Link from 'next/link'
import Image from 'next/image'

import {sanityFetch} from '@/sanity/lib/live'
import {moreBrandsQuery, allBrandsQuery, homepageBrandsQuery} from '@/sanity/lib/queries'
import {Brand as BrandType, AllBrandsQueryResult} from '@/sanity.types'
import DateComponent from '@/app/components/Date'
import OnBoarding from '@/app/components/Onboarding'
import {createDataAttribute} from 'next-sanity'
import {urlForImage} from '@/sanity/lib/utils'
import { IMAGE_SIZES } from '@/sanity/lib/imageUtils'
import HomepageBrandsClient from './HomepageBrandsClient'

const Brand = ({brand}: {brand: AllBrandsQueryResult[number]}) => {
  const {_id, name, slug, excerpt, launchDate, features} = brand
  const featuresList: string[] = Array.isArray(features) ? (features as unknown as string[]) : []

  const attr = createDataAttribute({
    id: _id,
    type: 'brand',
    path: 'name',
  })

  return (
    <article
      data-sanity={attr()}
      key={_id}
      className="border border-gray-200 rounded-lg p-6 bg-white flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:border-brand relative group"
    >
      <Link className="hover:text-brand transition-colors" href={`/brands#${slug}`}>
        <span className="absolute inset-0 z-10" />
      </Link>
      
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold leading-tight group-hover:text-brand transition-colors">{name}</h3>
        </div>

        <p className="line-clamp-3 text-sm leading-6 text-gray-600 max-w-[70ch] mb-4">{excerpt}</p>

        {featuresList.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Key Features:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {featuresList.slice(0, 3).map((feature: string, index: number) => (
                <li key={index} className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-brand rounded-full mr-2"></span>
                  {feature}
                </li>
              ))}
              {featuresList.length > 3 && (
                <li className="text-xs text-gray-500">
                  +{featuresList.length - 3} more features
                </li>
              )}
            </ul>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center text-gray-500 text-xs font-mono">
          <span className="mr-2">🚗</span>
          Vehicle Brand
        </div>
        <time className="text-gray-500 text-xs font-mono" dateTime={launchDate || ''}>
          <DateComponent dateString={launchDate || ''} />
        </time>
      </div>
    </article>
  )
}

const Brands = ({
  children,
  heading,
  subHeading,
}: {
  children: React.ReactNode
  heading?: string
  subHeading?: string
}) => (
  <div>
    {heading && (
      <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
        {heading}
      </h2>
    )}
    {subHeading && <p className="mt-2 text-lg leading-8 text-gray-600">{subHeading}</p>}
    <div className="pt-6 space-y-6">{children}</div>
  </div>
)

export const MoreBrands = async ({skip, limit}: {skip: string; limit: number}) => {
  const {data} = await sanityFetch({
    query: moreBrandsQuery,
    params: {skip, limit},
  })

  if (!data || data.length === 0) {
    return null
  }

  return (
    <Brands heading={`Recent Brands (${data?.length})`}>
      {data?.map((brand: any) => (
        <Brand key={brand._id} brand={brand} />
      ))}
    </Brands>
  )
}

export const AllBrands = async () => {
  const {data} = await sanityFetch({query: allBrandsQuery})

  if (!data || data.length === 0) {
    return <OnBoarding />
  }

  return (
    <Brands
      heading="Our Vehicle Brands"
      subHeading={`${data.length === 1 ? 'This brand is' : `These ${data.length} brands are`} available from Timberline Upfitters.`}
    >
      {data.map((brand: any) => (
        <Brand key={brand._id} brand={brand} />
      ))}
    </Brands>
  )
}

export const HomepageBrands = async () => {
  const {data} = await sanityFetch({query: homepageBrandsQuery})

  if (!data || data.length === 0) {
    return null
  }

  return <HomepageBrandsClient brands={data} />
}
