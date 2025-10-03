import { defineType, defineField } from 'sanity'

export const salesRepresentative = defineType({
  name: 'salesRepresentative',
  title: 'Sales Representative',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
      validation: (Rule) => Rule.required().max(255)
    }),

    defineField({
      name: 'territoryRegion',
      title: 'Territory Region',
      type: 'string',
      description: 'e.g., Pacific Northwest, Southwest, Northeast',
      validation: (Rule) => Rule.required()
    }),

    defineField({
      name: 'territoryZipCodes',
      title: 'Territory Zip Codes',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'List of zip codes this representative covers',
      validation: (Rule) => Rule.required().min(1)
    }),

    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'string',
      validation: (Rule) => Rule.required().email()
    }),

    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'object',
      fields: [
        defineField({
          name: 'countryCode',
          title: 'Country Code',
          type: 'string',
          description: 'e.g., +1 for US/Canada',
          validation: (Rule) => Rule.required()
        }),
        defineField({
          name: 'number',
          title: 'Phone Number',
          type: 'string',
          description: 'Phone number without country code',
          validation: (Rule) => Rule.required()
        }),
        defineField({
          name: 'extension',
          title: 'Extension',
          type: 'string',
          description: 'Optional phone extension'
        })
      ],
      validation: (Rule) => Rule.required()
    }),

    defineField({
      name: 'mobile',
      title: 'Mobile Number',
      type: 'object',
      fields: [
        defineField({
          name: 'countryCode',
          title: 'Country Code',
          type: 'string',
          description: 'e.g., +1 for US/Canada',
          validation: (Rule) => Rule.required()
        }),
        defineField({
          name: 'number',
          title: 'Mobile Number',
          type: 'string',
          description: 'Mobile number without country code',
          validation: (Rule) => Rule.required()
        }),
        defineField({
          name: 'extension',
          title: 'Extension',
          type: 'string',
          description: 'Optional mobile extension'
        })
      ]
    }),

    defineField({
      name: 'fax',
      title: 'Fax Number',
      type: 'object',
      fields: [
        defineField({
          name: 'countryCode',
          title: 'Country Code',
          type: 'string',
          description: 'e.g., +1 for US/Canada'
        }),
        defineField({
          name: 'number',
          title: 'Fax Number',
          type: 'string',
          description: 'Fax number without country code'
        }),
        defineField({
          name: 'extension',
          title: 'Extension',
          type: 'string',
          description: 'Optional fax extension'
        })
      ]
    }),

    defineField({
      name: 'profileImage',
      title: 'Profile Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', type: 'string', title: 'Alt Text' })
      ]
    }),

    defineField({
      name: 'bio',
      title: 'Biography',
      type: 'text',
      description: 'Brief biography or background information'
    }),

    defineField({
      name: 'specialties',
      title: 'Specialties',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Areas of expertise or specialization',
      options: {
        list: [
          'Commercial Vehicles',
          'Fleet Sales',
          'Custom Upfitting',
          'Government Contracts',
          'Agricultural Equipment',
          'Construction Equipment',
          'Recreational Vehicles'
        ]
      }
    }),

    defineField({
      name: 'isActive',
      title: 'Active Status',
      type: 'boolean',
      description: 'Whether this representative is currently active',
      initialValue: true
    }),

    defineField({
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      description: 'Custom sort order for display',
      validation: (Rule) => Rule.integer().min(0),
      initialValue: 0
    })
  ],

  preview: {
    select: {
      title: 'name',
      subtitle: 'territoryRegion',
      media: 'profileImage'
    },
    prepare(selection) {
      const { title, subtitle, media } = selection
      return {
        title: title,
        subtitle: subtitle,
        media: media
      }
    }
  }
})
