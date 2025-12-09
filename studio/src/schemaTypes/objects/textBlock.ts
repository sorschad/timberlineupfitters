import {defineField, defineType} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons'

/**
 * Text Block - Repeatable text content block for Terms, Privacy Policy, etc.
 * Supports Rich Text (WYSIWYG), Markdown, HTML, and Plain Text
 */
export const textBlock = defineType({
  name: 'textBlock',
  title: 'Text Block',
  type: 'object',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'Optional heading for this text section',
    }),
    defineField({
      name: 'contentType',
      title: 'Content Type',
      type: 'string',
      description: 'Choose how to input your content',
      options: {
        list: [
          {title: 'Rich Text (WYSIWYG)', value: 'richText'},
          {title: 'Markdown', value: 'markdown'},
          {title: 'HTML', value: 'html'},
          {title: 'Plain Text', value: 'plainText'},
        ],
        layout: 'radio',
      },
      initialValue: 'richText',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'richTextContent',
      title: 'Rich Text Content',
      type: 'blockContent',
      description: 'Rich text content with full formatting support',
      hidden: ({parent}) => parent?.contentType !== 'richText',
    }),
    defineField({
      name: 'markdownContent',
      title: 'Markdown Content',
      type: 'text',
      description: 'Content written in Markdown format',
      hidden: ({parent}) => parent?.contentType !== 'markdown',
    }),
    defineField({
      name: 'htmlContent',
      title: 'HTML Content',
      type: 'text',
      description: 'Raw HTML content (use with caution)',
      hidden: ({parent}) => parent?.contentType !== 'html',
    }),
    defineField({
      name: 'plainTextContent',
      title: 'Plain Text Content',
      type: 'text',
      description: 'Plain text content (line breaks preserved)',
      hidden: ({parent}) => parent?.contentType !== 'plainText',
    }),
  ],
  preview: {
    select: {
      title: 'heading',
      contentType: 'contentType',
      richText: 'richTextContent',
      markdown: 'markdownContent',
      html: 'htmlContent',
      plainText: 'plainTextContent',
    },
    prepare({title, contentType, richText, markdown, html, plainText}) {
      let preview = 'No content'
      if (contentType === 'richText' && richText?.[0]) {
        preview = richText[0]?.children?.[0]?.text || 'Rich text'
      } else if (contentType === 'markdown' && markdown) {
        preview = markdown.length > 50 ? `${markdown.substring(0, 50)}...` : markdown
      } else if (contentType === 'html' && html) {
        preview = html.length > 50 ? `${html.substring(0, 50)}...` : html
      } else if (contentType === 'plainText' && plainText) {
        preview = plainText.length > 50 ? `${plainText.substring(0, 50)}...` : plainText
      }

      return {
        title: title || 'Text Block',
        subtitle: `${contentType || 'richText'}: ${preview}`,
      }
    },
  },
})

