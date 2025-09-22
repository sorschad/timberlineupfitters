import Link from 'next/link'

import {AllBrands} from '@/app/components/Brands'
import BrandsSection from '@/app/components/BrandsSection'
import Hero from '@/app/components/Hero'

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <Hero />
      
      {/* Brands Section */}
      <BrandsSection />
      
      {/* About Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
              Premium Vehicle Upfitting
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 mb-12 leading-relaxed">
              At Timberline Upfitters, we specialize in transforming your vehicle into the ultimate adventure companion. 
              Our expert craftsmen combine precision engineering with premium materials to deliver custom solutions 
              that enhance both performance and aesthetics.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-brand rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Craftsmanship</h3>
                <p className="text-gray-600">Professional installation with attention to every detail</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-brand rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Premium Materials</h3>
                <p className="text-gray-600">Only the highest quality components and accessories</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-brand rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Custom Solutions</h3>
                <p className="text-gray-600">Tailored to your specific needs and adventure goals</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-brand text-white font-semibold rounded-lg hover:bg-brand/90 transition-colors duration-300"
              >
                Get Started Today
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/our-brands"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-brand text-brand font-semibold rounded-lg hover:bg-brand hover:text-white transition-colors duration-300"
              >
                View Our Brands
              </Link>
            </div>
          </div>
        </div>
      </section>
      
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
