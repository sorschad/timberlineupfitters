import ContentRenderer from '@/app/components/ContentRenderer'
import {type PortableTextBlock} from 'next-sanity'

type ThreeColumnLayoutProps = {
  block: {
    _key: string
    _type: 'threeColumnLayout'
    heading?: string
    leftColumnContentType?: 'richText' | 'markdown' | 'html' | 'plainText'
    leftColumnRichText?: PortableTextBlock[]
    leftColumnMarkdown?: string
    leftColumnHtml?: string
    leftColumnPlainText?: string
    middleColumnContentType?: 'richText' | 'markdown' | 'html' | 'plainText'
    middleColumnRichText?: PortableTextBlock[]
    middleColumnMarkdown?: string
    middleColumnHtml?: string
    middleColumnPlainText?: string
    rightColumnContentType?: 'richText' | 'markdown' | 'html' | 'plainText'
    rightColumnRichText?: PortableTextBlock[]
    rightColumnMarkdown?: string
    rightColumnHtml?: string
    rightColumnPlainText?: string
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
          <ContentRenderer
            contentType={block?.leftColumnContentType || 'richText'}
            richTextContent={block?.leftColumnRichText}
            markdownContent={block?.leftColumnMarkdown}
            htmlContent={block?.leftColumnHtml}
            plainTextContent={block?.leftColumnPlainText}
            className="prose prose-lg max-w-none"
          />
        </div>
        <div className="w-full">
          <ContentRenderer
            contentType={block?.middleColumnContentType || 'richText'}
            richTextContent={block?.middleColumnRichText}
            markdownContent={block?.middleColumnMarkdown}
            htmlContent={block?.middleColumnHtml}
            plainTextContent={block?.middleColumnPlainText}
            className="prose prose-lg max-w-none"
          />
        </div>
        <div className="w-full">
          <ContentRenderer
            contentType={block?.rightColumnContentType || 'richText'}
            richTextContent={block?.rightColumnRichText}
            markdownContent={block?.rightColumnMarkdown}
            htmlContent={block?.rightColumnHtml}
            plainTextContent={block?.rightColumnPlainText}
            className="prose prose-lg max-w-none"
          />
        </div>
      </div>
    </div>
  )
}

