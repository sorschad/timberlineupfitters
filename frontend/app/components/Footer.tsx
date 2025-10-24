import {settingsQuery} from '@/sanity/lib/queries'
import {sanityFetch} from '@/sanity/lib/live'
import Link from 'next/link'

export default async function Footer() {
  const {data: settings} = await sanityFetch({ query: settingsQuery })
  return (
    <footer className="bg-black border-t-4 border-neutral-800 text-white py-16">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-5 gap-12 mb-12">
          {/* Brand Section - 2 columns */}
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 bg-orange-600 border-2 border-white flex items-center justify-center">
                <span className="text-white text-xs tracking-widest transform -rotate-45">APEX</span>
              </div>
              <div>
                <div className="text-white tracking-wider text-xl">APEX SERIES</div>
                <div className="text-neutral-500 text-xs tracking-widest">PREMIUM UPFITTERS</div>
              </div>
            </div>
            <p className="text-neutral-400 mb-6 leading-relaxed">
              Building America's most capable trucks since 2009. Performance, luxury, and adventure—engineered to perfection.
            </p>
            <div className="flex gap-4">
              <button className="w-10 h-10 bg-neutral-900 border-2 border-neutral-800 hover:border-orange-600 transition-colors flex items-center justify-center group">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook w-5 h-5 text-orange-600 group-hover:text-white transition-colors" aria-hidden="true">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </button>
              <button className="w-10 h-10 bg-neutral-900 border-2 border-neutral-800 hover:border-orange-600 transition-colors flex items-center justify-center group">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram w-5 h-5 text-orange-600 group-hover:text-white transition-colors" aria-hidden="true">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="m16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                </svg>
              </button>
              <button className="w-10 h-10 bg-neutral-900 border-2 border-neutral-800 hover:border-orange-600 transition-colors flex items-center justify-center group">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-youtube w-5 h-5 text-orange-600 group-hover:text-white transition-colors" aria-hidden="true">
                  <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"></path>
                  <path d="m9.75 15.02 5.75-3.27-5.75-3.27v6.54Z"></path>
                </svg>
              </button>
            </div>
          </div>

          {/* Brands Section */}
          <div>
            <h3 className="text-white tracking-widest mb-4 text-sm">BRANDS</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/brands/t-sport" className="text-neutral-400 hover:text-orange-600 transition-colors">T-Sport</Link></li>
              <li><Link href="/brands/timberline" className="text-neutral-400 hover:text-orange-600 transition-colors">Timberline</Link></li>
              <li><Link href="/brands/alpine" className="text-neutral-400 hover:text-orange-600 transition-colors">Alpine</Link></li>
            </ul>
          </div>

          {/* Vehicles Section */}
          <div>
            <h3 className="text-white tracking-widest mb-4 text-sm">VEHICLES</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/vehicles?manufacturer=ford" className="text-neutral-400 hover:text-orange-600 transition-colors">Ford</Link></li>
              <li><Link href="/vehicles?manufacturer=ram" className="text-neutral-400 hover:text-orange-600 transition-colors">Ram</Link></li>
              <li><Link href="/vehicles?manufacturer=jeep" className="text-neutral-400 hover:text-orange-600 transition-colors">Jeep</Link></li>
              <li><Link href="/vehicles" className="text-neutral-400 hover:text-orange-600 transition-colors">View All</Link></li>
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h3 className="text-white tracking-widest mb-4 text-sm">SUPPORT</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-neutral-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin w-4 h-4 text-orange-600" aria-hidden="true">
                  <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>Find a Dealer</span>
              </li>
              <li className="flex items-center gap-2 text-neutral-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-phone w-4 h-4 text-orange-600" aria-hidden="true">
                  <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"></path>
                </svg>
                <span>{(settings as any)?.contactPhone || '(800) 555-APEX'}</span>
              </li>
              <li className="flex items-center gap-2 text-neutral-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail w-4 h-4 text-orange-600" aria-hidden="true">
                  <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"></path>
                  <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                </svg>
                <span>{(settings as any)?.contactEmail || 'info@apex.com'}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t-2 border-neutral-800 pt-8 flex justify-between items-center">
          <p className="text-neutral-600 text-sm">© 2025 Apex Series. All rights reserved.</p>
          <div className="flex gap-6 text-sm">
            <Link href="/privacy" className="text-neutral-600 hover:text-orange-600 transition-colors">Privacy</Link>
            <Link href="/terms" className="text-neutral-600 hover:text-orange-600 transition-colors">Terms</Link>
            <Link href="/warranty" className="text-neutral-600 hover:text-orange-600 transition-colors">Warranty</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
