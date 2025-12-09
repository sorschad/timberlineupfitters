import {defineField, defineType} from 'sanity'
import {ThLargeIcon} from '@sanity/icons'

/**
 * Two Column Layout - Responsive two-column layout block
 */
export const twoColumnLayout = defineType({
  name: 'twoColumnLayout',
  title: 'Two Column Layout',
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
      name: 'leftColumnContentType',
      title: 'Left Column Content Type',
      type: 'string',
      description: 'Choose how to input left column content',
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
    }),
    defineField({
      name: 'leftColumnRichText',
      title: 'Left Column - Rich Text',
      type: 'blockContent',
      hidden: ({parent}) => parent?.leftColumnContentType !== 'richText',
    }),
    defineField({
      name: 'leftColumnMarkdown',
      title: 'Left Column - Markdown',
      type: 'text',
      hidden: ({parent}) => parent?.leftColumnContentType !== 'markdown',
    }),
    defineField({
      name: 'leftColumnHtml',
      title: 'Left Column - HTML',
      type: 'text',
      hidden: ({parent}) => parent?.leftColumnContentType !== 'html',
    }),
    defineField({
      name: 'leftColumnPlainText',
      title: 'Left Column - Plain Text',
      type: 'text',
      hidden: ({parent}) => parent?.leftColumnContentType !== 'plainText',
    }),
    defineField({
      name: 'rightColumnContentType',
      title: 'Right Column Content Type',
      type: 'string',
      description: 'Choose how to input right column content',
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
    }),
    defineField({
      name: 'rightColumnRichText',
      title: 'Right Column - Rich Text',
      type: 'blockContent',
      hidden: ({parent}) => parent?.rightColumnContentType !== 'richText',
    }),
    defineField({
      name: 'rightColumnMarkdown',
      title: 'Right Column - Markdown',
      type: 'text',
      hidden: ({parent}) => parent?.rightColumnContentType !== 'markdown',
    }),
    defineField({
      name: 'rightColumnHtml',
      title: 'Right Column - HTML',
      type: 'text',
      hidden: ({parent}) => parent?.rightColumnContentType !== 'html',
    }),
    defineField({
      name: 'rightColumnPlainText',
      title: 'Right Column - Plain Text',
      type: 'text',
      hidden: ({parent}) => parent?.rightColumnContentType !== 'plainText',
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
      leftType: 'leftColumnContentType',
      leftRich: 'leftColumnRichText',
      leftMarkdown: 'leftColumnMarkdown',
      leftHtml: 'leftColumnHtml',
      leftPlain: 'leftColumnPlainText',
      rightType: 'rightColumnContentType',
      rightRich: 'rightColumnRichText',
      rightMarkdown: 'rightColumnMarkdown',
      rightHtml: 'rightColumnHtml',
      rightPlain: 'rightColumnPlainText',
    },
    prepare({title, leftType, leftRich, leftMarkdown, leftHtml, leftPlain, rightType, rightRich, rightMarkdown, rightHtml, rightPlain}) {
      let leftText = 'Empty'
      if (leftType === 'richText' && leftRich?.[0]) {
        leftText = leftRich[0]?.children?.[0]?.text || 'Rich text'
      } else if (leftType === 'markdown' && leftMarkdown) {
        leftText = leftMarkdown.substring(0, 20)
      } else if (leftType === 'html' && leftHtml) {
        leftText = leftHtml.substring(0, 20)
      } else if (leftType === 'plainText' && leftPlain) {
        leftText = leftPlain.substring(0, 20)
      }
      
      let rightText = 'Empty'
      if (rightType === 'richText' && rightRich?.[0]) {
        rightText = rightRich[0]?.children?.[0]?.text || 'Rich text'
      } else if (rightType === 'markdown' && rightMarkdown) {
        rightText = rightMarkdown.substring(0, 20)
      } else if (rightType === 'html' && rightHtml) {
        rightText = rightHtml.substring(0, 20)
      } else if (rightType === 'plainText' && rightPlain) {
        rightText = rightPlain.substring(0, 20)
      }
      
      return {
        title: title || 'Two Column Layout',
        subtitle: `Left: ${leftText}... | Right: ${rightText}...`,
      }
    },
  },
})

