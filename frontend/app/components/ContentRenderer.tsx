import React from 'react'
import {type PortableTextBlock} from 'next-sanity'
import PortableText from '@/app/components/PortableText'

type ContentRendererProps = {
  contentType?: 'richText' | 'markdown' | 'html' | 'plainText'
  richTextContent?: PortableTextBlock[]
  markdownContent?: string
  htmlContent?: string
  plainTextContent?: string
  className?: string
}

/**
 * ContentRenderer - Renders content based on the content type
 * Supports Rich Text (Portable Text), Markdown, HTML, and Plain Text
 */
export default function ContentRenderer({
  contentType = 'richText',
  richTextContent,
  markdownContent,
  htmlContent,
  plainTextContent,
  className = '',
}: ContentRendererProps) {
  // Render Rich Text (Portable Text)
  if (contentType === 'richText' && richTextContent?.length) {
    return (
      <div className={className}>
        <PortableText value={richTextContent as PortableTextBlock[]} />
      </div>
    )
  }

  // Render Markdown
  if (contentType === 'markdown' && markdownContent) {
    // Simple markdown rendering without external library
    // For full markdown support, consider installing 'react-markdown' or 'marked'
    const markdownToHtml = (md: string): string => {
      let html = md
      
      // Headers
      html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>')
      html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>')
      html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>')
      
      // Bold
      html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      html = html.replace(/__(.*?)__/gim, '<strong>$1</strong>')
      
      // Italic
      html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>')
      html = html.replace(/_(.*?)_/gim, '<em>$1</em>')
      
      // Links
      html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2">$1</a>')
      
      // Line breaks
      html = html.replace(/\n\n/gim, '</p><p>')
      html = html.replace(/\n/gim, '<br />')
      
      // Wrap in paragraph if not already wrapped
      if (!html.startsWith('<')) {
        html = `<p>${html}</p>`
      }
      
      return html
    }

    const html = markdownToHtml(markdownContent)
    return (
      <div
        className={`prose prose-lg max-w-none ${className}`}
        dangerouslySetInnerHTML={{__html: html}}
      />
    )
  }

  // Render HTML
  if (contentType === 'html' && htmlContent) {
    return (
      <div
        className={`prose prose-lg max-w-none ${className}`}
        dangerouslySetInnerHTML={{__html: htmlContent}}
      />
    )
  }

  // Render Plain Text (preserve line breaks)
  if (contentType === 'plainText' && plainTextContent) {
    return (
      <div className={`whitespace-pre-wrap ${className}`}>
        {plainTextContent}
      </div>
    )
  }

  // Fallback: no content
  return null
}

