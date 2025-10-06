import Link from 'next/link'

export default function HomepageCta() {
  return (
    <section className="relative bg-[#2f3f24] text-white">
      <div className="absolute inset-0 bg-[url(/images/tile-1-black.png)] opacity-10 bg-[length:24px]" />
      <div className="relative container py-16 md:py-20 lg:py-24 text-center">
        <h2 className="mx-auto max-w-5xl text-xl md:text-4xl lg:text-5xl font-semibold leading-tight tracking-tight">
          Start Your Dealer Journey
        </h2>
        <p className="mx-auto mt-6 max-w-3xl text-base leading-snug text-[rgba(255,255,255,0.8)] md:text-lg">
          Join our network of dealers and bring Timberline Upfitted Vehicles to your customers. Upfit experts, proven builds and a trusted warranty program
        </p>
        <div className="mt-10 flex justify-center">
          <Link
            href="#"
            className="group relative inline-flex items-center gap-4 bg-gradient-to-r from-[#ff6a00] to-[#ff8c42] px-6 py-3 text-sm font-bold text-white uppercase tracking-wider shadow-xl transition-all duration-300 hover:shadow-xl hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ff6a00]/30 focus-visible:ring-offset-4 focus-visible:ring-offset-[#2f3f24] transform hover:-translate-y-1 overflow-hidden animate-button-glow"
          >
            {/* Primary gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#ff6a00] to-[#ff8c42]"></div>
            
            {/* Animated gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#ff8c42] to-[#ff6a00] opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-gradient"></div>
            
            {/* Shine effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            
            {/* Button content */}
            <span className="relative z-10 font-bold tracking-wider">Dealer Resources</span>
            
            {/* Enhanced arrow icon with sophisticated animation */}
            <div className="relative z-10 flex items-center justify-center">
              <div className="relative">
                <svg 
                  viewBox="0 0 24 24" 
                  className="h-6 w-6 fill-current transition-all duration-300 group-hover:translate-x-1 group-hover:scale-110" 
                  aria-hidden="true"
                >
                  <path d="M13.172 12 8.222 7.05l1.414-1.414L16 12l-6.364 6.364-1.414-1.414z" />
                </svg>
                {/* Subtle glow effect behind arrow */}
                <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
              </div>
            </div>
            
            {/* Subtle border glow effect */}
            <div className="absolute inset-0 border-2 border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
        </div>
      </div>
    </section>
  )
}


