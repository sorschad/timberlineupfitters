import { defineType, defineField } from 'sanity'

/**
 * AdditionalOption schema. Define and edit the fields for the 'additionalOption' content type.
 * This represents optional add-ons, accessories, or upgrades that can be added to vehicles.
 */
export const additionalOption = defineType({
  name: 'additionalOption',
  title: 'Additional Option',
  type: 'document',
  icon: () => '🔧',
  fields: [
    defineField({
      name: 'name',
      title: 'Option Name',
      type: 'string',
      description: 'Name of the additional option or accessory',
      validation: (rule) => rule.required().max(255),
    }),
    
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL-friendly identifier for this option',
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
      type: 'text',
      description: 'Detailed description of the additional option',
      rows: 3,
    }),

    defineField({
      name: 'manufacturer',
      title: 'Manufacturer',
      type: 'reference',
      to: [{ type: 'manufacturer' }],
      description: 'The manufacturer of this additional option',
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'brand',
      title: 'Brand',
      type: 'reference',
      to: [{ type: 'brand' }],
      description: 'Optional: Associated brand for this option',
    }),

    defineField({
      name: 'package',
      title: 'Package',
      type: 'string',
      description: 'Optional: Package or category this option belongs to (e.g., "Performance", "Luxury", "Off-Road")',
      options: {
        list: [
          { title: 'Performance', value: 'performance' },
          { title: 'Luxury', value: 'luxury' },
          { title: 'Off-Road', value: 'offroad' },
          { title: 'Interior', value: 'interior' },
          { title: 'Exterior', value: 'exterior' },
          { title: 'Technology', value: 'technology' },
          { title: 'Safety', value: 'safety' },
          { title: 'Comfort', value: 'comfort' },
          { title: 'Utility', value: 'utility' },
          { title: 'Custom', value: 'custom' },
        ],
        layout: 'dropdown',
      },
    }),

    defineField({
      name: 'image',
      title: 'Option Image',
      type: 'image',
      description: 'Image showing the additional option',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Alternative text for accessibility',
        }),
        defineField({
          name: 'caption',
          title: 'Caption',
          type: 'string',
          description: 'Optional caption for the image',
        }),
      ],
    }),

    defineField({
      name: 'price',
      title: 'Price',
      type: 'object',
      description: 'Pricing information for this option',
      fields: [
        defineField({
          name: 'amount',
          title: 'Price Amount',
          type: 'number',
          description: 'Price in dollars',
        }),
        defineField({
          name: 'currency',
          title: 'Currency',
          type: 'string',
          initialValue: 'USD',
          options: {
            list: [
              { title: 'US Dollar', value: 'USD' },
              { title: 'Canadian Dollar', value: 'CAD' },
            ],
          },
        }),
        defineField({
          name: 'isEstimate',
          title: 'Is Estimate',
          type: 'boolean',
          description: 'Check if this is an estimated price',
          initialValue: false,
        }),
      ],
    }),

    defineField({
      name: 'availability',
      title: 'Availability',
      type: 'string',
      description: 'Availability status of this option',
      options: {
        list: [
          { title: 'In Stock', value: 'in-stock' },
          { title: 'Available Soon', value: 'available-soon' },
          { title: 'Special Order', value: 'special-order' },
          { title: 'Discontinued', value: 'discontinued' },
        ],
        layout: 'radio',
      },
      initialValue: 'in-stock',
    }),

    defineField({
      name: 'compatibleVehicles',
      title: 'Compatible Vehicles',
      type: 'array',
      description: 'List of vehicles this option is compatible with',
      of: [
        {
          type: 'reference',
          to: [{ type: 'vehicle' }],
        },
      ],
    }),

    defineField({
      name: 'features',
      title: 'Key Features',
      type: 'array',
      description: 'Key features or benefits of this option',
      of: [
        {
          type: 'string',
        },
      ],
      options: {
        layout: 'tags',
      },
    }),

    defineField({
      name: 'installation',
      title: 'Installation Information',
      type: 'object',
      description: 'Installation details for this option',
      fields: [
        defineField({
          name: 'required',
          title: 'Installation Required',
          type: 'boolean',
          description: 'Whether professional installation is required',
          initialValue: false,
        }),
        defineField({
          name: 'time',
          title: 'Installation Time',
          type: 'string',
          description: 'Estimated installation time (e.g., "2-4 hours", "1 day")',
        }),
        defineField({
          name: 'difficulty',
          title: 'Installation Difficulty',
          type: 'string',
          options: {
            list: [
              { title: 'Easy', value: 'easy' },
              { title: 'Moderate', value: 'moderate' },
              { title: 'Advanced', value: 'advanced' },
              { title: 'Professional Only', value: 'professional' },
            ],
            layout: 'radio',
          },
        }),
      ],
    }),

    defineField({
      name: 'warranty',
      title: 'Warranty Information',
      type: 'object',
      description: 'Warranty details for this option',
      fields: [
        defineField({
          name: 'duration',
          title: 'Warranty Duration',
          type: 'string',
          description: 'Warranty period (e.g., "1 year", "2 years", "Lifetime")',
        }),
        defineField({
          name: 'coverage',
          title: 'Warranty Coverage',
          type: 'text',
          description: 'What the warranty covers',
          rows: 2,
        }),
      ],
    }),

    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      description: 'Tags for categorizing and filtering this option',
      of: [
        {
          type: 'string',
        },
      ],
      options: {
        layout: 'tags',
      },
    }),

    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      description: 'Whether this option is currently available for selection',
      initialValue: true,
    }),

    defineField({
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      description: 'Order in which this option should appear in lists',
      initialValue: 0,
    }),
  ],

  preview: {
    select: {
      title: 'name',
      subtitle: 'manufacturer.name',
      media: 'image',
    },
    prepare(selection) {
      const { title, subtitle, media } = selection
      return {
        title: title || 'Untitled Option',
        subtitle: subtitle ? `by ${subtitle}` : 'No manufacturer',
        media: media,
      }
    },
  },

  orderings: [
    {
      title: 'Name A-Z',
      name: 'nameAsc',
      by: [{ field: 'name', direction: 'asc' }],
    },
    {
      title: 'Name Z-A',
      name: 'nameDesc',
      by: [{ field: 'name', direction: 'desc' }],
    },
    {
      title: 'Manufacturer',
      name: 'manufacturer',
      by: [{ field: 'manufacturer.name', direction: 'asc' }],
    },
    {
      title: 'Sort Order',
      name: 'sortOrder',
      by: [{ field: 'sortOrder', direction: 'asc' }],
    },
  ],
})
