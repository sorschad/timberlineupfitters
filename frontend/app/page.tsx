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
      
      {/* All Brands Section */}
      <div className="border-t border-gray-100 bg-gray-50">
        <div className="container">
          <aside className="py-12 sm:py-20">
            <AllBrands />
          </aside>
        </div>
      </div>
    </>
  )
}
