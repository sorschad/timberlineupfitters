import type {Metadata} from 'next'
import Link from 'next/link'
import Image from 'next/image'
import {notFound} from 'next/navigation'
import {useState} from 'react'

import {sanityFetch} from '@/sanity/lib/live'
import {client} from '@/sanity/lib/client'
import {vehicleQuery, vehicleSlugs} from '@/sanity/lib/queries'
import Breadcrumb from '@/app/components/Breadcrumb'
import SpecsTable from '@/app/components/SpecsTable'

interface Vehicle {
  _id: string
  title: string
  slug: { current: string }
  model: string
  vehicleType: string
  modelYear: number
  trim?: string
  manufacturer: {
    _id: string
    name: string
    logo?: any
  }
  coverImage?: any
  gallery?: any[]
  videoTour?: any
  specifications?: any
  features?: any
  customizationOptions?: any[]
  inventory?: any
  description?: any[]
  tags?: string[]
  seo?: any
}

interface VehiclePageProps {
  params: {
    slug: string
  }
}

/**
 * Generate metadata for the page.
 */
export async function generateMetadata({params}: VehiclePageProps): Promise<Metadata> {
  const vehicle = await client.fetch(vehicleQuery, {slug: params.slug}) as Vehicle | null
  
  if (!vehicle) {
    return {
      title: 'Vehicle Not Found',
    }
  }

  return {
    title: vehicle.seo?.metaTitle || vehicle.title,
    description: vehicle.seo?.metaDescription || `Explore the ${vehicle.title} - ${vehicle.manufacturer.name} ${vehicle.model} ${vehicle.modelYear}. Find specifications, features, and customization options.`,
  }
}

/**
 * Generate static params for all vehicle slugs.
 */
export async function generateStaticParams() {
  const slugs = await client.fetch(vehicleSlugs)
  return slugs.map((slug: any) => ({
    slug: slug.slug,
  }))
}

