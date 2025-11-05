// schemas/vehicle.ts
import { defineType, defineField, defineArrayMember } from 'sanity'
import { BulkImageUploadAction } from '../../components/BulkImageUploadAction'

export const vehicle = defineType({
  name: 'vehicle',
  title: 'Vehicle',
  type: 'document',
  fields: [
    // Basic Vehicle Information
    defineField({
      name: 'title',
      title: 'Vehicle Title',
      type: 'string',
      description: 'Description of the build + vehicle model',
      validation: (Rule) => Rule.required().max(255)
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 255
      },
      validation: (Rule) => Rule.required()
    }),

    // Inventory & Availability
    defineField({
      name: 'inventory',
      title: 'Inventory Information',
      type: 'object',
      fields: [
        defineField({
          name: 'availability',
          title: 'Availability Status',
          type: 'string',
          options: {
            list: [
              'In Stock', 'Available Soon'
            ]
          }
        }),
      ]
    }),

    defineField({
      name: 'vehicleType',
      title: 'Vehicle Type',
      type: 'string',
      options: {
        list: [
          { title: 'Truck', value: 'truck' },
          { title: 'SUV', value: 'suv' },
          { title: 'Car', value: 'car' },
          { title: 'Van', value: 'van' },
          { title: 'Utility', value: 'utility' }
        ]
      },
      initialValue: 'truck'
    }),

    // Manufacturer & Model Details
    defineField({
      name: 'manufacturer',
      title: 'Manufacturer',
      type: 'reference',
      to: [{ type: 'manufacturer' }],
      validation: (Rule) => Rule.required()
    }),

    defineField({
      name: 'model',
      title: 'Model',
      type: 'string',
      description: 'e.g., F-150, F-250, Ranger',
      validation: (Rule) => Rule.required()
    }),
    
    defineField({
      name: 'brand',
      title: 'Brand',
      type: 'string',
      description: 'e.g., Timberline, TSport, Alpine, ...',
      validation: (Rule) => Rule.required()
    }),

    defineField({
      name: 'trim',
      title: 'Trim Level',
      type: 'string',
      description: 'e.g., XL, XLT, Lariat, King Ranch, Platinum'
    }),

    defineField({
      name: 'modelYear',
      title: 'Model Year',
      type: 'number',
      validation: (Rule) => Rule.required().min(1900).max(2030)
    }),

     // Additional Content
     defineField({
      name: 'description',
      title: 'Detailed Description',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H1', value: 'h1' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'Quote', value: 'blockquote' }
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' }
          ]
        })
      ]
    }),

    defineField({
      name: 'excerpt',
      title: 'Vehicle Excerpt',
      type: 'text',
      description: 'Short 1-2 sentence summary describing the vehicle build for customers and dealerships',
      validation: (Rule) => Rule.max(500)
    }),

    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags'
      }
    }),

    defineField({
      name: 'sidebarSortOrder',
      title: 'Sidebar Sort Order',
      type: 'number',
      description: 'Custom sort order for vehicles in the sidebar mega menu. Lower numbers appear first.',
      validation: (Rule) => Rule.integer().min(0),
      initialValue: 0
    }),

    // Vehicle Specifications
    defineField({
      name: 'specifications',
      title: 'Technical Specifications',
      type: 'object',
      fields: [
        defineField({
          name: 'drivetrain',
          title: 'Drivetrain Options',
          type: 'array',
          of: [{ type: 'string' }],
          options: {
            list: [
              '2WD', '4WD', 'AWD', '4x4'
            ]
          }
        }),
        defineField({
          name: 'bedLength',
          title: 'Bed Length',
          type: 'string',
          options: {
            list: ['5.5 ft', '6.5 ft', '8 ft']
          }
        }),
        defineField({
          name: 'cabStyle',
          title: 'Cab Style',
          type: 'string',
          options: {
            list: ['Regular Cab', 'SuperCab', 'SuperCrew']
          }
        })
      ]
    }),

    // Features & Amenities
    defineField({
      name: 'features',
      title: 'Features & Amenities',
      type: 'object',
      fields: [
        defineField({
          name: 'baseFeatures',
          title: 'Base Features',
          type: 'array',
          of: [{ type: 'string' }]
        }),
        defineField({
          name: 'additionalOptions',
          title: 'Additional Options',
          type: 'array',
          description: 'Reference to Additional Option documents for this vehicle',
          of: [
            {
              type: 'reference',
              to: [{ type: 'additionalOption' }],
              options: {
                filter: 'isActive == true'
              }
            }
          ]
        })
      ]
    }),

    // Associated Vehicles
    defineField({
      name: 'associatedVehicles',
      title: 'Associated Vehicles',
      type: 'array',
      description: 'Select up to 3 related vehicles to display together',
      of: [
        {
          type: 'reference',
          to: [{ type: 'vehicle' }],
          options: {
            filter: ({ document }) => {
              // Prevent self-reference by filtering out the current document's ID
              return {
                filter: `_id != "${document._id}"`,
                params: {}
              }
            }
          }
        }
      ],
      validation: (Rule) => Rule.max(3).custom((vehicles, context) => {
        if (vehicles && vehicles.length > 3) {
          return 'Maximum 3 associated vehicles allowed'
        }
        return true
      })
    }),

    // Media Assets
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', type: 'string', title: 'Alt Text' })
      ]
    }),

    defineField({
      name: 'vehicleDetailsPageHeaderBackgroundImage',
      title: 'Vehicle Details Page Header Background Image',
      type: 'image',
      description: 'Optional background image specifically for the vehicle details page hero/header section. Falls back to Cover Image if not set.',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', type: 'string', title: 'Alt Text' })
      ]
    }),

    // Bulk Upload Helper Field
    defineField({
      name: 'bulkUploadHelper',
      title: 'Bulk Upload Images',
      type: 'object',
      description: 'Click the button below to upload multiple images at once. They will be added to the gallery below.',
      fields: [
        {
          name: 'placeholder',
          type: 'string',
          hidden: true
        }
      ],
      components: {
        input: BulkImageUploadAction
      },
      hidden: ({ document }) => !document?.gallery
    }),

    defineField({
      name: 'gallery',
      title: 'Image Gallery',
      type: 'array',
      of: [defineArrayMember({
        type: 'image',
        options: { hotspot: true },
        preview: {
          select: {
            asset: 'asset',
            alt: 'alt',
            caption: 'caption',
            isBuildCoverImage: 'isBuildCoverImage',
            isBuildTextSummaryBlock: 'isBuildTextSummaryBlock'
          },
          prepare(selection) {
            const { asset, alt, caption, isBuildCoverImage, isBuildTextSummaryBlock } = selection
            let subtitle = 'Gallery Image'
            if (isBuildCoverImage && isBuildTextSummaryBlock) {
              subtitle = 'Cover Image + Text Summary'
            } else if (isBuildCoverImage) {
              subtitle = 'Cover Image'
            } else if (isBuildTextSummaryBlock) {
              subtitle = 'Text Summary Block'
            }
            return {
              title: caption || alt || 'Gallery Image',
              subtitle: subtitle,
              media: asset
            }
          }
        },
        fields: [
          defineField({
            name: 'isBuildCoverImage',
            title: 'Is Cover Image for Build',
            type: 'boolean',
            description: 'Whether this image will be used for the build cover image to open the build gallery. When true, image will be shown on vehicle details page and clicking the image will open the build gallery.',
            initialValue: false
          }),
          defineField({
            name: 'isBuildTextSummaryBlock',
            title: 'Is Text Summary Block for Build',
            type: 'boolean',
            description: 'Whether this block will be used to display the text summary block on the build gallery expandable section.',
            initialValue: false
          }),
          defineField({
            name: 'isBuildTextSummaryContent',
            title: 'Text Summary Content',
            type: 'array',
            of: [
              defineArrayMember({
                type: 'block',
                styles: [
                  { title: 'Normal', value: 'normal' },
                  { title: 'H1', value: 'h1' },
                  { title: 'H2', value: 'h2' },
                  { title: 'H3', value: 'h3' },
                  { title: 'Quote', value: 'blockquote' },
                  { title: 'Medium', value: 'medium' },
                  { title: 'Small', value: 'small' },
                  { title: 'Extra Small', value: 'extra-small' },
                  { title: 'Tiny', value: 'tiny' }
                ],
                lists: [
                  { title: 'Bullet', value: 'bullet' },
                  { title: 'Numbered', value: 'number' }
                ]
              })
            ],
            description: 'Rich text content displayed with the build text summary block.',
            hidden: ({ parent }) => !parent?.isBuildTextSummaryBlock,
            validation: (Rule) => Rule.custom((value, context) => {
              const isSummary = (context as any)?.parent?.isBuildTextSummaryBlock
              if (isSummary) {
                return value && value.length > 0 ? true : 'Text summary content is required when marked as a Text Summary Block'
              }
              return true
            })
          }),
          defineField({ name: 'alt', type: 'string', title: 'Alt Text' }),
          defineField({ name: 'caption', type: 'string', title: 'Caption' }),
          defineField({ 
            name: 'view', 
            type: 'string', 
            title: 'Image View',
            options: {
              list: [
                'Exterior Front', 'Exterior Rear', 'Exterior Side', 'Interior Dashboard',
                'Interior Seats', 'Interior Back', 'Engine', 'Bed', 'Technology'
              ]
            }
          }),
          defineField({
            name: 'tags',
            title: 'Filter Tags',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
              list: [
                { title: 'Exterior', value: 'exterior' },
                { title: 'Audio', value: 'audio' },
                { title: 'Interior', value: 'interior' },
                { title: 'Accessories: Exterior', value: 'accessories:exterior' },
                { title: 'Accessories: Interior', value: 'accessories:interior' },
                { title: 'Performance', value: 'performance' }
              ]
            },
            description: 'Select tags to filter this image by category'
          }),

          defineField({
            name: 'gridSpan',
            title: 'Grid Layout',
            type: 'object',
            description: 'Control how this image spans the grid layout',
            fields: [
              defineField({
                name: 'mobile',
                title: 'Mobile (1 column)',
                type: 'object',
                fields: [
                  defineField({ name: 'col', type: 'number', title: 'Columns', initialValue: 1, validation: Rule => Rule.min(1) }),
                  defineField({ name: 'row', type: 'number', title: 'Rows', initialValue: 1, validation: Rule => Rule.min(1) })
                ]
              }),
              defineField({
                name: 'tablet',
                title: 'Tablet (2 columns)',
                type: 'object',
                fields: [
                  defineField({ name: 'col', type: 'number', title: 'Columns', initialValue: 1, validation: Rule => Rule.min(1) }),
                  defineField({ name: 'row', type: 'number', title: 'Rows', initialValue: 1, validation: Rule => Rule.min(1) })
                ]
              }),
              defineField({
                name: 'desktop',
                title: 'Desktop (3+ columns)',
                type: 'object',
                fields: [
                  defineField({ name: 'col', type: 'number', title: 'Columns', initialValue: 1, validation: Rule => Rule.min(1) }),
                  defineField({ name: 'row', type: 'number', title: 'Rows', initialValue: 1, validation: Rule => Rule.min(1) })
                ]
              })
            ]
          })
        ]
      })]
    }),

    // Customization Options (Based on TSportTruck's customization focus)
    defineField({
      name: 'customizationOptions',
      title: 'Customization Options',
      type: 'array',
      of: [defineArrayMember({
        type: 'object',
        fields: [
          defineField({
            name: 'category',
            title: 'Customization Category',
            type: 'string',
            options: {
              list: [
                'Wheels & Tires', 'Suspension', 'Exterior Styling', 'Interior Upgrades',
                'Performance', 'Lighting', 'Bed Accessories', 'Protection'
              ]
            }
          }),
          defineField({
            name: 'options',
            title: 'Available Options',
            type: 'array',
            of: [defineArrayMember({
              type: 'object',
              fields: [
                defineField({ name: 'name', type: 'string' }),
                defineField({ name: 'price', type: 'number' }),
                defineField({ name: 'description', type: 'text' }),
                defineField({ name: 'image', type: 'image' })
              ]
            })]
          })
        ]
      })]
    }),

    // SEO & Metadata
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'object',
      fields: [
        defineField({
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
          validation: (Rule) => Rule.max(60)
        }),
        defineField({
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          validation: (Rule) => Rule.max(160)
        }),
        defineField({
          name: 'openGraphImage',
          title: 'Open Graph Image',
          type: 'image'
        }),
        defineField({
          name: 'keywords',
          title: 'Keywords',
          type: 'array',
          of: [{ type: 'string' }]
        })
      ]
    }),

    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      initialValue: () => new Date().toISOString()
    })

  ],

  preview: {
    select: {
      title: 'title',
      manufacturer: 'manufacturer.name',
      modelYear: 'modelYear',
      media: 'coverImage'
    },
    prepare(selection) {
      const { title, manufacturer, modelYear, media } = selection
      return {
        title: title,
        subtitle: `${modelYear} • ${manufacturer || 'No manufacturer'}`,
        media: media
      }
    }
  }
})