'use client'

import Image from 'next/image'

interface Vehicle {
  _id: string
  title: string
}

interface VehicleOffRoadSectionProps {
  vehicle: Vehicle
}

export default function VehicleOffRoadSection({ vehicle }: VehicleOffRoadSectionProps) {
  const offRoadImages = [
    {
      src: "https://images.unsplash.com/photo-1760161232562-7365953964a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cnVjayUyMG11ZCUyMHRlcnJhaW58ZW58MXx8fHwxNzYxMjMwMTM4fDA&ixlib=rb-4.1.0&q=80&w=1080",
      alt: "Mud Terrain Mastery",
      title: "Mud Terrain Mastery"
    },
    {
      src: "https://images.unsplash.com/photo-1637071361660-60bc9fc81f53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMHRlcnJhaW4lMjBvZmZyb2FkfGVufDF8fHx8MTc2MTIzMDAwMXww&ixlib=rb-4.1.0&q=80&w=1080",
      alt: "Mountain Trail",
      title: "Mountain Trail"
    },
    {
      src: "https://images.unsplash.com/photo-1650504799838-b7fb9d77804f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaWZ0ZWQlMjB0cnVjayUyMHdoZWVscyUyMGRldGFpbHxlbnwxfHx8fDE3NjEyMzAxNDB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      alt: "Lifted Suspension",
      title: "Lifted Suspension"
    },
    {
      src: "https://images.unsplash.com/photo-1633521248898-19cbbf9ead88?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaWNrdXAlMjB0cnVjayUyMHN1bnNldCUyMGRyYW1hdGljfGVufDF8fHx8MTc2MTA1MTk4MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      alt: "Rock Crawling",
      title: "Rock Crawling"
    },
    {
      src: "https://images.unsplash.com/photo-1661463675740-d9d436e790f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cnVjayUyMGludGVyaW9yJTIwbGVhdGhlciUyMGx1eHVyeXxlbnwxfHx8fDE3NjEwNTE5ODJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      alt: "Extreme Conditions",
      title: "Extreme Conditions"
    },
    {
      src: "https://images.unsplash.com/photo-1650504799838-b7fb9d77804f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydCUyMHBpY2t1cCUyMHRydWNrJTIwd2hlZWwlMjBkZXRhaWwlMjBjbG9zZXxlbnwxfHx8fDE3NjEwNTE5ODF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      alt: "Winter Terrain",
      title: "Winter Terrain"
    },
    {
      src: "https://images.unsplash.com/photo-1660604577481-c4d847d35b24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydCUyMHBpY2t1cCUyMHRydWNrJTIwYmxhY2t8ZW58MXx8fHwxNzYwOTk0NDkzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      alt: "Trail Conqueror",
      title: "Trail Conqueror"
    }
  ]

  return (
    <div className="border-4 border-neutral-800 hover:border-orange-600 transition-all overflow-hidden bg-neutral-950">
      <div className="cursor-pointer group">
        <div className="relative">
          <div className="aspect-[21/6] overflow-hidden bg-neutral-900">
            <Image
              src="https://images.unsplash.com/photo-1760161232562-7365953964a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cnVjayUyMG11ZCUyMHRlcnJhaW58ZW58MXx8fHwxNzYxMjMwMTM4fDA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="OFF-ROAD"
              width={1920}
              height={549}
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
          </div>
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl w-full mx-auto px-12 flex items-center justify-between">
              <div className="flex items-center gap-8">
                <div className="w-24 h-24 flex items-center justify-center border-4 border-white bg-[#7d5a3f]">
                  <div className="text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mountain w-12 h-12" aria-hidden="true">
                      <path d="m8 3 4 8 5-5 5 15H2L8 3z"></path>
                    </svg>
                  </div>
                </div>
                <div>
                  <div className="text-xs tracking-[0.4em] mb-2 text-[#7d5a3f]">OFF-ROAD</div>
                  <h3 className="text-white mb-2 tracking-wide text-4xl">Conquer Any Terrain</h3>
                  <p className="text-neutral-400 text-lg max-w-2xl">Built to dominate the toughest conditions nature throws at you</p>
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
      
      {/* Off-Road Gallery Grid */}
      <div className="overflow-hidden">
        <div className="p-8 bg-neutral-950 border-t-4 border-neutral-800">
          <div className="grid grid-cols-4 gap-6">
            {offRoadImages.map((image, index) => (
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
                      <div className="w-10 h-10 mx-auto mb-3 flex items-center justify-center bg-[#7d5a3f]">
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
