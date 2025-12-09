import {defineField, defineType} from 'sanity'
import {ThLargeIcon} from '@sanity/icons'

/**
 * Three Column Layout - Responsive three-column layout block
 */
export const threeColumnLayout = defineType({
  name: 'threeColumnLayout',
  title: 'Three Column Layout',
  type: 'object',
  icon: ThLargeIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Section Heading',
      type: 'string',
      description: 'Optional heading for the entire section',
    }),
    defineField({
      name: 'leftColumn',
      title: 'Left Column',
      type: 'blockContent',
      description: 'Content for the left column',
    }),
    defineField({
      name: 'middleColumn',
      title: 'Middle Column',
      type: 'blockContent',
      description: 'Content for the middle column',
    }),
    defineField({
      name: 'rightColumn',
      title: 'Right Column',
      type: 'blockContent',
      description: 'Content for the right column',
    }),
    defineField({
      name: 'gap',
      title: 'Column Gap',
      type: 'string',
      description: 'Spacing between columns',
      options: {
        list: [
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
      left: 'leftColumn',
      middle: 'middleColumn',
      right: 'rightColumn',
    },
    prepare({title, left, middle, right}) {
      const leftText = left?.[0]?.children?.[0]?.text || 'Empty'
      const middleText = middle?.[0]?.children?.[0]?.text || 'Empty'
      const rightText = right?.[0]?.children?.[0]?.text || 'Empty'
      return {
        title: title || 'Three Column Layout',
        subtitle: `3 columns: ${leftText.substring(0, 15)}... | ${middleText.substring(0, 15)}... | ${rightText.substring(0, 15)}...`,
      }
    },
  },
})

