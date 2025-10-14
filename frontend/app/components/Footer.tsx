import Link from 'next/link'

export default function Footer() {
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
              <li><a className="hover:text-[var(--color-white)] transition-colors" href="#">Order Form</a></li>
              <li><a className="hover:text-[var(--color-white)] transition-colors" href="#">Vehicle Models</a></li>
              <li><a className="hover:text-[var(--color-white)] transition-colors" href="#">Dealer Packets</a></li>
            </ul>
          </div>

          {/* Get in touch */}
          <div className="lg:col-span-4">
            <h3 className="text-lg font-semibold text-[var(--color-gray-100)]">Get in Touch</h3>
            <ul className="mt-4 space-y-3 text-[var(--color-gray-300)]">
              <li><a className="hover:text-[var(--color-white)] transition-colors" href="tel:18882503012">1-800-250-3012</a></li>
              <li><a className="hover:text-[var(--color-white)] transition-colors" href="mailto:sales@timberlineupfitters.com">sales@timberlineupfitters.com</a></li>
              <li><span>Mon-Fri 8AM-6PM EST</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[rgba(255,255,255,0.08)]" />

        <div className="flex flex-col items-center justify-between gap-6 py-6 text-sm text-[var(--color-gray-400)] md:flex-row">

          {/* Social icons centered between left and right blocks */}
          <div className="order-1 md:order-1 md:flex-none md:mx-auto flex items-center gap-4">
            <a aria-label="Facebook" href="#" className="group inline-flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.12)]">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-[var(--color-gray-100)] opacity-90 group-hover:opacity-100" aria-hidden="true">
                <path d="M22 12.06C22 6.49 17.52 2 12 2S2 6.49 2 12.06c0 5.01 3.66 9.16 8.44 9.94v-7.03H7.9v-2.91h2.54V9.41c0-2.5 1.49-3.88 3.76-3.88 1.09 0 2.23.2 2.23.2v2.45h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.91h-2.34V22c4.78-.78 8.44-4.93 8.44-9.94Z" />
              </svg>
            </a>
            <a aria-label="Instagram" href="#" className="group inline-flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.12)]">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-[var(--color-gray-100)] opacity-90 group-hover:opacity-100" aria-hidden="true">
                <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.5a5.5 5.5 0 1 1 0 11.001A5.5 5.5 0 0 1 12 7.5Zm0 2a3.5 3.5 0 1 0 .001 7.001A3.5 3.5 0 0 0 12 9.5Zm6.25-2.75a1 1 0 1 1-2.001 0 1 1 0 0 1 2.001 0Z" />
              </svg>
            </a>
            <a aria-label="YouTube" href="#" className="group inline-flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.12)]">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-[var(--color-gray-100)] opacity-90 group-hover:opacity-100" aria-hidden="true">
                <path d="M23.5 6.2a3.1 3.1 0 0 0-2.2-2.2C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.3.5A3.1 3.1 0 0 0 .5 6.2 32.8 32.8 0 0 0 0 12a32.8 32.8 0 0 0 .5 5.8 3.1 3.1 0 0 0 2.2 2.2c1.8.5 9.3.5 9.3.5s7.5 0 9.3-.5a3.1 3.1 0 0 0 2.2-2.2c.5-1.8.5-5.8.5-5.8s0-4-.5-5.8ZM9.75 15.02V8.98L15.5 12l-5.75 3.02Z" />
              </svg>
            </a>
          </div>

          <nav className="order-2 md:order-2 md:flex-1 flex items-center gap-6 md:justify-end">
            <Link className="hover:text-[var(--color-white)] transition-colors" href="/privacy-policy">Privacy Policy</Link>
            <Link className="hover:text-[var(--color-white)] transition-colors" href="/terms-of-service">Terms of Service</Link>
            <Link className="hover:text-[var(--color-white)] transition-colors" href="/warranty">Warranty</Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
