'use client'

import Image from 'next/image'

interface Brand {
  id: string
  topTitle: string
  mainTitle: string
  bottomTitle: string
  image: string
  alt: string
  description: string
}

const brands: Brand[] = [
  {
    id: 'anthem',
    topTitle: '',
    mainTitle: 'TSPORT',
    bottomTitle: '',
    image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    alt: 'Red lifted Ford F-150 style pickup truck with black accents',
    description: 'Performance and custom sport trucks engineered for power and style'
  },
  {
    id: 'alpine',
    topTitle: '',
    mainTitle: 'ALPINE',
    bottomTitle: '',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    alt: 'White SUV driving on mountain road',
    description: 'Mountain-ready vehicles designed for rugged terrain and adventure'
  },
  {
    id: 'timberline',
    topTitle: '',
    mainTitle: 'TIMBERLINE',
    bottomTitle: '',
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    alt: 'Dark SUV on off-road trail with roof rack',
    description: 'Expedition vehicles equipped for the ultimate off-road adventures'
  }
]

export default function BrandsSection() {
  return (
    <section className="w-full bg-amber-50 border-t border-amber-200 py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-sm font-normal text-amber-800 mb-4 leading-none tracking-normal">
            Three distinct vehicle platforms engineered for specific mission requirements
          </h2>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {brands.map((brand, index) => (
            <div
              key={brand.id}
              className="relative group overflow-hidden rounded-lg border border-amber-300 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 h-80 sm:h-96 lg:h-[28rem]"
            >
              {/* Vehicle Image */}
              <div className="relative w-full h-full">
                <Image
                  src={brand.image}
                  alt={brand.alt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* Earthy Overlay */}
                <div className="absolute inset-0 bg-amber-900/30" />
                {/* Gradient Overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-amber-900/60 via-transparent to-transparent" />
              </div>

              {/* Content Overlay */}
              <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-6">
                {/* Top Title */}
                <div className="text-left">
                  <h3 className={`text-xs sm:text-sm font-semibold uppercase tracking-wider mb-2 ${
                    brand.id === 'anthem' ? 'text-amber-50' : 'text-amber-900'
                  }`}>
                    {brand.topTitle}
                  </h3>
                </div>

                {/* Bottom Content */}
                <div className="text-left">
                  {/* Main Title */}
                  <h4 className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 ${
                    brand.id === 'anthem' ? 'text-red-600' : 'text-amber-50'
                  }`}>
                    {brand.mainTitle}
                  </h4>
                  
                  {/* Bottom Title (only for Anthem) */}
                  {brand.bottomTitle && (
                    <h5 className="text-xl sm:text-2xl lg:text-3xl font-bold text-amber-50">
                      {brand.bottomTitle}
                    </h5>
                  )}
                  
                  {/* Orange-brown underline for all brands */}
                  <div className="w-8 h-0.5 bg-orange-600 mt-2"></div>
                </div>
              </div>

              {/* Hover Description */}
              <div className="absolute inset-0 bg-amber-900/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                <p className="text-amber-50 text-sm sm:text-base text-center leading-relaxed">
                  {brand.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12 lg:mt-16">
          <button className="bg-amber-800 hover:bg-amber-900 text-amber-50 font-semibold py-3 px-8 sm:py-4 sm:px-12 text-sm sm:text-base transition-all duration-300 transform hover:scale-105 shadow-lg">
            EXPLORE ALL BRANDS
          </button>
        </div>
      </div>
    </section>
  )
}
