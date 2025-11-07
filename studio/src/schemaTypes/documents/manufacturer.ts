// schemas/manufacturer.ts
import { defineType, defineField } from 'sanity'

export const manufacturer = defineType({
  name: 'manufacturer',
  title: 'Manufacturer',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Manufacturer Name',
      type: 'string',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 255
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image'
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text'
    }),
    
    // Hero Section Fields
    defineField({
      name: 'heroImage',
      title: 'Hero Background Image',
      type: 'image',
      description: 'Full-screen background image for the hero section',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      description: 'Main heading for the hero section (defaults to manufacturer name if empty)',
      placeholder: 'e.g., Ford: Built for Every Adventure'
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'text',
      description: 'Subtitle text displayed in the hero section',
      placeholder: 'Explore our range of vehicles designed for every adventure.'
    }),
    defineField({
      name: 'heroCtaText',
      title: 'Hero CTA Button Text',
      type: 'string',
      description: 'Text for the main call-to-action button',
      initialValue: 'Explore Vehicles'
    }),

    // Vehicle Showcase Images
    defineField({
      name: 'showcaseImages',
      title: 'Vehicle Showcase Images',
      type: 'array',
      description: 'Background images for each vehicle model showcase section',
      of: [
        {
          type: 'object',
          name: 'showcaseImage',
          title: 'Showcase Image',
          fields: [
            {
              name: 'model',
              title: 'Vehicle Model',
              type: 'string',
              description: 'e.g., F-150, SuperDuty, Bronco',
              validation: (Rule) => Rule.required()
            },
            {
              name: 'image',
              title: 'Background Image',
              type: 'image',
              validation: (Rule) => Rule.required()
            },
            {
              name: 'altText',
              title: 'Alt Text',
              type: 'string',
              description: 'Alternative text for accessibility'
            }
          ],
          preview: {
            select: {
              title: 'model',
              media: 'image'
            }
          }
        }
      ]
    }),

    // Gallery Section
    defineField({
      name: 'galleryImages',
      title: 'Gallery Images',
      type: 'array',
      description: 'Images for the "In the Wild" gallery section',
      of: [
        {
          type: 'object',
          name: 'galleryImage',
          title: 'Gallery Image',
          fields: [
            {
              name: 'image',
              title: 'Image',
              type: 'image',
              validation: (Rule) => Rule.required()
            },
            {
              name: 'caption',
              title: 'Caption',
              type: 'string',
              description: 'Caption text displayed on hover',
              validation: (Rule) => Rule.required()
            },
            {
              name: 'category',
              title: 'Category',
              type: 'string',
              options: {
                list: [
                  { title: 'Adventure', value: 'adventure' },
                  { title: 'Work', value: 'work' },
                  { title: 'Lifestyle', value: 'lifestyle' }
                ]
              },
              validation: (Rule) => Rule.required()
            },
            {
              name: 'altText',
              title: 'Alt Text',
              type: 'string',
              description: 'Alternative text for accessibility'
            }
          ],
          preview: {
            select: {
              title: 'caption',
              subtitle: 'category',
              media: 'image'
            }
          }
        }
      ]
    }),

    // CTA Section
    defineField({
      name: 'ctaTitle',
      title: 'CTA Section Title',
      type: 'string',
      description: 'Main title for the call-to-action section',
      initialValue: 'Ready to Find Your [Manufacturer]?'
    }),
    defineField({
      name: 'ctaDescription',
      title: 'CTA Section Description',
      type: 'text',
      description: 'Description text for the CTA section'
    }),
    defineField({
      name: 'ctaStats',
      title: 'CTA Statistics',
      type: 'array',
      description: 'Statistics displayed in the CTA section',
      of: [
        {
          type: 'object',
          name: 'stat',
          title: 'Statistic',
          fields: [
            {
              name: 'value',
              title: 'Value',
              type: 'string',
              description: 'e.g., "15", "100%", "24/7"',
              validation: (Rule) => Rule.required()
            },
            {
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'e.g., "Available Packages", "Custom Built", "Support"',
              validation: (Rule) => Rule.required()
            }
          ],
          preview: {
            select: {
              title: 'value',
              subtitle: 'label'
            }
          }
        }
      ],
      initialValue: [
        { value: '15', label: 'Available Packages' },
        { value: '100%', label: 'Custom Built' },
        { value: '24/7', label: 'Support' }
      ]
    }),

    // Additional Links
    defineField({
      name: 'additionalLinks',
      title: 'Additional Links',
      type: 'array',
      description: 'Links displayed in the CTA section footer',
      of: [
        {
          type: 'object',
          name: 'link',
          title: 'Link',
          fields: [
            {
              name: 'text',
              title: 'Link Text',
              type: 'string',
              validation: (Rule) => Rule.required()
            },
            {
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (Rule) => Rule.required()
            }
          ],
          preview: {
            select: {
              title: 'text',
              subtitle: 'url'
            }
          }
        }
      ],
      initialValue: [
        { text: 'Financing Options', url: '/financing' },
        { text: 'Warranty Info', url: '/warranty' },
        { text: 'Service & Support', url: '/service' },
        { text: 'Accessories', url: '/accessories' }
      ]
    }),

    // SEO Fields
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      description: 'Custom title for search engines (defaults to manufacturer name if empty)'
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      description: 'Meta description for search engines'
    }),
    defineField({
      name: 'seoImage',
      title: 'SEO Image',
      type: 'image',
      description: 'Image for social media sharing'
    })
  ],
  preview: {
    select: {
      title: 'name',
      media: 'logo'
    }
  }
})