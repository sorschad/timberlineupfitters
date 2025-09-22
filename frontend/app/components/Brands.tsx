import Link from 'next/link'
import Image from 'next/image'

import {sanityFetch} from '@/sanity/lib/live'
import {moreBrandsQuery, allBrandsQuery, homepageBrandsQuery} from '@/sanity/lib/queries'
import {Brand as BrandType, AllBrandsQueryResult} from '@/sanity.types'
import DateComponent from '@/app/components/Date'
import OnBoarding from '@/app/components/Onboarding'
import {createDataAttribute} from 'next-sanity'
import {urlForImage} from '@/sanity/lib/utils'

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
      <Link className="hover:text-brand transition-colors" href={`/brands/${slug}`}>
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

  return (
    <section id="brands-section" className="w-full bg-brown border-t border-amber-200 py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-sm font-normal text-amber-800 mb-4 leading-none tracking-normal">
            Three distinct vehicle platforms engineered for specific mission requirements
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {data.map((brand: any) => {
            const imageUrl = urlForImage(brand.coverImage)?.width(800).height(600).fit('crop').url()
            const isAnthem = brand.slug === 'anthem'
            return (
              <div
                key={brand._id}
                className="relative group overflow-hidden rounded-lg border border-amber-300 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 h-80 sm:h-96 lg:h-[28rem]"
              >
                <Link href={`/brands/${brand.slug}`} className="absolute inset-0 z-10" />

                <div className="relative w-full h-full">
                  {imageUrl && (
                    <Image
                      src={imageUrl}
                      alt={brand?.coverImage?.alt || brand.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  )}
                  <div className="absolute inset-0 bg-amber-900/30" />
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-900/60 via-transparent to-transparent" />
                </div>

                <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6">
                  <div className="text-left">
                    <h4 className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 ${isAnthem ? 'text-red-600' : 'text-amber-50'}`}>
                      {brand.name}
                    </h4>
                    <div className="w-8 h-0.5 bg-orange-600 mt-2"></div>
                  </div>
                </div>

                <div className="absolute inset-0 bg-amber-900/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                  <p className="text-amber-50 text-sm sm:text-base text-center leading-relaxed">
                    {brand.excerpt}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="text-center mt-12 lg:mt-16">
          <Link 
            href="/our-brands"
            className="group inline-flex items-center gap-2 text-green-600 hover:text-green-500 font-medium text-sm transition-all duration-300 hover:gap-3"
          >
            <span className="relative">
              Explore all brands
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-500 transition-all duration-300 group-hover:w-full"></span>
            </span>
            <svg 
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 5l7 7-7 7" 
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
