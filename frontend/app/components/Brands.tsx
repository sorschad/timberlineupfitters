import Link from 'next/link'

import {sanityFetch} from '@/sanity/lib/live'
import {moreBrandsQuery, allBrandsQuery} from '@/sanity/lib/queries'
import {Brand as BrandType, AllBrandsQueryResult} from '@/sanity.types'
import DateComponent from '@/app/components/Date'
import OnBoarding from '@/app/components/Onboarding'
import {createDataAttribute} from 'next-sanity'

const Brand = ({brand}: {brand: AllBrandsQueryResult[number]}) => {
  const {_id, name, slug, excerpt, launchDate, category, status, features} = brand

  const attr = createDataAttribute({
    id: _id,
    type: 'brand',
    path: 'name',
  })

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
    <article
      data-sanity={attr()}
      key={_id}
      className="border border-gray-200 rounded-lg p-6 bg-white flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:border-brand relative group"
    >
      <Link className="hover:text-brand transition-colors" href={`/brands/${slug}`}>
        <span className="absolute inset-0 z-10" />
      </Link>
      
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold leading-tight group-hover:text-brand transition-colors">{name}</h3>
          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(status)}`}>
            {status?.replace('-', ' ')}
          </span>
        </div>

        <div className="mb-4">
          <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full border ${getCategoryColor(category)}`}>
            {category?.replace('-', ' ')}
          </span>
        </div>

        <p className="line-clamp-3 text-sm leading-6 text-gray-600 max-w-[70ch] mb-4">{excerpt}</p>

        {features && features.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Key Features:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {features.slice(0, 3).map((feature, index) => (
                <li key={index} className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-brand rounded-full mr-2"></span>
                  {feature}
                </li>
              ))}
              {features.length > 3 && (
                <li className="text-xs text-gray-500">
                  +{features.length - 3} more features
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
        <time className="text-gray-500 text-xs font-mono" dateTime={launchDate}>
          <DateComponent dateString={launchDate} />
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
