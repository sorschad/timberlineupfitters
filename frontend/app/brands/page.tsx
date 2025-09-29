import type {Metadata} from 'next'
import Image from 'next/image'
import Link from 'next/link'
import BrandsLandingPageHeader from '@/app/components/BrandsLandingPageHeader'

export const metadata: Metadata = {
  title: 'Our Brand Partners',
  description: 'Discover our three flagship brands and the stories behind our partnerships. From Alpine + Rebel Off Road to TSport and SuperDuty, explore how we\'ve built lasting relationships with industry leaders in off-road vehicle customization.',
}

export default function BrandsPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Brands Landing Page Header */}
      <BrandsLandingPageHeader />

      {/* Alpine + Rebel Off Road Section */}
      <section id="alpine" className="py-20 lg:py-32 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 animate-fade-in-left">
              <div className="space-y-4">
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900">
                  Alpine + <span className="text-blue-600 animate-gradient bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Rebel Off Road</span>
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full"></div>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed">
              Every detail, from the sophisticated audio integration to the exclusive vehicle add-ons, was meticulously brought to life by Timberline Upfitters' technical team. The result is a fleet where boundary-pushing sound meets uncompromising off-road performance, crafted to the highest standard.
              These landmark builds are not merely for display; they are available for acquisition. This is a rare opportunity to own a vehicle born from a collaboration of industry leaders.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2 p-4 text-center bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-300">
                  <h4 className="font-semibold text-gray-900">Ocean Edition</h4>
                </div>
                <div className="space-y-2 p-4 text-center bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-300">
                  <h4 className="font-semibold text-gray-900">Brigade Edition</h4>
                </div>
              </div>
            </div>
            <div className="relative animate-fade-in-right">
              <div className="aspect-[4/3] relative rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-300">
                <Image
                  src="https://images.unsplash.com/photo-1583121274602-3e2820c69888?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                  alt="Alpine + Rebel Off Road all-terrain cover image"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 via-transparent to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-100 rounded-full opacity-20 animate-float-bounce"></div>
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-cyan-100 rounded-full opacity-30 animate-bounce-slow"></div>
            </div>
          </div>
        </div>
      </section>

      {/* TSport Section */}
      <section id="tsport" className="py-20 lg:py-32 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative order-2 lg:order-1 animate-fade-in-left">
              <div className="aspect-[4/3] relative rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-300">
                <Image
                  src="https://images.unsplash.com/photo-1549317336-206569e8475c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                  alt="TSport cover image"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-orange-100 rounded-full opacity-20 animate-float-bounce"></div>
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-red-100 rounded-full opacity-30 animate-bounce-slow"></div>
            </div>
            <div className="space-y-8 order-1 lg:order-2 animate-fade-in-right">
              <div className="space-y-4">
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
                  <span className="text-orange-500 animate-gradient bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">TSport</span> and ThorSport
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
              </div>
              <p className="text-lg text-gray-300 leading-relaxed">
                TSport and ThorSport represent the perfect fusion of American muscle and precision engineering. 
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2 p-4 bg-orange-900/20 rounded-lg hover:bg-orange-900/30 transition-colors duration-300">
                  <h4 className="font-semibold text-orange-400">Valor</h4>
                  <p className="text-sm text-gray-400">Premium performance and luxury features</p>
                </div>
                <div className="space-y-2 p-4 bg-red-900/20 rounded-lg hover:bg-red-900/30 transition-colors duration-300">
                  <h4 className="font-semibold text-orange-400">Anthem</h4>
                  <p className="text-sm text-gray-400">Heritage-inspired design with modern tech</p>
                </div>
                <div className="space-y-2 p-4 bg-orange-800/20 rounded-lg hover:bg-orange-800/30 transition-colors duration-300">
                  <h4 className="font-semibold text-orange-400">Sportsman</h4>
                  <p className="text-sm text-gray-400">Adventure-ready with enhanced capabilities</p>
                </div>
                <div className="space-y-2 p-4 bg-red-800/20 rounded-lg hover:bg-red-800/30 transition-colors duration-300">
                  <h4 className="font-semibold text-orange-400">4x4 Truck</h4>
                  <p className="text-sm text-gray-400">Ultimate off-road performance platform</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timberline Brands Section */}
      <section id="timberline-elite" className="py-20 lg:py-32 bg-gradient-to-br from-[#241e16] to-[#1a130e] text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 animate-fade-in-left">
              <div className="space-y-4">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-[#ff8c42] rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
                      <span className="text-[#ff8c42] animate-gradient bg-gradient-to-r from-[#ff8c42] to-[#d0ad66] bg-clip-text text-transparent">Timberline</span>
                    </h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-[#ff8c42] to-[#d0ad66] rounded-full"></div>
                  </div>
                </div>
              </div>
              <p className="text-lg text-gray-300 leading-relaxed">
                Our flagship Timberline brand represents the pinnacle of off-road vehicle customization and American craftsmanship. 
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2 p-4 bg-[#ff8c42]/10 rounded-lg hover:bg-[#ff8c42]/20 transition-colors duration-300 border border-[#ff8c42]/20">
                  <h4 className="font-semibold text-[#ff8c42]">Overlook</h4>
                  <p className="text-sm text-gray-300">Bespoke vehicle modifications tailored to your needs</p>
                </div>
                <div className="space-y-2 p-4 bg-[#d0ad66]/10 rounded-lg hover:bg-[#d0ad66]/20 transition-colors duration-300 border border-[#d0ad66]/20">
                  <h4 className="font-semibold text-[#ff8c42]">Trailhead</h4>
                  <p className="text-sm text-gray-300">High-quality components engineered for durability</p>
                </div>
                <div className="space-y-2 p-4 bg-[#ff8c42]/10 rounded-lg hover:bg-[#ff8c42]/20 transition-colors duration-300 border border-[#ff8c42]/20">
                  <h4 className="font-semibold text-[#ff8c42]">Waypoint</h4>
                  <p className="text-sm text-gray-300">Professional installation and maintenance support</p>
                </div>
                <div className="space-y-2 p-4 bg-[#d0ad66]/10 rounded-lg hover:bg-[#d0ad66]/20 transition-colors duration-300 border border-[#d0ad66]/20">
                  <h4 className="font-semibold text-[#ff8c42]">North Trail</h4>
                  <p className="text-sm text-gray-300">Comprehensive protection for all modifications</p>
                </div>
              </div>
            </div>
            <div className="relative animate-fade-in-right">
              <div className="aspect-[4/3] relative rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-300">
                <Image
                  src="https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                  alt="Timberline Upfitters cover image"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#241e16]/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-[#ff8c42]/90 backdrop-blur-sm rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-[#ff8c42]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-white text-sm font-semibold">Timberline Upfitters Certified</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#ff8c42]/20 rounded-full opacity-20 animate-float-bounce"></div>
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-[#d0ad66]/20 rounded-full opacity-30 animate-bounce-slow"></div>
            </div>
          </div>
        </div>
      </section>

      

    </div>
  )
}
