import {type PortableTextBlock} from 'next-sanity'

import PortableText from '@/app/components/PortableText'

type TextBlockProps = {
  block: {
    _key: string
    _type: 'textBlock'
    heading?: string
    content: PortableTextBlock[]
  }
  index: number
}

export default function TextBlock({block}: TextBlockProps) {
  return (
    <div className="container my-8 lg:my-12">
      <div className="max-w-4xl mx-auto">
        {block?.heading && (
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-orbitron mb-6">
            {block.heading}
          </h2>
        )}
        <div className="prose prose-lg max-w-none">
          {block?.content?.length && (
            <PortableText className="" value={block.content as PortableTextBlock[]} />
          )}
        </div>
      </div>
    </div>
  )
}

