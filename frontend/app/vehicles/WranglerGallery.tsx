"use client"

import {useState} from 'react'
import Image from 'next/image'

export default function WranglerGallery() {
  const [activeImage, setActiveImage] = useState(0)
  // Use existing public images to avoid 404s until real assets are provided
  const fallbackA = '/images/tile-1-black.png'
  const fallbackB = '/images/tile-grid-black.png'
  const galleryImages = [
    { id: 0, src: fallbackA, alt: 'Wrangler Alpine Ocean - Hero' },
    { id: 1, src: fallbackB, alt: 'Wrangler Alpine Ocean - Interior' },
    { id: 2, src: fallbackA, alt: 'Wrangler Alpine Ocean - Dashboard' },
    { id: 3, src: fallbackB, alt: 'Wrangler Alpine Ocean - Wheels' },
    { id: 4, src: fallbackA, alt: 'Wrangler Alpine Ocean - Side View' },
    { id: 5, src: fallbackB, alt: 'Wrangler Alpine Ocean - Adventure' },
    { id: 6, src: fallbackA, alt: 'Wrangler Alpine Ocean - Overland Setup' },
    { id: 7, src: fallbackB, alt: 'Wrangler Alpine Ocean - Detail Stitching' },
    { id: 8, src: fallbackA, alt: 'Wrangler Alpine Ocean - Rear Cargo' },
    { id: 9, src: fallbackB, alt: 'Wrangler Alpine Ocean - Night Shot' }
  ]

  const current = galleryImages[activeImage]

  return (
    <section>
      <div className="container max-w-8xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {/* Main Image */}
          <div className="lg:col-span-2">
            <div className="relative aspect-[4/3] lg:aspect-auto lg:h-[520px] rounded-2xl overflow-hidden bg-gradient-to-br from-[#13232b] to-[#0b1419] border-2 border-white/20 shadow-2xl">
              <Image 
                src={current.src} 
                alt={current.alt} 
                fill 
                className="object-cover transition-transform duration-500 hover:scale-105" 
                sizes="(max-width: 1024px) 100vw, 66vw" 
                priority 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <p className="text-base font-medium opacity-90 drop-shadow-lg">{current.alt}</p>
              </div>
            </div>
          </div>

          {/* Right column thumbnails - stretch to match main image height on lg */}
          <div className="grid grid-cols-2 lg:grid-cols-1 lg:grid-rows-2 gap-3 lg:h-[520px]">
            {galleryImages.slice(0, 4).map((image, index) => (
              <button
                key={image.id}
                onClick={() => setActiveImage(index)}
                className={`relative w-full aspect-square lg:aspect-auto lg:h-full rounded-xl overflow-hidden transition-all duration-300 shadow-lg ${
                  activeImage === index 
                    ? 'ring-3 ring-white/70 scale-[1.05] shadow-2xl' 
                    : 'hover:scale-[1.05] hover:ring-2 hover:ring-white/40 hover:shadow-xl'
                }`}
                onMouseEnter={() => setActiveImage(index)}
                aria-label={`Show ${image.alt}`}
              >
                <Image 
                  src={image.src} 
                  alt={image.alt} 
                  fill 
                  className="object-cover transition-transform duration-300" 
                  sizes="(max-width: 1024px) 50vw, (min-width: 1024px) 33vw" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent" />
                {activeImage === index && (
                  <div className="absolute inset-0 bg-white/10" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom six thumbnails (equal squares under main + right column) */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {galleryImages.slice(4, 10).map((image, idx) => {
            const index = idx + 4
            return (
              <button
                key={image.id}
                onClick={() => setActiveImage(index)}
                className={`relative w-full aspect-square rounded-xl overflow-hidden transition-all duration-300 shadow-lg ${
                  activeImage === index 
                    ? 'ring-3 ring-white/70 scale-[1.05] shadow-2xl' 
                    : 'hover:scale-[1.05] hover:ring-2 hover:ring-white/40 hover:shadow-xl'
                }`}
                onMouseEnter={() => setActiveImage(index)}
                aria-label={`Show ${image.alt}`}
              >
                <Image 
                  src={image.src} 
                  alt={image.alt} 
                  fill 
                  className="object-cover transition-transform duration-300" 
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent" />
                {activeImage === index && (
                  <div className="absolute inset-0 bg-white/10" />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}


