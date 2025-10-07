import {HomepageBrands} from '@/app/components/Brands'
import Hero from '@/app/components/Hero'
import HomepageCta from '@/app/components/HomepageCta'
import {HomepageVehicles} from '@/app/components/HomepageVehicles'

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <Hero />
      
      {/* Brands Section */}
      <HomepageBrands />

      {/* Vehicles Section */}
      <HomepageVehicles />

      {/* Homepage CTA above footer */}
      <HomepageCta />

    </>
  )
}
