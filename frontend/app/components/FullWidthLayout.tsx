import ContentRenderer from '@/app/components/ContentRenderer'
import {type PortableTextBlock} from 'next-sanity'

type FullWidthLayoutProps = {
  block: {
    _key: string
    _type: 'fullWidthLayout'
    heading?: string
    subheading?: string
    contentType?: 'richText' | 'markdown' | 'html' | 'plainText'
    richTextContent?: PortableTextBlock[]
    markdownContent?: string
    htmlContent?: string
    plainTextContent?: string
    maxWidth?: 'full' | '7xl' | '6xl' | '4xl' | '2xl'
    backgroundStyle?: 'none' | 'light' | 'dark' | 'primary'
    padding?: 'none' | 'small' | 'medium' | 'large'
  }
  index: number
}

export default function FullWidthLayout({block}: FullWidthLayoutProps) {
  // Determine max width classes
  const getMaxWidthClass = () => {
    const maxWidth = block.maxWidth || '4xl'
    switch (maxWidth) {
      case 'full':
        return 'max-w-full'
      case '7xl':
        return 'max-w-7xl'
      case '6xl':
        return 'max-w-6xl'
      case '2xl':
        return 'max-w-2xl'
      default: // 4xl
        return 'max-w-4xl'
    }
  }

  // Determine background classes
  const getBackgroundClass = () => {
    const background = block.backgroundStyle || 'none'
    switch (background) {
      case 'light':
        return 'bg-gray-50'
      case 'dark':
        return 'bg-gray-900 text-white'
      case 'primary':
        return 'bg-timberline-orange text-white'
      default: // none
        return 'bg-transparent'
    }
  }

  // Determine padding classes
  const getPaddingClass = () => {
    const padding = block.padding || 'medium'
    switch (padding) {
      case 'none':
        return 'py-0'
      case 'small':
        return 'py-6 lg:py-8'
      case 'large':
        return 'py-16 lg:py-24'
      default: // medium
        return 'py-12 lg:py-16'
    }
  }

  const maxWidthClass = getMaxWidthClass()
  const backgroundClass = getBackgroundClass()
  const paddingClass = getPaddingClass()

  return (
    <div className={`w-full ${backgroundClass} ${paddingClass}`}>
      <div className={`container mx-auto px-4 sm:px-6 lg:px-8`}>
        <div className={maxWidthClass}>
          {block?.heading && (
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-orbitron mb-4">
              {block.heading}
            </h2>
          )}
          {block?.subheading && (
            <p className={`text-lg md:text-xl mb-6 ${
              block.backgroundStyle === 'dark' || block.backgroundStyle === 'primary'
                ? 'text-gray-300'
                : 'text-gray-600'
            }`}>
              {block.subheading}
            </p>
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
    </div>
  )
}

