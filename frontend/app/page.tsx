import Link from 'next/link'

import {AllBrands, HomepageBrands} from '@/app/components/Brands'
import Hero from '@/app/components/Hero'

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <Hero />
      
      {/* Brands Section */}
      <HomepageBrands />

    </>
  )
}
