/**
 * This component uses Portable Text to render a post body.
 *
 * You can learn more about Portable Text on:
 * https://www.sanity.io/docs/block-content
 * https://github.com/portabletext/react-portabletext
 * https://portabletext.org/
 *
 */

import React from 'react'
import {PortableText, type PortableTextComponents, type PortableTextBlock} from 'next-sanity'
import Image from 'next/image'
import {urlForImage} from '@/sanity/lib/utils'

import ResolvedLink from '@/app/components/ResolvedLink'

// Helper function to parse HTML content and convert it to React elements
function parseHtmlContent(content: any): React.ReactNode {
  if (typeof content === 'string') {
    // Check if the string contains HTML tags
    if (content.includes('<br>') || content.includes('<br/>') || content.includes('<br />')) {
      // Split by line breaks and render each part
      return content.split(/(<br\s*\/?>)/gi).map((part, index) => {
        if (part.match(/<br\s*\/?>/gi)) {
          return <br key={index} />
        }
        return part
      })
    }
    return content
  }
  
  if (Array.isArray(content)) {
    return content.map((item, index) => (
      <span key={index}>{parseHtmlContent(item)}</span>
    ))
  }
  
  return content
}

export default function CustomPortableText({
  className,
  value,
}: {
  className?: string
  value: PortableTextBlock[]
}) {
  const components: PortableTextComponents = {
    block: {
      h1: ({children, value}) => (
        // Add an anchor to the h1
        <h1 className="group relative font-orbitron">
          {children}
          <a
            href={`#${value?._key}`}
            className="absolute left-0 top-0 bottom-0 -ml-6 flex items-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
          </a>
        </h1>
      ),
      h2: ({children, value}) => {
        // Add an anchor to the h2
        return (
          <h2 className="group relative font-orbitron">
            {children}
            <a
              href={`#${value?._key}`}
              className="absolute left-0 top-0 bottom-0 -ml-6 flex items-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
            </a>
          </h2>
        )
      },
      normal: ({children}) => (
        <p className="font-lato">
          {parseHtmlContent(children)}
        </p>
      ),
    },
    marks: {
      link: ({children, value: link}) => {
        return <ResolvedLink link={link}>{children}</ResolvedLink>
      },
    },
    types: {
      image: ({value}) => {
        if (!value?.asset) {
          return null
        }
        
        // Handle both cases: direct URL from GROQ or need to build URL
        let imageUrlString: string | null = null
        
        if (value.asset.url) {
          // Direct URL from GROQ query
          imageUrlString = value.asset.url
        } else if (value.asset._id) {
          // Try to build URL using urlForImage
          // Convert _id to _ref format if needed
          const imageWithRef = {
            ...value,
            asset: {
              ...value.asset,
              _ref: value.asset._id,
              _type: 'reference'
            }
          }
          const imageUrl = urlForImage(imageWithRef)
          imageUrlString = imageUrl?.url() || null
        } else if (value.asset._ref) {
          // Has _ref, use urlForImage
          const imageUrl = urlForImage(value)
          imageUrlString = imageUrl?.url() || null
        }
        
        if (!imageUrlString) {
          return null
        }
        
        const alt = value.alt || ''
        
        return (
          <figure className="my-4">
            <Image
              src={imageUrlString}
              alt={alt}
              width={800}
              height={600}
              className="w-full h-auto rounded-lg"
              style={{
                maxWidth: '100%',
                height: 'auto',
              }}
            />
            {alt && (
              <figcaption className="mt-2 text-sm text-gray-600 text-center">
                {alt}
              </figcaption>
            )}
          </figure>
        )
      },
    },
  }

  return (
    <div className={['', className].filter(Boolean).join(' ')}>
      <PortableText components={components} value={value} />
    </div>
  )
}
