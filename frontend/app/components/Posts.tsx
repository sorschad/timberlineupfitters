import Link from 'next/link'

import {sanityFetch} from '@/sanity/lib/live'
import {moreBrandsQuery, allBrandsQuery} from '@/sanity/lib/queries'
import {Brand as BrandType, AllBrandsQueryResult} from '@/sanity.types'
import DateComponent from '@/app/components/Date'
import OnBoarding from '@/app/components/Onboarding'
import Avatar from '@/app/components/Avatar'
import {createDataAttribute} from 'next-sanity'

const Brand = ({brand}: {brand: AllBrandsQueryResult[number]}) => {
  const {_id, title, slug, excerpt, date, author} = brand

  const attr = createDataAttribute({
    id: _id,
    type: 'brand',
    path: 'title',
  })

  return (
    <article
      data-sanity={attr()}
      key={_id}
      className="border border-gray-200 rounded-sm p-6 bg-gray-50 flex flex-col justify-between transition-colors hover:bg-white relative"
    >
      <Link className="hover:text-brand underline transition-colors" href={`/brands/${slug}`}>
        <span className="absolute inset-0 z-10" />
      </Link>
      <div>
        <h3 className="text-2xl font-bold mb-4 leading-tight">{title}</h3>

        <p className="line-clamp-3 text-sm leading-6 text-gray-600 max-w-[70ch]">{excerpt}</p>
      </div>
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
        {author && author.firstName && author.lastName && (
          <div className="flex items-center">
            <Avatar person={author} small={true} />
          </div>
        )}
        <time className="text-gray-500 text-xs font-mono" dateTime={date}>
          <DateComponent dateString={date} />
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
      <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl font-orbitron">
        {heading}
      </h2>
    )}
    {subHeading && <p className="mt-2 text-lg leading-8 text-gray-600 font-lato">{subHeading}</p>}
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
      heading="Recent Brands"
      subHeading={`${data.length === 1 ? 'This blog brand is' : `These ${data.length} blog brands are`} populated from your Sanity Studio.`}
    >
      {data.map((brand: any) => (
        <Brand key={brand._id} brand={brand} />
      ))}
    </Brands>
  )
}
