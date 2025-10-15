import {settingsQuery} from '@/sanity/lib/queries'
import {sanityFetch} from '@/sanity/lib/live'
import Link from 'next/link'

export default async function Footer() {
  const {data: settings} = await sanityFetch({ query: settingsQuery })
  return (
    <footer className="relative bg-[var(--color-brown)] text-[var(--color-gray-200)]">
      <div className="absolute inset-0 bg-[url(/images/tile-grid-black.png)] opacity-10 bg-repeat bg-size-[17px]" />
      <div className="relative container">
        <div className="grid grid-cols-1 gap-12 py-14 md:grid-cols-2 lg:grid-cols-12 lg:gap-8 lg:py-16">
          {/* Brand and description */}
          <div className="lg:col-span-5">
            <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-gray-100)]">TIMBERLINE UPFITTERS</h2>
            <p className="mt-4 max-w-xl leading-relaxed text-[var(--color-gray-300)]">
              Premium upfit vehicles engineered for adventure. Built with precision, tested on the trail, and proven in the field.
            </p>
          </div>

          {/* Links */}
          <div className="lg:col-span-3">
            <h3 className="text-lg font-semibold text-[var(--color-gray-100)]">Links</h3>
            <ul className="mt-4 space-y-3 text-[var(--color-gray-300)]">
              <li><Link className="hover:text-[var(--color-white)] transition-colors" href="/heritage">Heritage</Link></li>
              <li><Link className="hover:text-[var(--color-white)] transition-colors" href="/brands">Associated Brands</Link></li>
            </ul>
          </div>

          {/* Get in touch */}
          <div className="lg:col-span-4">
            <h3 className="text-lg font-semibold text-[var(--color-gray-100)]">Get in Touch</h3>
            <ul className="mt-4 space-y-3 text-[var(--color-gray-300)]">
              <li><a className="hover:text-[var(--color-white)] transition-colors" href={`tel:${(settings as any)?.contactPhone}`}>{(settings as any)?.contactPhone}</a></li>
              <li><a className="hover:text-[var(--color-white)] transition-colors" href={`mailto:${(settings as any)?.contactEmail}`}>{(settings as any)?.contactEmail}</a></li>
              <li><span>Mon-Fri 8AM-6PM EST</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[rgba(255,255,255,0.08)]" />

        <div className="flex flex-col items-center justify-between gap-6 py-6 text-sm text-[var(--color-gray-400)] md:flex-row">
        </div>
      </div>
    </footer>
  )
}
