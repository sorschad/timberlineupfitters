// schemas/vehicle.ts
import { defineType, defineField, defineArrayMember } from 'sanity'

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
          name: 'engine',
          title: 'Engine Options',
          type: 'array',
          of: [defineArrayMember({
            type: 'object',
            fields: [
              defineField({ name: 'type', type: 'string', description: 'e.g., 3.5L EcoBoost V6' }),
              defineField({ name: 'horsepower', type: 'number' }),
              defineField({ name: 'torque', type: 'number' }),
              defineField({ name: 'fuelType', type: 'string', options: { list: ['Gasoline', 'Diesel', 'Hybrid', 'Electric'] } }),
              defineField({ name: 'transmission', type: 'string', description: 'e.g., 10-speed automatic' })
            ]
          })]
        }),
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
          name: 'exteriorFeatures',
          title: 'Exterior Features',
          type: 'array',
          of: [{ type: 'string' }]
        }),
        defineField({
          name: 'interiorFeatures',
          title: 'Interior Features',
          type: 'array',
          of: [{ type: 'string' }]
        }),
        defineField({
          name: 'safetyFeatures',
          title: 'Safety Features',
          type: 'array',
          of: [{ type: 'string' }]
        }),
        defineField({
          name: 'technologyFeatures',
          title: 'Technology Features',
          type: 'array',
          of: [{ type: 'string' }]
        }),
        defineField({
          name: 'performanceFeatures',
          title: 'Performance Features',
          type: 'array',
          of: [{ type: 'string' }]
        }),
        defineField({
          name: 'additionalOptions',
          title: 'Additional Options',
          type: 'array',
          of: [{ type: 'string' }]
        })
      ]
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

    defineField({
      name: 'headerVehicleImage',
      title: 'Header Vehicle Image',
      type: 'image',
      description: 'Foreground vehicle image displayed on the vehicle details page header. If not set, falls back to Cover Image.',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', type: 'string', title: 'Alt Text' })
      ]
    }),

    defineField({
      name: 'gallery',
      title: 'Image Gallery',
      type: 'array',
      of: [defineArrayMember({
        type: 'image',
        options: { hotspot: true },
        fields: [
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
                  defineField({ name: 'col', type: 'number', title: 'Columns', initialValue: 2, validation: Rule => Rule.min(1) }),
                  defineField({ name: 'row', type: 'number', title: 'Rows', initialValue: 2, validation: Rule => Rule.min(1) })
                ]
              })
            ]
          })
        ]
      })]
    }),

    defineField({
      name: 'videoTour',
      title: 'Video Tour',
      type: 'object',
      fields: [
        defineField({ name: 'youtubeUrl', type: 'url', title: 'YouTube URL' }),
        defineField({ name: 'thumbnail', type: 'image', title: 'Video Thumbnail' }),
        defineField({ name: 'description', type: 'text', title: 'Video Description' })
      ]
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