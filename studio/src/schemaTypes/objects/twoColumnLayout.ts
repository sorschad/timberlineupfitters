import {defineField, defineType} from 'sanity'
import {ColumnsIcon} from '@sanity/icons'

/**
 * Two Column Layout - Responsive two-column layout block
 */
export const twoColumnLayout = defineType({
  name: 'twoColumnLayout',
  title: 'Two Column Layout',
  type: 'object',
  icon: ColumnsIcon,
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
      name: 'rightColumn',
      title: 'Right Column',
      type: 'blockContent',
      description: 'Content for the right column',
    }),
    defineField({
      name: 'columnRatio',
      title: 'Column Ratio',
      type: 'string',
      description: 'Width ratio between columns on desktop',
      options: {
        list: [
          {title: 'Equal (50/50)', value: 'equal'},
          {title: 'Wide Left (60/40)', value: 'wideLeft'},
          {title: 'Wide Right (40/60)', value: 'wideRight'},
        ],
        layout: 'radio',
      },
      initialValue: 'equal',
    }),
    defineField({
      name: 'reverseOnMobile',
      title: 'Reverse on Mobile',
      type: 'boolean',
      description: 'Show right column first on mobile devices',
      initialValue: false,
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
      right: 'rightColumn',
    },
    prepare({title, left, right}) {
      const leftText = left?.[0]?.children?.[0]?.text || 'Empty'
      const rightText = right?.[0]?.children?.[0]?.text || 'Empty'
      return {
        title: title || 'Two Column Layout',
        subtitle: `Left: ${leftText.substring(0, 20)}... | Right: ${rightText.substring(0, 20)}...`,
      }
    },
  },
})

