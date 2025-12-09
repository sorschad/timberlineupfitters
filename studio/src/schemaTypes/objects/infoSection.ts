import {defineField, defineType} from 'sanity'
import {TextIcon} from '@sanity/icons'

/**
 * Info Section - Content section with heading and subheading
 * Supports Rich Text (WYSIWYG), Markdown, HTML, and Plain Text
 */
export const infoSection = defineType({
  name: 'infoSection',
  title: 'Info Section',
  type: 'object',
  icon: TextIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
    }),
    defineField({
      name: 'subheading',
      title: 'Subheading',
      type: 'string',
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
      subtitle: 'subheading',
    },
    prepare({title}) {
      return {
        title: title || 'Untitled Info Section',
        subtitle: 'Info Section',
      }
    },
  },
})
