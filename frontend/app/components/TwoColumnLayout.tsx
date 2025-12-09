import ContentRenderer from '@/app/components/ContentRenderer'
import {type PortableTextBlock} from 'next-sanity'

type TwoColumnLayoutProps = {
  block: {
    _key: string
    _type: 'twoColumnLayout'
    heading?: string
    leftColumnContentType?: 'richText' | 'markdown' | 'html' | 'plainText'
    leftColumnRichText?: PortableTextBlock[]
    leftColumnMarkdown?: string
    leftColumnHtml?: string
    leftColumnPlainText?: string
    rightColumnContentType?: 'richText' | 'markdown' | 'html' | 'plainText'
    rightColumnRichText?: PortableTextBlock[]
    rightColumnMarkdown?: string
    rightColumnHtml?: string
    rightColumnPlainText?: string
    columnRatio?: 'equal' | 'wideLeft' | 'wideRight'
    reverseOnMobile?: boolean
    gap?: 'small' | 'medium' | 'large'
  }
  index: number
}

export default function TwoColumnLayout({block}: TwoColumnLayoutProps) {
  // Determine column width classes based on ratio
  const getColumnClasses = () => {
    const baseClasses = 'w-full'
    const ratio = block.columnRatio || 'equal'
    
    switch (ratio) {
      case 'wideLeft':
        return {
          left: `${baseClasses} lg:w-[60%]`,
          right: `${baseClasses} lg:w-[40%]`,
        }
      case 'wideRight':
        return {
          left: `${baseClasses} lg:w-[40%]`,
          right: `${baseClasses} lg:w-[60%]`,
        }
      default: // equal
        return {
          left: `${baseClasses} lg:w-1/2`,
          right: `${baseClasses} lg:w-1/2`,
        }
    }
  }

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

  const columnClasses = getColumnClasses()
  const gapClass = getGapClass()
  const orderClass = block.reverseOnMobile ? 'flex-col-reverse lg:flex-row' : 'flex-col lg:flex-row'

  return (
    <div className="container my-8 lg:my-12">
      {block?.heading && (
        <div className="mb-6 lg:mb-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-orbitron">
            {block.heading}
          </h2>
        </div>
      )}
      <div className={`flex ${orderClass} ${gapClass}`}>
        <div className={columnClasses.left}>
          <ContentRenderer
            contentType={block?.leftColumnContentType || 'richText'}
            richTextContent={block?.leftColumnRichText}
            markdownContent={block?.leftColumnMarkdown}
            htmlContent={block?.leftColumnHtml}
            plainTextContent={block?.leftColumnPlainText}
            className="prose prose-lg max-w-none"
          />
        </div>
        <div className={columnClasses.right}>
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

