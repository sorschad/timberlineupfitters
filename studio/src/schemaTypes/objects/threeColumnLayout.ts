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
      name: 'leftColumnContentType',
      title: 'Left Column Content Type',
      type: 'string',
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
      name: 'middleColumnContentType',
      title: 'Middle Column Content Type',
      type: 'string',
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
      name: 'middleColumnRichText',
      title: 'Middle Column - Rich Text',
      type: 'blockContent',
      hidden: ({parent}) => parent?.middleColumnContentType !== 'richText',
    }),
    defineField({
      name: 'middleColumnMarkdown',
      title: 'Middle Column - Markdown',
      type: 'text',
      hidden: ({parent}) => parent?.middleColumnContentType !== 'markdown',
    }),
    defineField({
      name: 'middleColumnHtml',
      title: 'Middle Column - HTML',
      type: 'text',
      hidden: ({parent}) => parent?.middleColumnContentType !== 'html',
    }),
    defineField({
      name: 'middleColumnPlainText',
      title: 'Middle Column - Plain Text',
      type: 'text',
      hidden: ({parent}) => parent?.middleColumnContentType !== 'plainText',
    }),
    defineField({
      name: 'rightColumnContentType',
      title: 'Right Column Content Type',
      type: 'string',
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
      middleType: 'middleColumnContentType',
      middleRich: 'middleColumnRichText',
      middleMarkdown: 'middleColumnMarkdown',
      middleHtml: 'middleColumnHtml',
      middlePlain: 'middleColumnPlainText',
      rightType: 'rightColumnContentType',
      rightRich: 'rightColumnRichText',
      rightMarkdown: 'rightColumnMarkdown',
      rightHtml: 'rightColumnHtml',
      rightPlain: 'rightColumnPlainText',
    },
    prepare({title, leftType, leftRich, leftMarkdown, leftHtml, leftPlain, middleType, middleRich, middleMarkdown, middleHtml, middlePlain, rightType, rightRich, rightMarkdown, rightHtml, rightPlain}) {
      const getText = (type: string, rich: any, markdown: string, html: string, plain: string) => {
        if (type === 'richText' && rich?.[0]) return rich[0]?.children?.[0]?.text || 'Rich text'
        if (type === 'markdown' && markdown) return markdown.substring(0, 15)
        if (type === 'html' && html) return html.substring(0, 15)
        if (type === 'plainText' && plain) return plain.substring(0, 15)
        return 'Empty'
      }
      
      return {
        title: title || 'Three Column Layout',
        subtitle: `3 columns: ${getText(leftType, leftRich, leftMarkdown, leftHtml, leftPlain)}... | ${getText(middleType, middleRich, middleMarkdown, middleHtml, middlePlain)}... | ${getText(rightType, rightRich, rightMarkdown, rightHtml, rightPlain)}...`,
      }
    },
  },
})

