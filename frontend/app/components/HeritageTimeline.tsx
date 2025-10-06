'use client'

import { Montserrat } from 'next/font/google'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '700', '800'],
  display: 'swap',
})

type TimelineCard = {
  year: string
  title?: string
  imageUrl: string
  description: string
}

type HeritageTimelineProps = {
  heading?: string
  cards?: TimelineCard[]
}

const defaultCards: TimelineCard[] = [
  {
    year: '1961',
    imageUrl: '/images/heritage-1961.jpg',
    description:
      "Sportsmobile was founded by Charles Borskey in El Paso, Texas in 1961.",
  },
  {
    year: '1968',
    imageUrl: '/images/heritage-1968.jpg',
    description:
      "The '68 Ford Super Econoline was our first full-size top utilizing a metal roof with fiberglass panels.",
  },
  {
    year: '1973',
    imageUrl: '/images/heritage-1973.jpg',
    description: 'Expansion into new models and improved interior layouts.',
  },
]

export default function HeritageTimeline({ heading = 'We started converting vans long before it was a movement.', cards = defaultCards }: HeritageTimelineProps) {
  return (
    <section className="relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[120px_1fr] gap-8 lg:gap-12">
          <div className="hidden lg:block text-xs tracking-widest uppercase text-gray-500 pt-4">Since 1961</div>
          <div>
            {heading ? (
              <h2 className={`${montserrat.className} text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight`}>{heading}</h2>
            ) : null}

            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              {cards.map((card) => (
                <article key={card.year} className="bg-white shadow-sm border border-gray-100 rounded-lg overflow-hidden">
                  <div className="aspect-[4/3] bg-center bg-cover" style={{ backgroundImage: `url(${card.imageUrl})` }} />
                  <div className="p-4">
                    <div className="text-3xl font-extrabold tracking-tight">{card.year}</div>
                    <p className="mt-3 text-sm text-gray-600 leading-relaxed">{card.description}</p>
                  </div>
                </article>
              ))}
            </div>

            {/* CTA row removed per request */}
          </div>
        </div>
      </div>
    </section>
  )
}


