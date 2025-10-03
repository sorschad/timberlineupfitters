'use client'

type GalleryImage = {
  url: string
  alt?: string
}

type HeritageVerticalGalleryProps = {
  images: GalleryImage[]
}

export default function HeritageVerticalGallery({images}: HeritageVerticalGalleryProps) {
  if (!images || images.length === 0) return null

  return (
    <section className="relative">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative max-h-[82vh] overflow-y-auto py-8 pr-2 sm:pr-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          <ul className="relative space-y-10 sm:space-y-14 lg:space-y-20">
            {images.map((img, idx) => (
              <li key={`${img.url}-${idx}`} className="relative">
                {/* soft ambient shadow behind each card */}
                <div className="pointer-events-none absolute -inset-6 rounded-2xl bg-black/10 blur-2xl opacity-40" />

                {/* photo card */}
                <figure
                  className={[
                    'relative mx-auto w-[88%] sm:w-[82%] md:w-[78%] lg:w-[70%] rounded-md bg-white shadow-[0_30px_70px_-30px_rgba(0,0,0,0.45)]',
                    // offset horizontally to create layered effect
                    idx % 3 === 0 ? 'translate-x-[-6%]' : idx % 3 === 1 ? 'translate-x-[6%]' : 'translate-x-0',
                  ].join(' ')}
                >
                  <div
                    className="aspect-[16/10] w-full bg-cover bg-center"
                    style={{backgroundImage: `url(${img.url})`}}
                    role="img"
                    aria-label={img.alt || 'gallery image'}
                  />
                  {/* white frame */}
                  <div className="pointer-events-none absolute inset-0 rounded-md ring-8 ring-white" />
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}


