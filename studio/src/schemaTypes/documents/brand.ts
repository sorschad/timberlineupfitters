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
      name: 'slogan',
      title: 'Slogan',
      type: 'text',
      description: 'Official slogan for the brand',
    }),
    defineField({
      name: 'manufacturers',
      title: 'Associated Manufacturers',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'manufacturer'}],
        },
      ],
      description: 'Select one or more manufacturers associated with this brand',
      validation: (rule) => rule.min(1).error('At least one manufacturer must be selected'),
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
      name: 'logo',
      title: 'Brand Logo',
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
            return rule.custom((alt, context) => {
              if ((context.document?.logo as any)?.asset?._ref && !alt) {
                return 'Required'
              }
              return true
            })
          },
        },
      ],
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
  ],
  // List preview configuration. https://www.sanity.io/docs/previews-list-views
  preview: {
    select: {
      name: 'name',
      launchDate: 'launchDate',
      media: 'coverImage',
    },
    prepare({name, media, launchDate}) {
      const subtitles = [
        launchDate && `Launched: ${format(parseISO(launchDate), 'LLL d, yyyy')}`,
      ].filter(Boolean)

      return {title: name, media, subtitle: subtitles.join(' • ')}
    },
  },
})
