import {defineField, defineType} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons'

/**
 * Text Block - Repeatable WYSIWYG text content block for Terms, Privacy Policy, etc.
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
      name: 'content',
      title: 'Content',
      type: 'blockContent',
      validation: (Rule) => Rule.required(),
      description: 'Rich text content with full formatting support',
    }),
  ],
  preview: {
    select: {
      title: 'heading',
      content: 'content',
    },
    prepare({title, content}) {
      const firstBlock = content?.[0]
      const text = firstBlock?.children?.[0]?.text || 'No content'
      const preview = text.length > 50 ? `${text.substring(0, 50)}...` : text

      return {
        title: title || 'Text Block',
        subtitle: preview,
      }
    },
  },
})

