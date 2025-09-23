'use client'

import { useState } from 'react'
import Image from 'next/image'

interface Manufacturer {
  _id: string
  name: string
  vehicles?: any[]
}

interface GallerySectionProps {
  manufacturer: Manufacturer
}

interface GalleryImage {
  id: string
  src: string
  alt: string
  caption: string
  category: string
}

// Mock gallery data - in a real app, this would come from your CMS
const getGalleryImages = (manufacturerName: string): GalleryImage[] => {
  const baseImages = [
    {
      id: '1',
      src: '/images/gallery/action-shot-1.jpg',
      alt: `${manufacturerName} vehicle in action`,
      caption: 'Conquering mountain trails with confidence',
      category: 'adventure'
    },
    {
      id: '2',
      src: '/images/gallery/worksite-1.jpg',
      alt: `${manufacturerName} at worksite`,
      caption: 'Built for the toughest jobs',
      category: 'work'
    },
    {
      id: '3',
      src: '/images/gallery/camping-1.jpg',
      alt: `${manufacturerName} camping setup`,
      caption: 'Your adventure basecamp',
      category: 'lifestyle'
    },
    {
      id: '4',
      src: '/images/gallery/desert-1.jpg',
      alt: `${manufacturerName} in desert terrain`,
      caption: 'Mastering any terrain',
      category: 'adventure'
    },
    {
      id: '5',
      src: '/images/gallery/forest-1.jpg',
      alt: `${manufacturerName} in forest`,
      caption: 'Built for the wild',
      category: 'lifestyle'
    },
    {
      id: '6',
      src: '/images/gallery/construction-1.jpg',
      alt: `${manufacturerName} on construction site`,
      caption: 'Professional grade performance',
      category: 'work'
    }
  ]

  return baseImages.map(img => ({
    ...img,
    src: img.src.replace('manufacturer', manufacturerName.toLowerCase())
  }))
}

export default function GallerySection({ manufacturer }: GallerySectionProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  
  const images = getGalleryImages(manufacturer.name)
  const categories = ['all', ...new Set(images.map(img => img.category))]
  
  const filteredImages = selectedCategory === 'all' 
    ? images 
    : images.filter(img => img.category === selectedCategory)

  return (
    <section className="py-20 bg-white">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {manufacturer.name} In The Wild
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how {manufacturer.name} vehicles perform in real-world scenarios. 
            From rugged worksites to epic adventures, our vehicles are built to exceed expectations.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 capitalize ${
                selectedCategory === category
                  ? 'bg-brand text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Masonry Gallery */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredImages.map((image, index) => (
            <div
              key={image.id}
              className="break-inside-avoid group cursor-pointer"
              onClick={() => setSelectedImage(image)}
            >
              <div className="relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-105">
                <div className="aspect-[4/3] relative">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />
                  
                  {/* Overlay Content */}
                  <div className="absolute inset-0 flex items-end p-6 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="text-white">
                      <h3 className="text-lg font-semibold mb-2">
                        {image.caption}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="bg-brand px-3 py-1 rounded-full text-sm font-medium">
                          {image.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <p className="text-lg text-gray-600 mb-8">
            Have photos of your {manufacturer.name} in action? Share them with us!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-brand hover:bg-brand/90 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
              Share Your Photos
            </button>
            <button className="bg-white hover:bg-gray-50 text-gray-900 px-8 py-4 rounded-full font-semibold transition-all duration-300 border border-gray-200">
              View Full Gallery
            </button>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aspect-video relative">
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {selectedImage.caption}
              </h3>
              <div className="flex items-center gap-2">
                <span className="bg-brand text-white px-3 py-1 rounded-full text-sm font-medium">
                  {selectedImage.category}
                </span>
              </div>
            </div>
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-900 w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl transition-all duration-300"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
