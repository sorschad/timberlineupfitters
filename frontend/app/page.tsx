import Link from 'next/link'

import {HomepageBrands} from '@/app/components/Brands'
import Hero from '@/app/components/Hero'
import HomepageCta from '@/app/components/HomepageCta'
import FindDealerSection from '@/app/components/FindDealerSection'

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <Hero />
      
      {/* Brands Section */}
      <HomepageBrands />

      {/* Find Dealer Section */}
      <FindDealerSection />

      {/* Homepage CTA above footer */}
      <HomepageCta />

    </>
  )
}
