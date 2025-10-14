'use client'

import Image from 'next/image'
import { HomepageBrandsQueryResult } from '@/sanity.types'
import { urlForImage } from '@/sanity/lib/utils'
import { IMAGE_SIZES } from '@/sanity/lib/imageUtils'

interface HomepageBrandsClientProps {
  brands: HomepageBrandsQueryResult
}

export default function HomepageBrandsClient({ brands }: HomepageBrandsClientProps) {
  return (
    <section id="brands-section" className="w-full bg-brown/90 border-t border-amber-200 py-4 scroll-mt-24">
      <div className="container-fluid mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-6 h-140 sm:h-96 lg:h-[450px]">
          {brands.map((brand: any) => {
            const imageUrl = urlForImage(brand.coverImage)?.width(800).height(600).fit('crop').url()
            const isAnthem = brand.slug === 'anthem'
            return (
              <div
                key={brand._id}
                className="relative group overflow-hidden border border-amber-300 shadow-lg hover:shadow-xl"
              >
                <button 
                  onClick={() => {
                    // Scroll to vehicles section
                    const vehiclesSection = document.getElementById('vehicles-section')
                    if (vehiclesSection) {
                      vehiclesSection.scrollIntoView({ behavior: 'smooth' })
                    }
                    // Dispatch custom event with brand data
                    window.dispatchEvent(new CustomEvent('brandSelected', { 
                      detail: { 
                        brandName: brand.name,
                        brandSlug: brand.slug,
                        brandData: brand
                      } 
                    }))
                  }}
                  className="absolute inset-0 z-10 cursor-pointer"
                />

                <div className="relative w-full h-full">
                  {imageUrl && (
                    <Image
                      src={imageUrl}
                      alt={brand?.coverImage?.alt || brand.name}
                      fill
                      className="object-cover transition-transform duration-300 "
                      sizes={IMAGE_SIZES.card}
                    />
                  )}
                  <div className="absolute inset-0 bg-amber-900/30" />
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-900/60 via-transparent to-transparent" />
                </div>

                <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6">
                  <div className="text-left">
                    {brand.primaryLogo?.asset?._ref ? (
                      <div className="mb-2 w-full h-auto flex justify-start">
                        <div className="max-w-full">
                          <Image
                            src={urlForImage(brand.primaryLogo)?.width(600).height(300).fit('max').auto('format').url() || ''}
                            alt={brand.primaryLogo.alt || `${brand.name} logo`}
                            width={600}
                            height={300}
                            sizes={IMAGE_SIZES.logo}
                            className="w-auto h-auto max-w-full max-h-[80px] object-contain z-10"
                          />
                        </div>
                      </div>
                    ) : (
                      <h4 className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 ${isAnthem ? 'text-red-600' : 'text-amber-50'}`}>
                        {brand.name}
                      </h4>
                    )}
                    <div className={`w-full h-0.5 mt-2 ${brand.primaryColor ? `bg-[#${brand.primaryColor}]` : 'bg-orange-600/60'}`}></div>
                  </div>
                </div>

                <div className="absolute inset-0 bg-amber-900/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4 z-1">
                  <p className="flex flex-col font-extrabold text-amber-50 text-lg sm:text-xl text-center leading-tight">
                    <span className="">VIEW VEHICLES</span>
                    <span className="">FOR THIS BRAND</span>
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
