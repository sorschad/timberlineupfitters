// import {CarIcon} from '@sanity/icons'
import {format, parseISO} from 'date-fns'
import {defineField, defineType} from 'sanity'

/**
 * Brand schema. Define and edit the fields for the 'brand' content type.
 * Learn more: https://www.sanity.io/docs/schema-types
 */

export const brand = defineType({
  name: 'brand',
  title: 'Brand',
  icon: null,
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Brand Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'A slug is required for the brand to show up in the preview',
      options: {
        source: 'name',
        maxLength: 255,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'blockContent',
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      description: 'Short description for brand listings',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true,
        aiAssist: {
          imageDescriptionField: 'alt',
        },
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for SEO and accessibility.',
          validation: (rule) => {
            // Custom validation to ensure alt text is provided if the image is present. https://www.sanity.io/docs/validation
            return rule.custom((alt, context) => {
              if ((context.document?.coverImage as any)?.asset?._ref && !alt) {
                return 'Required'
              }
              return true
            })
          },
        },
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Anthem Edition', value: 'anthem'},
          {title: 'Mountain Command', value: 'alpine'},
          {title: 'Expedition Ready', value: 'timberline'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'features',
      title: 'Key Features',
      type: 'array',
      of: [{type: 'string'}],
      description: 'List of key features for this brand',
    }),
    defineField({
      name: 'launchDate',
      title: 'Launch Date',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Active', value: 'active'},
          {title: 'Coming Soon', value: 'coming-soon'},
          {title: 'Discontinued', value: 'discontinued'},
        ],
        layout: 'radio',
      },
      initialValue: 'active',
      validation: (rule) => rule.required(),
    }),
  ],
  // List preview configuration. https://www.sanity.io/docs/previews-list-views
  preview: {
    select: {
      name: 'name',
      category: 'category',
      launchDate: 'launchDate',
      media: 'coverImage',
      status: 'status',
    },
    prepare({name, media, category, launchDate, status}) {
      const subtitles = [
        category && `Category: ${category}`,
        status && `Status: ${status}`,
        launchDate && `Launched: ${format(parseISO(launchDate), 'LLL d, yyyy')}`,
      ].filter(Boolean)

      return {title: name, media, subtitle: subtitles.join(' • ')}
    },
  },
})
