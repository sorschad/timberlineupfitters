import {settingsQuery} from '@/sanity/lib/queries'
import {sanityFetch} from '@/sanity/lib/live'
import Link from 'next/link'

export default async function Footer() {
  const {data: settings} = await sanityFetch({ query: settingsQuery })
  return (
    <footer className="bg-black border-t-4 border-neutral-800 text-white py-16">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-4 gap-12 mb-12">
          {/* Brand Section - 2 columns */}
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div>
                <div className="text-neutral-500 text-xs tracking-widest">TIMBERLINE UPFITTERS</div>
              </div>
            </div>
            <p className="text-neutral-400 mb-6 leading-relaxed">
              Leading the adventure-focused lifestyle with vehicle customization dedicated to helping people explore the outdoors with style, reliability, and performance
            </p>
          </div>

          {/* Brands Section */}
          <div>
            <h3 className="text-white tracking-widest mb-4 text-sm">BRANDS</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/brands#tsport" className="text-neutral-400 hover:text-orange-600 transition-colors">T-Sport</Link></li>
              <li><Link href="/brands#timberline" className="text-neutral-400 hover:text-orange-600 transition-colors">Timberline</Link></li>
              <li><Link href="/brands#alpine" className="text-neutral-400 hover:text-orange-600 transition-colors">Alpine</Link></li>
            </ul>
          </div>
        </div>

      </div>
    </footer>
  )
}
