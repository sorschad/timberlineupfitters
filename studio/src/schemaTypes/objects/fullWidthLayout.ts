import {defineField, defineType} from 'sanity'
import {MaximizeIcon} from '@sanity/icons'

/**
 * Full Width Layout - Full-width content block with optional background
 */
export const fullWidthLayout = defineType({
  name: 'fullWidthLayout',
  title: 'Full Width Layout',
  type: 'object',
  icon: MaximizeIcon,
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
      name: 'content',
      title: 'Content',
      type: 'blockContent',
      description: 'Main content area',
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
      content: 'content',
    },
    prepare({title, content}) {
      const firstBlock = content?.[0]
      const text = firstBlock?.children?.[0]?.text || 'No content'
      const preview = text.length > 50 ? `${text.substring(0, 50)}...` : text

      return {
        title: title || 'Full Width Layout',
        subtitle: preview,
      }
    },
  },
})

