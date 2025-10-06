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
            className="inline-flex items-center gap-3 rounded-md bg-[#d4852b] px-8 py-4 text-base font-medium text-black shadow-sm transition-colors hover:bg-[#e29639] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#e29639]"
          >
            Dealer Resources
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
              <path d="M13.172 12 8.222 7.05l1.414-1.414L16 12l-6.364 6.364-1.414-1.414z" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}


