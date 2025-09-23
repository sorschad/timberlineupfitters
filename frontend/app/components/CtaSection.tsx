import Link from 'next/link'

interface Manufacturer {
  _id: string
  name: string
  vehicles?: any[]
}

interface CtaSectionProps {
  manufacturer: Manufacturer
}

export default function CtaSection({ manufacturer }: CtaSectionProps) {
  const vehicleCount = manufacturer.vehicles?.length || 0

  return (
    <section className="relative py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('/images/pattern-grid.svg')] bg-repeat" />
      </div>

      <div className="relative z-10 container text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Ready to Find Your {manufacturer.name}?
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed">
            Explore {vehicleCount} {manufacturer.name} vehicles and packages designed for your specific needs. 
            From rugged worksites to epic adventures, we have the perfect vehicle for you.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="text-4xl font-bold text-brand mb-2">
                {vehicleCount}
              </div>
              <div className="text-gray-300">
                Available Packages
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-brand mb-2">
                100%
              </div>
              <div className="text-gray-300">
                Custom Built
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-brand mb-2">
                24/7
              </div>
              <div className="text-gray-300">
                Support
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              href="/contact"
              className="bg-brand hover:bg-brand/90 text-white px-10 py-5 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Locate a Dealer
            </Link>
            
            <Link
              href="/inventory"
              className="bg-white/10 hover:bg-white/20 text-white px-10 py-5 rounded-full text-lg font-semibold transition-all duration-300 border border-white/30 hover:border-white/50 backdrop-blur-sm"
            >
              Browse Inventory
            </Link>
          </div>

          {/* Additional Links */}
          <div className="mt-12 pt-8 border-t border-gray-700">
            <div className="flex flex-wrap justify-center gap-8 text-gray-400">
              <Link 
                href="/financing" 
                className="hover:text-white transition-colors duration-300"
              >
                Financing Options
              </Link>
              <Link 
                href="/warranty" 
                className="hover:text-white transition-colors duration-300"
              >
                Warranty Info
              </Link>
              <Link 
                href="/service" 
                className="hover:text-white transition-colors duration-300"
              >
                Service & Support
              </Link>
              <Link 
                href="/accessories" 
                className="hover:text-white transition-colors duration-300"
              >
                Accessories
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-brand/20 rounded-full blur-xl" />
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-xl" />
    </section>
  )
}
