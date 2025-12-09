import ContentRenderer from '@/app/components/ContentRenderer'
import {type PortableTextBlock} from 'next-sanity'

type InfoProps = {
  block: {
    _key: string
    _type: 'infoSection'
    heading?: string
    subheading?: string
    contentType?: 'richText' | 'markdown' | 'html' | 'plainText'
    richTextContent?: PortableTextBlock[]
    markdownContent?: string
    htmlContent?: string
    plainTextContent?: string
  }
  index: number
}

export default function CTA({block}: InfoProps) {
  return (
    <div className="container my-12">
      <div className="max-w-3xl">
        {block?.heading && (
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-orbitron">{block.heading}</h2>
        )}
        {block?.subheading && (
          <span className="block mt-4 mb-8 text-lg uppercase font-light text-gray-900/70 font-lato">
            {block.subheading}
          </span>
        )}
        <div className="mt-4">
          <ContentRenderer
            contentType={block?.contentType || 'richText'}
            richTextContent={block?.richTextContent}
            markdownContent={block?.markdownContent}
            htmlContent={block?.htmlContent}
            plainTextContent={block?.plainTextContent}
            className="prose prose-lg max-w-none"
          />
        </div>
      </div>
    </div>
  )
}
