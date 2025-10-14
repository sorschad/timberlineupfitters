import {sanityFetch} from '@/sanity/lib/live'
import {allVehiclesQuery, brandsWithSloganQuery} from '@/sanity/lib/queries'
import HomepageVehiclesClient from './HomepageVehiclesClient'

export const HomepageVehicles = async () => {
  const {data: vehicles} = await sanityFetch({
    query: allVehiclesQuery,
    perspective: 'published',
    stega: false,
  })

  const {data: brands} = await sanityFetch({
    query: brandsWithSloganQuery,
    perspective: 'published',
    stega: false,
  })

  if (!vehicles || vehicles.length === 0) {
    return null
  }

  return <HomepageVehiclesClient vehicles={vehicles} brands={brands || []} />
}
