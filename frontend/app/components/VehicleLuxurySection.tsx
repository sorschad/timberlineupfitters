'use client'

import Image from 'next/image'

interface Vehicle {
  _id: string
  title: string
}

interface VehicleLuxurySectionProps {
  vehicle: Vehicle
}

export default function VehicleLuxurySection({ vehicle }: VehicleLuxurySectionProps) {
  const luxuryImages = [
    {
      src: "https://images.unsplash.com/photo-1661463675740-d9d436e790f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB0cnVjayUyMGludGVyaW9yJTIwbGVhdGhlcnxlbnwxfHx8fDE3NjEyMzAxMzl8MA&ixlib=rb-4.1.0&q=80&w=1080",
      alt: "Premium Interior",
      title: "Premium Interior"
    },
    {
      src: "https://images.unsplash.com/photo-1599912027667-755b68b4dd3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYXIlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjExNjY3NTV8MA&ixlib=rb-4.1.0&q=80&w=1080",
      alt: "Leather Details",
      title: "Leather Details"
    },
    {
      src: "https://images.unsplash.com/photo-1606458615392-ab94613791b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGVlZCUyMGdhdWdlJTIwZGFzaGJvYXJkfGVufDF8fHx8MTc2MTIzMDAwMXww&ixlib=rb-4.1.0&q=80&w=1080",
      alt: "Tech Integration",
      title: "Tech Integration"
    },
    {
      src: "https://images.unsplash.com/photo-1660604577481-c4d847d35b24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydCUyMHBpY2t1cCUyMHRydWNrJTIwYmxhY2t8ZW58MXx8fHwxNzYwOTk0NDkzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      alt: "Ambient Lighting",
      title: "Ambient Lighting"
    },
    {
      src: "https://images.unsplash.com/photo-1669035512837-6d2c9c086b74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cnVjayUyMGZyb250JTIwZ3JpbGxlJTIwY2xvc2UlMjB1cHxlbnwxfHx8fDE3NjA5OTQ4NTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      alt: "Executive Seating",
      title: "Executive Seating"
    },
    {
      src: "https://images.unsplash.com/photo-1643764818995-25565b3636f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cnVjayUyMGFjdGlvbiUyMGRlc2VydCUyMHRlcnJhaW58ZW58MXx8fHwxNzYxMDUxOTc5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      alt: "Premium Finishes",
      title: "Premium Finishes"
    },
    {
      src: "https://images.unsplash.com/photo-1660604577481-c4d847d35b24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydCUyMHBpY2t1cCUyMHRydWNrJTIwYmxhY2t8ZW58MXx8fHwxNzYwOTk0NDkzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      alt: "Luxury Meets Capability",
      title: "Luxury Meets Capability"
    }
  ]

  return (
    <div className="border-4 border-neutral-800 hover:border-orange-600 transition-all overflow-hidden bg-neutral-950">
      <div className="cursor-pointer group">
        <div className="relative">
          <div className="aspect-[21/6] overflow-hidden bg-neutral-900">
            <Image
              src="https://images.unsplash.com/photo-1661463675740-d9d436e790f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB0cnVjayUyMGludGVyaW9yJTIwbGVhdGhlcnxlbnwxfHx8fDE3NjEyMzAxMzl8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="LUXURY"
              width={1920}
              height={549}
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
          </div>
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl w-full mx-auto px-12 flex items-center justify-between">
              <div className="flex items-center gap-8">
                <div className="w-24 h-24 flex items-center justify-center border-4 border-white bg-[#6b4c7c]">
                  <div className="text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles w-12 h-12" aria-hidden="true">
                      <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"></path>
                      <path d="M20 2v4"></path>
                      <path d="M22 4h-4"></path>
                      <circle cx="4" cy="20" r="2"></circle>
                    </svg>
                  </div>
                </div>
                <div>
                  <div className="text-xs tracking-[0.4em] mb-2 text-[#6b4c7c]">LUXURY</div>
                  <h3 className="text-white mb-2 tracking-wide text-4xl">Premium Craftsmanship</h3>
                  <p className="text-neutral-400 text-lg max-w-2xl">Refined details and superior comfort meet rugged capability</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-white text-sm tracking-widest">EXPLORE</span>
                <div className="w-12 h-12 bg-orange-600 border-4 border-white flex items-center justify-center group-hover:bg-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right w-6 h-6 text-white group-hover:text-orange-600 -rotate-90" aria-hidden="true">
                    <path d="m9 18 6-6-6-6"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Luxury Gallery Grid */}
      <div className="overflow-hidden">
        <div className="p-8 bg-neutral-950 border-t-4 border-neutral-800">
          <div className="grid grid-cols-4 gap-6">
            {luxuryImages.map((image, index) => (
              <div key={index} className="group/img cursor-pointer">
                <div className="relative border-4 border-neutral-800 overflow-hidden group-hover/img:border-orange-600 transition-all">
                  <div className="aspect-[4/3] overflow-hidden bg-neutral-900">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={400}
                      height={300}
                      className="w-full h-full object-cover grayscale group-hover/img:grayscale-0 group-hover/img:scale-110 transition-all duration-500"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-4 opacity-0 group-hover/img:opacity-100 transition-opacity">
                    <div className="text-center">
                      <div className="w-10 h-10 mx-auto mb-3 flex items-center justify-center bg-[#6b4c7c]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right w-5 h-5 text-white" aria-hidden="true">
                          <path d="M5 12h14"></path>
                          <path d="m12 5 7 7-7 7"></path>
                        </svg>
                      </div>
                      <p className="text-white tracking-wide text-sm">{image.title}</p>
                    </div>
                  </div>
                  <div className="absolute top-3 right-3 w-8 h-8 bg-black/80 border-2 border-white/20 flex items-center justify-center">
                    <span className="text-white text-xs">{index + 1}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
