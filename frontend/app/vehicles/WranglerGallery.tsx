"use client"

import {useState} from 'react'

export default function WranglerGallery() {
  const [activeImage, setActiveImage] = useState(0)
  const galleryImages = [
    { id: 0, src: '/images/gallery/jeep-ocean-1.jpg', alt: 'Jeep Wrangler Alpine Ocean - Exterior View' },
    { id: 1, src: '/images/gallery/jeep-ocean-2.jpg', alt: 'Jeep Wrangler Alpine Ocean - Interior' },
    { id: 2, src: '/images/gallery/jeep-ocean-3.jpg', alt: 'Jeep Wrangler Alpine Ocean - Dashboard' },
    { id: 3, src: '/images/gallery/jeep-ocean-4.jpg', alt: 'Jeep Wrangler Alpine Ocean - Wheels' },
    { id: 4, src: '/images/gallery/jeep-ocean-5.jpg', alt: 'Jeep Wrangler Alpine Ocean - Side View' },
    { id: 5, src: '/images/gallery/jeep-ocean-6.jpg', alt: 'Jeep Wrangler Alpine Ocean - Adventure' }
  ]

  const current = galleryImages[activeImage]

  return (
    <section className="py-16 md:py-24 bg-[#ff8c42]/40">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Image */}
          <div className="lg:col-span-2">
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-gradient-to-br from-[#13232b] to-[#0b1419]">
              {/* Placeholder main image box; replace with next/image if real URLs exist */}
              <div className="absolute inset-0 bg-center bg-cover" style={{backgroundImage: `url(${current.src})`}} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <p className="text-sm opacity-80">{current.alt}</p>
              </div>
            </div>
          </div>

          {/* Thumbnail Masonry (right) */}
          <div className="grid grid-cols-2 gap-3 auto-rows-[7rem] sm:auto-rows-[8rem]">
            {galleryImages.map((image, index) => {
              const isTall = index % 3 === 0 // every 3rd image taller for masonry feel
              return (
                <button
                  key={image.id}
                  onClick={() => setActiveImage(index)}
                  className={`relative w-full rounded-xl overflow-hidden transition-all duration-300 ${
                    isTall ? 'row-span-2' : 'row-span-1'
                  } ${
                    activeImage === index 
                      ? 'ring-2 ring-white/50 scale-[1.02]' 
                      : 'hover:scale-[1.02] hover:ring-1 hover:ring-white/30'
                  }`}
                  onMouseEnter={() => setActiveImage(index)}
                  aria-label={`Show ${image.alt}`}
                >
                  <div className="absolute inset-0 bg-center bg-cover" style={{backgroundImage: `url(${image.src})`}} />
                  <div className="absolute inset-0 bg-black/15" />
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}