export default async function VehiclePage({params}: VehiclePageProps) {
  const vehicle = await client.fetch(vehicleQuery, {slug: params.slug}) as Vehicle | null

  if (!vehicle) {
    notFound()
  }

  const lowerTitle = `${vehicle.title || ''} ${vehicle.model || ''} ${(vehicle.tags || []).join(' ')}`.toLowerCase()
  const isWranglerAlpineOcean = (
    (vehicle.manufacturer?.name || '').toLowerCase().includes('jeep') &&
    (vehicle.model || '').toLowerCase().includes('wrangler') &&
    lowerTitle.includes('ocean')
  )

  // Gallery component for Wrangler Alpine Ocean
  const WranglerGallery = () => {
    const [activeImage, setActiveImage] = useState(0)
    const galleryImages = [
      { id: 0, src: '/images/gallery/jeep-ocean-1.jpg', alt: 'Jeep Wrangler Alpine Ocean - Exterior View' },
      { id: 1, src: '/images/gallery/jeep-ocean-2.jpg', alt: 'Jeep Wrangler Alpine Ocean - Interior' },
      { id: 2, src: '/images/gallery/jeep-ocean-3.jpg', alt: 'Jeep Wrangler Alpine Ocean - Dashboard' },
      { id: 3, src: '/images/gallery/jeep-ocean-4.jpg', alt: 'Jeep Wrangler Alpine Ocean - Wheels' },
      { id: 4, src: '/images/gallery/jeep-ocean-5.jpg', alt: 'Jeep Wrangler Alpine Ocean - Side View' },
      { id: 5, src: '/images/gallery/jeep-ocean-6.jpg', alt: 'Jeep Wrangler Alpine Ocean - Adventure' }
    ]

    return (
      <section className="py-16 md:py-24 bg-[#ff8c42]/40">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Image */}
            <div className="lg:col-span-2">
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-gradient-to-br from-[#13232b] to-[#0b1419] group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-sm opacity-80">Image {activeImage + 1} of {galleryImages.length}</p>
                </div>
              </div>
            </div>
            
            {/* Thumbnail Grid */}
            <div className="space-y-3">
              {galleryImages.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setActiveImage(index)}
                  className={`w-full relative aspect-[16/10] rounded-xl overflow-hidden transition-all duration-300 ${
                    activeImage === index 
                      ? 'ring-2 ring-white/50 scale-105' 
                      : 'hover:scale-105 hover:ring-1 hover:ring-white/30'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#13232b] to-[#0b1419]" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white/60 text-sm font-medium">Image {index + 1}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      {isWranglerAlpineOcean ? (
        <>
        <section
          className="relative text-white overflow-hidden"
          style={{
            backgroundImage: vehicle.coverImage && vehicle.coverImage.asset && vehicle.coverImage.asset.url ? `url(${vehicle.coverImage.asset.url})` : 'linear-gradient(to bottom right, #1f2937, #111827, #000000)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-[#061421]/90" />
          <div className="relative z-10 container pt-36 pb-32 min-h-[90vh] md:min-h-[100vh] flex items-end">
            <div className="max-w-3xl">
              <p className="uppercase tracking-[0.18em] text-white/80 text-sm mb-2">{vehicle.modelYear} {vehicle.model}</p>
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-black leading-[1.05] drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
                {vehicle.title}
              </h1>
              <p className="mt-4 text-white/80 text-lg max-w-xl">
                Built for life. Feels like comfort. Ocean-inspired Alpine edition Wrangler with premium materials and long-range adventures in mind.
              </p>
              <div className="mt-8">
                <button className="inline-flex items-center bg-brand hover:bg-brand/90 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300">
                  Explore
                </button>
              </div>
            </div>

            {/* Stat badges */}
            <div className="mt-10 grid grid-cols-2 md:grid-cols-5 gap-3 max-w-5xl">
              <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-4 text-center">
                <div className="text-white/80 text-sm">Model</div>
                <div className="text-2xl font-bold">{vehicle.model || 'Wrangler'}</div>
              </div>
              <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-4 text-center">
                <div className="text-white/80 text-sm">Type</div>
                <div className="text-2xl font-bold capitalize">{vehicle.vehicleType || 'SUV'}</div>
              </div>
              <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-4 text-center">
                <div className="text-white/80 text-sm">Year</div>
                <div className="text-2xl font-bold">{vehicle.modelYear}</div>
              </div>
              <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-4 text-center">
                <div className="text-white/80 text-sm">Trim</div>
                <div className="text-2xl font-bold">{vehicle.trim || 'Base'}</div>
              </div>
              <div className="hidden md:block backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-4 text-center">
                <div className="text-white/80 text-sm">Brand</div>
                <div className="text-2xl font-bold">Alpine</div>
              </div>
            </div>
          </div>
        </section>
        {/* Orange fade divider */}
        <div className="h-12 bg-gradient-to-b from-transparent via-[#ff8c42]/20 to-[#ff8c42]/40" />

        <WranglerGallery />
        </>
      ) : (
        <section 
          className="relative py-40 text-white overflow-hidden"
          style={{
            backgroundImage: vehicle.coverImage && vehicle.coverImage.asset && vehicle.coverImage.asset.url ? `url(${vehicle.coverImage.asset.url})` : 'linear-gradient(to bottom right, #1f2937, #111827, #000000)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* Background Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/70" />
          
          <div className="relative z-10 container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Vehicle Info */}
              <div>
                <div className="flex items-center gap-4 mb-6">
                  {vehicle.manufacturer.logo && vehicle.manufacturer.logo.asset && vehicle.manufacturer.logo.asset.url && (
                    <Image
                      src={vehicle.manufacturer.logo.asset.url}
                      alt={`${vehicle.manufacturer.name} Logo`}
                      width={80}
                      height={80}
                      className="object-contain"
                    />
                  )}
                  <div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-2">
                      {vehicle.title}
                    </h1>
                    <p className="text-xl text-gray-300">
                      {vehicle.manufacturer.name} • {vehicle.modelYear}
                    </p>
                  </div>
                </div>
                
                {/* Key Stats */}
                <div className="grid grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-1">
                      {vehicle.modelYear}
                    </div>
                    <div className="text-sm text-gray-300">Model Year</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-1 capitalize">
                      {vehicle.vehicleType}
                    </div>
                    <div className="text-sm text-gray-300">Vehicle Type</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-1">
                      {vehicle.trim || 'Base'}
                    </div>
                    <div className="text-sm text-gray-300">Trim Level</div>
                  </div>
                </div>
                
                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="bg-brand hover:bg-brand/90 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
                    Get Quote
                  </button>
                  <button className="bg-white/20 hover:bg-white/30 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 border border-white/30">
                    Learn More
                  </button>
                </div>
              </div>
              
              {/* Vehicle Image */}
              <div className="relative">
                {vehicle.coverImage && vehicle.coverImage.asset && vehicle.coverImage.asset.url ? (
                  <Image
                    src={vehicle.coverImage.asset.url}
                    alt={vehicle.title}
                    width={600}
                    height={400}
                    className="rounded-2xl shadow-2xl"
                  />
                ) : (
                  <div className="bg-gray-800 rounded-2xl h-96 flex items-center justify-center">
                    <span className="text-6xl font-bold text-gray-400">
                      {vehicle.manufacturer.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Breadcrumb Navigation */}
      <Breadcrumb 
        items={[
          { label: 'Home', href: '/' },
          { label: 'Vehicles', href: '/vehicles' },
          { label: vehicle.title, href: `/vehicles/${vehicle.slug.current}` }
        ]} 
      />

      {/* Specifications Section */}
      {vehicle.specifications && (
        <section className="py-20 bg-white">
          <div className="container">
            <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
              Technical Specifications
            </h2>
            {vehicle.specifications && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(vehicle.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0">
                      <span className="text-gray-600 font-medium capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="text-gray-900 font-semibold">
                        {typeof value === 'number' ? value.toLocaleString() : String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Features Section */}
      {vehicle.features && (
        <section className="py-20 bg-gray-50">
          <div className="container">
            <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
              Features & Amenities
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Object.entries(vehicle.features).map(([category, features]: [string, any]) => (
                <div key={category} className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 capitalize">
                    {category.replace(/([A-Z])/g, ' $1').trim()}
                  </h3>
                  <ul className="space-y-2">
                    {features.map((feature: string, idx: number) => (
                      <li key={idx} className="flex items-center text-gray-600">
                        <div className="w-2 h-2 bg-brand rounded-full mr-3" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery Section */}
      {vehicle.gallery && vehicle.gallery.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container">
            <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
              Image Gallery
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicle.gallery.map((image: any, idx: number) => (
                <div key={idx} className="relative aspect-video rounded-2xl overflow-hidden shadow-lg">
                  {image.asset && image.asset.url ? (
                    <Image
                      src={image.asset.url}
                      alt={image.alt || `${vehicle.title} Gallery Image ${idx + 1}`}
                      fill
                      className="object-cover hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">No Image</span>
                    </div>
                  )}
                  {image.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4">
                      <p className="text-sm">{image.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Customization Options */}
      {vehicle.customizationOptions && vehicle.customizationOptions.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="container">
            <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
              Customization Options
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {vehicle.customizationOptions.map((category: any, idx: number) => (
                <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {category.category}
                  </h3>
                  <div className="space-y-4">
                    {category.options.map((option: any, optionIdx: number) => (
                      <div key={optionIdx} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-gray-900">{option.name}</h4>
                          {option.price && (
                            <span className="text-brand font-bold">${option.price.toLocaleString()}</span>
                          )}
                        </div>
                        {option.description && (
                          <p className="text-gray-600 text-sm">{option.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Inventory Information */}
      {vehicle.inventory && (
        <section className="py-20 bg-white">
          <div className="container">
            <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
              Availability & Information
            </h2>
            <div className="bg-gray-50 rounded-2xl p-8 max-w-2xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6">
                {vehicle.inventory.stockNumber && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Stock Number</h3>
                    <p className="text-gray-600">{vehicle.inventory.stockNumber}</p>
                  </div>
                )}
                {vehicle.inventory.availability && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Availability</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      vehicle.inventory.availability === 'In Stock' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {vehicle.inventory.availability}
                    </span>
                  </div>
                )}
                {vehicle.inventory.location && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Location</h3>
                    <p className="text-gray-600">{vehicle.inventory.location}</p>
                  </div>
                )}
                {vehicle.inventory.mileage && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Mileage</h3>
                    <p className="text-gray-600">{vehicle.inventory.mileage.toLocaleString()} miles</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Make This Vehicle Yours?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Contact our team to get a quote or discuss customization options.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-brand hover:bg-brand/90 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Contact Us
            </Link>
            <Link
              href="/custom-build"
              className="bg-white hover:bg-gray-50 text-gray-900 px-8 py-4 rounded-full font-semibold transition-all duration-300 border border-gray-200"
            >
              Custom Build
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
