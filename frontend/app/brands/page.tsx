import type {Metadata} from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Our Brand Partners',
  description: 'Discover our three flagship brands and the stories behind our partnerships. From Alpine + RebelX to TSport and SuperDuty, explore how we\'ve built lasting relationships with industry leaders in off-road vehicle customization.',
}

export default function BrandsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-transparent to-orange-900/20"></div>
        <div className="absolute inset-0 parallax-bg">
          <Image
            src="https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Off-road vehicles in rugged terrain"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight animate-fade-in-up">
            Our <span className="text-amber-400 animate-gradient bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">Brand</span> Stories
          </h1>
          <p className="text-xl sm:text-2xl text-amber-100 mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            Three partnerships, countless adventures. Discover the relationships that define our commitment to excellence in off-road vehicle customization.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{animationDelay: '0.4s'}}>
            <Link 
              href="#alpine-rebelx" 
              className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Explore Our Brands
            </Link>
            <Link 
              href="#our-story" 
              className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:shadow-lg"
            >
              Our Story
            </Link>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Alpine + RebelX Section */}
      <section id="alpine-rebelx" className="py-20 lg:py-32 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 animate-fade-in-left">
              <div className="space-y-4">
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900">
                  Alpine + <span className="text-blue-600 animate-gradient bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">RebelX</span>
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full"></div>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our partnership with Alpine + RebelX represents the pinnacle of ocean-inspired design meeting rugged off-road capability. 
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-300">
                  <h4 className="font-semibold text-gray-900">Ocean Edition</h4>
                  <p className="text-sm text-gray-600">Premium ocean-inspired finishes and materials</p>
                </div>
                <div className="space-y-2 p-4 bg-cyan-50 rounded-lg hover:bg-cyan-100 transition-colors duration-300">
                  <h4 className="font-semibold text-gray-900">Brigade Edition</h4>
                  <p className="text-sm text-gray-600">Military-grade durability and performance</p>
                </div>
              </div>
              <Link 
                href="/brands/alpine-rebelx" 
                className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Learn More
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="relative animate-fade-in-right">
              <div className="aspect-[4/3] relative rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-300">
                <Image
                  src="https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  alt="Alpine + RebelX Jeep Wrangler in ocean setting"
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
      <section className="py-20 lg:py-32 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative order-2 lg:order-1 animate-fade-in-left">
              <div className="aspect-[4/3] relative rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-300">
                <Image
                  src="https://images.unsplash.com/photo-1583121274602-3e2820c69888?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  alt="TSport F-150 in action"
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
                  <span className="text-orange-500 animate-gradient bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">TSport</span> F-150
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
              </div>
              <p className="text-lg text-gray-300 leading-relaxed">
                The TSport F-150 represents the perfect fusion of American muscle and precision engineering. 
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2 p-4 bg-orange-900/20 rounded-lg hover:bg-orange-900/30 transition-colors duration-300">
                  <h4 className="font-semibold text-orange-400">Valor Series</h4>
                  <p className="text-sm text-gray-400">Premium performance and luxury features</p>
                </div>
                <div className="space-y-2 p-4 bg-red-900/20 rounded-lg hover:bg-red-900/30 transition-colors duration-300">
                  <h4 className="font-semibold text-orange-400">Anthem Series</h4>
                  <p className="text-sm text-gray-400">Heritage-inspired design with modern tech</p>
                </div>
                <div className="space-y-2 p-4 bg-orange-800/20 rounded-lg hover:bg-orange-800/30 transition-colors duration-300">
                  <h4 className="font-semibold text-orange-400">Sportsman Series</h4>
                  <p className="text-sm text-gray-400">Adventure-ready with enhanced capabilities</p>
                </div>
                <div className="space-y-2 p-4 bg-red-800/20 rounded-lg hover:bg-red-800/30 transition-colors duration-300">
                  <h4 className="font-semibold text-orange-400">4x4 Truck</h4>
                  <p className="text-sm text-gray-400">Ultimate off-road performance platform</p>
                </div>
              </div>
              <Link 
                href="/brands/tsport" 
                className="inline-flex items-center bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Explore TSport
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SuperDuty Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-amber-50 to-orange-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 animate-fade-in-left">
              <div className="space-y-4">
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900">
                  <span className="text-amber-600 animate-gradient bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">SuperDuty</span> Series
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-amber-600 to-orange-500 rounded-full"></div>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our SuperDuty partnership embodies the spirit of American craftsmanship and relentless performance. 
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2 p-4 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors duration-300">
                  <h4 className="font-semibold text-gray-900">Valor Edition</h4>
                  <p className="text-sm text-gray-600">Premium luxury with uncompromising power</p>
                </div>
                <div className="space-y-2 p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors duration-300">
                  <h4 className="font-semibold text-gray-900">Anthem Edition</h4>
                  <p className="text-sm text-gray-600">Classic styling meets modern performance</p>
                </div>
                <div className="space-y-2 p-4 bg-amber-100 rounded-lg hover:bg-amber-200 transition-colors duration-300">
                  <h4 className="font-semibold text-gray-900">Sportsman Edition</h4>
                  <p className="text-sm text-gray-600">Built for the most demanding adventures</p>
                </div>
                <div className="space-y-2 p-4 bg-orange-100 rounded-lg hover:bg-orange-200 transition-colors duration-300">
                  <h4 className="font-semibold text-gray-900">4x4 Platform</h4>
                  <p className="text-sm text-gray-600">Ultimate off-road capability and durability</p>
                </div>
              </div>
              <Link 
                href="/brands/superduty" 
                className="inline-flex items-center bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Discover SuperDuty
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="relative animate-fade-in-right">
              <div className="aspect-[4/3] relative rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-300">
                <Image
                  src="https://images.unsplash.com/photo-1549317336-206569e8475c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  alt="SuperDuty truck in rugged terrain"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-amber-900/60 via-transparent to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-amber-100 rounded-full opacity-20 animate-float-bounce"></div>
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-orange-100 rounded-full opacity-30 animate-bounce-slow"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section id="our-story" className="py-20 lg:py-32 bg-gray-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8">
              Our <span className="text-amber-400 animate-gradient bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Partnership</span> Story
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Every great partnership begins with a shared vision. Discover how we've built lasting relationships 
              with industry leaders to deliver exceptional off-road experiences.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center space-y-6 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-blue-400">Innovation</h3>
              <p className="text-gray-300 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
            
            <div className="text-center space-y-6 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
              <div className="w-20 h-20 bg-orange-600 rounded-full flex items-center justify-center mx-auto hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-orange-400">Passion</h3>
              <p className="text-gray-300 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
            
            <div className="text-center space-y-6 animate-fade-in-up" style={{animationDelay: '0.6s'}}>
              <div className="w-20 h-20 bg-amber-600 rounded-full flex items-center justify-center mx-auto hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-amber-400">Excellence</h3>
              <p className="text-gray-300 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-amber-600 to-orange-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-8 animate-fade-in-up">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl mb-12 max-w-3xl mx-auto animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            Explore our complete lineup of vehicles and discover which brand partnership is perfect for your next adventure.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{animationDelay: '0.4s'}}>
            <Link 
              href="/vehicles" 
              className="bg-white text-amber-600 hover:bg-gray-100 px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              View All Vehicles
            </Link>
            <Link 
              href="/contact" 
              className="border-2 border-white text-white hover:bg-white hover:text-amber-600 px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:shadow-lg"
            >
              Get In Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
