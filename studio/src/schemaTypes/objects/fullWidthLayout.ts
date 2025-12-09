import {defineField, defineType} from 'sanity'
import {DocumentIcon} from '@sanity/icons'

/**
 * Full Width Layout - Full-width content block with optional background
 */
export const fullWidthLayout = defineType({
  name: 'fullWidthLayout',
  title: 'Full Width Layout',
  type: 'object',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'Optional heading for this section',
    }),
    defineField({
      name: 'subheading',
      title: 'Subheading',
      type: 'string',
      description: 'Optional subheading',
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
    defineField({
      name: 'maxWidth',
      title: 'Content Max Width',
      type: 'string',
      description: 'Maximum width of the content container',
      options: {
        list: [
          {title: 'Full Width', value: 'full'},
          {title: 'Extra Large (7xl)', value: '7xl'},
          {title: 'Large (6xl)', value: '6xl'},
          {title: 'Medium (4xl)', value: '4xl'},
          {title: 'Small (2xl)', value: '2xl'},
        ],
        layout: 'radio',
      },
      initialValue: '4xl',
    }),
    defineField({
      name: 'backgroundStyle',
      title: 'Background Style',
      type: 'string',
      description: 'Background styling for the section',
      options: {
        list: [
          {title: 'None', value: 'none'},
          {title: 'Light Gray', value: 'light'},
          {title: 'Dark Gray', value: 'dark'},
          {title: 'Primary Color', value: 'primary'},
        ],
        layout: 'radio',
      },
      initialValue: 'none',
    }),
    defineField({
      name: 'padding',
      title: 'Padding',
      type: 'string',
      description: 'Vertical padding for the section',
      options: {
        list: [
          {title: 'None', value: 'none'},
          {title: 'Small', value: 'small'},
          {title: 'Medium', value: 'medium'},
          {title: 'Large', value: 'large'},
        ],
        layout: 'radio',
      },
      initialValue: 'medium',
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
        title: title || 'Full Width Layout',
        subtitle: `${contentType || 'richText'}: ${preview}`,
      }
    },
  },
})

