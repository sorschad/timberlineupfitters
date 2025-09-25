import {settingsQuery, allManufacturersQuery, timberlineVehiclesQuery, brandsWithSloganQuery} from '@/sanity/lib/queries'
import {sanityFetch} from '@/sanity/lib/live'
import HeaderClient from './HeaderClient'

interface Manufacturer {
  _id: string
  name: string
  slug: { current: string }
  logo?: any
  vehicleCount: number
}

export default async function Header() {
  const [
    {data: settings},
    {data: manufacturers},
    {data: timberlineVehicles},
    {data: brands},
  ] = await Promise.all([
    sanityFetch({ query: settingsQuery }),
    sanityFetch({ query: allManufacturersQuery }),
    sanityFetch({ query: timberlineVehiclesQuery }),
    sanityFetch({ query: brandsWithSloganQuery }),
  ])
  return (
    <HeaderClient
      settingsTitle={settings?.title}
      appLogo={(settings as any)?.appLogo}
      manufacturers={manufacturers as unknown as Manufacturer[]}
      timberlineVehicles={timberlineVehicles as any}
      brands={brands as any}
    />
  )
}
