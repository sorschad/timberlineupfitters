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
      description: 'Image used on non-brand detail pages',
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
      name: 'detailPageBgImage',
      title: 'Detail Page Background Image',
      type: 'image',
      description: 'Background image for the brand detail page',
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
              if ((context.document?.detailPageBgImage as any)?.asset?._ref && !alt) {
                return 'Required'
              }
              return true
            })
          },
        },
      ],
    }),
    defineField({
      name: 'primaryLogo',
      title: 'Primary Logo',
      type: 'image',
      description: 'Main brand logo used in headers and primary displays',
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
              if ((context.document?.primaryLogo as any)?.asset?._ref && !alt) {
                return 'Required'
              }
              return true
            })
          },
        },
        {
          name: 'width',
          type: 'number',
          title: 'Logo Width',
          description: 'Width in pixels for the logo display',
          validation: (rule) => rule.min(1).max(2000),
          initialValue: 120,
        },
        {
          name: 'height',
          type: 'number',
          title: 'Logo Height',
          description: 'Height in pixels for the logo display',
          validation: (rule) => rule.min(1).max(2000),
          initialValue: 120,
        },
      ],
    }),
    defineField({
      name: 'secondaryLogo',
      title: 'Secondary Logo',
      type: 'image',
      description: 'Alternative brand logo for different contexts',
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
              if ((context.document?.secondaryLogo as any)?.asset?._ref && !alt) {
                return 'Required'
              }
              return true
            })
          },
        },
      ],
    }),
    defineField({
      name: 'website',
      title: 'Website URL',
      type: 'url',
      description: 'Official brand website',
    }),
    defineField({
      name: 'primaryColor',
      title: 'Primary Color',
      type: 'string',
      description: 'Primary brand color (hex code, e.g., #ff0000)',
      validation: (rule) => rule.regex(/^#[0-9A-Fa-f]{6}$/, {
        name: 'hex',
        invert: true
      }).error('Please enter a valid hex color code (e.g., #ff0000)'),
    }),
    defineField({
      name: 'secondaryColor',
      title: 'Secondary Color',
      type: 'string',
      description: 'Secondary brand color (hex code, e.g., #00ff00)',
      validation: (rule) => rule.regex(/^#[0-9A-Fa-f]{6}$/, {
        name: 'hex',
        invert: true
      }).error('Please enter a valid hex color code (e.g., #00ff00)'),
    }),
    defineField({
      name: 'accentColor',
      title: 'Accent Color',
      type: 'string',
      description: 'Accent brand color (hex code, e.g., #0000ff)',
      validation: (rule) => rule.regex(/^#[0-9A-Fa-f]{6}$/, {
        name: 'hex',
        invert: true
      }).error('Please enter a valid hex color code (e.g., #0000ff)'),
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      description: 'Background brand color (hex code, e.g., #0000ff)',
      validation: (rule) => rule.regex(/^#[0-9A-Fa-f]{6}$/, {
        name: 'hex',
        invert: true
      }).error('Please enter a valid hex color code (e.g., #0000ff)'),
    }),
    defineField({
      name: 'sectionImage',
      title: 'Section Image',
      type: 'image',
      description: 'Image displayed in the brand section on the brands landing page',
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
              if ((context.document?.sectionImage as any)?.asset?._ref && !alt) {
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
    defineField({
      name: 'sidebarMenuSortOrder',
      title: 'Sidebar Menu Sort Order',
      type: 'number',
      description: 'Controls the order of brands in the sidebar mega menu. Lower numbers appear higher in the list.',
      validation: (rule) => rule.min(0).integer(),
      initialValue: 0,
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
