'use client'

import Image from 'next/image'

interface Vehicle {
  _id: string
  title: string
}

interface VehiclePerformanceSectionProps {
  vehicle: Vehicle
}

export default function VehiclePerformanceSection({ vehicle }: VehiclePerformanceSectionProps) {
  const performanceImages = [
    {
      src: "https://images.unsplash.com/photo-1594279905698-830467b8ea5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb29mJTIwcmFjayUyMHRydWNrJTIwYWNjZXNzb3JpZXN8ZW58MXx8fHwxNzYxMDUxOTgyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      alt: "Full Throttle Action",
      title: "Full Throttle Action"
    },
    {
      src: "https://images.unsplash.com/photo-1731531702939-0b0a9733501e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cnVjayUyMGRhc2hib2FyZCUyMG5pZ2h0fGVufDF8fHx8MTc2MTIzMDE0MHww&ixlib=rb-4.1.0&q=80&w=1080",
      alt: "Performance Dashboard",
      title: "Performance Dashboard"
    },
    {
      src: "https://images.unsplash.com/photo-1756239508260-700feaf2993f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cnVjayUyMGVuZ2luZSUyMGJheXxlbnwxfHx8fDE3NjEyMzAxNDB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      alt: "Engine Bay Details",
      title: "Engine Bay Details"
    },
    {
      src: "https://images.unsplash.com/photo-1643764818995-25565b3636f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cnVjayUyMGFjdGlvbiUyMGRlc2VydCUyMHRlcnJhaW58ZW58MXx8fHwxNzYxMDUxOTc5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      alt: "Speed & Precision",
      title: "Speed & Precision"
    },
    {
      src: "https://images.unsplash.com/photo-1760161232562-7365953964a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cnVjayUyMG11ZCUyMHRlcnJhaW58ZW58MXx8fHwxNzYxMjMwMTM4fDA&ixlib=rb-4.1.0&q=80&w=1080",
      alt: "High-Speed Run",
      title: "High-Speed Run"
    },
    {
      src: "https://images.unsplash.com/photo-1747138164851-3a6848a0b01f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cnVjayUyMG1vdW50YWluJTIwcm9hZCUyMHNjZW5pY3xlbnwxfHx8fDE3NjEwNTE5ODN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      alt: "Track Ready",
      title: "Track Ready"
    },
    {
      src: "https://images.unsplash.com/photo-1643764818995-25565b3636f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cnVjayUyMGFjdGlvbiUyMGRlc2VydCUyMHRlcnJhaW58ZW58MXx8fHwxNzYxMDUxOTc5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      alt: "Power Showcase",
      title: "Power Showcase"
    }
  ]

  return (
    <div className="bg-black py-20 border-t-4 border-orange-600">
      <div className="max-w-7xl mx-auto px-8 sm:px-0">
        <div className="mb-16">
          <div className="text-orange-600 tracking-[0.4em] text-xs mb-4">BUILDS GALLERY</div>
          {/* <h2 className="text-white tracking-wider text-6xl">BUILDS</h2> */}
        </div>
        
        <div className="space-y-8">
          {/* Performance Section */}
          <div className="border-4 border-neutral-800 hover:border-orange-600 transition-all overflow-hidden bg-neutral-950">
            <div className="cursor-pointer group">
              <div className="relative">
                <div className="aspect-[21/6] overflow-hidden bg-neutral-900">
                  <Image
                    src="https://images.unsplash.com/photo-1594279905698-830467b8ea5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb29mJTIwcmFjayUyMHRydWNrJTIwYWNjZXNzb3JpZXN8ZW58MXx8fHwxNzYxMDUxOTgyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="PERFORMANCE"
                    width={1920}
                    height={549}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
                </div>
                <div className="absolute inset-0 flex items-center">
                  <div className="max-w-7xl w-full mx-auto px-12 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                      <div className="w-24 h-24 flex flex-col items-center justify-center border-4 border-white bg-orange-600">
                        <div className="text-white text-sm font-base">BUILD</div>
                        <div className="text-white/80 text-5xl font-bold">#1</div>
                      </div>
                      <div>
                        {/* <div className="text-xs tracking-[0.4em] mb-2 text-orange-600">PERFORMANCE</div> */}
                        {/* <h3 className="text-white mb-2 tracking-wide text-4xl">Unleashed Power & Speed</h3> */}
                        {/* <p className="text-neutral-400 text-lg max-w-2xl">Experience raw horsepower and engineering excellence in action</p> */}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-white text-sm tracking-widest">EXPLORE BUILD GALLERY</span>
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
            
            {/* Performance Gallery Grid */}
            <div className="overflow-hidden">
              <div className="p-8 bg-neutral-950 border-t-4 border-neutral-800">
                <div className="grid grid-cols-4 gap-6">
                  {performanceImages.map((image, index) => (
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
                            <div className="w-10 h-10 mx-auto mb-3 flex items-center justify-center bg-orange-600">
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
        </div>
      </div>
    </div>
  )
}
