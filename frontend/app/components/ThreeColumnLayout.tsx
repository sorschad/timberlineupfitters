import {type PortableTextBlock} from 'next-sanity'

import PortableText from '@/app/components/PortableText'

type ThreeColumnLayoutProps = {
  block: {
    _key: string
    _type: 'threeColumnLayout'
    heading?: string
    leftColumn?: PortableTextBlock[]
    middleColumn?: PortableTextBlock[]
    rightColumn?: PortableTextBlock[]
    gap?: 'small' | 'medium' | 'large'
  }
  index: number
}

export default function ThreeColumnLayout({block}: ThreeColumnLayoutProps) {
  // Determine gap classes
  const getGapClass = () => {
    const gap = block.gap || 'medium'
    switch (gap) {
      case 'small':
        return 'gap-4 lg:gap-6'
      case 'large':
        return 'gap-8 lg:gap-12'
      default: // medium
        return 'gap-6 lg:gap-8'
    }
  }

  const gapClass = getGapClass()

  return (
    <div className="container my-8 lg:my-12">
      {block?.heading && (
        <div className="mb-6 lg:mb-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-orbitron">
            {block.heading}
          </h2>
        </div>
      )}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${gapClass}`}>
        <div className="w-full">
          <div className="prose prose-lg max-w-none">
            {block?.leftColumn?.length && (
              <PortableText value={block.leftColumn as PortableTextBlock[]} />
            )}
          </div>
        </div>
        <div className="w-full">
          <div className="prose prose-lg max-w-none">
            {block?.middleColumn?.length && (
              <PortableText value={block.middleColumn as PortableTextBlock[]} />
            )}
          </div>
        </div>
        <div className="w-full">
          <div className="prose prose-lg max-w-none">
            {block?.rightColumn?.length && (
              <PortableText value={block.rightColumn as PortableTextBlock[]} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

