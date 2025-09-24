"use client"

import Link from 'next/link'
import {useEffect, useState} from 'react'
import {Orbitron} from 'next/font/google'

const orbitron = Orbitron({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '700', '900'],
})

interface Manufacturer {
  _id: string
  name: string
  slug: { current: string }
  logo?: any
  vehicleCount: number
}

export default function HeaderClient({
  settingsTitle,
  manufacturers,
}: {
  settingsTitle?: string
  manufacturers?: Manufacturer[]
}) {
  const [isSticky, setIsSticky] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setIsSticky(window.scrollY > 10)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, {passive: true})
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 h-24 flex items-center transition-all duration-700 ease-out ${
        isSticky ? 'bg-[#ff5500]/95 shadow-lg backdrop-blur-[2px]' : 'bg-transparent shadow-none backdrop-blur-0'
      }`}
      style={{willChange: 'background-color, filter, box-shadow'}}
    >
      <div className="container py-6 px-2 sm:px-6">
        <div className="flex items-center justify-between gap-5">
          <Link className="flex items-center gap-2" href="/" aria-label={settingsTitle}>
            <span className="sr-only">{settingsTitle}</span>
            <div className="flex items-baseline">
              <span
                className={`${orbitron.className} select-none tracking-[0.06em] antialiased text-white text-xl sm:text-3xl font-black leading-none transition-colors duration-300 ${
                  isSticky ? '' : 'drop-shadow-[0_0_1px_rgba(0,0,0,1)]'
                }`}
              >
                TIMBERLINE
              </span>
              <span
                className={`${orbitron.className} select-none tracking-[0.05em] antialiased text-xl sm:text-3xl font-black leading-none transition-colors duration-300 ${
                  isSticky ? 'text-white' : 'text-[#ff5500]'
                }`}
              >
                UPFITTERS
              </span>
            </div>
          </Link>

          <nav>
            <ul
              role="list"
              className="flex items-center gap-5 md:gap-8 leading-5 text-sm tracking-[0.18em] font-semibold font-sans"
            >
              <li className="relative group">
                <button className={`flex items-center gap-1 ${isSticky ? 'text-white/90 hover:text-white' : 'text-white/90 hover:text-white'} ${isSticky ? '' : 'drop-shadow-[0_0_1px_rgba(0,0,0,0.12)]'} no-underline uppercase`}>
                  Manufacturers
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2 max-h-[60vh] overflow-auto">
                    {manufacturers?.map((manufacturer) => (
                      <Link
                        key={manufacturer._id}
                        href={`/manufacturers/${manufacturer.slug.current}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
                      >
                        {manufacturer.name}
                        <span className="text-xs text-gray-500 ml-2">({manufacturer.vehicleCount} vehicles)</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </li>

              <li>
                <Link href="/about" className={`${isSticky ? 'text-white/90 hover:text-white' : 'text-white/90 hover:text-white'} ${isSticky ? '' : 'drop-shadow-[0_0_1px_rgba(0,0,0,0.12)]'} no-underline uppercase`}>
                  Heritage
                </Link>
              </li>

              <li className="flex sm:gap-4 md:gap-6">
                <Link
                  className="rounded-full flex items-center bg-brown/90 hover:bg-[#1a130e] py-3 px-6 justify-center sm:py-3 sm:px-8 text-white text-xs uppercase tracking-wide transition-colors duration-200"
                  href="https://github.com/sanity-io/sanity-template-nextjs-clean"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="whitespace-nowrap">Dealer Portal</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}


