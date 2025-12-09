import ContentRenderer from '@/app/components/ContentRenderer'
import {type PortableTextBlock} from 'next-sanity'

type TextBlockProps = {
  block: {
    _key: string
    _type: 'textBlock'
    heading?: string
    contentType?: 'richText' | 'markdown' | 'html' | 'plainText'
    richTextContent?: PortableTextBlock[]
    markdownContent?: string
    htmlContent?: string
    plainTextContent?: string
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
  )
}

